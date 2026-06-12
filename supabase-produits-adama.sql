-- =============================================
-- SenAgro Market - Produits d'Adama (Ferme Thies)
-- Executez ce SQL dans Supabase > SQL Editor
-- IMPORTANT: Remplacez 'SELLER_ID_ICI' par l'UUID de votre compte vendeur
-- (visible dans Supabase > Authentication > Users ou dans la table profiles)
-- =============================================

-- Poulet de chair standard (2kg)
INSERT INTO products (name, description, price, unit, category, seller, seller_id, location, available, stock)
VALUES (
  'Poulet de chair (2kg)',
  'Poulet de chair eleve en plein air a Thies. Nourri aux cereales locales, poids moyen 2kg. Frais du jour.',
  3500,
  'piece',
  'poulets',
  'Ferme Adama Thies',
  'SELLER_ID_ICI',
  'Thies',
  true,
  50
);

-- Poulet de chair gros (2.5kg+)
INSERT INTO products (name, description, price, unit, category, seller, seller_id, location, available, stock)
VALUES (
  'Poulet de chair gros (2.5kg+)',
  'Gros poulet de chair, poids 2.5kg et plus. Ideal pour les grandes families et evenements.',
  4500,
  'piece',
  'poulets',
  'Ferme Adama Thies',
  'SELLER_ID_ICI',
  'Thies',
  true,
  30
);

-- Poulet fermier
INSERT INTO products (name, description, price, unit, category, seller, seller_id, location, available, stock)
VALUES (
  'Poulet fermier traditionnel',
  'Poulet fermier eleve naturellement pendant 3 mois minimum. Chair ferme et gout authentique.',
  5000,
  'piece',
  'poulets',
  'Ferme Adama Thies',
  'SELLER_ID_ICI',
  'Thies',
  true,
  20
);

-- Lot de 5 poulets (prix grossiste)
INSERT INTO products (name, description, price, unit, category, seller, seller_id, location, available, stock)
VALUES (
  'Lot de 5 poulets de chair',
  'Lot de 5 poulets de chair (2kg chacun). Prix avantageux pour familles, restaurants et evenements.',
  16000,
  'lot',
  'poulets',
  'Ferme Adama Thies',
  'SELLER_ID_ICI',
  'Thies',
  true,
  10
);

-- Lot de 10 poulets (prix grossiste)
INSERT INTO products (name, description, price, unit, category, seller, seller_id, location, available, stock)
VALUES (
  'Lot de 10 poulets de chair',
  'Lot de 10 poulets de chair. Prix grossiste imbattable pour restaurants, traiteurs et grandes ceremonies.',
  30000,
  'lot',
  'poulets',
  'Ferme Adama Thies',
  'SELLER_ID_ICI',
  'Thies',
  true,
  5
);

-- Poulet pret a cuire (eviscere)
INSERT INTO products (name, description, price, unit, category, seller, seller_id, location, available, stock)
VALUES (
  'Poulet pret a cuire (eviscere)',
  'Poulet de chair deja tue, plume et eviscere. Pret a cuisiner directement. Commandez avant 10h pour livraison le jour meme.',
  4000,
  'piece',
  'poulets',
  'Ferme Adama Thies',
  'SELLER_ID_ICI',
  'Thies',
  true,
  15
);
