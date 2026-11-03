ALTER TABLE mod_logistica.his_bitacora
  ADD COLUMN estado numeric(2,0);

COMMENT ON COLUMN mod_logistica.his_bitacora.estado
IS 'Estado en que se encuentra el documento';

ALTER TABLE mod_logistica.his_bitacora
  ADD COLUMN denomestado varchar(100);
  
COMMENT ON COLUMN mod_logistica.his_bitacora.estado
IS 'Denominacion del Estado en que se encuentra el documento';