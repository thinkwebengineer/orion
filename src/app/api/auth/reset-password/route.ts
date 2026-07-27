import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendPasswordResetEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ success: true })
    }

    const supabase = createAdminClient()

    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email,
    })

    if (error || !data?.properties?.action_link) {
      console.error('generateLink error:', error)
      return NextResponse.json({ success: true })
    }

    // The action_link is a Supabase auth URL like:
    // https://project.supabase.co/auth/v1/verify?token=pkce_xxx&type=recovery&redirect_to=...
    // Extract the token and construct our own direct URL
    const actionLink = data.properties.action_link
    const url = new URL(actionLink)
    const token = url.searchParams.get('token')

    if (!token) {
      console.error('No token in action_link:', actionLink)
      return NextResponse.json({ success: true })
    }

    // Build a direct URL to our reset-password page with the token_hash
    const origin = request.headers.get('origin') || 'https://orion-blue-psi.vercel.app'
    const resetUrl = `${origin}/reset-password?token_hash=${encodeURIComponent(token)}&type=recovery`

    // Fire-and-forget the email
    sendPasswordResetEmail({ email, resetUrl }).catch((err) => {
      console.error('sendPasswordResetEmail failed:', err)
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('reset-password API error:', err)
    return NextResponse.json({ success: true })
  }
}
