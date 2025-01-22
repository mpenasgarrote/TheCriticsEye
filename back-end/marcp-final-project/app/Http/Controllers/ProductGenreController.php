<?php

namespace App\Http\Controllers;

use App\Models\Product_Genre;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductGenreController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/product-genres",
     *     summary="Get all product-genre relations",
     *     description="Retrieve all product-genre relations. Optionally filter by product_id or genre_id.",
     *     operationId="getProductGenres",
     *     tags={"ProductGenres"},
     *     @OA\Parameter(
     *         name="product_id",
     *         in="query",
     *         description="Filter by product ID",
     *         required=false,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(
     *         name="genre_id",
     *         in="query",
     *         description="Filter by genre ID",
     *         required=false,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Product-Genre relations fetched successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="true"),
     *             @OA\Property(property="Product-Genre", type="array", 
     *                 @OA\Items(type="object", 
     *                     @OA\Property(property="product_id", type="integer"),
     *                     @OA\Property(property="genre_id", type="integer")
     *                 )
     *             ),
     *             @OA\Property(property="httpCode", type="integer", example=200)
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Internal server error",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="false"),
     *             @OA\Property(property="message", type="string", example="Error message"),
     *             @OA\Property(property="httpCode", type="integer", example=500)
     *         )
     *     )
     * )
     */
    public function index(Request $request)
    {
        $product_id = $request->query('product_id');
        $genre_id = $request->query('genre_id');
    
        try {
            $query = Product_Genre::query();
    
            if ($product_id) {
                $query->where('product_id', $product_id);
            }
    
            if ($genre_id) {
                $query->where('genre_id', $genre_id);
            }
    
            $relations = $query->get();
    
            return response()->json([
                'status' => true,
                'Product-Genre' => $relations,
                'httpCode' => 200
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage(),
                'httpCode' => 500
            ]);
        }
    }

    /**
     * @OA\Post(
     *     path="/api/product-genres",
     *     summary="Create a product-genre relation",
     *     description="Create a new relation between a product and genre.",
     *     operationId="createProductGenre",
     *     tags={"ProductGenres"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 type="object",
     *                 required={"product_id", "genre_id"},
     *                 @OA\Property(property="product_id", type="integer", description="ID of the product"),
     *                 @OA\Property(property="genre_id", type="integer", description="ID of the genre")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Relation created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="true"),
     *             @OA\Property(property="message", type="string", example="Relation created successfully"),
     *             @OA\Property(property="httpCode", type="integer", example=200)
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="false"),
     *             @OA\Property(property="message", type="string", example="Validation errors"),
     *             @OA\Property(property="httpCode", type="integer", example=422)
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Internal server error",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="false"),
     *             @OA\Property(property="message", type="string", example="Error message"),
     *             @OA\Property(property="httpCode", type="integer", example=500)
     *         )
     *     )
     * )
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => ['required', 'integer'],
            'genre_id' => ['required', 'integer'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => $validator->errors(),
                'httpCode' => 422
            ]);
        }

        try {
            Product_Genre::create([
                'product_id' => $request->product_id,
                'genre_id' => $request->genre_id,
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Relation created successfully',
                'httpCode' => 200
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage(),
                'httpCode' => 500
            ]);
        }
    }

    /**
     * @OA\Put(
     *     path="/api/product-genres/{id}",
     *     summary="Update product-genre relations",
     *     description="Update the genres related to a product by its ID.",
     *     operationId="updateProductGenre",
     *     tags={"ProductGenres"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of the product to update genres",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 type="object",
     *                 required={"genres"},
     *                 @OA\Property(property="genres", type="array", 
     *                     @OA\Items(type="integer", description="Genre ID")
     *                 ),
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Relations updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="true"),
     *             @OA\Property(property="message", type="string", example="Relations updated successfully"),
     *             @OA\Property(property="httpCode", type="integer", example=200)
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="false"),
     *             @OA\Property(property="message", type="string", example="Validation errors"),
     *             @OA\Property(property="httpCode", type="integer", example=422)
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Product not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="false"),
     *             @OA\Property(property="message", type="string", example="Product not found"),
     *             @OA\Property(property="httpCode", type="integer", example=404)
     *         )
     *     )
     * )
     */
    public function update(Request $request, string $id)
    {
        try {
            $product = Product::findOrFail($id);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage(),
                'httpCode' => 500
            ]);        
        }

        $validator = Validator::make($request->all(), [
            'genres' => ['required', 'array'],
            'genres.*' => ['integer', 'exists:genres,id'], 
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => $validator->errors(),
                'httpCode' => 422
            ]);
        }

        try {
            $product->genres()->detach(); 
            $product->genres()->attach($request->genres);

            return response()->json([
                'status' => true,
                'message' => 'Relations updated successfully',
                'httpCode' => 200
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage(),
                'httpCode' => 404
            ]);        
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/product-genres",
     *     summary="Delete all relations for a product",
     *     description="Delete all genre relations for a specific product.",
     *     operationId="deleteProductGenres",
     *     tags={"ProductGenres"},
     *     @OA\Parameter(
     *         name="product_id",
     *         in="query",
     *         description="ID of the product to delete relations for",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="All relations deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="true"),
     *             @OA\Property(property="message", type="string", example="All relations deleted successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No relations found for this product",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="false"),
     *             @OA\Property(property="message", type="string", example="No relations found for this product")
     *         )
     *     )
     * )
     */
    public function destroy(Request $request)
    {
        $productId = $request->query('product_id');
        
        $deletedRows = Product_Genre::where('product_id', $productId)->delete();
        
        if ($deletedRows === 0) {
            return response()->json([
                'status' => false,
                'message' => 'No relations found for this product',
            ], 404);  
        }

        return response()->json([
            'status' => true,
            'message' => 'All relations deleted successfully',
        ]);
    }
}
