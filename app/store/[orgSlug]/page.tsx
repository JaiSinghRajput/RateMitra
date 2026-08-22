import { notFound } from 'next/navigation';
import { clerkClient } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import PriceItem from '@/models/PriceItem';
import OrgSettings from '@/models/OrgSettings';
import PublicPriceList from '@/components/PublicPriceList';
import NotFound from '@/app/not-found';

export default async function PublicSharePage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;

  try {
    const clerk = await clerkClient();
    await dbConnect();

    // Look up the organization by its official Clerk slug
    let org;
    try {
      org = await clerk.organizations.getOrganization({ slug: orgSlug });
    } catch (e) {
      return <NotFound />;
    }

    const orgId = org.id;
    const orgName = org.name;
    
    const settings = await OrgSettings.findOne({ organizationId: orgId });

    const prices = await PriceItem.find({ 
      organizationId: orgId,
      isVisible: true 
    }).sort({ createdAt: -1 });

    // Serialize MongoDB documents for Client Component
    const serializedPrices = prices.map(doc => ({
      _id: doc._id.toString(),
      name: doc.name,
      nameHi: doc.nameHi,
      price: doc.price,
      qty: doc.qty,
      unit: doc.unit,
      isVisible: doc.isVisible
    }));

    const theme = settings ? {
      primaryColor: settings.primaryColor,
      backgroundColor: settings.backgroundColor,
      backgroundImage: settings.backgroundImage,
      fontColor: settings.fontColor,
      cardBackgroundColor: settings.cardBackgroundColor
    } : {
      primaryColor: '#1264E8',
      backgroundColor: '#F8FAFC',
      backgroundImage: '',
      fontColor: '#172033',
      cardBackgroundColor: 'rgba(255, 255, 255, 1)'
    };

    return <PublicPriceList items={serializedPrices} orgName={orgName} orgId={orgId} theme={theme} />;
  } catch (error) {
    console.error(error);
    return notFound();
  }
}
