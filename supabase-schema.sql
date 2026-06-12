-- =============================================
-- SenAgro Market - Schema Supabase
-- Exécutez ce SQL dans Supabase > SQL Editor
-- =============================================

-- Table des profils utilisateurs
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('buyer', 'seller')),
  location TEXT NOT NULL DEFAULT 'Thiès',
  business TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des produits
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  price INTEGER NOT NULL,
  unit TEXT DEFAULT 'pièce',
  category TEXT NOT NULL DEFAULT 'poulets' CHECK (category IN ('poulets', 'oeufs', 'aliments', 'autres')),
  image TEXT DEFAULT '/images/default.jpg',
  seller TEXT NOT NULL,
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  location TEXT DEFAULT 'Thiès',
  available BOOLEAN DEFAULT TRUE,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des commandes
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES profiles(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  customer_city TEXT DEFAULT 'Thiès',
  seller_id UUID REFERENCES profiles(id),
  items JSONB NOT NULL DEFAULT '[]',
  total INTEGER NOT NULL DEFAULT 0,
  payment_method TEXT DEFAULT 'wave',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SÉCURITÉ : Row Level Security (RLS)
-- =============================================

-- Activer RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- PROFILES : chaque utilisateur peut voir/modifier son propre profil
CREATE POLICY "Tout le monde peut voir les profils" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Les utilisateurs modifient leur propre profil" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Les utilisateurs créent leur propre profil" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- PRODUCTS : tout le monde voit, seul le vendeur modifie
CREATE POLICY "Tout le monde peut voir les produits" ON products
  FOR SELECT USING (true);

CREATE POLICY "Les vendeurs ajoutent leurs produits" ON products
  FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Les vendeurs modifient leurs produits" ON products
  FOR UPDATE USING (auth.uid() = seller_id);

CREATE POLICY "Les vendeurs suppriment leurs produits" ON products
  FOR DELETE USING (auth.uid() = seller_id);

-- ORDERS : acheteur voit ses commandes, vendeur voit ses commandes reçues
CREATE POLICY "Les acheteurs voient leurs commandes" ON orders
  FOR SELECT USING (auth.uid() = customer_id OR auth.uid() = seller_id);

CREATE POLICY "Les acheteurs créent des commandes" ON orders
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Les vendeurs mettent à jour les commandes" ON orders
  FOR UPDATE USING (auth.uid() = seller_id);
