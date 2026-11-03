ALTER TABLE mod_logpuntoventa.dat_pedidotienda
  ADD COLUMN IF NOT EXISTS hora TIME WITHOUT TIME ZONE DEFAULT now()::time;