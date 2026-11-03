WITH numeradas AS (
    SELECT 
        ROW_NUMBER() OVER (
            PARTITION BY idvacacionespersona, idnomina, identidad, periodo 
            ORDER BY 
                CASE WHEN tipoajuste IS NOT NULL THEN 0 ELSE 1 END, -- Priorizar los que tienen tipoajuste
                idhisvacacionespersona DESC -- Mantener el más reciente entre los del mismo tipo
        ) as prioridad,
        *
    FROM mod_nomina.his_vacacionespersona
	where identidad = 200531368	
)
SELECT 
    idhisvacacionespersona, 
    idvacacionespersona, 
    idnomina, 
    tipooperacion, 
    fechaoperacion, 
    tiempoacumulado, 
    importeacumulado, 
    saldoentiempo, 
    saldoenimporte, 
    ajusteimporte, 
    ajustetiempo, 
    tipoajuste, 
    observaciones, 
    periodo, 
    identidad,
    CASE 
        WHEN prioridad = 1 THEN 0  -- No eliminar (el que se queda)
        ELSE 1                     -- Eliminar (duplicados)
    END as eliminar,
    prioridad
FROM numeradas
	--where tipoajuste is not null
ORDER BY idvacacionespersona, idnomina, identidad, periodo, prioridad;
