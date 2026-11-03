-- FUNCTION: mod_seguridad.f_adicionar_acciones(character varying, json)

-- DROP FUNCTION IF EXISTS mod_seguridad.f_adicionar_acciones(character varying, json);

CREATE OR REPLACE FUNCTION mod_seguridad.f_adicionar_acciones(
	p_referencia character varying,
	p_acciones json)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
v_iddominio numeric = 1;--Obligatorio
v_idfuncionalidad record;
v_idrecurso numeric;
v_arr_idaciones numeric[];
v_arr_idroles numeric[];
json_element json;

BEGIN

/*
--estructura del json
select mod_seguridad.f_adicionar_acciones('pvd/nomina/index.php/gestsubmayorvacaciones/gestsubmayorvacaciones', '
[
    {"denominacion": "Cuadrar Submayor", "abreviatura": "btnRecalcularSub", "descripcion": "Usado para mostrar el botón Cuadrar submayor en la interfaz Gestionar submayor de vacaciones.", "asignararol": 1}
]
');
*/

for v_idfuncionalidad in (select idfuncionalidad from mod_seguridad.dat_funcionalidad where referencia = p_referencia) loop

		SELECT array_agg(idaccion) into v_arr_idaciones
		FROM mod_seguridad.dat_accion
		WHERE idfuncionalidad = v_idfuncionalidad.idfuncionalidad;
	
		SELECT array_agg(idrol) into v_arr_idroles
		FROM mod_seguridad.dat_sistemarolfuncionalidad
		WHERE idfuncionalidad = v_idfuncionalidad.idfuncionalidad;
	
		FOR json_element IN SELECT * FROM json_array_elements(p_acciones)
		LOOP
	
			INSERT INTO mod_seguridad.dat_recurso(
			denominacion, abreviatura, descripcion, idfuncionalidad, iddominio)
			VALUES ((json_element->>'denominacion')::varchar(60), (json_element->>'abreviatura')::varchar(50), (json_element->>'descripcion')::varchar(255), v_idfuncionalidad.idfuncionalidad, v_iddominio)
			on conflict (denominacion, idfuncionalidad) 
			do update set denominacion = EXCLUDED.denominacion,
			abreviatura = EXCLUDED.abreviatura,
			descripcion = EXCLUDED.descripcion
			returning idrecurso into v_idrecurso;
	
			INSERT INTO mod_seguridad.dat_recursocompartimentacion(
			idrecurso, iddominio)
			VALUES (v_idrecurso, v_iddominio)
			on conflict do nothing;
	
			INSERT INTO mod_seguridad.dat_funcionalidadaccion(
			idaccion, idfuncionalidadasociada, idrecurso)
			SELECT t.id,  v_idfuncionalidad.idfuncionalidad, v_idrecurso
			FROM UNNEST(v_arr_idaciones) AS t(id)
			on conflict do nothing;
	
			----
			if (json_element->>'asignararol') is not null then
				-- se viene la propiedad, se toman los roles q ya tienen la funcionalidad y se les aplica el recurso
				INSERT INTO mod_seguridad.dat_sistemarolfuncionalidadaccion(
					idaccion, idfuncionalidad, idrol, idsistema, idrecurso)
				SELECT dfa.idaccion, v_idfuncionalidad.idfuncionalidad, dsf.idrol, dsf.idsistema, v_idrecurso
				FROM mod_seguridad.dat_funcionalidadaccion dfa
				inner join mod_seguridad.dat_sistemarolfuncionalidad dsf on dsf.idfuncionalidad = dfa.idfuncionalidadasociada
				where dfa.idrecurso = v_idrecurso 
				and dfa.idfuncionalidadasociada = v_idfuncionalidad.idfuncionalidad
				on conflict do nothing;
			end if;
	
		END LOOP;

end loop;

END;
$BODY$;

ALTER FUNCTION mod_seguridad.f_adicionar_acciones(character varying, json) OWNER TO zeolides;
