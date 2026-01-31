-- Active le RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Profils: chaque utilisateur ne lit/édite que son profil
CREATE POLICY "profiles_select_own"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Événements et catégories de tickets: lecture publique (fans)
CREATE POLICY "events_select_public"
ON events FOR SELECT
USING (true);

CREATE POLICY "ticket_categories_select_public"
ON ticket_categories FOR SELECT
USING (true);

-- Transactions: lecture/écriture uniquement par l'utilisateur
CREATE POLICY "transactions_select_own"
ON transactions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "transactions_insert_own"
ON transactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "transactions_update_own"
ON transactions FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Billets: lecture par l'utilisateur, création par l'utilisateur
CREATE POLICY "tickets_select_own"
ON tickets FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "tickets_insert_own"
ON tickets FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Scanner admin uniquement: peut valider un billet (is_scanned = true)
CREATE POLICY "tickets_admin_scan"
ON tickets FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
  )
);
