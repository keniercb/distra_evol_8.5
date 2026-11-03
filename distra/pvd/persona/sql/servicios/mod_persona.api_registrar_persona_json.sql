-- FUNCTION: mod_persona.api_registrar_persona_json(json)

-- DROP FUNCTION IF EXISTS mod_persona.api_registrar_persona_json(json);

CREATE OR REPLACE FUNCTION mod_persona.api_registrar_persona_json(
	p_datos json)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    v_idpersona numeric(19,0);
	v_iddocidentidad numeric(19,0);
    v_anno_identidad text;
    v_mes_identidad text;
    v_dia_identidad text;
	v_iddatosnacimiento numeric(19,0);
	v_fecha_nacimiento date;
    v_anno_fecha text;
    v_mes_fecha text;
    v_dia_fecha text;
	v_numidentidad_existe boolean;
    v_resultado json;
BEGIN
    PERFORM 
        p_datos::jsonb->>'numeroidentidad',
		p_datos::jsonb->>'nombre',
        p_datos::jsonb->>'papel', 
        p_datos::jsonb->>'sexo';

	SELECT EXISTS(SELECT 1 FROM mod_persona.dat_docidentidad
	WHERE numero = p_datos::jsonb->>'numeroidentidad' ) into v_numidentidad_existe;

	IF(v_numidentidad_existe) THEN
		RETURN json_build_object(
	            'estado', false,
	            'mensaje', 'Error: la identidad suministrada está en uso, verifique sus datos.',
				'identidad', p_datos::jsonb->>'numeroidentidad'
	        );	
	ELSE
		-- Validar campos obligatorios
	    IF (p_datos::jsonb->>'numeroidentidad') IS NULL OR (p_datos::jsonb->>'numeroidentidad') = '' THEN
	        RETURN json_build_object(
	            'exito', false,
	            'mensaje', 'El campo numeroidentidad es obligatorio.'
	        );
	    END IF;
	
        -- Validar longitud de 11 caracteres
        IF length(p_datos::jsonb->>'numeroidentidad') != 11 THEN
            RETURN json_build_object(
                'exito', false,
                'mensaje', 'El campo numeroidentidad debe tener exactamente 11 caracteres, verifique sus datos.'
            );
        END IF;

        -- Validar que contenga solo números
        IF p_datos::jsonb->>'numeroidentidad' !~ '^[0-9]+$' THEN
            RETURN json_build_object(
                'exito', false,
                'mensaje', 'El campo numeroidentidad debe contener solo números, verifique sus datos.'
            );
        END IF;

		IF (p_datos::jsonb->>'nombre') IS NULL THEN
	        RETURN json_build_object(
	            'exito', false,
	            'mensaje', 'El campo nombre es obligatorio.'
	        );
	    END IF;
	    
	    IF (p_datos::jsonb->>'papel') IS NULL THEN
	        RETURN json_build_object(
	            'exito', false,
	            'mensaje', 'El campo papel es obligatorio.'
	        );
	    END IF;
	    
	    IF (p_datos::jsonb->>'sexo') IS NULL THEN
	        RETURN json_build_object(
	            'exito', false,
	            'mensaje', 'El campo sexo es obligatorio.'
	        );
	    END IF;

 -- Validar y convertir fecha de nacimiento
        IF p_datos::jsonb->>'fechanacimiento' IS NOT NULL THEN
            BEGIN
                -- Intentar convertir la fecha
                v_fecha_nacimiento := (p_datos->>'fechanacimiento')::date;
                
                -- Validar que la fecha sea razonable (no futura y mayor de 10 años)
                IF v_fecha_nacimiento > CURRENT_DATE THEN
                    RETURN json_build_object(
                        'exito', false,
                        'mensaje', 'La fecha de nacimiento no puede ser futura.'
                    );
                END IF;
               
            EXCEPTION 
                WHEN invalid_datetime_format THEN
                    RETURN json_build_object(
                        'exito', false,
                        'mensaje', 'Formato de fecha inválido. Use el formato YYYY-MM-DD.'
                    );
                WHEN datetime_field_overflow THEN
                    RETURN json_build_object(
                        'exito', false,
                        'mensaje', 'Fecha de nacimiento inválida. Verifique el día, mes y año.'
                    );
            END;
        ELSE
            -- Si la fecha de nacimiento es obligatoria, descomenta la siguiente sección:            
            RETURN json_build_object(
                'exito', false,
                'mensaje', 'El campo fechanacimiento es obligatorio.'
            );
        END IF;

		-- Extraer componentes de la fecha de nacimiento
        v_anno_fecha := TO_CHAR(v_fecha_nacimiento, 'YY'); -- Año (2 dígitos)
        v_mes_fecha := TO_CHAR(v_fecha_nacimiento, 'MM');  -- Mes (2 dígitos)
        v_dia_fecha := TO_CHAR(v_fecha_nacimiento, 'DD');  -- Día (2 dígitos)

		-- Extraer componentes de fecha del número de identidad (primeros 6 dígitos: AAMMDD)
        v_anno_identidad := SUBSTRING(p_datos::jsonb->>'numeroidentidad' FROM 1 FOR 2); -- Año (últimos 2 dígitos)
        v_mes_identidad := SUBSTRING(p_datos::jsonb->>'numeroidentidad' FROM 3 FOR 2);  -- Mes
        v_dia_identidad := SUBSTRING(p_datos::jsonb->>'numeroidentidad' FROM 5 FOR 2);  -- Día

		-- Crear columnas (migrado / idfuc) si no existen
		ALTER TABLE IF EXISTS mod_persona.dat_persona 
    		ADD COLUMN IF NOT EXISTS migrado integer NOT NULL DEFAULT 0;
	    COMMENT ON COLUMN mod_persona.dat_persona.migrado
    		IS 'Indicador de origen del dato. (0-Insertado por el usuario del sistema. 3- Insertado por la API.';
		ALTER TABLE IF EXISTS mod_persona.dat_persona
    		ADD COLUMN IF NOT EXISTS idfuc character varying(32) COLLATE pg_catalog."default";
		COMMENT ON COLUMN mod_persona.dat_persona.idfuc
    		IS 'Identificador de la integración con la Ficha Única del Ciudadano (FUC).';
		ALTER TABLE IF EXISTS mod_persona.dat_datosnacimiento 
    		ADD COLUMN IF NOT EXISTS migrado integer NOT NULL DEFAULT 0;
	    COMMENT ON COLUMN mod_persona.dat_datosnacimiento.migrado
    		IS 'Indicador de origen del dato. (0-Insertado por el usuario del sistema. 3- Insertado por la API.';
		-- Insertar datos persona
	    INSERT INTO mod_persona.dat_persona(
	        nombre, snombre, papel, sapel, sexo, idestructura, idsuin, migrado, idfuc
	    ) VALUES (
	        	p_datos->>'nombre'
	        ,	p_datos->>'snombre'
	        ,	p_datos->>'papel'
	        ,	p_datos->>'sapel'
	        ,	(p_datos->>'sexo')::numeric(1,0)
	        ,	(p_datos->>'idestructura')::numeric(19,0)
	        ,	p_datos->>'idsuin'
	        ,	3 -- insertado api
			,	p_datos->>'idfuc'
	    )
	    RETURNING idpersona INTO v_idpersona;
	
		-- Insertar datos identidad
		INSERT INTO mod_persona.dat_docidentidad(
			idpersona, idtipodocidentidad, numero, principal)
		VALUES (v_idpersona, 1, p_datos->>'numeroidentidad',1)
		RETURNING iddocidentidad INTO v_iddocidentidad;

		-- Insertar datos nacimiento
		INSERT INTO mod_persona.dat_datosnacimiento(
			fechanacimiento, nombremadre, nombrepadre, /*registrocivil, tomo, folio, idpais, idprovincia, idmunicipio, localidad,*/ idpersona, migrado)
		VALUES (v_fecha_nacimiento, p_datos->>'nombremadre', p_datos->>'nombrepadre', /*?, ?, ?, ?, ?, ?, ?,*/ v_idpersona, 3 /*-- insertado api*/ )
		RETURNING iddatosnacimiento INTO v_iddatosnacimiento;

	    -- Retornar resultado
	    v_resultado := json_build_object(
	        'estado', true,
	        'mensaje', 'Persona registrada exitosamente',
	        'id_p', v_idpersona,
			'id_doc',v_iddocidentidad,
			'id_datosnacimiento',v_iddatosnacimiento
	    );
	END IF;
    RETURN v_resultado;
    
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
        'estado', false,
	    'mensaje', 'Error: ' || SQLERRM
    );
END;
$BODY$;

ALTER FUNCTION mod_persona.api_registrar_persona_json(json) OWNER TO zeolides;

--ejemplo de uso
/*
SELECT mod_persona.api_registrar_persona_json('{
	"numeroidentidad": "89112437625",
    "nombre": "api_María",
    "snombre": null,
    "papel": "m",
    "sapel": "García",
    "sexo": "0",
    "idestructura": "12345",
    "idsuin": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
	"idfuc": "5as6e9f5r8f2d1q3h9u6j4t88er65li1",
	"fechanacimiento": "1989-02-03",
	"nombremadre": "Mayda de la Caridad",
	"nombrepadre": "José Guitierrez González"
}'::json);
*/
