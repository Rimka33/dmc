<?php

namespace App\Console\Commands;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class ImportWooCommerceProducts extends Command
{
    protected $signature = 'import:woocommerce
                            {file : Chemin vers le fichier CSV WooCommerce}
                            {--skip-existing : Ignorer les produits déjà existants}
                            {--dry-run : Simuler sans enregistrer en base}';

    protected $description = 'Importe les produits depuis un export CSV WooCommerce';

    // Mapping catégories CSV → slug app (du plus spécifique au plus général)
    private array $categoryMap = [
        'ordinateurs portables'       => 'ordinateurs-portables',
        'ordinateurs tablette'        => 'ordinateurs-portables',
        'ordinateurs de bureau'       => 'ordinateurs-bureau',
        'ordinateurs bureau'          => 'ordinateurs-bureau',
        'batteries ordinateurs'       => 'batteries',
        'batteries'                   => 'batteries',
        'chargeurs ordinateurs'       => 'chargeurs',
        'chargeurs'                   => 'chargeurs',
        'imprimantes'                 => 'imprimantes',
        'consommables'                => 'imprimantes',
        'cartouches'                  => 'imprimantes',
        'scanners'                    => 'imprimantes',
        'multimédia'                  => 'multimedia',
        'multimedia'                  => 'multimedia',
        'onduleurs'                   => 'multimedia',
        'haut parleurs'               => 'multimedia',
        'vidéo projecteur'            => 'multimedia',
        'video projecteur'            => 'multimedia',
        'accessoires informatique'    => 'accessoires',
        'accessoires'                 => 'accessoires',
    ];

    private string $defaultCategorySlug = 'accessoires';

    private bool $dryRun = false;
    private int $created = 0;
    private int $updated = 0;
    private int $skipped = 0;
    private int $errors = 0;

