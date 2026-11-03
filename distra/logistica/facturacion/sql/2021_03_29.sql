
ALTER TABLE mod_logfacturacion.dat_desgloselemento
  ADD COLUMN importe NUMERIC(25,6);
  
ALTER TABLE mod_logfacturacion.dat_prodfactura
  ADD COLUMN importe NUMERIC(25,6);

COMMENT ON COLUMN mod_logfacturacion.dat_prodfactura.importe
IS 'Guarda importe nota de credito';

ALTER TABLE mod_logfacturacion.dat_prodfactura
  ADD COLUMN preciofactura NUMERIC(25,6);
  
COMMENT ON COLUMN mod_logfacturacion.dat_prodfactura.preciofactura
IS 'Guarda precio de la factura de la NC';

ALTER TABLE mod_logfacturacion.dat_elementosfactura
  ADD COLUMN cantidadfactura NUMERIC(25,6);
  
ALTER TABLE mod_logfacturacion.dat_elementosfactura
  ADD COLUMN idprod NUMERIC(19,0);
  
ALTER TABLE mod_logfacturacion.dat_prodfactura
  ADD COLUMN referencia NUMERIC(25,6);

ALTER TABLE mod_logfacturacion.dat_prodfactura
  ALTER COLUMN referencia SET DEFAULT 0;
  
COMMENT ON COLUMN mod_logfacturacion.dat_prodfactura.referencia
IS 'Guarda el precio de costo con el que se calculo el precio de venta';
  
  
ALTER TABLE mod_logfacturacion.dat_prodfactura
  ADD COLUMN referenciaalt NUMERIC(25,6);

ALTER TABLE mod_logfacturacion.dat_prodfactura
  ALTER COLUMN referenciaalt SET DEFAULT 0;

COMMENT ON COLUMN mod_logfacturacion.dat_prodfactura.referenciaalt
IS 'Guarda el precio de costo con el que se calculo el precio de venta';

ALTER TABLE mod_logfacturacion.dat_prodservnomenclador
  ADD COLUMN referencia NUMERIC(25,6);

ALTER TABLE mod_logfacturacion.dat_prodservnomenclador
  ALTER COLUMN referencia SET DEFAULT 0;

COMMENT ON COLUMN mod_logfacturacion.dat_prodservnomenclador.referencia
IS 'Precio de referencia para el calculo del precio de venta';

ALTER TABLE mod_logfacturacion.dat_prodservnomenclador
  ADD COLUMN referenciaalt NUMERIC(25,6);

ALTER TABLE mod_logfacturacion.dat_prodservnomenclador
  ALTER COLUMN referenciaalt SET DEFAULT 0;

COMMENT ON COLUMN mod_logfacturacion.dat_prodservnomenclador.referenciaalt
IS 'Precio de referencia para el calculo del precio de venta';

ALTER TABLE mod_logfacturacion.nom_categoriaprecio
  ADD COLUMN base NUMERIC(1,0);

ALTER TABLE mod_logfacturacion.nom_categoriaprecio
  ALTER COLUMN base SET DEFAULT 0;
  
ALTER TABLE mod_logfacturacion.nom_categoriaprecio
  ADD COLUMN idtipo NUMERIC(1,0);

ALTER TABLE mod_logfacturacion.nom_categoriaprecio
  ALTER COLUMN idtipo SET DEFAULT 0;