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
        $content = '
            <p style="text-align: center; color: #9ca3af; font-size: 0.8rem; font-weight: bold; text-transform: uppercase; font-style: italic; margin-bottom: 2rem;">Dernière mise à jour : 24 Décembre 2025</p>

            <div style="margin-bottom: 2rem;">
                <h3 style="font-size: 1.25rem; font-weight: 900; text-transform: uppercase; margin-bottom: 0.75rem;">1. Présentation du site</h3>
                <p style="color: #4b5563; line-height: 1.625; font-weight: 500;">Le site Daroul Mouhty Computer (DMC) est une plateforme de commerce électronique spécialisée dans la vente de matériel informatique. En accédant à ce site, vous acceptez les présentes conditions générales d\'utilisation.</p>
            </div>

            <div style="margin-bottom: 2rem;">
                <h3 style="font-size: 1.25rem; font-weight: 900; text-transform: uppercase; margin-bottom: 0.75rem;">2. Prix et Paiement</h3>
                <p style="color: #4b5563; line-height: 1.625; font-weight: 500;">Les prix de nos produits sont indiqués en Francs CFA (FCFA) toutes taxes comprises. DMC se réserve le droit de modifier ses prix à tout moment. Les produits sont facturés sur la base des tarifs en vigueur au moment de la validation de la commande.</p>
            </div>

            <div style="margin-bottom: 2rem;">
                <h3 style="font-size: 1.25rem; font-weight: 900; text-transform: uppercase; margin-bottom: 0.75rem;">3. Livraison et Récupération</h3>
                <p style="color: #4b5563; line-height: 1.625; font-weight: 500;">Nous proposons deux modes d\'obtention : la livraison à domicile (avec frais supplémentaires selon la zone) et la récupération gratuite dans notre showroom à Dakar. Les délais de livraison sont donnés à titre indicatif.</p>
            </div>

            <div style="margin-bottom: 2rem;">
                <h3 style="font-size: 1.25rem; font-weight: 900; text-transform: uppercase; margin-bottom: 0.75rem;">4. Droit de rétractation</h3>
                <p style="color: #4b5563; line-height: 1.625; font-weight: 500;">Conformément à la législation en vigueur, vous disposez d\'un délai pour retourner un produit qui ne vous satisferait pas. Le produit doit être retourné dans son emballage d\'origine, complet et en parfait état de revente.</p>
            </div>

            <div style="margin-bottom: 2rem;">
                <h3 style="font-size: 1.25rem; font-weight: 900; text-transform: uppercase; margin-bottom: 0.75rem;">5. Garantie et SAV</h3>
                <p style="color: #4b5563; line-height: 1.625; font-weight: 500;">Tous nos produits bénéficient d\'une garantie constructeur ou d\'une garantie DMC. En cas de panne ou de défaut, notre service après-vente est à votre disposition dans notre showroom.</p>
            </div>
        ';

        \App\Models\Page::create([
            'title' => 'Conditions Générales de Vente',
            'slug' => 'terms-conditions',
            'status' => 'published',
            'content' => $content,
            'meta_title' => 'Conditions Générales de Vente - DMC',
            'meta_description' => 'Consultez les conditions générales de vente de Daroul Mouhty Computer.',
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        \App\Models\Page::where('slug', 'terms-conditions')->forceDelete();
    }
};
