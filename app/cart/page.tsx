// app/cart/page.tsx (Server Component wrapper)

import { requireUser } from "@/lib/authz";
import { prisma } from "@/lib/db";
import CartContent from "./CartContent";
import { redirect } from "next/navigation";
import { CartProvider } from "@/lib/cart-context";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const sessionUser = await requireUser();
  const user = await prisma.user.findUnique({ where: { id: sessionUser.id } });
  
  if (!user) redirect("/signin");

  return (
  
    <CartProvider>
        <CartContent user={user} />;
    </CartProvider>
    )
}