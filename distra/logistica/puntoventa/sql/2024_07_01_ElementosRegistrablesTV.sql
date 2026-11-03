ALTER TABLE mod_logpuntoventa.dat_infoconexion
  ADD COLUMN IF NOT EXISTS recordable NUMERIC(1,0) DEFAULT 0;
  
ALTER TABLE mod_logpuntoventa.dat_pedidoproducto
  ADD COLUMN recordable TEXT;  