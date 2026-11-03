    WITH numeradas AS (
    SELECT 
        ROW_NUMBER() OVER (
            PARTITION BY idpersona, anno, idtiponomina, idmes, idestructura 
            ORDER BY idregistrosalariotiemposervicio
        ) as prioridad,
        *
    FROM mod_nomina.dat_registrosalariotiemposervcio
)SELECT 
	CASE
        WHEN prioridad = 1 THEN 0  -- No eliminar (el que se queda)
        ELSE 1                     -- Eliminar (duplicados)
    END as eliminar,
    --idregistrosalariotiemposervicio,
		*
FROM numeradas
