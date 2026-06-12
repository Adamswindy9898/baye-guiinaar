'use client';

import { useState, useEffect, Suspense } from 'react';
import { categories } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/supabase';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/data/products';

function ProduitsContent() {
  const searchParams = useSearchParams();
  const catParam = searchParams.get('cat');
  const [selectedCategory, setSelectedCategory] = useState<string>(catParam || 'all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('available', true)
      .order('created_at', { ascending: false });

    if (data) {
      setProducts(data.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description || '',
        price: p.price,
        unit: p.unit || 'piece',
        category: p.category,
        image: p.image || '/images/default.svg',
        seller: p.seller,
        location: p.location || '',
        available: p.available,
        stock: p.stock || 0,
      })));
    }
    setLoading(false);
  };

  const filteredProducts = products.filter(product => {
    const matchCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchLocation = selectedLocation === 'all' || product.location === selectedLocation;
    const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchLocation && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Nos produits</h1>
      <p className="text-gray-600 mb-8">Trouvez les meilleurs produits agricoles pres de chez vous</p>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-8 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="all">Toutes les catégories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
          ))}
        </select>
        <select
          value={selectedLocation}
          onChange={e => setSelectedLocation(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="all">Toutes les zones</option>
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
      </div>

      {loading ? (
        <div className="text-center py-16">
          <p className="text-gray-500">Chargement des produits...</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}</p>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <span className="text-6xl block mb-4">🔍</span>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun produit trouvé</h3>
              <p className="text-gray-500">Essayez de modifier vos filtres</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function ProduitsPage() {
  return (
    <Suspense fallback={<div className="text-center py-16">Chargement...</div>}>
      <ProduitsContent />
    </Suspense>
  );
}
