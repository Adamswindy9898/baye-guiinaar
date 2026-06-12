'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Message {
  from: 'bot' | 'user';
  text: string;
  link?: { href: string; label: string };
}

const RESPONSES: { keywords: string[]; answer: string; link?: { href: string; label: string } }[] = [
  {
    keywords: ['acheter', 'commander', 'poulet', 'produit', 'prix', 'combien', 'oeuf', 'aliment'],
    answer: 'Vous pouvez voir tous nos produits disponibles ici :',
    link: { href: '/produits', label: 'Voir les produits' },
  },
  {
    keywords: ['livraison', 'livrer', 'delai', 'quand', 'recevoir'],
    answer: 'Les infos sur la livraison sont dans notre FAQ. La livraison a Thies est souvent gratuite !',
    link: { href: '/faq', label: 'Voir la FAQ' },
  },
  {
    keywords: ['commande', 'suivi', 'suivre', 'statut', 'ou est'],
    answer: 'Vous pouvez suivre votre commande avec votre numero de telephone :',
    link: { href: '/mes-commandes', label: 'Suivre ma commande' },
  },
  {
    keywords: ['vendre', 'vendeur', 'inscrire', 'inscription', 'fournisseur', 'partenaire'],
    answer: 'Vous voulez vendre sur Baye Guiinaar ? Inscrivez-vous ici :',
    link: { href: '/vendeur', label: 'Devenir vendeur' },
  },
  {
    keywords: ['poulailler', 'intelligent', 'capteur', 'temperature', 'iot', 'surveillance'],
    answer: 'Notre service Poulailler Intelligent surveille votre elevage automatiquement :',
    link: { href: '/poulailler-intelligent', label: 'Decouvrir le service' },
  },
  {
    keywords: ['contact', 'telephone', 'appeler', 'email', 'adresse', 'probleme', 'reclamation'],
    answer: 'Vous pouvez nous contacter par formulaire, WhatsApp ou email :',
    link: { href: '/contact', label: 'Page contact' },
  },
  {
    keywords: ['payer', 'paiement', 'wave', 'orange money', 'argent'],
    answer: 'Le paiement se fait a la livraison ou sur place (cash, Wave ou Orange Money). Vous ne payez jamais a l\'avance !',
    link: { href: '/faq', label: 'Plus de details' },
  },
  {
    keywords: ['connexion', 'connecter', 'compte', 'mot de passe', 'login'],
    answer: 'Connectez-vous a votre compte vendeur ici :',
    link: { href: '/connexion', label: 'Se connecter' },
  },
  {
    keywords: ['bonjour', 'salut', 'hey', 'bonsoir', 'hello', 'salam', 'na nga def'],
    answer: 'Bonjour ! Bienvenue sur Baye Guiinaar. Comment puis-je vous aider ? Vous cherchez a acheter, vendre, ou autre chose ?',
  },
  {
    keywords: ['merci', 'thanks', 'ok', 'daccord'],
    answer: 'Avec plaisir ! N\'hesitez pas si vous avez d\'autres questions.',
  },
];

const DEFAULT_ANSWER = 'Je n\'ai pas bien compris. Vous pouvez me demander :\n- Acheter des poulets\n- Suivre une commande\n- Devenir vendeur\n- Poulailler intelligent\n- Nous contacter';

function findResponse(input: string) {
  const lower = input.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  for (const r of RESPONSES) {
    if (r.keywords.some(k => lower.includes(k))) {
      return r;
    }
  }
  return null;
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { from: 'bot', text: 'Bonjour ! Je suis l\'assistant Baye Guiinaar. Comment puis-je vous aider ?' },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { from: 'user', text: input };
    const response = findResponse(input);
    const botMsg: Message = response
      ? { from: 'bot', text: response.answer, link: response.link }
      : { from: 'bot', text: DEFAULT_ANSWER };

    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput('');
  };

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 bg-green-700 text-white w-16 h-16 rounded-full shadow-xl flex items-center justify-center text-3xl hover:bg-green-800 transition hover:scale-110 border-4 border-white"
      >
        {open ? '✕' : '🤖'}
      </button>

      {/* Fenetre du chat */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden" style={{ height: '450px' }}>
          {/* Header */}
          <div className="bg-green-700 text-white px-4 py-3 flex items-center gap-2">
            <span className="text-xl">🐔</span>
            <div>
              <p className="font-bold text-sm">Assistant Baye Guiinaar</p>
              <p className="text-xs text-green-200">En ligne — reponse instantanee</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${msg.from === 'user' ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-800'}`}>
                  <p className="whitespace-pre-line">{msg.text}</p>
                  {msg.link && (
                    <Link
                      href={msg.link.href}
                      onClick={() => setOpen(false)}
                      className="inline-block mt-2 text-xs font-bold text-green-700 bg-white px-3 py-1 rounded-lg hover:bg-green-50 transition"
                    >
                      {msg.link.label} →
                    </Link>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="border-t border-gray-200 p-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ecrivez votre question..."
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-800 transition"
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}
