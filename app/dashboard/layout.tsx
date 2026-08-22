import { redirect } from "next/navigation";
import { auth, clerkClient } from "@clerk/nextjs/server";
import DashboardNavbar from "@/components/DashboardNavbar";
import DesktopSidebar from "@/components/DesktopSidebar";
import OrgRequiredState from "@/components/OrgRequiredState";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, orgId, orgSlug } = await auth();

  if (!userId) {
    redirect("/");
  }

  if (!orgId) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNavbar orgSlug={null} />
        <OrgRequiredState />
      </div>
    );
  }
  let shareSlug = orgSlug;

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <DesktopSidebar orgSlug={shareSlug} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardNavbar orgSlug={shareSlug} />
        <main className="flex-1 overflow-y-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
