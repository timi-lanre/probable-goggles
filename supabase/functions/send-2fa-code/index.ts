
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user by email
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
    if (userError) {
      console.error('Error fetching users:', userError);
      return new Response(
        JSON.stringify({ error: 'Failed to find user' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate 4-digit code
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Clean up any existing codes for this user
    await supabase
      .from('user_2fa_codes')
      .delete()
      .eq('user_id', user.id);

    // Store the new code
    const { error: insertError } = await supabase
      .from('user_2fa_codes')
      .insert({
        user_id: user.id,
        code,
        expires_at: expiresAt.toISOString(),
        purpose: 'login'
      });

    if (insertError) {
      console.error('Error storing 2FA code:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to store verification code' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send email with code
    if (sendgridApiKey) {
      try {
        const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sendgridApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            personalizations: [{
              to: [{ email }],
              subject: 'Your Advisor Connect Verification Code'
            }],
            from: { email: 'noreply@advisorconnect.ca', name: 'Advisor Connect' },
            content: [{
              type: 'text/html',
              value: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Secure Account Access</title>
                  <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                    
                    * {
                      margin: 0;
                      padding: 0;
                      box-sizing: border-box;
                    }
                    
                    body {
                      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
                      line-height: 1.6;
                      color: #1a202c;
                      background: linear-gradient(135deg, #F0E6D1 0%, #E5D3BC 100%);
                      margin: 0;
                      padding: 20px 0;
                      min-height: 100vh;
                    }
                    
                    .email-wrapper {
                      max-width: 680px;
                      margin: 0 auto;
                      background: #ffffff;
                      border-radius: 24px;
                      overflow: hidden;
                      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    }
                    
                    .header {
                      background: linear-gradient(135deg, #E5D3BC 0%, #C8B299 50%, #B5A082 100%);
                      padding: 60px 40px;
                      text-align: center;
                      position: relative;
                      overflow: hidden;
                    }
                    
                    .header::before {
                      content: '';
                      position: absolute;
                      top: -50%;
                      left: -50%;
                      width: 200%;
                      height: 200%;
                      background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
                      background-size: 20px 20px;
                      animation: float 20s ease-in-out infinite;
                    }
                    
                    @keyframes float {
                      0%, 100% { transform: translateY(0px) rotate(0deg); }
                      50% { transform: translateY(-10px) rotate(5deg); }
                    }
                    
                    .logo-container {
                      position: relative;
                      z-index: 2;
                      margin-bottom: 20px;
                    }
                    
                    .logo {
                      height: 80px;
                      width: auto;
                      filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15));
                    }
                    
                    .header-text {
                      position: relative;
                      z-index: 2;
                      color: #2d3748;
                      font-size: 18px;
                      font-weight: 500;
                      margin-top: 12px;
                      opacity: 0.9;
                    }
                    
                    .content {
                      padding: 60px 50px;
                      background: linear-gradient(180deg, #ffffff 0%, #faf9f7 100%);
                    }
                    
                    .security-badge {
                      display: inline-flex;
                      align-items: center;
                      gap: 8px;
                      background: linear-gradient(135deg, #8b5a3c 0%, #6d4428 100%);
                      color: white;
                      padding: 12px 24px;
                      border-radius: 50px;
                      font-size: 14px;
                      font-weight: 600;
                      margin-bottom: 32px;
                      box-shadow: 0 4px 12px rgba(139, 90, 60, 0.3);
                    }
                    
                    .shield-icon {
                      width: 16px;
                      height: 16px;
                      fill: currentColor;
                    }
                    
                    .main-title {
                      font-size: 36px;
                      font-weight: 700;
                      color: #1a202c;
                      text-align: center;
                      margin-bottom: 16px;
                      letter-spacing: -0.025em;
                      line-height: 1.2;
                    }
                    
                    .subtitle {
                      font-size: 20px;
                      color: #4a5568;
                      text-align: center;
                      margin-bottom: 48px;
                      font-weight: 400;
                      line-height: 1.5;
                    }
                    
                    .description {
                      font-size: 16px;
                      color: #2d3748;
                      line-height: 1.7;
                      margin-bottom: 40px;
                      text-align: center;
                      max-width: 480px;
                      margin-left: auto;
                      margin-right: auto;
                    }
                    
                    .verification-card {
                      background: linear-gradient(135deg, #f7f5f3 0%, #f0ebe7 100%);
                      border: 2px solid #e8dfd6;
                      border-radius: 20px;
                      padding: 48px 32px;
                      text-align: center;
                      margin: 40px 0;
                      position: relative;
                      overflow: hidden;
                    }
                    
                    .verification-card::before {
                      content: '';
                      position: absolute;
                      top: 0;
                      left: 0;
                      right: 0;
                      height: 6px;
                      background: linear-gradient(90deg, #E5D3BC 0%, #C8B299 50%, #B5A082 100%);
                    }
                    
                    .code-label {
                      font-size: 16px;
                      color: #5d4e37;
                      margin-bottom: 20px;
                      font-weight: 600;
                      text-transform: uppercase;
                      letter-spacing: 0.1em;
                    }
                    
                    .verification-code {
                      font-size: 56px;
                      font-weight: 900;
                      color: #1a202c;
                      letter-spacing: 12px;
                      font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
                      margin: 20px 0;
                      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                      background: linear-gradient(135deg, #8b5a3c 0%, #5d4e37 100%);
                      -webkit-background-clip: text;
                      -webkit-text-fill-color: transparent;
                      background-clip: text;
                    }
                    
                    .expiry-info {
                      display: inline-flex;
                      align-items: center;
                      gap: 8px;
                      background: #fef2f2;
                      color: #c53030;
                      padding: 12px 20px;
                      border-radius: 12px;
                      font-size: 14px;
                      font-weight: 600;
                      margin-top: 24px;
                    }
                    
                    .clock-icon {
                      width: 16px;
                      height: 16px;
                      fill: currentColor;
                    }
                    
                    .security-notice {
                      background: linear-gradient(135deg, #fef5e7 0%, #f6e7d0 100%);
                      border: 1px solid #d6c4a7;
                      border-radius: 16px;
                      padding: 24px;
                      margin: 32px 0;
                      position: relative;
                    }
                    
                    .notice-title {
                      display: flex;
                      align-items: center;
                      gap: 10px;
                      font-weight: 700;
                      color: #8b5a3c;
                      margin-bottom: 12px;
                      font-size: 16px;
                    }
                    
                    .warning-icon {
                      width: 20px;
                      height: 20px;
                      fill: currentColor;
                    }
                    
                    .notice-text {
                      font-size: 14px;
                      color: #6d4428;
                      line-height: 1.6;
                      margin: 0;
                    }
                    
                    .footer {
                      background: linear-gradient(135deg, #5d4e37 0%, #3d2e1f 100%);
                      padding: 48px 40px;
                      text-align: center;
                      color: #f7f5f3;
                    }
                    
                    .footer-logo {
                      height: 40px;
                      width: auto;
                      margin-bottom: 24px;
                      opacity: 0.9;
                    }
                    
                    .footer-text {
                      font-size: 14px;
                      line-height: 1.6;
                      margin: 8px 0;
                      opacity: 0.8;
                    }
                    
                    .company-name {
                      font-weight: 700;
                      color: #E5D3BC;
                      font-size: 16px;
                    }
                    
                    .divider {
                      height: 1px;
                      background: linear-gradient(90deg, transparent 0%, #8b5a3c 50%, transparent 100%);
                      margin: 24px 0;
                    }
                    
                    @media only screen and (max-width: 600px) {
                      body {
                        padding: 10px 0;
                      }
                      
                      .email-wrapper {
                        margin: 0 16px;
                        border-radius: 16px;
                      }
                      
                      .header {
                        padding: 40px 24px;
                      }
                      
                      .content {
                        padding: 40px 24px;
                      }
                      
                      .main-title {
                        font-size: 28px;
                      }
                      
                      .subtitle {
                        font-size: 18px;
                      }
                      
                      .verification-code {
                        font-size: 40px;
                        letter-spacing: 8px;
                      }
                      
                      .verification-card {
                        padding: 32px 20px;
                      }
                      
                      .footer {
                        padding: 32px 24px;
                      }
                    }
                    
                    @media (prefers-color-scheme: dark) {
                      /* Dark mode styles can be added here if needed */
                    }
                  </style>
                </head>
                <body>
                  <div class="email-wrapper">
                    <!-- Header Section -->
                    <div class="header">
                      <div class="logo-container">
                        <img src="https://mjbwicrfdgywnvzpmfla.supabase.co/storage/v1/object/public/logos/advisor-connect-logo.png" alt="Advisor Connect" class="logo">
                      </div>
                      <div class="header-text">Trusted Financial Advisory Platform</div>
                    </div>
                    
                    <!-- Main Content -->
                    <div class="content">
                      <div style="text-align: center;">
                        <div class="security-badge">
                          <svg class="shield-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11V12z"/>
                          </svg>
                          Secure Authentication
                        </div>
                      </div>
                      
                      <h1 class="main-title">Account Verification</h1>
                      <p class="subtitle">Complete your secure login process</p>
                      
                      <p class="description">
                        We've generated a secure verification code for your Advisor Connect account. 
                        Please enter this code in the application to complete your authentication and 
                        gain access to your personalized dashboard.
                      </p>
                      
                      <div class="verification-card">
                        <div class="code-label">Your Verification Code</div>
                        <div class="verification-code">${code}</div>
                        <div class="expiry-info">
                          <svg class="clock-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                          Expires in 10 minutes
                        </div>
                      </div>
                      
                      <div class="security-notice">
                        <div class="notice-title">
                          <svg class="warning-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                          </svg>
                          Security Notice
                        </div>
                        <p class="notice-text">
                          This verification code is confidential and should never be shared with anyone.
                        </p>
                      </div>
                    </div>
                    
                    <!-- Footer Section -->
                    <div class="footer">
                      <img src="https://mjbwicrfdgywnvzpmfla.supabase.co/storage/v1/object/public/logos/advisor-connect-logo.png" alt="Advisor Connect" class="footer-logo">
                      <div class="divider"></div>
                      <p class="footer-text">
                        <span class="company-name">Advisor Connect</span><br>
                        Connecting you with Canada's most trusted financial advisors
                      </p>
                      <p class="footer-text">© 2024 Advisor Connect Inc. All rights reserved.</p>
                      <p class="footer-text" style="opacity: 0.6;">
                        This message was sent to ${email}. This is an automated security notification.
                      </p>
                    </div>
                  </div>
                </body>
                </html>
              `
            }]
          }),
        });

        if (!emailResponse.ok) {
          const errorText = await emailResponse.text();
          console.error('SendGrid API error:', errorText);
        } else {
          console.log('Email sent successfully via SendGrid');
        }
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // Don't fail the request if email fails, code is still stored
      }
    } else {
      console.log('SendGrid API key not configured, skipping email send');
    }

    console.log('2FA code sent successfully for user:', user.id);

    return new Response(
      JSON.stringify({ success: true, message: 'Verification code sent' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-2fa-code function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
