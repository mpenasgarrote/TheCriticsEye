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
        //
        Schema::create('genres', function (Blueprint $table) {
            $table->id(); 
            $table->string('name')->unique(); 
            $table->timestamps(); 
        });

        // Tabla pivot 'book_genre'
        Schema::create('product_genre', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade'); 
            $table->foreignId('genre_id')->constrained('genres')->onDelete('cascade'); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::dropIfExists('genres');
        Schema::dropIfExists('product_genre');
    }
};
