<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

    /**
     * @OA\Info(
     *     title="The Critic's Eye API",
     *     version="1.0.0",
     *     description="API documentation for The Critic's Eye project"
     * )
     */

abstract class Controller
{
    //
    public function checkUserAuth() {
        if (!Auth::check()) {
            return response()->json([
                'status' => false,
                'message' => 'User is logged',
                'httpCode' => 200
            ]);
        }
    }
}
