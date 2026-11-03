ALTER TABLE mod_logpuntoventa.dat_areaventa
  ADD COLUMN idcondicionpago NUMERIC(19,0);

COMMENT ON COLUMN mod_logpuntoventa.dat_areaventa.idcondicionpago
IS 'Condicion de pago por defecto del cliente';

ALTER TABLE mod_logpuntoventa.dat_areaventa
  ADD COLUMN denominacionpago VARCHAR(255);

COMMENT ON COLUMN mod_logpuntoventa.dat_areaventa.denominacionpago
IS 'Denominacion de la condicion de pago';