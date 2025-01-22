<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CommentController extends Controller
{
    //

    /**
     * Display a listing of the comments.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        // Validate the query parameter
        $request->validate([
            'review_id' => 'required|integer|exists:reviews,id',
        ]);

        $reviewId = $request->query('review_id');

        try {
            // Fetch comments for the given review_id
            $comments = Comment::with('user') // Assuming you want user info
                ->where('review_id', $reviewId)
                ->get();

            return response()->json([
                'success' => true,
                'comments' => $comments,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch comments',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

        /**
     * Añadir un comentario.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'review_id' => ['required', 'integer'],
            'user_id' => ['required', 'integer'],
            'content' => ['required', 'string', 'max:1000'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $comment = Comment::create([
                'review_id' => $request->review_id,
                'user_id' => $request->user_id,
                'content' => $request->content,
            ]);           
            
            return response()->json(['message' => 'Comment added successfully.', 'comment' => $comment], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to add comment.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Modificar un comentario existente.
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $comment = Comment::findOrFail($id);

            // Verifica si el usuario es el propietario del comentario
            if ($request->user()->id !== $comment->userId) {
                return response()->json(['message' => 'Unauthorized action.'], 403);
            }

            $comment->update(['content' => $request->input('content')]);
            return response()->json(['message' => 'Comment updated successfully.', 'comment' => $comment], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to update comment.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Eliminar un comentario.
     */
    public function destroy(Request $request, $id)
    {
        try {
            $comment = Comment::findOrFail($id);

            // if ($request->user()->id !== $comment->userId) {
            //     return response()->json(['message' => 'Unauthorized action.'], 403);
            // }

            $comment->delete();
            return response()->json(['message' => 'Comment deleted successfully.'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to delete comment.', 'error' => $e->getMessage()], 500);
        }
    }
}
