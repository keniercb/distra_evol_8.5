-- PROCEDURE: mod_nomina.proc_actualizar_identidad_completo(integer, integer, integer, integer)
-- DROP PROCEDURE IF EXISTS mod_nomina.proc_actualizar_identidad_completo(integer, integer, integer, integer);
CREATE OR REPLACE PROCEDURE mod_nomina.proc_actualizar_identidad_completo(
	p_registros_por_ejecucion integer DEFAULT 50000,
	p_lote_size integer DEFAULT 2000,
	p_max_ejecuciones integer DEFAULT 20,
	p_pausa_segundos integer DEFAULT 3)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    ejecucion INTEGER := 1;
    total_actualizados INTEGER := 0;
    start_time TIMESTAMP;
BEGIN
    start_time := clock_timestamp();
    RAISE NOTICE 'Iniciando proceso completo de actualización';
    
    WHILE mod_nomina.existen_pendientes_identidad() 
      AND ejecucion <= p_max_ejecuciones 
    LOOP
        RAISE NOTICE '--- Ejecución % ---', ejecucion;        
        -- Ejecutar el procedure de lotes
        CALL mod_nomina.proc_actualizar_identidad_lotes( p_registros_por_ejecucion, p_lote_size );
        
        -- Obtener total actualizado en esta ejecución
        total_actualizados := total_actualizados + p_registros_por_ejecucion;
        
        -- Mostrar progreso
        RAISE NOTICE 'Progreso: %', (SELECT ROUND((COUNT(*) FILTER (WHERE identidad IS NOT NULL) * 100.0 / COUNT(*)), 2)
                                        FROM mod_nomina.his_vacacionespersona) || '%';
        
        -- Pausa entre ejecuciones
        IF p_pausa_segundos > 0 THEN
            RAISE NOTICE 'Pausa de % segundos...', p_pausa_segundos;
            PERFORM pg_sleep(p_pausa_segundos);
        END IF;
        
        ejecucion := ejecucion + 1;
    END LOOP;
    
    RAISE NOTICE '================================';
    RAISE NOTICE 'PROCESO COMPLETADO';
    RAISE NOTICE 'Tiempo total: %', (clock_timestamp() - start_time);
    RAISE NOTICE 'Ejecuciones realizadas: %', (ejecucion - 1);
    RAISE NOTICE 'Registros pendientes: %', (SELECT COUNT(*) FROM mod_nomina.his_vacacionespersona WHERE identidad IS NULL);
END;
$BODY$;

ALTER PROCEDURE mod_nomina.proc_actualizar_identidad_completo(integer, integer, integer, integer) OWNER TO zeolides;
