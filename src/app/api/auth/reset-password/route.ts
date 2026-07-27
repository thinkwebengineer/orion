import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendPasswordResetEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      // Don't reveal validation details — always return success
      return NextResponse.json({ success: true })
    }

    const supabase = createAdminClient()

    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email,
    })

    if (error || !data?.properties?.action_link) {
      // Don't reveal whether the email exists
      console.error('generateLink error:', error)
      return NextResponse.json({ success: true })
    }

    // Fire-and-forget the email — don't block on it
    const resetUrl = data.properties.action_link

    sendPasswordResetEmail({ email, resetUrl }).catch((err) => {
      console.error('sendPasswordResetEmail failed:', err)
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('reset-password API error:', err)
    return NextResponse.json({ success: true })
  }
}
