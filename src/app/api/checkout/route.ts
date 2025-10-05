import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../lib/supabaseClient';

interface CheckoutItem {
  productId: number;
  quantity: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, customerName, customerWA }: { items: CheckoutItem[], customerName: string, customerWA: string } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    // Ambil info produk dari Supabase
    const productPromises = items.map(async (item) => {
      const { data: product } = await supabase
        .from('products')
        .select('name, price')
        .eq('id', item.productId)
        .single();
      return {
        ...product,
        quantity: item.quantity,
        subtotal: product ? product.price * (item.quantity || 1) : 0,
      };
    });

    const products = await Promise.all(productPromises);

    const totalAmount = products.reduce((sum, p) => sum + (p.subtotal || 0), 0);

    // Generate template pesan WA
    let message = `Halo Admin!%0ASaya ingin melakukan pembelian:%0A`;
    products.forEach((p, i) => {
      message += `${i+1}. ${p.name} x${p.quantity} = RM ${p.subtotal}%0A`;
    });
    message += `Total: RM ${totalAmount}%0A`;
    message += `Nama: ${customerName}%0AWA: ${customerWA}%0ATerima kasih!`;

    const waLink = `https://wa.me/6281321301127?text=${message}`; // ganti nomor admin

    return NextResponse.json({ waLink });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
