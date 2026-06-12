'use client';

import { useState, useEffect } from 'react';
import { getCart, removeFromCart, updateQuantity, clearCart, getCartTotal, formatPrice, CartItem } from '@/lib/cart';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function PanierPage() {
  const { user, profile } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
  });

  useEffect(() => {
    setCart(getCart());
    const update = () => setCart(getCart());
    window.addEventListener('cart-updated', update);
    return () => window.removeEventListener('cart-updated', update);
  }, []);

  useEffect(() => {
    if (profile) {
      setCustomerInfo(prev => ({
        ...prev,
        name: profile.name || prev.name,
        phone: profile.phone || prev.phone,
      }));
    }
  }, [profile]);

  const total = getCartTotal(cart);

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
  };

  const handleQuantityChange = (productId: string, qty: number) => {
    updateQuantity(productId, qty);
  };

  const handlePayment = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address || !customerInfo.city) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    setPaymentLoading(true);
    try {
      // Recuperer les infos vendeurs pour les notifications
      const productIds = cart.map(item => item.product.id);
      const { data: productsData } = await supabase
        .from('products')
        .select('id, seller_id')
        .in('id', productIds);

      // Recuperer les numeros des vendeurs
      const sellerIds = [...new Set((productsData || []).map(p => p.seller_id).filter(Boolean))];
      let sellersInfo: { id: string; phone: string; name: string }[] = [];
      if (sellerIds.length > 0) {
        const { data: sellersData } = await supabase
          .from('profiles')
          .select('id, phone, name')
          .in('id', sellerIds);
        sellersInfo = sellersData || [];
      }

      // Creer une commande par vendeur
      const ordersBySeller: { sellerId: string; items: typeof cart; total: number }[] = [];
      sellerIds.forEach(sellerId => {
        const sellerItems = cart.filter(item => {
          const productInfo = productsData?.find(p => p.id === item.product.id);
          return productInfo?.seller_id === sellerId;
        });
        if (sellerItems.length > 0) {
          const sellerTotal = sellerItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
          ordersBySeller.push({ sellerId, items: sellerItems, total: sellerTotal });
        }
      });

      const ordersToInsert = ordersBySeller.map(o => ({
        customer_id: user?.id || null,
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        customer_address: customerInfo.address,
        customer_city: customerInfo.city,
        seller_id: o.sellerId,
        items: o.items.map(item => ({
          product_id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          seller: item.product.seller,
        })),
        total: o.total,
        status: 'pending',
      }));

      const { data: orderResults, error } = await supabase.from('orders').insert(ordersToInsert).select('id');

      if (error || !orderResults || orderResults.length === 0) {
        alert('Erreur lors de la commande. Veuillez reessayer.');
        return;
      }

      const orderResult = orderResults[0];

      // Notifier l'admin via WhatsApp
      const adminMsg = encodeURIComponent(
        `🛒 *Nouvelle commande Baye Guiinaar!*\n\n` +
        `📋 Commande #${orderResult.id.slice(0, 8)}\n` +
        `👤 Client: ${customerInfo.name}\n` +
        `📞 Tel: ${customerInfo.phone}\n` +
        `📍 Adresse: ${customerInfo.address}, ${customerInfo.city}\n\n` +
        `📦 Articles:\n` +
        cart.map(item => `• ${item.product.name} x${item.quantity} = ${formatPrice(item.product.price * item.quantity)}`).join('\n') +
        `\n\n💰 Total: ${formatPrice(total)}\n` +
        `👨‍🌾 Vendeur(s): ${sellersInfo.map(s => `${s.name} (${s.phone})`).join(', ')}`
      );
      window.open(`https://wa.me/221783290324?text=${adminMsg}`, '_blank');

      clearCart();
      window.location.href = `/commande/confirmation?order=${orderResult.id.slice(0, 8)}&phone=${encodeURIComponent(customerInfo.phone)}`;
    } catch {
      alert('Erreur. Veuillez réessayer.');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <span className="text-6xl block mb-4">🛒</span>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Votre panier est vide</h1>
        <p className="text-gray-600 mb-8">Découvrez nos produits agricoles frais</p>
        <Link href="/produits" className="bg-green-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-800 transition">
          Voir les produits
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Votre panier</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <div key={item.product.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
              <div className="w-16 h-16 bg-green-50 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                {item.product.category === 'poulets' && '🐔'}
                {item.product.category === 'oeufs' && '🥚'}
                {item.product.category === 'aliments' && '🌾'}
                {item.product.category === 'autres' && '🌿'}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-800 truncate">{item.product.name}</h3>
                <p className="text-green-700 font-bold">{formatPrice(item.product.price)}</p>
              </div>
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                  className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                  className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <p className="font-bold text-gray-800 w-24 text-right">{formatPrice(item.product.price * item.quantity)}</p>
              <button
                onClick={() => handleRemove(item.product.id)}
                className="text-red-500 hover:text-red-700 text-xl"
              >
                ✕
              </button>
            </div>
          ))}

          <button
            onClick={() => { clearCart(); }}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Vider le panier
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl p-6 shadow-sm h-fit sticky top-20">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Résumé</h2>
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Sous-total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <hr />
            <div className="flex justify-between font-bold text-lg text-gray-800">
              <span>Total</span>
              <span className="text-green-700">{formatPrice(total)}</span>
            </div>
          </div>

          {!showCheckout ? (
            <button
              onClick={() => setShowCheckout(true)}
              className="w-full bg-green-700 text-white py-3 rounded-xl font-medium hover:bg-green-800 transition"
            >
              Commander
            </button>
          ) : (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700">Vos informations</h3>
              <input
                type="text"
                placeholder="Votre nom"
                value={customerInfo.name}
                onChange={e => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
              <input
                type="tel"
                placeholder="Téléphone (ex: 77 123 45 67)"
                value={customerInfo.phone}
                onChange={e => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Adresse de livraison"
                value={customerInfo.address}
                onChange={e => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
              <select
                value={customerInfo.city}
                onChange={e => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                <option value="">-- Votre ville --</option>
                <option value="Dakar">Dakar</option>
                <option value="Thiès">Thiès</option>
                <option value="Saint-Louis">Saint-Louis</option>
                <option value="Touba">Touba</option>
                <option value="Kaolack">Kaolack</option>
                <option value="Ziguinchor">Ziguinchor</option>
                <option value="Tambacounda">Tambacounda</option>
                <option value="Kolda">Kolda</option>
                <option value="Matam">Matam</option>
                <option value="Louga">Louga</option>
                <option value="Fatick">Fatick</option>
                <option value="Kaffrine">Kaffrine</option>
                <option value="Kedougou">Kedougou</option>
                <option value="Sedhiou">Sedhiou</option>
                <option value="Diourbel">Diourbel</option>
                <option value="Mbour">Mbour</option>
                <option value="Richard-Toll">Richard-Toll</option>
              </select>

              <button
                onClick={handlePayment}
                disabled={paymentLoading}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {paymentLoading ? 'Envoi en cours...' : '💬 Commander via WhatsApp'}
              </button>
              <div className="bg-green-50 rounded-lg p-3 mt-2">
                <p className="text-xs text-green-800 font-medium mb-1">Paiement securise :</p>
                <p className="text-xs text-green-700">Vous payez uniquement a la livraison ou sur place chez le vendeur. Jamais a l'avance.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
