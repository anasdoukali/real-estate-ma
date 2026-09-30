CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id serial PRIMARY KEY,
  email varchar(190) NOT NULL UNIQUE,
  language varchar(8) NOT NULL DEFAULT 'fr',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
