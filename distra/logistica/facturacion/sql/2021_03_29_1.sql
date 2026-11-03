ALTER TABLE mod_logfacturacion.conf_configuracionfactura
  ADD COLUMN completardistribucion NUMERIC(1,0);

ALTER TABLE mod_logfacturacion.conf_configuracionfactura
  ALTER COLUMN completardistribucion SET DEFAULT 0;

COMMENT ON COLUMN mod_logfacturacion.conf_configuracionfactura.completardistribucion
IS '0 seleccionar deposito para generar factura, 1 genera facturas por depositos de la distribucion';