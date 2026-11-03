ALTER TABLE IF EXISTS mod_logfacturacion.dat_docfactura
  ADD COLUMN IF NOT EXISTS nombrecontacto VARCHAR(100);
  
 ALTER TABLE IF EXISTS mod_logfacturacion.dat_docfactura
  ADD COLUMN IF NOT EXISTS cicontacto VARCHAR(100); 
  
ALTER TABLE IF EXISTS mod_logfacturacion.dat_docfactura
  ADD COLUMN IF NOT EXISTS telfcontacto VARCHAR(100);  
  
CREATE INDEX dat_docfactura_idxnombre ON mod_logfacturacion.dat_docfactura
  USING btree (nombrecontacto);
  
CREATE INDEX dat_docfactura_idxci ON mod_logfacturacion.dat_docfactura
  USING btree (cicontacto);  
  
CREATE INDEX dat_docfactura_idxtelf ON mod_logfacturacion.dat_docfactura
  USING btree (telfcontacto);  