ALTER TABLE mod_logpuntoventa.dat_areaventa
  ADD COLUMN nocierreperiodo NUMERIC(1,0) DEFAULT 0;

COMMENT ON COLUMN mod_logpuntoventa.dat_areaventa.nocierreperiodo
IS '0- por defecto, realizar cierre del periodo de facturacion, 1- no hay  que realizar el cierre del periodo de facturacion';