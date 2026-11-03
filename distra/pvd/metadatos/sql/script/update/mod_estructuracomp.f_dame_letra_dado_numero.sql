-- FUNCTION: mod_estructuracomp.f_dame_letra_dado_numero(numeric)

-- DROP FUNCTION IF EXISTS mod_estructuracomp.f_dame_letra_dado_numero(numeric);

CREATE OR REPLACE FUNCTION mod_estructuracomp.f_dame_letra_dado_numero(
	numero numeric)
    RETURNS character varying
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN
    -- Para números grandes, usar representación compacta
    IF numero > 1000 THEN
        RETURN 'n' || numero::text;
    END IF;
    
    -- Para números pequeños, usar conversión a base 26
    RETURN (
        WITH RECURSIVE conv(n, res) AS (
            SELECT numero::integer, ''::text
            UNION ALL
            SELECT 
                (n - ((n-1)%26) - 1)/26,
                chr(97 + ((n-1)%26)) || res
            FROM conv
            WHERE n > 0
        )
        SELECT res FROM conv WHERE n = 0
    );
END;
$BODY$;

ALTER FUNCTION mod_estructuracomp.f_dame_letra_dado_numero(numeric)
    OWNER TO zeolides;

COMMENT ON FUNCTION mod_estructuracomp.f_dame_letra_dado_numero(numeric)
    IS 'Versión 2. Rectificada por IA.';
