--------------- SQL ---------------

ALTER TABLE mod_logistica.dat_lote
  ADD COLUMN precio NUMERIC(25,6) DEFAULT 0 NOT NULL;
  
--------------- SQL ---------------

ALTER TABLE mod_logistica.dat_movlote
  ADD COLUMN precio NUMERIC(25,6) DEFAULT 0 NOT NULL;  
  
--------------- SQL ---------------

ALTER TABLE mod_logistica.dat_movlote
  ADD COLUMN importe NUMERIC(25,6) DEFAULT 0 NOT NULL;  
  
--------------- SQL ---------------

ALTER TABLE mod_logistica.dat_lote
  ADD COLUMN importe NUMERIC(25,6) DEFAULT 0 NOT NULL;  