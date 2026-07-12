import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import MarketplaceView from "./MarketplaceView";
import { requireUser } from "@/lib/authz";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function MarketplacePage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/signin');
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });
  if (!user) redirect('/signin');
 
  const [rawListings, batchListings, claimedForBatching] = await Promise.all([
    prisma.listing.findMany({
      where: { status: "LISTED", batchItems: { none: {} } },
      include: { seller: { select: { name: true } }, dumpSite: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.listing.findMany({
      where: { batchItems: { some: {} } },
      include: { seller: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    user.role === "MIDDLEMAN" || user.role === "ADMIN"
      ? prisma.listing.findMany({
          where: { middlemanId: user.id, status: "CLAIMED" },
        })
      : Promise.resolve([]),
  ]);
  return (
    <MarketplaceView
      user={user}
      rawListings={rawListings}
      batchListings={batchListings}
      claimedForBatching={claimedForBatching}
    />
  );
}