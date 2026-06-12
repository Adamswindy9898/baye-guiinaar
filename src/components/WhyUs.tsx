export default function WhyUs() {
  const steps = [
    {
      number: '1',
      title: 'Choisissez vos produits',
      description: 'Parcourez notre catalogue de produits frais et ajoutez au panier.',
    },
    {
      number: '2',
      title: 'Passez commande',
      description: 'Remplissez votre adresse et choisissez votre mode de paiement.',
    },
    {
      number: '3',
      title: 'Recevez chez vous',
      description: 'Le vendeur prepare votre commande et vous etes livre rapidement.',
    },
  ];

  const features = [
    {
      icon: '💰',
      title: 'Prix direct producteur',
      description: 'Pas d\'intermediaire. Vous achetez au prix de la ferme.',
    },
    {
      icon: '📱',
      title: 'Commande simple',
      description: 'Commandez via WhatsApp. On vous contacte pour organiser la suite.',
    },
    {
      icon: '🔒',
      title: 'Paiement securise',
      description: 'Vous payez a la livraison ou sur place. Jamais a l\'avance.',
    },
    {
      icon: '🐔',
      title: 'Produits frais garantis',
      description: 'Directement de la ferme a votre table. Fraicheur assuree.',
    },
    {
      icon: '🤝',
      title: 'Soutenez le local',
      description: 'Chaque achat aide un eleveur ou agriculteur senegalais.',
    },
    {
      icon: '📞',
      title: 'Service client reactif',
      description: 'Un probleme ? Contactez-nous sur WhatsApp, on repond vite.',
    },
  ];

  return (
    <>
      {/* Comment ca marche */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Comment ca marche ?</h2>
            <p className="text-gray-600">Commander sur Baye Guiinaar, c'est simple comme bonjour</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 bg-green-700 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="font-bold text-gray-800 mb-2 text-lg">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pourquoi nous choisir */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Pourquoi acheter sur Baye Guiinaar ?</h2>
            <p className="text-gray-600">Des avantages que vous ne trouverez nulle part ailleurs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition border border-gray-100">
                <span className="text-3xl mb-3 block">{feature.icon}</span>
                <h3 className="font-bold text-gray-800 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
