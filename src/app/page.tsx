import { redirect } from 'next/navigation'

export default function HomePage() {
  // On Vercel production, show coming soon
  if (process.env.VERCEL_ENV === 'production') {
    redirect('/coming-soon')
  }
  // On preview/dev, show the full home page (handled by layout)
  redirect('/shop')
}
