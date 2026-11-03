-- FUNCTION: mod_migracion_aft.f_cambiar_centcost_activos_entre_entidades(numeric, numeric)

-- DROP FUNCTION IF EXISTS mod_migracion_aft.f_cambiar_centcost_activos_entre_entidades(numeric, numeric);

CREATE OR REPLACE FUNCTION mod_migracion_aft.f_cambiar_centcost_activos_entre_entidades(
	idestructuraorigen numeric,
	idestructuradestino numeric)
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
r_doc_areas record;
v_revertir_sql_rn text;
v_revertir_sql_p text;
v_iddocumento_bit numeric;
tuplas numeric;
BEGIN
raise notice 'Cambiar áreas de responsabilidad entre:';
raise notice 'Entidad origen: %',$1;
raise notice 'Entidad destino: %',$2;

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
	area_origen numeric not null,
	destino numeric not null,
	area_destino numeric not null,
    sql_org_des_rn text not null,
	sql_org_des_rn_revert text not null,
	sql_org_des_prod text not null,
	sql_org_des_prod_revert text not null,
	doc_generado_activo integer not NULL default 0,
	doc_generado_uh integer not NULL default 0,
	iddocumento_activo numeric,
	cant_prod_activo numeric,
    iddocumento_uh numeric,
	cant_prod_uh numeric
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS mod_migracion_aft.log_bitacora_cambios OWNER to zeolides;

for cambios_areasresp in (with prod_centcosto as 
						  		(
								select rna.idarearesp, eop.denominacion, dp.idproducto, rna.idcentrocosto
								from mod_logistica.dat_producto dp
								inner join mod_logactivofijotangible.dat_registronumerico as rn on (rn.idproducto = dp.idproducto)
								inner join mod_logactivofijotangible.dat_regnumericoactivo as rna using (idregnumerico)
								inner join mod_estructuracomp.dat_estructuraop as eop on (eop.idestructuraop = rna.idarearesp)
								where idestructuracomun = $1
									and	rna.idarearesp is not null
									and rna.idcentrocosto in 
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
--idestadoperacion = 1
	v_sql_rn:= 'update mod_logactivofijotangible.dat_regnumericoactivo
	set idestadoperacion = 1, idarearesp = '||cambios_areasresp.idarea_nuevaentidad||' 
	where idarearesp = '||cambios_areasresp.idarearesp_vieja||'
		and idcentrocosto = '||cambios_areasresp.idcentrocosto||';';
	--revertir cambio en dat_regnumericoactivo
	v_revertir_sql_rn:= 'update mod_logactivofijotangible.dat_regnumericoactivo
	set idestadoperacion = 1, idarearesp = '||cambios_areasresp.idarearesp_vieja||' 
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
	
	insert into mod_migracion_aft.log_bitacora_cambios(
	origen, area_origen, destino, area_destino, sql_org_des_rn, sql_org_des_rn_revert, sql_org_des_prod, sql_org_des_prod_revert)
	values ($1, cambios_areasresp.idarearesp_vieja, $2, cambios_areasresp.idarea_nuevaentidad, v_sql_rn, 
			v_revertir_sql_rn, v_sql_p, v_revertir_sql_p);

	--verificar que tiene activos y/o uh el área
	perform mod_migracion_aft.f_aux_cantidad_productos(null,cambios_areasresp.idarearesp_vieja, $1);
	
end loop;
	--recorrer por área origen
	
	for r_doc_areas in (select * from mod_migracion_aft.log_bitacora_cambios where doc_generado_activo = 0 
						and iddocumento_activo is null and cant_prod_activo > 0
						) loop
		--crear documento para activos
		perform mod_migracion_aft.f_aux_crear_documento( r_doc_areas.origen, r_doc_areas.area_origen, r_doc_areas.destino, 
															r_doc_areas.area_destino, 'MMAFT', 'OPER_TRASLADO_EXTER', null);
	end loop;
	
	r_doc_areas:=null;
	
	for r_doc_areas in (select * from mod_migracion_aft.log_bitacora_cambios where doc_generado_uh = 0 
						and iddocumento_uh is null and cant_prod_uh > 0
						) loop
		--crear documento para UH
		perform mod_migracion_aft.f_aux_crear_documento( r_doc_areas.origen, r_doc_areas.area_origen, r_doc_areas.destino, 
															r_doc_areas.area_destino, '005', 'OPER_TRAS_EXTER_UH', null);
	end loop;
END;
$BODY$;

ALTER FUNCTION mod_migracion_aft.f_cambiar_centcost_activos_entre_entidades(numeric, numeric)
    OWNER TO zeolides;
