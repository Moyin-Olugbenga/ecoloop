"use server";

import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/authz";
import { revalidatePath } from "next/cache";

export async function getNotifications() {
  const user = await requireUser();
  return prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function getUnreadNotificationCount() {
  const user = await requireUser();
  return prisma.notification.count({
    where: { userId: user.id, read: false },
  });
}

export async function markNotificationRead(notificationId: string) {
  const user = await requireUser();
  await prisma.notification.updateMany({
    where: { id: notificationId, userId: user.id },
    data: { read: true },
  });
  revalidatePath("/dashboard");
}

export async function markAllNotificationsRead() {
  const user = await requireUser();
  await prisma.notification.updateMany({
    where: { userId: user.id, read: false },
    data: { read: true },
  });
  revalidatePath("/dashboard");
}
