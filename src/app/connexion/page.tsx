'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ConnexionPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      if (email === 'gayea591@gmail.com') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch {
      setError('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/connexion`,
    });
    setResetLoading(false);
    if (error) {
      setError('Erreur lors de l\'envoi. Verifiez votre email.');
    } else {
      setResetSent(true);
    }
  };

  if (showReset) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="text-center mb-6">
            <span className="text-4xl block mb-2">🔑</span>
            <h1 className="text-2xl font-bold text-gray-800">Mot de passe oublie</h1>
            <p className="text-sm text-gray-600 mt-1">Entrez votre email pour recevoir un lien de reinitialisation</p>
          </div>

          {resetSent ? (
            <div className="text-center py-6">
              <span className="text-4xl block mb-3">✅</span>
              <p className="text-gray-700 font-medium mb-2">Email envoye !</p>
              <p className="text-sm text-gray-600 mb-4">Verifiez votre boite mail et cliquez sur le lien pour reinitialiser votre mot de passe.</p>
              <button onClick={() => { setShowReset(false); setResetSent(false); }} className="text-green-700 font-medium hover:underline text-sm">
                Retour a la connexion
              </button>
            </div>
          ) : (
            <>
              {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    placeholder="votre@email.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full bg-green-700 text-white py-3 rounded-xl font-bold hover:bg-green-800 transition disabled:opacity-50"
                >
                  {resetLoading ? 'Envoi...' : 'Envoyer le lien'}
                </button>
              </form>
              <p className="text-center text-sm text-gray-600 mt-4">
                <button onClick={() => { setShowReset(false); setError(''); }} className="text-green-700 font-medium hover:underline">
                  Retour a la connexion
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-6">
          <span className="text-4xl block mb-2">🔐</span>
          <h1 className="text-2xl font-bold text-gray-800">Espace vendeur</h1>
          <p className="text-sm text-gray-600 mt-1">Connectez-vous pour gerer vos produits</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="votre@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white py-3 rounded-xl font-bold hover:bg-green-800 transition disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="text-center mt-4">
          <button onClick={() => { setShowReset(true); setError(''); }} className="text-sm text-gray-500 hover:text-green-700">
            Mot de passe oublie ?
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          Pas encore vendeur ?{' '}
          <Link href="/inscription" className="text-green-700 font-medium hover:underline">
            Creer un compte vendeur
          </Link>
        </p>
      </div>
    </div>
  );
}
