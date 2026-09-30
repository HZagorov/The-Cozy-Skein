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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const weight = searchParams.get('weight');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const featured = searchParams.get('featured');
    const inStock = searchParams.get('inStock');
    const sort = searchParams.get('sort') || 'featured';

    let query = 'SELECT * FROM products WHERE 1=1';
    const params: any[] = [];

    if (category && category !== 'all') {
      query += ' AND category_id = ?';
      params.push(category);
    }

    if (weight && weight !== 'all') {
      query += ' AND yarn_weight LIKE ?';
      params.push(`%${weight}%`);
    }

    if (featured === 'true' || featured === '1') {
      query += ' AND is_featured = 1';
    }

    if (inStock === 'true' || inStock === '1') {
      query += ' AND stock > 0';
    }

    if (minPrice) {
      query += ' AND price >= ?';
      params.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      query += ' AND price <= ?';
      params.push(parseFloat(maxPrice));
    }

    if (search && search.trim() !== '') {
      query += ' AND (title LIKE ? OR description LIKE ? OR fiber_type LIKE ? OR yarn_weight LIKE ?)';
      const s = `%${search.trim()}%`;
      params.push(s, s, s, s);
    }

    switch (sort) {
      case 'price-asc':
        query += ' ORDER BY price ASC';
        break;
      case 'price-desc':
        query += ' ORDER BY price DESC';
        break;
      case 'newest':
        query += ' ORDER BY is_new DESC, created_at DESC';
        break;
      case 'rating':
        query += ' ORDER BY rating DESC, review_count DESC';
        break;
      case 'featured':
      default:
        query += ' ORDER BY is_featured DESC, id ASC';
        break;
    }

    const rows = db.prepare(query).all(...params);
    const products = rows.map(parseProduct);

    return NextResponse.json({ products, total: products.length });
  } catch (err: any) {
    console.error('Error fetching products:', err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = getSessionUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const body = await request.json();
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
      secondary_images,
      fiber_type,
      yarn_weight,
      yardage,
      needle_size,
      gauge,
      care_instructions,
      color_options,
      size_options,
    } = body;

    if (!title || !description || !category_id || price === undefined) {
      return NextResponse.json({ error: 'Title, description, category, and price are required' }, { status: 400 });
    }

    // Generate unique slug
    let baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    let slug = baseSlug;
    let counter = 1;
    while (db.prepare('SELECT id FROM products WHERE slug = ?').get(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const insert = db.prepare(`
      INSERT INTO products (
        title, slug, description, category_id, price, compare_at_price,
        stock, is_featured, is_new, image_url, secondary_images,
        fiber_type, yarn_weight, yardage, needle_size, gauge,
        care_instructions, color_options, size_options, rating, review_count
      ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, 5.0, 0
      )
    `);

    const result = insert.run(
      title,
      slug,
      description,
      category_id,
      Number(price),
      compare_at_price ? Number(compare_at_price) : null,
      stock !== undefined ? Number(stock) : 10,
      is_featured ? 1 : 0,
      is_new ? 1 : 0,
      image_url || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
      JSON.stringify(secondary_images || []),
      fiber_type || 'Natural Wool Blend',
      yarn_weight || 'DK',
      yardage || '200m per 100g',
      needle_size || 'US 6 (4.0mm)',
      gauge || '22 sts = 4 inches',
      care_instructions || 'Hand wash gently in cool water, lay flat to dry.',
      JSON.stringify(color_options || [{ name: 'Natural', hex: '#EDE8DF' }]),
      JSON.stringify(size_options || ['One Size'])
    );

    const newProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    return NextResponse.json({ success: true, product: parseProduct(newProduct) }, { status: 201 });
  } catch (err: any) {
    console.error('Error creating product:', err);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
