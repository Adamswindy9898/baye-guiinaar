'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function InscriptionPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'seller' as 'buyer' | 'seller',
    location: '',
    business: '',
    address: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await signUp(form);

      // Notification WhatsApp a l'admin
      const msg = encodeURIComponent(
        `🆕 *Nouveau vendeur inscrit sur Baye Guiinaar!*\n\n` +
        `👤 Nom: ${form.name}\n` +
        `🏪 Activite: ${form.business}\n` +
        `📞 Tel: ${form.phone}\n` +
        `📧 Email: ${form.email}\n` +
        `📍 Adresse: ${form.address}\n` +
        `🌍 Zone: ${form.location}\n\n` +
        `Connectez-vous a l'admin pour gerer ce vendeur.`
      );
      window.open(`https://wa.me/221783290324?text=${msg}`, '_blank');

      router.push('/dashboard');
    } catch {
      setError('Erreur lors de l\'inscription. Cet email est peut-etre deja utilise.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-6">
          <span className="text-4xl block mb-2">🌾</span>
          <h1 className="text-2xl font-bold text-gray-800">Devenir vendeur</h1>
          <p className="text-sm text-gray-600 mt-1">Vendez vos produits agricoles sur Baye Guiinaar</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Votre nom"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom de votre activite *</label>
            <input
              type="text"
              required
              value={form.business}
              onChange={e => setForm({ ...form, business: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Ex: Ferme Diallo, Elevage Ndiaye..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telephone *</label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="77 123 45 67"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse *</label>
            <input
              type="text"
              required
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Quartier, rue..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Zone *</label>
            <select
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              <option value="">-- Votre zone --</option>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Minimum 6 caracteres"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white py-3 rounded-xl font-bold hover:bg-green-800 transition disabled:opacity-50"
          >
            {loading ? 'Inscription...' : 'Creer mon espace vendeur'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Deja vendeur ?{' '}
          <Link href="/connexion" className="text-green-700 font-medium hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
