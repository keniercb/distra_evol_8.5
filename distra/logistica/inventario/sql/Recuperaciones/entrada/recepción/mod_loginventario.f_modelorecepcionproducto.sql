DROP FUNCTION IF EXISTS mod_loginventario.f_modelorecepcionproducto(numeric, numeric, numeric);
DROP TYPE IF EXISTS mod_loginventario.td_recepcionproducto;

CREATE TYPE mod_loginventario.td_recepcionproducto AS
(
	codigo character varying,
	categoria character varying,
	nombreproducto character varying,
	unidadmedida character varying,
	cantidadproducto numeric(25,6),
	preciocontable numeric(25,6),
	importetotal numeric(25,6),
	saldo numeric(25,6),
	recargodescuento numeric(19,6),
	preciounitariototal numeric(19,6),
	precioalternativo numeric(25,6),
	importealternativo numeric(25,6),
	monedaalternativa character varying,
	monedacontable character varying,
	cantidadporfactura numeric(25,6),
	idmovimiento numeric(19,0),
	importecup numeric(25,6),
	importecuc numeric(25,6),
	ubicacion character varying(255)
);

ALTER TYPE mod_loginventario.td_recepcionproducto OWNER TO zeolides;

CREATE OR REPLACE FUNCTION mod_loginventario.f_modelorecepcionproducto(
	p_iddocumento numeric,
	p_monedaalternativa numeric,
	p_monedacontable numeric)
    RETURNS SETOF mod_loginventario.td_recepcionproducto 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
declare
all_rec mod_loginventario.td_recepcionproducto;
begin
for all_rec in
select distinct
coalesce(ni.numeropieza,ni.codigo) as codigo,
nc.denominacion as categoria,
ni.denominacion as nombreproducto,
dum.abreviaturaunidadmedida as unidadmedida,
coalesce(dm.cantidad,0) as cantidadproducto,
coalesce(round(dm.preciocontable,6),0),
coalesce(round((dm.preciocontable * dm.cantidad),2),0),
dm.existenciaactual,
coalesce(round(dm.recargodescuento,2),0),
coalesce(round(dm.preciocontable,6),0) + coalesce(round(dm.recargodescuento / (case when dm.cantidad = 0 then 1 else dm.cantidad end),6),0) as preciounitariototal,
coalesce(round(dm.precioalternativo,6),0),
coalesce(round((dm.precioalternativo * dm.cantidad + dm.recargodescuentoalt),2),0),
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedaalternativa) as monedaalternativa,           
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedacontable) as monedacontable,
dmr.cantidad as cantidadporfactura,
dm.idmovimiento,
round((select sum(round(ddmv.importecontable,2)) from mod_logistica.dat_movimiento ddmv where ddmv.iddocumento = p_iddocumento),2) as importecup, 
round((select sum(round(ddmv.importealternativo,2)) from mod_logistica.dat_movimiento ddmv where ddmv.iddocumento = p_iddocumento),2) as importecuc   
,
case when conf.ordenproducto = 1 then ni.codigo end as codigoproducto,
case when conf.ordenproducto = 2 then ni.denominacion end as denomproducto,
case when conf.ordenproducto = 3 then dm.idmovimiento end as ordeninsercion,
case when conf.ordenproducto = 4 then ni.numeropieza end as codigofabricante,
case when conf.ordenproducto = 5 then nat.denominacion end as naturalezaprod,
conf.ordenproducto
	
from mod_logistica.dat_movimiento dm
left join mod_loginventario.dat_movrecepcion dmr on dmr.idmovimiento = dm.idmovimiento
left join mod_datosmaestros.nom_unidadmedida dum on dum.idunidadmedida = dm.idunidadmedida
left join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto 
left join mod_logistica.nom_categoria nc on nc.idcategoria = dp.idcategoria
left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
left join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = ni.idnaturaleza
left join mod_loginventario.conf_inventario conf on conf.idestructuracomun = dp.idestructuracomun
where dm.iddocumento = p_iddocumento
--order by dm.idmovimiento
order by 
case when conf.ordenproducto = 1 then ni.codigo end,
case when conf.ordenproducto = 2 then ni.denominacion end,
case when conf.ordenproducto = 3 then dm.idmovimiento end,
case when conf.ordenproducto = 4 then ni.numeropieza end,
case when conf.ordenproducto = 5 then nat.denominacion end
	
loop return next all_rec; end loop;
end;
$BODY$;

ALTER FUNCTION mod_loginventario.f_modelorecepcionproducto(numeric, numeric, numeric) OWNER TO zeolides;
