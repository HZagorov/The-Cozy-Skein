import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = Number(params.id);
    const body = await request.json();
    const { rating, comment, authorName } = body;

    if (!rating || !comment) {
      return NextResponse.json({ error: 'Rating and comment are required' }, { status: 400 });
    }

    const user = getSessionUser();
    const name = authorName?.trim() || user?.name || 'Anonymous Knitter';

    db.prepare(`
      INSERT INTO reviews (product_id, author_name, rating, comment)
      VALUES (?, ?, ?, ?)
    `).run(productId, name, Math.max(1, Math.min(5, Number(rating))), comment.trim());

    // Update aggregate rating and count
    const stats = db.prepare(`
      SELECT AVG(rating) as avg_rating, COUNT(id) as count
      FROM reviews WHERE product_id = ?
    `).get(productId) as { avg_rating: number; count: number };

    db.prepare(`
      UPDATE products
      SET rating = ?, review_count = ?
      WHERE id = ?
    `).run(Math.round(stats.avg_rating * 10) / 10, stats.count, productId);

    return NextResponse.json({ success: true, message: 'Review submitted!' });
  } catch (err: any) {
    console.error('Error posting review:', err);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
