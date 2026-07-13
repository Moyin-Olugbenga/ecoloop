import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import MarketplaceView from "./MarketplaceView";
import { requireUser } from "@/lib/authz";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../actions/user";
import { CartProvider } from "@/lib/cart-context";

export const dynamic = "force-dynamic";

export default async function MarketplacePage() {
  const user = await getCurrentUser();
      
      if (!user) {
        redirect("/signin");
      }
 
  const [rawListings, batchListings, claimedForBatching] = await Promise.all([
    prisma.listing.findMany({
      where: { status: "LISTED", batchItems: { none: {} }, sellerId: { not: user.id } },
      include: { seller: { select: { name: true } }, dumpSite: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.listing.findMany({
      where: { batchItems: { some: {} }, sellerId: { not: user.id } },
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
      <CartProvider>
        <MarketplaceView
        user={user}
        rawListings={rawListings}
        batchListings={batchListings}
        claimedForBatching={claimedForBatching}
        />
      </CartProvider>
    
  );
}