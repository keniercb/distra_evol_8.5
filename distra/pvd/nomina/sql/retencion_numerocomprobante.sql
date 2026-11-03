-- Script para agregar la columna numerocomprobante a la tabla dat_retencionpersona
ALTER TABLE mod_nomina.dat_retencionpersona
  ADD COLUMN numerocomprobante NUMERIC(19,0);


