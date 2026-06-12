import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-green-700 via-green-600 to-green-800 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-8xl">🐔</div>
        <div className="absolute top-20 right-20 text-6xl">🥚</div>
        <div className="absolute bottom-10 left-1/3 text-7xl">🌾</div>
        <div className="absolute bottom-20 right-10 text-5xl">🌿</div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-28 relative z-10">
        <div className="max-w-2xl">
          <p className="text-green-200 font-medium mb-3 text-sm uppercase tracking-wide">Baye Guiinaar — Le maitre du poulailler</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
            Des produits frais, directement de la <span className="text-yellow-300">ferme</span> a votre table
          </h1>
          <p className="text-lg text-green-100 mb-8 leading-relaxed">
            Poulets de chair, oeufs frais, aliments de betail — commandez en 2 clics aupres des vendeurs pres de chez vous. Prix direct producteur, partout au Senegal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/produits"
              className="bg-yellow-400 text-green-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition text-center shadow-lg"
            >
              Commander maintenant
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-green-700 transition text-center"
            >
              Nous contacter
            </Link>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-yellow-300">100%</p>
            <p className="text-xs text-green-200">Frais et local</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-yellow-300">Tout SN</p>
            <p className="text-xs text-green-200">Partout au Senegal</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-yellow-300">24h</p>
            <p className="text-xs text-green-200">Commande rapide</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-yellow-300">WhatsApp</p>
            <p className="text-xs text-green-200">Support direct</p>
          </div>
        </div>
      </div>
    </section>
  );
}
