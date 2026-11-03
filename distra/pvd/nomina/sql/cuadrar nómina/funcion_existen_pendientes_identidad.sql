-- DROP FUNCTION IF EXISTS mod_nomina.existen_pendientes_identidad();
CREATE OR REPLACE FUNCTION mod_nomina.existen_pendientes_identidad(
	)
    RETURNS boolean
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN
    RETURN EXISTS (SELECT 1 FROM mod_nomina.his_vacacionespersona WHERE identidad IS NULL LIMIT 1);
END;
$BODY$;

ALTER FUNCTION mod_nomina.existen_pendientes_identidad() OWNER TO zeolides;
