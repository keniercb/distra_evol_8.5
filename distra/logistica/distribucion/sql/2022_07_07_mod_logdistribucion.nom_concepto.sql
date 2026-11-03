ALTER TABLE mod_logdistribucion.nom_concepto
  ADD COLUMN iddoc NUMERIC(19,0);

COMMENT ON COLUMN mod_logdistribucion.nom_concepto.iddoc
IS 'Almacena el identiificador de los documentos de inventario.';



ALTER TABLE mod_logdistribucion.nom_concepto
  ADD COLUMN idnomoperaciones NUMERIC(19,0);

COMMENT ON COLUMN mod_logdistribucion.nom_concepto.idnomoperaciones
IS 'Almacena el identificador de las operaciones para un documento';