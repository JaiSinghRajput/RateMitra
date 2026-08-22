import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import LandingContent from '@/components/LandingContent';

export default async function Home() {
  const { userId, orgId, orgSlug } = await auth();

  if (!userId) {
    return <LandingContent />;
  }

  if (userId) {
    redirect('/dashboard/list');
  }
}
