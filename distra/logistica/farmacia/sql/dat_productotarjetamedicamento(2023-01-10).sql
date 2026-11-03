ALTER TABLE mod_datosmaestros.nom_indicadormedicamento
  ADD COLUMN nombre VARCHAR(100);
  
COMMENT ON COLUMN mod_datosmaestros.nom_indicadormedicamento.nombre
IS 'Nombre y apellidos del medico';

ALTER TABLE mod_datosmaestros.nom_indicadormedicamento
  ADD COLUMN hospital VARCHAR(255);

ALTER TABLE mod_datosmaestros.nom_indicadormedicamento
  ADD COLUMN otrasunidades VARCHAR(255);