<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Genre extends Model
{
    //
    use HasFactory;
    protected $table='genres';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
    ];

    public function products() {
        return $this->belongsToMany(Product::class, 'product_genre', 'genre_id', 'product_id');
    }
}
