import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  userId: string
  selectedProjects: any[]
  userEmail?: string
  userName?: string
}

interface EmailData {
  to: string[]
  subject: string
  html: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Parse the request body
    const { userId, selectedProjects, userEmail, userName }: EmailRequest = await req.json()

    // Get user data if not provided
    let email = userEmail
    let name = userName

    if (!email || !name) {
      const { data: userData, error: userError } = await supabaseClient
        .from('users')
        .select('email, full_name')
        .eq('id', userId)
        .single()

      if (userError) {
        throw new Error(`Failed to fetch user data: ${userError.message}`)
      }

      email = email || userData.email
      name = name || userData.full_name || 'Participant'
    }

    // Generate confirmation email HTML
    const emailHtml = generateConfirmationEmail(name, email, selectedProjects)

    // For now, we'll use Resend as the email service
    // You can replace this with your preferred email service
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    
    if (!resendApiKey) {
      // If no email service is configured, just log the email data
      console.log('Email confirmation data:', {
        to: email,
        subject: 'LKHN Hackathon - Project Selection Confirmation',
        selectedProjects: selectedProjects.length,
        timestamp: new Date().toISOString()
      })

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Email logged (no service configured)',
          emailPreview: emailHtml.substring(0, 200) + '...'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Send email using Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'LKHN Hackathon <noreply@lkhntech.com>',
        to: [email],
        subject: 'LKHN Hackathon - Project Selection Confirmation',
        html: emailHtml,
      }),
    })

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text()
      throw new Error(`Email service error: ${errorText}`)
    }

    const emailResult = await emailResponse.json()

    // Update user confirmation status
    await supabaseClient
      .from('users')
      .update({ received_confirmation: true })
      .eq('id', userId)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Confirmation email sent successfully',
        emailId: emailResult.id
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error sending confirmation email:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

function generateConfirmationEmail(userName: string, userEmail: string, selectedProjects: any[]): string {
  const projectsHtml = selectedProjects.map(project => `
    <div style="border: 1px solid #e9ecef; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
      <h3 style="color: #2c3e50; margin: 0 0 8px 0;">${project.projects?.title || project.title}</h3>
      <p style="color: #666; margin: 0 0 12px 0; line-height: 1.6;">
        ${project.projects?.description || project.description}
      </p>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        ${(project.projects?.tags || project.tags || []).map((tag: string) => 
          `<span style="background: linear-gradient(45deg, #667eea, #764ba2); color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px;">${tag}</span>`
        ).join('')}
      </div>
      <div style="margin-top: 12px; font-size: 14px; color: #888;">
        <strong>Status:</strong> ${project.projects?.status || project.status} | 
        <strong>Difficulty:</strong> ${project.projects?.difficulty || project.difficulty}
      </div>
    </div>
  `).join('')

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project Selection Confirmation</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; text-align: center; color: white; margin-bottom: 30px;">
        <h1 style="margin: 0 0 10px 0; font-size: 28px;">LKHN Technologies Hackathon</h1>
        <p style="margin: 0; font-size: 16px; opacity: 0.9;">Project Selection Confirmation</p>
    </div>

    <div style="background: #f8f9fa; padding: 24px; border-radius: 8px; margin-bottom: 24px;">
        <h2 style="color: #2c3e50; margin: 0 0 16px 0;">Hello ${userName}!</h2>
        <p style="margin: 0; color: #666;">
            Thank you for participating in the LKHN Technologies Hackathon! We're excited to confirm that you've successfully selected <strong>${selectedProjects.length}</strong> project${selectedProjects.length !== 1 ? 's' : ''} for the upcoming hackathon.
        </p>
    </div>

    <div style="margin-bottom: 30px;">
        <h2 style="color: #2c3e50; margin: 0 0 20px 0;">Your Selected Projects</h2>
        ${projectsHtml}
    </div>

    <div style="background: #e7f3ff; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin-bottom: 24px;">
        <h3 style="color: #2c3e50; margin: 0 0 12px 0;">What's Next?</h3>
        <ul style="margin: 0; padding-left: 20px; color: #666;">
            <li>Check your dashboard for project updates and team information</li>
            <li>Connect with your mentors and fellow participants</li>
            <li>Prepare for the hackathon start date</li>
            <li>Join our Discord community for real-time collaboration</li>
        </ul>
    </div>

    <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin-bottom: 24px;">
        <h3 style="color: #856404; margin: 0 0 12px 0;">Important Information</h3>
        <ul style="margin: 0; padding-left: 20px; color: #856404;">
            <li><strong>Account Email:</strong> ${userEmail}</li>
            <li><strong>Confirmation Date:</strong> ${new Date().toLocaleDateString()}</li>
            <li><strong>Projects Selected:</strong> ${selectedProjects.length}</li>
            <li><strong>Unique Reference:</strong> ${Math.random().toString(36).substring(2, 15)}</li>
        </ul>
    </div>

    <div style="text-align: center; margin: 30px 0;">
        <a href="${Deno.env.get('SITE_URL') || 'https://your-hackathon-site.com'}/dashboard" 
           style="background: linear-gradient(45deg, #667eea, #764ba2); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
            Visit Your Dashboard
        </a>
    </div>

    <div style="border-top: 1px solid #e9ecef; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
        <p>Need help? Contact us at <a href="mailto:support@lkhntech.com" style="color: #667eea;">support@lkhntech.com</a></p>
        <p style="margin: 10px 0;">
            LKHN Technologies Hackathon Platform<br>
            <a href="${Deno.env.get('SITE_URL') || 'https://your-hackathon-site.com'}" style="color: #667eea; text-decoration: none;">Visit Platform</a>
        </p>
        <p style="margin: 0; font-size: 12px; opacity: 0.7;">
            This email was automatically generated. Please do not reply to this email.
        </p>
    </div>

</body>
</html>
  `
}