 DROP FUNCTION IF EXISTS mod_logactivofijotangible.f_activos_alta_mal();
 DROP TYPE IF EXISTS mod_logactivofijotangible.td_activos_alta_mal;
 CREATE TYPE mod_logactivofijotangible.td_activos_alta_mal AS
(
	idregnumerico numeric,
	esbaja numeric,
	idestadooperacion numeric,
	nroinventario character varying,
	denom_registro character varying,
	entidad character varying,
	valoradquisicion numeric	
);

ALTER TYPE mod_logactivofijotangible.td_activos_alta_mal OWNER TO zeolides;

--función f_activos_alta_mal()
CREATE OR REPLACE FUNCTION mod_logactivofijotangible.f_activos_alta_mal()
    RETURNS SETOF mod_logactivofijotangible.td_activos_alta_mal 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$

DECLARE

v_fin mod_logactivofijotangible.td_actualizarcant;
BEGIN

return query 
(
--activos
with w_activos as (select rna.idregnumerico as idregistro_activo
					from mod_logactivofijotangible.dat_registronumerico rn
					inner join mod_logactivofijotangible.dat_regnumericoactivo as rna on rna.idregnumerico = rn.idregnumerico
				    inner join mod_logactivofijotangible.conf_gruposcuentas cgc on (cgc.idgruposubgrupo = rna.idgruposubgrupo)
					inner join mod_contabilidad.nom_cuenta nc on (nc.idcuenta = cgc.idcuentaactivo)
				  	where nc.concatcta not like '187.%'
				   		and rna.esbaja = 0 and rna.idestadoperacion <> 7
				   ),
	w_mov_doc_opr as (select mov.iddocumento, mov.idmovimiento, mrn.idmovregnumerico, mrn.idregnumerico,
					  	vest.denominacion as entidad
					 	from mod_logistica.dat_movimiento as mov
					 	inner join mod_logactivofijotangible.dat_movregnumerico as mrn on (mov.idmovimiento = mrn.idmovimiento)
					  	inner join mod_logistica.dat_documento as doc on (mov.iddocumento = doc.iddocumento)
					    inner join mod_logistica.dat_producto as dp on (dp.idproducto = mov.idproducto)
					  	inner join mod_estructuracomp.v_dametodasestructuras as vest on (vest.idestructura = dp.idestructuracomun)
					  	inner join mod_datosmaestros.nom_operacion as opr on (opr.idnomoperaciones = doc.idoperacion)
					  	where opr.codigooperacion in ('OPER_BAJA_DEFINITIVA','OPER_INV_BAJA','OPER_BAJA_VENTA','OPER_BAJA')
					 )							
 (
	 select distinct rna.idregnumerico,
	 		rna.esbaja,
			rna.idestadoperacion,
			rna.nroinventario,
	 		rna.denominacion,
	 		mov_opr.entidad,
	        rna.valoradquisicion
	 from mod_logactivofijotangible.dat_regnumericoactivo as rna
	 inner join w_activos as activos on (activos.idregistro_activo = rna.idregnumerico)
	 inner join w_mov_doc_opr as mov_opr on (activos.idregistro_activo = mov_opr.idregnumerico)
	 order by mov_opr.entidad	 
 )
);

END;
$BODY$;

ALTER FUNCTION mod_logactivofijotangible.f_activos_alta_mal() OWNER TO zeolides;

--Ejecución de la consulta para conocer los activos que están de alta de forma incorrecta.
	select * from mod_logactivofijotangible.f_activos_alta_mal()
union
	select null::numeric as idregnumerico, null::numeric as esbaja, null as idestadooperacion, null as nroinventario,
			null as denom_registro, entidad||' Total' as entidad, sum(valoradquisicion) as suma
	from mod_logactivofijotangible.f_activos_alta_mal()
	group by entidad
	order by entidad;

--Corregir estado del activo
update mod_logactivofijotangible.dat_regnumericoactivo
set esbaja = 1, idestadoperacion = 7
where idregnumerico in (select idregnumerico from mod_logactivofijotangible.f_activos_alta_mal());
