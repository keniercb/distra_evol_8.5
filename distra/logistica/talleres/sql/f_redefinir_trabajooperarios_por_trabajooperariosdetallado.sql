CREATE OR REPLACE FUNCTION mod_logtaller.f_redefinir_trabajooperarios_por_trabajooperariosdetallado(p_idestructuracomun numeric)
    RETURNS character varying
    LANGUAGE 'plpgsql'
    COST 5
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
r_responsables record;
r_operarios_resp_period record;
sql_update text;
idtrabajooperarios_new numeric;
respuesta text;
BEGIN
respuesta := 'Acciones sobre idestructuracomun: '||$1;
	FOR r_responsables in (select pc.idperiodo,top.idresponsable, replace(replace(ARRAY_AGG (tod.idtrabajooperariosdetallado)::text,'{',''),'}','') arrdetallado
						   from mod_logtaller.dat_trabajooperariosdetallado tod
						   inner join mod_logtaller.dat_trabajooperarios top using (idtrabajooperarios)
						   inner join mod_datosmaestros.dat_periodocontable pc on 
						   ( (tod.fecha between pc.inicio and pc.fin) and (pc.inicio <> pc.fin))
						   where top.idestructuracomun=$1
						   group by (pc.idperiodo,top.idresponsable)
						  order by pc.idperiodo, top.idresponsable)
	LOOP
		--buscar si existe el par [idperiodo, idresponsable] en dat_trabajooperarios
		select idtrabajooperarios, true::boolean as existe into r_operarios_resp_period
		from mod_logtaller.dat_trabajooperarios where idestructuracomun=$1 and idresponsable=r_responsables.idresponsable 
		and idperiodo=r_responsables.idperiodo
		limit 1;
		sql_update:=null;
		if(r_operarios_resp_period.existe)then
		--true
		--Actualizar dat_trabajooperariosdetallado con el idtrabajooperarios obtenido del buscar para todas
		--las tuplas que contienen el par [idperiodo, idresponsable].
			sql_update:='UPDATE mod_logtaller.dat_trabajooperariosdetallado
			SET idtrabajooperarios='||r_operarios_resp_period.idtrabajooperarios ||'
			WHERE idtrabajooperariosdetallado in ('||r_responsables.arrdetallado||')';
		else
		--false
		--Crear una tupla en dat_trabajooperarios con el responsable y periodo y 200530666
			INSERT INTO mod_logtaller.dat_trabajooperarios(idestructuracomun, idresponsable, idperiodo)
				VALUES ($1, r_responsables.idresponsable, r_responsables.idperiodo) RETURNING idtrabajooperarios into idtrabajooperarios_new;
			sql_update:='UPDATE mod_logtaller.dat_trabajooperariosdetallado
			SET idtrabajooperarios='||idtrabajooperarios_new||'
			WHERE idtrabajooperariosdetallado in ('||r_responsables.arrdetallado||')';
			respuesta:=respuesta||chr(10)||'Insertando nuevo valor en dat_trabajooperarios: '||idtrabajooperarios_new;
			respuesta:=respuesta||chr(10)||'Actualizando en dat_trabajooperariosdetallado los idtrabajooperariosdetallado: '||r_responsables.arrdetallado;
		end if;
			execute sql_update;
	END LOOP;
	--Eliminar los idtrabajooperarios sin detalles
	DELETE FROM mod_logtaller.dat_trabajooperarios
	WHERE idestructuracomun = $1 and idtrabajooperarios not in (select distinct idtrabajooperarios from mod_logtaller.dat_trabajooperariosdetallado);
	respuesta:=respuesta||chr(10)||' Eliminados de dat_trabajooperarios los que no tienen detallado. '||chr(10)||'Terminado.';
	return respuesta;
END;
$BODY$;

ALTER FUNCTION mod_logtaller.f_redefinir_trabajooperarios_por_trabajooperariosdetallado(numeric) OWNER TO zeolides;
