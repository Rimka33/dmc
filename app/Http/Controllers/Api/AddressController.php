<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AddressController extends Controller
{
    /**
     * Liste des adresses de l'utilisateur
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $addresses = UserAddress::where('user_id', $user->id)
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $addresses,
        ]);
    }

    /**
     * Créer une nouvelle adresse
     */
    public function store(Request $request)
    {
        // Nettoyer le téléphone
        if ($request->has('phone')) {
            $request->merge(['phone' => str_replace(' ', '', $request->input('phone'))]);
        }

        $validator = Validator::make($request->all(), [
            'label' => 'required|string|max:50',
            'full_name' => 'required|string|max:255',
            'phone' => 'required|string|max:50',
            'address' => 'required|string',
            'city' => 'required|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'region' => 'nullable|string|max:100',
            'neighborhood' => 'nullable|string|max:255',
            'is_default' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();

        $address = UserAddress::create([
            'user_id' => $user->id,
            'label' => $request->label,
            'full_name' => $request->full_name,
            'phone' => $request->phone,
            'address' => $request->address,
            'city' => $request->city,
            'postal_code' => $request->postal_code,
            'region' => $request->region,
            'neighborhood' => $request->neighborhood,
            'is_default' => $request->is_default ?? false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Adresse ajoutée avec succès',
            'data' => $address,
        ], 201);
    }

    /**
     * Modifier une adresse
     */
    public function update(Request $request, $id)
    {
        // Nettoyer le téléphone
        if ($request->has('phone')) {
            $request->merge(['phone' => str_replace(' ', '', $request->input('phone'))]);
        }

        $validator = Validator::make($request->all(), [
            'label' => 'sometimes|required|string|max:50',
            'full_name' => 'sometimes|required|string|max:255',
            'phone' => 'sometimes|required|string|max:50',
            'address' => 'sometimes|required|string',
            'city' => 'sometimes|required|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'region' => 'nullable|string|max:100',
            'neighborhood' => 'nullable|string|max:255',
            'is_default' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();
        $address = UserAddress::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $address->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Adresse modifiée avec succès',
            'data' => $address,
        ]);
    }

    /**
     * Supprimer une adresse
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $address = UserAddress::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $address->delete();

        return response()->json([
            'success' => true,
            'message' => 'Adresse supprimée avec succès',
        ]);
    }

    /**
     * Définir une adresse comme adresse par défaut
     */
    public function setDefault(Request $request, $id)
    {
        $user = $request->user();
        $address = UserAddress::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        // Le modèle gère automatiquement la mise à jour des autres adresses
        $address->update(['is_default' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Adresse par défaut définie',
            'data' => $address,
        ]);
    }
}
