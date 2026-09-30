const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const DB_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new Database(path.join(DB_DIR, 'store.db'));
db.pragma('journal_mode = WAL');

console.log('🌱 Seeding The Cozy Skein database...');

// Run table creation
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    category_id TEXT NOT NULL,
    price REAL NOT NULL,
    compare_at_price REAL,
    stock INTEGER NOT NULL DEFAULT 10,
    is_featured INTEGER NOT NULL DEFAULT 0,
    is_new INTEGER NOT NULL DEFAULT 0,
    image_url TEXT NOT NULL,
    secondary_images TEXT,
    fiber_type TEXT,
    yarn_weight TEXT,
    yardage TEXT,
    needle_size TEXT,
    gauge TEXT,
    care_instructions TEXT,
    color_options TEXT,
    size_options TEXT,
    rating REAL NOT NULL DEFAULT 5.0,
    review_count INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id INTEGER,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    subtotal REAL NOT NULL,
    discount REAL NOT NULL DEFAULT 0,
    shipping_fee REAL NOT NULL DEFAULT 0,
    total REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'Processing',
    tracking_number TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT NOT NULL,
    product_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL,
    selected_color TEXT,
    selected_size TEXT,
    image_url TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    author_name TEXT NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  );
`);

// Clear existing tables for fresh seed
db.prepare('DELETE FROM reviews').run();
db.prepare('DELETE FROM order_items').run();
db.prepare('DELETE FROM orders').run();
db.prepare('DELETE FROM products').run();
db.prepare('DELETE FROM categories').run();
db.prepare('DELETE FROM users').run();

// Seed Categories
const insertCategory = db.prepare(`
  INSERT INTO categories (id, name, description, image_url)
  VALUES (@id, @name, @description, @image_url)
`);

const categories = [
  {
    id: 'yarns',
    name: 'Artisanal Hand-Dyed Yarns',
    description: 'Small-batch, ethically sourced natural fibers hand-dyed in seasonal botanical palettes.',
    image_url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'beanies',
    name: 'Handknit Beanies & Caps',
    description: 'Cozy, breathable headwear crafted from pure merino and cloud-soft baby alpaca.',
    image_url: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'scarves',
    name: 'Warm Scarves & Shawls',
    description: 'Generously sized wraps and chunky ribbed scarves designed to keep out winter chills.',
    image_url: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sweaters',
    name: 'Heirloom Sweaters & Cardigans',
    description: 'Timeless hand-knitted knitwear made with traditional cable and textured stitches.',
    image_url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'mittens',
    name: 'Mittens, Gloves & Socks',
    description: 'Double-cuffed mittens and cozy handknit socks to keep fingers and toes toasty.',
    image_url: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'tools',
    name: 'Knitting Tools & Needles',
    description: 'Hand-turned rosewood needles, brass notions, linen project bags and stitch markers.',
    image_url: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80',
  },
];

for (const cat of categories) {
  insertCategory.run(cat);
}

// Seed Users (Admin & Customer)
const insertUser = db.prepare(`
  INSERT INTO users (id, email, password_hash, name, role)
  VALUES (@id, @email, @password_hash, @name, @role)
`);

const adminPasswordHash = bcrypt.hashSync('admin123', 10);
const emmaPasswordHash = bcrypt.hashSync('password123', 10);

insertUser.run({
  id: 1,
  email: 'admin@thecozyskein.com',
  password_hash: adminPasswordHash,
  name: 'Eleanor Vance (Shop Owner)',
  role: 'admin',
});

insertUser.run({
  id: 2,
  email: 'emma@knitlover.com',
  password_hash: emmaPasswordHash,
  name: 'Emma Lindqvist',
  role: 'customer',
});

// Seed Products
const insertProduct = db.prepare(`
  INSERT INTO products (
    title, slug, description, category_id, price, compare_at_price,
    stock, is_featured, is_new, image_url, secondary_images,
    fiber_type, yarn_weight, yardage, needle_size, gauge,
    care_instructions, color_options, size_options, rating, review_count
  ) VALUES (
    @title, @slug, @description, @category_id, @price, @compare_at_price,
    @stock, @is_featured, @is_new, @image_url, @secondary_images,
    @fiber_type, @yarn_weight, @yardage, @needle_size, @gauge,
    @care_instructions, @color_options, @size_options, @rating, @review_count
  )
