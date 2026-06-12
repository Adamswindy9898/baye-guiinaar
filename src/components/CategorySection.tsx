import Link from 'next/link';

const categories = [
  { id: 'poulets', name: 'Poulets', icon: '🐔', description: 'Poulets de chair frais, prets a cuisiner', color: 'from-orange-50 to-orange-100 border-orange-200' },
  { id: 'oeufs', name: 'Oeufs', icon: '🥚', description: 'Oeufs frais du jour, gros calibre', color: 'from-yellow-50 to-yellow-100 border-yellow-200' },
  { id: 'aliments', name: 'Aliments', icon: '🌾', description: 'Aliments de betail et volaille', color: 'from-green-50 to-green-100 border-green-200' },
  { id: 'autres', name: 'Autres', icon: '🌿', description: 'Legumes, cereales et plus', color: 'from-blue-50 to-blue-100 border-blue-200' },
];

export default function CategorySection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Que cherchez-vous ?</h2>
        <p className="text-gray-600">Choisissez une categorie et trouvez ce qu'il vous faut</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map(cat => (
          <Link
            key={cat.id}
            href={`/produits?cat=${cat.id}`}
            className={`bg-gradient-to-br ${cat.color} border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 text-center hover:-translate-y-1`}
          >
            <span className="text-5xl block mb-3">{cat.icon}</span>
            <h3 className="font-bold text-gray-800 mb-1">{cat.name}</h3>
            <p className="text-xs text-gray-600">{cat.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
