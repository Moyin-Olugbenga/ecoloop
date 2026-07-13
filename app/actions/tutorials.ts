"use server";

import { prisma } from "@/lib/db";
import { WasteType } from "@/app/generated/prisma";
import { revalidatePath } from "next/cache";
import { requireRole, requireUser } from "@/lib/authz";

// --- Admin/uploader adds a tutorial ---
export async function createTutorial(input: {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  category?: WasteType;
}) {
  const user = await requireRole("ADMIN");

  const tutorial = await prisma.tutorial.create({
    data: {
      title: input.title,
      description: input.description,
      videoUrl: input.videoUrl,
      thumbnailUrl: input.thumbnailUrl,
      category: input.category,
      uploadedById: user.id,
    },
  });

  revalidatePath("/learn");
  return tutorial;
}

// --- List all tutorials, optionally filtered by category ---
export async function getTutorials(category?: WasteType) {
  return prisma.tutorial.findMany({
    where: category ? { category } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { views: true } },
    },
  });
}

// --- Get one tutorial with detail ---
export async function getTutorial(tutorialId: string) {
  return prisma.tutorial.findUnique({
    where: { id: tutorialId },
    include: {
      uploadedBy: { select: { name: true } },
      _count: { select: { views: true } },
    },
  });
}

// --- Mark a tutorial as watched by the current user (idempotent) ---
export async function markTutorialWatched(tutorialId: string) {
  const user = await requireUser();

  await prisma.tutorialView.upsert({
    where: {
      tutorialId_userId: { tutorialId, userId: user.id },
    },
    create: { tutorialId, userId: user.id },
    update: {}, // already watched, no-op — keeps original watchedAt
  });

  revalidatePath("/learn");
  return { watched: true };
}

// --- Get a user's watch progress, e.g. for a school completion view ---
export async function getUserWatchedTutorials(userId: string) {
  return prisma.tutorialView.findMany({
    where: { userId },
    include: { tutorial: true },
    orderBy: { watchedAt: "desc" },
  });
}