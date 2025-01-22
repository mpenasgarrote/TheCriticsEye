<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Review;
use App\Models\Product;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/reviews",
     *     summary="Get reviews",
     *     description="Retrieve all reviews, optionally filter by product_id or user_id.",
     *     operationId="getReviews",
     *     tags={"Reviews"},
     *     @OA\Parameter(
     *         name="product_id",
     *         in="query",
     *         description="Filter by product ID",
     *         required=false,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(
     *         name="user_id",
     *         in="query",
     *         description="Filter by user ID",
     *         required=false,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Reviews fetched successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="true"),
     *             @OA\Property(property="reviews", type="array", 
     *                 @OA\Items(type="object", 
     *                     @OA\Property(property="id", type="integer"),
     *                     @OA\Property(property="title", type="string"),
     *                     @OA\Property(property="content", type="string"),
     *                     @OA\Property(property="score", type="integer"),
     *                     @OA\Property(property="user_id", type="integer"),
     *                     @OA\Property(property="product_id", type="integer")
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
        $user_id = $request->query('user_id');
    
        try {
            $query = Review::query();
    
            if ($product_id) {
                $query->where('product_id', $product_id);
            }
    
            if ($user_id) {
                $query->where('user_id', $user_id);
            }
    
            $reviews = $query->get();
    
            return response()->json([
                'status' => true,
                'reviews' => $reviews,
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
     * @OA\Get(
     *     path="/api/reviews/has-review",
     *     summary="Check if a user has reviewed a product",
     *     description="Check if a user has already reviewed a particular product.",
     *     operationId="hasReview",
     *     tags={"Reviews"},
     *     @OA\Parameter(
     *         name="product_id",
     *         in="query",
     *         description="Product ID to check for a review",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(
     *         name="user_id",
     *         in="query",
     *         description="User ID to check if they reviewed the product",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Review found",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="true"),
     *             @OA\Property(property="review", type="object",
     *                 @OA\Property(property="id", type="integer"),
     *                 @OA\Property(property="title", type="string"),
     *                 @OA\Property(property="content", type="string"),
     *                 @OA\Property(property="score", type="integer"),
     *                 @OA\Property(property="user_id", type="integer"),
     *                 @OA\Property(property="product_id", type="integer")
     *             ),
     *             @OA\Property(property="httpCode", type="integer", example=200)
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Review not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="false"),
     *             @OA\Property(property="message", type="string", example="Review not found"),
     *             @OA\Property(property="httpCode", type="integer", example=404)
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Bad request - missing product_id or user_id",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="false"),
     *             @OA\Property(property="message", type="string", example="Both product_id and user_id are required."),
     *             @OA\Property(property="httpCode", type="integer", example=400)
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
    public function hasReview(Request $request)
    {
        $product_id = $request->query('product_id');
        $user_id = $request->query('user_id');
    
        if (!$product_id || !$user_id) {
            return response()->json([
                'status' => false,
                'message' => 'Both product_id and user_id are required.',
                'httpCode' => 400
            ]);
        }
    
        try {
            $review = Review::where('product_id', $product_id)
                ->where('user_id', $user_id)
                ->first();
    
            if ($review) {
                return response()->json([
                    'status' => true,
                    'review' => $review,
                    'httpCode' => 200
                ]);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Review not found.',
                    'httpCode' => 404
                ]);
            }
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
     *     path="/api/reviews",
     *     summary="Create a new review",
     *     description="Submit a new review for a product.",
     *     operationId="createReview",
     *     tags={"Reviews"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 type="object",
     *                 required={"title", "content", "score", "user_id", "product_id"},
     *                 @OA\Property(property="title", type="string", description="Title of the review"),
     *                 @OA\Property(property="content", type="string", description="Content of the review"),
     *                 @OA\Property(property="score", type="integer", description="Rating score (1 to 100)"),
     *                 @OA\Property(property="user_id", type="integer", description="ID of the user submitting the review"),
     *                 @OA\Property(property="product_id", type="integer", description="ID of the product being reviewed")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Review added successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="true"),
     *             @OA\Property(property="message", type="string", example="Review added and score updated"),
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
            'title' => ['required', 'string', 'max:50'],
            'content' => ['required', 'string', 'max:255'],
            'score' => ['required', 'integer', 'min:1', 'max:100'],
            'user_id' => ['required', 'integer'],
            'product_id' => ['required', 'integer'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => $validator->errors(),
                'httpCode' => 422
            ]);
        }

        try {
            $review = Review::create($request->all());

            $product = $review->product;

            $product->updateScore();

            return response()->json([
                'status' => true,
                'message' => 'Review added and score updated',
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
     * @OA\Get(
     *     path="/api/reviews/{id}",
     *     summary="Get a specific review",
     *     description="Retrieve a specific review by its ID.",
     *     operationId="getReview",
     *     tags={"Reviews"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of the review",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Review fetched successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="true"),
     *             @OA\Property(property="review", type="object",
     *                 @OA\Property(property="id", type="integer"),
     *                 @OA\Property(property="title", type="string"),
     *                 @OA\Property(property="content", type="string"),
     *                 @OA\Property(property="score", type="integer"),
     *                 @OA\Property(property="user_id", type="integer"),
     *                 @OA\Property(property="product_id", type="integer")
     *             ),
     *             @OA\Property(property="httpCode", type="integer", example=200)
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Review not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="false"),
     *             @OA\Property(property="message", type="string", example="Review not found"),
     *             @OA\Property(property="httpCode", type="integer", example=404)
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
    public function show(string $id)
    {
        $review = Review::find($id);

        if (is_null($review)) {
            return response()->json([
                'status' => false,
                'message' => 'Review not found',
                'httpCode' => 404
            ]);
        }

        try {
            return response()->json([
                'status' => true,
                'review' => $review,
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
     *     path="/api/reviews/{id}",
     *     summary="Update an existing review",
     *     description="Update a review's title, content, or score.",
     *     operationId="updateReview",
     *     tags={"Reviews"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of the review",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Property(property="title", type="string", description="Title of the review"),
     *                 @OA\Property(property="content", type="string", description="Content of the review"),
     *                 @OA\Property(property="score", type="integer", description="Rating score (1 to 100)"),
     *                 @OA\Property(property="user_id", type="integer", description="User ID (optional)"),
     *                 @OA\Property(property="product_id", type="integer", description="Product ID (optional)")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Review updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="true"),
     *             @OA\Property(property="message", type="string", example="Review updated and score recalculated"),
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
     *         description="Review not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="false"),
     *             @OA\Property(property="message", type="string", example="Review not found"),
     *             @OA\Property(property="httpCode", type="integer", example=404)
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
    public function update(Request $request, string $id)
    {
        try {
            $review = Review::findOrFail($id);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Review not found',
                'httpCode' => 404
            ]);
        }

        $validator = Validator::make($request->all(), [
            'title' => ['string', 'max:50'],
            'content' => ['string', 'max:255'],
            'score' => ['integer', 'min:1', 'max:100'],
            'user_id' => ['integer'],
            'product_id' => ['integer'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => $validator->errors(),
                'httpCode' => 422
            ]);
        }

        try {
            $review->update($request->all());

            $product = $review->product;

            $product->updateScore();

            return response()->json([
                'status' => true,
                'message' => 'Review updated and score recalculated',
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
     * @OA\Delete(
     *     path="/api/reviews/{id}",
     *     summary="Delete a review",
     *     description="Delete a specific review by its ID.",
     *     operationId="deleteReview",
     *     tags={"Reviews"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of the review",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Review deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="true"),
     *             @OA\Property(property="message", type="string", example="Review deleted and score recalculated"),
     *             @OA\Property(property="httpCode", type="integer", example=200)
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Review not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="false"),
     *             @OA\Property(property="message", type="string", example="Review not found"),
     *             @OA\Property(property="httpCode", type="integer", example=404)
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
    public function destroy(string $id)
    {
        $review = Review::findOrFail($id);

        $product = $review->product;

        try {
            $review->delete();

            $product->updateScore();

            return response()->json([
                'status' => true,
                'message' => 'Review deleted and score recalculated',
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
}
