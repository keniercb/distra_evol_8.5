ALTER TABLE mod_logpuntoventa.dat_infoconexion
  ADD COLUMN IF NOT EXISTS modocatalogo NUMERIC(1,0) DEFAULT 0;