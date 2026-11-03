UPDATE mod_nomina.his_vacacionespersona 
SET eliminar = marcados.eliminar
FROM (
    WITH numeradas AS (
        SELECT 
            idhisvacacionespersona,
            ROW_NUMBER() OVER (
                PARTITION BY idvacacionespersona, idnomina, identidad, periodo 
                ORDER BY 
                    CASE WHEN tipoajuste IS NOT NULL THEN 0 ELSE 1 END, -- Priorizar los que tienen tipoajuste
                    idhisvacacionespersona DESC -- Mantener el más reciente
            ) as prioridad
        FROM mod_nomina.his_vacacionespersona
		where identidad = 200531263	--especificar el identificador de la entidad a procesar
    )
    SELECT 
        idhisvacacionespersona,
        CASE 
            WHEN prioridad = 1 THEN 0  -- No eliminar (el que se queda)
            ELSE 1                     -- Eliminar (duplicados)
        END as eliminar
    FROM numeradas
) AS marcados
WHERE his_vacacionespersona.idhisvacacionespersona = marcados.idhisvacacionespersona;
