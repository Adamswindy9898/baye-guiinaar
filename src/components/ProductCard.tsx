'use client';

import { Product } from '@/data/products';
import { addToCart, formatPrice } from '@/lib/cart';
import Link from 'next/link';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const categoryColors = {
    poulets: 'bg-orange-100 text-orange-700',
    oeufs: 'bg-yellow-100 text-yellow-700',
    aliments: 'bg-green-100 text-green-700',
    autres: 'bg-blue-100 text-blue-700',
  };

  return (
    <Link href={`/produits/${product.id}`} className="block">
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1">
        <div className="h-48 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center relative overflow-hidden">
          {product.image && product.image !== '/images/default.svg' ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling!.classList.remove('hidden'); }}
            />
          ) : null}
          <span className={`text-6xl ${product.image && product.image !== '/images/default.svg' ? 'hidden' : ''}`}>
            {product.category === 'poulets' && '🐔'}
            {product.category === 'oeufs' && '🥚'}
            {product.category === 'aliments' && '🌾'}
            {product.category === 'autres' && '🌿'}
          </span>
          <span className={`absolute top-2 left-2 text-xs px-2 py-1 rounded-full ${categoryColors[product.category]}`}>
            {product.category}
          </span>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-green-700">{formatPrice(product.price)}</p>
              <p className="text-xs text-gray-400">par {product.unit}</p>
            </div>
            <button
              onClick={handleAddToCart}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                added
                  ? 'bg-green-600 text-white'
                  : 'bg-green-100 text-green-700 hover:bg-green-600 hover:text-white'
              }`}
            >
              {added ? '✓ Ajouté' : '+ Panier'}
            </button>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
            <span>📍 {product.location}</span>
            <span>•</span>
            <span>{product.stock} disponible{product.stock > 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
