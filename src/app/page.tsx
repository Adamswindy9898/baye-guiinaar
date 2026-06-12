'use client';

import Hero from '@/components/Hero';
import CategorySection from '@/components/CategorySection';
import WhyUs from '@/components/WhyUs';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Product } from '@/data/products';
import Chatbot from '@/components/Chatbot';

interface Testimonial {
  id: string;
  name: string;
  city: string;
  rating: number;
  message: string;
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: '', city: 'Thies', rating: 5, message: '' });
  const [reviewSent, setReviewSent] = useState(false);
  const [reviewSending, setReviewSending] = useState(false);

  useEffect(() => {
    loadProducts();
    loadTestimonials();
  }, []);

  const loadProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('available', true)
      .order('created_at', { ascending: false })
      .limit(8);

    if (data) {
      setFeaturedProducts(data.map(p => ({
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
  };

  const loadTestimonials = async () => {
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .limit(6);
    if (data) setTestimonials(data);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.message) return;
    setReviewSending(true);
    await supabase.from('testimonials').insert({
      name: reviewForm.name,
      city: reviewForm.city,
      rating: reviewForm.rating,
      message: reviewForm.message,
      approved: false,
    });
    setReviewSending(false);
    setReviewSent(true);
    setReviewForm({ name: '', city: 'Thies', rating: 5, message: '' });
  };

  return (
    <div>
      <Hero />
      <CategorySection />

      {/* Produits populaires */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Produits disponibles</h2>
            <p className="text-gray-600 mt-1">Les derniers produits ajoutes par nos vendeurs</p>
          </div>
          <Link href="/produits" className="bg-green-700 text-white px-5 py-2 rounded-lg font-medium hover:bg-green-800 transition text-sm">
            Tout voir
          </Link>
        </div>
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <span className="text-5xl block mb-4">🌾</span>
            <p className="text-gray-600 mb-4">Les premiers produits arrivent bientot !</p>
            <Link href="/inscription" className="text-green-700 font-medium hover:underline">
              Devenir le premier vendeur →
            </Link>
          </div>
        )}
      </section>

      <WhyUs />


      {/* Poulailler Intelligent */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase">Nouveau</span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-3 mb-3">Poulailler Intelligent</h2>
              <p className="text-gray-600 mb-4">
                Surveillez la temperature, l'humidite et la ventilation de votre poulailler a distance.
                Moins de pertes, meilleure croissance, elevage professionnel.
              </p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li className="flex items-center gap-2"><span className="text-green-600">✓</span> Alertes en temps reel sur votre telephone</li>
                <li className="flex items-center gap-2"><span className="text-green-600">✓</span> Installation et formation incluses</li>
                <li className="flex items-center gap-2"><span className="text-green-600">✓</span> Adapte au climat senegalais</li>
              </ul>
              <Link
                href="/poulailler-intelligent"
                className="bg-blue-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-800 transition inline-block"
              >
                En savoir plus
              </Link>
            </div>
            <div className="text-6xl md:text-8xl">🏠📡</div>
          </div>
        </div>
      </section>

      {/* CTA Vendeurs / Fournisseurs */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-2xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">Vous etes eleveur, restaurant ou grossiste ?</h2>
              <p className="text-gray-600 mb-6">
                Vendez vos produits sur Baye Guiinaar et touchez des milliers de clients partout au Senegal. Inscription gratuite, commission discutee au cas par cas.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/vendeur"
                  className="bg-green-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-800 transition text-center"
                >
                  Devenir vendeur
                </Link>
                <a
                  href="https://wa.me/221783290324?text=Bonjour%2C%20je%20suis%20int%C3%A9ress%C3%A9%20pour%20devenir%20fournisseur%20sur%20Baye Guiinaar."
                  target="_blank"
                  className="border-2 border-green-700 text-green-700 px-6 py-3 rounded-xl font-bold hover:bg-green-700 hover:text-white transition text-center"
                >
                  Nous contacter
                </a>
              </div>
            </div>
            <div className="text-6xl md:text-8xl">🤝</div>
          </div>
        </div>
      </section>

      {/* Avis clients */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Avis de nos clients</h2>
            <p className="text-gray-600">Ce que disent ceux qui ont commande sur Baye Guiinaar</p>
          </div>

          {testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {testimonials.map(t => (
                <div key={t.id} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`text-lg ${i < t.rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm mb-4">"{t.message}"</p>
                  <p className="font-medium text-gray-800 text-sm">— {t.name}, {t.city}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 mb-10">
              <p className="text-gray-500">Soyez le premier a laisser un avis !</p>
            </div>
          )}

          {/* Formulaire avis */}
          <div className="max-w-lg mx-auto">
            {reviewSent ? (
              <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                <span className="text-4xl block mb-3">✅</span>
                <h3 className="font-bold text-gray-800 mb-2">Merci pour votre avis !</h3>
                <p className="text-sm text-gray-600">Il sera visible apres validation.</p>
                <button onClick={() => { setReviewSent(false); setShowReviewForm(false); }} className="mt-4 text-green-700 font-medium text-sm hover:underline">
                  Fermer
                </button>
              </div>
            ) : !showReviewForm ? (
              <div className="text-center">
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="bg-green-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-800 transition"
                >
                  Laisser un avis
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4">Votre avis compte</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                      <input
                        type="text"
                        required
                        value={reviewForm.name}
                        onChange={e => setReviewForm({ ...reviewForm, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                        placeholder="Votre nom"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ville *</label>
                      <select
                        value={reviewForm.city}
                        onChange={e => setReviewForm({ ...reviewForm, city: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                      >
                        <option value="Thies">Thies</option>
                        <option value="Dakar">Dakar</option>
                        <option value="Mbour">Mbour</option>
                        <option value="Saint-Louis">Saint-Louis</option>
                        <option value="Touba">Touba</option>
                        <option value="Kaolack">Kaolack</option>
                        <option value="Autre">Autre</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Note *</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: n })}
                          className={`text-2xl ${n <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Votre avis *</label>
                    <textarea
                      required
                      value={reviewForm.message}
                      onChange={e => setReviewForm({ ...reviewForm, message: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:outline-none h-20 resize-none"
                      placeholder="Partagez votre experience..."
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={reviewSending}
                      className="bg-green-700 text-white px-5 py-2 rounded-xl font-medium hover:bg-green-800 transition disabled:opacity-50 text-sm"
                    >
                      {reviewSending ? 'Envoi...' : 'Envoyer mon avis'}
                    </button>
                    <button type="button" onClick={() => setShowReviewForm(false)} className="text-gray-500 text-sm hover:text-gray-700">
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-10 md:p-14 text-white">
          <h2 className="text-3xl font-bold mb-3">Pret a commander ?</h2>
          <p className="text-green-100 mb-8 max-w-lg mx-auto">
            Decouvrez nos produits frais et commandez en quelques clics. Simple, rapide et securise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/produits"
              className="bg-yellow-400 text-green-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition"
            >
              Voir les produits
            </Link>
            <a
              href="https://wa.me/221783290324"
              target="_blank"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-green-700 transition"
            >
              Contacter par WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Chatbot />
    </div>
  );
}
