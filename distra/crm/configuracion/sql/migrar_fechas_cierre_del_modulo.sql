CREATE OR REPLACE FUNCTION mod_datosmaestros.migrar_fechas_cierre_del_modulo(
    p_ejercicio_anterior VARCHAR,
    p_ejercicio_nuevo VARCHAR,
    p_fecha_inicio_periodo DATE,
    p_uri_subsistema VARCHAR DEFAULT 'logistica/inventario',
    p_denominacion_subsistema VARCHAR DEFAULT 'INVENTARIO'
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    c_idsubsistema_candidato NUMERIC;
    c_idejercicio_anterior NUMERIC;
    r_idejercicio_nuevo RECORD;
    r_idperiodo_nuevo RECORD;
    v_estructurasubsist RECORD;
    v_afectados INTEGER := 0;
BEGIN
    -- Obtener el subsistema candidato
    SELECT idsubsistema INTO c_idsubsistema_candidato 
    FROM mod_datosmaestros.nom_subsistema 
    WHERE TRIM(uri) ILIKE p_uri_subsistema 
       OR TRIM(UPPER(denominacion)) ILIKE p_denominacion_subsistema;
    
    IF c_idsubsistema_candidato IS NULL THEN
        RAISE EXCEPTION 'No se encontró el subsistema con uri: % o denominación: %', 
                        p_uri_subsistema, p_denominacion_subsistema;
    END IF;
    
    -- Obtener ejercicio anterior
    SELECT idejercicio INTO c_idejercicio_anterior 
    FROM mod_datosmaestros.dat_ejerciciocontable 
    WHERE TRIM(nombre) ILIKE p_ejercicio_anterior;
    
    IF c_idejercicio_anterior IS NULL THEN
        RAISE EXCEPTION 'No se encontró el ejercicio anterior: %', p_ejercicio_anterior;
    END IF;
    
    -- Obtener ejercicio nuevo
    SELECT idejercicio, nombre INTO r_idejercicio_nuevo 
    FROM mod_datosmaestros.dat_ejerciciocontable 
    WHERE TRIM(nombre) ILIKE p_ejercicio_nuevo;
    
    IF r_idejercicio_nuevo.idejercicio IS NULL THEN
        RAISE EXCEPTION 'No se encontró el ejercicio nuevo: %', p_ejercicio_nuevo;
    END IF;
    
    -- Obtener período nuevo basado en la fecha de inicio
    SELECT idperiodo, inicio, fin INTO r_idperiodo_nuevo 
    FROM mod_datosmaestros.dat_periodocontable 
    WHERE inicio >= p_fecha_inicio_periodo 
      AND inicio <= (p_fecha_inicio_periodo + INTERVAL '30 days')::DATE
    LIMIT 1;
    
    IF r_idperiodo_nuevo.idperiodo IS NULL THEN
        RAISE EXCEPTION 'No se encontró período para la fecha: %', p_fecha_inicio_periodo;
    END IF;

    -- Iterar sobre las estructuras de subsistema
    FOR v_estructurasubsist IN
        SELECT DISTINCT 
            esub.idestructurasubsist, 
            esub.idsubsistema, 
            dejc.nombre, 
            f.idfecha,
            dcierre.idperiodoactual,
            dcierre.idejercicioactual
        FROM mod_datosmaestros.dat_estructurasubsist AS esub
        INNER JOIN mod_datosmaestros.dat_fecha AS f
            ON f.idestructurasubsist = esub.idestructurasubsist
        INNER JOIN mod_datosmaestros.dat_cierre AS dcierre
            ON dcierre.idestructurasubsist = esub.idestructurasubsist
        INNER JOIN mod_datosmaestros.dat_ejerciciocontable AS dejc 
            ON dejc.idejercicio = dcierre.idejercicioactual
        INNER JOIN mod_datosmaestros.dat_periodocontable AS dpc
            ON dpc.idejercicio = dejc.idejercicio
        WHERE esub.idsubsistema = c_idsubsistema_candidato
          AND dpc.idejercicio = c_idejercicio_anterior
    LOOP
        v_afectados := v_afectados + 1;
        
        -- Actualizar dat_cierre
        UPDATE mod_datosmaestros.dat_cierre
        SET 
            idperiodoactual = r_idperiodo_nuevo.idperiodo,
            idejercicioactual = r_idejercicio_nuevo.idejercicio, 
            descripcion = 'Cambios de los cierres del idsubsistema ' || v_estructurasubsist.idsubsistema || 
                         ' con ejercicio: ' || v_estructurasubsist.nombre || ' ( ' || v_estructurasubsist.idejercicioactual || ' ) '
                         || CHR(10) || ' al ejercicio nuevo: ' || r_idejercicio_nuevo.nombre || ' ( ' || r_idejercicio_nuevo.idejercicio || ' ) '
                         || CHR(10) || ' y del idperiodoactual: ' || v_estructurasubsist.idperiodoactual || 
                         ' al idperiodoactual ( ' || r_idperiodo_nuevo.idperiodo || ' ) '
                         || CHR(10) || ' en idfecha: ' || v_estructurasubsist.idfecha || 
                         ' fecha toma valor: ' || r_idperiodo_nuevo.inicio
        WHERE idestructurasubsist = v_estructurasubsist.idestructurasubsist 
          AND idejercicioactual = v_estructurasubsist.idejercicioactual
          AND idperiodoactual = v_estructurasubsist.idperiodoactual;
        
        -- Actualizar dat_fecha
        UPDATE mod_datosmaestros.dat_fecha
        SET fecha = r_idperiodo_nuevo.inicio
        WHERE idestructurasubsist = v_estructurasubsist.idestructurasubsist 
          AND idfecha = v_estructurasubsist.idfecha;
        
        -- Opcional: Commit implícito por cada iteración (manejar con cuidado)
        -- Si necesitas commits parciales, usar BEGIN/EXCEPTION
        
    END LOOP;
    
    -- Mensaje informativo
    RAISE NOTICE 'Migración completada. Registros afectados en dat_cierre: %', v_afectados;
    
    -- Retornar el número de registros afectados
    RETURN v_afectados;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error en migración: %', SQLERRM;
        RETURN -1;
END;
$$;