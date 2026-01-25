<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Privacy Policy
        $privacyContent = '
            <div style="margin-bottom: 3rem;">
                <h3 style="font-size: 1.125rem; font-weight: 900; text-transform: uppercase; border-left: 4px solid #39FF14; padding-left: 1rem; margin-bottom: 1rem;">1. Collecte des données</h3>
                <p style="color: #4b5563; font-weight: 500; line-height: 1.625;">Nous collectons les informations que vous nous fournissez lors de la création d\'un compte, d\'un achat ou de l\'inscription à notre newsletter (Nom, email, numéro de téléphone, adresse). Ces données sont indispensables pour traiter vos commandes.</p>
            </div>

            <div style="margin-bottom: 3rem;">
                <h3 style="font-size: 1.125rem; font-weight: 900; text-transform: uppercase; border-left: 4px solid #39FF14; padding-left: 1rem; margin-bottom: 1rem;">2. Utilisation des informations</h3>
                <p style="color: #4b5563; font-weight: 500; line-height: 1.625;">Vos informations sont utilisées pour le traitement sécurisé de vos commandes et l\'amélioration de votre expérience sur notre site.</p>
            </div>

            <div style="margin-bottom: 3rem;">
                <h3 style="font-size: 1.125rem; font-weight: 900; text-transform: uppercase; border-left: 4px solid #39FF14; padding-left: 1rem; margin-bottom: 1rem;">3. Protection des données</h3>
                <p style="color: #4b5563; font-weight: 500; line-height: 1.625;">DMC met en œuvre toutes les mesures de sécurité nécessaires (cryptage SSL, accès restreints) pour protéger vos données personnelles contre tout accès non autorisé.</p>
            </div>
        ';

        \App\Models\Page::create([
            'title' => 'Politique de Confidentialité',
            'slug' => 'privacy-policy',
            'status' => 'published',
            'content' => $privacyContent,
            'meta_title' => 'Politique de Confidentialité - DMC',
            'meta_description' => 'Découvrez comment DMC protège vos données personnelles.',
        ]);

        // 2. Returns Policy
        $returnsContent = '
            <div style="display: grid; gap: 2rem; margin-bottom: 4rem;">
                <div style="display: flex; gap: 1.5rem; padding: 1.5rem; background-color: #f9fafb; border: 1px solid #f3f4f6; border-radius: 1rem; align-items: start;">
                    <div>
                        <h3 style="font-size: 1.125rem; font-weight: 900; text-transform: uppercase; margin-bottom: 0.5rem;">Délai de retour</h3>
                        <p style="color: #4b5563; font-weight: 500; line-height: 1.625; font-size: 0.875rem;">Vous disposez de 48 heures après la réception de votre colis ou le retrait en magasin pour signaler un problème technique ou un défaut de fabrication.</p>
                    </div>
                </div>

                <div style="display: flex; gap: 1.5rem; padding: 1.5rem; background-color: #f9fafb; border: 1px solid #f3f4f6; border-radius: 1rem; align-items: start;">
                    <div>
                        <h3 style="font-size: 1.125rem; font-weight: 900; text-transform: uppercase; margin-bottom: 0.5rem;">État du produit</h3>
                        <p style="color: #4b5563; font-weight: 500; line-height: 1.625; font-size: 0.875rem;">Le matériel doit être retourné dans son emballage d\'origine, avec tous ses accessoires, manuels et sans aucune trace d\'utilisation abusive.</p>
                    </div>
                </div>

                <div style="display: flex; gap: 1.5rem; padding: 1.5rem; background-color: #f9fafb; border: 1px solid #f3f4f6; border-radius: 1rem; align-items: start;">
                    <div>
                        <h3 style="font-size: 1.125rem; font-weight: 900; text-transform: uppercase; margin-bottom: 0.5rem;">Vérification technique</h3>
                        <p style="color: #4b5563; font-weight: 500; line-height: 1.625; font-size: 0.875rem;">Tout produit retourné fera l\'objet d\'une expertise par nos techniciens avant validation du remboursement ou de l\'échange.</p>
                    </div>
                </div>

                <div style="display: flex; gap: 1.5rem; padding: 1.5rem; background-color: #f9fafb; border: 1px solid #f3f4f6; border-radius: 1rem; align-items: start;">
                    <div>
                        <h3 style="font-size: 1.125rem; font-weight: 900; text-transform: uppercase; margin-bottom: 0.5rem;">Mode de remboursement</h3>
                        <p style="color: #4b5563; font-weight: 500; line-height: 1.625; font-size: 0.875rem;">Le remboursement s\'effectue via le mode de paiement initial (Wave, Orange Money ou Espèces) dans un délai de 3 à 5 jours ouvrés.</p>
                    </div>
                </div>
            </div>
        ';

        \App\Models\Page::create([
            'title' => 'Politique de Retour',
            'slug' => 'returns',
            'status' => 'published',
            'content' => $returnsContent,
            'meta_title' => 'Retours & Remboursements - DMC',
            'meta_description' => 'Tout savoir sur les modalités de retour et de remboursement chez DMC.',
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        \App\Models\Page::whereIn('slug', ['privacy-policy', 'returns'])->forceDelete();
    }
};
