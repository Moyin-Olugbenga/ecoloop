"use server";

import { prisma } from "@/lib/db";
import { ListingStatus, WasteType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/authz";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@/auth";

// Configure Cloudinary SDK with environment tokens
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Internal async helper to securely stream image string data payloads straight to Cloudinary instances
 */
async function uploadToCloudinary(base64ImageString: string): Promise<string> {
  try {
    const uploadResponse = await cloudinary.uploader.upload(base64ImageString, {
      folder: "ecoloop_marketplace_listings",
      resource_type: "auto",
    });
    return uploadResponse.secure_url;
  } catch (error) {
    throw new Error(error instanceof Error ? `Cloudinary Exception: ${error.message}` : "Image upload failed");
  }
}

export async function getListings() {
  const session = await auth();
  if (!session?.user) return [];

  return await prisma.listing.findMany({
    where: { sellerId: session.user.id },
    include: {
      // Include related data
    },
  });
}
export async function getUserListing(id: string) {
    return await prisma.listing.findMany({
        where: {
          OR: [
            { middlemanId: id },
          ]
        },
        orderBy: { updatedAt: 'desc' }
      });
}
export async function getListingById(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  return await prisma.listing.findUnique({
    where: { id },
    include: {
      seller: { select: { name: true, id: true } },
      dumpSite: true,
      middleman: { select: { name: true, id: true } },
      order: { include: { buyer: { select: { name: true } } } },
      batchItems: {
        include: {
          seller: { select: { name: true, id: true } }
        }
      }
    }
  });
}

export async function createListing(input: {
  wasteType: WasteType;
  quantityKg: number;
  price?: number;
  location?: string;
  imageBase64?: string; // Expect base64 or DataURL input from form snap captures
  dumpSiteId?: string;
}) {
  const user = await requireRole("SELLER", "ADMIN");

  let cloudImageUrl: string | undefined = undefined;

  // If a data asset payload string exists, pipe it natively to Cloudinary before running DB inserts
  if (input.imageBase64) {
    cloudImageUrl = await uploadToCloudinary(input.imageBase64);
  }

  const listing = await prisma.listing.create({
    data: {
      sellerId: user.id,
      wasteType: input.wasteType,
      quantityKg: input.quantityKg,
      price: input.price,
      location: input.location,
      imageUrl: cloudImageUrl, // Direct secure asset target url saved to DB
      dumpSiteId: input.dumpSiteId,
      status: ListingStatus.LISTED,
    },
  });

  revalidatePath("/marketplace");
  return listing;
}

// --- Middleman claims a raw listing ---
export async function claimListing(listingId: string) {
  const user = await requireRole("MIDDLEMAN", "ADMIN");

  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing) throw new Error("Listing not found");
  if (listing.status !== ListingStatus.LISTED) {
    throw new Error("Listing is no longer available");
  }

  const updated = await prisma.listing.update({
    where: { id: listingId },
    data: { status: ListingStatus.CLAIMED, middlemanId: user.id },
  });

  revalidatePath("/marketplace");
  revalidatePath("/dashboard");
  return updated;
}

// --- Middleman sorts several claimed listings into one sellable batch ---
export async function createBatch(input: {
  sourceListingIds: string[];
  wasteType: WasteType;
  price?: number;
  location?: string;
}) {
  const user = await requireRole("MIDDLEMAN", "ADMIN");

  const sources = await prisma.listing.findMany({
    where: { id: { in: input.sourceListingIds } },
  });

  if (sources.length !== input.sourceListingIds.length) {
    throw new Error("One or more source listings not found");
  }
  if (sources.some((l) => l.middlemanId !== user.id)) {
    throw new Error("You can only batch listings you've claimed");
  }

  const totalKg = sources.reduce((sum, l) => sum + l.quantityKg, 0);

  const batch = await prisma.listing.create({
    data: {
      sellerId: user.id, // middleman becomes the "seller" of the sorted batch
      wasteType: input.wasteType,
      quantityKg: totalKg,
      price: input.price,
      location: input.location,
      status: ListingStatus.LISTED,
      batchItems: {
        connect: input.sourceListingIds.map((id) => ({ id })),
      },
    },
  });

  revalidatePath("/marketplace");
  revalidatePath("/dashboard");
  return batch;
}

