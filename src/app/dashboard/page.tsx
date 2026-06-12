'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/cart';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  stock: number;
  available: boolean;
  image: string;
}

interface Order {
  id: string;
  customer_name: string;
  total: number;
  status: string;
  created_at: string;
  items: { name: string; quantity: number; price: number }[];
}

export default function DashboardPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    unit: 'piece',
    category: 'poulets',
    stock: '',
  });
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    price: '',
    unit: '',
    category: '',
    stock: '',
  });

  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'seller')) {
      router.push('/connexion');
    }
  }, [user, profile, loading, router]);

  useEffect(() => {
    if (user) {
      loadProducts();
      loadOrders();
    }
  }, [user]);

  const loadProducts = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });
    setProducts(data || []);
  };

  const loadOrders = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });
    setOrders(data || []);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files].slice(0, 5));
      setImagePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    if (imageFiles.length === 0 || !user) return ['/images/default.svg'];

    const urls: string[] = [];
    for (const file of imageFiles) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;

      const { error } = await supabase.storage
        .from('products')
        .upload(fileName, file);

      if (!error) {
        const { data } = supabase.storage
          .from('products')
          .getPublicUrl(fileName);
        urls.push(data.publicUrl);
      }
    }

    return urls.length > 0 ? urls : ['/images/default.svg'];
  };

  const containsPhone = (text: string) => {
    const phonePatterns = /(\+?221|00221)?[\s.-]?(7[0-8]|76|77|78|75|70)[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2}|\d{9,}/;
    return phonePatterns.test(text.replace(/\s/g, ''));
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (containsPhone(newProduct.name) || containsPhone(newProduct.description)) {
      alert('Les numeros de telephone ne sont pas autorises dans le nom ou la description du produit.');
      return;
    }

    setUploading(true);
    const imageUrls = await uploadImages();

    await supabase.from('products').insert({
      name: newProduct.name,
      description: newProduct.description,
      price: Number(newProduct.price),
      unit: newProduct.unit,
      category: newProduct.category,
      stock: Number(newProduct.stock),
      image: imageUrls[0],
      images: imageUrls,
      seller: profile?.business || profile?.name || '',
      seller_id: user.id,
      location: profile?.location || 'Thies',
      available: true,
    });

    setNewProduct({ name: '', description: '', price: '', unit: 'piece', category: 'poulets', stock: '' });
    setImageFiles([]);
    setImagePreviews([]);
    setShowAddForm(false);
    setUploading(false);
    loadProducts();
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      unit: product.unit,
      category: product.category,
      stock: String(product.stock),
    });
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (containsPhone(editForm.name) || containsPhone(editForm.description)) {
      alert('Les numeros de telephone ne sont pas autorises dans le nom ou la description du produit.');
      return;
    }

    await supabase.from('products').update({
      name: editForm.name,
      description: editForm.description,
      price: Number(editForm.price),
      unit: editForm.unit,
      category: editForm.category,
      stock: Number(editForm.stock),
      available: Number(editForm.stock) > 0,
    }).eq('id', editingProduct.id);

    setEditingProduct(null);
    loadProducts();
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return;
    await supabase.from('products').delete().eq('id', id);
    loadProducts();
  };

  if (loading) return <div className="text-center py-16">Chargement...</div>;
  if (!user || profile?.role !== 'seller') return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Espace Vendeur</h1>
          <p className="text-gray-600">Bienvenue, {profile?.name}</p>
        </div>
        <button
          onClick={() => { setShowAddForm(true); setEditingProduct(null); }}
          className="bg-green-700 text-white px-4 py-2 rounded-xl font-medium hover:bg-green-800 transition"
        >
          + Ajouter un produit
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-600">Produits en ligne</p>
          <p className="text-3xl font-bold text-green-700">{products.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-600">Commandes recues</p>
          <p className="text-3xl font-bold text-green-700">{orders.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-600">Revenus (FCFA)</p>
          <p className="text-3xl font-bold text-green-700">
            {formatPrice(orders.reduce((sum, o) => sum + (o.total || 0), 0))}
          </p>
        </div>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Nouveau produit</h2>
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit *</label>
              <input
                type="text"
                required
                value={newProduct.name}
                onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="Ex: Poulet de chair 2kg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA) *</label>
              <input
                type="number"
                required
                value={newProduct.price}
                onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="3500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categorie *</label>
              <select
                value={newProduct.category}
                onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                <option value="poulets">Poulets</option>
                <option value="oeufs">Oeufs</option>
                <option value="aliments">Aliments</option>
                <option value="autres">Autres</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unite</label>
              <input
                type="text"
                value={newProduct.unit}
                onChange={e => setNewProduct({ ...newProduct, unit: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="piece, kg, sac, plateau..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
              <input
                type="number"
                required
                value={newProduct.stock}
                onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="50"
              />
            </div>

            {/* Photos du produit */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Photos du produit (max 5)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-sm"
              />
              {imagePreviews.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {imagePreviews.map((preview, i) => (
                    <div key={i} className="relative">
                      <img src={preview} alt={`Apercu ${i + 1}`} className="w-20 h-20 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">{imagePreviews.length}/5 photos</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newProduct.description}
                onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none h-20 resize-none"
                placeholder="Decrivez votre produit..."
              />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={uploading}
                className="bg-green-700 text-white px-6 py-2 rounded-xl font-medium hover:bg-green-800 transition disabled:opacity-50"
              >
                {uploading ? 'Publication...' : 'Publier le produit'}
              </button>
              <button type="button" onClick={() => { setShowAddForm(false); setImagePreviews([]); setImageFiles([]); }} className="text-gray-600 px-4 py-2 hover:text-gray-800">
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Product Form */}
      {editingProduct && (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8 border-2 border-blue-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Modifier : {editingProduct.name}</h2>
          <form onSubmit={handleEditProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit *</label>
              <input
                type="text"
                required
                value={editForm.name}
                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA) *</label>
              <input
                type="number"
                required
                value={editForm.price}
                onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categorie *</label>
              <select
                value={editForm.category}
                onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="poulets">Poulets</option>
                <option value="oeufs">Oeufs</option>
                <option value="aliments">Aliments</option>
                <option value="autres">Autres</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unite</label>
              <input
                type="text"
                value={editForm.unit}
                onChange={e => setEditForm({ ...editForm, unit: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
              <input
                type="number"
                required
                value={editForm.stock}
                onChange={e => setEditForm({ ...editForm, stock: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={editForm.description}
                onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none h-20 resize-none"
              />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition"
              >
                Enregistrer les modifications
              </button>
              <button type="button" onClick={() => setEditingProduct(null)} className="text-gray-600 px-4 py-2 hover:text-gray-800">
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <h2 className="text-xl font-bold text-gray-800 p-6 border-b">Mes produits</h2>
        {products.length === 0 ? (
          <p className="p-6 text-gray-500 text-center">Aucun produit. Ajoutez votre premier produit !</p>
        ) : (
          <div className="divide-y">
            {products.map(product => (
              <div key={product.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <img
                  src={product.image || '/images/default.svg'}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/images/default.svg'; }}
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.category} - {formatPrice(product.price)}/{product.unit}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${product.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.available ? 'Disponible' : 'Epuise'}
                    </span>
                    <span className="text-xs text-gray-500">Stock: {product.stock}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => startEdit(product)}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium bg-red-50 text-red-600 hover:bg-red-100 transition"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Orders */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <h2 className="text-xl font-bold text-gray-800 p-6 border-b">Commandes recues</h2>
        {orders.length === 0 ? (
          <p className="p-6 text-gray-500 text-center">Aucune commande pour le moment.</p>
        ) : (
          <div className="divide-y">
            {orders.map(order => (
              <div key={order.id} className="p-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-800">{order.customer_name}</p>
                      <span className="text-xs text-gray-400">#{order.id.slice(0, 8)}</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {order.items?.map((item, i) => (
                        <span key={i}>{item.name} x{item.quantity}{i < order.items.length - 1 && ', '}</span>
                      ))}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-green-700">{formatPrice(order.total)}</p>
                    <select
                      value={order.status}
                      onChange={async (e) => {
                        await supabase.from('orders').update({ status: e.target.value }).eq('id', order.id);
                        loadOrders();
                      }}
                      className={`text-xs px-2 py-1 rounded-lg font-medium border-0 ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                        order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      <option value="pending">En attente</option>
                      <option value="confirmed">Confirmee</option>
                      <option value="shipped">En livraison</option>
                      <option value="delivered">Livree</option>
                      <option value="cancelled">Annulee</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
