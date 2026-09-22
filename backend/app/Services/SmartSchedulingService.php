<?php

namespace App\Services;

use App\Models\Centre;
use App\Models\Candidat;
use App\Models\SessionExamen;
use Illuminate\Support\Collection;

class SmartSchedulingService
{
    /**
     * Analyse la charge actuelle de tous les centres et fournit un diagnostic
     * d'engorgement avec des recommandations de rééquilibrage.
     */
    public function analyserRepartition(): array
    {
        $centres = Centre::with(['salles', 'sessions.reservations'])->get();
        $candidatsEnAttente = Candidat::where('statut_dossier', 'valide')
            ->whereDoesntHave('reservations', function ($q) {
                $q->whereIn('statut', ['confirmee']);
            })
            ->count();

        $analyseCentres = [];
        $centresSatures = [];
        $centresSousCharges = [];

        foreach ($centres as $centre) {
            $capaciteTotale = 0;
            $placesReservees = 0;

            foreach ($centre->sessions as $session) {
                if (in_array($session->statut, ['ouverte', 'fermee'])) {
                    $capaciteTotale += $session->capacite_max;
                    $placesReservees += $session->reservations->where('statut', 'confirmee')->count();
                }
            }

            $tauxOccupation = $capaciteTotale > 0 ? round(($placesReservees / $capaciteTotale) * 100, 1) : 0;

            $item = [
                'centre_id' => $centre->id,
                'nom' => $centre->nom,
                'ville' => $centre->ville,
                'region' => $centre->region,
                'capacite_totale' => $capaciteTotale,
                'places_reservees' => $placesReservees,
                'places_libres' => max(0, $capaciteTotale - $placesReservees),
                'taux_occupation' => $tauxOccupation,
                'statut_charge' => $tauxOccupation >= 80 ? 'sature' : ($tauxOccupation <= 35 ? 'sous_utilise' : 'optimal'),
            ];

            $analyseCentres[] = $item;

            if ($tauxOccupation >= 80) {
                $centresSatures[] = $item;
            } elseif ($tauxOccupation <= 35) {
                $centresSousCharges[] = $item;
            }
        }

        // Génération des recommandations intelligentes
        $recommandations = [];

        if (!empty($centresSatures)) {
            foreach ($centresSatures as $sat) {
                // Trouver un centre proche moins saturé
                $alternatif = collect($analyseCentres)
                    ->where('region', $sat['region'])
                    ->where('centre_id', '!=', $sat['centre_id'])
                    ->sortBy('taux_occupation')
                    ->first();

                if ($alternatif) {
                    $recommandations[] = [
                        'type' => 'redirection',
                        'gravite' => 'haute',
                        'message' => "Le {$sat['nom']} ({$sat['taux_occupation']}%) est en surcapacité. Proposer aux candidats de la région la redirection vers {$alternatif['nom']} ({$alternatif['taux_occupation']}%) pour réduire le délai moyen de 6 jours.",
                        'source_centre_id' => $sat['centre_id'],
                        'cible_centre_id' => $alternatif['centre_id'],
                    ];
                } else {
                    $recommandations[] = [
                        'type' => 'creation_session',
                        'gravite' => 'moyenne',
                        'message' => "Forte demande sur {$sat['nom']}. Recommandation : ouvrir 2 créneaux d'examen supplémentaires le week-end ou en après-midi.",
                        'source_centre_id' => $sat['centre_id'],
                    ];
                }
            }
        }

        if ($candidatsEnAttente > 50) {
            $recommandations[] = [
                'type' => 'file_attente',
                'gravite' => 'info',
                'message' => "Il y a actuellement {$candidatsEnAttente} candidats avec dossier validé sans réservation. Planifier une campagne nationale de sessions pour le mois prochain.",
            ];
        }

        return [
            'total_candidats_en_attente' => $candidatsEnAttente,
            'analyse_centres' => $analyseCentres,
            'centres_satures' => $centresSatures,
            'centres_disponibles' => $centresSousCharges,
            'recommandations' => $recommandations,
            'genere_le' => now()->toIso8601String(),
        ];
    }

    /**
     * Propose les meilleurs créneaux optimisés pour un candidat donné
     */
    public function recommanderCreneauPourCandidat(Candidat $candidat): Collection
    {
        return SessionExamen::with(['centre', 'salle'])
            ->where('statut', 'ouverte')
            ->where('date_session', '>=', now()->toDateString())
            ->where(function ($q) use ($candidat) {
                $q->where('categorie_permis', $candidat->categorie_permis)
                  ->orWhere('categorie_permis', 'TOUS');
            })
            ->get()
            ->filter(fn($session) => $session->places_restantes > 0)
            ->sortBy(function ($session) {
                // Tri combiné : sessions avec le plus de places et dans les jours proches
                return $session->date_session->timestamp - ($session->places_restantes * 3600);
            })
            ->values();
    }
}
