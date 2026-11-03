DROP FUNCTION IF EXISTS mod_logabc.f_rep_parametrizacionproductos(numeric, numeric, numeric, numeric, text);
DROP TYPE IF EXISTS mod_logabc.td_parametrizacionproductos;
CREATE TYPE mod_logabc.td_parametrizacionproductos AS
(
	codigo character varying,producto character varying,
	lineaproducto character varying,iddeposito numeric,
	deposito text,clasificacion character varying,
	existencia numeric,disponibilidad numeric
);

ALTER TYPE mod_logabc.td_parametrizacionproductos OWNER TO zeolides;

CREATE OR REPLACE FUNCTION mod_logabc.f_aux_addatributesparametrizacion(p_redefinir boolean)
    RETURNS text
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE STRICT PARALLEL UNSAFE
AS $BODY$
declare
	v_cont int:= 0;
	cant_statics_attributes int:= 0;
	r_attributes record;
	r_parametrosinventario record;
	v_drop_attribute text:= '';
	v_columnas text:= ' codigo character varying, precio numeric, producto character varying, lineaproducto character varying, iddeposito numeric, 
		logo character varying, entidad character varying, deposito text, clasificacion character varying, existencia numeric, disponibilidad numeric, ';
	v_iteracion int:= 0;
	v_dinamic_type text:= '';
	a_statics_attributes text[]:='{ codigo character varying, precio numeric, producto character varying, lineaproducto character varying, iddeposito numeric, 
		logo character varying, entidad character varying, deposito text, clasificacion character varying, existencia numeric, disponibilidad numeric}';
begin
	--elementos del nomenclador.
	select count(*) into v_cont from mod_logabc.nom_parametrosinventario /*where idparametrosinventario = -1*/ order by 1;
	if (p_redefinir) then
		--borrar
		for r_attributes in (select attribute_name, upper(attribute_name) as attribute_name_upper from information_schema.attributes 
		where udt_schema = 'mod_logabc' and udt_name = 'td_parametrizacionproductos')
		loop
			if (r_attributes.attribute_name = r_attributes.attribute_name_upper) then
				begin
					execute 'ALTER TYPE mod_logabc.td_parametrizacionproductos DROP ATTRIBUTE '||'"'||r_attributes.attribute_name||'"'||';';
					exception 	when sqlstate '42701' then
						raise notice 'add attribute discarted';
				end;
			else
				begin
					execute 'ALTER TYPE mod_logabc.td_parametrizacionproductos DROP ATTRIBUTE '||r_attributes.attribute_name||';';
					exception 	when sqlstate '42701' then
							raise notice 'add attribute discarted';
				end;
			end if;
		end loop;
		if (v_cont > 0) then
			r_attributes = null;
			for statics in array_lower(a_statics_attributes,1) .. array_upper(a_statics_attributes,1) loop
				begin
					execute 'ALTER TYPE mod_logabc.td_parametrizacionproductos ADD ATTRIBUTE '||a_statics_attributes[statics]||';';
					exception 	when sqlstate '42701' then
						raise notice 'add attribute discarted';
				end;
			end loop;
			for r_parametrosinventario in (select distinct abreviatura from mod_logabc.nom_parametrosinventario order by 1) loop
				v_dinamic_type := 'ALTER TYPE mod_logabc.td_parametrizacionproductos ADD ATTRIBUTE '
								||'"'||r_parametrosinventario.abreviatura||'"'||' numeric(25,4);';
		   		--Operación que puede generar una excepción
				begin
					execute (v_dinamic_type);
					exception 	when sqlstate '42701' then
		      						raise notice 'add attribute discarted';
				end;
				v_iteracion:=v_iteracion+1;
				if (v_cont = v_iteracion) then
					v_columnas := v_columnas||'"'||r_parametrosinventario.abreviatura||'"'||' numeric(25,4)';
				else
					v_columnas := v_columnas||'"'||r_parametrosinventario.abreviatura||'"'||' numeric(25,4),';
				end if;
			end loop;
		else
			raise exception 'No es posible redefinir el "TYPE" (mod_logabc.td_parametrizacionproductos), el nomenclador (mod_logabc.nom_parametrosinventario)
			no contiene datos para considerarlos atributos del "TYPE". Es muy probable que la definición vigente del "TYPE" esté corrupta.';
		end if;
	else
		for r_parametrosinventario in (select distinct abreviatura from mod_logabc.nom_parametrosinventario order by 1) loop
			v_dinamic_type := 'ALTER TYPE mod_logabc.td_parametrizacionproductos ADD ATTRIBUTE '
							||'"'||r_parametrosinventario.abreviatura||'"'||' numeric(25,4);';
		   	--Operación que puede generar una excepción
			begin
				execute (v_dinamic_type);
				exception 	when sqlstate '42701' then
		      				raise notice 'add attribute discarted';
			end;
			v_iteracion:=v_iteracion+1;
			if (v_cont = v_iteracion) then
				v_columnas := v_columnas||'"'||r_parametrosinventario.abreviatura||'"'||' numeric(25,4)';
			else
				v_columnas := v_columnas||'"'||r_parametrosinventario.abreviatura||'"'||' numeric(25,4),';
			end if;
		end loop;
	end if;
return v_columnas;
end;
$BODY$;

ALTER FUNCTION mod_logabc.f_aux_addatributesparametrizacion(boolean) OWNER TO zeolides;
--select * from mod_logabc.f_aux_addatributesparametrizacion(true);