<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Candidat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'telephone' => 'required|string|max:20',
            'nin' => 'nullable|string|max:30',
            'date_naissance' => 'nullable|date',
            'lieu_naissance' => 'nullable|string|max:100',
            'adresse' => 'nullable|string',
            'categorie_permis' => 'required|in:A,B,C,D',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'identifiant' => 'CND-' . now()->format('Y') . '-' . str_pad((string)(User::where('role','candidat')->count()+1), 5, '0', STR_PAD_LEFT),
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'candidat',
            'is_active' => true,
        ]);

        $candidat = Candidat::create([
            'user_id' => $user->id,
            'numero_candidat' => Candidat::genererNumeroCandidat(),
            'telephone' => $validated['telephone'],
            'nin' => $validated['nin'] ?? null,
            'date_naissance' => $validated['date_naissance'] ?? null,
            'lieu_naissance' => $validated['lieu_naissance'] ?? null,
            'adresse' => $validated['adresse'] ?? null,
            'categorie_permis' => $validated['categorie_permis'],
            'statut_dossier' => 'incomplet',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Inscription réussie',
            'token' => $token,
            'user' => $user->load('candidat'),
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'identifiant' => 'nullable|string|required_without:email',
            'email' => 'nullable|email|required_without:identifiant',
            'password' => 'required',
        ]);

        $login = $request->identifiant ?: $request->email;
        $user = User::where('identifiant', $login)->orWhere('email', $login)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Identifiants incorrects.'],
            ]);
        }

        if (!$user->is_active) {
            return response()->json(['message' => 'Ce compte a été suspendu.'], 403);
        }

        $user->tokens()->delete(); // Invalidates previous tokens
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie',
            'token' => $token,
            'user' => $user->load(['candidat.reservations.session.centre', 'candidat.resultats']),
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user()->load([
            'candidat.documents',
            'candidat.reservations.session.centre',
            'candidat.reservations.session.salle',
            'candidat.reservations.presence',
            'candidat.reservations.resultat',
            'candidat.resultats.session.centre',
        ]);

        return response()->json($user);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnexion réussie']);
    }
}
