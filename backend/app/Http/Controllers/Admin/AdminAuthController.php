<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminAuthController extends Controller
{
    /**
     * Afficher le formulaire de connexion admin
     */
    public function showLogin()
    {
        return Inertia::render('Admin/Auth/Login', [
            'status' => session('status'),
            'errors' => session('errors') ? session('errors')->getBag('default')->getMessages() : [],
        ]);
    }

    /**
     * Traiter la soumission du formulaire de connexion
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
            'remember' => 'boolean',
        ]);

        // Authentifier l'utilisateur
        if (Auth::attempt(['email' => $validated['email'], 'password' => $validated['password']], $validated['remember'] ?? false)) {
            $user = Auth::user();

            // Vérifier que l'utilisateur a le rôle admin ou manager
            if (!$user->hasRole(['admin', 'manager'])) {
                Auth::logout();
                return redirect('/admin/login')->withErrors(['email' => 'Accès non autorisé. Vous devez être administrateur.']);
            }

            $request->session()->regenerate();
            return redirect()->intended('/admin/dashboard');
        }

        return redirect('/admin/login')->withErrors([
            'email' => 'Les identifiants fournis ne correspondent pas à nos enregistrements.',
        ])->onlyInput('email');
    }

    /**
     * Déconnecter l'utilisateur admin
     */
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/admin/login');
    }
}
