import ComingSoon from '@/app/coming-soon/page';
import ShopPage from '@/app/shop/page';

export default function RootPage() {
  // Vercel-native env check: preview deployments show the shop, production shows coming soon
  if (process.env.VERCEL_ENV === 'preview') {
    return <ShopPage />;
  }
  return <ComingSoon />;
}