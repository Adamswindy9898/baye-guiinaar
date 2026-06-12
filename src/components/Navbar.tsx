'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getCart, getCartCount } from '@/lib/cart';
import { useAuth } from '@/lib/auth-context';

const ADMIN_EMAIL = 'gayea591@gmail.com';

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  const isAdmin = user && (profile?.email === ADMIN_EMAIL || user.email === ADMIN_EMAIL);
  const isSeller = user && profile?.role === 'seller' && !isAdmin;

  useEffect(() => {
    const updateCount = () => setCartCount(getCartCount(getCart()));
    updateCount();
    window.addEventListener('cart-updated', updateCount);
    return () => window.removeEventListener('cart-updated', updateCount);
  }, []);

  return (
    <nav className="bg-green-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🐔</span>
            <span className="text-xl font-bold">Baye Guiinaar</span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="hover:text-green-200 transition">Accueil</Link>

            {isAdmin ? (
              <div className="flex items-center gap-3">
                <Link href="/admin" className="bg-orange-500 px-3 py-1 rounded-lg text-sm hover:bg-orange-400 transition">
                  Admin
                </Link>
                <span className="text-sm text-green-200">Admin</span>
                <button
                  onClick={() => signOut()}
                  className="text-sm bg-green-800 px-3 py-1 rounded-lg hover:bg-green-900 transition"
                >
                  Deconnexion
                </button>
              </div>
            ) : isSeller ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard" className="bg-green-600 px-3 py-1 rounded-lg text-sm hover:bg-green-500 transition">
                  Espace vendeur
                </Link>
                <Link href="/panier" className="relative hover:text-green-200 transition">
                  <span className="text-xl">🛒</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <span className="text-sm text-green-200">{profile?.name || user.email}</span>
                <button
                  onClick={() => signOut()}
                  className="text-sm bg-green-800 px-3 py-1 rounded-lg hover:bg-green-900 transition"
                >
                  Deconnexion
                </button>
              </div>
            ) : (
              <>
                <Link href="/produits" className="hover:text-green-200 transition">Produits</Link>
                <Link href="/poulailler-intelligent" className="hover:text-green-200 transition">Poulailler intelligent</Link>
                <Link href="/mes-commandes" className="hover:text-green-200 transition">Suivi commande</Link>
                <Link href="/faq" className="hover:text-green-200 transition">FAQ</Link>
                <Link href="/contact" className="hover:text-green-200 transition">Contact</Link>
                <Link href="/panier" className="relative hover:text-green-200 transition">
                  <span className="text-xl">🛒</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link href="/inscription" className="text-sm text-green-200 hover:text-white transition">
                  Devenir vendeur
                </Link>
                <Link href="/connexion" className="text-sm bg-white text-green-700 px-3 py-1 rounded-lg font-medium hover:bg-green-50 transition">
                  Connexion
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            {!isAdmin && (
              <Link href="/panier" className="relative">
                <span className="text-xl">🛒</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl">
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-green-600">
            <Link href="/" className="block py-2 hover:text-green-200" onClick={() => setMenuOpen(false)}>Accueil</Link>

            {isAdmin ? (
              <>
                <Link href="/admin" className="block py-2 hover:text-green-200" onClick={() => setMenuOpen(false)}>Admin</Link>
                <button onClick={() => { signOut(); setMenuOpen(false); }} className="block py-2 text-green-200 hover:text-white">
                  Deconnexion
                </button>
              </>
            ) : isSeller ? (
              <>
                <Link href="/dashboard" className="block py-2 hover:text-green-200" onClick={() => setMenuOpen(false)}>Espace vendeur</Link>
                <Link href="/panier" className="block py-2 hover:text-green-200" onClick={() => setMenuOpen(false)}>Panier {cartCount > 0 && `(${cartCount})`}</Link>
                <button onClick={() => { signOut(); setMenuOpen(false); }} className="block py-2 text-green-200 hover:text-white">
                  Deconnexion ({profile?.name || user.email})
                </button>
              </>
            ) : (
              <>
                <Link href="/produits" className="block py-2 hover:text-green-200" onClick={() => setMenuOpen(false)}>Produits</Link>
                <Link href="/poulailler-intelligent" className="block py-2 hover:text-green-200" onClick={() => setMenuOpen(false)}>Poulailler intelligent</Link>
                <Link href="/mes-commandes" className="block py-2 hover:text-green-200" onClick={() => setMenuOpen(false)}>Suivi commande</Link>
                <Link href="/faq" className="block py-2 hover:text-green-200" onClick={() => setMenuOpen(false)}>FAQ</Link>
                <Link href="/contact" className="block py-2 hover:text-green-200" onClick={() => setMenuOpen(false)}>Contact</Link>
                <Link href="/inscription" className="block py-2 hover:text-green-200" onClick={() => setMenuOpen(false)}>Devenir vendeur</Link>
                <Link href="/connexion" className="block py-2 hover:text-green-200" onClick={() => setMenuOpen(false)}>Connexion</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
