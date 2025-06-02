import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ForgotPasswordRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: ForgotPasswordRequest = await req.json();
    console.log('Forgot password request for email:', email);

    if (!email) {
      console.log('No email provided');
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Create Supabase client
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

    // Get the origin from the request to determine the redirect URL
    const origin = req.headers.get('origin') || req.headers.get('referer')?.split('/').slice(0, 3).join('/');
    let redirectUrl = 'https://advisorconnect.ca/change-password';
    
    // If origin suggests this is a development environment, use localhost
    if (origin && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
      redirectUrl = 'http://localhost:3000/change-password';
    }
    
    console.log('Using redirect URL:', redirectUrl);

    // Generate password reset link directly without checking user existence first
    // This is more secure as it doesn't reveal whether an account exists
    const { data: resetData, error: resetError } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: redirectUrl
      }
    });

    if (resetError) {
      console.error('Error generating reset link:', resetError);
      // Return success message even on error for security reasons
      return new Response(
        JSON.stringify({ message: 'If an account with that email exists, a password reset link has been sent.' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    console.log('Reset link generated successfully');

    // Send email using SendGrid
    const sendGridApiKey = Deno.env.get('SENDGRID_API_KEY');
    if (!sendGridApiKey) {
      console.error('SendGrid API key not configured');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    const emailData = {
      personalizations: [
        {
          to: [{ email: email }],
          subject: 'Reset Your Advisor Connect Password'
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
              <title>Reset Your Password</title>
              <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                
                * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                }
                
                body {
                  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                  line-height: 1.6;
                  color: #1f2937;
                  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
                  margin: 0;
                  padding: 0;
                }
                
                .email-container {
                  max-width: 600px;
                  margin: 40px auto;
                  background: #ffffff;
                  border-radius: 16px;
                  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                  overflow: hidden;
                }
                
                .header {
                  background: linear-gradient(135deg, #E5D3BC 0%, #d4c2a5 100%);
                  padding: 40px 20px;
                  text-align: center;
                  position: relative;
                }
                
                .header::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.05"><circle cx="30" cy="30" r="2"/></g></svg>') repeat;
                }
                
                .logo {
                  height: 70px;
                  width: auto;
                  position: relative;
                  z-index: 1;
                  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
                }
                
                .content {
                  padding: 50px 40px;
                  background: #ffffff;
                }
                
                .icon-container {
                  width: 80px;
                  height: 80px;
                  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
                  border-radius: 50%;
                  margin: 0 auto 30px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  box-shadow: 0 10px 25px rgba(31, 41, 55, 0.2);
                }
                
                .lock-icon {
                  width: 36px;
                  height: 36px;
                  fill: #ffffff;
                }
                
                .title {
                  font-size: 32px;
                  font-weight: 700;
                  color: #1f2937;
                  text-align: center;
                  margin-bottom: 16px;
                  letter-spacing: -0.02em;
                }
                
                .subtitle {
                  font-size: 18px;
                  color: #6b7280;
                  text-align: center;
                  margin-bottom: 40px;
                  font-weight: 400;
                }
                
                .message {
                  font-size: 16px;
                  color: #4b5563;
                  line-height: 1.7;
                  margin-bottom: 32px;
                  text-align: center;
                }
                
                .button-container {
                  text-align: center;
                  margin: 40px 0;
                }
                
                .reset-button {
                  display: inline-block;
                  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
                  color: #ffffff;
                  text-decoration: none;
                  padding: 18px 36px;
                  border-radius: 12px;
                  font-weight: 600;
                  font-size: 16px;
                  letter-spacing: 0.025em;
                  transition: all 0.3s ease;
                  box-shadow: 0 10px 25px rgba(31, 41, 55, 0.2);
                }
                
                .reset-button:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 15px 35px rgba(31, 41, 55, 0.3);
                }
                
                .link-section {
                  background: #f9fafb;
                  padding: 24px;
                  border-radius: 12px;
                  margin: 32px 0;
                  border-left: 4px solid #E5D3BC;
                }
                
                .link-label {
                  font-size: 14px;
                  color: #6b7280;
                  margin-bottom: 8px;
                  font-weight: 500;
                }
                
                .link-text {
                  font-size: 13px;
                  color: #3b82f6;
                  word-break: break-all;
                  background: #ffffff;
                  padding: 12px;
                  border-radius: 8px;
                  border: 1px solid #e5e7eb;
                  font-family: 'Monaco', 'Menlo', monospace;
                }
                
                .warning {
                  background: #fef3c7;
                  padding: 20px;
                  border-radius: 12px;
                  margin: 32px 0;
                  border-left: 4px solid #f59e0b;
                }
                
                .warning-text {
                  font-size: 14px;
                  color: #92400e;
                  margin: 0;
                  font-weight: 500;
                }
                
                .footer {
                  background: #f9fafb;
                  padding: 32px 40px;
                  text-align: center;
                  border-top: 1px solid #e5e7eb;
                }
                
                .footer-text {
                  font-size: 13px;
                  color: #9ca3af;
                  margin: 8px 0;
                }
                
                .company-name {
                  font-weight: 600;
                  color: #1f2937;
                }
                
                @media only screen and (max-width: 600px) {
                  .email-container {
                    margin: 20px;
                    border-radius: 12px;
                  }
                  
                  .content {
                    padding: 30px 24px;
                  }
                  
                  .title {
                    font-size: 28px;
                  }
                  
                  .subtitle {
                    font-size: 16px;
                  }
                  
                  .reset-button {
                    padding: 16px 28px;
                    font-size: 15px;
                  }
                  
                  .footer {
                    padding: 24px 20px;
                  }
                }
              </style>
            </head>
            <body>
              <div class="email-container">
                <!-- Header with Logo -->
                <div class="header">
                  <img src="https://mjbwicrfdgywnvzpmfla.supabase.co/storage/v1/object/public/logos/advisor-connect-logo.png" alt="Advisor Connect" class="logo">
                </div>
                
                <!-- Main Content -->
                <div class="content">
                  <div class="icon-container">
                    <svg class="lock-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11V12z"/>
                      <path d="M12 7c-1.1 0-2 .9-2 2v2h4V9c0-1.1-.9-2-2-2zm-1 2c0-.55.45-1 1-1s1 .45 1 1v1h-2V9z"/>
                    </svg>
                  </div>
                  
                  <h1 class="title">Reset Your Password</h1>
                  <p class="subtitle">Secure access to your Advisor Connect account</p>
                  
                  <p class="message">
                    We received a request to reset the password for your Advisor Connect account. 
                    Click the button below to create a new secure password and regain access to your account.
                  </p>
                  
                  <div class="button-container">
                    <a href="${resetData.properties?.action_link}" class="reset-button">
                      Reset My Password
                    </a>
                  </div>
                  
                  <div class="link-section">
                    <div class="link-label">If the button doesn't work, copy and paste this link:</div>
                    <div class="link-text">${resetData.properties?.action_link}</div>
                  </div>
                  
                  <div class="warning">
                    <p class="warning-text">
                      ⚠️ This link will expire in 24 hours for security reasons. If you didn't request this password reset, 
                      you can safely ignore this email - your account remains secure.
                    </p>
                  </div>
                </div>
                
                <!-- Footer -->
                <div class="footer">
                  <p class="footer-text">
                    <span class="company-name">Advisor Connect</span> - Connecting you with trusted financial advisors
                  </p>
                  <p class="footer-text">© 2024 Advisor Connect. All rights reserved.</p>
                  <p class="footer-text">This is an automated message, please do not reply to this email.</p>
                </div>
              </div>
            </body>
            </html>
          `
        }
      ]
    };

    console.log('Sending email to SendGrid...');
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
      console.error('SendGrid error status:', emailResponse.status);
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    console.log('Password reset email sent successfully to:', email);

    return new Response(
      JSON.stringify({ 
        message: 'If an account with that email exists, a password reset link has been sent.' 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in forgot-password function:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while processing your request. Please try again.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
