"use server";

import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/authz";
import { reverseGeocodeToLga } from "@/lib/geocode";
import { revalidatePath } from "next/cache";

export async function createDumpSite(input: {
  name: string;
  lat: number;
  lng: number;
}) {
  await requireRole("ADMIN");

  const lga = await reverseGeocodeToLga(input.lat, input.lng);

  const site = await prisma.dumpSite.create({
    data: {
      name: input.name,
      lat: input.lat,
      lng: input.lng,
      lga, // null if geocoding failed - site still gets created, just without LGA matching for notifications
    },
  });

  revalidatePath("/map");
  return site;
}

// Backfill LGA for existing sites that predate this feature (e.g. seeded ones)
export async function backfillDumpSiteLga(dumpSiteId: string) {
  await requireRole("ADMIN");

  const site = await prisma.dumpSite.findUnique({ where: { id: dumpSiteId } });
  if (!site) throw new Error("Dump site not found");
  if (site.lga) return site; // already has one, don't overwrite

  const lga = await reverseGeocodeToLga(site.lat, site.lng);
  if (!lga) throw new Error("Could not determine LGA for these coordinates");

  const updated = await prisma.dumpSite.update({
    where: { id: dumpSiteId },
    data: { lga },
  });

  revalidatePath("/map");
  return updated;
}