    public function handle(): int
    {
        $filePath = $this->argument('file');
        $this->dryRun = $this->option('dry-run');

        if (! file_exists($filePath)) {
            $this->error("Fichier introuvable : {$filePath}");
            return self::FAILURE;
        }

        if ($this->dryRun) {
            $this->warn('MODE SIMULATION — aucune donnée ne sera enregistrée.');
        }

        $rows = $this->parseCsv($filePath);

        if (empty($rows)) {
            $this->error('Le fichier CSV est vide ou invalide.');
            return self::FAILURE;
        }

        $this->info(sprintf('CSV chargé : %d lignes trouvées.', count($rows)));

        // Charger les catégories existantes en cache
        $categories = Category::pluck('id', 'slug')->toArray();

        $bar = $this->output->createProgressBar(count($rows));
        $bar->start();

        foreach ($rows as $row) {
            $this->processRow($row, $categories);
            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        $this->table(
            ['Créés', 'Mis à jour', 'Ignorés', 'Erreurs'],
            [[$this->created, $this->updated, $this->skipped, $this->errors]]
        );

        return self::SUCCESS;
    }

    private function parseCsv(string $filePath): array
    {
        // Utiliser Python (robuste pour les CSV multi-lignes) pour convertir en JSON
        $jsonTmp = tempnam(sys_get_temp_dir(), 'wc_json_') . '.json';

        $pythonScript = <<<'PYTHON'
import sys, csv, json

csv_path = sys.argv[1]
json_path = sys.argv[2]

rows = []
with open(csv_path, encoding='utf-8-sig', newline='') as f:
    reader = csv.DictReader(f)
    for row in reader:
        rows.append(dict(row))

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(rows, f, ensure_ascii=False)
PYTHON;

        $scriptTmp = tempnam(sys_get_temp_dir(), 'wc_py_') . '.py';
        file_put_contents($scriptTmp, $pythonScript);

        $cmd = sprintf(
            'python3 %s %s %s 2>&1',
            escapeshellarg($scriptTmp),
            escapeshellarg($filePath),
            escapeshellarg($jsonTmp)
        );

        exec($cmd, $output, $exitCode);
        unlink($scriptTmp);

        // Fallback python → python3 n'est pas disponible partout
        if ($exitCode !== 0 || ! file_exists($jsonTmp)) {
            $cmd = sprintf(
                'python %s %s %s 2>&1',
                escapeshellarg($scriptTmp),
                escapeshellarg($filePath),
                escapeshellarg($jsonTmp)
            );
            file_put_contents($scriptTmp, $pythonScript);
            exec($cmd, $output, $exitCode);
            unlink($scriptTmp);
        }

        if (! file_exists($jsonTmp) || filesize($jsonTmp) === 0) {
            $this->error('Erreur Python : ' . implode("\n", $output));
            return [];
        }

        $rows = json_decode(file_get_contents($jsonTmp), true) ?? [];
        unlink($jsonTmp);
        return $rows;
    }

    private function processRow(array $row, array &$categories): void
    {
        $type = strtolower(trim($row['Type'] ?? ''));

        // On importe simple et variable ; on ignore les variations (enfants)
        if ($type === 'variation') {
            $this->skipped++;
            return;
        }

        $name = trim($row['Nom'] ?? '');
        if (empty($name)) {
            $this->skipped++;
            return;
        }

        $sku = trim($row['UGS'] ?? '') ?: 'WC-' . trim($row['ID'] ?? uniqid());
        $regularPrice = $this->parsePrice($row['Tarif régulier'] ?? '');
        $promoPrice   = $this->parsePrice($row['Tarif promo'] ?? '');
        $inStock      = trim($row['En stock ?'] ?? '1') === '1';
        $stockQty     = (int) ($row['Stock'] ?? 0);

        // Si le stock n'est pas renseigné mais qu'il est marqué en stock
        if ($inStock && $stockQty === 0) {
            $stockQty = 15;
        }

        if ($regularPrice === null || $regularPrice <= 0) {
            $this->skipped++;
            $this->warn("\n  Ignoré (prix manquant) : {$name}");
            return;
        }

        $categoryId = $this->resolveCategory($row['Catégories'] ?? '', $categories);
        $brand      = $this->extractBrand($row['Marques'] ?? '', $row['Description courte'] ?? '');
        $isFeatured = trim($row['Mis en avant ?'] ?? '0') === '1';

        $shortDesc = $this->cleanHtml($row['Description courte'] ?? '');
        // Fallback: si la description courte est vide, extraire du texte brut de la description
        if (empty($shortDesc)) {
            $shortDesc = strip_tags($this->cleanHtml($row['Description'] ?? ''));
        }
        $shortDesc = mb_substr(strip_tags($shortDesc), 0, 497);
        if (mb_strlen(strip_tags($this->cleanHtml($row['Description courte'] ?? ''))) > 497) {
            $shortDesc .= '...';
        }

        $data = [
            'category_id'       => $categoryId,
            'name'              => $name,
            'slug'              => $this->uniqueSlug($name, $sku),
            'sku'               => $sku,
            'description'       => $this->cleanHtml($row['Description'] ?? ''),
            'short_description' => $shortDesc,
            'price'             => $regularPrice,
            'discount_price'    => ($promoPrice && $promoPrice < $regularPrice) ? $promoPrice : null,
            'stock_quantity'    => $stockQty,
            'brand'             => $brand,
            'is_featured'       => $isFeatured,
            'is_active'         => true,
            'is_new'            => false,
            'is_on_sale'        => $promoPrice && $promoPrice < $regularPrice,
        ];

        if ($this->dryRun) {
            $this->created++;
            return;
        }

        try {
            $existing = Product::where('sku', $sku)->withTrashed()->first();

            if ($existing && $this->option('skip-existing')) {
                $this->skipped++;
                return;
            }

            if ($existing) {
                $existing->restore(); // au cas où soft-deleted
                $existing->update($data);
                $product = $existing;
                $this->updated++;
            } else {
                $product = Product::create($data);
                $this->created++;
            }

            $this->syncImages($product, $row['Images'] ?? '');
        } catch (\Throwable $e) {
            $this->errors++;
            $this->warn("\n  Erreur [{$name}] : " . $e->getMessage());
        }
    }

    private function resolveCategory(string $csvCategories, array &$categories): ?int
    {
        if (empty($csvCategories)) {
            return $categories[$this->defaultCategorySlug] ?? null;
        }

        // Essayer chaque catégorie dans l'ordre du mapping (du plus spécifique au plus général)
        $parts = array_map('trim', explode(',', $csvCategories));

        foreach ($this->categoryMap as $keyword => $slug) {
            foreach ($parts as $part) {
                // Prendre le segment le plus profond (après " > ")
                $segments = array_map('trim', explode('>', $part));
                foreach (array_reverse($segments) as $segment) {
                    $segLower = strtolower($segment);
                    if (str_contains($segLower, $keyword)) {
                        if (isset($categories[$slug])) {
                            return $categories[$slug];
                        }
                    }
                }
            }
        }

        return $categories[$this->defaultCategorySlug] ?? null;
    }

    private function syncImages(Product $product, string $imagesCsv): void
    {
        $urls = array_filter(array_map('trim', explode(',', $imagesCsv)));

        if (empty($urls)) {
            return;
        }

        // Supprimer les anciennes images
        $product->images()->delete();

        foreach ($urls as $index => $url) {
            ProductImage::create([
                'product_id' => $product->id,
                'image_path' => $url,
                'is_primary'  => $index === 0,
                'sort_order'  => $index,
            ]);
        }
    }

    private function parsePrice(string $value): ?float
    {
        $value = str_replace([' ', "\u{00A0}", ','], ['', '', '.'], trim($value));
        if ($value === '' || ! is_numeric($value)) {
            return null;
        }
        return (float) $value;
    }

    private function cleanHtml(string $html): string
    {
        // Convertir \n littéraux du CSV en vraies nouvelles lignes
        $html = str_replace('\n', "\n", $html);
        return trim($html);
    }

    private function extractBrand(string $marques, string $shortDesc): string
    {
        if (! empty(trim($marques))) {
            return trim($marques);
        }

        // Essayer d'extraire la marque depuis la description courte HTML
        if (preg_match('/<strong>\s*Marque\s*:?\s*<\/strong>\s*([^<\n,]+)/i', $shortDesc, $m)) {
            return trim($m[1]);
        }

        return '';
    }

    private function uniqueSlug(string $name, string $sku): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $i = 1;

        while (Product::where('slug', $slug)->exists()) {
            $slug = $base . '-' . $i++;
        }

        return $slug;
    }
}
