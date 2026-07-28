import ComingSoon from '@/app/coming-soon/page';
import ShopPage from '@/app/shop/page';

export default function RootPage() {
  // In development, show shop for easier local testing
  if (typeof window === 'undefined') {
    // During SSR, check Vercel env
    if (process.env.VERCEL_ENV === 'preview') {
      return <ShopPage />;
    }
    // Production (or any other env) shows coming soon
    return <ComingSoon />;
  }
  // On client, we can also check window.location.hostname if needed, but relying on env is fine
  // This component will be rendered on both server and client; we already handled SSR.
  // For safety, fallback to coming soon.
  return <ComingSoon />;
}