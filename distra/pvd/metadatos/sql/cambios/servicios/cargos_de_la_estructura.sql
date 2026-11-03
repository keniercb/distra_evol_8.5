WITH ancestro AS (
    SELECT DISTINCT parent_path
    FROM mod_estructuracomp.nom_filaestruc
    WHERE parent_path = '100000532.100533791.100777699'::ltree
),
descendientes AS (
    SELECT 
        n.idfila,
        n.parent_path,
		n.ordenunico
    FROM mod_estructuracomp.nom_filaestruc n
    CROSS JOIN ancestro a
    WHERE n.parent_path <@ a.parent_path
        AND n.parent_path != a.parent_path
),
hojas AS (
    SELECT DISTINCT d.*
    FROM descendientes d
    WHERE NOT EXISTS (
        SELECT 1 
        FROM mod_estructuracomp.nom_filaestruc hijo
        INNER JOIN mod_estructuracomp.dat_cargo cg ON (cg.idcargo = hijo.idfila AND cg.idproyecto = 0)
        WHERE hijo.parent_path <@ d.parent_path
            AND nlevel(hijo.parent_path) = nlevel(d.parent_path) + 1
    )
),
caminos_descompuestos AS (
    SELECT 
        h.idfila,
        h.parent_path,
        unnest(string_to_array(h.parent_path::text, '.'))::bigint as id_elemento,
        generate_subscripts(string_to_array(h.parent_path::text, '.'), 1) as posicion,
	    h.ordenunico
    FROM hojas h
)
SELECT 
    cd.idfila as idcargo,
    cg.denominacion as nombre_cargo,
	cd.parent_path,
    string_agg(e.denominacion, ' / ' ORDER BY cd.posicion) as camino_denominaciones,
    ltree2text(subpath(cd.parent_path, -1, 1)) as hoja_id
FROM caminos_descompuestos cd
INNER JOIN mod_estructuracomp.v_get_estructuras e ON e.idestructura = cd.id_elemento
INNER JOIN mod_estructuracomp.v_get_cargos cg ON cg.idcargo = cd.idfila
GROUP BY cd.idfila, cg.denominacion, cd.parent_path,cd.ordenunico
ORDER BY cd.ordenunico;
