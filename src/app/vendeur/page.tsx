'use client';

import { useState } from 'react';

export default function VendeurPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    business: '',
    type: 'eleveur',
    location: 'Thiès',
    products: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const typeLabels: Record<string, string> = { eleveur: 'Eleveur', restaurant: 'Restaurant/Traiteur', grossiste: 'Grossiste/Fournisseur', agriculteur: 'Agriculteur', autre: 'Autre' };
    const message = encodeURIComponent(
      `*Nouvelle inscription vendeur - Baye Guiinaar*\n\n` +
      `Nom: ${form.name}\n` +
      `Telephone: ${form.phone}\n` +
      `Email: ${form.email}\n` +
      `Entreprise: ${form.business}\n` +
      `Type: ${typeLabels[form.type] || form.type}\n` +
      `Localisation: ${form.location}\n` +
      `Produits: ${form.products}\n` +
      `Description: ${form.description}`
    );
    const whatsappNumber = '221783290324';
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 md:p-12 text-white mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Vendez vos produits sur Baye Guiinaar</h1>
        <p className="text-green-100 text-lg max-w-2xl">
          Eleveurs, agriculteurs, restaurants, grossistes — rejoignez notre plateforme
          et touchez des milliers de clients partout au Senegal.
        </p>
      </div>

      {/* Qui peut vendre */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Qui peut vendre sur Baye Guiinaar ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm text-center border border-gray-100">
            <span className="text-4xl block mb-2">🐔</span>
            <h3 className="font-semibold text-gray-800 text-sm">Eleveurs de volaille</h3>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm text-center border border-gray-100">
            <span className="text-4xl block mb-2">🍽️</span>
            <h3 className="font-semibold text-gray-800 text-sm">Restaurants &amp; Traiteurs</h3>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm text-center border border-gray-100">
            <span className="text-4xl block mb-2">🏪</span>
            <h3 className="font-semibold text-gray-800 text-sm">Grossistes &amp; Fournisseurs</h3>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm text-center border border-gray-100">
            <span className="text-4xl block mb-2">🌾</span>
            <h3 className="font-semibold text-gray-800 text-sm">Agriculteurs</h3>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-xl p-6 shadow-sm text-center">
          <span className="text-4xl block mb-3">💰</span>
          <h3 className="font-semibold text-gray-800 mb-2">Gratuit pour commencer</h3>
          <p className="text-sm text-gray-600">Aucun frais d&apos;inscription. Commission discutee au cas par cas.</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm text-center">
          <span className="text-4xl block mb-3">📱</span>
          <h3 className="font-semibold text-gray-800 mb-2">Simple a gerer</h3>
          <p className="text-sm text-gray-600">Gerez vos produits et commandes directement depuis votre telephone.</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm text-center">
          <span className="text-4xl block mb-3">🚀</span>
          <h3 className="font-semibold text-gray-800 mb-2">Visibilite maximale</h3>
          <p className="text-sm text-gray-600">Vos produits sont visibles par tous les acheteurs partout au Senegal.</p>
        </div>
      </div>

      {/* Registration Form */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {submitted ? '✅ Inscription envoyée !' : 'Inscrivez-vous comme vendeur'}
          </h2>

          {submitted ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                Votre demande a été envoyée. Nous vous contacterons dans les 24h pour activer votre compte vendeur.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Envoyer une autre inscription
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    placeholder="77 123 45 67"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    placeholder="votre@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l&apos;entreprise</label>
                  <input
                    type="text"
                    value={form.business}
                    onChange={e => setForm({ ...form, business: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    placeholder="Ex: Ferme Diallo"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type d&apos;activite *</label>
                  <select
                    value={form.type}
                    onChange={e => setForm({ ...form, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  >
                    <option value="eleveur">Eleveur de volaille</option>
                    <option value="restaurant">Restaurant / Traiteur</option>
                    <option value="grossiste">Grossiste / Fournisseur</option>
                    <option value="agriculteur">Agriculteur</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Localisation *</label>
                  <select
                    value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  >
                    <option value="Thies">Thies</option>
                    <option value="Dakar">Dakar</option>
                    <option value="Mbour">Mbour</option>
                    <option value="Saint-Louis">Saint-Louis</option>
                    <option value="Touba">Touba</option>
                    <option value="Kaolack">Kaolack</option>
                    <option value="Ziguinchor">Ziguinchor</option>
                    <option value="Tambacounda">Tambacounda</option>
                    <option value="Louga">Louga</option>
                    <option value="Fatick">Fatick</option>
                    <option value="Diourbel">Diourbel</option>
                    <option value="Kolda">Kolda</option>
                    <option value="Matam">Matam</option>
                    <option value="Kedougou">Kedougou</option>
                    <option value="Sedhiou">Sedhiou</option>
                    <option value="Kaffrine">Kaffrine</option>
                    <option value="Richard-Toll">Richard-Toll</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quels produits vendez-vous ? *</label>
                <input
                  type="text"
                  required
                  value={form.products}
                  onChange={e => setForm({ ...form, products: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="Ex: Poulets de chair, œufs, aliments volaille"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description de votre activité</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none h-24 resize-none"
                  placeholder="Décrivez brièvement votre élevage ou exploitation..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-700 text-white py-3 rounded-xl font-bold text-lg hover:bg-green-800 transition"
              >
                S&apos;inscrire comme vendeur
              </button>
              <p className="text-xs text-center text-gray-500">
                Vous serez redirige vers WhatsApp pour finaliser votre inscription.
              </p>
            </form>
          )}
        </div>

        {/* Contact direct */}
        <div className="mt-8 bg-green-50 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-gray-800 mb-2">Vous preferez discuter d&apos;abord ?</h3>
          <p className="text-sm text-gray-600 mb-4">
            Restaurants, grossistes, fournisseurs — contactez-nous directement sur WhatsApp ou par email.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/221783290324?text=Bonjour%2C%20je%20suis%20int%C3%A9ress%C3%A9%20pour%20devenir%20fournisseur%20sur%20Baye%20Guiinaar."
              target="_blank"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition"
            >
              💬 WhatsApp
            </a>
            <a
              href="mailto:gayea591@gmail.com?subject=Probleme%20vendeur%20-%20Baye%20Guiinaar"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
            >
              📧 Envoyer un email
            </a>
          </div>
        </div>

        {/* Signaler un problème */}
        <div className="mt-4 bg-orange-50 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-gray-800 mb-2">Vous etes deja vendeur et avez un probleme ?</h3>
          <p className="text-sm text-gray-600 mb-4">
            Envoyez-nous un email directement et nous reglerons ca rapidement.
          </p>
          <a
            href="mailto:gayea591@gmail.com?subject=Probleme%20vendeur%20-%20Baye%20Guiinaar&body=Bonjour%2C%0A%0AJe%20suis%20vendeur%20sur%20Baye%20Guiinaar%20et%20j%27ai%20un%20probleme%20%3A%0A%0A"
            className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 transition"
          >
            📧 Signaler un probleme par email
          </a>
        </div>
      </div>
    </div>
  );
}
