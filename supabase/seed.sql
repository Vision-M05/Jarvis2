-- JarvisBTP Seed Data
-- Run this AFTER schema.sql to populate initial data

-- ============================================
-- Clients
-- ============================================
INSERT INTO clients (id, name, email, phone, address) VALUES
  ('11111111-1111-1111-1111-111111111111', 'M. Thomas', 'thomas@email.com', '06 12 34 56 78', '12 Rue des Lilas, 75001 Paris'),
  ('22222222-2222-2222-2222-222222222222', 'SARL Durieux', 'contact@durieux.fr', '01 23 45 67 89', '45 Avenue de la République, 69001 Lyon'),
  ('33333333-3333-3333-3333-333333333333', 'Mme. Lefebvre', 'lefebvre@email.com', '06 98 76 54 32', '8 Boulevard Haussmann, 75009 Paris'),
  ('44444444-4444-4444-4444-444444444444', 'Copropriété Les Érables', 'syndic@erables.fr', '01 45 67 89 10', '25 Rue des Érables, 92100 Boulogne'),
  ('55555555-5555-5555-5555-555555555555', 'SCI Les Lilas', 'contact@scileslilas.fr', '01 56 78 90 12', '15 Rue des Lilas, 75020 Paris');

-- ============================================
-- Items (Price Catalog)
-- ============================================
INSERT INTO items (id, reference, name, unit, price_ht, category) VALUES
  ('aaaa1111-1111-1111-1111-111111111111', 'M012', 'Parpaing creux 20x20x50 - Ep: 20cm', 'Unité (u)', 1.45, 'GROS OEUVRE'),
  ('aaaa2222-2222-2222-2222-222222222222', 'M045', 'Ciment gris Sac 35kg', 'Sac', 8.20, 'GROS OEUVRE'),
  ('aaaa3333-3333-3333-3333-333333333333', 'P112', 'Tube Cuivre Ø14mm (Barre 2m)', 'mètre (ml)', 14.50, 'PLOMBERIE'),
  ('aaaa4444-4444-4444-4444-444444444444', 'E009', 'Tableau électrique 3 rangées - Nu', 'Forfait (f)', 112.00, 'ELECTRICITE'),
  ('aaaa5555-5555-5555-5555-555555555555', 'I088', 'Laine de verre 100mm - Rouleau', 'm²', 18.90, 'ISOLATION'),
  ('aaaa6666-6666-6666-6666-666666666666', 'M002', 'Sable à bâtir 0/4 (vrac)', 'tonne (t)', 45.00, 'GROS OEUVRE'),
  ('aaaa7777-7777-7777-7777-777777777777', 'MO001', 'Main d''œuvre maçonnerie', 'heure', 45.00, 'MAIN OEUVRE'),
  ('aaaa8888-8888-8888-8888-888888888888', 'MO002', 'Main d''œuvre électricité', 'heure', 55.00, 'MAIN OEUVRE'),
  ('aaaa9999-9999-9999-9999-999999999999', 'ST001', 'Sous-traitance plâtrerie', 'forfait', 850.00, 'SOUS-TRAITANCE');

-- ============================================
-- Quotes (Devis)
-- ============================================
INSERT INTO quotes (id, reference, client_id, project_name, status, total_ht, valid_until, created_at) VALUES
  ('bbbb1111-1111-1111-1111-111111111111', 'DEV-2024-001', '11111111-1111-1111-1111-111111111111', 'Rénovation Toiture - Bât B', 'SIGNED', 1250.00, '2024-04-15', NOW()),
  ('bbbb2222-2222-2222-2222-222222222222', 'DEV-2024-002', '22222222-2222-2222-2222-222222222222', 'Installation Électrique', 'SENT', 4500.00, '2024-04-20', NOW() - INTERVAL '1 day'),
  ('bbbb3333-3333-3333-3333-333333333333', 'DEV-2024-003', '33333333-3333-3333-3333-333333333333', 'Menuiserie PVC', 'DRAFT', 850.00, '2024-04-25', NOW() - INTERVAL '2 days'),
  ('bbbb4444-4444-4444-4444-444444444444', 'DEV-2024-004', '44444444-4444-4444-4444-444444444444', 'Peinture Parties Communes', 'REFUSED', 12340.00, '2024-04-10', NOW() - INTERVAL '3 days'),
  ('bbbb5555-5555-5555-5555-555555555555', 'DEV-2024-005', '55555555-5555-5555-5555-555555555555', 'Réfection Façade', 'PENDING', 8750.00, '2024-05-01', NOW() - INTERVAL '4 days'),
  ('bbbb6666-6666-6666-6666-666666666666', 'DEV-2024-006', '11111111-1111-1111-1111-111111111111', 'Extension Garage', 'SIGNED', 15600.00, '2024-04-30', NOW() - INTERVAL '5 days'),
  ('bbbb7777-7777-7777-7777-777777777777', 'DEV-2024-007', '22222222-2222-2222-2222-222222222222', 'Isolation Combles', 'SENT', 3200.00, '2024-05-05', NOW() - INTERVAL '6 days'),
  ('bbbb8888-8888-8888-8888-888888888888', 'DEV-2024-008', '33333333-3333-3333-3333-333333333333', 'Salle de bain complète', 'DRAFT', 9800.00, '2024-05-10', NOW() - INTERVAL '7 days');

-- ============================================
-- Quote Items
-- ============================================
INSERT INTO quote_items (quote_id, item_id, label, quantity, unit_price) VALUES
  ('bbbb1111-1111-1111-1111-111111111111', 'aaaa1111-1111-1111-1111-111111111111', 'Parpaing creux 20x20x50', 200, 1.45),
  ('bbbb1111-1111-1111-1111-111111111111', 'aaaa2222-2222-2222-2222-222222222222', 'Ciment gris Sac 35kg', 50, 8.20),
  ('bbbb1111-1111-1111-1111-111111111111', 'aaaa7777-7777-7777-7777-777777777777', 'Main d''œuvre maçonnerie', 16, 45.00),
  ('bbbb2222-2222-2222-2222-222222222222', 'aaaa4444-4444-4444-4444-444444444444', 'Tableau électrique', 2, 112.00),
  ('bbbb2222-2222-2222-2222-222222222222', 'aaaa8888-8888-8888-8888-888888888888', 'Main d''œuvre électricité', 72, 55.00);

-- ============================================
-- Invoices (Factures)
-- ============================================
INSERT INTO invoices (id, quote_id, reference, status, total_ht, billed_percentage, due_date) VALUES
  ('cccc1111-1111-1111-1111-111111111111', 'bbbb1111-1111-1111-1111-111111111111', 'FAC-2024-001', 'PENDING', 1250.00, 0, NOW()),
  ('cccc2222-2222-2222-2222-222222222222', 'bbbb6666-6666-6666-6666-666666666666', 'FAC-2024-002', 'PENDING', 4500.00, 30, NOW() - INTERVAL '1 day'),
  ('cccc3333-3333-3333-3333-333333333333', 'bbbb2222-2222-2222-2222-222222222222', 'FAC-2024-003', 'PENDING', 850.00, 60, '2023-10-12'),
  ('cccc4444-4444-4444-4444-444444444444', 'bbbb5555-5555-5555-5555-555555555555', 'FAC-2024-004', 'LATE', 12340.00, 0, '2023-10-10');
