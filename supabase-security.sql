-- =============================================
-- SenAgro Market - Corrections de Securite RLS
-- Executez ce SQL dans Supabase > SQL Editor
-- =============================================

-- =============================================
-- 1. Ajouter le role admin dans profiles
-- =============================================
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('buyer', 'seller', 'admin', 'blocked'));

-- Definir l'admin existant
UPDATE profiles SET role = 'admin' WHERE email = 'gayea591@gmail.com';

-- =============================================
-- 2. Securiser la table MESSAGES (seul l'admin lit/modifie)
-- =============================================
DROP POLICY IF EXISTS "Tout le monde peut lire les messages" ON messages;
DROP POLICY IF EXISTS "Mise a jour des messages" ON messages;

CREATE POLICY "Seul admin lit les messages" ON messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Seul admin modifie les messages" ON messages
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Seul admin supprime les messages" ON messages
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =============================================
-- 3. Securiser la table TESTIMONIALS (seul l'admin approuve/supprime)
-- =============================================
DROP POLICY IF EXISTS "Voir les temoignages approuves" ON testimonials;
DROP POLICY IF EXISTS "Mise a jour des temoignages" ON testimonials;

-- Tout le monde voit les temoignages approuves
CREATE POLICY "Voir temoignages approuves" ON testimonials
  FOR SELECT USING (approved = true OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Seul l'admin modifie (approuver)
CREATE POLICY "Admin modifie temoignages" ON testimonials
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Seul l'admin supprime
CREATE POLICY "Admin supprime temoignages" ON testimonials
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =============================================
-- 4. Securiser la table ORDERS (admin peut tout voir/modifier)
-- =============================================
DROP POLICY IF EXISTS "Les vendeurs mettent à jour les commandes" ON orders;

CREATE POLICY "Vendeur ou admin modifie commandes" ON orders
  FOR UPDATE USING (
    auth.uid() = seller_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Les acheteurs voient leurs commandes" ON orders;

CREATE POLICY "Utilisateur voit ses commandes ou admin voit tout" ON orders
  FOR SELECT USING (
    auth.uid() = customer_id OR auth.uid() = seller_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =============================================
-- 5. Securiser la table PRODUCTS (admin peut supprimer)
-- =============================================
DROP POLICY IF EXISTS "Les vendeurs suppriment leurs produits" ON products;

CREATE POLICY "Vendeur ou admin supprime produits" ON products
  FOR DELETE USING (
    auth.uid() = seller_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =============================================
-- 6. Securiser la table PROFILES (admin peut modifier les roles)
-- =============================================
DROP POLICY IF EXISTS "Les utilisateurs modifient leur propre profil" ON profiles;

CREATE POLICY "Utilisateur modifie son profil ou admin modifie tout" ON profiles
  FOR UPDATE USING (
    auth.uid() = id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
