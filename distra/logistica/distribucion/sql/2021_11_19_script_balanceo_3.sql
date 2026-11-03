ALTER TABLE mod_logdistribucion.dat_distribucionpedido
DROP CONSTRAINT IF EXISTS fk_distribucion_distribucionpedido RESTRICT;

COMMENT ON COLUMN mod_logdistribucion.dat_distribucionpedido.iddistribucion
IS '
Este campo NO puede tener llave foranea. Puede ser la relacion con varias tablas.
- mod_logistica.dat_documento
- mod_crmcontratacion.dat_solicitudnegocio
- etc
Representa los procesos por donde va pasando un pedido. (Distribucion, Demandas de compra, Etc)';