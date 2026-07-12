"use server";

import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/authz";

export async function getSellerDashboard() {
  const user = await requireRole("SELLER", "ADMIN");

  const listings = await prisma.listing.findMany({
    where: { sellerId: user.id },
    include: { middleman: { select: { name: true } }, order: true },
    orderBy: { createdAt: "desc" },
  });

  return {
    listed: listings.filter((l) => l.status === "LISTED"),
    claimed: listings.filter((l) => l.status === "CLAIMED"),
    sold: listings.filter((l) => l.status === "SOLD"),
  };
}

// --- Middleman: what they've claimed (unsorted) and batches they've created ---
export async function getMiddlemanDashboard() {
  const user = await requireRole("MIDDLEMAN", "ADMIN");

  const claimedRaw = await prisma.listing.findMany({
    where: { middlemanId: user.id, sourceListingId: null },
    include: { seller: { select: { name: true } }, dumpSite: true },
    orderBy: { createdAt: "desc" },
  });

  const batches = await prisma.listing.findMany({
    where: { sellerId: user.id }, // middleman is "seller" of their own batches
    include: { batchItems: true, order: { include: { buyer: true } } },
    orderBy: { createdAt: "desc" },
  });

  return {
    claimedUnsorted: claimedRaw.filter((l) => l.status === "CLAIMED"),
    batches,
  };
}

// --- Buyer: purchase history ---
export async function getBuyerDashboard() {
  const user = await requireRole("BUYER", "ADMIN");

  const orders = await prisma.order.findMany({
    where: { buyerId: user.id },
    include: {
      listing: {
        include: { batchItems: { include: { seller: true, dumpSite: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return orders;
}

// --- School: their tutorial engagement across the platform ---
export async function getSchoolDashboard() {
  const user = await requireRole("SCHOOL", "ADMIN");

  const [watched, allTutorials, uploaded] = await Promise.all([
    prisma.tutorialView.findMany({
      where: { userId: user.id },
      include: { tutorial: true },
      orderBy: { watchedAt: "desc" },
    }),
    prisma.tutorial.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.tutorial.findMany({ where: { uploadedById: user.id } }),
  ]);

  const watchedIds = new Set(watched.map((w) => w.tutorialId));
  const categoriesCovered = new Set(
    watched.map((w) => w.tutorial.category).filter(Boolean)
  );

  return {
    watched,
    totalTutorials: allTutorials.length,
    completedCount: watched.length,
    categoriesCovered: categoriesCovered.size,
    uploaded,
    // per-tutorial progress: watched or not (no partial-watch tracking yet)
    progress: allTutorials.map((t) => ({
      id: t.id,
      title: t.title,
      watched: watchedIds.has(t.id),
    })),
  };
}

// --- Admin: platform-wide snapshot ---
export async function getAdminDashboard() {
  await requireRole("ADMIN");

  const [userCount, listingCounts, totalVolumeKg, siteCount, tutorialCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.listing.groupBy({ by: ["status"], _count: true }),
      prisma.listing.aggregate({ _sum: { quantityKg: true } }),
      prisma.dumpSite.count(),
      prisma.tutorial.count(),
    ]);

  return {
    userCount,
    listingCounts, // e.g. [{ status: "LISTED", _count: 4 }, ...]
    totalVolumeKg: totalVolumeKg._sum.quantityKg ?? 0,
    siteCount,
    tutorialCount,
  };
}