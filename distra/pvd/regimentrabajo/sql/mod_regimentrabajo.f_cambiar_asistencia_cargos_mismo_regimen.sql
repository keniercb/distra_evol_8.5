-- FUNCTION: mod_regimentrabajo.migrar_asistencia_desde_his_a_dat(integer)

-- DROP FUNCTION IF EXISTS mod_regimentrabajo.f_cambiar_asistencia_cargos_mismo_regimen(numeric,date,numeric,numeric);

CREATE OR REPLACE FUNCTION mod_regimentrabajo.f_cambiar_asistencia_cargos_mismo_regimen(
    p_idpersona numeric,
    p_fechainicio date,
    p_idcargoanterior numeric,
    p_idcargoactual numeric)
    RETURNS text
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    v_registros_afectados INTEGER;
BEGIN
    WITH 
    asistencia_cargo_viejo AS (
        SELECT 
            da.idasistencia, 
            da.idpersona, 
            da.idcargo,
            nc.denominacion as cargo, 
            da.observacion,
            da.fecharegistro, 
            p_idcargoactual as idcargonuevo,
            ncn.denominacion as cargonuevo
        FROM mod_regimentrabajo.dat_asistencia as da
        INNER JOIN mod_estructuracomp.dat_cargo as dc ON da.idcargo = dc.idcargo
        INNER JOIN mod_estructuracomp.nom_cargo as nc ON nc.idnomcargo = dc.idnomcargo
        LEFT JOIN mod_estructuracomp.dat_cargo as dcn ON p_idcargoactual = dcn.idcargo
        LEFT JOIN mod_estructuracomp.nom_cargo as ncn ON ncn.idnomcargo = dcn.idnomcargo
        WHERE da.idpersona = p_idpersona
            AND da.fecharegistro >= p_fechainicio
            AND da.idcargo = p_idcargoanterior
    )
    UPDATE mod_regimentrabajo.dat_asistencia
    SET 
        observacion = 'Cambio de cargo al registro (vía ft_migrar_asistencia_movimientoslaborales()), detalles: '
                        || chr(10) || 'Cargo anterior'
                        || chr(10) || 'idcargo: ' || acv.idcargo
                        || chr(10) || 'cargo: ' || acv.cargo
                        || chr(10) || chr(10) || 'Cargo nuevo'
                        || chr(10) || 'idcargo: ' || acv.idcargonuevo
                        || chr(10) || 'cargo: ' || acv.cargonuevo,
        idcargo = acv.idcargonuevo
    FROM asistencia_cargo_viejo AS acv
    WHERE mod_regimentrabajo.dat_asistencia.idasistencia = acv.idasistencia;
    
    GET DIAGNOSTICS v_registros_afectados = ROW_COUNT;
    
    RETURN 'Cambio realizado. Registros afectados: ' || v_registros_afectados;
    
    EXCEPTION
        WHEN OTHERS THEN
            RAISE EXCEPTION 'Error en la migración: %', SQLERRM;
END;
$BODY$;

ALTER FUNCTION mod_regimentrabajo.f_cambiar_asistencia_cargos_mismo_regimen(numeric,date,numeric,numeric) OWNER TO zeolides;
