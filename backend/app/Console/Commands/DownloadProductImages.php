<?php

namespace App\Console\Commands;

use App\Models\ProductImage;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class DownloadProductImages extends Command
{
    protected $signature = 'products:download-images
                            {--source-dir= : Dossier local wp-content/uploads pour copier les fichiers}
                            {--dry-run : Simuler sans modifier la base ni le disque}
                            {--force : Re-télécharger même si le fichier local existe déjà}';

    protected $description = 'Télécharge les images produits externes (WooCommerce) vers storage/app/public/products';

    private int $downloaded = 0;

    private int $copied = 0;

    private int $skipped = 0;

    private int $failed = 0;

    /** @var array<string, string> */
    private array $urlToPath = [];

    public function handle(): int
    {
        $sourceDir = $this->option('source-dir');
        $dryRun = (bool) $this->option('dry-run');
        $force = (bool) $this->option('force');

        if ($sourceDir) {
            $sourceDir = rtrim(str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $sourceDir), DIRECTORY_SEPARATOR);
            if (! is_dir($sourceDir)) {
                $this->error("Dossier source introuvable : {$sourceDir}");

                return self::FAILURE;
            }
            $this->info("Source locale : {$sourceDir}");
        }

        if ($dryRun) {
            $this->warn('MODE SIMULATION — aucune modification.');
        }

        $images = ProductImage::query()
            ->where('image_path', 'like', 'http%')
            ->orderBy('id')
            ->get();

        if ($images->isEmpty()) {
            $this->info('Aucune image externe à traiter.');

            return self::SUCCESS;
        }

        $uniqueUrls = $images->pluck('image_path')->unique()->values();
        $this->info("Images externes : {$images->count()} entrées, {$uniqueUrls->count()} URLs uniques.");

        $bar = $this->output->createProgressBar($uniqueUrls->count());
        $bar->start();

        foreach ($uniqueUrls as $url) {
            $localPath = $this->resolveLocalPath($url, $sourceDir, $dryRun, $force);

            if ($localPath) {
                $this->urlToPath[$url] = $localPath;
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        if (! $dryRun && ! empty($this->urlToPath)) {
            $updated = 0;
            foreach ($images as $image) {
                $localPath = $this->urlToPath[$image->image_path] ?? null;
                if ($localPath && $image->image_path !== $localPath) {
                    $image->update(['image_path' => $localPath]);
                    $updated++;
                }
            }
            $this->info("Entrées base mises à jour : {$updated}");
        }

        $this->table(
            ['Téléchargées', 'Copiées (local)', 'Ignorées', 'Échouées'],
            [[$this->downloaded, $this->copied, $this->skipped, $this->failed]]
        );

        if ($this->failed > 0) {
            $this->warn('Certaines images sont introuvables en ligne (URLs WordPress obsolètes).');
            $this->line('Placez les fichiers wp-content/uploads sur le serveur puis relancez avec :');
            $this->line('  php artisan products:download-images --source-dir="C:/chemin/wp-content/uploads"');
        }

        return $this->failed === $uniqueUrls->count() ? self::FAILURE : self::SUCCESS;
    }

    private function resolveLocalPath(string $url, ?string $sourceDir, bool $dryRun, bool $force): ?string
    {
        if (isset($this->urlToPath[$url])) {
            return $this->urlToPath[$url];
        }

        $filename = $this->filenameFromUrl($url);
        $storagePath = 'products/'.$filename;

        if (! $force && Storage::disk('public')->exists($storagePath)) {
            $this->skipped++;

            return $storagePath;
        }

        if ($sourceDir) {
            $relative = $this->relativeUploadPath($url);
            $localFile = $relative ? $sourceDir.DIRECTORY_SEPARATOR.str_replace('/', DIRECTORY_SEPARATOR, $relative) : null;

            if ($localFile && is_file($localFile)) {
                if (! $dryRun) {
                    Storage::disk('public')->put($storagePath, file_get_contents($localFile));
                }
                $this->copied++;

                return $storagePath;
            }
        }

        $content = $this->downloadFromUrl($url);
        if ($content !== null) {
            if (! $dryRun) {
                Storage::disk('public')->put($storagePath, $content);
            }
            $this->downloaded++;

            return $storagePath;
        }

        $this->failed++;

        return null;
    }

    private function downloadFromUrl(string $url): ?string
    {
        try {
            $response = Http::timeout(10)
                ->withHeaders([
                    'User-Agent' => 'DMC-ImageDownloader/1.0',
                    'Accept' => 'image/*',
                ])
                ->get($url);

            if (! $response->successful()) {
                return null;
            }

            $body = $response->body();
            if (! $this->isImageContent($body, $response->header('Content-Type'))) {
                return null;
            }

            return $body;
        } catch (\Throwable) {
            return null;
        }
    }

    private function isImageContent(string $body, ?string $contentType): bool
    {
        if ($body === '' || str_starts_with(ltrim($body), '<!DOCTYPE') || str_starts_with(ltrim($body), '<html')) {
            return false;
        }

        if ($contentType && ! str_contains(strtolower($contentType), 'image/') && ! str_contains(strtolower($contentType), 'octet-stream')) {
            return false;
        }

        $signature = substr($body, 0, 12);

        return str_starts_with($signature, "\x89PNG\r\n\x1a\n")
            || str_starts_with($signature, "\xFF\xD8\xFF")
            || str_starts_with($signature, 'GIF87a')
            || str_starts_with($signature, 'GIF89a')
            || (strlen($signature) >= 12 && substr($signature, 0, 4) === 'RIFF' && substr($signature, 8, 4) === 'WEBP');
    }

    private function filenameFromUrl(string $url): string
    {
        $path = parse_url($url, PHP_URL_PATH) ?: $url;
        $basename = basename($path) ?: 'image';
        $basename = preg_replace('/[^a-zA-Z0-9._-]/', '_', $basename) ?: 'image';
        $hash = substr(md5($url), 0, 8);

        if (! pathinfo($basename, PATHINFO_EXTENSION)) {
            $basename .= '.jpg';
        }

        return $hash.'_'.$basename;
    }

    private function relativeUploadPath(string $url): ?string
    {
        $path = parse_url($url, PHP_URL_PATH);
        if (! $path) {
            return null;
        }

        if (preg_match('#/wp-content/uploads/(.+)$#i', $path, $matches)) {
            return $matches[1];
        }

        return null;
    }
}
