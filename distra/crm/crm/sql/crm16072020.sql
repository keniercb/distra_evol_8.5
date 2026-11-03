ALTER TABLE mod_crmadministracion.dat_compartimentacion
  ADD COLUMN idestructuracomun NUMERIC(19,0);
  
  UPDATE 
  mod_crmadministracion.dat_compartimentacion 
SET 
  idestructuracomun = 100000532

;