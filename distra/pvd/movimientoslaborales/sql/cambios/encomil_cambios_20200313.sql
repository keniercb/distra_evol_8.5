ALTER TABLE mod_fuerzatrabajo.conf_nromn
  ADD COLUMN anno NUMERIC(19,0) NOT NULL;

COMMENT ON COLUMN mod_fuerzatrabajo.conf_nromn.anno
IS 'Año en que se generó el número del movimiento de nómina.';