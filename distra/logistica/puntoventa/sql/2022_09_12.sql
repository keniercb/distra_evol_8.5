ALTER TABLE mod_logpuntoventa.dat_caja
  ADD COLUMN idmodeloimpresion NUMERIC(1,0) DEFAULT 1;

COMMENT ON COLUMN mod_logpuntoventa.dat_caja.idmodeloimpresion
IS '1 en caso de imprimir modelo de Factura comercial, 2 en caso de que sea Ticket de venta.';

ALTER TABLE mod_logpuntoventa.dat_caja
  ADD COLUMN modeloimpresion VARCHAR(150);

COMMENT ON COLUMN mod_logpuntoventa.dat_caja.modeloimpresion
IS 'Denominacion de modelo de impresion por defecto';

ALTER TABLE mod_logpuntoventa.dat_ventas
  ADD COLUMN idmodeloimpresion NUMERIC(1,0);

COMMENT ON COLUMN mod_logpuntoventa.dat_ventas.idmodeloimpresion
IS 'Para saber que modelo de impresion se uso en esta venta. 1 en caso de que sea "Factura comercial" y 2 en caso de que sea "Ticket de venta".';

ALTER TABLE mod_logpuntoventa.dat_ventas
  ALTER COLUMN idmodeloimpresion SET DEFAULT 1;