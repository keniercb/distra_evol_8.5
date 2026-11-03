ALTER TABLE mod_logfacturacion.dat_docfacturatransportacion
  ADD COLUMN IF NOT EXISTS bl VARCHAR(100);
  
ALTER TABLE mod_logfacturacion.dat_docfacturatransportacion
  ADD COLUMN IF NOT EXISTS puertodestino VARCHAR(255);

ALTER TABLE mod_logfacturacion.dat_docfacturatransportacion
  ADD COLUMN IF NOT EXISTS idpuertodestino numeric(19,0);

ALTER TABLE mod_logfacturacion.dat_docfacturatransportacion
  ADD COLUMN IF NOT EXISTS destinocomercial VARCHAR(255);

ALTER TABLE mod_logfacturacion.dat_docfacturatransportacion
  ADD COLUMN IF NOT EXISTS prodgenerico VARCHAR(255);