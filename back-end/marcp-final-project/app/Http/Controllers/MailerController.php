<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Mailer;
use App\Models\User;
use Exception;

class MailerController extends Controller
{
    //
    public function sendResetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);
    
        $user = User::where('email', $request->email)->first();
    
        if (!$user) {
            return response()->json(['error' => 'No user found with this email address'], 404);
        }
    
        $token = $user->createToken($user->username . ' Password Reset Token')->plainTextToken;
    
        try {
            $mailer = new Mailer();
            $mailer->mailServerSetup();
            $mailer->addRec($user->email, $user->name);
            $mailer->addPasswordResetContent([
                'name' => $user->name,
                'token' => $token 
            ]);
            $mailer->send();
    
            return response()->json(['message' => 'Reset email sent successfully'], 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to send email: ' . $e->getMessage()], 500);
        }
    }
}    