<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Candidat;
use App\Models\SessionExamen;
use App\Models\Reservation;
use App\Services\QrCodeService;
use App\Services\PdfConvocationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReservationController extends Controller
{
    /**
     * Crée une réservation selon les 8 règles métier strictes du cahier des charges
     */
    public function store(Request $request)
    {
        $request->validate([
            'session_id' => 'required|exists:sessions,id',
        ]);

        $user = $request->user();
        
        // Règle 1 : Le candidat existe
        $candidat = Candidat::where('user_id', $user->id)->first();
        if (!$candidat) {
            return response()->json(['message' => 'Profil candidat introuvable.'], 404);
        }

        // Règle 2 : Le dossier doit être validé par l'administration
        if ($candidat->statut_dossier !== 'valide') {
            return response()->json([
                'message' => 'Votre dossier administratif doit être préalablement validé par l\'administration avant de réserver un créneau.',
                'statut_dossier' => $candidat->statut_dossier,
            ], 422);
        }

        // Vérification : Pas de réservation active déjà en cours
        $dejaReserve = Reservation::where('candidat_id', $candidat->id)
            ->where('statut', 'confirmee')
            ->exists();

        if ($dejaReserve) {
            return response()->json([
                'message' => 'Vous disposez déjà d\'une réservation active. Vous ne pouvez pas réserver plusieurs sessions simultanément.'
            ], 422);
        }

        // Transaction avec verrouillage pessimiste pour éviter les surréservations concurrentes
        return DB::transaction(function () use ($request, $candidat) {
            $session = SessionExamen::lockForUpdate()->find($request->session_id);

            // Règle 4 : La session est ouverte
            if ($session->statut !== 'ouverte') {
                return response()->json(['message' => 'Cette session n\'est plus ouverte aux réservations.'], 422);
            }

            // Règle 3 : La catégorie de permis est compatible
            if ($session->categorie_permis !== 'TOUS' && $session->categorie_permis !== $candidat->categorie_permis) {
                return response()->json([
                    'message' => "Cette session est réservée à la catégorie {$session->categorie_permis}. Votre dossier est pour la catégorie {$candidat->categorie_permis}."
                ], 422);
            }

            // Règle 5 : Des places sont disponibles
            $reservees = Reservation::where('session_id', $session->id)
                ->where('statut', 'confirmee')
                ->count();

            if ($reservees >= $session->capacite_max) {
                return response()->json(['message' => 'Désolé, cette session est désormais complète.'], 422);
            }

            // Règle 6 & 8 : La réservation est créée avec QR code token
            $numeroReservation = Reservation::genererNumeroReservation();
            $qrToken = Reservation::genererQrToken($candidat->id, $session->id);

            $reservation = Reservation::create([
                'candidat_id' => $candidat->id,
                'session_id' => $session->id,
                'numero_reservation' => $numeroReservation,
                'qr_token' => $qrToken,
                'statut' => 'confirmee',
                'date_reservation' => now(),
            ]);

            // Si la session atteint sa capacité maximale, on peut mettre son statut à fermee
            if ($reservees + 1 >= $session->capacite_max) {
                $session->update(['statut' => 'fermee']);
            }

            // Règle 7 : Données de la convocation générées
            $reservation->load(['candidat.user', 'session.centre', 'session.salle']);
            $qrDataUri = QrCodeService::generateDataUri($reservation->qr_token, 200);

            return response()->json([
                'message' => 'Votre session a été réservée avec succès ! Votre convocation avec QR Code est disponible.',
                'reservation' => $reservation,
                'qr_data_uri' => $qrDataUri,
            ], 201);
        });
    }

    public function getActive(Request $request)
    {
        $user = $request->user();
        $candidat = Candidat::where('user_id', $user->id)->firstOrFail();

        $reservation = Reservation::with(['candidat.user', 'session.centre', 'session.salle', 'presence', 'resultat'])
            ->where('candidat_id', $candidat->id)
            ->where('statut', 'confirmee')
            ->latest('id')
            ->first();

        if (!$reservation) {
            return response()->json(['reservation' => null]);
        }

        $qrDataUri = QrCodeService::generateDataUri($reservation->qr_token, 200);

        return response()->json([
            'reservation' => $reservation,
            'qr_data_uri' => $qrDataUri,
        ]);
    }

    public function cancel(Request $request, $id)
    {
        $user = $request->user();
        $candidat = Candidat::where('user_id', $user->id)->firstOrFail();

        $reservation = Reservation::where('id', $id)
            ->where('candidat_id', $candidat->id)
            ->where('statut', 'confirmee')
            ->firstOrFail();

        $reservation->update(['statut' => 'annulee']);

        // Ré-ouvrir la session si elle était fermée pour cause de capacité
        $session = $reservation->session;
        if ($session->statut === 'fermee') {
            $session->update(['statut' => 'ouverte']);
        }

        return response()->json(['message' => 'Votre réservation a été annulée.']);
    }

    public function getConvocationHtml($id)
    {
        $reservation = Reservation::with(['candidat.user', 'session.centre', 'session.salle'])
            ->findOrFail($id);

        $html = PdfConvocationService::generateHtml($reservation);

        return response($html)->header('Content-Type', 'text/html; charset=utf-8');
    }
}
