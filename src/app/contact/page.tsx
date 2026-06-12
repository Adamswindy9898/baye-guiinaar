'use client';

import Link from 'next/link';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    type: 'question',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      alert('Veuillez remplir les champs obligatoires');
      return;
    }
    setSending(true);
    const { error } = await supabase.from('messages').insert({
      name: form.name,
      phone: form.phone,
      email: form.email,
      type: form.type,
      message: form.message,
    });
    setSending(false);
    if (error) {
      alert('Erreur lors de l\'envoi. Veuillez reessayer ou nous contacter par WhatsApp.');
      return;
    }
    setSent(true);
    setForm({ name: '', phone: '', email: '', type: 'question', message: '' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Contactez-nous</h1>
      <p className="text-gray-600 mb-8">Une question, un partenariat ou une reclamation ? Ecrivez-nous.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulaire de contact */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Envoyez-nous un message</h2>

          {sent ? (
            <div className="text-center py-8">
              <span className="text-5xl block mb-4">✅</span>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Message envoye !</h3>
              <p className="text-gray-600 mb-4">Nous vous repondrons dans les plus brefs delais.</p>
              <button
                onClick={() => setSent(false)}
                className="text-green-700 font-medium hover:underline"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Objet *</label>
                <select
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                >
                  <option value="question">Question generale</option>
                  <option value="partenariat">Proposition de partenariat</option>
                  <option value="reclamation">Reclamation</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea
                  required
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none h-28 resize-none"
                  placeholder="Ecrivez votre message ici..."
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-green-700 text-white py-3 rounded-xl font-bold hover:bg-green-800 transition disabled:opacity-50"
              >
                {sending ? 'Envoi en cours...' : 'Envoyer le message'}
              </button>
            </form>
          )}
        </div>

        {/* Infos de contact */}
        <div>
          <div className="bg-white rounded-2xl p-8 shadow-sm mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Nos coordonnees</h2>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="font-medium text-gray-800">Adresse</p>
                  <p className="text-gray-600">Keur Issa, Thies, Senegal</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-2xl">📞</span>
                <div>
                  <p className="font-medium text-gray-800">Telephone</p>
                  <p className="text-gray-600">+221 78 329 03 24</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-2xl">📧</span>
                <div>
                  <p className="font-medium text-gray-800">Email</p>
                  <p className="text-gray-600">gayea591@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-2xl">🕐</span>
                <div>
                  <p className="font-medium text-gray-800">Horaires</p>
                  <p className="text-gray-600">Lundi - Samedi : 8h - 18h</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <a
                href="https://wa.me/221783290324"
                target="_blank"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition"
              >
                <span>💬</span> Nous ecrire sur WhatsApp
              </a>
              <a
                href="mailto:gayea591@gmail.com?subject=Contact%20Baye%20Guiinaar"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition"
              >
                <span>📧</span> Envoyer un email
              </a>
            </div>
          </div>

          <div className="bg-green-50 rounded-2xl p-6">
            <p className="text-sm font-medium text-green-800 mb-2">Vous etes eleveur, restaurant ou grossiste ?</p>
            <p className="text-sm text-green-700 mb-3">Rejoignez notre plateforme et vendez vos produits a des milliers de clients.</p>
            <Link href="/vendeur" className="text-sm font-medium text-green-700 hover:text-green-800 underline">
              Devenir vendeur →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
