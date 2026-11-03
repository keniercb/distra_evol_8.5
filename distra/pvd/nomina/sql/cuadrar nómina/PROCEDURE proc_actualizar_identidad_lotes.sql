
-- DROP PROCEDURE IF EXISTS mod_nomina.proc_actualizar_identidad_lotes(integer, integer);
CREATE OR REPLACE PROCEDURE mod_nomina.proc_actualizar_identidad_lotes(
	p_max_registros integer DEFAULT NULL::integer,
	p_lote_size integer DEFAULT 5000)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    registros_actualizados_lote INTEGER := 0;
    total_actualizados INTEGER := 0;
    lotes_procesados INTEGER := 0;
    start_time TIMESTAMP;
    current_lote_size INTEGER;
    remaining_to_process INTEGER;
BEGIN
    start_time := clock_timestamp();
    
    -- Determinar cuántos registros procesar
    IF p_max_registros IS NULL THEN
        remaining_to_process := NULL;
        RAISE NOTICE 'Procesando TODOS los registros pendientes';
    ELSE
        remaining_to_process := p_max_registros;
        RAISE NOTICE 'Procesando máximo % registros', p_max_registros;
    END IF;
    
    -- Actualizar en lotes
    WHILE EXISTS (SELECT 1 FROM mod_nomina.his_vacacionespersona WHERE identidad IS NULL LIMIT 1) 
                    AND (remaining_to_process IS NULL OR remaining_to_process > 0)
    LOOP
        -- Determinar tamaño del lote
        IF remaining_to_process IS NULL THEN
            current_lote_size := p_lote_size;
        ELSE
            current_lote_size := LEAST(p_lote_size, remaining_to_process);
        END IF;
        
        -- Actualizar lote
        UPDATE mod_nomina.his_vacacionespersona h
        SET identidad = v.identidad
        FROM mod_nomina.dat_vacacionespersona v
        WHERE h.idvacacionespersona = v.idvacacionespersona
        AND h.identidad IS NULL
        AND h.idhisvacacionespersona IN ( SELECT idhisvacacionespersona FROM mod_nomina.his_vacacionespersona
                                            WHERE identidad IS NULL
                                            ORDER BY idhisvacacionespersona
                                            LIMIT current_lote_size
                                            FOR UPDATE SKIP LOCKED
                                        );
        
        GET DIAGNOSTICS registros_actualizados_lote = ROW_COUNT;
        total_actualizados := total_actualizados + registros_actualizados_lote;
        lotes_procesados := lotes_procesados + 1;
        
        -- Actualizar contador
        IF remaining_to_process IS NOT NULL THEN
            remaining_to_process := remaining_to_process - registros_actualizados_lote;
        END IF;
        
        RAISE NOTICE 'Lote %: % registros (Total: %)', 
                     lotes_procesados, 
                     registros_actualizados_lote,
                     total_actualizados;
        
        PERFORM pg_sleep(0.05);
        
        -- COMMIT explícito en cada lote (sólo en PROCEDURE)
        COMMIT;
    END LOOP;
    
    RAISE NOTICE 'Completado en %. Total: % registros en % lotes', 
                 (clock_timestamp() - start_time),
                 total_actualizados,
                 lotes_procesados;
END;
$BODY$;

ALTER PROCEDURE mod_nomina.proc_actualizar_identidad_lotes(integer, integer) OWNER TO zeolides;
