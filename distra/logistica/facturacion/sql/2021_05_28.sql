ALTER TABLE mod_logfacturacion.dat_operacionsubsistema
  ADD COLUMN cobropago NUMERIC(1,0);

ALTER TABLE mod_logfacturacion.dat_operacionsubsistema
  ALTER COLUMN cobropago SET DEFAULT 1;
  
ALTER TABLE mod_logfacturacion.dat_operacionsubsistema
  ADD COLUMN comprobante NUMERIC(1,0);

ALTER TABLE mod_logfacturacion.dat_operacionsubsistema
  ALTER COLUMN comprobante SET DEFAULT 0;
  
update mod_logfacturacion.dat_operacionsubsistema
set cobropago = 1;

update mod_logfacturacion.dat_operacionsubsistema
set comprobante = 0;

ALTER TABLE mod_logfacturacion.dat_docfactura
  ADD COLUMN nrorden VARCHAR(100);