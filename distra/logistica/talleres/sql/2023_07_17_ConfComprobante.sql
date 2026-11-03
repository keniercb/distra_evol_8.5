ALTER TABLE mod_logtaller.conf_talleres
  ADD COLUMN comprobante NUMERIC(1,0) DEFAULT 0;

COMMENT ON COLUMN mod_logtaller.conf_talleres.comprobante
IS 'Configuracion para generar comprobante automaticamente al cerrar la OT';