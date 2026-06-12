'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/cart';
import Link from 'next/link';

interface Order {
  id: string;
  items: { name: string; price: number; quantity: number }[];
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
  customer_city: string;
}

const statusLabels: Record<string, { text: string; color: string }> = {
  pending: { text: 'En attente', color: 'bg-yellow-100 text-yellow-700' },
  confirmed: { text: 'Confirmee', color: 'bg-blue-100 text-blue-700' },
  shipped: { text: 'En livraison', color: 'bg-purple-100 text-purple-700' },
  delivered: { text: 'Livree', color: 'bg-green-100 text-green-700' },
  cancelled: { text: 'Annulee', color: 'bg-red-100 text-red-700' },
};

export default function MesCommandesPage() {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    setLoading(true);
    setSearched(true);

    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_phone', phone.trim())
      .order('created_at', { ascending: false });

    setOrders(data || []);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Suivre ma commande</h1>
      <p className="text-gray-600 mb-8">Entrez votre numero de telephone pour retrouver vos commandes</p>

      <form onSubmit={handleSearch} className="bg-white rounded-xl p-6 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="tel"
            required
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            placeholder="Votre numero (ex: 77 123 45 67)"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-800 transition disabled:opacity-50"
          >
            {loading ? 'Recherche...' : 'Rechercher'}
          </button>
        </div>
      </form>

      {searched && !loading && (
        <>
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-5xl block mb-4">📦</span>
              <p className="text-gray-600 mb-6">Aucune commande trouvee avec ce numero.</p>
              <Link href="/produits" className="bg-green-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-800 transition">
                Voir les produits
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">{orders.length} commande{orders.length > 1 ? 's' : ''} trouvee{orders.length > 1 ? 's' : ''}</p>
              {orders.map(order => {
                const status = statusLabels[order.status] || statusLabels.pending;
                return (
                  <div key={order.id} className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-sm text-gray-500">Commande #{order.id.slice(0, 8)}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="font-bold text-lg text-green-700 mt-1">{formatPrice(order.total)}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.text}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {order.items?.map((item, i) => (
                        <span key={i}>
                          {item.name} x{item.quantity}
                          {i < order.items.length - 1 && ', '}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Livraison: {order.customer_city}</p>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
