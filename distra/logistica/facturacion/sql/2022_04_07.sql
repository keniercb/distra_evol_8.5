ALTER TABLE mod_logfacturacion.dat_categoriapreciofactura
  ADD COLUMN IF NOT EXISTS condicionpago VARCHAR(100);
  
ALTER TABLE mod_logfacturacion.dat_categoriapreciofactura
  ADD COLUMN IF NOT EXISTS idcondicionpago numeric(19,0);
  
ALTER TABLE mod_logfacturacion.dat_categoriapreciofactura
  ADD COLUMN IF NOT EXISTS idcliente numeric(19,0);