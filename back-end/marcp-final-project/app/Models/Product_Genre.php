<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product_Genre extends Model
{
    //
    use HasFactory;
    protected $table='product_genre';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'product_id',
        'genre_id'
    ];

    
    public function genres() {
        return $this->belongsTo(Genre::class, 'genre_id');
    }

    
    public function products() {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
