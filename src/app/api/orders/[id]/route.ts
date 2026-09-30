import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    const orderRow = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as any;

    if (!orderRow) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId);

    return NextResponse.json({
      order: {
        ...orderRow,
        shipping_address: JSON.parse(orderRow.shipping_address),
        items,
      },
    });
  } catch (err: any) {
    console.error('Error fetching order:', err);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}
