export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  description: string;
  category_id: string;
  price: number;
  compare_at_price?: number | null;
  stock: number;
  is_featured: boolean;
  is_new: boolean;
  image_url: string;
  secondary_images: string[];
  fiber_type?: string;
  yarn_weight?: string;
  yardage?: string;
  needle_size?: string;
  gauge?: string;
  care_instructions?: string;
  color_options: ColorSwatch[];
  size_options: string[];
  rating: number;
  review_count: number;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface OrderItem {
  id?: number;
  order_id?: string;
  product_id: number;
  title: string;
  price: number;
  quantity: number;
  selected_color?: string;
  selected_size?: string;
  image_url: string;
}

export interface Order {
  id: string;
  user_id?: number | null;
  customer_name: string;
  customer_email: string;
  shipping_address: ShippingAddress;
  subtotal: number;
  discount: number;
  shipping_fee: number;
  total: number;
  status: 'Processing' | 'Knitting in Progress' | 'Packed' | 'Shipped' | 'Delivered';
  tracking_number?: string | null;
  created_at: string;
  items?: OrderItem[];
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  created_at: string;
}

export interface ProductReview {
  id: number;
  product_id: number;
  author_name: string;
  rating: number;
  comment: string;
  created_at: string;
}
