ALTER TABLE mod_logfacturacion.dat_docfactura
  ADD COLUMN idfacturadigital VARCHAR;

COMMENT ON COLUMN mod_logfacturacion.dat_docfactura.idfacturadigital
IS 'Identificador de la factura digital en el sistema';

ALTER TABLE mod_logfacturacion.dat_docfactura
  ADD COLUMN estadocliente NUMERIC(2,0);

COMMENT ON COLUMN mod_logfacturacion.dat_docfactura.estadocliente
IS 'Almacena el estado de la factura en el modulo de factura digital(Generado,Firmado proveedor, Firmado cliente, Entregado al cliente)';

ALTER TABLE mod_logfacturacion.dat_docfactura
  ADD COLUMN numerofacturadigital VARCHAR;

COMMENT ON COLUMN mod_logfacturacion.dat_docfactura.numerofacturadigital
IS 'Almacena el numero de la factura en el modulo de facturacion digital';

ALTER TABLE mod_logfacturacion.dat_docfactura
  ADD COLUMN idfilexml VARCHAR;

COMMENT ON COLUMN mod_logfacturacion.dat_docfactura.idfilexml
IS 'Identificador del fichero xml generado para la factura digital';