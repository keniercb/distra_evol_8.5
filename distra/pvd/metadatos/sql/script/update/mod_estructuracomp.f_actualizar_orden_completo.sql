-- FUNCTION: mod_estructuracomp.f_actualizar_orden_completo()

-- DROP FUNCTION IF EXISTS mod_estructuracomp.f_actualizar_orden_completo();

CREATE OR REPLACE FUNCTION mod_estructuracomp.f_actualizar_orden_completo(
	)
    RETURNS boolean
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    primerasfilas mod_estructuracomp.nom_filaestruc;
    contador INTEGER;
BEGIN
    contador = 0;
    
    FOR primerasfilas IN 
        SELECT * 
        FROM mod_estructuracomp.nom_filaestruc  
        WHERE idfila = idpadre 
          AND fechafin IS NULL
        ORDER BY orden
    LOOP
        contador = contador + 1;
        
        -- Actualizar orden de la raíz
        UPDATE mod_estructuracomp.nom_filaestruc  
        SET orden = contador,
            nivel = contador
        WHERE idfila = primerasfilas.idfila;
        
        -- Reordenar árbol (números)
        PERFORM mod_estructuracomp.f_poner_orden_arbol(primerasfilas.idfila);
        
        -- 🟢🟢🟢 ACTUALIZAR LTREE 🟢🟢🟢
        PERFORM mod_estructuracomp.f_actualizar_ordenunico_arbol(primerasfilas.idfila);
        
    END LOOP;
    
    RAISE NOTICE 'Orden reordenado correctamente.';
    RETURN true;
END;
$BODY$;

ALTER FUNCTION mod_estructuracomp.f_actualizar_orden_completo()
    OWNER TO zeolides;

COMMENT ON FUNCTION mod_estructuracomp.f_actualizar_orden_completo()
    IS 'Versión 2. Rectificada por IA.';