// --- Buyer purchases a listing (raw or batch) ---
export async function purchaseListing(listingId: string) {
  const user = await requireRole("BUYER", "ADMIN");

  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing) throw new Error("Listing not found");
  if (listing.status !== ListingStatus.LISTED) {
    throw new Error("Listing is not available for purchase");
  }
  if (listing.price == null) {
    throw new Error("Listing has no price set");
  }

  const [order] = await prisma.$transaction([
    prisma.order.create({
      data: { listingId, buyerId: user.id, price: listing.price },
    }),
    prisma.listing.update({
      where: { id: listingId },
      data: { status: ListingStatus.SOLD },
    }),
  ]);

  revalidatePath("/marketplace");
  revalidatePath("/dashboard");
  return order;
}

// --- Buyer checks out a cart of multiple listings at once ---
export async function purchaseListings(listingIds: string[]) {
  const user = await requireRole("BUYER", "ADMIN");

  const results: { id: string; ok: boolean; error?: string }[] = [];

  for (const id of listingIds) {
    try {
      const listing = await prisma.listing.findUnique({ where: { id } });
      if (!listing) throw new Error("Listing not found");
      if (listing.status !== ListingStatus.LISTED) throw new Error("No longer available");
      if (listing.price == null) throw new Error("Listing has no price set");

      await prisma.$transaction([
        prisma.order.create({
          data: { listingId: id, buyerId: user.id, price: listing.price },
        }),
        prisma.listing.update({
          where: { id: id },
          data: { status: ListingStatus.SOLD },
        }),
      ]);
      results.push({ id, ok: true });
    } catch (err) {
      results.push({ id, ok: false, error: err instanceof Error ? err.message : "Failed" });
    }
  }

  revalidatePath("/marketplace");
  revalidatePath("/dashboard");
  return results;
}

// --- Trace a listing's full chain, source household(s) up through the batch ---
export async function getListingProvenance(listingId: string) {
  return prisma.listing.findUnique({
    where: { id: listingId },
    include: {
      seller: true,
      middleman: true,
      dumpSite: true,
      batchItems: { include: { seller: true, dumpSite: true } },
      sourceListing: true,
      order: { include: { buyer: true } },
    },
  });
}

// --- Seller updates an existing listing before it sells ---
export async function updateListing(input: {
  id: string;
  wasteType: WasteType;
  quantityKg: number;
  price?: number;
  location?: string;
  imageBase64?: string;
}) {
  const user = await requireRole("SELLER", "MIDDLEMAN", "ADMIN");

  const existing = await prisma.listing.findUnique({ where: { id: input.id } });
  if (!existing) throw new Error("Listing parameters not found");
  if (existing.status === ListingStatus.SOLD) {
    throw new Error("Cannot update a completed batch transaction.");
  }
  if (existing.sellerId !== user.id && existing.middlemanId !== user.id) {
    throw new Error("Unauthorized update modification request.");
  }

  let cloudImageUrl = existing.imageUrl;
  if (input.imageBase64 && !input.imageBase64.startsWith('http')) {
    cloudImageUrl = await uploadToCloudinary(input.imageBase64);
  }

  const updated = await prisma.listing.update({
    where: { id: input.id },
    data: {
      wasteType: input.wasteType,
      quantityKg: input.quantityKg,
      price: input.price,
      location: input.location,
      imageUrl: cloudImageUrl,
    },
  });

  revalidatePath("/marketplace");
  revalidatePath("/dashboard/my-ledger");
  return updated;
}