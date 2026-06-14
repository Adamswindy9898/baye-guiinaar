import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">🐔 Baye Guiinaar</h3>
            <p className="text-sm">Le maitre du poulailler. Achetez des poulets frais et produits agricoles en toute confiance, partout au Senegal.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-green-400 transition">Accueil</Link></li>
              <li><Link href="/produits" className="hover:text-green-400 transition">Produits</Link></li>
              <li><Link href="/vendeur" className="hover:text-green-400 transition">Devenir vendeur</Link></li>
              <li><Link href="/faq" className="hover:text-green-400 transition">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-green-400 transition">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/produits?cat=poulets" className="hover:text-green-400 transition">Poulets</Link></li>
              <li><Link href="/produits?cat=oeufs" className="hover:text-green-400 transition">Oeufs</Link></li>
              <li><Link href="/produits?cat=aliments" className="hover:text-green-400 transition">Aliments</Link></li>
              <li><Link href="/produits?cat=autres" className="hover:text-green-400 transition">Autres produits</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>📍 Keur Issa, Thies, Senegal</li>
              <li>📞 +221 78 329 03 24</li>
              <li><a href="https://wa.me/221783290324" target="_blank" className="hover:text-green-400 transition">💬 WhatsApp</a></li>
              <li><a href="https://wa.me/?text=Salut%20!%20Decouvre%20Baye%20Guiinaar%20pour%20commander%20des%20poulets%20frais%20au%20Senegal.%20Prix%20direct%20producteur%20%3A%20https%3A%2F%2Fbaye-guiinaar.vercel.app" target="_blank" className="hover:text-green-400 transition">📤 Partager le site</a></li>
              <li><a href="mailto:gayea591@gmail.com?subject=Probleme%20vendeur%20-%20Baye%20Guiinaar" className="hover:text-green-400 transition">📧 gayea591@gmail.com</a></li>
            </ul>
          </div>
        </div>
        {/* Services numeriques */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="bg-gray-800 rounded-xl p-6 md:flex md:items-center md:justify-between gap-6">
            <div className="mb-4 md:mb-0">
              <h4 className="text-white font-bold text-lg mb-1">💻 Besoin d&apos;un site web ou d&apos;un logiciel ?</h4>
              <p className="text-sm text-gray-400">
                Sites vitrines, e-commerce, applications sur mesure, systemes IoT — on cree votre solution numerique. Prix adaptes au Senegal.
              </p>
            </div>
            <a
              href="https://wa.me/221783290324?text=Bonjour%2C%20je%20suis%20interesse%20par%20vos%20services%20de%20creation%20de%20site%20web%20%2F%20logiciel."
              target="_blank"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition whitespace-nowrap"
            >
              📱 Contacter
            </a>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2026 Baye Guiinaar - Tous droits reserves</p>
          <p className="mt-2 text-gray-400">
            Developpe par <span className="text-green-400 font-medium">Adama Gaye</span> — Ingenieur en Intelligence Artificielle, Smart Tech & Genie Logiciel
          </p>
        </div>
      </div>
    </footer>
  );
}
