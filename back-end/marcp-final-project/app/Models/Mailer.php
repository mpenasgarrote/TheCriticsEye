<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class Mailer  extends PHPMailer
{
        function mailServerSetup()
        {
            //Server settings
            //$this->SMTPDebug = SMTP::DEBUG_SERVER; //Enable verbose debug output
            $this->isSMTP(); //Send using SMTP
            $this->Host = 'smtp.gmail.com'; //Set the SMTP server to send through
            $this->SMTPAuth = true; //Enable SMTP authentication
            $this->Username = 'marc.penas@cirvianum.cat'; //SMTP username
            $this->Password = 'mqzu icty dtcl rcju'; //SMTP password
            $this->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; //Enable implicit TLS encryption
            $this->Port = 465; //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`
    
        }
    
        // function addRec($to, $cc = array(), $bcc = array())
        function addRec($mail, $name)
        {
            $this->setFrom('phpmailer.marc.penas@cirvianum.cat', "The Critic's Eye");
            // foreach ($to as $address) {
                $this->addAddress($mail, $name);
            // }
            // foreach ($cc as $address) {
            //     $this->addCC($address);
            // }
            //Enable implicit TLS encryptio
            //     $this->addBCC($address);
            // }
        }
    
        function addAttachments($att)
        {
            foreach ($att as $attachment) {
                $this->addAttachment($attachment);
            }
        }
    
        /*
            Correu per a verificació de correu.
        */
        function addVerifyContent($user = null)
        {
            $this->isHTML(true);
            $this->Subject = 'Verify your email please...';
            
            $content = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; color: #333; border: 1px solid #ddd; border-radius: 8px;'>
                            <h2 style='color: #333;'>Hello, ".$user['name']."!</h2>
                            <p style='font-size: 16px; line-height: 1.5;'>Thank you for registering. Please click the button below to verify your email and complete your registration.</p>
                            <div style='text-align: center; margin: 20px 0;'>
                                <a href='http://localhost:8085/user/verify/".$user['username']."/".$user['token']."' style='display: inline-block; padding: 12px 24px; background-color: #007bff; color: #fff; text-decoration: none; font-weight: bold; border-radius: 4px;'>Verify Your Email</a>
                            </div>
                            <p style='font-size: 14px; color: #666;'>If you did not create an account, please ignore this email.</p>
                        </div>";
                        
            $this->Body = $content;
        }
    
        /**
     * Email content for password reset.
     */
    function addPasswordResetContent($user = null)
    {
        // if (!isset($user['name'], $user['token'])) {
        //     throw new Exception("Missing user information for password reset email.");
        // }
    
        $this->isHTML(true);
        $this->Subject = 'Reset Your Password';
    
        $resetUrl = "http://localhost:5174/password-reset/" . $user['token'];
    
        $content = "
        <div style='font-family: \"Poppins\", Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: rgb(224, 224, 224); color: #333; border: 1px solid #ddd; border-radius: 8px;'>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');
                body {
                    font-family: 'Poppins', sans-serif;
                }
                a {
                    transition: all 0.3s ease;
                }
                a:hover {
                    transform: scale(1.1);
                    background-color: #f1c40f;
                }
            </style>
            <div style='background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 4px 12px rgba(0,0,0,0.1);'>
                <h2 style='color: #333; font-size: 26px; text-align: center;'>Forgot your Password?</h2>
                <hr style='margin-top: 15px; margin-bottom: 15px;'>
                <p style='font-size: 18px; line-height: 1.5; text-align: center; color: #555;'>
                    Hello, <strong>" . htmlspecialchars($user['name']) . "</strong>!
                </p>
                <p style='font-size: 16px; line-height: 1.5; text-align: center; color: #555;'>
                    It seems like you requested to reset your password. Don't worry, we've been there too :)
                </p>
                <p style='font-size: 16px; line-height: 1.5; text-align: center; color: #555;'>
                    Click the button below to reset your password. If you didn't request this, just ignore this email.
                </p>
                <div style='text-align: center; margin: 30px 0;'>
                    <a href='" . htmlspecialchars($resetUrl) . "' 
                       style='display: inline-block; padding: 14px 28px; background-color:rgb(18, 17, 17); color: #fff; text-decoration: none; font-weight: bold; border-radius: 5px;'>
                       RESET YOUR PASSWORD
                    </a>
                </div>
                <hr style='border: none; border-top: 1px solid #ddd; margin: 30px 0;'>
                <p style='font-size: 12px; text-align: center; color: #aaa;'>
                    This email was sent from <a href='http://localhost:5174/' style='color: rgb(239, 247, 0); text-decoration: none;'>The Critic's Eye</a>. 
                    Please do not reply to this email.
                </p>
            </div>
        </div>";
    
        $this->Body = $content;
    }
        
    }
