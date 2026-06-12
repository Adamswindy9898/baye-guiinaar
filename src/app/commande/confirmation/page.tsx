'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');
  const phone = searchParams.get('phone');

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <span className="text-6xl block mb-4">✅</span>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Commande confirmee !</h1>
        <p className="text-gray-600 mb-2">
          Votre commande a ete envoyee avec succes.
        </p>
        <p className="text-gray-600 mb-2">
          Nous vous contacterons par WhatsApp ou telephone pour organiser la livraison ou le retrait.
        </p>
        <p className="text-sm text-green-700 font-medium mb-4">
          Vous payez uniquement a la reception du produit ou sur place.
        </p>

        {orderId && (
          <div className="bg-green-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Numero de commande</p>
            <p className="text-2xl font-bold text-green-700">#{orderId}</p>
            {phone && (
              <p className="text-xs text-gray-500 mt-2">
                Conservez ce numero pour suivre votre commande
              </p>
            )}
          </div>
        )}

        <div className="space-y-3">
          <Link
            href="/mes-commandes"
            className="block w-full bg-green-700 text-white py-3 rounded-xl font-medium hover:bg-green-800 transition"
          >
            Suivre ma commande
          </Link>
          <Link
            href="/produits"
            className="block w-full border border-green-700 text-green-700 py-3 rounded-xl font-medium hover:bg-green-50 transition"
          >
            Continuer mes achats
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="text-center py-16">Chargement...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
