import { randomBytes } from "crypto";
import { prisma } from "@/lib/db";
import { TokenType } from "@/app/generated/prisma/enums";

const ACTIVATION_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours
const RESET_TTL_MS = 1000 * 60 * 30; // 30 minutes

function generateToken() {
  return randomBytes(32).toString("hex");
}

export async function createToken(userId: string, type: TokenType) {
  const token = generateToken();
  const ttl = type === "ACTIVATION" ? ACTIVATION_TTL_MS : RESET_TTL_MS;

  // Invalidate any previous unused tokens of the same type for this user
  await prisma.verificationToken.updateMany({
    where: { userId, type, usedAt: null },
    data: { usedAt: new Date() }, // mark as used/void so only the newest is valid
  });

  await prisma.verificationToken.create({
    data: {
      token,
      type,
      userId,
      expiresAt: new Date(Date.now() + ttl),
    },
  });

  return token;
}

export async function consumeToken(token: string, type: TokenType) {
  const record = await prisma.verificationToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!record || record.type !== type) {
    throw new Error("Invalid token");
  }
  if (record.usedAt) {
    throw new Error("Token has already been used");
  }
  if (record.expiresAt < new Date()) {
    throw new Error("Token has expired");
  }

  await prisma.verificationToken.update({
    where: { id: record.id },
    data: { usedAt: new Date() },
  });

  return record.user;
}