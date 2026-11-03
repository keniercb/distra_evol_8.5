CREATE OR REPLACE FUNCTION mod_migracion_aft.f_cambiar_centcost_activos_entre_entidades(
	idestructuraorigen numeric,
	idestructuradestino numeric
)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$

DECLARE
cambios_areasresp record;
sql_update text:='';
v_sql_rn text;
v_sql_p text;

v_revertir_sql_rn text;
v_revertir_sql_p text;
BEGIN
raise notice 'Cambiar áreas de responsabilidad entre:';
raise notice 'Entidad origen: %',$1;
raise notice 'Entidad destino: %',$2;
/*
update mod_logactivofijotangible.dat_regnumericoactivo
	set idarearesp = 200539499 
	where idarearesp = 200532701
		and idcentrocosto = 990000000746;
UPDATE mod_logistica.dat_producto
	SET idestructura=200539499, 
		idestructuracomun=200533253 
	WHERE idestructuracomun = 200530666 and idestructura = 200532701;

*/
/*
Requiere: 
1- Configurar el subsistema de activos fijos y gestionar fecha por subsistemas.
1.1- Inicio/Datos Maestros/Parámetros/Gestionar subsistemas
1.2- Inicio/Datos Maestros/Parámetros/Gestionar fechas por subsistemas
2- Copiar y pegar el agrupador de áreas de responsabilidad de la entidad origen (Inmobiliaria Caribe)
para las UEB (Playa y Centro Histórico). Acción a realizar desde el sistema.
2.1- Inicio/Gestión organizacional/Gestionar estructura
3- Permiso de acceso a las UEB para el usuario, para verificar la información en el Submayor de Activos.

*/
CREATE TABLE IF NOT EXISTS mod_migracion_aft.log_bitacora_cambios
(
	fecha time without time zone default now(),
    origen numeric not null,
	destino numeric not null,
    sql_org_des_rn text not null,
	sql_org_des_rn_revert text not null,
	sql_org_des_prod text not null,
	sql_org_des_prod_revert text not null
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS mod_migracion_aft.log_bitacora_cambios OWNER to zeolides;

for cambios_areasresp in (with prod_centcosto  as 
						  		(
								select rna.idarearesp, eop.denominacion, dp.idproducto, rna.idcentrocosto, dp.idestructura
								from mod_logistica.dat_producto dp
								inner join mod_logactivofijotangible.dat_registronumerico as rn on (rn.idproducto = dp.idproducto)
								inner join mod_logactivofijotangible.dat_regnumericoactivo as rna using (idregnumerico)
								inner join mod_estructuracomp.dat_estructuraop as eop on (eop.idestructuraop = rna.idarearesp)
								where idestructuracomun = $1
									and	rna.idarearesp is not null
									and rna.idcentrocosto in /*any(cast('{990000000740,990000000494}' as numeric[])
														   ) --filtro de centro de costo*/
						 				(select cc.idcentrogrupo from mod_contabilidadcosto.nom_centrocosto as cc
											inner join mod_migracion_aft.tmp_centrocosto_areas_ueb as tmp on (cc.concat = tmp.concat_cc_excel)
											where tmp.idestructura = $2 --estructuradestino
											order by idcentrogrupo asc
										)
								)
								select distinct prod_cc.idcentrocosto, prod_cc.denominacion, eop.idestructuraop as idarea_nuevaentidad,
						  				nf.idpadre as idagrupador_nuevo,
										prod_cc.idarearesp as idarearesp_vieja
								from mod_estructuracomp.dat_estructuraop as eop
								inner join mod_estructuracomp.nom_filaestruc as nf on (eop.idestructuraop = nf.idfila and eop.idproyecto = 0)
								inner join prod_centcosto as prod_cc on (prod_cc.denominacion like eop.denominacion)
								where (nf.parent_path operator(public.<@) (	select fe1.parent_path 
																		   		from mod_estructuracomp.nom_filaestruc fe1
        																		where fe1.idfila = $2
																		  )--estructuradestino
										and nf.fechafin is null)
						 	)
loop
	v_sql_rn:= 'update mod_logactivofijotangible.dat_regnumericoactivo
	set idarearesp = '||cambios_areasresp.idarea_nuevaentidad||' 
	where idarearesp = '||cambios_areasresp.idarearesp_vieja||'
		and idcentrocosto = '||cambios_areasresp.idcentrocosto||';';
	--revertir cambio en dat_regnumericoactivo
	v_revertir_sql_rn:= 'update mod_logactivofijotangible.dat_regnumericoactivo
	set idarearesp = '||cambios_areasresp.idarearesp_vieja||' 
	where idarearesp = '||cambios_areasresp.idarea_nuevaentidad||'
		and idcentrocosto = '||cambios_areasresp.idcentrocosto||';';
		
	v_sql_p:='UPDATE mod_logistica.dat_producto
	SET idestructura='||cambios_areasresp.idarea_nuevaentidad||', 
		idestructuracomun='||$2||' 
	WHERE idestructuracomun = '||$1||' and idestructura = '||cambios_areasresp.idarearesp_vieja||';';
	--revertir cambio en dat_producto
	v_revertir_sql_p:='UPDATE mod_logistica.dat_producto
	SET idestructura='||cambios_areasresp.idarearesp_vieja||', 
		idestructuracomun='||$1||' 
	WHERE idestructuracomun = '||$2||' and idestructura = '||cambios_areasresp.idarea_nuevaentidad||';';
	
	INSERT INTO mod_migracion_aft.log_bitacora_cambios(
	origen, destino, sql_org_des_rn, sql_org_des_rn_revert, sql_org_des_prod, sql_org_des_prod_revert)
	VALUES ($1, $2, v_sql_rn, v_revertir_sql_rn, v_sql_p, v_revertir_sql_p);
	
	if(sql_update = '') then
		sql_update:=v_sql_rn||chr(10)||v_sql_p;
	else
		sql_update:=sql_update||chr(10)||v_sql_rn||chr(10)||v_sql_p||chr(10);
	end if;
	
end loop;
	raise notice '%',sql_update;
	
	--execute sql_update;
END;
$BODY$;

ALTER FUNCTION mod_migracion_aft.f_cambiar_centcost_activos_entre_entidades(numeric, numeric) OWNER TO zeolides;
--SELECT * from mod_migracion_aft.f_cambiar_centcost_activos_entre_entidades(200530666, 200533253);
