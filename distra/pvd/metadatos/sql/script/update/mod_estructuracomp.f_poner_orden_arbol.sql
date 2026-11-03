-- FUNCTION: mod_estructuracomp.f_poner_orden_arbol(numeric)

-- DROP FUNCTION IF EXISTS mod_estructuracomp.f_poner_orden_arbol(numeric);

CREATE OR REPLACE FUNCTION mod_estructuracomp.f_poner_orden_arbol(
	p_idfila numeric)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    hijos mod_estructuracomp.nom_filaestruc;
    contador integer := 1;
BEGIN
    -- USAR ALIAS EXPLÍCITOS
    FOR hijos IN 
        SELECT * 
        FROM mod_estructuracomp.nom_filaestruc f 
        WHERE f.idpadre = p_idfila 
          AND f.idfila <> f.idpadre
          AND f.fechafin IS NULL
        ORDER BY f.orden
    LOOP
        UPDATE mod_estructuracomp.nom_filaestruc
        SET orden = contador,
            nivel = contador
        WHERE idfila = hijos.idfila;
        
        contador := contador + 1;
        
        -- Recursión
        PERFORM mod_estructuracomp.f_poner_orden_arbol(hijos.idfila);
    END LOOP;
END;
$BODY$;

ALTER FUNCTION mod_estructuracomp.f_poner_orden_arbol(numeric)
    OWNER TO zeolides;

COMMENT ON FUNCTION mod_estructuracomp.f_poner_orden_arbol(numeric)
    IS 'Versión 2. Rectificada por IA.';
