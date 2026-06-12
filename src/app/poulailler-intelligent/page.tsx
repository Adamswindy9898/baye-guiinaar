'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function PoulaillerIntelligentPage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'Thies',
    flock_size: '',
    need: 'complet',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.flock_size) return;
    setSending(true);

    await supabase.from('messages').insert({
      name: form.name,
      phone: form.phone,
      email: form.email,
      type: 'partenariat',
      message: `[POULAILLER INTELLIGENT]\nVille: ${form.city}\nTaille elevage: ${form.flock_size} sujets\nBesoin: ${form.need}\n\n${form.message}`,
    });

    setSending(false);
    setSent(true);
    setForm({ name: '', phone: '', email: '', city: 'Thies', flock_size: '', need: 'complet', message: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 md:p-14 text-white mb-12 relative overflow-hidden">
        <div className="absolute top-5 right-10 text-8xl opacity-10">🏠</div>
        <div className="relative z-10 max-w-2xl">
          <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Nouveau service</span>
          <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-4">Poulailler Intelligent</h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            Surveillez votre elevage a distance. Temperature, humidite, ventilation — tout est controle
            automatiquement pour des poulets en bonne sante et une meilleure production.
          </p>
        </div>
      </div>

      {/* Comment ca marche */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Comment ca marche ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">📡</div>
            <h3 className="font-bold text-gray-800 mb-2">Des capteurs dans votre poulailler</h3>
            <p className="text-sm text-gray-600">On installe des capteurs qui mesurent la temperature, l&apos;humidite et la qualite de l&apos;air en continu.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">📱</div>
            <h3 className="font-bold text-gray-800 mb-2">Suivez tout sur votre telephone</h3>
            <p className="text-sm text-gray-600">Vous recevez les donnees en temps reel. Si quelque chose ne va pas, vous etes alerte immediatement.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">✅</div>
            <h3 className="font-bold text-gray-800 mb-2">Vos poulets sont en securite</h3>
            <p className="text-sm text-gray-600">Moins de pertes, meilleure croissance, production optimale. Vous gerez votre elevage comme un pro.</p>
          </div>
        </div>
      </div>

      {/* Avantages */}
      <div className="bg-gray-50 rounded-2xl p-8 md:p-12 mb-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Les avantages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-4">
            <span className="text-green-600 text-xl mt-1">✓</span>
            <div>
              <h3 className="font-bold text-gray-800">Reduction des pertes</h3>
              <p className="text-sm text-gray-600">Detectez les problemes avant qu&apos;il ne soit trop tard. Alertes en cas de chaleur ou froid excessif.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-green-600 text-xl mt-1">✓</span>
            <div>
              <h3 className="font-bold text-gray-800">Suivi a distance</h3>
              <p className="text-sm text-gray-600">Pas besoin d&apos;etre present 24h/24. Surveillez votre poulailler depuis n&apos;importe ou.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-green-600 text-xl mt-1">✓</span>
            <div>
              <h3 className="font-bold text-gray-800">Meilleure croissance</h3>
              <p className="text-sm text-gray-600">Des conditions optimales = des poulets qui grandissent mieux et plus vite.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-green-600 text-xl mt-1">✓</span>
            <div>
              <h3 className="font-bold text-gray-800">Historique complet</h3>
              <p className="text-sm text-gray-600">Gardez un historique de toutes les donnees pour ameliorer votre elevage au fil du temps.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-green-600 text-xl mt-1">✓</span>
            <div>
              <h3 className="font-bold text-gray-800">Installation simple</h3>
              <p className="text-sm text-gray-600">On s&apos;occupe de tout : installation, configuration et formation. Vous n&apos;avez rien a faire.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-green-600 text-xl mt-1">✓</span>
            <div>
              <h3 className="font-bold text-gray-800">Adapte au Senegal</h3>
              <p className="text-sm text-gray-600">Concu pour notre climat. Fonctionne meme avec une connexion internet limitee.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pour qui */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Pour qui ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <span className="text-4xl block mb-3">🐔</span>
            <h3 className="font-bold text-gray-800 mb-1">Petits eleveurs</h3>
            <p className="text-sm text-gray-600">A partir de 100 sujets</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <span className="text-4xl block mb-3">🏭</span>
            <h3 className="font-bold text-gray-800 mb-1">Fermes moyennes</h3>
            <p className="text-sm text-gray-600">500 a 5000 sujets</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <span className="text-4xl block mb-3">🏢</span>
            <h3 className="font-bold text-gray-800 mb-1">Grandes exploitations</h3>
            <p className="text-sm text-gray-600">Plus de 5000 sujets</p>
          </div>
        </div>
      </div>

      {/* Formulaire de demande */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            {sent ? 'Demande envoyee !' : 'Demander un devis gratuit'}
          </h2>

          {sent ? (
            <div className="text-center py-8">
              <span className="text-5xl block mb-4">✅</span>
              <p className="text-gray-600 mb-2">Merci pour votre interet.</p>
              <p className="text-gray-600 mb-6">Notre equipe vous contactera dans les 48h pour discuter de votre projet.</p>
              <button onClick={() => setSent(false)} className="text-blue-600 font-medium hover:underline">
                Envoyer une autre demande
              </button>
            </div>
          ) : (
            <>
              <p className="text-gray-600 text-center mb-6">Remplissez ce formulaire et nous vous recontacterons pour etudier votre projet.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telephone *</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ville *</label>
                    <select
                      value={form.city}
                      onChange={e => setForm({ ...form, city: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Taille de votre elevage *</label>
                    <input
                      type="text"
                      required
                      value={form.flock_size}
                      onChange={e => setForm({ ...form, flock_size: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Ex: 500 poulets"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type de service</label>
                    <select
                      value={form.need}
                      onChange={e => setForm({ ...form, need: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="complet">Installation complete</option>
                      <option value="capteurs">Capteurs seulement</option>
                      <option value="conseil">Conseil / Etude</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Details supplementaires</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none h-24 resize-none"
                    placeholder="Decrivez votre situation ou vos besoins..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-blue-700 text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-800 transition disabled:opacity-50"
                >
                  {sending ? 'Envoi en cours...' : 'Demander un devis gratuit'}
                </button>
                <p className="text-xs text-center text-gray-500">
                  Sans engagement. Nous vous recontacterons sous 48h.
                </p>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Retour */}
      <div className="text-center mt-12">
        <Link href="/" className="text-green-700 font-medium hover:underline">
          ← Retour a l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
