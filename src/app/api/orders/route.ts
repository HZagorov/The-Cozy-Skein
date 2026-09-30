import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { Order } from '@/types';

export async function POST(request: Request) {
  try {
    const user = getSessionUser();
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      shippingAddress,
      items,
      subtotal,
      discount,
      shippingFee,
      total,
    } = body;

    if (!customerName || !customerEmail || !shippingAddress || !items || !items.length) {
      return NextResponse.json({ error: 'Missing required checkout information' }, { status: 400 });
    }

    const orderId = `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const createOrderTx = db.transaction(() => {
      // 1. Insert order
      db.prepare(`
        INSERT INTO orders (
          id, user_id, customer_name, customer_email, shipping_address,
          subtotal, discount, shipping_fee, total, status, tracking_number
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Processing', ?)
      `).run(
        orderId,
        user ? user.id : null,
        customerName.trim(),
        customerEmail.trim(),
        JSON.stringify(shippingAddress),
        Number(subtotal),
        Number(discount || 0),
        Number(shippingFee || 0),
        Number(total),
        `TRK-${Math.floor(100000000 + Math.random() * 900000000)}`
      );

      // 2. Insert items and decrement stock
      const insertItem = db.prepare(`
        INSERT INTO order_items (
          order_id, product_id, title, price, quantity, selected_color, selected_size, image_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const decrementStock = db.prepare(`
        UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?
      `);

      for (const item of items) {
        insertItem.run(
          orderId,
          item.product.id,
          item.product.title,
          Number(item.product.price),
          Number(item.quantity),
          item.selectedColor || null,
          item.selectedSize || null,
          item.product.image_url
        );

        decrementStock.run(Number(item.quantity), item.product.id);
      }
    });

    createOrderTx();

    return NextResponse.json({
      success: true,
      orderId,
      message: 'Order placed successfully!',
    });
  } catch (err: any) {
    console.error('Error creating order:', err);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const orders = db.prepare(`
      SELECT * FROM orders
      WHERE user_id = ? OR LOWER(customer_email) = LOWER(?)
      ORDER BY created_at DESC
    `).all(user.id, user.email) as any[];

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
    console.error('Error fetching customer orders:', err);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
