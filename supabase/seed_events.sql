BEGIN;

INSERT INTO events (id, title, description, location, event_date, category, organizer_id)
VALUES
  (
    gen_random_uuid(),
    'Dynamo FC vs Coton Sport',
    'Match Elite One avec ambiance premium et billetterie 100% mobile.',
    'Douala',
    '2026-02-15 18:30:00+00',
    'sport',
    NULL
  ),
  (
    gen_random_uuid(),
    'Canon de Yaoundé vs Colombe',
    'Classico camerounais, accès rapide et QR dynamique.',
    'Yaoundé',
    '2026-02-22 16:00:00+00',
    'sport',
    NULL
  ),
  (
    gen_random_uuid(),
    'AfroLive Night',
    'Concert urbain avec line-up premium et paiement Mobile Money.',
    'Yaoundé',
    '2026-03-06 20:30:00+00',
    'concert',
    NULL
  ),
  (
    gen_random_uuid(),
    'Douala Urban Fest',
    'Show live + performance DJ, expérience VIP.',
    'Douala',
    '2026-03-14 19:00:00+00',
    'concert',
    NULL
  ),
  (
    gen_random_uuid(),
    'Lions Fans Day',
    'Fan day officiel avec animations et surprises.',
    'Douala',
    '2026-03-21 15:00:00+00',
    'sport',
    NULL
  );

-- Crée des catégories de tickets pour chaque événement
WITH evt AS (
  SELECT id, title
  FROM events
  WHERE title IN (
    'Dynamo FC vs Coton Sport',
    'Canon de Yaoundé vs Colombe',
    'AfroLive Night',
    'Douala Urban Fest',
    'Lions Fans Day'
  )
)
INSERT INTO ticket_categories (event_id, name, price, total_quantity)
SELECT
  evt.id,
  tiers.name,
  tiers.price,
  tiers.qty
FROM evt
CROSS JOIN (
  VALUES
    ('VIP', 15000, 300),
    ('Classique', 5000, 2000),
    ('Tribune', 8000, 900)
) AS tiers(name, price, qty);

COMMIT;
