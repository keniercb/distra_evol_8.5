-- FUNCTION: mod_migracion_aft.f_aux_cantidad_productos(numeric, numeric, numeric)

-- DROP FUNCTION IF EXISTS mod_migracion_aft.f_aux_cantidad_productos(numeric, numeric, numeric);

CREATE OR REPLACE FUNCTION mod_migracion_aft.f_aux_cantidad_productos(
	iddocumento numeric,
	idarea_resp_origen numeric,
	idestructura_origen numeric)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$

DECLARE
consulta_sql_act text;
consulta_sql_uh text;
v_cant_act numeric:=0;
v_cant_uh numeric:=0;
BEGIN
		--activos
		consulta_sql_act:='
		select p.idproducto, sum(rna.valoradquisicion) as importe, count(p.idproducto) as cantidad, 1 as activo 
		from mod_logactivofijotangible.dat_registronumerico rn
		inner join mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
		inner join mod_logistica.dat_producto p on p.idproducto = rn.idproducto
		inner join mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
		inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador 
		left join mod_datosmaestros.nom_gruposubgrupo g on (g.idgruposubgrupo = ih.idgruposubgrupo)
		left join mod_logactivofijotangible.conf_gruposcuentas cgc on (cgc.idgruposubgrupo = g.idgruposubgrupo and cgc.idestructura = p.idestructuracomun)
		left join mod_contabilidad.nom_cuenta nc on (nc.idcuenta = cgc.idcuentaactivo)
		where p.idestructuracomun = '||$3||'
			and	rna.idarearesp = '||$2||'
			and nc.concatcta not like ''187.%''
		group by p.idproducto';

		--uh
		consulta_sql_uh:='
		select p.idproducto, sum(rna.valoradquisicion) as importe, count(p.idproducto) as cantidad, 2 as activo
		from mod_logactivofijotangible.dat_registronumerico rn
		inner join mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
		inner join mod_logistica.dat_producto p on p.idproducto = rn.idproducto
		inner join mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
		inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador 
		left join mod_datosmaestros.nom_gruposubgrupo g on (g.idgruposubgrupo = ih.idgruposubgrupo)
		left join mod_logactivofijotangible.conf_gruposcuentas cgc on (cgc.idgruposubgrupo = g.idgruposubgrupo and cgc.idestructura = p.idestructuracomun)
		left join mod_contabilidad.nom_cuenta nc on (nc.idcuenta = cgc.idcuentaactivo)
		where p.idestructuracomun = '||$3||'
			and	rna.idarearesp = '||$2||'
			and nc.concatcta like ''187.%''
		group by p.idproducto';

	CREATE temp TABLE IF NOT EXISTS tmp_datos_movimiento
	(
    	idproducto numeric,
    	importe numeric,
    	cantidad numeric,
		activo numeric
	);
	
	execute 'insert into tmp_datos_movimiento ('||consulta_sql_act||')';
	execute 'insert into tmp_datos_movimiento ('||consulta_sql_uh||')';
	
	select count(*) into v_cant_act from tmp_datos_movimiento where activo = 1;
	select count(*) into v_cant_uh from tmp_datos_movimiento where activo = 2;
	
	update mod_migracion_aft.log_bitacora_cambios set cant_prod_activo = v_cant_act 
	where origen = $3 and area_origen = $2;
	update mod_migracion_aft.log_bitacora_cambios set cant_prod_uh = v_cant_uh 
	where origen = $3 and area_origen = $2;
	
	raise notice 'v_cant_act: % y v_cant_uh: %',v_cant_act,v_cant_uh;
	v_cant_act:=0;	v_cant_uh:=0;
	drop table tmp_datos_movimiento;
END;
$BODY$;

ALTER FUNCTION mod_migracion_aft.f_aux_cantidad_productos(numeric, numeric, numeric)
    OWNER TO zeolides;
