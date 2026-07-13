"use server";

import { prisma } from "@/lib/db";
import { WasteType } from "@/app/generated/prisma/enums";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/authz";

// --- Any signed-in user can upload a tutorial ---
export async function createTutorial(input: {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  category?: WasteType;
}) {
  // Relaxed from ADMIN to requireUser so anyone can participate
  const user = await requireUser();

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

export async function getTutorials(category?: WasteType) {
  return prisma.tutorial.findMany({
    where: category ? { category } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      uploadedBy: { select: { name: true } },
      _count: { select: { views: true } },
    },
  });
}

export async function getTutorial(tutorialId: string) {
  return prisma.tutorial.findUnique({
    where: { id: tutorialId },
    include: {
      uploadedBy: { select: { name: true } },
      _count: { select: { views: true } },
    },
  });
}

export async function markTutorialWatched(tutorialId: string) {
  const user = await requireUser();

  await prisma.tutorialView.upsert({
    where: {
      tutorialId_userId: { tutorialId, userId: user.id },
    },
    create: { tutorialId, userId: user.id },
    update: {},
  });

  revalidatePath("/learn");
  return { watched: true };
}

export async function getUserWatchedTutorials(userId: string) {
  return prisma.tutorialView.findMany({
    where: { userId },
    include: { tutorial: true },
    orderBy: { watchedAt: "desc" },
  });
}