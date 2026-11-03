-- FUNCTION: mod_nomina.deserializar_nominas_lista(numeric[])
-- DROP FUNCTION IF EXISTS mod_nomina.deserializar_nominas_lista(numeric[]);
CREATE OR REPLACE FUNCTION mod_nomina.deserializar_nominas_lista(
	p_idnomina_list numeric[])
    RETURNS text
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    v_campos text;
    v_valores text;
    col_indices text[] := '{}';
    col_names text[] := '{}';
    used_names text[] := '{}';
    create_cols text := '';
    person_blocks text[] := '{}';
    person_block text;
    key_val text[];
    row_data jsonb;
    insert_vals text := '';
    i int;
    person_count int := 0;
    col_count int;
    clean_name text;
    final_name text;
    suffix int;
    -- Para extraer personas de valores
    current_pos int := 1;
    block_start int;
    block_end int;
    open_braces int;
    char text;
    block_content text;
    match_pos int;
    -- Para extraer campos
    field_block text;
    idx text;
    denom text;
    -- Para extraer claves de valores que no están en campos
    extra_key text;
    extra_keys text[] := '{}';
    extra_names text[] := '{}';
    extra_name text;
    extra_suffix int;
    -- Para acumular filas
    all_rows text[] := '{}';
    -- Para recorrer nominas
    current_record record;
    -- Variables para la estructura común
    first_campos text := '';
    -- Variables para insertar en lote
    current_row text;
    val text;
    -- Variables para recorrer todas las nominas del mes
    all_persons_data text[] := '{}';
    current_person_data text;
    current_idnomina numeric;
    -- Variables para manejar idnomina en filas
    current_idnomina_val numeric;
    -- Variable para verificar si idnomina ya existe
    idnomina_exists boolean := false;
