<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NewsletterController extends Controller
{
    /**
     * S'inscrire à la newsletter
     */
    public function subscribe(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Veuillez fournir une adresse email valide.',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Note: Dans un projet réel, on enregistrerait l'email en base de données
        // ou on l'enverrait vers un service comme Mailchimp.
        // Pour cette démo, on simule une réussite.

        return response()->json([
            'success' => true,
            'message' => 'Merci ! Vous êtes maintenant inscrit à notre newsletter.',
        ]);
    }
}
