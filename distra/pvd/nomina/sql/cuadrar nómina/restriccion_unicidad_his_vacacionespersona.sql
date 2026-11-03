-- ALTER TABLE IF EXISTS mod_nomina.his_vacacionespersona DROP CONSTRAINT IF EXISTS ak_period_nomina_entidad_vacpersona;
ALTER TABLE IF EXISTS mod_nomina.his_vacacionespersona
    ADD CONSTRAINT ak_period_nomina_entidad_vacpersona UNIQUE (idnomina, periodo, identidad, idvacacionespersona);
COMMENT ON CONSTRAINT ak_period_nomina_entidad_vacpersona ON mod_nomina.his_vacacionespersona
    IS 'Restricción de unicidad para evitar datos duplicados en los registros históricos de la vacaciones.';
