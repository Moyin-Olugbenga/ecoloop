"use server";

import { prisma } from "@/lib/db";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { consumeToken, createToken } from "@/lib/tokens";
import { activationEmailHtml, passwordResetEmailHtml, sendEmail } from "@/lib/email";
import { getSession } from "next-auth/react";

const APP_URL = process.env.APP_URL ?? "http://localhost:3000";

export async function signUp(input: {
  name: string;
  email: string;
  password: string;
  role: Role;
  lga?: string;
  phone?: string;
}) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new Error("An account with this email already exists");
  }

  const hashed = await bcrypt.hash(input.password, 10);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashed,
      role: input.role,
      lga: input.lga,
      phone: input.phone,
    },
  });

  const token = await createToken(user.id, "ACTIVATION");
  const activationUrl = `${APP_URL}/activate?token=${token}`;

  await sendEmail({
    to: user.email,
    subject: "Activate your TrashVill account",
    html: activationEmailHtml(activationUrl),
  });

  return { id: user.id, email: user.email, role: user.role };
}

// --- Activate account from the emailed token ---
export async function activateAccount(token: string) {
  const user = await consumeToken(token, "ACTIVATION");

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: new Date() },
  });

  return { activated: true, email: user.email };
}

// --- Resend activation link (e.g. user lost the email or it expired) ---
export async function resendActivation(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  // Don't reveal whether the email exists — respond the same either way
  if (!user || user.emailVerified) {
    return { sent: true };
  }

  const token = await createToken(user.id, "ACTIVATION");
  const activationUrl = `${APP_URL}/activate?token=${token}`;

  await sendEmail({
    to: user.email,
    subject: "Activate your TrashVill account",
    html: activationEmailHtml(activationUrl),
  });

  return { sent: true };
}

// --- Request a password reset link ---
export async function requestPasswordReset(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  // Same response whether or not the account exists, to avoid leaking who has an account
  if (!user) {
    return { sent: true };
  }

  const token = await createToken(user.id, "PASSWORD_RESET");
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;

  await sendEmail({
    to: user.email,
    subject: "Reset your TrashVill password",
    html: passwordResetEmailHtml(resetUrl),
  });

  return { sent: true };
}

// --- Reset password using the emailed token ---
export async function resetPassword(token: string, newPassword: string) {
  if (newPassword.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  const user = await consumeToken(token, "PASSWORD_RESET");
  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed },
  });

  return { reset: true };
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session || !session.user) return null;
  
  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role
  };
}