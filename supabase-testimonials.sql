-- =============================================
-- SenAgro Market - Table Temoignages / Avis clients
-- Executez ce SQL dans Supabase > SQL Editor
-- =============================================

CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Thies',
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  message TEXT NOT NULL,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tout le monde peut envoyer un temoignage" ON testimonials
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Voir les temoignages approuves" ON testimonials
  FOR SELECT USING (true);

CREATE POLICY "Mise a jour des temoignages" ON testimonials
  FOR UPDATE USING (true);
