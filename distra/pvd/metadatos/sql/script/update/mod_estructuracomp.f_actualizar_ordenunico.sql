-- FUNCTION: mod_estructuracomp.f_actualizar_ordenunico(numeric)

-- DROP FUNCTION IF EXISTS mod_estructuracomp.f_actualizar_ordenunico(numeric);

CREATE OR REPLACE FUNCTION mod_estructuracomp.f_actualizar_ordenunico(
	p_idfila numeric)
    RETURNS boolean
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    fila mod_estructuracomp.nom_filaestruc;
    padre mod_estructuracomp.nom_filaestruc;
    ordenuniconew text;
    letra_orden text;
    nivel_count integer;
BEGIN
    -- USAR EL NUEVO NOMBRE DEL PARÁMETRO
    SELECT * INTO fila FROM mod_estructuracomp.nom_filaestruc f WHERE f.idfila = p_idfila;
    SELECT * INTO padre FROM mod_estructuracomp.nom_filaestruc f WHERE f.idfila = fila.idpadre;
    
    -- Contar niveles con ALIAS EXPLÍCITOS
    WITH RECURSIVE niveles AS (
        SELECT 
            nf.idfila,  -- ALIAS EXPLÍCITO
            nf.idpadre, 
            1 as nivel
        FROM mod_estructuracomp.nom_filaestruc nf 
        WHERE nf.idfila = p_idfila  -- USAR PARÁMETRO
        UNION ALL
        SELECT 
            f.idfila, 
            f.idpadre, 
            n.nivel + 1
        FROM mod_estructuracomp.nom_filaestruc f
        INNER JOIN niveles n ON f.idpadre = n.idfila
        WHERE f.idfila <> f.idpadre
    )
    SELECT MAX(nivel) INTO nivel_count FROM niveles;
    
    -- Si hay más de 100 niveles, usar representación compacta
    IF nivel_count > 100 THEN
        letra_orden := 'n' || fila.orden::text;
    ELSE
        letra_orden := mod_estructuracomp.f_dame_letra_dado_numero(fila.orden);
    END IF;
    
    -- Si es raíz
    IF fila.idfila = padre.idfila THEN
        IF padre.orden IS NULL THEN
            RAISE EXCEPTION 'El orden de la fila % no existe', padre.idfila;
        ELSE
            UPDATE mod_estructuracomp.nom_filaestruc 
            SET ordenunico = letra_orden::public.ltree 
            WHERE idfila = padre.idfila;
        END IF;
    ELSE
        -- No raíz: concatenar con el padre
        ordenuniconew := padre.ordenunico::text || '.' || letra_orden;
        
        -- LÍMITE CRÍTICO: 200 caracteres
        IF length(ordenuniconew) > 200 THEN
            ordenuniconew := 'nivel' || nivel_count || '_id' || fila.idfila;
        END IF;
        
        UPDATE mod_estructuracomp.nom_filaestruc 
        SET ordenunico = ordenuniconew::public.ltree 
        WHERE idfila = fila.idfila;
    END IF;
    
    RETURN true;
END;
$BODY$;

ALTER FUNCTION mod_estructuracomp.f_actualizar_ordenunico(numeric)
    OWNER TO zeolides;

COMMENT ON FUNCTION mod_estructuracomp.f_actualizar_ordenunico(numeric)
    IS 'Versión 2. Rectificada por IA.';
