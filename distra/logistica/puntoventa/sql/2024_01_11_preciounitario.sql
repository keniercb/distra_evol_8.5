ALTER TABLE IF EXISTS mod_logpuntoventa.dat_pedidoproducto
  ADD COLUMN IF NOT EXISTS preciounitario NUMERIC(25,6);