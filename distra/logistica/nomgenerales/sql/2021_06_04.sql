ALTER TABLE mod_datosmaestros.nom_naturaleza
  ADD COLUMN codigoaux VARCHAR(50);

COMMENT ON COLUMN mod_datosmaestros.nom_naturaleza.codigoaux
IS 'Se utiliza para enlazar las sustituciones de los comprobantes en caso de que se repitan las sustituciones con varias cuentas en el modelo';