with uebs_entidad as (SELECT fila.parent_path,eop.* FROM mod_estructuracomp.dat_estructuraop as eop
				INNER JOIN mod_estructuracomp.nom_filaestruc fila on (fila.idfila = eop.idestructuraop and eop.idproyecto = 0::numeric)
				WHERE idorgano = '-2'
				ORDER BY idestructuraop ASC, idproyecto ASC)
SELECT fila.idfila AS idalmacen,
        CASE
            WHEN estructura.denominacion::text <> ''::text THEN estructura.denominacion
            WHEN estructuraop.denominacion::text <> ''::text THEN estructuraop.denominacion
            ELSE NULL::character varying
        END AS denominacion,
    estructuraop.codigo,
    ueb.idestructuraop as idueb,
	ueb.codigo as codigoueb, 
	ueb.denominacion as ueb
	
   FROM mod_estructuracomp.nom_filaestruc fila
   INNER JOIN mod_estructuracomp.nom_concepto nomeav ON fila.idconcepto = nomeav.idconcepto
   INNER JOIN uebs_entidad ueb ON (fila.parent_path <@ ueb.parent_path) 
   LEFT JOIN mod_estructuracomp.dat_estructura estructura ON estructura.idestructura = fila.idfila AND (estructura.idestado = 0::numeric OR estructura.idproyecto = 0::numeric)
   LEFT JOIN mod_estructuracomp.nom_organo orgest ON orgest.idorgano = estructura.idorgano AND orgest.idconcepto = fila.idconcepto
   LEFT JOIN mod_estructuracomp.dat_estructuraop estructuraop ON estructuraop.idestructuraop = fila.idfila AND (estructuraop.idestado = 0::numeric OR estructuraop.idproyecto = 0::numeric)
   LEFT JOIN mod_estructuracomp.nom_organo orgestop ON orgestop.idorgano = estructuraop.idorgano AND orgestop.idconcepto = fila.idconcepto
   --WHERE ueb.idestructuraop = $IDUEB --200531042 --parámetro
	WHERE fila.fechafin IS NULL AND (estructura.denominacion::text <> ''::text OR estructuraop.denominacion::text <> ''::text)
	AND estructuraop.idorgano = -1 AND estructuraop.idconcepto = 8
	ORDER BY fila.ordenunico;

