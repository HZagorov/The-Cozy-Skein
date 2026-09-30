'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import { Product, Order } from '@/types';
import { 
  ShieldCheck, 
  Package, 
  DollarSign, 
  AlertTriangle, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  Truck, 
  Sparkles, 
  RefreshCw,
  Search,
  ChevronRight,
  X
} from 'lucide-react';

export default function AdminPage() {
  const { user, openAuthModal } = useAuth();

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'alerts'>('products');
  const [stats, setStats] = useState<{ totalRevenue: number; totalOrders: number; totalProducts: number; lowStockCount: number } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // New / Edit Product Modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    title: '',
    category_id: 'yarns',
    price: 25.00,
    compare_at_price: '',
    stock: 20,
    description: '',
    image_url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
    fiber_type: '100% Merino Wool',
    yarn_weight: 'DK',
    yardage: '230m per 100g',
    needle_size: 'US 6 (4.0mm)',
    gauge: '22 sts = 4 inches',
    is_featured: false,
    is_new: true,
  });

  // Filter state for orders
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [productSearch, setProductSearch] = useState<string>('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, prodRes, ordRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/products'),
        fetch('/api/admin/orders')
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData.products || []);
      }
      if (ordRes.ok) {
        const ordData = await ordRes.json();
        setOrders(ordData.orders || []);
      }
    } catch (e) {
      console.error('Error fetching admin data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      loadData();
    } else {
      setLoading(false);
    }
  }, [user]);

  // If not logged in as admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-cozy-terracotta-light text-cozy-terracotta flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div>
          <h1 className="font-serif text-2xl font-bold text-cozy-charcoal">
            Studio Owner Admin Portal
          </h1>
          <p className="text-xs text-cozy-wool/70 mt-1">
            Access to product management, stock monitoring, and order fulfillment is restricted to authorized studio administrators.
          </p>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => openAuthModal('login')}
            className="w-full py-3.5 rounded-xl bg-cozy-terracotta hover:bg-cozy-terracotta-dark text-white font-semibold text-xs transition-all shadow-md"
          >
            Sign In with Admin Account
          </button>
          <div className="p-3 bg-cozy-sand/60 rounded-xl border border-cozy-clay text-[11px] text-cozy-wool/70">
            Demo Admin Credentials: <strong>admin@thecozyskein.com</strong> / <strong>admin123</strong>
          </div>
        </div>
      </div>
    );
  }

  // Handle Order Status Update
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as any } : o))
        );
      }
    } catch (e) {
      console.error('Failed to update status', e);
    }
  };

  // Handle Quick Restock
  const handleRestock = async (productId: number, addAmount = 15) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    const newStock = prod.stock + addAmount;

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
        );
        loadData();
      }
    } catch (e) {
      console.error('Failed to restock', e);
    }
  };

  // Handle Product Delete
  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to remove this product from the studio catalog?')) return;
    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        loadData();
      }
    } catch (e) {
      console.error('Failed to delete product', e);
    }
  };

  // Open Edit Modal
  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      title: p.title,
      category_id: p.category_id,
      price: p.price,
      compare_at_price: p.compare_at_price ? String(p.compare_at_price) : '',
      stock: p.stock,
      description: p.description,
      image_url: p.image_url,
      fiber_type: p.fiber_type || '',
      yarn_weight: p.yarn_weight || '',
      yardage: p.yardage || '',
      needle_size: p.needle_size || '',
      gauge: p.gauge || '',
      is_featured: p.is_featured,
      is_new: p.is_new,
    });
    setIsProductModalOpen(true);
  };

  // Open Create Modal
  const openCreateModal = () => {
    setEditingProduct(null);
    setProductForm({
      title: '',
      category_id: 'yarns',
      price: 26.00,
      compare_at_price: '',
      stock: 20,
      description: '',
      image_url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
      fiber_type: '100% Fine Merino Wool',
      yarn_weight: 'DK',
      yardage: '230m per 100g',
      needle_size: 'US 6 (4.0mm)',
      gauge: '22 sts = 4 inches',
      is_featured: false,
      is_new: true,
    });
    setIsProductModalOpen(true);
  };

  // Submit Product Form (Create or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const payload = {
        ...productForm,
        price: Number(productForm.price),
        compare_at_price: productForm.compare_at_price ? Number(productForm.compare_at_price) : null,
        stock: Number(productForm.stock),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsProductModalOpen(false);
        loadData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to save product');
      }
    } catch (e: any) {
      alert(`Error saving: ${e.message}`);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === 'all') return true;
    return o.status === orderStatusFilter;
  });

  const filteredProducts = products.filter((p) => {
    if (!productSearch.trim()) return true;
    const q = productSearch.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.category_id.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-cozy-sand gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cozy-terracotta mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Studio Management Hub</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-cozy-charcoal">
            The Cozy Skein Admin Dashboard
          </h1>
          <p className="text-xs text-cozy-wool/70 mt-0.5">
            Logged in as {user.name} ({user.email})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl border border-cozy-clay text-cozy-wool hover:bg-cozy-sand transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl bg-cozy-terracotta hover:bg-cozy-terracotta-dark text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-cozy-sand shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-cozy-wool/60">
            <span>Total Sales</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="font-serif text-2xl font-bold text-cozy-charcoal block">
            ${stats?.totalRevenue ? stats.totalRevenue.toFixed(2) : '0.00'}
          </span>
          <span className="text-[11px] text-emerald-700 font-medium">From all processed orders</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-cozy-sand shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-cozy-wool/60">
            <span>Total Orders</span>
            <Package className="w-4 h-4 text-cozy-sage" />
          </div>
          <span className="font-serif text-2xl font-bold text-cozy-charcoal block">
            {stats?.totalOrders || orders.length}
          </span>
          <span className="text-[11px] text-cozy-wool/60">Customer orders placed</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-cozy-sand shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-cozy-wool/60">
            <span>Catalog Items</span>
            <Sparkles className="w-4 h-4 text-cozy-mustard" />
          </div>
          <span className="font-serif text-2xl font-bold text-cozy-charcoal block">
            {stats?.totalProducts || products.length}
          </span>
          <span className="text-[11px] text-cozy-wool/60">Active yarns & knits</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-cozy-sand shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-cozy-wool/60">
            <span>Low Stock Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <span className="font-serif text-2xl font-bold text-amber-700 block">
            {products.filter((p) => p.stock <= 8).length}
          </span>
          <span className="text-[11px] text-amber-800 font-medium">Items with ≤ 8 units left</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-cozy-sand flex items-center space-x-6">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 text-sm font-semibold transition-colors relative ${
            activeTab === 'products'
              ? 'text-cozy-terracotta border-b-2 border-cozy-terracotta'
              : 'text-cozy-wool/60 hover:text-cozy-wool'
          }`}
        >
          Product Catalog & Stock ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-sm font-semibold transition-colors relative ${
            activeTab === 'orders'
              ? 'text-cozy-terracotta border-b-2 border-cozy-terracotta'
              : 'text-cozy-wool/60 hover:text-cozy-wool'
          }`}
        >
          Order Fulfillment ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`pb-3 text-sm font-semibold transition-colors relative flex items-center gap-1.5 ${
            activeTab === 'alerts'
              ? 'text-cozy-terracotta border-b-2 border-cozy-terracotta'
              : 'text-cozy-wool/60 hover:text-cozy-wool'
          }`}
        >
          <span>Restock Alerts</span>
          {products.filter((p) => p.stock <= 8).length > 0 && (
            <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
              {products.filter((p) => p.stock <= 8).length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: Products Table */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-cozy-wool/40 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search catalog items..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-cozy-clay bg-white text-xs focus:ring-1 focus:ring-cozy-terracotta focus:outline-none"
              />
            </div>
            <span className="text-xs text-cozy-wool/60">
              Showing {filteredProducts.length} products
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-cozy-sand overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-cozy-cream/80 border-b border-cozy-sand text-cozy-wool/70 uppercase text-[11px] font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Item</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Stock</th>
                    <th className="py-3.5 px-4">Specs</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cozy-sand">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-cozy-sand/20 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-cozy-sand/50 shrink-0 border border-cozy-sand">
                            <Image src={p.image_url} alt={p.title} fill className="object-cover" />
                          </div>
                          <div>
                            <Link href={`/products/${p.slug}`} className="font-bold text-cozy-charcoal hover:text-cozy-terracotta line-clamp-1">
                              {p.title}
                            </Link>
                            <span className="text-[11px] text-cozy-wool/60">
                              {p.rating.toFixed(1)} ★ ({p.review_count} reviews)
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-cozy-wool capitalize">
                        {p.category_id}
                      </td>
                      <td className="py-3 px-4 font-serif font-bold text-cozy-charcoal">
                        ${p.price.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                          p.stock <= 0
                            ? 'bg-red-100 text-red-800'
                            : p.stock <= 8
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="py-3 px-4 text-cozy-wool/70">
                        <span className="block truncate max-w-xs">{p.yarn_weight} • {p.fiber_type}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 rounded-lg border border-cozy-clay text-cozy-wool hover:bg-cozy-sand"
                            title="Edit Product"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Orders Fulfillment */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2 text-xs">
              {['all', 'Processing', 'Knitting in Progress', 'Packed', 'Shipped', 'Delivered'].map((status) => (
                <button
                  key={status}
                  onClick={() => setOrderStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-xl capitalize font-medium border transition-colors ${
                    orderStatusFilter === status
                      ? 'bg-cozy-charcoal text-white border-cozy-charcoal'
                      : 'bg-white text-cozy-wool border-cozy-clay hover:bg-cozy-sand'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            <span className="text-xs text-cozy-wool/60">
              Showing {filteredOrders.length} orders
            </span>
          </div>

          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-cozy-sand text-cozy-wool/60 text-xs">
                No orders found under this status.
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-cozy-sand p-6 shadow-xs space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-cozy-sand text-xs">
                    <div>
                      <span className="text-cozy-wool/60 text-[11px] block">Order Reference</span>
                      <strong className="font-serif text-base font-bold text-cozy-charcoal">
                        {order.id}
                      </strong>
                    </div>
                    <div>
                      <span className="text-cozy-wool/60 text-[11px] block">Customer</span>
                      <strong className="text-cozy-charcoal">{order.customer_name}</strong>
                      <span className="text-cozy-wool/60 block text-[11px]">{order.customer_email}</span>
                    </div>
                    <div>
                      <span className="text-cozy-wool/60 text-[11px] block">Placed On</span>
                      <span>{new Date(order.created_at).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-cozy-wool/60 text-[11px] block">Order Total</span>
                      <span className="font-serif text-base font-bold text-cozy-terracotta">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>

                    {/* Status updater dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-cozy-wool">Fulfillment:</span>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-cozy-clay bg-cozy-sand/50 text-xs font-semibold text-cozy-charcoal cursor-pointer"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Knitting in Progress">Knitting in Progress</option>
                        <option value="Packed">Packed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {order.items?.map((it) => (
                      <div key={it.id} className="p-2.5 rounded-xl bg-cozy-cream/60 border border-cozy-sand flex items-center gap-3 text-xs">
                        <div className="relative w-10 h-12 rounded-lg overflow-hidden bg-cozy-sand shrink-0">
                          <Image src={it.image_url} alt={it.title} fill className="object-cover" />
                        </div>
                        <div>
                          <strong className="block text-cozy-charcoal truncate">{it.title}</strong>
                          <span className="text-cozy-wool/60 text-[11px]">
                            Qty: {it.quantity} {it.selected_color ? `• ${it.selected_color}` : ''}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-[11px] text-cozy-wool/60 flex items-center justify-between pt-1">
                    <span>
                      Ship To: {order.shipping_address?.addressLine1}, {order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.postalCode}
                    </span>
                    {order.tracking_number && (
                      <span className="font-mono bg-cozy-sand px-2 py-0.5 rounded">
                        Tracking: {order.tracking_number}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Restock Alerts */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              The following products have dropped below our safe threshold of 8 skeins/units. Use the quick restock buttons to replenish stock!
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-cozy-sand overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-cozy-cream/80 border-b border-cozy-sand uppercase text-[11px] font-semibold text-cozy-wool/70">
                <tr>
                  <th className="p-4">Item</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Current Stock</th>
                  <th className="p-4 text-right">Quick Restock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cozy-sand">
                {products
                  .filter((p) => p.stock <= 8)
                  .map((p) => (
                    <tr key={p.id}>
                      <td className="p-4 font-bold text-cozy-charcoal">{p.title}</td>
                      <td className="p-4 capitalize text-cozy-wool">{p.category_id}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900">
                          {p.stock} units
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleRestock(p.id, 15)}
                          className="px-3.5 py-1.5 rounded-xl bg-cozy-terracotta text-white font-semibold text-xs hover:bg-cozy-terracotta-dark shadow-2xs"
                        >
                          +15 Fresh Skeins
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-cozy-charcoal/50 backdrop-blur-xs"
            onClick={() => setIsProductModalOpen(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-cozy-sand overflow-hidden">
              <div className="p-6 bg-cozy-cream border-b border-cozy-sand flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold text-cozy-charcoal">
                  {editingProduct ? 'Edit Studio Creation' : 'Add New Product to Catalog'}
                </h3>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-1 rounded-lg text-cozy-wool/60 hover:text-cozy-wool"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
                <div>
                  <label className="block font-semibold text-cozy-wool mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-cozy-clay bg-cozy-cream/30 text-xs focus:ring-1 focus:ring-cozy-terracotta focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-cozy-wool mb-1">Category</label>
                    <select
                      value={productForm.category_id}
                      onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-cozy-clay bg-white text-xs focus:ring-1 focus:ring-cozy-terracotta focus:outline-none"
                    >
                      <option value="yarns">Artisanal Hand-Dyed Yarns</option>
                      <option value="beanies">Handknit Beanies & Caps</option>
                      <option value="scarves">Warm Scarves & Shawls</option>
                      <option value="sweaters">Heirloom Sweaters & Cardigans</option>
                      <option value="mittens">Mittens, Gloves & Socks</option>
                      <option value="tools">Knitting Tools & Needles</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-cozy-wool mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      required
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-cozy-clay bg-cozy-cream/30 text-xs focus:ring-1 focus:ring-cozy-terracotta focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-cozy-wool mb-1">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-cozy-clay bg-cozy-cream/30 text-xs focus:ring-1 focus:ring-cozy-terracotta focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-cozy-wool mb-1">Compare at Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.compare_at_price}
                      onChange={(e) => setProductForm({ ...productForm, compare_at_price: e.target.value })}
                      placeholder="Optional original price"
                      className="w-full p-2.5 rounded-xl border border-cozy-clay bg-cozy-cream/30 text-xs focus:ring-1 focus:ring-cozy-terracotta focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-cozy-wool mb-1">Fiber Type</label>
                    <input
                      type="text"
                      value={productForm.fiber_type}
                      onChange={(e) => setProductForm({ ...productForm, fiber_type: e.target.value })}
                      placeholder="e.g. 100% Merino Wool"
                      className="w-full p-2.5 rounded-xl border border-cozy-clay bg-cozy-cream/30 text-xs focus:ring-1 focus:ring-cozy-terracotta focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-cozy-wool mb-1">Yarn Weight</label>
                    <input
                      type="text"
                      value={productForm.yarn_weight}
                      onChange={(e) => setProductForm({ ...productForm, yarn_weight: e.target.value })}
                      placeholder="e.g. DK / Fingering / Chunky"
                      className="w-full p-2.5 rounded-xl border border-cozy-clay bg-cozy-cream/30 text-xs focus:ring-1 focus:ring-cozy-terracotta focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-cozy-wool mb-1">Image URL</label>
                  <input
                    type="url"
                    required
                    value={productForm.image_url}
                    onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-cozy-clay bg-cozy-cream/30 text-xs focus:ring-1 focus:ring-cozy-terracotta focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-cozy-wool mb-1">Description & Story</label>
                  <textarea
                    rows={3}
                    required
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-cozy-clay bg-cozy-cream/30 text-xs focus:ring-1 focus:ring-cozy-terracotta focus:outline-none"
                  />
                </div>

                <div className="pt-4 border-t border-cozy-sand flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-cozy-clay text-cozy-wool hover:bg-cozy-sand font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-cozy-terracotta hover:bg-cozy-terracotta-dark text-white font-semibold shadow-xs"
                  >
                    {editingProduct ? 'Save Changes' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
