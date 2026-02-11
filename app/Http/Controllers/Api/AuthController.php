<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Connexion avec Sanctum (token-based)
     */
    public function login(Request $request)
    {
        // Nettoyer l'identifiant (retirer les espaces pour le téléphone)
        $login = str_replace(' ', '', $request->input('email'));
        $password = $request->input('password');

        $request->merge(['email' => $login]); // Mettre à jour la requête pour la validation

        $request->validate([
            'email' => 'required',
            'password' => 'required',
        ]);

        $user = User::where('email', $login)
            ->orWhere('phone', $login)
            ->first();

        if (! $user || ! Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants fournis sont incorrects (Email ou Téléphone).'],
            ]);
        }

        if (! $user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Votre compte est désactivé.',
            ], 403);
        }

        // Connecter l'utilisateur pour la session web
        \Illuminate\Support\Facades\Auth::login($user, $request->boolean('remember'));

        // Créer un token Sanctum pour le frontend API
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Connexion réussie',
            'data' => [
                'user' => new UserResource($user),
                'token' => $token,
            ],
        ]);
    }

    /**
     * Inscription
     */
    public function register(Request $request)
    {
        // Nettoyer le téléphone (retirer les espaces)
        if ($request->has('phone')) {
            $request->merge(['phone' => str_replace(' ', '', $request->input('phone'))]);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|string|email|max:255|unique:users',
            'phone' => 'required|string|max:50|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'region' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:100',
            'neighborhood' => 'nullable|string|max:255',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'] ?? null,
            'phone' => $validated['phone'],
            'password' => Hash::make($validated['password']),
            'region' => $validated['region'] ?? null,
            'city' => $validated['city'] ?? null,
            'neighborhood' => $validated['neighborhood'] ?? null,
            'role' => 'customer',
            'is_active' => true,
        ]);

        // Connecter l'utilisateur pour la session web
        \Illuminate\Support\Facades\Auth::login($user, true);

        // Créer un token Sanctum
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Inscription réussie',
            'data' => [
                'user' => new UserResource($user),
                'token' => $token,
            ],
        ], 201);
    }

    /**
     * Déconnexion (révoque le token actuel)
     */
    public function logout(Request $request)
    {
        // Révoquer le token actuel si applicable (Sanctum token)
        $user = $request->user();
        if ($user && $user->currentAccessToken() && method_exists($user->currentAccessToken(), 'delete')) {
            $user->currentAccessToken()->delete();
        }

        // Déconnecter la session web (Inertia)
        \Illuminate\Support\Facades\Auth::guard('web')->logout();

        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return response()->json([
            'success' => true,
            'message' => 'Déconnexion réussie',
        ]);
    }

    /**
     * Obtenir les informations de l'utilisateur connecté
     */
    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => new UserResource($request->user()),
        ]);
    }

    /**
     * Mettre à jour le profil
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        // Nettoyer le téléphone si présent
        if ($request->has('phone')) {
            $request->merge(['phone' => str_replace(' ', '', $request->input('phone'))]);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|nullable|email|max:255|unique:users,email,'.$user->id,
            'phone' => 'sometimes|required|string|max:50|unique:users,phone,'.$user->id,
            'address' => 'nullable|string',
            'region' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:100',
            'neighborhood' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:20',
        ]);

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Profil mis à jour avec succès',
            'data' => new UserResource($user->fresh()),
        ]);
    }

    /**
     * Changer le mot de passe
     */
    public function updatePassword(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'current_password' => 'required',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Vérifier l'ancien mot de passe
        if (! Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Le mot de passe actuel est incorrect',
                'errors' => [
                    'current_password' => ['Le mot de passe actuel est incorrect'],
                ],
            ], 422);
        }

        // Mettre à jour le mot de passe
        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Mot de passe modifié avec succès',
        ]);
    }

    /**
     * Mot de passe oublié (envoi de lien de réinitialisation)
     */
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (! $user) {
            return response()->json([
                'success' => false,
                'message' => "Nous n'avons pas trouvé d'utilisateur avec cette adresse e-mail.",
            ], 404);
        }

        // Pour l'instant, on simule l'envoi ou on log le lien
        // Dans une version de production, on utiliserait le système de Password::sendResetLink
        \Illuminate\Support\Facades\Log::info("Réinitialisation de mot de passe pour {$user->email}");

        return response()->json([
            'success' => true,
            'message' => 'Un lien de réinitialisation a été envoyé.',
        ]);
    }
}
