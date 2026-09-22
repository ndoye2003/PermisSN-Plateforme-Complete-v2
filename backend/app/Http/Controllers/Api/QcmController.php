<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Question;
use App\Models\Reponse;
use App\Models\Entrainement;
use App\Models\Candidat;
use Illuminate\Http\Request;

class QcmController extends Controller
{
    /**
     * Récupère une série de questions pour l'entraînement au Code
     */
    public function getQuestions(Request $request)
    {
        $theme = $request->get('theme');
        $limit = (int) $request->get('limit', 20);

        $query = Question::with(['reponses' => function ($q) {
            $q->select('id', 'question_id', 'texte')->inRandomOrder();
        }]);

        if ($theme && in_array($theme, ['signalisation', 'priorites', 'regles', 'securite_vitesse'])) {
            $query->where('theme', $theme);
        }

        $questions = $query->inRandomOrder()->take($limit)->get();

        return response()->json($questions);
    }

    /**
     * Corrige le test d'entraînement, calcule les scores par thème et fournit la recommandation
     */
    public function submitTest(Request $request)
    {
        $request->validate([
            'reponses' => 'required|array', // [question_id => reponse_id]
        ]);

        $user = $request->user();
        $candidat = Candidat::where('user_id', $user->id)->first();

        $userAnswers = $request->reponses;
        $questionIds = array_keys($userAnswers);

        $questions = Question::with('reponses')->whereIn('id', $questionIds)->get();

        $scoreGlobal = 0;
        $totalQuestions = count($questions);
        $themeStats = [
            'signalisation' => ['total' => 0, 'correct' => 0, 'score' => 0],
            'priorites' => ['total' => 0, 'correct' => 0, 'score' => 0],
            'regles' => ['total' => 0, 'correct' => 0, 'score' => 0],
            'securite_vitesse' => ['total' => 0, 'correct' => 0, 'score' => 0],
        ];

        $details = [];

        foreach ($questions as $q) {
            $theme = $q->theme;
            $themeStats[$theme]['total']++;

            $bonneReponse = $q->reponses->where('est_correcte', true)->first();
            $userReponseId = $userAnswers[$q->id] ?? null;

            $estCorrect = $bonneReponse && $bonneReponse->id == $userReponseId;

            if ($estCorrect) {
                $scoreGlobal++;
                $themeStats[$theme]['correct']++;
            }

            $details[] = [
                'question_id' => $q->id,
                'intitule' => $q->intitule,
                'theme' => $theme,
                'est_correct' => $estCorrect,
                'bonne_reponse' => $bonneReponse ? $bonneReponse->texte : '',
                'explication' => $q->explication,
            ];
        }

        // Calcul des pourcentages par thème
        $faibleScore = 100;
        $themeFaible = null;

        foreach ($themeStats as $tName => &$data) {
            if ($data['total'] > 0) {
                $data['score'] = round(($data['correct'] / $data['total']) * 100);
                if ($data['score'] < $faibleScore) {
                    $faibleScore = $data['score'];
                    $themeFaible = $tName;
                }
            } else {
                $data['score'] = 100;
            }
        }

        // Formuler la recommandation pédagogique
        $labelsThemes = [
            'signalisation' => 'la Signalisation Routière',
            'priorites' => 'les Règles de Priorité',
            'regles' => 'les Règles Générales de Circulation',
            'securite_vitesse' => 'la Sécurité et la Vitesse',
        ];

        $nomTheme = $labelsThemes[$themeFaible] ?? 'les règles générales';
        $pourcentageGlobal = $totalQuestions > 0 ? round(($scoreGlobal / $totalQuestions) * 100) : 0;

        if ($pourcentageGlobal >= 88) {
            $recommandation = "Excellent niveau ({$pourcentageGlobal}%) ! Vous êtes fin prêt pour l'examen officiel du Code. Continuez à maintenir vos acquis sur {$nomTheme}.";
        } elseif ($pourcentageGlobal >= 70) {
            $recommandation = "Bon score ({$pourcentageGlobal}%), mais nous vous recommandons vivement d'approfondir {$nomTheme} (score : {$faibleScore}%) avant votre session officielle.";
        } else {
            $recommandation = "Score insuffisant ({$pourcentageGlobal}%). Vous devez réviser en priorité {$nomTheme} (score : {$faibleScore}%) et refaire au moins 3 séries de tests complets.";
        }

        // Sauvegarde de l'entraînement si connecté en candidat
        if ($candidat) {
            Entrainement::create([
                'candidat_id' => $candidat->id,
                'score_global' => $scoreGlobal,
                'total_questions' => $totalQuestions,
                'details_themes' => $themeStats,
                'recommandation' => $recommandation,
            ]);
        }

        return response()->json([
            'score_global' => $scoreGlobal,
            'total_questions' => $totalQuestions,
            'pourcentage_global' => $pourcentageGlobal,
            'theme_stats' => $themeStats,
            'recommandation' => $recommandation,
            'details' => $details,
        ]);
    }
}
