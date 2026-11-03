ALTER TABLE mod_logfacturacion.dat_operacionsubsistema
  ADD COLUMN IF NOT EXISTS vm NUMERIC(1,0) DEFAULT 0;
  
  
ALTER TABLE mod_logfacturacion.dat_categoriapreciofactura
  ADD COLUMN IF NOT EXISTS codigo VARCHAR(10);
  

ALTER TABLE mod_logfacturacion.dat_categoriapreciofactura
  ADD COLUMN IF NOT EXISTS cuenta VARCHAR(50);  
  