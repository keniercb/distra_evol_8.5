DROP FUNCTION IF EXISTS mod_loginventario.f_modelohojadeinventarioproducto(numeric, numeric, numeric);
DROP TYPE IF EXISTS mod_loginventario.td_modelohojadeinventarioproducto;

CREATE TYPE mod_loginventario.td_modelohojadeinventarioproducto AS
(
	idubicacion numeric(19,0),
	ubicacion character varying,
	ubicacioncompleta text,
	idproducto numeric(19,0),
	codigo character varying,
	denomprod character varying,
	um character varying,
	cantidadubicada numeric(25,6),
	existencia numeric(25,6),
	cantfaltantes numeric(19,0),
	valorfaltantes numeric(25,6),
	cantsobrante numeric(19,0),
	valorsobrante numeric(25,6),
	precio numeric(19,6),
	numeropieza character varying,
	conteo numeric(25,6),
	importecontable numeric(25,6),
	precioalternativo numeric(25,6),
	importealternativo numeric(25,6),
	cuenta character varying,
	cuentaalt character varying,
	importeexistencia numeric(25,6),
	preciopromedioalternativo numeric(25,6),
	idclasificacioncontable numeric(19,0),
	idmovimiento numeric(19,0),
	monedaalternativa character varying(50),
	monedacontable character varying(50)
);

ALTER TYPE mod_loginventario.td_modelohojadeinventarioproducto OWNER TO zeolides;

CREATE OR REPLACE FUNCTION mod_loginventario.f_modelohojadeinventarioproducto(
	p_iddocumento numeric,
	p_monedaalternativa numeric,
	p_monedacontable numeric)
    RETURNS SETOF mod_loginventario.td_modelohojadeinventarioproducto 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
declare
  v_rec mod_loginventario.td_modelohojadeinventarioproducto;
begin
for v_rec in
select distinct
dup.idubicacion as idubicacion,
deup.descripcion as ubicacion,
(select * from mod_loginventario.f_obtenerubicompleta(deup.idestructuraubicacion,deup.nivel)) as ubicacioncompleta,
dp.idproducto,
(case when (ni.numeropieza is null or ni.numeropieza = '') then ni.codigo else ni.numeropieza END),
ni.denominacion as denomprod,
dum.abreviaturaunidadmedida as um,
coalesce(dup.cantidad,0) as cantidadubicada,
dp.cantidad as existencia,
(case when dm.cantidad < dm.existenciaactual then dm.existenciaactual - dm.cantidad end) as cantidadfaltante,
(case when dm.cantidad < dm.existenciaactual then dm.preciopromedio * (dm.existenciaactual - dm.cantidad) end) as valorfaltantes,
(case when dm.cantidad > dm.existenciaactual then dm.cantidad - dm.existenciaactual end) as cantidadsobrante,
(case when dm.cantidad > dm.existenciaactual then dm.preciopromedio * (dm.cantidad - dm.existenciaactual) end) as valorsobrante,
dp.precio,
ni.numeropieza,
dm.cantidad as conteo,
coalesce(dm.importecontable,0),
coalesce(dm.precioalternativo,0),0,
(select nc.concatcta from mod_contabilidad.nom_cuenta nc 
inner join mod_logistica.nom_clasificacioncontable ncc on ncc.idcuenta = nc.idcuenta 
where ncc.idclasificacioncontable = dp.idclasificacioncontable) as cuenta,
(select nc.concatcta from mod_contabilidad.nom_cuenta nc 
inner join mod_logistica.nom_clasificacioncontable ncc on ncc.idcuentaalt = nc.idcuenta 
where ncc.idclasificacioncontable = dp.idclasificacioncontable) as cuentaalt,
round((coalesce(dp.cantidad,0) * coalesce(dp.precio,0)),2) as importe,
dp.precioalternativo as preciopromedioalternativo,  
dp.idclasificacioncontable, 
dm.idmovimiento,
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedaalternativa) as monedaalternativa,           
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedacontable) as monedacontable,

case when conf.ordenproducto = 1 then ni.codigo end as codigoproducto,
case when conf.ordenproducto = 2 then ni.denominacion end as denomproducto,
case when conf.ordenproducto = 3 then dm.idmovimiento end as ordeninsercion,
case when conf.ordenproducto = 4 then ni.numeropieza end as codigofabricante,
case when conf.ordenproducto = 5 then nat.denominacion end as naturalezaprod,
conf.ordenproducto
	
from mod_logistica.dat_movimiento dm
left join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto 
left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
left join mod_datosmaestros.nom_unidadmedida dum on dum.idunidadmedida = ni.idumedida
left join mod_logubicacion.dat_ubicacionproducto dup on dup.idproducto = dp.idproducto
left join mod_logubicacion.dat_estructuraubicacion deup on deup.idestructuraubicacion = dup.idubicacion
inner join mod_logistica.dat_documento d on d.iddocumento = dm.iddocumento
left join mod_loginventario.conf_inventario conf on conf.idestructuracomun = dp.idestructuracomun
left join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = ni.idnaturaleza

where dm.iddocumento = p_iddocumento

order by 
case when conf.ordenproducto = 1 then ni.codigo end,
case when conf.ordenproducto = 2 then ni.denominacion end,
case when conf.ordenproducto = 3 then dm.idmovimiento end,
case when conf.ordenproducto = 4 then ni.numeropieza end,
case when conf.ordenproducto = 5 then nat.denominacion end
	
loop return next v_rec; end loop;
end;
$BODY$;

ALTER FUNCTION mod_loginventario.f_modelohojadeinventarioproducto(numeric, numeric, numeric) OWNER TO zeolides;