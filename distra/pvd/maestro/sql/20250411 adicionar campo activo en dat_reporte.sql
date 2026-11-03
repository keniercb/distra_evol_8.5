--------------- SQL ---------------

ALTER TABLE mod_rrhhmaestro.dat_reporte
  DISABLE TRIGGER ALL;
  
--------------- SQL ---------------

ALTER TABLE mod_rrhhmaestro.dat_reporte
  ADD COLUMN activo NUMERIC(1,0) DEFAULT 1 NOT NULL;

--------------- SQL ---------------

ALTER TABLE mod_rrhhmaestro.dat_reporte
  ENABLE TRIGGER ALL;  