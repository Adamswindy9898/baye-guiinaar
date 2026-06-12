-- Ajouter la colonne commission
ALTER TABLE orders ADD COLUMN IF NOT EXISTS commission INTEGER DEFAULT 0;

-- Permettre aux utilisateurs non connectés de créer des commandes
CREATE POLICY "Tout le monde peut créer des commandes" ON orders
  FOR INSERT WITH CHECK (true);

-- Permettre à tout le monde de voir les produits (même non connecté)
DROP POLICY IF EXISTS "Tout le monde peut voir les produits" ON products;
CREATE POLICY "Tout le monde peut voir les produits" ON products
  FOR SELECT USING (true);
