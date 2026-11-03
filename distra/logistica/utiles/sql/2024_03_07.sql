CREATE OR REPLACE FUNCTION mod_datosmaestros.ft_actualizar_numeropieza_con_codigobarra()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$

DECLARE
	v_temp record;
BEGIN

IF NEW.codigobarra is not null and NEW.codigobarra != '' THEN
	UPDATE mod_datosmaestros.nom_indicador
	SET numeropieza = NEW.codigobarra
	WHERE idindicador = NEW.idindicador and (numeropieza is null or numeropieza = '');
END IF;

RETURN NEW;
END;
$BODY$;

ALTER FUNCTION mod_datosmaestros.ft_actualizar_numeropieza_con_codigobarra()
    OWNER TO zeolides;
	
-----------

CREATE TRIGGER tr_nom_indicadorhoja_actualizar_numeropieza_con_codigobarra
    AFTER INSERT OR UPDATE OF codigobarra
    ON mod_datosmaestros.nom_indicadorhoja
    FOR EACH ROW
    EXECUTE FUNCTION mod_datosmaestros.ft_actualizar_numeropieza_con_codigobarra();


ALTER TABLE mod_datosmaestros.nom_indicadorhoja
    DISABLE TRIGGER tr_nom_indicadorhoja_actualizar_numeropieza_con_codigobarra;