-- FUNCTION: mod_loginventario.f_modelohojadeinventarioproducto(numeric, numeric, numeric)

-- DROP FUNCTION IF EXISTS mod_loginventario.f_modelohojadeinventarioproducto(numeric, numeric, numeric);

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
(case when dm.cantidad < dmi.existenciaactual then dmi.existenciaactual - dm.cantidad end) as cantidadfaltante,
(case when dm.cantidad < dmi.existenciaactual then dm.preciopromedio * (dmi.existenciaactual - dm.cantidad) end) as valorfaltantes,
(case when dm.cantidad > dmi.existenciaactual then dm.cantidad - dmi.existenciaactual end) as cantidadsobrante,
(case when dm.cantidad > dmi.existenciaactual then dm.preciopromedio * (dm.cantidad - dmi.existenciaactual) end) as valorsobrante,
dm.preciocontable as precio,
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
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedacontable) as monedacontable
from mod_logistica.dat_movimiento dm
left join mod_loginventario.dat_movinventario dmi on dm.idmovimiento = dmi.idmovimiento
left join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto 
left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
left join mod_datosmaestros.nom_unidadmedida dum on dum.idunidadmedida = ni.idumedida
left join mod_logubicacion.dat_ubicacionproducto dup on dup.idproducto = dp.idproducto
left join mod_logubicacion.dat_estructuraubicacion deup on deup.idestructuraubicacion = dup.idubicacion
where dm.iddocumento = p_iddocumento
--order by dp.idclasificacioncontable,dm.idmovimiento
order by ni.numeropieza, dp.idclasificacioncontable
loop return next v_rec; end loop;
end;
$BODY$;

ALTER FUNCTION mod_loginventario.f_modelohojadeinventarioproducto(numeric, numeric, numeric)
    OWNER TO zeolides;

