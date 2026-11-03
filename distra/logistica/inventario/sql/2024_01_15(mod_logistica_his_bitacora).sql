CREATE INDEX iddocumento ON mod_logistica.his_bitacora
  USING btree (iddocumento);
  
  CREATE INDEX fechacontable ON mod_logistica.his_bitacora
  USING btree (fechacontable);