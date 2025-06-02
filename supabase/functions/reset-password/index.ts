
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ResetPasswordRequest {
  userId: string;
  userEmail: string;
  userName: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, userEmail, userName }: ResetPasswordRequest = await req.json();
    console.log('Admin password reset request for user:', userEmail, 'by admin');

    if (!userId || !userEmail) {
      console.log('Missing required fields');
      return new Response(
        JSON.stringify({ error: 'User ID and email are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Create Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase configuration');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-12) + 'A1!';
    console.log('Generated temporary password for user:', userEmail);

    // Update the user's password using admin API
    const { data: updateResult, error: updateError } = await supabase.auth.admin.updateUserById(
      userId,
      { 
        password: tempPassword,
        // Force password change on next login by updating user metadata
        user_metadata: { 
          must_change_password: true 
        }
      }
    );

    if (updateError) {
      console.error('Error updating user password:', updateError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to update password: ' + updateError.message 
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    console.log('Password updated successfully for user:', userEmail);

    // Send email with temporary password using SendGrid
    const sendGridApiKey = Deno.env.get('SENDGRID_API_KEY');
    if (!sendGridApiKey) {
      console.error('SendGrid API key not configured');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Email service not configured' 
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    const emailData = {
      personalizations: [
        {
          to: [{ email: userEmail }],
          subject: 'Your Advisor Connect Password Has Been Reset'
        }
      ],
      from: {
        email: 'noreply@advisorconnect.ca',
        name: 'Advisor Connect'
      },
      content: [
        {
          type: 'text/html',
          value: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Password Reset</title>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #E5D3BC; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #ffffff; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 8px 8px; }
                .password-box { background: #f8f9fa; padding: 15px; border-radius: 4px; margin: 20px 0; text-align: center; }
                .password { font-size: 18px; font-weight: bold; color: #1f2937; letter-spacing: 2px; }
                .warning { background: #fef3c7; padding: 15px; border-radius: 4px; margin: 20px 0; border-left: 4px solid #f59e0b; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="margin: 0; color: #1f2937;">Advisor Connect</h1>
                </div>
                <div class="content">
                  <h2>Password Reset by Administrator</h2>
                  <p>Hello ${userName},</p>
                  <p>An administrator has reset your Advisor Connect account password. You can now log in using the temporary password below:</p>
                  
                  <div class="password-box">
                    <p style="margin: 0 0 10px 0;">Your temporary password:</p>
                    <div class="password">${tempPassword}</div>
                  </div>
                  
                  <div class="warning">
                    <strong>⚠️ Important Security Notice:</strong>
                    <p style="margin: 5px 0 0 0;">You will be required to change this password when you log in. Please choose a strong, unique password for your account security.</p>
                  </div>
                  
                  <p>To log in:</p>
                  <ol>
                    <li>Visit <a href="https://advisorconnect.ca/auth">https://advisorconnect.ca/auth</a></li>
                    <li>Enter your email: <strong>${userEmail}</strong></li>
                    <li>Enter the temporary password above</li>
                    <li>Follow the prompts to create a new password</li>
                  </ol>
                  
                  <p>If you did not request this password reset, please contact your administrator immediately.</p>
                  
                  <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                  <p style="font-size: 12px; color: #666;">
                    This is an automated message from Advisor Connect. Please do not reply to this email.
                  </p>
                </div>
              </div>
            </body>
            </html>
          `
        }
      ]
    };

    console.log('Sending password reset email to:', userEmail);
    const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendGridApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('SendGrid error response:', errorText);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to send email notification' 
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    console.log('Password reset email sent successfully to:', userEmail);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Password reset successfully. User will receive an email with temporary password.' 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in reset-password function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'An error occurred while resetting the password. Please try again.' 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
