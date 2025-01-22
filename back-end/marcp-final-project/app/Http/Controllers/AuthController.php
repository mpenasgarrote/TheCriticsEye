<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

/**
 * @OA\Schema(
 *     schema="User",
 *     type="object",
 *     title="User",
 *     required={"name", "username", "email", "password"},
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="John Doe"),
 *     @OA\Property(property="username", type="string", example="johndoe"),
 *     @OA\Property(property="email", type="string", example="johndoe@example.com"),
 *     @OA\Property(property="password", type="string", example="secretpassword"),
 *     @OA\Property(property="image", type="string", example="http://example.com/image.jpg")
 * )
 */
class AuthController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/register",
     *     summary="Register a new user",
     *     description="Register a new user by providing name, username, email, and password.",
     *     operationId="registerUser",
     *     tags={"Authentication"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 type="object",
     *                 required={"name", "username", "email", "password"},
     *                 @OA\Property(
     *                     property="name",
     *                     type="string",
     *                     description="Full name of the user"
     *                 ),
     *                 @OA\Property(
     *                     property="username",
     *                     type="string",
     *                     description="Username for the user, unique"
     *                 ),
     *                 @OA\Property(
     *                     property="email",
     *                     type="string",
     *                     format="email",
     *                     description="User email address, unique"
     *                 ),
     *                 @OA\Property(
     *                     property="password",
     *                     type="string",
     *                     format="password",
     *                     description="User password"
     *                 ),
     *                 @OA\Property(
     *                     property="image",
     *                     type="string",
     *                     description="Optional user profile image URL"
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="User registered successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="true"),
     *             @OA\Property(property="message", type="string", example="User created successfully"),
     *             @OA\Property(property="user", type="object", ref="#/components/schemas/User"),
     *             @OA\Property(property="token", type="string", example="Bearer token_value")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="false"),
     *             @OA\Property(property="message", type="string", example="Error in register"),
     *             @OA\Property(property="errors", type="object", description="Validation errors"),
     *             @OA\Property(property="httpCode", type="integer", example=422)
     *         )
     *     )
     * )
     */
    public function register(Request $request) {
        $this->checkUserAuth();

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|email|unique:users',
            'password' => 'required|confirmed|min:5'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Error in register',
                'errors' => $validator->errors(),
                'httpCode' => 422
            ]);
        }

        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'image' => $request->image ?: null
        ]);

        event(new Registered($user));

        Auth::login($user);

        $token = $user->createToken($user->username.' Access Token')->plainTextToken;

        return response()->json([
            'status' => true,
            'message' => 'User created successfully',
            'user' => User::find($user->id),
            'token' => $token,
            'httpCode' => 200
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/login",
     *     summary="Login a user",
     *     description="Authenticate a user by email or username and password.",
     *     operationId="loginUser",
     *     tags={"Authentication"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 type="object",
     *                 required={"email_or_username", "password"},
     *                 @OA\Property(
     *                     property="email_or_username",
     *                     type="string",
     *                     description="User's email address or username"
     *                 ),
     *                 @OA\Property(
     *                     property="password",
     *                     type="string",
     *                     format="password",
     *                     description="User's password"
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Login successful",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="true"),
     *             @OA\Property(property="message", type="string", example="Login successful"),
     *             @OA\Property(property="token", type="string", example="Bearer token_value"),
     *             @OA\Property(property="user", type="object", ref="#/components/schemas/User")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Invalid credentials",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="false"),
     *             @OA\Property(property="message", type="string", example="Login Error: Invalid credentials"),
     *             @OA\Property(property="httpCode", type="integer", example=404)
     *         )
     *     )
     * )
     */
    public function login(Request $request) {
        // Validación de los campos requeridos
        $request->validate([
            'email_or_username' => 'required|string',
            'password' => 'required|string',
        ]);
    
        // Verifica si el usuario está autenticado
        $this->checkUserAuth();
    
        // Intenta autenticación por email o username
        $credentials = [
            ['email' => $request->email_or_username, 'password' => $request->password],
            ['username' => $request->email_or_username, 'password' => $request->password],
        ];
    
        $authenticated = false;
        foreach ($credentials as $credential) {
            if (Auth::attempt($credential)) {
                $authenticated = true;
                break;
            }
        }
    
        // Si la autenticación es exitosa
        if ($authenticated) {
            $user = Auth::user();
            $token = $user->createToken('api-Token')->plainTextToken;
    
            return response()->json([
                'status' => true,
                'token' => $token,
                'user' => User::find($user->id),
                'message' => 'Login successful',
                'httpCode' => 200
            ]);
        } else {
            // Respuesta de error si las credenciales no coinciden
            return response()->json([
                'status' => false,
                'message' => 'Login Error: Invalid credentials',
                'httpCode' => 404
            ]);
        }
    }

    /**
     * @OA\Post(
     *     path="/api/logout",
     *     summary="Logout a user",
     *     description="Logout the currently authenticated user.",
     *     operationId="logoutUser",
     *     tags={"Authentication"},
     *     @OA\Response(
     *         response=200,
     *         description="User logged out successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="true"),
     *             @OA\Property(property="message", type="string", example="User Logout Succesful"),
     *             @OA\Property(property="httpCode", type="integer", example=200)
     *         )
     *     )
     * )
     */
    public function logout(Request $request) {
        $user = Auth::user();

        // $user->tokens->delete();

        Log::info('Logout request received');
        Log::info('Authorization Header:', $request->header('Authorization'));
        Log::info('Authenticated User:', Auth::user());
        
        return response()->json([
            'status' => true,
            'message' => 'User Logout Succesful',
            'httpCode' => 200
        ]);
    }
}
