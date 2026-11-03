-- Crear columna para marcar los registros a eliminar
ALTER TABLE IF EXISTS mod_nomina.dat_registrosalariotiemposervcio
    ADD COLUMN IF NOT EXISTS eliminar integer NOT NULL DEFAULT 0;

-- Crear tabla de control si no existe
CREATE TABLE IF NOT EXISTS mod_nomina.control_proceso_eliminacion (
    idestructura INTEGER PRIMARY KEY,
    procesado BOOLEAN DEFAULT FALSE,
    fecha_procesado TIMESTAMP DEFAULT NULL,
    registros_analizados INTEGER DEFAULT 0,
	registros_eliminados INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_procesado
    ON mod_nomina.control_proceso_eliminacion USING btree
    (procesado ASC NULLS LAST)
    TABLESPACE pg_default;

-- Insertar estructuras pendientes
INSERT INTO mod_nomina.control_proceso_eliminacion (idestructura)
SELECT DISTINCT idestructura 
FROM mod_nomina.dat_registrosalariotiemposervcio
WHERE idestructura NOT IN (SELECT idestructura FROM mod_nomina.control_proceso_eliminacion)
ON CONFLICT (idestructura) DO NOTHING;

DO $$
DECLARE
    batch_size CONSTANT INTEGER := 5; -- Estructuras por lote
    estructuras_pendientes INTEGER;
    lotes_totales INTEGER;
    lote_actual INTEGER := 0;
    start_time TIMESTAMP := clock_timestamp();
    updated_records INTEGER;
BEGIN
    -- Contar estructuras pendientes
    SELECT COUNT(*) INTO estructuras_pendientes
    FROM mod_nomina.control_proceso_eliminacion 
    WHERE procesado = FALSE;
    
    lotes_totales := CEIL(estructuras_pendientes::FLOAT / batch_size);
    
    RAISE NOTICE 'Iniciando proceso: % estructuras pendientes en % lotes', estructuras_pendientes, lotes_totales;
    
    FOR lote_actual IN 1..lotes_totales LOOP
        RAISE NOTICE 'Procesando lote %/%', lote_actual, lotes_totales;
        
        WITH estructuras_lote AS (
            SELECT idestructura
            FROM mod_nomina.control_proceso_eliminacion
            WHERE procesado = FALSE
            ORDER BY idestructura
            LIMIT batch_size
        ),
        numeradas AS (
            SELECT 
                r.idregistrosalariotiemposervicio,
                r.idestructura,
                ROW_NUMBER() OVER (
                    PARTITION BY r.idestructura, r.idpersona, r.anno, r.idtiponomina, r.idmes 
                    ORDER BY r.idregistrosalariotiemposervicio
                ) as prioridad
            FROM mod_nomina.dat_registrosalariotiemposervcio r
            INNER JOIN estructuras_lote e ON r.idestructura = e.idestructura
        ),
        actualizacion AS (
            UPDATE mod_nomina.dat_registrosalariotiemposervcio
            SET eliminar = CASE 
                WHEN n.prioridad = 1 THEN 0 
                ELSE 1 
            END
            FROM numeradas n
            WHERE dat_registrosalariotiemposervcio.idregistrosalariotiemposervicio = n.idregistrosalariotiemposervicio
            RETURNING n.idestructura
        ),
        estadisticas AS (
            SELECT 
                idestructura,
                COUNT(*) as procesados
            FROM actualizacion
            GROUP BY idestructura
        ),
		estadisticas_eliminar AS (
            SELECT 
                r.idestructura,
                COUNT(*) as eliminados
            FROM mod_nomina.dat_registrosalariotiemposervcio r
            INNER JOIN estructuras_lote e ON r.idestructura = e.idestructura
            WHERE r.eliminar = 1
            GROUP BY r.idestructura
        )
        UPDATE mod_nomina.control_proceso_eliminacion
        SET 
            procesado = TRUE,
            fecha_procesado = clock_timestamp(),
            registros_analizados = COALESCE(e.procesados, 0),
			registros_eliminados = COALESCE(ed.eliminados, 0)			
        FROM estructuras_lote el
        LEFT JOIN estadisticas e ON el.idestructura = e.idestructura
		LEFT JOIN estadisticas_eliminar ed ON el.idestructura = ed.idestructura
		WHERE control_proceso_eliminacion.idestructura = el.idestructura;
        
        GET DIAGNOSTICS updated_records = ROW_COUNT;

        -- Verificar progreso
        SELECT COUNT(*) INTO estructuras_pendientes
        FROM mod_nomina.control_proceso_eliminacion 
        WHERE procesado = FALSE;
        
        RAISE NOTICE '  - Lote % completado. Pendientes: %', lote_actual, estructuras_pendientes;
        
        -- Sleep solo si quedan más lotes
        IF lote_actual < lotes_totales THEN
            PERFORM pg_sleep(0.2); -- Sleep reducido
			COMMIT;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'PROCESO COMPLETADO en: %', (clock_timestamp() - start_time);
    RAISE NOTICE 'Total estructuras procesadas: %', (SELECT COUNT(*) FROM mod_nomina.control_proceso_eliminacion WHERE procesado = TRUE);
END $$;
