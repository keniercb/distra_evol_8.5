ALTER TABLE mod_logtaller.dat_ordenactividad
  ADD COLUMN modificado NUMERIC(1,0) DEFAULT 0 NOT NULL;

COMMENT ON COLUMN mod_logtaller.dat_ordenactividad.modificado
IS '0- por defecto, 1- si se modifico manualmente el precio del servicio';