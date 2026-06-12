'use client';

import { useState } from 'react';
import Link from 'next/link';

const faqs = [
  {
    category: 'Commandes',
    questions: [
      {
        q: 'Comment passer une commande ?',
        a: 'Choisissez vos produits, ajoutez-les au panier, remplissez vos informations (nom, telephone, adresse) et cliquez sur "Commander via WhatsApp". Votre commande nous sera envoyee directement.',
      },
      {
        q: 'Comment je paye ?',
        a: 'Le paiement se fait uniquement a la livraison ou sur place chez le vendeur. Vous ne payez jamais a l\'avance. Cash, Wave ou Orange Money acceptes.',
      },
      {
        q: 'Combien coute la livraison ?',
        a: 'La livraison depend de votre zone. Pour Thies ville, elle est souvent gratuite. Pour les autres villes, le vendeur vous communiquera les frais par telephone.',
      },
      {
        q: 'Comment suivre ma commande ?',
        a: 'Allez sur la page "Suivi commande" et entrez votre numero de telephone. Vous verrez le statut de vos commandes en cours.',
      },
      {
        q: 'Je peux annuler une commande ?',
        a: 'Oui, contactez-nous par WhatsApp ou telephone avant que le vendeur ne prepare votre commande. Si elle est deja en livraison, l\'annulation n\'est plus possible.',
      },
    ],
  },
  {
    category: 'Vendeurs',
    questions: [
      {
        q: 'Comment devenir vendeur ?',
        a: 'Allez sur la page "Devenir vendeur", remplissez le formulaire avec vos informations. Nous vous contacterons pour valider votre inscription et creer votre compte.',
      },
      {
        q: 'C\'est gratuit de vendre ?',
        a: 'L\'inscription est gratuite. La commission est discutee au cas par cas avec chaque vendeur.',
      },
      {
        q: 'Je suis restaurant, je peux vendre aussi ?',
        a: 'Oui ! Restaurants, traiteurs, grossistes, eleveurs — tout le monde peut vendre sur Baye Guiinaar. Contactez-nous pour discuter.',
      },
      {
        q: 'Comment je gere mes produits ?',
        a: 'Une fois connecte, vous avez un "Espace vendeur" ou vous pouvez ajouter, modifier et supprimer vos produits, et voir vos commandes recues.',
      },
    ],
  },
  {
    category: 'Poulailler Intelligent',
    questions: [
      {
        q: 'C\'est quoi le poulailler intelligent ?',
        a: 'C\'est un systeme qui surveille automatiquement la temperature, l\'humidite et la ventilation de votre poulailler. Vous recevez des alertes sur votre telephone si quelque chose ne va pas.',
      },
      {
        q: 'Combien ca coute ?',
        a: 'Le prix depend de la taille de votre elevage et de vos besoins. Remplissez le formulaire de devis sur notre page "Poulailler intelligent" et nous vous ferons une proposition.',
      },
      {
        q: 'Ca marche sans internet ?',
        a: 'Le systeme a besoin d\'une connexion internet basique pour envoyer les alertes. Il fonctionne meme avec un reseau mobile 2G/3G.',
      },
    ],
  },
  {
    category: 'Confiance & Securite',
    questions: [
      {
        q: 'Comment je sais que le vendeur est fiable ?',
        a: 'Tous les vendeurs sont verifies par notre equipe avant d\'etre actives. Si un probleme survient, contactez-nous et nous reglerons la situation.',
      },
      {
        q: 'Et si le produit ne correspond pas ?',
        a: 'Contactez-nous immediatement par WhatsApp. Comme vous payez a la livraison, vous pouvez refuser un produit qui ne correspond pas a votre commande.',
      },
      {
        q: 'Mes donnees sont en securite ?',
        a: 'Oui. Nous ne partageons jamais vos informations personnelles avec des tiers. Votre telephone et adresse ne sont visibles que par le vendeur concerne.',
      },
    ],
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggle = (key: string) => {
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Questions frequentes</h1>
        <p className="text-gray-600">Tout ce que vous devez savoir sur Baye Guiinaar</p>
      </div>

      <div className="space-y-8">
        {faqs.map((section) => (
          <div key={section.category}>
            <h2 className="text-xl font-bold text-gray-800 mb-4">{section.category}</h2>
            <div className="space-y-2">
              {section.questions.map((item, i) => {
                const key = `${section.category}-${i}`;
                const isOpen = openIndex === key;
                return (
                  <div key={key} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <button
                      onClick={() => toggle(key)}
                      className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition"
                    >
                      <span className="font-medium text-gray-800 text-sm">{item.q}</span>
                      <span className="text-gray-400 text-xl ml-4">{isOpen ? '−' : '+'}</span>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-4">
                        <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 bg-green-50 rounded-2xl p-8 text-center">
        <h3 className="font-bold text-gray-800 mb-2">Vous avez une autre question ?</h3>
        <p className="text-sm text-gray-600 mb-4">Notre equipe est la pour vous aider.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/contact"
            className="bg-green-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-800 transition"
          >
            Nous contacter
          </Link>
          <a
            href="https://wa.me/221783290324"
            target="_blank"
            className="border-2 border-green-700 text-green-700 px-6 py-3 rounded-xl font-bold hover:bg-green-700 hover:text-white transition"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
