<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
/**
 * @OA\Info(
 *     title="The Critic's Eye API",
 *     version="1.0.0",
 *     description="API documentation for The Critic's Eye project"
 * )
 */

/**
 * @OA\Schema(
 *     schema="Product",
 *     type="object",
 *     title="Product",
 *     required={"name", "price"},
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Sample Product"),
 *     @OA\Property(property="description", type="string", example="This is a sample product."),
 *     @OA\Property(property="price", type="number", format="float", example=19.99),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2023-01-01T00:00:00Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2023-01-01T00:00:00Z")
 * )
 */
class ProductController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/products",
     *     summary="Get all products",
     *     description="Retrieve a list of all products, with optional filters and sorting.",
     *     operationId="getAllProducts",
     *     tags={"Products"},
     *     @OA\Parameter(
     *         name="title_contains",
     *         in="query",
     *         required=false,
     *         description="Search products by title (contains)",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="sort",
     *         in="query",
     *         required=false,
     *         description="Sort products by a given field (e.g., 'created_at:desc')",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="limit",
     *         in="query",
     *         required=false,
     *         description="Limit the number of results returned",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(
     *         name="created_at",
     *         in="query",
     *         required=false,
     *         description="Filter products created within a specific timeframe",
     *         @OA\Schema(type="string", enum={"this_week"})
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successfully retrieved products",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="true"),
     *             @OA\Property(property="products", type="array", @OA\Items(ref="#/components/schemas/Product")),
     *             @OA\Property(property="httpCode", type="integer", example=200)
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Internal Server Error",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="false"),
     *             @OA\Property(property="message", type="string", example="Error retrieving products"),
     *             @OA\Property(property="httpCode", type="integer", example=500)
     *         )
     *     )
     * )
     */
    public function index(Request $request)
    {
        $query = Product::query();
        
        foreach ($request->all() as $key => $value) {
            if (in_array($key, (new Product)->getFillable())) {
                $query->where($key, $value);
            }
        }

        if ($request->has('title_contains')) {
            $titleContains = $request->input('title_contains');
            $query->where('title', 'LIKE', '%' . $titleContains . '%');
        }
    
        if ($request->has('sort')) {
            $sort = explode(':', $request->input('sort'));
            if (count($sort) == 2) {
                $query->orderBy($sort[0], $sort[1]);
            }
        }
    
        if ($request->has('limit')) {
            $query->limit($request->input('limit'));
        }
    
        if ($request->has('created_at') && $request->input('created_at') === 'this_week') {
            $now = new \DateTimeImmutable();
            $startOfWeek = $now->setTime(0, 0)->modify('last Sunday'); // Start of the current week
            $endOfWeek = $now->setTime(23, 59, 59)->modify('next Saturday'); // End of the current week
            $query->whereBetween('created_at', [$startOfWeek->format('Y-m-d H:i:s'), $endOfWeek->format('Y-m-d H:i:s')]);
        }
    
        try {
            $products = $query->get();
    
            return response()->json([
                'status' => true,
                'products' => $products,
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
     *     path="/api/products",
     *     summary="Create a new product",
     *     description="Create a new product with the given details.",
     *     operationId="createProduct",
     *     tags={"Products"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 type="object",
     *                 required={"title", "description", "type_id", "author", "user_id"},
     *                 @OA\Property(
     *                     property="title",
     *                     type="string",
     *                     description="Title of the product"
     *                 ),
     *                 @OA\Property(
     *                     property="description",
     *                     type="string",
     *                     description="Description of the product"
     *                 ),
     *                 @OA\Property(
     *                     property="type_id",
     *                     type="integer",
     *                     description="Type ID of the product"
     *                 ),
     *                 @OA\Property(
     *                     property="author",
     *                     type="string",
     *                     description="Author of the product"
     *                 ),
     *                 @OA\Property(
     *                     property="user_id",
     *                     type="integer",
     *                     description="User ID associated with the product"
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Product created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="true"),
     *             @OA\Property(property="product", ref="#/components/schemas/Product"),
     *             @OA\Property(property="message", type="string", example="Product created successfully"),
     *             @OA\Property(property="httpCode", type="integer", example=200)
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation Error",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="false"),
     *             @OA\Property(property="message", type="string", example="Validation errors"),
     *             @OA\Property(property="httpCode", type="integer", example=422)
     *         )
     *     )
     * )
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => ['required', 'string', 'max:50'],
            'description' => ['required', 'string', 'max:255'],
            'type_id' => ['required', 'integer'],
            'author' => ['required', 'string', 'max:50'],
            'user_id' => ['required', 'integer'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => $validator->errors(),
                'httpCode' => 422
            ]);
        }

        try {
            $product = Product::create($request->all());

            $product->updateScore();
    
            return response()->json([
                'status' => true,
                'product' => $product,
                'message' => 'Product created successfully',
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
     *     path="/api/products/{id}",
     *     summary="Get product by ID",
     *     description="Retrieve a specific product by its ID.",
     *     operationId="getProductById",
     *     tags={"Products"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID of the product to retrieve",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successfully retrieved product",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="true"),
     *             @OA\Property(property="message", ref="#/components/schemas/Product"),
     *             @OA\Property(property="httpCode", type="integer", example=200)
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
    public function show(string $id)
    {
        $product = Product::find($id);
        if (is_null($product)) {
            return response()->json([
                'status' => false,
                'message' => 'Product not found',
                'httpCode' => 404
            ]);
        }

        try {
            return response()->json([
                'status' => true,
                'message' => $product,
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
         * Show the form for editing the specified resource.
         */
        public function edit(string $id)
        {
            //
        }
    
        /**
         * Update the specified resource in storage.
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
                'title' => ['required', 'string', 'max:50'],
                'description' => ['required', 'string', 'max:255'],
                'type_id' => ['required', 'integer'],
                'author' => ['required', 'string', 'max:50'],
            ]);
    
            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => $validator->errors(),
                    'httpCode' => 422
                ]);
            }
    
            try {
                $product->update($request->all());

                $product->updateScore();

                return response()->json([
                    'status' => true,
                    'message' => 'Product updated sucessfully',
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
     *     path="/api/products/{id}",
     *     summary="Delete a product by ID",
     *     description="Delete a specific product by its ID.",
     *     operationId="deleteProduct",
     *     tags={"Products"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID of the product to delete",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Product deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="true"),
     *             @OA\Property(property="message", type="string", example="Product deleted successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Product not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="false"),
     *             @OA\Property(property="message", type="string", example="Product not found"),
     *         )
     *     )
     * )
     */
        public function destroy(string $id)
        {
            $product = Product::findOrFail($id);

            $product->delete();

            return response()->json([
                'status' => true,
                'message' => 'Product deleted successfully',
            ]);        
        }
}
