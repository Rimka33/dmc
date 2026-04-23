<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use OpenApi\Attributes as OA;

class AuthController extends Controller
{
    #[OA\Post(
        path: '/api/login',
        summary: 'Connexion utilisateur',
        tags: ['Authentication'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['email', 'password'],
                properties: [
                    new OA\Property(property: 'email', type: 'string', example: 'user@example.com'),
                    new OA\Property(property: 'password', type: 'string', example: 'password123')
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Connexion réussie'),
            new OA\Response(response: 422, description: 'Identifiants incorrects')
        ]
    )]
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

    #[OA\Post(path: '/api/logout', summary: 'Déconnexion', security: [['bearerAuth' => []]], tags: ['Authentication'])]
    #[OA\Response(response: 200, description: 'Succès')]
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

    #[OA\Post(path: '/api/profile/update', summary: 'Mettre à jour le profil', security: [['bearerAuth' => []]], tags: ['Authentication'])]
    #[OA\RequestBody(required: true, content: new OA\JsonContent(properties: [
        new OA\Property(property: 'name', type: 'string'),
        new OA\Property(property: 'email', type: 'string'),
        new OA\Property(property: 'phone', type: 'string'),
        new OA\Property(property: 'address', type: 'string')
    ]))]
    #[OA\Response(response: 200, description: 'Profil mis à jour')]
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

    #[OA\Post(path: '/api/profile/password', summary: 'Changer le mot de passe', security: [['bearerAuth' => []]], tags: ['Authentication'])]
    #[OA\RequestBody(required: true, content: new OA\JsonContent(required: ['current_password', 'password', 'password_confirmation'], properties: [
        new OA\Property(property: 'current_password', type: 'string'),
        new OA\Property(property: 'password', type: 'string'),
        new OA\Property(property: 'password_confirmation', type: 'string')
    ]))]
    #[OA\Response(response: 200, description: 'Mot de passe modifié')]
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
