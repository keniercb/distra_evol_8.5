CREATE OR REPLACE FUNCTION mod_personaext.ft_migrar_asistencia_movimientoslaborales()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 10
    VOLATILE NOT LEAKPROOF
AS $BODY$
DECLARE
    v_cargo_anterior record;
    v_fecha_inicio_cambio date;
    v_idregimentrabajop_anterior numeric;
BEGIN
    -- Solo procesar cuando el régimen es el mismo y hay un cargo asignado
    IF NEW.idregimentrabajo IS NULL OR NEW.idcargo IS NULL THEN
        RETURN NEW;
    END IF;

    -- Obtener el registro activo anterior del mismo régimen
    SELECT dr.idcargo, dr.idregimentrabajo, dr.fdesde, dr.fhasta, 
           dr.actual, dr.idregimentrabajop
    INTO v_cargo_anterior
    FROM mod_personaext.dat_regimentrabajo dr
    WHERE dr.idpersona = NEW.idpersona 
        AND dr.fhasta = NEW.fechainsercion::date
		AND dr.idregimentrabajo = NEW.idregimentrabajo
	ORDER BY dr.idregimentrabajop DESC
    LIMIT 1;

    -- Verificar si encontramos un cargo anterior del mismo régimen
    IF FOUND AND v_cargo_anterior.idcargo IS NOT NULL 
       AND v_cargo_anterior.idcargo != NEW.idcargo THEN
        
        -- Guardar el ID del registro anterior
        v_idregimentrabajop_anterior := v_cargo_anterior.idregimentrabajop;
        
        -- Determinar la fecha a partir de la cual aplicar el cambio
        IF NEW.fdesde <= NEW.fechainsercion::date THEN
            v_fecha_inicio_cambio := NEW.fdesde;
        ELSE
            v_fecha_inicio_cambio := date_trunc('month', NEW.fechainsercion)::date;
        END IF;
        
        -- Actualizar el registro anterior a actual=0 (AHORA MISMO)
        UPDATE mod_personaext.dat_regimentrabajo
        SET actual = 0,
            fhasta = NEW.fechainsercion::date
        WHERE idpersona = NEW.idpersona 
            AND idregimentrabajop = v_idregimentrabajop_anterior
            AND actual = 1;
        
        -- Ejecutar el cambio en la tabla de asistencia (AHORA MISMO)
        PERFORM mod_regimentrabajo.f_cambiar_asistencia_cargos_mismo_regimen(
            NEW.idpersona,
            v_fecha_inicio_cambio,
            v_cargo_anterior.idcargo,
            NEW.idcargo
        );
        
    END IF;
    
    RETURN NEW;
END;
$BODY$;

DROP TRIGGER IF EXISTS tr_migrar_asistencia_movimientoslaborales ON mod_personaext.dat_regimentrabajo;

CREATE TRIGGER tr_migrar_asistencia_movimientoslaborales
    BEFORE INSERT OR UPDATE OF idpersona, idregimentrabajo, idcargo, fdesde, actual
    ON mod_personaext.dat_regimentrabajo
    FOR EACH ROW
    WHEN (NEW.actual = 1)
    EXECUTE FUNCTION mod_personaext.ft_migrar_asistencia_movimientoslaborales();
