ALTER TABLE mod_logfacturacion.dat_activosfactura
  ADD COLUMN IF NOT EXISTS referencia NUMERIC(25,6) DEFAULT 0;
  
ALTER TABLE mod_logfacturacion.dat_activosfactura
  ADD COLUMN IF NOT EXISTS referenciaalt NUMERIC(25,6) DEFAULT 0;