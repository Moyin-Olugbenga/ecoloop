// app/cart/page.tsx (Server Component wrapper)
export const dynamic = 'force-dynamic';

import CartContent from './CartContent';

export default function CartPage() {
  return <CartContent />;
}