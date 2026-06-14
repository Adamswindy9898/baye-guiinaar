-- Table des annonces (carousel page d'accueil)
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'image', 'video')),
  media_url TEXT,
  link_url TEXT,
  link_text TEXT DEFAULT 'En savoir plus',
  bg_color TEXT DEFAULT '#15803d',
  text_color TEXT DEFAULT '#ffffff',
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Index pour les annonces actives
CREATE INDEX idx_announcements_active ON announcements (active, sort_order) WHERE active = true;

-- Quelques annonces exemples
INSERT INTO announcements (title, description, type, bg_color, link_url, link_text, sort_order) VALUES
('Bienvenue sur Baye Guiinaar !', 'La marketplace agricole #1 au Senegal. Poulets frais, oeufs et aliments livres chez vous.', 'text', '#15803d', '/produits', 'Voir les produits', 1),
('Nouveau : Parrainez vos amis', 'Invitez un ami et gagnez 500 F de reduction chacun sur votre prochaine commande !', 'text', '#7e22ce', '/parrainage', 'Parrainer maintenant', 2),
('Livraison gratuite a Thies', 'Pour toute commande de plus de 10 000 F, la livraison est offerte sur Thies !', 'text', '#b45309', '/produits', 'Commander', 3);

-- RLS policies
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tout le monde peut voir les annonces actives"
  ON announcements FOR SELECT
  USING (active = true AND (expires_at IS NULL OR expires_at > NOW()));

CREATE POLICY "Admin peut tout gerer"
  ON announcements FOR ALL
  USING (true)
  WITH CHECK (true);
