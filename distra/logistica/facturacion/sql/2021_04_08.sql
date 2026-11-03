ALTER TABLE mod_logfacturacion.dat_docfactura
  ADD COLUMN idcentrocosto NUMERIC(19,0);

COMMENT ON COLUMN mod_logfacturacion.dat_docfactura.idcentrocosto
IS 'Guarda el identificador del centro de costo';