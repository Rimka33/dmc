<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductFeature;
use App\Models\SpecialOffer;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Récupérer les catégories
        $laptopCategory = Category::where('slug', 'ordinateurs-portables')->first();
        $desktopCategory = Category::where('slug', 'ordinateurs-bureau')->first();
        $accessoriesCategory = Category::where('slug', 'accessoires')->first();
        $chargersCategory = Category::where('slug', 'chargeurs')->first();
        $batteriesCategory = Category::where('slug', 'batteries')->first();
        $printersCategory = Category::where('slug', 'imprimantes')->first();
        $multimediaCategory = Category::where('slug', 'multimedia')->first();

        // Produits Ordinateurs Portables
        $product1 = Product::create([
            'category_id' => $laptopCategory->id,
            'name' => 'Dell Inspiron 15 - Intel Core i7',
            'sku' => 'DELL-INS-15-I7',
            'description' => 'Ordinateur portable Dell Inspiron 15 avec processeur Intel Core i7 de 11e génération, 16GB RAM, 512GB SSD, écran Full HD 15.6 pouces. -idéal pour le travail et le multimédia.',
            'short_description' => 'Dell Inspiron 15 - Intel i7, 16GB RAM, 512GB SSD',
            'price' => 650000,
            'stock_quantity' => 15,
            'is_featured' => true,
            'is_active' => true,
            'brand' => 'Dell',
            'rating' => 4,
            'review_count' => 45,
        ]);
        ProductImage::create(['product_id' => $product1->id, 'image_path' => '/images/products/speaker-1.png', 'is_primary' => true, 'sort_order' => 1]);
        ProductFeature::create(['product_id' => $product1->id, 'feature' => '3 Mois de Garantie', 'sort_order' => 1]);
        ProductFeature::create(['product_id' => $product1->id, 'feature' => 'Venant des USA', 'sort_order' => 2]);
        ProductFeature::create(['product_id' => $product1->id, 'feature' => 'Livraison Partout au Sénégal', 'sort_order' => 3]);

        $product2 = Product::create([
            'category_id' => $laptopCategory->id,
            'name' => 'HP Pavilion 14 - AMD Ryzen 5',
            'sku' => 'HP-PAV-14-R5',
            'description' => 'HP Pavilion 14 pouces avec processeur AMD Ryzen 5, 8GB RAM, 256GB SSD. Design élégant et performant pour un usage quotidien.',
            'short_description' => 'HP Pavilion 14 - Ryzen 5, 8GB RAM, 256GB SSD',
            'price' => 525000,
            'stock_quantity' => 20,
            'is_featured' => true,
            'is_active' => true,
            'brand' => 'HP',
            'rating' => 5,
            'review_count' => 78,
        ]);
        ProductImage::create(['product_id' => $product2->id, 'image_path' => '/images/products/speaker-2.png', 'is_primary' => true, 'sort_order' => 1]);
        ProductFeature::create(['product_id' => $product2->id, 'feature' => '3 Mois de Garantie', 'sort_order' => 1]);
        ProductFeature::create(['product_id' => $product2->id, 'feature' => 'Livraison Gratuite', 'sort_order' => 2]);

        $product3 = Product::create([
            'category_id' => $laptopCategory->id,
            'name' => 'ASUS VivoBook 15 - Intel i5',
            'sku' => 'ASUS-VB-15-I5',
            'description' => 'ASUS VivoBook 15 avec Intel Core i5, 12GB RAM, 512GB SSD. Ultraportable avec batterie longue durée.',
            'short_description' => 'ASUS VivoBook 15 - i5, 12GB RAM, 512GB SSD',
            'price' => 480000,
            'stock_quantity' => 12,
            'is_new' => true,
            'is_active' => true,
            'brand' => 'ASUS',
            'rating' => 4,
            'review_count' => 32,
        ]);
        ProductImage::create(['product_id' => $product3->id, 'image_path' => '/images/products/speaker-3.png', 'is_primary' => true, 'sort_order' => 1]);
        ProductFeature::create(['product_id' => $product3->id, 'feature' => '6 Mois de Garantie', 'sort_order' => 1]);

        $product4 = Product::create([
            'category_id' => $laptopCategory->id,
            'name' => 'Lenovo ThinkPad E15 - Core i7',
            'sku' => 'LEN-TP-E15-I7',
            'description' => 'Lenovo ThinkPad E15, ordinateur professionnel robuste avec Intel Core i7, 16GB RAM, 1TB SSD. Parfait pour les entreprises.',
            'short_description' => 'Lenovo ThinkPad E15 - i7, 16GB RAM, 1TB SSD',
            'price' => 720000,
            'stock_quantity' => 8,
            'is_featured' => true,
            'is_active' => true,
            'brand' => 'Lenovo',
            'rating' => 5,
            'review_count' => 92,
        ]);
        ProductImage::create(['product_id' => $product4->id, 'image_path' => '/images/products/drone.png', 'is_primary' => true, 'sort_order' => 1]);
        ProductFeature::create(['product_id' => $product4->id, 'feature' => '12 Mois de Garantie', 'sort_order' => 1]);
        ProductFeature::create(['product_id' => $product4->id, 'feature' => 'Support Technique Inclus', 'sort_order' => 2]);

        $product5 = Product::create([
            'category_id' => $laptopCategory->id,
            'name' => 'MSI GF63 Gaming Laptop - RTX 3050',
            'sku' => 'MSI-GF63-RTX3050',
            'description' => 'MSI GF63 Gaming - Intel i7, 16GB RAM, 512GB SSD, NVIDIA RTX 3050 4GB. PC gamer performant pour tous les jeux.',
            'short_description' => 'MSI GF63 Gaming - i7, RTX 3050, 16GB RAM',
            'price' => 950000,
            'discount_price' => 850000,
            'stock_quantity' => 5,
            'is_on_sale' => true,
            'is_featured' => true,
            'is_active' => true,
            'brand' => 'MSI',
            'rating' => 5,
            'review_count' => 156,
        ]);
        ProductImage::create(['product_id' => $product5->id, 'image_path' => '/images/products/air-purifier.png', 'is_primary' => true, 'sort_order' => 1]);
        ProductFeature::create(['product_id' => $product5->id, 'feature' => 'Gaming Performance', 'sort_order' => 1]);
        ProductFeature::create(['product_id' => $product5->id, 'feature' => 'Écran 144Hz', 'sort_order' => 2]);

        $product6 = Product::create([
            'category_id' => $laptopCategory->id,
            'name' => 'Samsung Galaxy Book Pro - 13.3"',
            'sku' => 'SAMSUNG-GBP-13',
            'description' => 'Samsung Galaxy Book Pro 13.3" ultraportable, Intel i5, 8GB RAM, 256GB SSD. Léger et puissant.',
            'short_description' => 'Samsung Galaxy Book Pro 13.3" - i5, 8GB RAM',
            'price' => 580000,
            'stock_quantity' => 10,
            'is_new' => true,
            'is_active' => true,
            'brand' => 'Samsung',
            'rating' => 4,
            'review_count' => 64,
        ]);
        ProductImage::create(['product_id' => $product6->id, 'image_path' => '/images/products/cleaner.png', 'is_primary' => true, 'sort_order' => 1]);

        // MacBook (Offre Spéciale)
        $product7 = Product::create([
            'category_id' => $laptopCategory->id,
            'name' => 'MacBook Pro 14 pouces M1 Pro',
            'sku' => 'APPLE-MBP-14-M1',
            'description' => 'MacBook Pro 14" avec puce M1 Pro, 16GB RAM, 512GB SSD. Performance exceptionnelle pour les créatifs.',
            'short_description' => 'MacBook Pro 14" - M1 Pro, 16GB RAM',
            'price' => 1200000,
            'discount_price' => 825000,
            'stock_quantity' => 73,
            'is_on_sale' => true,
            'is_featured' => true,
            'is_active' => true,
            'brand' => 'Apple',
            'rating' => 5,
            'review_count' => 201,
        ]);
        ProductImage::create(['product_id' => $product7->id, 'image_path' => '/images/products/macbook.png', 'is_primary' => true, 'sort_order' => 1]);
        ProductFeature::create(['product_id' => $product7->id, 'feature' => '3 Mois de Garantie', 'sort_order' => 1]);
        ProductFeature::create(['product_id' => $product7->id, 'feature' => 'Venant des USA', 'sort_order' => 2]);
        ProductFeature::create(['product_id' => $product7->id, 'feature' => 'Livraison Partout au Sénégal', 'sort_order' => 3]);
        
        // Offre spéciale pour MacBook
        SpecialOffer::create([
            'product_id' => $product7->id,
            'end_date' => now()->addDays(15),
            'available_stock' => 73,
            'total_stock' => 99,
            'is_active' => true,
        ]);

        // Smartphone (Offre Spéciale)
        $product8 = Product::create([
            'category_id' => $multimediaCategory->id,
            'name' => 'Acer Predator Helios 300',
            'sku' => 'ACER-PH-300',
            'description' => 'Smartphone pliable dernière génération avec écran AMOLED.',
            'short_description' => 'Smartphone pliable - AMOLED Display',
            'price' => 270000,
            'discount_price' => 220000,
            'stock_quantity' => 44,
            'is_on_sale' => true,
            'is_new' => true,
            'is_active' => true,
            'brand' => 'Acer',
            'rating' => 0,
            'review_count' => 0,
        ]);
        ProductImage::create(['product_id' => $product8->id, 'image_path' => '/images/products/phone-fold.png', 'is_primary' => true, 'sort_order' => 1]);
        ProductFeature::create(['product_id' => $product8->id, 'feature' => '3 Mois de Garantie', 'sort_order' => 1]);
        ProductFeature::create(['product_id' => $product8->id, 'feature' => 'Venant des USA', 'sort_order' => 2]);
        ProductFeature::create(['product_id' => $product8->id, 'feature' => 'Livraison Partout au Sénégal', 'sort_order' => 3]);
        
        // Offre spéciale
        SpecialOffer::create([
            'product_id' => $product8->id,
            'end_date' => now()->addDays(30),
            'available_stock' => 44,
            'total_stock' => 50,
            'is_active' => true,
        ]);

        // Produits Multimédia & Électronique
        $product9 = Product::create([
            'category_id' => $multimediaCategory->id,
            'name' => 'Aenean Mini Portable Drone Quadcopter',
            'sku' => 'DRONE-MINI-001',
            'description' => 'Mini drone portable avec caméra 4K, autonomie 25min.',
            'short_description' => 'Mini Drone 4K - Portable',
            'price' => 125000,
            'stock_quantity' => 25,
            'is_new' => true,
            'is_active' => true,
            'brand' => 'Aenean',
            'rating' => 0,
            'review_count' => 0,
        ]);
        ProductImage::create(['product_id' => $product9->id, 'image_path' => '/images/products/drone.png', 'is_primary' => true, 'sort_order' => 1]);

        $product10 = Product::create([
            'category_id' => $multimediaCategory->id,
            'name' => 'Home Office Fast Air Clean Multifunctional Air Purifier',
            'sku' => 'AIR-PURIFIER-001',
            'description' => 'Purificateur d\'air multifunctionnel pour bureau et maison.',
            'short_description' => 'Purificateur d\'Air Multifonction',
            'price' => 85000,
            'stock_quantity' => 30,
            'is_new' => true,
            'is_active' => true,
            'rating' => 0,
            'review_count' => 0,
        ]);
        ProductImage::create(['product_id' => $product10->id, 'image_path' => '/images/products/air-purifier.png', 'is_primary' => true, 'sort_order' => 1]);

        $product11 = Product::create([
            'category_id' => $multimediaCategory->id,
            'name' => 'Manufacturer Reusable Cleaner Home Washable',
            'sku' => 'CLEANER-001',
            'description' => 'Nettoyeur réutilisable et lavable pour la maison.',
            'short_description' => 'Nettoyeur Réutilisable',
            'price' => 45000,
            'stock_quantity' => 50,
            'is_active' => true,
            'rating' => 0,
            'review_count' => 0,
        ]);
        ProductImage::create(['product_id' => $product11->id, 'image_path' => '/images/products/cleaner.png', 'is_primary' => true, 'sort_order' => 1]);

        $product12 = Product::create([
            'category_id' => $multimediaCategory->id,
            'name' => 'Vinova Mix 360° Home Security Camera 2K Pro',
            'sku' => 'CAM-SECURITY-2K',
            'description' => 'Caméra de sécurité 360° avec résolution 2K, vision nocturne.',
            'short_description' => 'Caméra Sécurité 360° 2K',
            'price' => 95000,
            'stock_quantity' => 18,
            'is_new' => true,
            'is_active' => true,
            'brand' => 'Vinova',
            'rating' => 0,
            'review_count' => 0,
        ]);
        ProductImage::create(['product_id' => $product12->id, 'image_path' => '/images/products/camera-security.png', 'is_primary' => true, 'sort_order' => 1]);

        $product13 = Product::create([
            'category_id' => $multimediaCategory->id,
            'name' => 'Steam Pro Stainless Steel Soleplate Professional',
            'sku' => 'IRON-STEAM-PRO',
            'description' => 'Fer à repasser professionnel avec semelle en acier inoxydable.',
            'short_description' => 'Fer à Repasser Professionnel',
            'price' => 35000,
            'stock_quantity' => 40,
            'is_active' => true,
            'rating' => 0,
            'review_count' => 0,
        ]);
        ProductImage::create(['product_id' => $product13->id, 'image_path' => '/images/products/iron-1.png', 'is_primary' => true, 'sort_order' => 1]);

        $product14 = Product::create([
            'category_id' => $multimediaCategory->id,
            'name' => 'Perfect Care 3000 Series Steam Iron 1250 W Power',
            'sku' => 'IRON-PC3000',
            'description' => 'Fer à vapeur Perfect Care 3000 avec puissance 1250W.',
            'short_description' => 'Fer à Vapeur 1250W',
            'price' => 42000,
            'stock_quantity' => 35,
            'is_active' => true,
            'rating' => 0,
            'review_count' => 0,
        ]);
        ProductImage::create(['product_id' => $product14->id, 'image_path' => '/images/products/iron-2.png', 'is_primary' => true, 'sort_order' => 1]);

        $product15 = Product::create([
            'category_id' => $multimediaCategory->id,
            'name' => 'Retro Small Microwave Oven With Compact Size',
            'sku' => 'MICROWAVE-RETRO',
            'description' => 'Micro-ondes rétro compact, design vintage.',
            'short_description' => 'Micro-ondes Compact Rétro',
            'price' => 125000,
            'stock_quantity' => 15,
            'is_active' => true,
            'rating' => 0,
            'review_count' => 0,
        ]);
        ProductImage::create(['product_id' => $product15->id, 'image_path' => '/images/products/microwave.png', 'is_primary' => true, 'sort_order' => 1]);

        // Produits Accessoires
        $product16 = Product::create([
            'category_id' => $accessoriesCategory->id,
            'name' => 'Souris Logitech MX Master 3',
            'sku' => 'LOGI-MX3',
            'description' => 'Souris ergonomique sans fil Logitech MX Master 3 avec précision ultime.',
            'short_description' => 'Souris Logitech MX Master 3',
            'price' => 65000,
            'stock_quantity' => 30,
            'is_featured' => true,
            'is_active' => true,
            'brand' => 'Logitech',
            'rating' => 5,
            'review_count' => 89,
        ]);
        ProductImage::create(['product_id' => $product16->id, 'image_path' => '/images/products/mouse.png', 'is_primary' => true, 'sort_order' => 1]);

        $product17 = Product::create([
            'category_id' => $accessoriesCategory->id,
            'name' => 'Power Bank Anker 20000mAh',
            'sku' => 'ANKER-PB-20K',
            'description' => 'Batterie externe Anker 20000mAh avec charge rapide.',
            'short_description' => 'Power Bank 20000mAh',
            'price' => 25000,
            'stock_quantity' => 60,
            'is_active' => true,
            'brand' => 'Anker',
            'rating' => 5,
            'review_count' => 145,
        ]);
        ProductImage::create(['product_id' => $product17->id, 'image_path' => '/images/products/powerbank.png', 'is_primary' => true, 'sort_order' => 1]);

        $product18 = Product::create([
            'category_id' => $accessoriesCategory->id,
            'name' => 'Ecouteurs Samsung Galaxy Buds Pro',
            'sku' => 'SAMSUNG-BUDS-PRO',
            'description' => 'Écouteurs sans fil Samsung avec réduction de bruit active.',
            'short_description' => 'Samsung Galaxy Buds Pro',
            'price' => 90000,
            'stock_quantity' => 25,
            'is_active' => true,
            'brand' => 'Samsung',
            'rating' => 4,
            'review_count' => 22,
        ]);
        ProductImage::create(['product_id' => $product18->id, 'image_path' => '/images/products/earbuds.png', 'is_primary' => true, 'sort_order' => 1]);

        $product19 = Product::create([
            'category_id' => $accessoriesCategory->id,
            'name' => 'Enceinte Bluetooth JBL Flip 6',
            'sku' => 'JBL-FLIP6',
            'description' => 'Enceinte portable Bluetooth JBL Flip 6, son puissant et résistante à l\'eau.',
            'short_description' => 'Enceinte JBL Flip 6',
            'price' => 75000,
            'stock_quantity' => 20,
            'is_active' => true,
            'brand' => 'JBL',
            'rating' => 4,
            'review_count' => 34,
        ]);
        ProductImage::create(['product_id' => $product19->id, 'image_path' => '/images/products/speaker.png', 'is_primary' => true, 'sort_order' => 1]);

        $product20 = Product::create([
            'category_id' => $accessoriesCategory->id,
            'name' => 'Casque Sony WH-1000XM5',
            'sku' => 'SONY-WH1000XM5',
            'description' => 'Casque Sony avec réduction de bruit de pointe, confort premium.',
            'short_description' => 'Casque Sony WH-1000XM5',
            'price' => 220000,
            'stock_quantity' => 12,
            'is_featured' => true,
            'is_active' => true,
            'brand' => 'Sony',
            'rating' => 5,
            'review_count' => 56,
        ]);
        ProductImage::create(['product_id' => $product20->id, 'image_path' => '/images/products/headphone.png', 'is_primary' => true, 'sort_order' => 1]);

        $this->command->info('20 produits créés avec succès avec images et features !');
    }
}
