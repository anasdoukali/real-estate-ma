CREATE TABLE IF NOT EXISTS site_maintenance (
  id integer PRIMARY KEY CHECK (id = 1),
  enabled boolean NOT NULL DEFAULT false,
  description text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
