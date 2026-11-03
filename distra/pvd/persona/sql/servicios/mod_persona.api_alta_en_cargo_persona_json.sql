/*
ALTER TABLE IF EXISTS mod_persona.dat_personaentidad
    ADD CONSTRAINT ak_persona_entidad_fechaalta UNIQUE (identidad, idpersona, fdesde);

COMMENT ON CONSTRAINT ak_persona_entidad_fechaalta ON mod_persona.dat_personaentidad
    IS 'Restricción de unicidad sobre la combinación de los valores de las columnas ( idpersona, identidad,fdesde).';
*/
DROP FUNCTION IF EXISTS mod_persona.api_alta_en_cargo_persona_json(json);
CREATE OR REPLACE FUNCTION mod_persona.api_alta_en_cargo_persona_json(
	p_datos json)
    returnS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
	v_identidad numeric(19,0);
	v_idarea numeric(19,0);
	v_id_personaentidad numeric(19,0);
    v_alta_entidad_vigente numeric(19,0);
	v_id_situacionlaboralp numeric(19,0);
	v_contrato_determinado numeric(19,0);
	v_plaza_disponible boolean;
    v_resultado json;
	v_fechaalta date;
	v_fechafin date;
BEGIN
	v_identidad:=null;
    v_idarea:=null;
	v_id_personaentidad:=null;
    v_alta_entidad_vigente:=null;
	v_id_situacionlaboralp:=null;
	v_contrato_determinado:=null;
	v_plaza_disponible:=false;

    PERFORM 
        p_datos::jsonb->>'idpersona',
		p_datos::jsonb->>'idcargo',
        p_datos::jsonb->>'idtipocontrato', 
        p_datos::jsonb->>'fechaalta',
		p_datos::jsonb->>'pluriempleo';

	select determinado into v_contrato_determinado 
	from mod_fuerzatrabajo.nom_tipocontrato 
	where idtipocontrato = (p_datos::jsonb->>'idtipocontrato')::numeric(19,0);

	insert into mod_fuerzatrabajo.nom_procedenciasocial(idprocedenciasocial, denominacion, descripcion, idpadre, gestion)
	values	(-1, 'PROCEDENCIA TEMPORAL', 'Para uso temporal.', -1, 0),
			(0, 'NO CONOCIDA', 'Para uso temporal.', -1, 0)
	on conflict do nothing;
	
	--validar contrato
	if (v_contrato_determinado is null) then
	        return json_build_object(
	            'exito', false,
	            'mensaje', 'El tipo de contrato debe ser especificado para dar alta en cargo. Verifique la existencia en el sistema del idtipocontrato suministrado.'
	        );
	end if;

	--validar contrato
	if (v_contrato_determinado = 1 and (p_datos::jsonb->>'fechafin' is null)) then
	        return json_build_object(
	            'exito', false,
	            'mensaje', 'El tipo de contrato especificado requiere la definición de una fecha de fin.'
	        );
	end if;
	
	--obtener entidad del cargo
	select idfila into v_identidad 
		from mod_estructuracomp.obtener_ancestro_concepto_3( (p_datos::jsonb->>'idcargo')::bigint);
	--obtener área del cargo
	select idfila into v_idarea
		from mod_estructuracomp.obtener_ancestro_concepto_5( (p_datos::jsonb->>'idcargo')::bigint);

	if(v_identidad is null) then
		return json_build_object(
	            'estado', false,
	            'mensaje', 'Error: No se encontró ninguna "Entidad" para el identificador de cargo suministrado, verifique sus datos.',
				'idcargo', (p_datos::jsonb->>'idcargo')
	        );	
	else
		-- Validar campos obligatorios
	    if ( (p_datos::jsonb->>'idpersona') is null) then
	        return json_build_object(
	            'exito', false,
	            'mensaje', 'El campo idpersona es obligatorio.'
	        );
	    end if;
	
		if ( (p_datos::jsonb->>'idcargo') is null) then
	        return json_build_object(
	            'exito', false,
	            'mensaje', 'El campo idcargo es obligatorio.'
	        );
	    end if;
	    
	    if ( (p_datos::jsonb->>'fechaalta') is null) then
	        return json_build_object(
	            'exito', false,
	            'mensaje', 'El campo fechaalta es obligatorio.'
	        );
	    end if;
		
	    if ( (p_datos::jsonb->>'pluriempleo') is null) then
	        return json_build_object(
	            'exito', false,
	            'mensaje', 'El campo pluriempleo es obligatorio.'
	        );
	    end if;

		 -- Validar y convertir fechaalta
        if ( (p_datos::jsonb->>'fechaalta') is not null) then
            BEGIN
                -- Intentar convertir la fecha
                v_fechaalta := (p_datos->>'fechaalta')::date;
            EXCEPTION 
                when invalid_datetime_format then
                    return json_build_object(
                        'exito', false,
                        'mensaje', 'Formato de fecha inválido. Use el formato YYYY-MM-DD.'
                    );
                when datetime_field_overflow then
                    return json_build_object(
                        'exito', false,
                        'mensaje', 'Fecha no válida. Verifique el día, mes y año.'
                    );
            end;
        else
            return json_build_object(
                'exito', false,
                'mensaje', 'El campo fechaalta es obligatorio.'
            );
        end if;

		 -- Validar y convertir fechafin
        if ( (p_datos::jsonb->>'fechafin') is not null) then
            BEGIN
                -- Intentar convertir la fecha
                v_fechafin := (p_datos->>'fechafin')::date;
            EXCEPTION 
                when invalid_datetime_format then
                    return json_build_object(
                        'exito', false,
                        'mensaje', 'Formato de fecha inválido. Use el formato YYYY-MM-DD.'
                    );
                when datetime_field_overflow then
                    return json_build_object(
                        'exito', false,
                        'mensaje', 'Fecha no válida. Verifique el día, mes y año.'
                    );
            end;
        else
           v_fechafin := null;
        end if;

        --Verificar plazas disponibles para el cargo especificado
		select (cantidad - cantidadreal) > 0 into v_plaza_disponible
		from mod_estructuracomp.dat_cargo 
		where idcargo = (p_datos::jsonb->>'idcargo')::numeric(19,0)
			and idproyecto = 0;

        --Verificar si el contrato es indeterminado
        if (v_contrato_determinado = 0 and !v_plaza_disponible) then
            --no existen plazas disponibles para el cargo en modalidad de contrato indeterminado.
            return json_build_object(
	            'exito', false,
	            'mensaje', 'No existen plazas disponibles para el cargo en modalidad de contrato indeterminado.'
	        );
        else
            --contrato indeterminado y plazas disponibles
                --plaza principal
                if ( (p_datos::jsonb->>'pluriempleo') = 0 ) then
                    --Solicita nombrar en un cargo como principal.
                    --Verificar si ya la persona es alta en la entidad.
                    select idpersonaentidad into v_alta_entidad_vigente 
                    from mod_persona.dat_personaentidad 
                    where identidad = v_identidad
                        and idpersona = p_datos::jsonb->>'idpersona'
                        and fhasta is null;

                    if (v_alta_entidad_vigente is not null) then
                        --Dar alta en el cargo para la propia entidad
                        v_id_personaentidad:=v_alta_entidad_vigente; --asignar la entidad anterior
                        --Verificar el cargo actual en la entidad si tiene uno vigente anterior al que se desea nombrar
                        select idsituacionlaboralp into v_alta_cargo_anterior from mod_persona.dat_situacionlaboral
                        where idpersonaentidad = v_alta_entidad_vigente
                            and estado = 0
                            and (fhasta is null or fhasta > now()::date);
                        if(v_alta_cargo_anterior is not null) then
                            return json_build_object(
	                                'exito', false,
	                                'mensaje', 'La persona ya se encuentra ocupando un cargo en la entidad. Considere realizar un movimiento de cargo.'
	                        );
                        else
                            --Nombrar en el cargo especificado
                                insert into mod_persona.dat_situacionlaboral(
                                        idcargo, 
                                        fdesde,
                                        estado, 
                                        principal,
                                        idsituacion,						 
                                        idtipocontrato,
                                        idarea,						
                                        idpersonaentidad						
                                )		
                                values (	(p_datos::jsonb->>'idcargo')::numeric(19,0),
                                            v_fechaalta, 
                                            0 /*Alta*/,
                                            1,/*Cargo principal*/
                                            1,/*Nombrado en cargo*/
                                            (p_datos::jsonb->>'idtipocontrato')::numeric(19,0),
                                            v_idarea, 
                                            v_alta_entidad_vigente
                                ) returning idsituacionlaboralp INTO v_id_situacionlaboralp;

                            --Actualizar cantidad real del cargo para manejo de la disponibilidad de plazas.
                            update mod_estructuracomp.dat_cargo
	                        set cantidadreal=cantidadreal+1
                            where idproyecto=0 and idcargo = (p_datos::jsonb->>'idcargo')::numeric(19,0);
                    else
		                --Dar alta en la entidad
		                insert into mod_persona.dat_personaentidad(identidad, idpersona, fdesde, idprocedenciasocial)
		                values ( v_identidad, (p_datos::jsonb->>'idpersona')::numeric(19,0), v_fechaalta, 0) 
		                returning idpersonaentidad into v_id_personaentidad;

                    end if;
                else
                    --pluriempleo
                end if;

                --contrato determinado y hay plazas
                --contrato determinado y no hay plazas
        end if;

	    -- Retornar resultado
	    v_resultado := json_build_object(
	        'estado', true,
	        'mensaje', 'Alta en cargo satisfactoria',
			'id_altaentidad',v_id_personaentidad,
			'id_nombcargo',v_id_situacionlaboralp
	    );
	end if;
    return v_resultado;
    
EXCEPTION when OTHERS then
    return json_build_object(
        'estado', false,
	    'mensaje', 'Error: ' || SQLERRM
    );
end;
$BODY$;

ALTER FUNCTION mod_persona.api_alta_en_cargo_persona_json(json) OWNER TO zeolides;

-- 2 Indeterminado
/*
SELECT mod_persona.api_alta_en_cargo_persona_json('{
"idpersona": 2823,
"idcargo": "200531204",
"idtipocontrato": 635,
"fechaalta": "2025-10-31",
"fechafin": null,
"pluriempleo": "0"
}'::json);
*/