`);

const products = [
  {
    title: 'Highland Forest Merino DK Skein',
    slug: 'highland-forest-merino-dk',
    description: 'Spun from 100% fine highland merino wool, hand-dyed in small batches with subtle tonal variegations reminiscent of deep pine needles, damp earth, and morning mist. Exceptionally plump stitch definition, perfect for sweaters, shawls, and cabled winter knits.',
    category_id: 'yarns',
    price: 28.50,
    compare_at_price: 32.00,
    stock: 24,
    is_featured: 1,
    is_new: 1,
    image_url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
    secondary_images: JSON.stringify([
      'https://images.unsplash.com/photo-1615789591457-74a63395c990?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1528458876885-5b6eacdd3671?auto=format&fit=crop&w=800&q=80'
    ]),
    fiber_type: '100% Non-Mulesed Merino Wool',
    yarn_weight: 'DK / Light Worsted',
    yardage: '230m / 251 yds per 100g skein',
    needle_size: 'US 5 - 7 (3.75mm - 4.5mm)',
    gauge: '21 sts x 28 rows = 4" in stockinette',
    care_instructions: 'Hand wash gently in tepid water with wool wash. Squeeze gently without wringing, dry flat in shade.',
    color_options: JSON.stringify([
      { name: 'Pine Needle', hex: '#2F4538' },
      { name: 'Moss & Lichen', hex: '#637854' },
      { name: 'Earthy Clay', hex: '#C86446' },
      { name: 'Mist Oatmeal', hex: '#E6DEC9' }
    ]),
    size_options: JSON.stringify(['100g Skein', 'Value Bundle (3x 100g)']),
    rating: 4.9,
    review_count: 38,
  },
  {
    title: 'Cloudsoft Baby Alpaca & Silk Lace',
    slug: 'cloudsoft-baby-alpaca-silk-lace',
    description: 'A whisper-light blend of 70% brushed baby alpaca anchored on a 30% mulberry silk core. Creates a halo of delicate fluff with a shimmering drape. Can be knit solo for ethereal airy shawls or held together with a companion yarn for cozy, luxe garments.',
    category_id: 'yarns',
    price: 24.00,
    compare_at_price: null,
    stock: 18,
    is_featured: 1,
    is_new: 0,
    image_url: 'https://images.unsplash.com/photo-1615789591457-74a63395c990?auto=format&fit=crop&w=800&q=80',
    secondary_images: JSON.stringify([
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80'
    ]),
    fiber_type: '70% Baby Alpaca, 30% Mulberry Silk',
    yarn_weight: 'Lace / Feathery Halo',
    yardage: '400m / 437 yds per 50g skein',
    needle_size: 'US 3 - 8 (3.25mm - 5.0mm)',
    gauge: 'Variable depending on fabric airy drape',
    care_instructions: 'Hand wash cold. Lay flat to block.',
    color_options: JSON.stringify([
      { name: 'Petal Rose', hex: '#D6A69F' },
      { name: 'Champagne Cream', hex: '#F7F1E5' },
      { name: 'Smoky Heather', hex: '#6E737B' }
    ]),
    size_options: JSON.stringify(['50g Skein']),
    rating: 5.0,
    review_count: 22,
  },
  {
    title: 'Autumn Harvest Hand-Dyed Sock Yarn',
    slug: 'autumn-harvest-sock-yarn',
    description: 'Hard-wearing yet cloud-soft fingering weight yarn, blending 75% fine merino with 25% recycled nylon for durability. Hand-speckled with warm amber, cider russet, and plum tones.',
    category_id: 'yarns',
    price: 26.00,
    compare_at_price: 29.00,
    stock: 30,
    is_featured: 0,
    is_new: 1,
    image_url: 'https://images.unsplash.com/photo-1528458876885-5b6eacdd3671?auto=format&fit=crop&w=800&q=80',
    secondary_images: JSON.stringify([]),
    fiber_type: '75% Superwash Merino, 25% Recycled Nylon',
    yarn_weight: 'Fingering / 4-Ply',
    yardage: '425m / 465 yds per 100g skein',
    needle_size: 'US 1 - 3 (2.25mm - 3.25mm)',
    gauge: '30 sts x 40 rows = 4" in stockinette',
    care_instructions: 'Machine washable on gentle wool cycle, lay flat to dry.',
    color_options: JSON.stringify([
      { name: 'Spiced Cider', hex: '#BA5D2C' },
      { name: 'Goldenrod', hex: '#DE9B35' },
      { name: 'Plum Jam', hex: '#633B48' }
    ]),
    size_options: JSON.stringify(['100g Skein', 'Skein + 20g Mini Heel/Toe Set']),
    rating: 4.8,
    review_count: 45,
  },
  {
    title: 'The Fireside Ribbed Fold-Over Beanie',
    slug: 'fireside-ribbed-foldover-beanie',
    description: 'Individually hand-knitted on circular needles with no uncomfortable seams. Features a deep customizable fold-over brim for double warmth over your ears. Knit from thick, non-scratchy pure wool that molds perfectly to your head.',
    category_id: 'beanies',
    price: 48.00,
    compare_at_price: 55.00,
    stock: 12,
    is_featured: 1,
    is_new: 0,
    image_url: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80',
    secondary_images: JSON.stringify([
      'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=800&q=80'
    ]),
    fiber_type: '100% Peruvian Highland Wool',
    yarn_weight: 'Worsted',
    yardage: 'Pre-knit finished garment',
    needle_size: 'Handknit with love',
    gauge: 'Dense elastic 1x1 ribbing',
    care_instructions: 'Hand wash gently in lukewarm water, roll in clean towel, dry flat.',
    color_options: JSON.stringify([
      { name: 'Terracotta Rust', hex: '#C86446' },
      { name: 'Forest Moss', hex: '#4A5B49' },
      { name: 'Natural Ecru', hex: '#EAE5D9' },
      { name: 'Charcoal Heather', hex: '#373435' }
    ]),
    size_options: JSON.stringify(['One Size (Stretches comfortably 20"-23")']),
    rating: 5.0,
    review_count: 64,
  },
  {
    title: 'Alpine Cable-Twist Pom Beanie',
    slug: 'alpine-cable-twist-pom-beanie',
    description: 'Charming vintage-inspired cable knit pattern with an oversized plush faux-fur pompom. Lined with a soft thermal band for zero itchiness against forehead sensitive skin.',
    category_id: 'beanies',
    price: 52.00,
    compare_at_price: null,
    stock: 8,
    is_featured: 0,
    is_new: 1,
    image_url: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=800&q=80',
    secondary_images: JSON.stringify([]),
    fiber_type: '80% Merino Wool, 20% Baby Alpaca',
    yarn_weight: 'Chunky',
    yardage: 'Pre-knit finished garment',
    needle_size: 'Handcrafted',
    gauge: 'Structured cable twist',
    care_instructions: 'Spot clean pompom, hand wash body of hat.',
    color_options: JSON.stringify([
      { name: 'Oatmeal Tweed', hex: '#DFD8C8' },
      { name: 'Nordic Navy', hex: '#26354A' }
    ]),
    size_options: JSON.stringify(['One Size']),
    rating: 4.9,
    review_count: 19,
  },
  {
    title: 'Nordic Heritage Cable Fisherman Sweater',
    slug: 'nordic-heritage-cable-fisherman-sweater',
    description: 'The ultimate heirloom handknit. Each sweater represents over 40 hours of artisanal hand knitting with complex honeycomb, rope, and moss stitch cabling. Generous cozy drape with raglan sleeves and ribbed cuffs.',
    category_id: 'sweaters',
    price: 245.00,
    compare_at_price: 280.00,
    stock: 5,
    is_featured: 1,
    is_new: 1,
    image_url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80',
    secondary_images: JSON.stringify([
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80'
    ]),
    fiber_type: '100% Pure Shetland Wool',
    yarn_weight: 'Worsted',
    yardage: 'Artisanal finished garment',
    needle_size: 'Handknit heirloom',
    gauge: 'Custom cable block',
    care_instructions: 'Wool is naturally antimicrobial and odor-resistant. Air out between wears; spot clean or gentle wool bath once a season.',
    color_options: JSON.stringify([
      { name: 'Natural Sheep Cream', hex: '#EDE8DF' },
      { name: 'Heather Gray', hex: '#77797E' },
      { name: 'Deep Peat Brown', hex: '#3E3431' }
    ]),
    size_options: JSON.stringify(['Small (UK 8-10)', 'Medium (UK 12-14)', 'Large (UK 16-18)']),
    rating: 5.0,
    review_count: 14,
  },
  {
    title: 'Oversized Slouchy Chunky Cardigan',
    slug: 'oversized-slouchy-chunky-cardigan',
    description: 'Wrap yourself in effortless warmth. Hand-knit with horn buttons and deep drop pockets large enough to stash a skein of yarn or your phone. A cozy companion for breezy autumn mornings and library sessions.',
    category_id: 'sweaters',
    price: 198.00,
    compare_at_price: null,
    stock: 7,
    is_featured: 0,
    is_new: 0,
    image_url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
    secondary_images: JSON.stringify([]),
    fiber_type: '70% Fine Merino, 30% Organic Cotton',
    yarn_weight: 'Bulky / Chunky',
    yardage: 'Pre-knit garment',
    needle_size: 'Handcrafted',
    gauge: 'Relaxed garter stitch',
    care_instructions: 'Hand wash cold, reshape, lay flat on a dry towel.',
    color_options: JSON.stringify([
      { name: 'Sage Green', hex: '#718579' },
      { name: 'Cinnamon Bark', hex: '#A8573D' },
      { name: 'Pecan Tan', hex: '#C29F80' }
    ]),
    size_options: JSON.stringify(['S/M (Relaxed)', 'L/XL (Cozy Oversized)']),
    rating: 4.8,
    review_count: 27,
  },
  {
    title: 'Heirloom Honeycomb Wrap Scarf',
    slug: 'heirloom-honeycomb-wrap-scarf',
    description: 'An expansive 80-inch wrap featuring a textured honeycomb waffle stitch that traps body heat while remaining breathable. Finished with hand-knotted fringe edges. Can be worn looped or draped as a travel wrap.',
    category_id: 'scarves',
    price: 78.00,
    compare_at_price: 90.00,
    stock: 14,
    is_featured: 1,
    is_new: 0,
    image_url: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80',
    secondary_images: JSON.stringify([]),
    fiber_type: '100% Organic Merino Wool',
    yarn_weight: 'DK',
    yardage: 'Finished piece: 200cm x 45cm',
    needle_size: 'Handmade item',
    gauge: 'Honeycomb relief',
    care_instructions: 'Gentle hand wash only with mild wool soap.',
    color_options: JSON.stringify([
      { name: 'Golden Honey', hex: '#DE9B35' },
      { name: 'Dusty Rose', hex: '#C49799' },
      { name: 'Charcoal Slag', hex: '#363839' }
    ]),
    size_options: JSON.stringify(['Standard Wrap (200cm x 45cm)']),
    rating: 4.9,
    review_count: 31,
  },
  {
    title: 'Traditional Scandinavian Selbu Mittens',
    slug: 'scandinavian-selbu-mittens',
    description: 'Authentic stranded colorwork mittens inspired by 19th-century Norwegian knitting traditions. The double-layered jacquard fabric blocks wind completely, while the pointed tip and shaped thumb gusset allow effortless dexterity.',
    category_id: 'mittens',
    price: 65.00,
    compare_at_price: null,
    stock: 9,
    is_featured: 0,
    is_new: 1,
    image_url: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=800&q=80',
    secondary_images: JSON.stringify([]),
    fiber_type: '100% Norwegian Spælsau Wool',
    yarn_weight: 'Fingering / Sport',
    yardage: 'Pre-knit finished item',
    needle_size: 'Knit on 2.5mm DPNs',
    gauge: '32 sts = 4" dense windproof gauge',
    care_instructions: 'Hand wash, air dry away from direct heat radiators.',
    color_options: JSON.stringify([
      { name: 'Midnight & Bone', hex: '#1C2735' },
      { name: 'Cranberry & Ecru', hex: '#822433' }
    ]),
    size_options: JSON.stringify(['Women M', 'Men L']),
    rating: 5.0,
    review_count: 17,
  },
  {
    title: 'Hand-Dyed Botanical Organic Cotton Skein',
    slug: 'botanical-organic-cotton-skein',
    description: 'Buttery soft organic Peruvian Pima cotton dyed with natural plant extracts: avocado stones, marigolds, and indigo leaves. Ideal for warm weather tops, baby heirloom blankets, and knitters with sensitive skin.',
    category_id: 'yarns',
    price: 19.50,
    compare_at_price: null,
    stock: 35,
    is_featured: 0,
    is_new: 1,
    image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    secondary_images: JSON.stringify([]),
    fiber_type: '100% GOTS Certified Organic Cotton',
    yarn_weight: 'Aran / Heavy Worsted',
    yardage: '160m / 175 yds per 100g skein',
    needle_size: 'US 7 - 9 (4.5mm - 5.5mm)',
    gauge: '16 sts x 22 rows = 4"',
    care_instructions: 'Machine wash cool on delicate cycle. Lay flat to dry.',
    color_options: JSON.stringify([
      { name: 'Avocado Stone Blush', hex: '#E2B8AB' },
      { name: 'Indigo Sky', hex: '#637D97' },
      { name: 'Marigold Sunshine', hex: '#E5A93C' }
    ]),
    size_options: JSON.stringify(['100g Skein']),
    rating: 4.7,
    review_count: 15,
  },
  {
    title: 'Handcrafted Rosewood Knitting Needle Set',
    slug: 'handcrafted-rosewood-needle-set',
    description: 'Set of 8 pairs of interchangeable circular needle tips hand-carved from sustainable Indian rosewood and polished with natural beeswax. Silky smooth tips with zero snag on delicate mohair or fine lace.',
    category_id: 'tools',
    price: 95.00,
    compare_at_price: 110.00,
    stock: 15,
    is_featured: 1,
    is_new: 0,
    image_url: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80',
    secondary_images: JSON.stringify([]),
    fiber_type: 'Sustainable Indian Rosewood & Brass Swivel Cords',
    yarn_weight: 'Tool / Accessories',
    yardage: 'Includes 8 sizes (US 4 to US 11), 4 cables, keys, and linen pouch',
    needle_size: 'All-in-one deluxe kit',
    gauge: 'Precision calibrated',
    care_instructions: 'Condition wood once a year with a drop of jojoba or mineral oil.',
    color_options: JSON.stringify([
      { name: 'Natural Rosewood', hex: '#582E25' }
    ]),
    size_options: JSON.stringify(['Deluxe Interchangeable Set (8 Sizes)']),
    rating: 5.0,
    review_count: 42,
  },
  {
    title: 'Chunky Merino Wool Cloud Throw Blanket',
    slug: 'chunky-merino-cloud-throw',
    description: 'Showstopper arm-knitted blanket made from pure unspun giant merino roving wool. Ultra-soft and cloud-like, it adds instant texture and cozy warmth to any sofa, armchair, or bed.',
    category_id: 'scarves',
    price: 185.00,
    compare_at_price: 210.00,
    stock: 6,
    is_featured: 1,
    is_new: 0,
    image_url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80',
    secondary_images: JSON.stringify([]),
    fiber_type: '100% Australian Giant Merino Roving (23 Microns)',
    yarn_weight: 'Super Giant / Arm Knit',
    yardage: 'Finished throw: 120cm x 150cm (48" x 60")',
    needle_size: 'Arm knitted with gentle hands',
    gauge: 'Mega stitch',
    care_instructions: 'Dry clean only. Handle with gentle care to preserve fiber loft.',
    color_options: JSON.stringify([
      { name: 'Natural Sheep Ecru', hex: '#F4EFE6' },
      { name: 'Soft Sage', hex: '#8FA196' },
      { name: 'Dusty Clay', hex: '#C28475' }
    ]),
    size_options: JSON.stringify(['Throw 48" x 60"', 'Oversized Bed Blanket 60" x 80"']),
    rating: 4.9,
    review_count: 28,
  }
];

for (const p of products) {
  insertProduct.run(p);
}

// Seed Demo Order for Emma
const insertOrder = db.prepare(`
  INSERT INTO orders (
    id, user_id, customer_name, customer_email, shipping_address,
    subtotal, discount, shipping_fee, total, status, tracking_number, created_at
  ) VALUES (
    @id, @user_id, @customer_name, @customer_email, @shipping_address,
    @subtotal, @discount, @shipping_fee, @total, @status, @tracking_number, @created_at
  )
