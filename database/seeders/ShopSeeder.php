<?php

namespace Database\Seeders;

use App\Models\Shop;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class ShopSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $owners = User::query()->role('shop_owner')->orderBy('id')->limit(10)->get();
        $shopCount = 12;

        if ($owners->isEmpty()) {
            return;
        }

        $logoPaths = $this->downloadShopLogos($shopCount);

        foreach (range(1, $shopCount) as $number) {
            $owner = $owners[($number - 1) % $owners->count()];

            Shop::factory()->create([
                'owner_id' => $owner->id,
                'name' => $number === 1 ? 'Demo Shop' : "Demo Shop {$number}",
                'slug' => $number === 1 ? 'demo-shop' : "demo-shop-{$number}",
                'logo' => $logoPaths[$number - 1],
            ]);
        }
    }

    /**
     * Download one logo image for each seeded shop.
     *
     * @return list<string>
     */
    private function downloadShopLogos(int $count): array
    {
        if ($count === 0) {
            return [];
        }

        $output = $this->command?->getOutput();
        $output?->writeln("Downloading {$count} shop logos:");
        $progress = $output?->createProgressBar($count);
        $progress?->setFormat('%current%/%max% [%bar%] %percent:3s%%');
        $progress?->start();
        $paths = [];

        foreach (range(1, $count) as $number) {
            $response = Http::timeout(30)
                ->retry(2, 500)
                ->get('https://api.dicebear.com/9.x/initials/png', [
                    'seed' => "Demo Shop {$number}",
                    'size' => 512,
                ]);
            $contentType = strtolower($response->header('Content-Type'));

            if (! $response->successful() || ! str_starts_with($contentType, 'image/')) {
                throw new RuntimeException("Could not download logo for seeded shop {$number}.");
            }

            $path = sprintf('shops/seeded-shop-%03d.png', $number);
            Storage::disk('public')->put($path, $response->body());
            $paths[] = $path;
            $progress?->advance();
        }

        $progress?->finish();
        $output?->writeln('');

        return $paths;
    }
}
