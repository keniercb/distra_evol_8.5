ALTER TABLE mod_logistica.dat_documentocliente
  ALTER COLUMN idcondicionpago DROP DEFAULT;

ALTER TABLE mod_logfacturacion.nom_categoriaprecio
  ADD COLUMN base NUMERIC(1,0);

ALTER TABLE mod_logfacturacion.nom_categoriaprecio
  ALTER COLUMN base SET DEFAULT 0;