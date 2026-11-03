-- FUNCTION: mod_nomina.salvar_cargoanterior_historico()
DROP TRIGGER IF EXISTS t_salvar_cargoanterior_historico ON mod_nomina.dat_cargosocupados;
DROP FUNCTION IF EXISTS mod_nomina.ft_salvar_cargoanterior_historico();

CREATE OR REPLACE FUNCTION mod_nomina.ft_salvar_cargoanterior_historico()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
     IF (TG_OP = 'UPDATE') THEN
		INSERT INTO mod_nomina.his_cargosocupados(
			idhiscargosocupados, idpersona, idcargo, identidad, fecharegistro, fechaaplicacion, 
			fechavencimiento, observaciones, idsituacionlaboral, idcajacajero, idcentrocosto, 
			idpersonacuentabancariamn, idpersonacuentabancariacuc, numerocontable, idplantillanominal)
		(SELECT idcargosocupados, idpersona, idcargo, identidad, fecharegistro, fechaaplicacion, 
			fechavencimiento, observaciones, idsituacionlaboral, idcajacajero, idcentrocosto, 
			idpersonacuentabancariamn, idpersonacuentabancariacuc, numerocontable, idplantillanominal
			FROM mod_nomina.dat_cargosocupados
			where idpersona = NEW.idpersona and activa = 1); 
      	RETURN NEW;
	END IF;
END;
$BODY$;

ALTER FUNCTION mod_nomina.ft_salvar_cargoanterior_historico() OWNER TO zeolides;

CREATE TRIGGER t_salvar_cargoanterior_historico
    BEFORE UPDATE
    ON mod_nomina.dat_cargosocupados
    FOR EACH ROW
    EXECUTE FUNCTION mod_nomina.ft_salvar_cargoanterior_historico();
ALTER TABLE mod_nomina.dat_cargosocupados
    DISABLE TRIGGER t_salvar_cargoanterior_historico;
