<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Candidat;
use App\Models\Document;
use App\Models\Centre;
use App\Models\Salle;
use App\Models\SessionExamen;
use App\Models\Reservation;
use App\Models\Presence;
use App\Models\Resultat;
use App\Services\SmartSchedulingService;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Statistiques globales pour le tableau de bord décisionnel
     */
    public function getStats()
    {
        $totalCandidats = Candidat::count();
        $candidatsValides = Candidat::where('statut_dossier', 'valide')->count();
        $candidatsEnAttente = Candidat::where('statut_dossier', 'en_attente')->count();

        $totalSessions = SessionExamen::count();
        $sessionsOuvertes = SessionExamen::where('statut', 'ouverte')->count();

        $totalReservations = Reservation::where('statut', '!=', 'annulee')->count();
        $totalPresents = Presence::where('statut', 'present')->count();
        $totalAbsents = Presence::where('statut', 'absent')->count();

        $totalResultats = Resultat::count();
        $totalAdmis = Resultat::where('statut', 'admis')->count();
        $totalAjournes = Resultat::where('statut', 'ajourne')->count();

        $tauxReussite = $totalResultats > 0 ? round(($totalAdmis / $totalResultats) * 100, 1) : 0;
        $tauxPresence = ($totalPresents + $totalAbsents) > 0 ? round(($totalPresents / ($totalPresents + $totalAbsents)) * 100, 1) : 100;

        // Répartition des réservations par centre
        $repartitionCentres = Centre::withCount(['sessions as total_reservations' => function ($q) {
            $q->join('reservations', 'sessions.id', '=', 'reservations.session_id')
              ->where('reservations.statut', '!=', 'annulee');
        }])->get()->map(function ($c) {
            return [
                'nom' => $c->nom,
                'ville' => $c->ville,
                'total' => $c->total_reservations,
            ];
        });

        // Répartition par catégorie de permis
        $repartitionCategories = Candidat::selectRaw('categorie_permis, count(*) as total')
            ->groupBy('categorie_permis')
            ->get();

        return response()->json([
            'kpis' => [
                'total_candidats' => $totalCandidats,
                'candidats_valides' => $candidatsValides,
                'candidats_en_attente' => $candidatsEnAttente,
                'total_sessions' => $totalSessions,
                'sessions_ouvertes' => $sessionsOuvertes,
                'total_reservations' => $totalReservations,
                'total_presents' => $totalPresents,
                'total_admis' => $totalAdmis,
                'total_ajournes' => $totalAjournes,
                'taux_reussite' => $tauxReussite,
                'taux_presence' => $tauxPresence,
            ],
            'repartition_centres' => $repartitionCentres,
            'repartition_categories' => $repartitionCategories,
        ]);
    }

    /**
     * Liste des candidats avec filtres pour modération des dossiers
     */
    public function getCandidats(Request $request)
    {
        $query = Candidat::with(['user', 'documents', 'reservations.session.centre']);

        if ($request->filled('statut')) {
            $query->where('statut_dossier', $request->statut);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('numero_candidat', 'like', "%{$search}%")
                  ->orWhere('telephone', 'like', "%{$search}%")
                  ->orWhere('nin', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($u) use ($search) {
                      $u->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        return response()->json($query->orderByDesc('id')->get());
    }

    /**
     * Validation ou rejet d'un dossier candidat
     */
    public function validerDossier(Request $request, $id)
    {
        $request->validate([
            'statut' => 'required|in:valide,rejete',
            'motif_rejet' => 'nullable|string',
        ]);

        $candidat = Candidat::findOrFail($id);
        $candidat->update([
            'statut_dossier' => $request->statut,
            'motif_rejet' => $request->statut === 'rejete' ? $request->motif_rejet : null,
        ]);

        // Mise à jour de l'état des documents associés
        if ($request->statut === 'valide') {
            Document::where('candidat_id', $candidat->id)->update(['statut' => 'valide']);
        }

        return response()->json([
            'message' => $request->statut === 'valide' ? 'Dossier candidat validé avec succès. Le candidat peut désormais réserver.' : 'Dossier rejeté.',
            'candidat' => $candidat->load(['user', 'documents']),
        ]);
    }

    /**
     * Création d'une nouvelle session d'examen
     */
    public function createSession(Request $request)
    {
        $validated = $request->validate([
            'centre_id' => 'required|exists:centres,id',
            'salle_id' => 'required|exists:salles,id',
            'categorie_permis' => 'required|in:A,B,C,D,TOUS',
            'date_session' => 'required|date|after_or_equal:today',
            'heure_debut' => 'required',
            'heure_fin' => 'required',
            'capacite_max' => 'required|integer|min:1',
        ]);

        $session = SessionExamen::create(array_merge($validated, ['statut' => 'ouverte']));

        return response()->json([
            'message' => 'Session créée avec succès',
            'session' => $session->load(['centre', 'salle']),
        ], 201);
    }

    /**
     * Analyse et recommandations Smart Scheduling
     */
    public function getSmartScheduling(SmartSchedulingService $smartService)
    {
        $result = $smartService->analyserRepartition();
        return response()->json($result);
    }
}
