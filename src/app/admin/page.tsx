'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/cart';
import { useRouter } from 'next/navigation';

interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  location: string;
  business?: string;
  created_at: string;
}

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  seller?: string;
}

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_city: string;
  seller_id: string;
  total: number;
  status: string;
  items: OrderItem[];
  created_at: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  seller: string;
  seller_id: string;
  category: string;
  stock: number;
  available: boolean;
}

interface Message {
  id: string;
  name: string;
  phone: string;
  email: string;
  type: string;
  message: string;
  read: boolean;
  created_at: string;
}

interface Testimonial {
  id: string;
  name: string;
  city: string;
  rating: number;
  message: string;
  approved: boolean;
  created_at: string;
}

const ADMIN_EMAIL = 'gayea591@gmail.com';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'En attente', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'confirmed', label: 'Confirmee', color: 'bg-blue-100 text-blue-700' },
  { value: 'shipped', label: 'En livraison', color: 'bg-purple-100 text-purple-700' },
  { value: 'delivered', label: 'Livree', color: 'bg-green-100 text-green-700' },
  { value: 'cancelled', label: 'Annulee', color: 'bg-red-100 text-red-700' },
];

export default function AdminPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<'overview' | 'orders' | 'products' | 'sellers' | 'messages' | 'reviews'>('overview');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const isAdmin = user && (profile?.email === ADMIN_EMAIL || user.email === ADMIN_EMAIL);

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/');
    }
  }, [user, profile, loading, router, isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const loadData = async () => {
    const [usersRes, ordersRes, productsRes, messagesRes, testimonialsRes] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('messages').select('*').order('created_at', { ascending: false }),
      supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
    ]);
    setUsers(usersRes.data || []);
    setOrders(ordersRes.data || []);
    setProducts(productsRes.data || []);
    setMessages(messagesRes.data || []);
    setTestimonials(testimonialsRes.data || []);
  };

  const handleChangeOrderStatus = async (orderId: string, newStatus: string) => {
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);

    const order = orders.find(o => o.id === orderId);
    if (!order) { loadData(); return; }

    if (newStatus === 'confirmed') {
      // Notifier le vendeur via WhatsApp
      const seller = users.find(u => u.id === order.seller_id);
      const sellerPhone = seller?.phone?.replace(/\s/g, '') || '';
      const msg = encodeURIComponent(
        `*Nouvelle commande confirmee - Baye Guiinaar*\n\n` +
        `Client: ${order.customer_name}\n` +
        `Tel client: ${order.customer_phone}\n` +
        `Adresse: ${order.customer_address}, ${order.customer_city}\n\n` +
        `Produits:\n` +
        (order.items?.map(i => `- ${i.name} x${i.quantity}`).join('\n') || '') +
        `\n\nTotal: ${formatPrice(order.total)}\n\n` +
        `Merci de contacter le client pour organiser la livraison.`
      );
      const phoneNum = sellerPhone.startsWith('+') ? sellerPhone.slice(1) : (sellerPhone.startsWith('221') ? sellerPhone : '221' + sellerPhone);
      window.open(`https://wa.me/${phoneNum}?text=${msg}`, '_blank');
    }

    if (newStatus === 'shipped') {
      // Notifier le client que sa commande est en livraison
      const clientPhone = order.customer_phone?.replace(/\s/g, '') || '';
      const msg = encodeURIComponent(
        `*Baye Guiinaar Market*\n\n` +
        `Bonjour ${order.customer_name},\n` +
        `Votre commande #${order.id.slice(0, 8)} est en cours de livraison!\n\n` +
        `Produits:\n` +
        (order.items?.map(i => `- ${i.name} x${i.quantity}`).join('\n') || '') +
        `\n\nTotal a payer: ${formatPrice(order.total)}\n` +
        `Paiement a la reception.\n\n` +
        `Merci pour votre confiance!`
      );
      const phoneNum = clientPhone.startsWith('+') ? clientPhone.slice(1) : (clientPhone.startsWith('221') ? clientPhone : '221' + clientPhone);
      window.open(`https://wa.me/${phoneNum}?text=${msg}`, '_blank');
    }

    loadData();
  };


  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Supprimer ce produit ?')) return;
    await supabase.from('products').delete().eq('id', productId);
    loadData();
  };

  const handleBlockSeller = async (sellerId: string, currentRole: string) => {
    const newRole = currentRole === 'blocked' ? 'seller' : 'blocked';
    const action = newRole === 'blocked' ? 'Bloquer' : 'Debloquer';
    if (!confirm(`${action} ce vendeur ?`)) return;
    await supabase.from('profiles').update({ role: newRole }).eq('id', sellerId);
    loadData();
  };

  if (loading) return <div className="text-center py-16">Chargement...</div>;
  if (!isAdmin) return null;

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const sellers = users.filter(u => u.role === 'seller');
  const pendingOrders = orders.filter(o => o.status === 'pending');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Administration Baye Guiinaar</h1>
        <p className="text-gray-600">Gerez votre plateforme</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto">
        {[
          { id: 'overview', label: 'Vue generale' },
          { id: 'orders', label: `Commandes (${orders.length})` },
          { id: 'products', label: `Produits (${products.length})` },
          { id: 'sellers', label: `Vendeurs (${sellers.length})` },
          { id: 'messages', label: `Messages (${messages.filter(m => !m.read).length})` },
          { id: 'reviews', label: `Avis (${testimonials.filter(t => !t.approved).length})` },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id as typeof tab); setSelectedOrder(null); }}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition ${
              tab === t.id ? 'bg-green-700 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (() => {
        const deliveredOrders = orders.filter(o => o.status === 'delivered');
        const cancelledOrders = orders.filter(o => o.status === 'cancelled');
        const confirmedOrders = orders.filter(o => o.status === 'confirmed' || o.status === 'shipped');
        const deliveredRevenue = deliveredOrders.reduce((sum, o) => sum + o.total, 0);
        const unreadMessages = messages.filter(m => !m.read).length;
        const pendingReviews = testimonials.filter(t => !t.approved).length;

        // Commandes des 7 derniers jours
        const last7Days = Array.from({ length: 7 }).map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          const dayStr = date.toISOString().slice(0, 10);
          const dayOrders = orders.filter(o => o.created_at?.slice(0, 10) === dayStr);
          return { day: date.toLocaleDateString('fr-FR', { weekday: 'short' }), count: dayOrders.length, revenue: dayOrders.reduce((s, o) => s + o.total, 0) };
        });
        const maxCount = Math.max(...last7Days.map(d => d.count), 1);

        // Top produits commandes
        const productCounts: Record<string, { name: string; count: number }> = {};
        orders.forEach(o => {
          o.items?.forEach(item => {
            if (!productCounts[item.name]) productCounts[item.name] = { name: item.name, count: 0 };
            productCounts[item.name].count += item.quantity;
          });
        });
        const topProducts = Object.values(productCounts).sort((a, b) => b.count - a.count).slice(0, 5);
        const maxProductCount = topProducts.length > 0 ? topProducts[0].count : 1;

        return (
        <div>
          {/* Stats principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-sm text-gray-600">Vendeurs inscrits</p>
              <p className="text-3xl font-bold text-green-700">{sellers.length}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-sm text-gray-600">Total commandes</p>
              <p className="text-3xl font-bold text-green-700">{orders.length}</p>
              <p className="text-xs text-gray-500 mt-1">{pendingOrders.length} en attente</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-sm text-gray-600">Revenus livres</p>
              <p className="text-3xl font-bold text-green-700">{formatPrice(deliveredRevenue)}</p>
              <p className="text-xs text-gray-500 mt-1">Total: {formatPrice(totalRevenue)}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-sm text-gray-600">Produits en ligne</p>
              <p className="text-3xl font-bold text-green-700">{products.length}</p>
            </div>
          </div>

          {/* Stats secondaires */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-green-700">{deliveredOrders.length}</p>
              <p className="text-xs text-gray-600">Livrees</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-blue-700">{confirmedOrders.length}</p>
              <p className="text-xs text-gray-600">En cours</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-red-700">{cancelledOrders.length}</p>
              <p className="text-xs text-gray-600">Annulees</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-yellow-700">{unreadMessages + pendingReviews}</p>
              <p className="text-xs text-gray-600">A traiter</p>
            </div>
          </div>

          {/* Graphique commandes 7 jours */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">Commandes (7 derniers jours)</h3>
              <div className="flex items-end gap-2 h-32">
                {last7Days.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs text-gray-600 font-medium">{d.count}</span>
                    <div
                      className="w-full bg-green-500 rounded-t-md transition-all"
                      style={{ height: `${(d.count / maxCount) * 100}%`, minHeight: d.count > 0 ? '4px' : '0px' }}
                    />
                    <span className="text-xs text-gray-500">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top produits */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">Produits les plus commandes</h3>
              {topProducts.length > 0 ? (
                <div className="space-y-3">
                  {topProducts.map((p, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 truncate">{p.name}</span>
                        <span className="text-gray-500 font-medium">{p.count}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{ width: `${(p.count / maxProductCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Pas encore de commandes</p>
              )}
            </div>
          </div>

          {/* Commandes en attente */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h3 className="font-bold text-gray-800 mb-4">Commandes en attente ({pendingOrders.length})</h3>
            {pendingOrders.length === 0 ? (
              <p className="text-gray-500 text-sm">Aucune commande en attente</p>
            ) : (
              <div className="space-y-3">
                {pendingOrders.slice(0, 5).map(o => (
                  <div key={o.id} className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{o.customer_name}</p>
                      <p className="text-xs text-gray-500">#{o.id.slice(0, 8)} - {o.customer_phone}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-green-700">{formatPrice(o.total)}</span>
                      <button
                        onClick={() => handleChangeOrderStatus(o.id, 'confirmed')}
                        className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                      >
                        Confirmer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Derniers vendeurs */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Derniers vendeurs inscrits</h3>
            {sellers.slice(0, 5).map(u => (
              <div key={u.id} className="flex justify-between items-center py-2 border-b last:border-0">
                <div>
                  <p className="font-medium text-gray-800">{u.name}</p>
                  <p className="text-xs text-gray-500">{u.business || ''} - {u.phone} - {u.location}</p>
                </div>
                <p className="text-xs text-gray-400">
                  {new Date(u.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
            ))}
            {sellers.length === 0 && <p className="text-gray-500 text-sm">Aucun vendeur</p>}
          </div>
        </div>
        );
      })()}

      {/* Orders */}
      {tab === 'orders' && !selectedOrder && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="font-bold text-gray-800">Toutes les commandes</h2>
          </div>
          <div className="divide-y">
            {orders.map(o => {
              const statusInfo = STATUS_OPTIONS.find(s => s.value === o.status) || STATUS_OPTIONS[0];
              return (
                <div key={o.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono text-xs text-gray-500">#{o.id.slice(0, 8)}</span>
                        <span className="font-medium text-gray-800">{o.customer_name}</span>
                        <span className="text-xs text-gray-500">{o.customer_phone}</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {o.items?.map((item, i) => (
                          <span key={i}>{item.name} x{item.quantity}{i < o.items.length - 1 && ', '}</span>
                        ))}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(o.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-green-700">{formatPrice(o.total)}</p>
                      <select
                        value={o.status}
                        onChange={e => handleChangeOrderStatus(o.id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-lg font-medium border-0 ${statusInfo.color}`}
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {orders.length === 0 && <p className="p-6 text-center text-gray-500">Aucune commande</p>}
          </div>
        </div>
      )}

      {/* Order Detail */}
      {tab === 'orders' && selectedOrder && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <button
            onClick={() => setSelectedOrder(null)}
            className="text-sm text-green-700 hover:text-green-800 mb-4 inline-block"
          >
            ← Retour aux commandes
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Commande #{selectedOrder.id.slice(0, 8)}</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Client</p>
                  <p className="font-medium">{selectedOrder.customer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Telephone</p>
                  <p className="font-medium">{selectedOrder.customer_phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Adresse</p>
                  <p className="font-medium">{selectedOrder.customer_address}, {selectedOrder.customer_city}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">
                    {new Date(selectedOrder.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 mb-4">Articles</h3>
              <div className="space-y-2 mb-4">
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      {item.seller && <p className="text-xs text-gray-500">Vendeur: {item.seller}</p>}
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">x{item.quantity}</p>
                      <p className="text-xs text-gray-500">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total</span>
                  <span className="font-bold text-green-700">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-1">Statut commande</p>
                <select
                  value={selectedOrder.status}
                  onChange={e => { handleChangeOrderStatus(selectedOrder.id, e.target.value); setSelectedOrder({ ...selectedOrder, status: e.target.value }); }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products */}
      {tab === 'products' && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="font-bold text-gray-800">Tous les produits</h2>
          </div>
          <div className="divide-y">
            {products.map(p => (
              <div key={p.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-gray-800">{p.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{p.category}</span>
                    {!p.available && <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600">Epuise</span>}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Vendeur: {p.seller} | Prix: {formatPrice(p.price)} | Stock: {p.stock}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteProduct(p.id)}
                  className="text-xs px-3 py-1.5 rounded-lg font-medium bg-red-50 text-red-600 hover:bg-red-100 transition"
                >
                  Supprimer
                </button>
              </div>
            ))}
            {products.length === 0 && <p className="p-6 text-center text-gray-500">Aucun produit</p>}
          </div>
        </div>
      )}

      {/* Sellers */}
      {tab === 'sellers' && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="font-bold text-gray-800">Tous les vendeurs</h2>
          </div>
          <div className="divide-y">
            {sellers.map(s => {
              const sellerProducts = products.filter(p => p.seller_id === s.id);
              const sellerOrders = orders.filter(o => o.items?.some(i => i.seller === s.business || i.seller === s.name));
              const isBlocked = s.role === 'blocked';

              return (
                <div key={s.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-800">{s.name}</h3>
                        {s.business && <span className="text-xs text-gray-500">({s.business})</span>}
                        {isBlocked && <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600">Bloque</span>}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {s.phone} | {s.email} | {s.location}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {sellerProducts.length} produit{sellerProducts.length > 1 ? 's' : ''} | Inscrit le {new Date(s.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <button
                      onClick={() => handleBlockSeller(s.id, s.role)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                        isBlocked
                          ? 'bg-green-50 text-green-600 hover:bg-green-100'
                          : 'bg-red-50 text-red-600 hover:bg-red-100'
                      }`}
                    >
                      {isBlocked ? 'Debloquer' : 'Bloquer'}
                    </button>
                  </div>
                </div>
              );
            })}
            {sellers.length === 0 && <p className="p-6 text-center text-gray-500">Aucun vendeur inscrit</p>}
          </div>
        </div>
      )}

      {/* Messages */}
      {tab === 'messages' && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-bold text-gray-800">Messages recus</h2>
            <span className="text-xs text-gray-500">{messages.filter(m => !m.read).length} non lu(s)</span>
          </div>
          <div className="divide-y">
            {messages.map(msg => {
              const typeLabels: Record<string, string> = { question: 'Question', partenariat: 'Partenariat', reclamation: 'Reclamation', autre: 'Autre' };
              const typeColors: Record<string, string> = { question: 'bg-blue-100 text-blue-700', partenariat: 'bg-purple-100 text-purple-700', reclamation: 'bg-red-100 text-red-700', autre: 'bg-gray-100 text-gray-700' };
              return (
                <div key={msg.id} className={`p-4 hover:bg-gray-50 ${!msg.read ? 'bg-yellow-50' : ''}`}>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-800">{msg.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[msg.type] || typeColors.autre}`}>
                          {typeLabels[msg.type] || msg.type}
                        </span>
                        {!msg.read && <span className="w-2 h-2 bg-orange-500 rounded-full"></span>}
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{msg.message}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>📞 {msg.phone}</span>
                        {msg.email && <span>📧 {msg.email}</span>}
                        <span>{new Date(msg.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!msg.read && (
                        <button
                          onClick={async () => {
                            await supabase.from('messages').update({ read: true }).eq('id', msg.id);
                            loadData();
                          }}
                          className="text-xs px-2 py-1 rounded-lg bg-green-50 text-green-600 hover:bg-green-100"
                        >
                          Marquer lu
                        </button>
                      )}
                      <a
                        href={`https://wa.me/221${msg.phone.replace(/\s/g, '').replace(/^(\+?221|00221)/, '')}?text=${encodeURIComponent(`Bonjour ${msg.name}, merci de nous avoir contacte sur Baye Guiinaar. `)}`}
                        target="_blank"
                        className="text-xs px-2 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700"
                      >
                        Repondre
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
            {messages.length === 0 && <p className="p-6 text-center text-gray-500">Aucun message recu</p>}
          </div>
        </div>
      )}

      {/* Reviews / Avis */}
      {tab === 'reviews' && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-bold text-gray-800">Avis clients</h2>
            <span className="text-xs text-gray-500">{testimonials.filter(t => !t.approved).length} en attente d&apos;approbation</span>
          </div>
          <div className="divide-y">
            {testimonials.map(t => (
              <div key={t.id} className={`p-4 hover:bg-gray-50 ${!t.approved ? 'bg-yellow-50' : ''}`}>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-800">{t.name}</span>
                      <span className="text-xs text-gray-500">— {t.city}</span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={`text-sm ${i < t.rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                        ))}
                      </div>
                      {!t.approved && <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">En attente</span>}
                      {t.approved && <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Approuve</span>}
                    </div>
                    <p className="text-sm text-gray-700">"{t.message}"</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(t.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!t.approved && (
                      <button
                        onClick={async () => {
                          await supabase.from('testimonials').update({ approved: true }).eq('id', t.id);
                          loadData();
                        }}
                        className="text-xs px-3 py-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 font-medium"
                      >
                        Approuver
                      </button>
                    )}
                    <button
                      onClick={async () => {
                        if (!confirm('Supprimer cet avis ?')) return;
                        await supabase.from('testimonials').delete().eq('id', t.id);
                        loadData();
                      }}
                      className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {testimonials.length === 0 && <p className="p-6 text-center text-gray-500">Aucun avis recu</p>}
          </div>
        </div>
      )}
    </div>
  );
}
