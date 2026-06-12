-- =============================================
-- SenAgro Market - Table Messages / Contact
-- Executez ce SQL dans Supabase > SQL Editor
-- =============================================

CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT DEFAULT '',
  type TEXT NOT NULL DEFAULT 'question' CHECK (type IN ('question', 'partenariat', 'reclamation', 'autre')),
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tout le monde peut envoyer un message (pas besoin de compte)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tout le monde peut envoyer un message" ON messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Tout le monde peut lire les messages" ON messages
  FOR SELECT USING (true);

CREATE POLICY "Mise a jour des messages" ON messages
  FOR UPDATE USING (true);
