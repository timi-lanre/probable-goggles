
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InviteUserRequest {
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, role, firstName, lastName }: InviteUserRequest = await req.json();
    console.log('Invite user request for email:', email);

    if (!email || !role) {
      console.log('Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Email and role are required' }),
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

    // Get the current user from the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      console.error('Missing authorization header');
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      console.error('Invalid authorization:', userError);
      return new Response(
        JSON.stringify({ error: 'Invalid authorization' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || profile.role !== 'admin') {
      console.error('Admin access check failed:', profileError);
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      console.log('User already exists:', email);
      return new Response(
        JSON.stringify({ error: 'User with this email already exists' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Check for existing pending invitation
    const { data: existingInvitation, error: existingInviteError } = await supabase
      .from('invitations')
      .select('id, status, created_at')
      .eq('email', email)
      .eq('status', 'pending')
      .single();

    if (existingInvitation) {
      console.log('Pending invitation already exists:', email);
      
      // Delete the existing invitation and create a new one
      const { error: deleteError } = await supabase
        .from('invitations')
        .delete()
        .eq('id', existingInvitation.id);

      if (deleteError) {
        console.error('Error deleting existing invitation:', deleteError);
        return new Response(
          JSON.stringify({ error: 'Failed to refresh existing invitation' }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          }
        );
      }
      
      console.log('Deleted existing invitation, creating new one');
    }

    // Generate secure token
    const tokenBytes = new Uint8Array(32);
    crypto.getRandomValues(tokenBytes);
    const inviteToken = Array.from(tokenBytes, byte => byte.toString(16).padStart(2, '0')).join('');

    // Create invitation record
    const { data: invitation, error: inviteError } = await supabase
      .from('invitations')
      .insert({
        email: email,
        role: role,
        first_name: firstName || null,
        last_name: lastName || null,
        token: inviteToken,
        invited_by: user.id,
      })
      .select()
      .single();

    if (inviteError) {
      console.error('Error creating invitation:', inviteError);
      return new Response(
        JSON.stringify({ error: 'Failed to create invitation: ' + inviteError.message }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    console.log('Invitation created successfully:', invitation.id);

    // Get the origin from the request to determine the redirect URL
    const origin = req.headers.get('origin') || req.headers.get('referer')?.split('/').slice(0, 3).join('/');
    
    // Always use HTTPS for production - force HTTPS for all accept URLs
    let acceptUrl = 'https://advisorconnect.ca/accept-invitation';
    
    // Only use localhost for development if explicitly detected
    if (origin && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
      acceptUrl = 'http://localhost:3000/accept-invitation';
    }
    
    const fullAcceptUrl = `${acceptUrl}?token=${inviteToken}`;
    console.log('Using accept URL:', fullAcceptUrl);

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
          subject: 'You\'re Invited to Join Advisor Connect'
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
              <title>You're Invited to Join Advisor Connect</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px;">
              <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <div style="background: #E5D3BC; padding: 40px 20px; text-align: center;">
                  <h1 style="color: #1f2937; margin: 0;">Advisor Connect</h1>
                </div>
                <div style="padding: 40px;">
                  <h2 style="color: #1f2937; margin-bottom: 20px;">Welcome to Advisor Connect!</h2>
                  <p style="margin-bottom: 20px;">
                    ${firstName ? `Hi ${firstName},` : 'Hello!'}<br><br>
                    You've been invited to join Advisor Connect as a <strong>${role}</strong>. 
                    Our platform connects users with trusted financial advisors and provides powerful tools for managing advisor relationships.
                  </p>
                  <div style="text-align: center; margin: 40px 0;">
                    <a href="${fullAcceptUrl}" style="display: inline-block; background: #1f2937; color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600;">
                      Accept Invitation & Create Account
                    </a>
                  </div>
                  <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p style="font-size: 14px; color: #6b7280; margin: 0;">
                      If the button doesn't work, copy and paste this link:
                    </p>
                    <p style="font-size: 13px; color: #3b82f6; word-break: break-all; margin: 10px 0 0 0;">
                      ${fullAcceptUrl}
                    </p>
                  </div>
                  <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                    <p style="font-size: 14px; color: #92400e; margin: 0;">
                      ⚠️ This invitation will expire in 7 days for security reasons. 
                      If you didn't expect this invitation, you can safely ignore this email.
                    </p>
                  </div>
                </div>
                <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                    © 2024 Advisor Connect. All rights reserved.<br>
                    This is an automated message, please do not reply to this email.
                  </p>
                </div>
              </div>
            </body>
            </html>
          `
        }
      ]
    };

    console.log('Sending invitation email to SendGrid...');
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
      
      // Clean up the invitation record if email failed
      await supabase
        .from('invitations')
        .delete()
        .eq('id', invitation.id);
      
      return new Response(
        JSON.stringify({ error: 'Failed to send invitation email' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    console.log('Invitation email sent successfully to:', email);

    return new Response(
      JSON.stringify({ 
        message: 'Invitation sent successfully',
        invitation: {
          id: invitation.id,
          email: invitation.email,
          role: invitation.role,
          expires_at: invitation.expires_at
        }
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in invite-user function:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while sending the invitation: ' + error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
