DROP TABLE IF EXISTS mod_nomina.his_cargosocupados;

CREATE TABLE IF NOT EXISTS mod_nomina.his_cargosocupados
AS (SELECT idcargosocupados as idhiscargosocupados, idpersona, idcargo, identidad, fecharegistro, fechaaplicacion, 
	fechavencimiento, observaciones, idsituacionlaboral, idcajacajero, idcentrocosto, 
	idpersonacuentabancariamn, idpersonacuentabancariacuc, numerocontable, idplantillanominal
	FROM mod_nomina.dat_cargosocupados WHERE idcargosocupados = -1);

ALTER TABLE IF EXISTS mod_nomina.his_cargosocupados OWNER to zeolides;

REVOKE ALL ON TABLE mod_nomina.his_cargosocupados FROM PUBLIC;

GRANT SELECT, INSERT, TRIGGER, REFERENCES, UPDATE, DELETE ON TABLE mod_nomina.his_cargosocupados TO PUBLIC;

GRANT ALL ON TABLE mod_nomina.his_cargosocupados TO zeolides;
