import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { Product } from '@/types';

function parseProduct(row: any): Product {
  return {
    ...row,
    is_featured: Boolean(row.is_featured),
    is_new: Boolean(row.is_new),
    secondary_images: row.secondary_images ? JSON.parse(row.secondary_images) : [],
    color_options: row.color_options ? JSON.parse(row.color_options) : [],
    size_options: row.size_options ? JSON.parse(row.size_options) : [],
  };
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const idOrSlug = params.id;
    let productRow;

    if (!isNaN(Number(idOrSlug))) {
      productRow = db.prepare('SELECT * FROM products WHERE id = ?').get(Number(idOrSlug));
    } else {
      productRow = db.prepare('SELECT * FROM products WHERE slug = ?').get(idOrSlug);
    }

    if (!productRow) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = parseProduct(productRow);

    // Fetch reviews for this product
    const reviews = db
      .prepare('SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC')
      .all(product.id);

    // Fetch related products in same category
    const relatedRows = db
      .prepare('SELECT * FROM products WHERE category_id = ? AND id != ? LIMIT 4')
      .all(product.category_id, product.id);
    const relatedProducts = relatedRows.map(parseProduct);

    return NextResponse.json({ product, reviews, relatedProducts });
  } catch (err: any) {
    console.error('Error fetching product:', err);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = getSessionUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const id = Number(params.id);
    const body = await request.json();

    const existing = db.prepare('SELECT id FROM products WHERE id = ?').get(id);
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const {
      title,
      description,
      category_id,
      price,
      compare_at_price,
      stock,
      is_featured,
      is_new,
      image_url,
      fiber_type,
      yarn_weight,
      yardage,
      needle_size,
      gauge,
      care_instructions,
      color_options,
      size_options,
    } = body;

    db.prepare(`
      UPDATE products SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        category_id = COALESCE(?, category_id),
        price = COALESCE(?, price),
        compare_at_price = ?,
        stock = COALESCE(?, stock),
        is_featured = COALESCE(?, is_featured),
        is_new = COALESCE(?, is_new),
        image_url = COALESCE(?, image_url),
        fiber_type = COALESCE(?, fiber_type),
        yarn_weight = COALESCE(?, yarn_weight),
        yardage = COALESCE(?, yardage),
        needle_size = COALESCE(?, needle_size),
        gauge = COALESCE(?, gauge),
        care_instructions = COALESCE(?, care_instructions),
        color_options = COALESCE(?, color_options),
        size_options = COALESCE(?, size_options)
      WHERE id = ?
    `).run(
      title,
      description,
      category_id,
      price !== undefined ? Number(price) : null,
      compare_at_price !== undefined ? (compare_at_price ? Number(compare_at_price) : null) : null,
      stock !== undefined ? Number(stock) : null,
      is_featured !== undefined ? (is_featured ? 1 : 0) : null,
      is_new !== undefined ? (is_new ? 1 : 0) : null,
      image_url,
      fiber_type,
      yarn_weight,
      yardage,
      needle_size,
      gauge,
      care_instructions,
      color_options ? JSON.stringify(color_options) : null,
      size_options ? JSON.stringify(size_options) : null,
      id
    );

    const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    return NextResponse.json({ success: true, product: parseProduct(updated) });
  } catch (err: any) {
    console.error('Error updating product:', err);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = getSessionUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const id = Number(params.id);
    db.prepare('DELETE FROM products WHERE id = ?').run(id);

    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (err: any) {
    console.error('Error deleting product:', err);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
