ALTER TABLE mod_logfacturacion.dat_prodfactura
  ADD COLUMN mediatotal NUMERIC(25,2) DEFAULT 0;
  
ALTER TABLE mod_logfacturacion.dat_prodservnomenclador
  ADD COLUMN mediatotal NUMERIC(25,2) DEFAULT 0;
  
ALTER TABLE mod_logfacturacion.dat_activosfactura
  ADD COLUMN mediatotal NUMERIC(25,2) DEFAULT 0;