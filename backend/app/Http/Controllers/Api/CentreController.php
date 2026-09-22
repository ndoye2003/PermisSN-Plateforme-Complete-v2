<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Centre;
use Illuminate\Http\Request;

class CentreController extends Controller
{
    public function index(Request $request)
    {
        $query = Centre::with(['salles'])->where('statut', 'actif');

        if ($request->has('region') && !empty($request->region)) {
            $query->where('region', $request->region);
        }

        if ($request->has('ville') && !empty($request->ville)) {
            $query->where('ville', 'like', "%{$request->ville}%");
        }

        $centres = $query->get()->map(function ($centre) {
            $prochainesSessions = $centre->sessions()
                ->where('statut', 'ouverte')
                ->where('date_session', '>=', now()->toDateString())
                ->count();

            return array_merge($centre->toArray(), [
                'nombre_salles' => $centre->salles->count(),
                'prochaines_sessions_ouvertes' => $prochainesSessions,
            ]);
        });

        return response()->json($centres);
    }

    public function show($id)
    {
        $centre = Centre::with([
            'salles',
            'sessions' => function ($q) {
                $q->where('date_session', '>=', now()->toDateString())
                  ->where('statut', 'ouverte')
                  ->with('salle')
                  ->orderBy('date_session', 'asc');
            }
        ])->findOrFail($id);

        return response()->json($centre);
    }
}
