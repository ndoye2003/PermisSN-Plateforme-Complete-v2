<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SessionExamen;
use Illuminate\Http\Request;

class SessionController extends Controller
{
    public function index(Request $request)
    {
        $query = SessionExamen::with(['centre', 'salle'])
            ->where('statut', 'ouverte')
            ->where('date_session', '>=', now()->toDateString());

        if ($request->filled('centre_id')) {
            $query->where('centre_id', $request->centre_id);
        }

        if ($request->filled('categorie_permis')) {
            $cat = $request->categorie_permis;
            $query->where(function ($q) use ($cat) {
                $q->where('categorie_permis', $cat)
                  ->orWhere('categorie_permis', 'TOUS');
            });
        }

        if ($request->filled('date_session')) {
            $query->where('date_session', $request->date_session);
        }

        $sessions = $query->orderBy('date_session', 'asc')
            ->orderBy('heure_debut', 'asc')
            ->get()
            ->map(function ($session) {
                $placesReservees = $session->reservations()->where('statut', 'confirmee')->count();
                $placesRestantes = max(0, $session->capacite_max - $placesReservees);

                return [
                    'id' => $session->id,
                    'centre_id' => $session->centre_id,
                    'centre_nom' => $session->centre->nom,
                    'centre_ville' => $session->centre->ville,
                    'centre_adresse' => $session->centre->adresse,
                    'salle_id' => $session->salle_id,
                    'salle_nom' => $session->salle->nom,
                    'categorie_permis' => $session->categorie_permis,
                    'date_session' => $session->date_session->format('Y-m-d'),
                    'heure_debut' => substr($session->heure_debut, 0, 5),
                    'heure_fin' => substr($session->heure_fin, 0, 5),
                    'capacite_max' => $session->capacite_max,
                    'places_reservees' => $placesReservees,
                    'places_restantes' => $placesRestantes,
                    'est_pleine' => $placesRestantes <= 0,
                    'statut' => $session->statut,
                ];
            });

        return response()->json($sessions);
    }

    public function show($id)
    {
        $session = SessionExamen::with(['centre', 'salle', 'reservations.candidat.user'])->findOrFail($id);
        $placesReservees = $session->reservations()->where('statut', 'confirmee')->count();

        return response()->json([
            'session' => $session,
            'places_reservees' => $placesReservees,
            'places_restantes' => max(0, $session->capacite_max - $placesReservees),
        ]);
    }
}
