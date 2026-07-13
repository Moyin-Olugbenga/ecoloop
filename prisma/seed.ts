import { PrismaClient, Role, WasteType, ListingStatus } from "../app/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding...");

  // Demo password for every seeded user — fine for a hackathon demo, never do this in prod
  const demoPassword = await bcrypt.hash("password123", 10);

  // --- Users ---
  const seller1 = await prisma.user.create({
    data: {
      name: "Amaka Obi",
      email: "amaka@example.com",
      password: demoPassword,
      role: Role.SELLER,
      emailVerified: new Date(),
      lga: "Ife Central LGA",
      phone: "+2348012345678",
    },
  });
  const seller2 = await prisma.user.create({
    data: {
      name: "Tunde Bello",
      email: "tunde@example.com",
      password: demoPassword,
      role: Role.SELLER,
      emailVerified: new Date(),
      lga: "Ife Central LGA",
      phone: "+2348023456789",
    },
  });
  const middleman = await prisma.user.create({
    data: {
      name: "Chidi Waste Collectors",
      email: "chidi@example.com",
      password: demoPassword,
      role: Role.MIDDLEMAN,
      emailVerified: new Date(),
      lga: "Ife East LGA",
      phone: "+2348034567890",
    },
  });
  const buyer = await prisma.user.create({
    data: {
      name: "GreenCycle Manufacturing",
      email: "greencycle@example.com",
      password: demoPassword,
      role: Role.BUYER,
      emailVerified: new Date(),
      lga: "Ife Central LGA",
      phone: "+2348045678901",
    },
  });
  const school = await prisma.user.create({
    data: {
      name: "OAU Staff School",
      email: "oaustaffschool@example.com",
      password: demoPassword,
      role: Role.SCHOOL,
      emailVerified: new Date(),
      lga: "Ife Central LGA",
      phone: "+2348056789012",
    },
  });
  const admin = await prisma.user.create({
    data: {
      name: "TrashVill Admin",
      email: "admin@example.com",
      password: demoPassword,
      role: Role.ADMIN,
      emailVerified: new Date(),
    },
  });

  // --- Dump Sites (fixed coordinates, e.g. around Ile-Ife) ---
  const site1 = await prisma.dumpSite.create({
    data: { name: "Sabo Dump Site", lat: 7.4905, lng: 4.5521, lga: "Ife Central LGA", pollutionScore: 72 },
  });
  const site2 = await prisma.dumpSite.create({
    data: { name: "Mayfair Junction Dump", lat: 7.4772, lng: 4.5601, lga: "Ife East LGA", pollutionScore: 45 },
  });
  const site3 = await prisma.dumpSite.create({
    data: { name: "OAU Estate Dump", lat: 7.5182, lng: 4.5284, lga: "Ife Central LGA", pollutionScore: 60 },
  });

  // --- Simulated sensor readings (a short history per site) ---
  for (const site of [site1, site2, site3]) {
    for (let i = 0; i < 5; i++) {
      const score = Math.max(
        0,
        Math.min(100, site.pollutionScore + Math.floor(Math.random() * 20 - 10))
      );
      await prisma.sensorReading.create({
        data: {
          siteId: site.id,
          score,
          createdAt: new Date(Date.now() - (5 - i) * 1000 * 60 * 60), // spaced hourly
        },
      });
    }
  }

  // --- Listings from sellers ---
  const listing1 = await prisma.listing.create({
    data: {
      sellerId: seller1.id,
      wasteType: WasteType.PLASTIC,
      quantityKg: 12,
      price: 3000,
      location: "Sabo, near market square",
      dumpSiteId: site1.id,
      status: ListingStatus.LISTED,
    },
  });
  const listing2 = await prisma.listing.create({
    data: {
      sellerId: seller2.id,
      wasteType: WasteType.PLASTIC,
      quantityKg: 8,
      price: 2000,
      location: "Mayfair Junction",
      dumpSiteId: site2.id,
      status: ListingStatus.LISTED,
    },
  });
  const listing3 = await prisma.listing.create({
    data: {
      sellerId: seller1.id,
      wasteType: WasteType.EWASTE,
      quantityKg: 3,
      price: 5000,
      location: "Sabo, near market square",
      dumpSiteId: site1.id,
      status: ListingStatus.LISTED,
    },
  });

  // --- Middleman claims listing1 and listing2, then sorts into a batch ---
  await prisma.listing.update({
    where: { id: listing1.id },
    data: { status: ListingStatus.CLAIMED, middlemanId: middleman.id },
  });
  await prisma.listing.update({
    where: { id: listing2.id },
    data: { status: ListingStatus.CLAIMED, middlemanId: middleman.id },
  });

  const batch = await prisma.listing.create({
    data: {
      sellerId: middleman.id, // middleman relists as the "seller" of the sorted batch
      wasteType: WasteType.PLASTIC,
      quantityKg: 20,
      price: 6500,
      location: "Chidi Collection Depot",
      status: ListingStatus.LISTED,
      batchItems: {
        connect: [{ id: listing1.id }, { id: listing2.id }],
      },
    },
  });

  // --- Buyer purchases the batch ---
  await prisma.listing.update({
    where: { id: batch.id },
    data: { status: ListingStatus.SOLD },
  });
  await prisma.order.create({
    data: { listingId: batch.id, buyerId: buyer.id, price: 6500 },
  });

  // --- Tutorials ---
  const tutorial1 = await prisma.tutorial.create({
    data: {
      title: "Sorting Plastic vs E-Waste at Home",
      description: "A quick guide for households to separate resellable waste correctly.",
      videoUrl: "https://example.com/videos/sorting-basics.mp4",
      thumbnailUrl: "https://example.com/thumbs/sorting-basics.jpg",
      category: WasteType.PLASTIC,
      uploadedById: admin.id,
    },
  });
  const tutorial2 = await prisma.tutorial.create({
    data: {
      title: "Upcycling E-Waste into School Projects",
      description: "How kids can turn old electronics into science fair projects.",
      videoUrl: "https://example.com/videos/upcycling-ewaste.mp4",
      thumbnailUrl: "https://example.com/thumbs/upcycling-ewaste.jpg",
      category: WasteType.EWASTE,
      uploadedById: admin.id,
    },
  });

  await prisma.tutorialView.create({
    data: { tutorialId: tutorial1.id, userId: seller1.id },
  });
  await prisma.tutorialView.create({
    data: { tutorialId: tutorial1.id, userId: school.id },
  });
  await prisma.tutorialView.create({
    data: { tutorialId: tutorial2.id, userId: school.id },
  });

  console.log("Seed complete:", {
    users: 5,
    dumpSites: 3,
    listings: 4,
    tutorials: 2,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });