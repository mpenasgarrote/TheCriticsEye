<?php

namespace App\Http\Controllers;

use App\Models\ProductType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductTypeController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/product-types",
     *     summary="Get all product types",
     *     description="Retrieve all product types.",
     *     operationId="getProductTypes",
     *     tags={"ProductTypes"},
     *     @OA\Response(
     *         response=200,
     *         description="Product types fetched successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="true"),
     *             @OA\Property(property="Types", type="array", 
     *                 @OA\Items(type="object", 
     *                     @OA\Property(property="id", type="integer"),
     *                     @OA\Property(property="name", type="string")
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
    public function index()
    {
        $types = ProductType::all();

        try {
            return response()->json([
                'status' => true,
                'Types' => $types,
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
     *     path="/api/product-types",
     *     summary="Create a product type",
     *     description="Create a new product type.",
     *     operationId="createProductType",
     *     tags={"ProductTypes"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 type="object",
     *                 required={"name"},
     *                 @OA\Property(property="name", type="string", description="Name of the product type")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Product type created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="true"),
     *             @OA\Property(property="message", type="string", example="Type created successfully"),
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
            'name' => ['required', 'string', 'max:50'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => $validator->errors(),
                'httpCode' => 422
            ]);
        }

        try {
            $type = ProductType::create($request->all());

            return response()->json([
                'status' => true,
                'message' => 'Type '.$type->name.' created successfully',
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
     *     path="/api/product-types/{id}",
     *     summary="Get a product type by ID",
     *     description="Retrieve the product type by its ID.",
     *     operationId="getProductTypeById",
     *     tags={"ProductTypes"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of the product type",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Product type fetched successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="true"),
     *             @OA\Property(property="message", type="object", 
     *                 @OA\Property(property="id", type="integer"),
     *                 @OA\Property(property="name", type="string")
     *             ),
     *             @OA\Property(property="httpCode", type="integer", example=200)
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Product type not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="false"),
     *             @OA\Property(property="message", type="string", example="Product type not found"),
     *             @OA\Property(property="httpCode", type="integer", example=404)
     *         )
     *     )
     * )
     */
    public function show(string $id)
    {
        $type = ProductType::find($id);
        if (is_null($type)) {
            return response()->json([
                'status' => false,
                'message' => 'Product not found',
                'httpCode' => 404
            ]);
        }

        try {
            return response()->json([
                'status' => true,
                'message' => $type,
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
     *     path="/api/product-types/{id}",
     *     summary="Update a product type",
     *     description="Update an existing product type by its ID.",
     *     operationId="updateProductType",
     *     tags={"ProductTypes"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of the product type",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 type="object",
     *                 required={"name"},
     *                 @OA\Property(property="name", type="string", description="Updated name of the product type")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Product type updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="true"),
     *             @OA\Property(property="message", type="string", example="Type updated successfully"),
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
     *         description="Product type not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="false"),
     *             @OA\Property(property="message", type="string", example="Product type not found"),
     *             @OA\Property(property="httpCode", type="integer", example=404)
     *         )
     *     )
     * )
     */
    public function update(Request $request, string $id)
    {
        try {
            $type = ProductType::findOrFail($id);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage(),
                'httpCode' => 500
            ]);        
        }

        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:50'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => $validator->errors(),
                'httpCode' => 422
            ]);
        }

        try {
            $type->update($request->all());
            return response()->json([
                'status' => true,
                'message' => 'Type updated successfully',
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
     *     path="/api/product-types/{id}",
     *     summary="Delete a product type",
     *     description="Delete a product type by its ID.",
     *     operationId="deleteProductType",
     *     tags={"ProductTypes"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of the product type",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Product type deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="true"),
     *             @OA\Property(property="message", type="string", example="Type deleted successfully"),
     *             @OA\Property(property="httpCode", type="integer", example=200)
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Product type not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="false"),
     *             @OA\Property(property="message", type="string", example="Product type not found"),
     *             @OA\Property(property="httpCode", type="integer", example=404)
     *         )
     *     )
     * )
     */
    public function destroy(string $id)
    {
        $type = ProductType::findOrFail($id);

        $type->delete();

        return response()->json([
            'status' => true,
            'message' => 'Type deleted successfully',
        ]);        
    }
}
