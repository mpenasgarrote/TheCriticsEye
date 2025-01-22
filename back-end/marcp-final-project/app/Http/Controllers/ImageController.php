<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\User;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class ImageController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/upload-product-image",
     *     summary="Upload a product image",
     *     description="Upload an image for a product by product ID.",
     *     operationId="uploadProductImage",
     *     tags={"Images"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 type="object",
     *                 required={"image", "product_id"},
     *                 @OA\Property(
     *                     property="image",
     *                     type="string",
     *                     format="binary",
     *                     description="Image file to upload"
     *                 ),
     *                 @OA\Property(
     *                     property="product_id",
     *                     type="integer",
     *                     description="ID of the product"
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Image uploaded successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Image uploaded successfully"),
     *             @OA\Property(property="url", type="string", example="https://res.cloudinary.com/.../image.jpg")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Failed to upload image",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Failed to upload image: Error message")
     *         )
     *     )
     * )
     */
    public function uploadProductImage(Request $request)
    {
        try {
            $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
                'product_id' => 'required|exists:products,id',
            ]);

            $product = Product::findOrFail($request->product_id);
            $url = $this->uploadImageAndSave($request, $product, 'image');

            return response()->json([
                'status' => 'success',
                'message' => 'Image uploaded successfully',
                'url' => $url,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to upload image: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/api/upload-profile-image",
     *     summary="Upload a user profile image",
     *     description="Upload an image for a user's profile by user ID.",
     *     operationId="uploadProfileImage",
     *     tags={"Images"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 type="object",
     *                 required={"image", "user_id"},
     *                 @OA\Property(
     *                     property="image",
     *                     type="string",
     *                     format="binary",
     *                     description="Image file to upload"
     *                 ),
     *                 @OA\Property(
     *                     property="user_id",
     *                     type="integer",
     *                     description="ID of the user"
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Profile image uploaded successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Profile image uploaded successfully"),
     *             @OA\Property(property="url", type="string", example="https://res.cloudinary.com/.../profile.jpg")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Failed to upload image",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Failed to upload image: Error message")
     *         )
     *     )
     * )
     */
    public function uploadProfileImage(Request $request)
    {
        try {
            $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
                'user_id' => 'required|exists:users,id',
            ]);

            $user = User::findOrFail($request->user_id);
            $url = $this->uploadImageAndSave($request, $user, 'image');

            return response()->json([
                'status' => 'success',
                'message' => 'Profile image uploaded successfully',
                'url' => $url,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to upload image: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Helper function to upload and save the image.
     *
     * @param Request $request
     * @param object $model
     * @param string $field
     * @return string URL of the uploaded image.
     */
    private function uploadImageAndSave(Request $request, $model, $field)
    {
        if (!empty($model->{$field}) && $this->isCloudinaryUrl($model->{$field})) {
            $publicId = $this->extractCloudinaryPublicId($model->{$field});
    
            if ($publicId) {
                Cloudinary::destroy($publicId);
            }
        }
    
        $uploadedFileUrl = Cloudinary::upload($request->file('image')->getRealPath())->getSecurePath();
    
        $model->{$field} = $uploadedFileUrl;
        $model->save();
    
        return $uploadedFileUrl;
    }

    /**
     * Check if a URL belongs to Cloudinary.
     *
     * @param string $url
     * @return bool
     */
    private function isCloudinaryUrl($url)
    {
        $parsedUrl = parse_url($url);
        return isset($parsedUrl['host']) && str_contains($parsedUrl['host'], 'cloudinary.com');
    }

    /**
     * Extract the public ID from a Cloudinary URL.
     *
     * @param string $url
     * @return string|null
     */
    private function extractCloudinaryPublicId($url)
    {
        $path = parse_url($url, PHP_URL_PATH);

        $parts = explode('/', $path);
        $filename = end($parts); 

        return pathinfo($filename, PATHINFO_FILENAME);
    }
}