`);

const insertOrderItem = db.prepare(`
  INSERT INTO order_items (
    order_id, product_id, title, price, quantity, selected_color, selected_size, image_url
  ) VALUES (
    @order_id, @product_id, @title, @price, @quantity, @selected_color, @selected_size, @image_url
  )
`);

const order1 = {
  id: 'ORD-2026-8812',
  user_id: 2,
  customer_name: 'Emma Lindqvist',
  customer_email: 'emma@knitlover.com',
  shipping_address: JSON.stringify({
    fullName: 'Emma Lindqvist',
    email: 'emma@knitlover.com',
    addressLine1: '42 Meadow Lane',
    addressLine2: 'Apt 3B',
    city: 'Portland',
    state: 'OR',
    postalCode: '97201',
    country: 'United States',
    phone: '+1 (555) 234-5678'
  }),
  subtotal: 105.00,
  discount: 10.50,
  shipping_fee: 0,
  total: 94.50,
  status: 'Delivered',
  tracking_number: 'USPS-KNIT-992381204',
  created_at: '2026-09-18 10:24:00'
};

insertOrder.run(order1);

insertOrderItem.run({
  order_id: 'ORD-2026-8812',
  product_id: 1,
  title: 'Highland Forest Merino DK Skein',
  price: 28.50,
  quantity: 2,
  selected_color: 'Pine Needle',
  selected_size: '100g Skein',
  image_url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80'
});

insertOrderItem.run({
  order_id: 'ORD-2026-8812',
  product_id: 4,
  title: 'The Fireside Ribbed Fold-Over Beanie',
  price: 48.00,
  quantity: 1,
  selected_color: 'Terracotta Rust',
  selected_size: 'One Size',
  image_url: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80'
});

// Second active order (Knitting in Progress)
const order2 = {
  id: 'ORD-2026-9430',
  user_id: 2,
  customer_name: 'Emma Lindqvist',
  customer_email: 'emma@knitlover.com',
  shipping_address: JSON.stringify({
    fullName: 'Emma Lindqvist',
    email: 'emma@knitlover.com',
    addressLine1: '42 Meadow Lane',
    addressLine2: 'Apt 3B',
    city: 'Portland',
    state: 'OR',
    postalCode: '97201',
    country: 'United States',
    phone: '+1 (555) 234-5678'
  }),
  subtotal: 198.00,
  discount: 0,
  shipping_fee: 0,
  total: 198.00,
  status: 'Knitting in Progress',
  tracking_number: 'USPS-AWAITING-SCAN',
  created_at: '2026-09-28 14:12:00'
};

insertOrder.run(order2);

insertOrderItem.run({
  order_id: 'ORD-2026-9430',
  product_id: 7,
  title: 'Oversized Slouchy Chunky Cardigan',
  price: 198.00,
  quantity: 1,
  selected_color: 'Sage Green',
  selected_size: 'S/M (Relaxed)',
  image_url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80'
});

// Seed sample reviews
const insertReview = db.prepare(`
  INSERT INTO reviews (product_id, author_name, rating, comment, created_at)
  VALUES (@product_id, @author_name, @rating, @comment, @created_at)
