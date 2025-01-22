<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    //
    use HasFactory;
    protected $table='products';

    protected $fillable = [
        'title',
        'description',
        'type_id',
        'user_id',
        'author',
        'image',
        'score'
    ];



    public function user() {
        return $this->belongsTo(User::class);
    }

    public function type() {
        return $this->belongsTo(ProductType::class);
    }

    public function genres() {
        return $this->hasMany(Genre::class, 'product_genre', 'product_id', 'genre_id');
    }

    public function reviews() {
        return $this->hasMany(Review::class);
    }


    public function updateScore() {
        $reviews = $this->reviews; 

        if ($reviews->count() > 0) {
            $totalScore = $reviews->sum('score'); 
            $this->score = $totalScore / $reviews->count(); 
        } else {
            $this->score = 0; 
        }
    
        $this->save();
    }

}
