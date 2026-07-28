import ComingSoon from '@/app/coming-soon/page';
import ShopPage from '@/app/shop/page';

export default function RootPage() {
  // Determine environment: on server, check Vercel env; on client, check hostname or Vercel env if available
  let isPreview = false;
  if (typeof window === 'undefined') {
    // Server-side
    isPreview = process.env.VERCEL_ENV === 'preview';
  } else {
    // Client-side: we can't rely on process.env, but we can check the hostname
    // Preview deployments are on *.vercel.app, production on custom domain
    const hostname = window.location.hostname;
    isPreview = hostname.endsWith('.vercel.app') && !hostname.includes('goldenmycology.com');
  }
  return isPreview ? <ShopPage /> : <ComingSoon />;
}