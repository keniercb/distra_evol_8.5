-- FUNCTION: mod_migracion_aft.f_aux_crear_movimientos(numeric, numeric, numeric, numeric, text)

-- DROP FUNCTION IF EXISTS mod_migracion_aft.f_aux_crear_movimientos(numeric, numeric, numeric, numeric, text);

CREATE OR REPLACE FUNCTION mod_migracion_aft.f_aux_crear_movimientos(
	iddocumento numeric,
	idarea_resp_origen numeric,
	idestructura_origen numeric,
	idestructura_destino numeric,
	codigo text)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$

DECLARE
v_cronologia_mov numeric;
r_datos_movimiento record;
v_idmovimiento_generado numeric;
v_idmovregnumerico_generado numeric;
v_idregnumerico numeric;
consulta_sql text;
BEGIN
	if(codigo = 'MMAFT')then
		--activos
		consulta_sql:='
		select p.idproducto, sum(rna.valoradquisicion) as importe, count(p.idproducto) as cantidad 
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
	else
		--uh
		consulta_sql:='
		select p.idproducto, sum(rna.valoradquisicion) as importe, count(p.idproducto) as cantidad 
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
	end if;

	CREATE temp TABLE IF NOT EXISTS tmp_datos_movimiento
	(
    	idproducto numeric,
    	importe numeric,
    	cantidad numeric
	);
	
	execute 'insert into tmp_datos_movimiento ('||consulta_sql||')';
	
	--datos para el movimiento (FOR LOOP)
	for r_datos_movimiento in ( select * from tmp_datos_movimiento )
	loop
		--cronología del dat_movimiento
		select case when (max(m.cronologia) is null) then 1 else max(m.cronologia)+1 end into v_cronologia_mov from mod_logistica.dat_movimiento as m;
	
		--insertando en dat_movimiento
		insert into mod_logistica.dat_movimiento(
		iddocumento, idproducto,
		importecontable, cantidad, cronologia, diferencia, existenciaactual, preciopromedio, importetotal, signo,
		recargodescuentoalt)
		values ($1, r_datos_movimiento.idproducto,
			r_datos_movimiento.importe, r_datos_movimiento.cantidad, v_cronologia_mov, 0, r_datos_movimiento.cantidad, 0, r_datos_movimiento.importe, '-',
			0)
		returning idmovimiento into v_idmovimiento_generado;
		
		--obtener idregnumerico de dat_registronumerico segun el producto
		select rn.idregnumerico into v_idregnumerico from mod_logactivofijotangible.dat_registronumerico as rn
		where rn.idproducto = r_datos_movimiento.idproducto;
		
		--validar v_idmovimiento_generado
		if (v_idmovimiento_generado is not null and v_idregnumerico is not null) then
			--insertando en dat_movregnumerico el movimiento del producto
 			insert into mod_logactivofijotangible.dat_movregnumerico (idregnumerico, idmovimiento)
 			values (v_idregnumerico,v_idmovimiento_generado) 
			returning idmovregnumerico
			into v_idmovregnumerico_generado;

			--insertando en dat_movregnumericoactivo
			insert into mod_logactivofijotangible.dat_movregnumericoactivo(
			idmovregnumerico, 
			idestatustecnico, idarearesp, idcentrocosto, idcolorprim, idcolorsec, idubicacion,
			idactividad, idtabla, valoradquisicion, depreciacionacumulada, tasafiscal, porcientorecuperacion, 
			valorcontable, annofabricacion, vidautil, fechaadq, fechaexpini, fechaexpfin, 
			depreciacion, idcategoria, idresponsable, recursoconsumido, cantidadrecursoconsumido, 
			importe, usufructo, nroinventario, fechainicialgarantia, fechafingarantia, 
			recursoconsumidomax, vencimientolot, arrendado, valorcontablealternativo, 
			valoradquisicionalternativo, depreciacionacumuladaalternativo, depreciacioncuc, 
			datos, diferenciadepreciacion, diferenciadepreciacionalternativo, diferenciavalor, 
			diferenciavaloralternativo, idnaturaleza, idgruposubgrupo, denominacion, idgruposubgrupoold, actividad)
			(select v_idmovregnumerico_generado as idmovregnumerico,
			idestatustecnico, idarearesp, idcentrocosto, idcolorprim, idcolorsec, idubicacion,
			idactividad, idtabla, valoradquisicion, depreciacionacumulada, tasafiscal, porcientorecuperacion,
			valorcontable, annofabricacion, vidautil, fechaadq, fechaexpini, fechaexpfin,
			null,/*depreciacion,*/ idcategoria, idresponsable, recursoconsumido, cantidadrecursoconsumido,
			importe, null,/*usufructo,*/nroinventario, fechainicialgarantia, fechafingarantia,
			recursoconsumidomax, null,/*vencimientolot,*/arrendado, valorcontablealternativo,
			valoradquisicionalternativo, depreciacionacumuladaalternativo, null,/*depreciacioncuc,*/
			datos, null,/*diferenciadepreciacion,*/ null,/*diferenciadepreciacionalternativo,*/ null,/*diferenciavalor,*/
			null,/*diferenciavaloralternativo,*/idnaturaleza, idgruposubgrupo, denominacion, idgruposubgrupoold, actividad
			from mod_logactivofijotangible.dat_regnumericoactivo
			where idregnumerico = v_idregnumerico);
		else
			raise exception 'v_idmovimiento_generado: % y/o v_idregnumerico: % con valor null.',v_idmovimiento_generado,v_idregnumerico;
		end if;
	end loop;

	drop table tmp_datos_movimiento;
END;
$BODY$;

ALTER FUNCTION mod_migracion_aft.f_aux_crear_movimientos(numeric, numeric, numeric, numeric, text)
    OWNER TO zeolides;