`);

const reviews = [
  {
    product_id: 1,
    author_name: 'Clara M.',
    rating: 5,
    comment: 'The stitch definition on this Highland Merino is extraordinary! The pine needle green has subtle sage nuances that look like sunlight filtering through trees. Already ordering two more skeins.',
    created_at: '2026-09-12 11:00:00'
  },
  {
    product_id: 1,
    author_name: 'Sarah T.',
    rating: 5,
    comment: 'Butter soft and zero pilling while knitting a top-down raglan sweater. Cannot recommend this dyer enough!',
    created_at: '2026-09-22 16:30:00'
  },
  {
    product_id: 4,
    author_name: 'David B.',
    rating: 5,
    comment: 'Wore this during a frosty trip to Maine. It is the warmest beanie I have ever owned, and the terracotta color gets compliments everywhere.',
    created_at: '2026-09-15 09:15:00'
  },
  {
    product_id: 6,
    author_name: 'Astrid K.',
    rating: 5,
    comment: 'The craftsmanship on this fisherman sweater is true heirloom quality. Worth every single penny. It feels like wearing an affectionate hug.',
    created_at: '2026-09-20 18:40:00'
  }
];

for (const r of reviews) {
  insertReview.run(r);
}

console.log('✅ Seed completed successfully!');
console.log('Users created:');
console.log('  - Admin: admin@thecozyskein.com (password: admin123)');
console.log('  - Customer: emma@knitlover.com (password: password123)');
console.log('Categories created:', categories.length);
console.log('Products created:', products.length);
console.log('Orders created: 2');
