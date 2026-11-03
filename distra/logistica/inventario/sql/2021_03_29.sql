ALTER TABLE mod_loginventario.dat_conceptoimporterecep
  ADD COLUMN tasa NUMERIC(25,6);

COMMENT ON COLUMN mod_loginventario.dat_conceptoimporterecep.tasa
IS 'Tasa para los conceptos que no son de la misma moneda de la recepcion ni la moneda contable';