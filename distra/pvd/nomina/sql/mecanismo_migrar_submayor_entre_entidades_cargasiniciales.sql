-- Optimización: his_vacacionespersona
UPDATE mod_nomina.his_vacacionespersona d
SET idvacacionespersona = o.idvacacionespersona_actual,
    observaciones = 'Cambio de submayor: '
                    || chr(10) || 'Anterior:'
                    || chr(10) || 'idvacacionespersona_anterior: ' || o.idvacacionespersona_anterior
                    || chr(10) || 'tiempoacumuladoinicial_anterior: ' || o.tiempoacumuladoinicial_anterior
                    || chr(10) || 'importeacumuladoinicial_anterior: ' || o.importeacumuladoinicial_anterior
                    || chr(10) || 'Actual:'
                    || chr(10) || 'idvacacionespersona_actual: ' || o.idvacacionespersona_actual
                    || chr(10) || 'tiempoacumuladoinicial_actual: ' || o.tiempoacumuladoinicial_actual
                    || chr(10) || 'importeacumuladoinicial_actual: ' || o.importeacumuladoinicial_actual
FROM (
    WITH personas_filtradas AS (
        SELECT DISTINCT coc.idpersona
        FROM mod_nomina.conf_plantillanominal pn
        INNER JOIN mod_nomina.conf_plantillanominalcargo pnc USING (idplantillanominal)
        INNER JOIN mod_nomina.dat_cargosocupados coc ON (coc.idcargo = pnc.idcargo)
        INNER JOIN mod_estructuracomp.nom_filaestruc nfe ON (pnc.idcargo = nfe.idfila)
        INNER JOIN mod_estructuracomp.dat_cargo dc ON (dc.idcargo = nfe.idfila AND dc.idproyecto = 0)
        WHERE pn.identidad = $IDENTIDAD --200531177
          AND coc.identidad = $IDENTIDAD --200531177
    ),
    ranked_vacaciones AS (
        SELECT 
            dvp.idpersona,
            dvp.idvacacionespersona,
            dvp.tiempoacumuladoinicial,
            dvp.importeacumuladoinicial,
            ROW_NUMBER() OVER (PARTITION BY dvp.idpersona ORDER BY dvp.fechainicio DESC) as ranking
        FROM mod_nomina.dat_vacacionespersona dvp
        INNER JOIN personas_filtradas pf ON pf.idpersona = dvp.idpersona
    )
    SELECT 
        MAX(CASE WHEN ranking = 1 THEN idvacacionespersona END) as idvacacionespersona_actual,
        MAX(CASE WHEN ranking = 1 THEN tiempoacumuladoinicial END) as tiempoacumuladoinicial_actual,
        MAX(CASE WHEN ranking = 1 THEN importeacumuladoinicial END) as importeacumuladoinicial_actual,
        MAX(CASE WHEN ranking = 2 THEN idvacacionespersona END) as idvacacionespersona_anterior,
        MAX(CASE WHEN ranking = 2 THEN tiempoacumuladoinicial END) as tiempoacumuladoinicial_anterior,
        MAX(CASE WHEN ranking = 2 THEN importeacumuladoinicial END) as importeacumuladoinicial_anterior
    FROM ranked_vacaciones
	GROUP BY idpersona
) o
WHERE d.idvacacionespersona = o.idvacacionespersona_anterior;

--dat_vacacionespersona
UPDATE mod_nomina.dat_vacacionespersona d
SET tiempoacumuladoinicial = o.tiempoacumuladoinicial_anterior,
	importeacumuladoinicial = o.importeacumuladoinicial_anterior
FROM (
	    WITH personas_filtradas AS (
        SELECT DISTINCT coc.idpersona
        FROM mod_nomina.conf_plantillanominal pn
        INNER JOIN mod_nomina.conf_plantillanominalcargo pnc USING (idplantillanominal)
        INNER JOIN mod_nomina.dat_cargosocupados coc ON (coc.idcargo = pnc.idcargo)
        INNER JOIN mod_estructuracomp.nom_filaestruc nfe ON (pnc.idcargo = nfe.idfila)
        INNER JOIN mod_estructuracomp.dat_cargo dc ON (dc.idcargo = nfe.idfila AND dc.idproyecto = 0)
        WHERE pn.identidad = $IDENTIDAD --200531177
          AND coc.identidad = $IDENTIDAD --200531177
    ),
    ranked_vacaciones AS (
        SELECT 
            dvp.idpersona,
            dvp.idvacacionespersona,
            dvp.tiempoacumuladoinicial,
            dvp.importeacumuladoinicial,
            ROW_NUMBER() OVER (PARTITION BY dvp.idpersona ORDER BY dvp.fechainicio DESC) as ranking
        FROM mod_nomina.dat_vacacionespersona dvp
        INNER JOIN personas_filtradas pf ON pf.idpersona = dvp.idpersona
    )
    SELECT 
        MAX(CASE WHEN ranking = 1 THEN idvacacionespersona END) as idvacacionespersona_actual,
        MAX(CASE WHEN ranking = 2 THEN idvacacionespersona END) as idvacacionespersona_anterior,
        MAX(CASE WHEN ranking = 2 THEN tiempoacumuladoinicial END) as tiempoacumuladoinicial_anterior,
        MAX(CASE WHEN ranking = 2 THEN importeacumuladoinicial END) as importeacumuladoinicial_anterior
    FROM ranked_vacaciones
    GROUP BY idpersona
	HAVING MAX(CASE WHEN ranking = 2 THEN tiempoacumuladoinicial END) IS NOT NULL
       AND MAX(CASE WHEN ranking = 2 THEN importeacumuladoinicial END) IS NOT NULL
) o
WHERE d.idvacacionespersona = o.idvacacionespersona_actual;
