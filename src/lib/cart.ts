'use client';

import { Product } from '@/data/products';

export interface CartItem {
  product: Product;
  quantity: number;
}

const CART_KEY = 'senegal-agro-cart';

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function addToCart(product: Product, quantity: number = 1): CartItem[] {
  const cart = getCart();
  const existing = cart.find(item => item.product.id === product.id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ product, quantity });
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-updated'));
  return cart;
}

export function removeFromCart(productId: string): CartItem[] {
  const cart = getCart().filter(item => item.product.id !== productId);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-updated'));
  return cart;
}

export function updateQuantity(productId: string, quantity: number): CartItem[] {
  const cart = getCart();
  const item = cart.find(item => item.product.id === productId);
  if (item) {
    item.quantity = Math.max(1, quantity);
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-updated'));
  return cart;
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event('cart-updated'));
}

export function getCartTotal(cart: CartItem[]): number {
  return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
}

export function getCartCount(cart: CartItem[]): number {
  return cart.reduce((count, item) => count + item.quantity, 0);
}

export function formatPrice(price: number): string {
  return price.toLocaleString('fr-SN') + ' FCFA';
}

export function generateWhatsAppMessage(cart: CartItem[], total: number, customerInfo: { name: string; phone: string; address: string; city: string }): string {
  let message = `🛒 *Nouvelle commande - Baye Guiinaar*\n\n`;
  message += `👤 *Client:* ${customerInfo.name}\n`;
  message += `📞 *Téléphone:* ${customerInfo.phone}\n`;
  message += `📍 *Adresse:* ${customerInfo.address}, ${customerInfo.city}\n\n`;
  message += `📦 *Produits commandés:*\n`;

  cart.forEach(item => {
    message += `• ${item.product.name} x${item.quantity} = ${formatPrice(item.product.price * item.quantity)}\n`;
  });

  message += `\n💰 *Total: ${formatPrice(total)}*\n`;
  message += `\n💳 *Paiement:* A la livraison ou sur place`;

  return encodeURIComponent(message);
}
