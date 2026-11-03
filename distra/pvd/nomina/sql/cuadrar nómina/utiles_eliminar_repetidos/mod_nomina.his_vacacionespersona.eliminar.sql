-- ALTER TABLE IF EXISTS mod_nomina.his_vacacionespersona DROP COLUMN IF EXISTS eliminar;
ALTER TABLE IF EXISTS mod_nomina.his_vacacionespersona
    ADD COLUMN IF NOT EXISTS eliminar integer;
COMMENT ON COLUMN mod_nomina.his_vacacionespersona.eliminar
    IS 'marca temporal para limpiar datos.';
