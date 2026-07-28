import ComingSoon from '@/app/coming-soon/page';
import ShopPage from '@/app/shop/page';
import { headers } from 'next/headers';

export default async function RootPage() {
  const headersList = await headers();
  const host = headersList.get('host') ?? '';
  // Preview deployments are on *.vercel.app, production on custom domain
  const isPreview = host.endsWith('.vercel.app') && !host.includes('goldenmycology.com');
  return isPreview ? <ShopPage /> : <ComingSoon />;
}