// app/actions/user.ts
"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}