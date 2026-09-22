<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Presence;
use App\Models\Resultat;
use App\Models\SessionExamen;
use Illuminate\Http\Request;

class AgentController extends Controller
{
    /**
     * Liste des sessions du jour et des prochains jours pour l'agent
     */
    public function getSessions(Request $request)
    {
        $date = $request->get('date', now()->toDateString());

        $sessions = SessionExamen::with(['centre', 'salle'])
            ->where('date_session', '>=', $date)
            ->orderBy('date_session', 'asc')
            ->orderBy('heure_debut', 'asc')
            ->get()
            ->map(function ($session) {
                $totalInscrits = $session->reservations()->where('statut', 'confirmee')->count();
                $presencesCount = Presence::whereIn('reservation_id', $session->reservations()->pluck('id'))
                    ->where('statut', 'present')
                    ->count();

                return [
                    'id' => $session->id,
                    'centre_nom' => $session->centre->nom,
                    'salle_nom' => $session->salle->nom,
                    'categorie_permis' => $session->categorie_permis,
                    'date_session' => $session->date_session->format('Y-m-d'),
                    'heure_debut' => substr($session->heure_debut, 0, 5),
                    'heure_fin' => substr($session->heure_fin, 0, 5),
                    'capacite_max' => $session->capacite_max,
                    'total_inscrits' => $totalInscrits,
                    'total_presents' => $presencesCount,
                    'statut' => $session->statut,
                ];
            });

        return response()->json($sessions);
    }

    /**
     * Liste d'émargement d'une session (candidats convoqués)
     */
    public function getSessionCandidates($sessionId)
    {
        $session = SessionExamen::with(['centre', 'salle'])->findOrFail($sessionId);

        $reservations = Reservation::with([
            'candidat.user',
            'presence',
            'resultat'
        ])
        ->where('session_id', $sessionId)
        ->whereIn('statut', ['confirmee', 'terminee'])
        ->get();

        return response()->json([
            'session' => $session,
            'candidats' => $reservations,
        ]);
    }

    /**
     * Scan et vérification sécurisée du QR Code
     */
    public function scanQrCode(Request $request)
    {
        $request->validate([
            'qr_token' => 'required|string',
            'session_id' => 'nullable|exists:sessions,id',
        ]);

        $agent = $request->user();
        $token = trim($request->qr_token);

        $reservation = Reservation::with([
            'candidat.user',
            'session.centre',
            'session.salle',
            'presence',
            'resultat'
        ])->where('qr_token', $token)->first();

        if (!$reservation) {
            return response()->json([
                'success' => false,
                'code' => 'NOT_FOUND',
                'message' => 'QR Code invalide ou convocation inconnue dans le système national.',
            ], 404);
        }

        if ($reservation->statut === 'annulee') {
            return response()->json([
                'success' => false,
                'code' => 'CANCELLED',
                'message' => 'Cette réservation a été annulée par le candidat ou l\'administration.',
            ], 422);
        }

        // Vérification si déjà émargé / présent
        if ($reservation->presence) {
            return response()->json([
                'success' => false,
                'code' => 'ALREADY_SCANNED',
                'message' => 'ATTENTION : Ce candidat a déjà été émargé à ' . substr($reservation->presence->heure_scan, 0, 5) . '.',
                'presence' => $reservation->presence,
                'candidat' => $reservation->candidat,
            ], 409);
        }

        // Enregistrement de la présence
        $presence = Presence::create([
            'reservation_id' => $reservation->id,
            'agent_id' => $agent->id,
            'date_scan' => now()->toDateString(),
            'heure_scan' => now()->toTimeString(),
            'statut' => 'present',
            'remarques' => 'Scan QR Code valide à l\'accueil.',
        ]);

        return response()->json([
            'success' => true,
            'code' => 'VALIDATED',
            'message' => 'Présence validée avec succès !',
            'reservation' => $reservation->fresh('presence'),
            'candidat' => $reservation->candidat,
            'presence' => $presence,
        ]);
    }

    /**
     * Saisie ou modification du résultat d'examen
     */
    public function saveResultat(Request $request)
    {
        $request->validate([
            'reservation_id' => 'required|exists:reservations,id',
            'score' => 'required|integer|min:0|max:40',
            'observations' => 'nullable|string',
        ]);

        $reservation = Reservation::findOrFail($request->reservation_id);
        $score = (int) $request->score;
        // Au Sénégal, le seuil d'admission au code est de 35/40 (soit 5 fautes max autorisées)
        $statut = $score >= 35 ? 'admis' : 'ajourne';

        $resultat = Resultat::updateOrCreate(
            ['reservation_id' => $reservation->id],
            [
                'candidat_id' => $reservation->candidat_id,
                'session_id' => $reservation->session_id,
                'score' => $score,
                'total_points' => 40,
                'statut' => $statut,
                'observations' => $request->observations ?? ($statut === 'admis' ? 'Candidat admis avec succès à l\'épreuve théorique.' : 'Score insuffisant. Nouvelle présentation requise.'),
                'date_resultat' => now(),
            ]
        );

        $reservation->update(['statut' => 'terminee']);

        return response()->json([
            'message' => 'Résultat enregistré avec succès',
            'resultat' => $resultat->load('candidat.user'),
        ]);
    }
}
