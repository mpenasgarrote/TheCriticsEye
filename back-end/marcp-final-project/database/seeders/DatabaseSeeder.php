<?php

namespace Database\Seeders;

use App\Models\Genre;
use App\Models\ProductType;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Administrator',
            'username' => 'admin',
            'password' => bcrypt('admin'),
            'email' => 'admin@example.com'
        ]);

        User::factory()->create([
            'name' => 'Marc Penas',
            'username' => 'marcp',
            'password' => bcrypt('123'),
            'email' => 'marc@example.com'
        ]);

        $this->runTypes();
        $this->runGenres();
    }

    private function runGenres() {
        Genre::factory()->create([
            'name' => 'Action',
        ]);

        Genre::factory()->create([
            'name' => 'Adventure',
        ]);

        Genre::factory()->create([
            'name' => 'Fiction',
        ]);

        Genre::factory()->create([
            'name' => 'Fantasy',
        ]);

        Genre::factory()->create([
            'name' => 'Thriller',
        ]);
    }

    private function runTypes() {
        ProductType::factory()->create([
            'name' => 'Book',
        ]);

        ProductType::factory()->create([
            'name' => 'Movie',
        ]);

        ProductType::factory()->create([
            'name' => 'Game',
        ]);
    }
}
