import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = getSessionUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all() as any[];
    const ordersWithItems = orders.map((order) => {
      const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
      return {
        ...order,
        shipping_address: JSON.parse(order.shipping_address),
        items,
      };
    });

    return NextResponse.json({ orders: ordersWithItems });
  } catch (err: any) {
    console.error('Error fetching admin orders:', err);
    return NextResponse.json({ error: 'Failed to fetch admin orders' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = getSessionUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { orderId, status, trackingNumber } = body;

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Order ID and status are required' }, { status: 400 });
    }

    db.prepare(`
      UPDATE orders
      SET status = ?, tracking_number = COALESCE(?, tracking_number)
      WHERE id = ?
    `).run(status, trackingNumber || null, orderId);

    const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as any;
    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId);

    return NextResponse.json({
      success: true,
      order: {
        ...updated,
        shipping_address: JSON.parse(updated.shipping_address),
        items,
      },
    });
  } catch (err: any) {
    console.error('Error updating order status:', err);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}