BEGIN
    -- 1. Eliminar tabla temporal previa
    DROP TABLE IF EXISTS tmp_nomina;

    -- 2. Recorrer todas las nominas de la lista para extraer estructura común y claves adicionales
    FOREACH current_idnomina IN ARRAY p_idnomina_list
    LOOP
        FOR current_record IN
            SELECT idnominadatos, campos, valores
            FROM mod_nomina.dat_nominadatos
            WHERE idnomina = current_idnomina
        LOOP
            -- Extraer campos de la primera nomina para estructura común
            IF first_campos = '' THEN
                first_campos := current_record.campos;
                
                -- Extraer índices y nombres de columnas desde 'campos' (estructura común)
                FOR i IN 0..100 -- Asumimos máximo 101 campos (0 a 100)
                LOOP
                    field_block := substring(first_campos from 'i:' || i || ';a:\d+:\{(.*?)\}(?=i:' || (i+1) || '|$)');
                    IF field_block IS NOT NULL THEN
                        idx := (regexp_match(field_block, 's:6:"indice";s:\d+:"([^"]+)"'))[1];
                        denom := (regexp_match(field_block, 's:12:"denominacion";s:\d+:"([^"]*)"'))[1];
                        IF idx IS NOT NULL THEN
                            -- Generar nombre de columna
                            IF denom IS NOT NULL AND denom != '' THEN
                                ---*****clean_name := lower(regexp_replace(denom, '[^a-z0-9_]+', '_', 'g'));
							clean_name := lower(denom);
                            ELSE
                                clean_name := lower(idx);
                            END IF;
                            -- Sanitizar
                            clean_name := regexp_replace(clean_name, '_+', '_', 'g');
                            clean_name := trim(both '_' from clean_name);
                            IF clean_name = '' THEN
                                clean_name := 'col_' || idx;
                            END IF;
                            clean_name := left(clean_name, 60);

                            -- Evitar duplicados
                            final_name := clean_name;
                            suffix := 1;
                            WHILE final_name = ANY(used_names) LOOP
                                final_name := left(clean_name, 60 - length(suffix::text) - 1) || '_' || suffix;
                                suffix := suffix + 1;
                            END LOOP;

                            col_indices := array_append(col_indices, idx);
                            col_names := array_append(col_names, final_name);
                            used_names := array_append(used_names, final_name);
                        END IF;
                    END IF;
                END LOOP;
            END IF;

            -- Extraer bloques de personas de 'valores' para esta nomina y acumular claves adicionales
            v_valores := current_record.valores;
            current_pos := 1;
            person_blocks := '{}';

            LOOP
                block_start := position('i:' in substring(v_valores from current_pos));
                IF block_start = 0 THEN
                    EXIT;
                END IF;
                block_start := block_start + current_pos - 1;

                -- Buscar el '{' después de i:\d+;a:\d+:
                match_pos := position('{' in substring(v_valores from block_start));
                IF match_pos = 0 THEN
                    EXIT;
                END IF;
                block_start := block_start + match_pos - 1;

                -- Encontrar el bloque completo con manejo de anidamiento
                open_braces := 1;
                block_end := block_start + 1;
                WHILE open_braces > 0 AND block_end <= length(v_valores) LOOP
                    char := substring(v_valores from block_end for 1);
                    IF char = '{' THEN
                        open_braces := open_braces + 1;
                    ELSIF char = '}' THEN
                        open_braces := open_braces - 1;
                    END IF;
                    block_end := block_end + 1;
                END LOOP;

                IF open_braces = 0 THEN
                    block_content := substring(v_valores from block_start + 1 for (block_end - block_start - 2));
                    person_blocks := array_append(person_blocks, block_content);
                    current_pos := block_end;
                ELSE
                    EXIT;
                END IF;
            END LOOP;

            -- Extraer claves adicionales de valores que no están en col_indices
            FOREACH person_block IN ARRAY person_blocks
            LOOP
                -- Extraer strings: s:\d+:"clave";s:\d+:"valor"
                FOR key_val IN
                    SELECT regexp_matches(person_block, 's:\d+:\"([^\"]+)\";s:\d+:\"([^\"]*)\"', 'g')
                LOOP
                    extra_key := key_val[1];
                    IF extra_key = ANY(col_indices) OR extra_key = ANY(extra_keys) THEN
                        CONTINUE;
                    END IF;
                    extra_keys := array_append(extra_keys, extra_key);
                    extra_name := lower(regexp_replace(extra_key, '[^a-z0-9_]+', '_', 'g'));
                    extra_name := regexp_replace(extra_name, '_+', '_', 'g');
                    extra_name := trim(both '_' from extra_name);
                    IF extra_name = '' THEN
                        extra_name := 'extra_' || array_length(extra_keys, 1);
                    END IF;
                    --****************************extra_name := left(extra_name, 60);
                    -- Evitar duplicados
                    suffix := 1;
                    final_name := extra_name;
                    WHILE final_name = ANY(used_names) LOOP
                        final_name := left(extra_name, 60 - length(suffix::text) - 1) || '_' || suffix;
                        suffix := suffix + 1;
                    END LOOP;
                    extra_names := array_append(extra_names, final_name);
                    used_names := array_append(used_names, final_name);
                    
                    -- Verificar si es idnomina
                    IF extra_key = 'idnomina' THEN
                        idnomina_exists := true;
                    END IF;
                END LOOP;

                -- Extraer nulls: s:\d+:"clave";N;
                FOR key_val IN
                    SELECT regexp_matches(person_block, 's:\d+:\"([^\"]+)\";N;', 'g')
                LOOP
                    extra_key := key_val[1];
                    IF extra_key = ANY(col_indices) OR extra_key = ANY(extra_keys) THEN
                        CONTINUE;
                    END IF;
                    extra_keys := array_append(extra_keys, extra_key);
                    extra_name := lower(regexp_replace(extra_key, '[^a-z0-9_]+', '_', 'g'));
                    extra_name := regexp_replace(extra_key, '_+', '_', 'g');
                    extra_name := trim(both '_' from extra_name);
                    IF extra_name = '' THEN
                        extra_name := 'extra_' || array_length(extra_keys, 1);
                    END IF;
                    extra_name := left(extra_name, 60);
                    -- Evitar duplicados
                    suffix := 1;
                    final_name := extra_name;
                    WHILE final_name = ANY(used_names) LOOP
                        final_name := left(extra_name, 60 - length(suffix::text) - 1) || '_' || suffix;
                        suffix := suffix + 1;
                    END LOOP;
                    extra_names := array_append(extra_names, final_name);
                    used_names := array_append(used_names, final_name);
                    
                    -- Verificar si es idnomina
                    IF extra_key = 'idnomina' THEN
                        idnomina_exists := true;
                    END IF;
                END LOOP;

                -- Extraer booleanos: s:\d+:"clave";b:0; o b:1;
                FOR key_val IN
                    SELECT regexp_matches(person_block, 's:\d+:\"([^\"]+)\";b:([01]);', 'g')
                LOOP
                    extra_key := key_val[1];
                    IF extra_key = ANY(col_indices) OR extra_key = ANY(extra_keys) THEN
                        CONTINUE;
                    END IF;
                    extra_keys := array_append(extra_keys, extra_key);
                    extra_name := lower(regexp_replace(extra_key, '[^a-z0-9_]+', '_', 'g'));
                    extra_name := regexp_replace(extra_key, '_+', '_', 'g');
                    extra_name := trim(both '_' from extra_name);
                    IF extra_key = '' THEN
                        extra_key := 'extra_' || array_length(extra_keys, 1);
                    END IF;
                    extra_name := left(extra_key, 60);
                    -- Evitar duplicados
                    suffix := 1;
                    final_name := extra_name;
                    WHILE final_name = ANY(used_names) LOOP
                        final_name := left(extra_name, 60 - length(suffix::text) - 1) || '_' || suffix;
                        suffix := suffix + 1;
                    END LOOP;
                    extra_names := array_append(extra_names, final_name);
                    used_names := array_append(used_names, final_name);
                    
                    -- Verificar si es idnomina
                    IF extra_key = 'idnomina' THEN
                        idnomina_exists := true;
                    END IF;
                END LOOP;
            END LOOP;
        END LOOP;
    END LOOP;

    -- Agregar columnas extra al final
    col_indices := col_indices || extra_keys;
    col_names := col_names || extra_names;

    -- Agregar columna idnomina al final SOLO si no existe
    IF NOT idnomina_exists THEN
        col_indices := col_indices || ARRAY['idnomina'];
        col_names := col_names || ARRAY['idnomina'];
    END IF;

    col_count := array_length(col_indices, 1);

    -- 3. Crear tabla temporal con todas las columnas
    FOR i IN 1..col_count LOOP
        IF i > 1 THEN
            create_cols := create_cols || ', ';
        END IF;
        create_cols := create_cols || quote_ident(col_names[i]) || ' text';
    END LOOP;

    EXECUTE 'CREATE TEMP TABLE tmp_nomina (' || create_cols || ')';

    -- 4. Recorrer todas las nominas de la lista para insertar datos
    FOREACH current_idnomina IN ARRAY p_idnomina_list
    LOOP
        FOR current_record IN
            SELECT idnominadatos, campos, valores
            FROM mod_nomina.dat_nominadatos
            WHERE idnomina = current_idnomina
        LOOP
            -- Extraer bloques de personas de 'valores' para esta nomina
            v_valores := current_record.valores;
            current_pos := 1;
            person_blocks := '{}';

            LOOP
                block_start := position('i:' in substring(v_valores from current_pos));
                IF block_start = 0 THEN
                    EXIT;
                END IF;
                block_start := block_start + current_pos - 1;

                -- Buscar el '{' después de i:\d+;a:\d+:
                match_pos := position('{' in substring(v_valores from block_start));
                IF match_pos = 0 THEN
                    EXIT;
                END IF;
                block_start := block_start + match_pos - 1;

                -- Encontrar el bloque completo con manejo de anidamiento
                open_braces := 1;
                block_end := block_start + 1;
                WHILE open_braces > 0 AND block_end <= length(v_valores) LOOP
                    char := substring(v_valores from block_end for 1);
                    IF char = '{' THEN
                        open_braces := open_braces + 1;
                    ELSIF char = '}' THEN
                        open_braces := open_braces - 1;
                    END IF;
                    block_end := block_end + 1;
                END LOOP;

                IF open_braces = 0 THEN
                    block_content := substring(v_valores from block_start + 1 for (block_end - block_start - 2));
                    person_blocks := array_append(person_blocks, block_content);
                    current_pos := block_end;
                ELSE
                    EXIT;
                END IF;
            END LOOP;

            -- Procesar cada persona de esta nomina
            FOREACH person_block IN ARRAY person_blocks
            LOOP
                -- Inicializar fila como JSONB para mapeo clave->valor
                row_data := '{}'::jsonb;

                -- Extraer strings: s:\d+:"clave";s:\d+:"valor"
                FOR key_val IN
                    SELECT regexp_matches(person_block, 's:\d+:\"([^\"]+)\";s:\d+:\"([^\"]*)\"', 'g')
                LOOP
                    row_data := row_data || jsonb_build_object(key_val[1], key_val[2]);
                END LOOP;

                -- Extraer nulls: s:\d+:"clave";N;
                FOR key_val IN
                    SELECT regexp_matches(person_block, 's:\d+:\"([^\"]+)\";N;', 'g')
                LOOP
                    row_data := row_data || jsonb_build_object(key_val[1], null);
                END LOOP;

                -- Extraer booleanos: s:\d+:"clave";b:0; o b:1;
                FOR key_val IN
                    SELECT regexp_matches(person_block, 's:\d+:\"([^\"]+)\";b:([01]);', 'g')
                LOOP
                    row_data := row_data || jsonb_build_object(key_val[1], key_val[2]);
                END LOOP;

                -- Construir lista de valores en orden de col_indices
                insert_vals := '';
                FOR i IN 1..col_count LOOP
                    IF i > 1 THEN
                        insert_vals := insert_vals || ', ';
                    END IF;
                    -- Si es la última columna y no existía idnomina, usar el valor actual
                    IF i = col_count AND NOT idnomina_exists THEN
                        insert_vals := insert_vals || quote_literal(current_idnomina::text);
                    ELSE
                        val := (row_data ->> col_indices[i]);
                        IF val IS NULL THEN
                            insert_vals := insert_vals || 'NULL';
                        ELSE
                            insert_vals := insert_vals || quote_literal(val);			
                        END IF;
                    END IF;
                END LOOP;

                -- Agregar fila al array para insertar en lote
                all_rows := array_append(all_rows, '(' || insert_vals || ')');
                person_count := person_count + 1;
            END LOOP;
        END LOOP;
    END LOOP;

    -- 5. Insertar todas las filas de una sola vez
    IF person_count > 0 THEN
        EXECUTE 'INSERT INTO tmp_nomina VALUES ' || array_to_string(all_rows, ', ');
    END IF;

    RETURN 'OK: ' ;
--|| person_count || ' personas, ' || (col_count - CASE WHEN idnomina_exists THEN 0 ELSE 1 END) || ' columnas + idnomina, de ' || array_length(p_idnomina_list, 1) || ' nominas procesadas.';
END;
$BODY$;

ALTER FUNCTION mod_nomina.deserializar_nominas_lista(numeric[]) OWNER TO zeolides;
