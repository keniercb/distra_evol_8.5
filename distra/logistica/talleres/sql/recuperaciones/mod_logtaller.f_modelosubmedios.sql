DROP FUNCTION IF EXISTS mod_logtaller.f_modelosubmedios(numeric);
DROP TYPE IF EXISTS mod_logtaller.td_jsonorden;
CREATE TYPE mod_logtaller.td_jsonorden AS
(
	columna text,
	clave text,
	frag text,
	valor text,
	medio character varying(255),
	garantia character varying(10),
	idordentrabajo numeric
);

ALTER TYPE mod_logtaller.td_jsonorden  OWNER TO zeolides;
CREATE OR REPLACE FUNCTION mod_logtaller.f_modelosubmedios(
	idordentrabajo numeric)
    RETURNS SETOF mod_logtaller.td_jsonorden 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
DECLARE
	v_result mod_logtaller.td_jsonorden;    
    v_rec record;
	v_longitud_dinamicos integer :=-1;
	v_sql text:='';
BEGIN
	v_rec := null;
	v_sql := 'create temporary table datos_json_'||$1::text||'( columna text, clave text, frag text, valor text, medio varchar(255), garantia varchar(10), idordentrabajo numeric);';
	execute v_sql;

	--validar el uso de mod_logtaller.dat_medioorden.dinamicos::json
	select json_array_length(dmo.dinamicos::json) into v_longitud_dinamicos
	from mod_logtaller.dat_medioorden dmo
	where (dmo.idordentrabajo = $1 or $1 is null);
	
	--contiene medios pero sin usar dinámicos v_longitud_dinamicos = 0
	if (v_longitud_dinamicos = 0) then
		for v_rec in ( select nic.denominacion as medio,
							case when dot.garantia = 1 then 'Si' else 'No' end as garantia
						from mod_logtaller.dat_medioorden dmo
						left join mod_datosmaestros.nom_indicador nic on nic.idindicador = dmo.idindicador
						inner join mod_logtaller.dat_ordentrabajo dot on dot.idordentrabajo = dmo.idordentrabajo
            			where (dmo.idordentrabajo = $1 or $1 is null) )
		loop
			v_sql :='';
			v_sql :='insert into datos_json_'||$1::text||' (medio, garantia, idordentrabajo) 
						values ('''||v_rec.medio||''', '''||v_rec.garantia||''', '''||$1||''');';
			execute v_sql;
		end loop;
	else
		for v_rec in ( select json_array_elements(dmo.dinamicos::json) -> 'etiqueta' as columna,
       						json_array_elements(dmo.dinamicos::json) -> 'name' as clave,
       						json_array_elements(dmo.dinamicos::json) as frag,
							'' as valor,
							nic.denominacion as medio,
							case when dot.garantia = 1 then 'Si' else 'No' end as garantia
						from mod_logtaller.dat_medioorden dmo
						left join mod_datosmaestros.nom_indicador nic on nic.idindicador = dmo.idindicador
						inner join mod_logtaller.dat_ordentrabajo dot on dot.idordentrabajo = dmo.idordentrabajo
            			where (dmo.idordentrabajo = $1 or $1 is null) )
		loop
			v_sql :='';
			v_sql :='insert into datos_json_'||$1::text||' (columna, clave, frag, valor, medio, garantia, idordentrabajo)
            		values ('''||v_rec.columna||''', '''||v_rec.clave||''', '''||v_rec.frag||''', '''||v_rec.valor||''', '''
								||v_rec.medio||''', '''||v_rec.garantia||''', '''||$1||''');';
			execute v_sql;
		end loop;
	end if;
	v_sql :='';
	v_sql :='select columna, clave, frag, valor, medio, garantia, idordentrabajo from datos_json_'||$1::text;
	
	for v_result in execute v_sql
    loop
		v_result.columna = replace(v_result.columna,'"','');
		v_result.clave = replace(v_result.clave,'"','');
	    v_result.valor = (select json_extract_path_text(v_result.frag::json,v_result.clave));
    	return next v_result;
	end loop;
	v_sql :='';
	v_sql :='drop table datos_json_'||$1||';';
	execute v_sql;	
	END;
$BODY$;

ALTER FUNCTION mod_logtaller.f_modelosubmedios(numeric) OWNER TO zeolides;
