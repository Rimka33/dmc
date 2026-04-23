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

        try {
            \App\Models\Newsletter::firstOrCreate(
                ['email' => $request->email],
                ['is_active' => true]
            );

            return response()->json([
                'success' => true,
                'message' => 'Merci ! Vous êtes maintenant inscrit à notre newsletter.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de l\'inscription.',
            ], 500);
        }
    }
}
