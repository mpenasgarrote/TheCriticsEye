<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductGenreController;
use App\Http\Controllers\ProductTypeController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\MailerController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::middleware(['auth:sanctum'])->group(function() {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::apiResource('genres', GenreController::class);
    Route::apiResource('product-types', ProductTypeController::class);
    Route::apiResource('products', ProductController::class);
    Route::apiResource('product-genres', ProductGenreController::class);
    Route::delete('/product-genres', [ProductGenreController::class, 'destroy']);
    Route::apiResource('reviews', ReviewController::class);
    Route::apiResource('users', UserController::class);
    Route::apiResource('comments', CommentController::class);

    Route::get('/hasReview', [ReviewController::class, 'hasReview']);

    Route::post('/uploadProductImage', [ImageController::class, 'uploadProductImage']);


    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

});

Route::get('hola-mon/{nom}', function () {
    return 'Hola, '. request('nom');
});

// Route::apiResource('products', ProductController::class);

Route::post('/sendPasswordReset', [MailerController::class, 'sendResetPassword']);
Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/uploadProfileImage', [ImageController::class, 'uploadProfileImage']);