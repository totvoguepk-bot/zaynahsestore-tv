import { redirect } from 'next/navigation';

export const revalidate = 0; // Dynamic server rendering

export default function CheckoutPage() {
  redirect('/cart?step=checkout');
}
