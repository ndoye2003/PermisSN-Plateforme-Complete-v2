<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Candidat;
use App\Models\Document;
use App\Services\QrCodeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CandidatController extends Controller
{
    public function getProfile(Request $request)
    {
        $user = $request->user();
        $candidat = Candidat::with([
            'user',
            'documents',
            'reservations.session.centre',
            'reservations.session.salle',
            'reservations.presence',
            'reservations.resultat',
            'resultats.session.centre',
            'entrainements',
        ])->where('user_id', $user->id)->firstOrFail();

        // Si une réservation active existe, générer le QR Code SVG / Data URI
        $activeReservation = $candidat->reservations
            ->where('statut', 'confirmee')
            ->sortByDesc('id')
            ->first();

        $qrDataUri = null;
        if ($activeReservation) {
            $qrDataUri = QrCodeService::generateDataUri($activeReservation->qr_token, 200);
        }

        return response()->json([
            'candidat' => $candidat,
            'active_reservation' => $activeReservation,
            'qr_data_uri' => $qrDataUri,
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $candidat = Candidat::where('user_id', $user->id)->firstOrFail();

        $validated = $request->validate([
            'telephone' => 'required|string|max:20',
            'nin' => 'required|string|max:30',
            'date_naissance' => 'required|date',
            'lieu_naissance' => 'required|string|max:100',
            'adresse' => 'required|string|max:255',
            'categorie_permis' => 'required|in:A,B,C,D',
        ]);

        $candidat->update($validated);

        return response()->json([
            'message' => 'Profil mis à jour avec succès',
            'candidat' => $candidat,
        ]);
    }

    public function uploadDocument(Request $request)
    {
        $user = $request->user();
        $candidat = Candidat::where('user_id', $user->id)->firstOrFail();

        $request->validate([
            'type_document' => 'required|in:cni,certificat_medical,photo_identite,quittance',
            'fichier' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120', // Max 5MB
        ]);

        $file = $request->file('fichier');
        $originalName = $file->getClientOriginalName();
        $filename = time() . '_' . $request->type_document . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs("documents/{$candidat->id}", $filename, 'public');

        // Mettre à jour ou créer le document
        $document = Document::updateOrCreate(
            [
                'candidat_id' => $candidat->id,
                'type_document' => $request->type_document,
            ],
            [
                'nom_original' => $originalName,
                'fichier_path' => $path,
                'statut' => 'en_attente',
                'motif_rejet' => null,
            ]
        );

        // Si CNI et Certificat Médical sont fournis, le dossier passe en attente de validation
        $typesFournis = Document::where('candidat_id', $candidat->id)->pluck('type_document')->toArray();
        if (in_array('cni', $typesFournis) && in_array('certificat_medical', $typesFournis)) {
            if ($candidat->statut_dossier === 'incomplet') {
                $candidat->update(['statut_dossier' => 'en_attente']);
            }
        }

        return response()->json([
            'message' => 'Document téléversé avec succès',
            'document' => $document,
            'statut_dossier' => $candidat->fresh()->statut_dossier,
        ]);
    }
}
