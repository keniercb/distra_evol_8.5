CREATE OR REPLACE FUNCTION mod_nomina.f_generar_lista_tiposnominas_ordenado()
RETURNS void
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    reg RECORD;
    lista_ids TEXT;
    valores TEXT[];
    valor TEXT;
    id_tipo INTEGER;
BEGIN
    FOR reg IN 
        SELECT idvariablesconfreportescertificaciones as id, descripcion
        FROM mod_nomina.conf_variablestiporeportescertificaciones
    LOOP
        lista_ids := '';
        
        IF reg.descripcion IS NOT NULL AND TRIM(reg.descripcion) != '' THEN
            -- Usar unnumbered para mantener el orden
            SELECT STRING_AGG(f.idtiponomina::TEXT, ', ' ORDER BY o.ord) INTO lista_ids
            FROM (
                SELECT TRIM(unnest(regexp_split_to_array(TRIM(reg.descripcion), '\s*,\s*'))) as valor,
                       row_number() over () as ord
            ) o
            LEFT JOIN mod_nomina.nom_tiponomina f 
                ON LOWER(TRIM(f.denominacion)) = LOWER(o.valor)
            WHERE o.valor != '' AND f.idtiponomina IS NOT NULL;
        END IF;
        
        -- Si no se encontró nada, asegurar cadena vacía (no NULL)
        IF lista_ids IS NULL THEN
            lista_ids := '';
        END IF;
        
        UPDATE mod_nomina.conf_variablestiporeportescertificaciones 
        SET tiposnomina = lista_ids
        WHERE idvariablesconfreportescertificaciones = reg.id;
    END LOOP;
END;
$BODY$;
