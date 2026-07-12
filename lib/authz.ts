import { auth } from "@/auth";

export async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Not authenticated");
  }
  return session.user;
}

export async function requireRole(...allowedRoles: string[]) {
  const user = await requireUser();
  if (!allowedRoles.includes(user.role)) {
    throw new Error(`Forbidden: requires one of [${allowedRoles.join(", ")}]`);
  }
  return user;
}