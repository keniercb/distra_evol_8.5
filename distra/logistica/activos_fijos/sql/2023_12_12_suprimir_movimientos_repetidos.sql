DO $do$
DECLARE
r_doc record;
r_mov record;
cont integer := 1;
nueva_cantidad integer := 0;
v_borrar int := 1;-- 1-borrar repetidos y 0-consultar entidad
BEGIN
--desactivar trigger
ALTER TABLE mod_logactivofijotangible.dat_movregnumerico DISABLE TRIGGER t_eliminarmovrn;

--dat_movregnumerico repetidos las llaves idregnumerico||' '||idmovimiento
for r_doc in (SELECT count(idregnumerico||'%'||idmovimiento) as cant_rep, idregnumerico||'%'||idmovimiento as rm, idmovimiento
FROM mod_logactivofijotangible.dat_movregnumerico		  
group by idregnumerico||'%'||idmovimiento, idmovimiento
having count(idregnumerico||'%'||idmovimiento) > 1
)
loop
	if(v_borrar=1)then
		--borrar		
		delete from mod_logactivofijotangible.dat_movregnumerico 
		where idmovregnumerico in ( select idmovregnumerico from mod_logactivofijotangible.dat_movregnumerico 
									where idmovimiento = r_doc.idmovimiento 
										and idregnumerico::text like (select split_part(r_doc.rm, '%', 1))
										and idmovregnumerico <> (	select idmovregnumerico 
																	from mod_logactivofijotangible.dat_movregnumerico 
																	where idmovimiento = r_doc.idmovimiento limit 1
																)
								  );
		--calcular la cantidad
		select count(*) into nueva_cantidad from mod_logactivofijotangible.dat_movregnumerico 
		where idmovimiento = r_doc.idmovimiento;

		--actualizar la cantidad del movimiento
		update mod_logistica.dat_movimiento set cantidad = nueva_cantidad where idmovimiento = r_doc.idmovimiento;

	else
		--datos de la entidad y el documento
		select distinct v_estruc.denominacion as estructura, d.nrodoc into r_mov
		from mod_logistica.dat_movimiento as mov
		inner join mod_logistica.dat_documento as d on (mov.iddocumento = d.iddocumento)
		inner join mod_datosmaestros.dat_documentoprim as dprim on (dprim.iddoc = d.iddoc)
		inner join mod_datosmaestros.dat_estructurasubsist as estruc_sbs on (estruc_sbs.idestructurasubsist = dprim.idestructurasubsist)
		inner join mod_estructuracomp.v_dametodasestructuras as v_estruc on (v_estruc.idestructura = estruc_sbs.idestructuracomun);
	end if;	
end loop;

if(v_borrar=1)then
	--crear restricción
	ALTER TABLE IF EXISTS mod_logactivofijotangible.dat_movregnumerico DROP CONSTRAINT IF EXISTS ak_registro_movimiento;
	ALTER TABLE IF EXISTS mod_logactivofijotangible.dat_movregnumerico
	ADD CONSTRAINT ak_registro_movimiento UNIQUE (idregnumerico, idmovimiento);
end if;
--activar el trigger
ALTER TABLE mod_logactivofijotangible.dat_movregnumerico ENABLE TRIGGER t_eliminarmovrn;
END;
$do$;
