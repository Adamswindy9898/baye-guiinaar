'use client';

import { products as staticProducts, Product } from '@/data/products';
import { addToCart, formatPrice } from '@/lib/cart';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ProductDetail() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [params.id]);

  const loadProduct = async () => {
    // Essayer Supabase d'abord
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('id', params.id)
      .single();

    if (data) {
      setProduct({
        id: data.id,
        name: data.name,
        description: data.description || '',
        price: data.price,
        unit: data.unit || 'pièce',
        category: data.category,
        image: data.image || '/images/default.svg',
        seller: data.seller,
        location: data.location || 'Thiès',
        available: data.available,
        stock: data.stock || 0,
      });
      setImages(data.images || (data.image ? [data.image] : []));

      // Produits similaires
      const { data: related } = await supabase
        .from('products')
        .select('*')
        .eq('category', data.category)
        .neq('id', data.id)
        .eq('available', true)
        .limit(3);

      if (related) {
        setRelatedProducts(related.map(p => ({
          id: p.id, name: p.name, description: p.description || '',
          price: p.price, unit: p.unit || 'pièce', category: p.category,
          image: p.image || '/images/default.svg', seller: p.seller,
          location: p.location || 'Thiès', available: p.available, stock: p.stock || 0,
        })));
      }
    } else {
      // Fallback produits statiques
      const found = staticProducts.find(p => p.id === params.id);
      setProduct(found || null);
      if (found) {
        setRelatedProducts(staticProducts.filter(p => p.category === found.category && p.id !== found.id).slice(0, 3));
      }
    }
    setLoading(false);
  };

  if (loading) return <div className="text-center py-16">Chargement...</div>;

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <span className="text-6xl block mb-4">😕</span>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Produit non trouvé</h1>
        <Link href="/produits" className="text-green-600 hover:text-green-700">← Retour aux produits</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link href="/produits" className="text-green-600 hover:text-green-700 mb-6 inline-block">← Retour aux produits</Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Product Images */}
        <div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl flex items-center justify-center h-80 md:h-96 overflow-hidden relative">
            {images.length > 0 && images[0] !== '/images/default.svg' ? (
              <>
                <img
                  src={images[currentImage]}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-2xl"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImage(i => i > 0 ? i - 1 : images.length - 1)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-white"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => setCurrentImage(i => i < images.length - 1 ? i + 1 : 0)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-white"
                    >
                      →
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentImage(i)}
                          className={`w-2 h-2 rounded-full ${i === currentImage ? 'bg-green-600' : 'bg-white/70'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <span className="text-9xl">
                {product.category === 'poulets' && '🐔'}
                {product.category === 'oeufs' && '🥚'}
                {product.category === 'aliments' && '🌾'}
                {product.category === 'autres' && '🌿'}
              </span>
            )}
          </div>
          {/* Miniatures */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${i === currentImage ? 'border-green-600' : 'border-transparent'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">{product.category}</span>
          <h1 className="text-3xl font-bold text-gray-800 mt-4 mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-3xl font-bold text-green-700 mb-1">{formatPrice(product.price)}</p>
            <p className="text-sm text-gray-500">par {product.unit}</p>
          </div>

          <div className="space-y-3 mb-6 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <span>📍</span> <span>Localisation : {product.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span>🏪</span> <span>Vendeur : {product.seller}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span>📦</span> <span>{product.stock} en stock</span>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <span>🔒</span> <span>Paiement a la livraison ou sur place chez le vendeur</span>
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm text-gray-600">Quantité :</span>
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-2 font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100"
              >
                +
              </button>
            </div>
            <span className="text-sm text-gray-500">= {formatPrice(product.price * quantity)}</span>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className={`w-full py-4 rounded-xl font-bold text-lg transition ${
              added
                ? 'bg-green-600 text-white'
                : 'bg-green-700 text-white hover:bg-green-800'
            }`}
          >
            {added ? '✓ Ajouté au panier !' : '🛒 Ajouter au panier'}
          </button>

          <p className="text-center text-sm text-gray-500 mt-3">
            🔒 Paiement a la livraison ou sur place — jamais a l'avance
          </p>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Produits similaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map(p => (
              <Link key={p.id} href={`/produits/${p.id}`} className="block bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">
                    {p.category === 'poulets' && '🐔'}
                    {p.category === 'oeufs' && '🥚'}
                    {p.category === 'aliments' && '🌾'}
                    {p.category === 'autres' && '🌿'}
                  </span>
                  <div>
                    <h3 className="font-medium text-gray-800">{p.name}</h3>
                    <p className="text-green-700 font-bold">{formatPrice(p.price)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
