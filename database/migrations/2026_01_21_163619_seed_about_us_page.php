<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $content = '
            <div style="margin-bottom: 3rem;">
                <h2 style="font-size: 1.5rem; font-weight: 900; text-transform: uppercase; margin-bottom: 1.5rem;">Notre Histoire</h2>
                <p style="color: #4b5563; font-weight: 500; line-height: 1.625; margin-bottom: 1rem;">Daroul Mouhty Computer (DMC) est né d\'une passion pour la technologie et d\'un désir de rendre le matériel informatique de haute qualité accessible à tous au Sénégal.</p>
                <p style="color: #4b5563; font-weight: 500; line-height: 1.625;">Depuis notre showroom à Dakar, nous servons des milliers de clients, qu\'ils soient particuliers, étudiants ou professionnels, en leur offrant le meilleur de l\'informatique avec un service personnalisé.</p>
            </div>

            <div style="margin-bottom: 3rem;">
                <h2 style="font-size: 1.5rem; font-weight: 900; text-transform: uppercase; margin-bottom: 1.5rem;">Notre Mission</h2>
                <p style="color: #4b5563; font-weight: 500; line-height: 1.625;">Offrir des solutions informatiques fiables, performantes et abordables tout en assurant un service après-vente d\'excellence.</p>
            </div>

            <div style="display: grid; grid-template-cols: 1fr 1fr; gap: 2rem;">
                <div style="padding: 1.5rem; border: 1px solid #e5e7eb; border-radius: 1rem;">
                    <h4 style="font-weight: 900; text-transform: uppercase; margin-bottom: 0.5rem; color: #058031;">Expertise</h4>
                    <p style="font-size: 0.875rem; color: #6b7280;">Plus de 10 ans d\'expérience dans le domaine informatique.</p>
                </div>
                <div style="padding: 1.5rem; border: 1px solid #e5e7eb; border-radius: 1rem;">
                    <h4 style="font-weight: 900; text-transform: uppercase; margin-bottom: 0.5rem; color: #058031;">Qualité</h4>
                    <p style="font-size: 0.875rem; color: #6b7280;">Produits authentiques et garantis constructeur.</p>
                </div>
            </div>
        ';

        \App\Models\Page::create([
            'title' => 'Qui sommes-nous ?',
            'slug' => 'a-propos',
            'status' => 'published',
            'content' => $content,
            'meta_title' => 'À Propos de DMC - Daroul Mouhty Computer',
            'meta_description' => 'Découvrez l\'histoire et les valeurs de Daroul Mouhty Computer.',
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        \App\Models\Page::where('slug', 'a-propos')->forceDelete();
    }
};
