<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $creator = User::query()->role('admin')->firstOrFail();
        $thumbnailPaths = $this->downloadProductThumbnails(50);

        Product::factory(50)
            ->sequence(fn (Sequence $sequence): array => [
                'thumbnail_path' => $thumbnailPaths[$sequence->index],
            ])
            ->create(['created_by' => $creator->id]);
    }

    /**
     * Download 50 distinct product thumbnails from DummyJSON.
     *
     * @return list<string>
     */
    private function downloadProductThumbnails(int $count): array
    {
        if ($count === 0) {
            return [];
        }

        $catalog = Http::acceptJson()
            ->timeout(30)
            ->retry(2, 500)
            ->get('https://dummyjson.com/products?limit=0&select=thumbnail');

        if (! $catalog->successful()) {
            throw new RuntimeException('Could not download product thumbnails from DummyJSON.');
        }

        $products = $catalog->json('products', []);

        if (! is_array($products)) {
            throw new RuntimeException('DummyJSON returned an invalid product catalog.');
        }

        /** @var list<string> $urls */
        $urls = [];

        foreach ($products as $product) {
            if (! is_array($product)) {
                continue;
            }

            $url = $product['thumbnail'] ?? null;

            if (is_string($url) && str_starts_with($url, 'https://') && ! in_array($url, $urls, true)) {
                $urls[] = $url;
            }
        }

        if (count($urls) < $count) {
            throw new RuntimeException('DummyJSON returned '.count($urls)." product thumbnails; {$count} are required.");
        }

        $output = $this->command?->getOutput();
        $output?->writeln("Downloading {$count} product thumbnails:");
        $progress = $output?->createProgressBar($count);
        $progress?->setFormat('%current%/%max% [%bar%] %percent:3s%%');
        $progress?->start();
        $paths = [];

        foreach (array_slice($urls, 0, $count) as $index => $url) {
            $response = Http::timeout(30)->retry(2, 500)->get($url);
            $contentType = strtolower($response->header('Content-Type'));

            if (! $response->successful() || ! str_starts_with($contentType, 'image/')) {
                throw new RuntimeException("Could not download product thumbnail {$index}.");
            }

            $extension = match (trim(explode(';', $contentType)[0])) {
                'image/png' => 'png',
                'image/webp' => 'webp',
                'image/gif' => 'gif',
                default => 'jpg',
            };
            $path = sprintf('products/seeded-product-%03d.%s', $index + 1, $extension);

            Storage::disk('public')->put($path, $response->body());
            $paths[] = $path;
            $progress?->advance();
        }

        $progress?->finish();
        $output?->writeln('');

        return $paths;
    }
}
