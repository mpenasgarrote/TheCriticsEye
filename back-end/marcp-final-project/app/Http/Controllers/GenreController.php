<?php

namespace App\Http\Controllers;

use App\Models\Genre;
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
 *     schema="Genre",
 *     type="object",
 *     title="Genre",
 *     required={"name"},
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Rock")
 * )
 */
class GenreController extends Controller
{

    /**
     * @OA\Get(
     *     path="/api/genres",
     *     summary="Get all genres",
     *     description="Retrieve a list of all genres.",
     *     operationId="getAllGenres",
     *     tags={"Genres"},
     *     @OA\Response(
     *         response=200,
     *         description="Successfully retrieved genres",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="true"),
     *             @OA\Property(property="genres", type="array", @OA\Items(ref="#/components/schemas/Genre")),
     *             @OA\Property(property="httpCode", type="integer", example=200)
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Internal Server Error",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="false"),
     *             @OA\Property(property="message", type="string", example="Error retrieving genres"),
     *             @OA\Property(property="httpCode", type="integer", example=500)
     *         )
     *     )
     * )
     */
    public function index()
    {
        $genres = Genre::all();

        try {
            return response()->json([
                'status' => true,
                'genres' => $genres,
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
     *     path="/api/genres",
     *     summary="Create a new genre",
     *     description="Create a new genre by providing a name.",
     *     operationId="createGenre",
     *     tags={"Genres"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 type="object",
     *                 required={"name"},
     *                 @OA\Property(
     *                     property="name",
     *                     type="string",
     *                     description="Name of the genre"
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Genre created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="true"),
     *             @OA\Property(property="message", type="string", example="Genre created successfully"),
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
            $genre = Genre::create($request->all());

            return response()->json([
                'status' => true,
                'message' => 'Genre created successfully',
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
     *     path="/api/genres/{id}",
     *     summary="Get a genre by ID",
     *     description="Retrieve a specific genre by its ID.",
     *     operationId="getGenreById",
     *     tags={"Genres"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID of the genre",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successfully retrieved genre",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="true"),
     *             @OA\Property(property="message", type="object", ref="#/components/schemas/Genre"),
     *             @OA\Property(property="httpCode", type="integer", example=200)
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Genre not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="false"),
     *             @OA\Property(property="message", type="string", example="Genre not found"),
     *             @OA\Property(property="httpCode", type="integer", example=404)
     *         )
     *     )
     * )
     */
    public function show(string $id)
    {
        $genre = Genre::find($id);
        if (is_null($genre)) {
            return response()->json([
                'status' => false,
                'message' => 'Genre not found',
                'httpCode' => 404
            ]);
        }

        try {
            return response()->json([
                'status' => true,
                'message' => $genre,
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
     *     path="/api/genres/{id}",
     *     summary="Update a genre",
     *     description="Update a genre's details by providing its ID and new information.",
     *     operationId="updateGenre",
     *     tags={"Genres"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID of the genre to update",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 type="object",
     *                 required={"name"},
     *                 @OA\Property(
     *                     property="name",
     *                     type="string",
     *                     description="Name of the genre"
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Genre updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="true"),
     *             @OA\Property(property="message", type="string", example="Genre updated successfully"),
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
    public function update(Request $request, string $id)
    {
        try {
            $genre = Genre::findOrFail($id);
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
            $genre->update($request->all());
            return response()->json([
                'status' => true,
                'message' => 'Genre updated successfully',
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
     *     path="/api/genres/{id}",
     *     summary="Delete a genre",
     *     description="Delete a genre by its ID.",
     *     operationId="deleteGenre",
     *     tags={"Genres"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID of the genre to delete",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Genre deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="true"),
     *             @OA\Property(property="message", type="string", example="Genre deleted successfully")
     *         )
     *     )
     * )
     */
    public function destroy(string $id)
    {
        $genre = Genre::findOrFail($id);

        $genre->delete();

        return response()->json([
            'status' => true,
            'message' => 'Genre deleted successfully',
        ]);        
    }
}
