--Ejecutar cambios de responsable repetidos.
DO $do$
DECLARE

repetidos record;
sql_update text:='';
sql_delete text:='';
v_sql_responsable text;
v_sql_rna text;
v_sql_mrna text;
v_sql_ra text;
v_sql_da text;

BEGIN
for repetidos in (
					with pers_rept_resp as (select count(idpersona),idpersona from mod_logactivofijotangible.dat_responsable
												group by idpersona
												having count(idpersona) > 1
												order by idpersona
											)
					select (array_agg(resp.idresponsable))[1] as idresponsable_persiste,
							resp.idpersona,
							cardinality(array_remove(array_agg(resp.idresponsable), (array_agg(resp.idresponsable))[1])) as cant_borrar,
							--array_remove(array_agg(resp.idresponsable),	(array_agg(resp.idresponsable))[1]) as lista_a_cambiar,
							array_to_string(array_remove(array_agg(resp.idresponsable),	(array_agg(resp.idresponsable))[1]), ',') as lista_a_cambiar
					from mod_logactivofijotangible.dat_responsable as resp
					inner join pers_rept_resp as pers on (pers.idpersona = resp.idpersona)
					group by resp.idpersona
				)
loop
	v_sql_rna:= 'update mod_logactivofijotangible.dat_regnumericoactivo
	set idresponsable = '||repetidos.idresponsable_persiste||' 
	where idresponsable in ('||repetidos.lista_a_cambiar||')'||';';

	v_sql_mrna:= 'update mod_logactivofijotangible.dat_movregnumericoactivo
	set idresponsable = '||repetidos.idresponsable_persiste||' 
	where idresponsable in ('||repetidos.lista_a_cambiar||')'||';';

	v_sql_ra:= 'update mod_logactivofijotangible.conf_responsablearea
	set idresponsable = '||repetidos.idresponsable_persiste||' 
	where idresponsable in ('||repetidos.lista_a_cambiar||')'||';';

	v_sql_da:= 'update mod_logactivofijotangible.dat_documentoactivo
	set idresponsabledestino = '||repetidos.idresponsable_persiste||'
	where idresponsabledestino in ('||repetidos.lista_a_cambiar||')'||';';

	if(sql_update = '') then
		sql_update:=chr(10)||v_sql_rna||chr(10)||v_sql_mrna||chr(10)||v_sql_ra||chr(10)||v_sql_da||chr(10);
	else
		sql_update:=sql_update||chr(10)||v_sql_rna||chr(10)||v_sql_mrna||chr(10)||v_sql_ra||chr(10)||v_sql_da||chr(10);
	end if;	

	--borrar
	v_sql_responsable:= 'delete from mod_logactivofijotangible.dat_responsable 
	 where idpersona = '||repetidos.idpersona||' and idresponsable in ('||repetidos.lista_a_cambiar||')'||';';

	if(sql_delete = '') then
		sql_delete:=v_sql_responsable||chr(10);
	else
		sql_delete:=sql_delete||chr(10)||v_sql_responsable||chr(10);
	end if;	

end loop;

--raise notice '%',chr(10)||sql_update;
execute sql_update;

raise notice '**DELETE**';

--raise notice '%',chr(10)||sql_delete;
execute sql_delete;

raise notice '**RESTRICCION UNICIDAD**';

ALTER TABLE IF EXISTS mod_logactivofijotangible.dat_responsable DROP CONSTRAINT IF EXISTS ak_idpersona;
ALTER TABLE IF EXISTS mod_logactivofijotangible.dat_responsable
    ADD CONSTRAINT ak_idpersona UNIQUE (idpersona);
COMMENT ON CONSTRAINT ak_idpersona ON mod_logactivofijotangible.dat_responsable
    IS 'Restricción de unicidad sobre la columna (idpersona).';

END;
$do$;
