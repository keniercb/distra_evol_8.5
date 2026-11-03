ALTER TABLE mod_logpuntoventa.dat_ventaorden
  ADD COLUMN exportado NUMERIC(10,0) DEFAULT 0;
  
COMMENT ON COLUMN mod_logpuntoventa.dat_ventaorden.exportado
IS 'Indica si el pedido fue exportado a xml en caso de que sea un pedido importado mediante archivo xml';

ALTER TABLE mod_logpuntoventa.dat_ventaorden
  ADD COLUMN fechaexportado DATE;

COMMENT ON COLUMN mod_logpuntoventa.dat_ventaorden.fechaexportado
IS 'Fecha en la que se hizo la exportacion a xml del pedido';

ALTER TABLE mod_logpuntoventa.dat_ventaorden
  ADD COLUMN idusuarioexport NUMERIC(19,0);

COMMENT ON COLUMN mod_logpuntoventa.dat_ventaorden.idusuarioexport
IS 'Usuario que exporto el fichero xml';

ALTER TABLE mod_logpuntoventa.dat_ventaorden
  ADD COLUMN idareaventaorigen NUMERIC(19,0);

COMMENT ON COLUMN mod_logpuntoventa.dat_ventaorden.idareaventaorigen
IS 'Area de venta donde se origino el pedido en el caso de que sea de tienda virtual';

ALTER TABLE mod_logpuntoventa.dat_ventaorden
  ADD COLUMN idreferencia NUMERIC(19,0);

COMMENT ON COLUMN mod_logpuntoventa.dat_ventaorden.idreferencia
IS 'campo que guarda el id de la orden en el sistema externo en caso de tenerlo';