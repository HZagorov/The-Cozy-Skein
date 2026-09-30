import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = getSessionUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const totalRevenueRow = db.prepare('SELECT SUM(total) as revenue FROM orders').get() as { revenue: number | null };
    const totalOrdersRow = db.prepare('SELECT COUNT(id) as count FROM orders').get() as { count: number };
    const totalProductsRow = db.prepare('SELECT COUNT(id) as count FROM products').get() as { count: number };
    const lowStockRows = db.prepare('SELECT * FROM products WHERE stock <= 8 ORDER BY stock ASC').all();
    const recentOrdersRows = db.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 5').all() as any[];

    const recentOrders = recentOrdersRows.map(o => ({
      ...o,
      shipping_address: JSON.parse(o.shipping_address),
    }));

    return NextResponse.json({
      stats: {
        totalRevenue: totalRevenueRow.revenue || 0,
        totalOrders: totalOrdersRow.count || 0,
        totalProducts: totalProductsRow.count || 0,
        lowStockCount: lowStockRows.length,
      },
      lowStockProducts: lowStockRows,
      recentOrders,
    });
  } catch (err: any) {
    console.error('Error fetching admin stats:', err);
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
