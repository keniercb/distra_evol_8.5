ALTER TABLE mod_logfacturacion.dat_operacionsubsistema
  ADD COLUMN IF NOT EXISTS preciocero NUMERIC(1,0) DEFAULT -1;
  
ALTER TABLE mod_logfacturacion.dat_docfactura
  ADD COLUMN IF NOT EXISTS preciocero NUMERIC(1,0);  