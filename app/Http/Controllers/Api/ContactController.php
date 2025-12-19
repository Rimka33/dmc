<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function submit(Request $request)
    {
        // Here you would normally validate and send email/save to DB
        // $validated = $request->validate([...]);

        return response()->json([
            'message' => 'Votre message a bien été envoyé !',
            'success' => true
        ]);
    }
}
