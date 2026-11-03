CREATE OR REPLACE FUNCTION mod_loginventario.f_modelovaledevolucionproducto (
  p_iddocumento numeric,
  p_monedaalternativa numeric,
  p_monedacontable numeric
)
RETURNS SETOF mod_loginventario.td_modelovaledevolucionproducto AS
$body$
declare
v_rec mod_loginventario.td_modelovaledevolucionproducto;
begin
for v_rec in
select distinct
dum.abreviaturaunidadmedida,
coalesce(dm.cantidad,0),
coalesce(dm.preciocontable,0),
coalesce(dm.importecontable,0),
ni.numeropieza,
(case when (ni.numeropieza is null or ni.numeropieza = '') then ni.codigo else ni.numeropieza END),
ni.denominacion as producto,
dp.cantidad as existencia,
coalesce(dm.precioalternativo,0),
coalesce(dm.importealternativo,0),
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedaalternativa) as monedaalternativa,
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedacontable) as monedacontable,
nca.denominacion
from mod_logistica.dat_movimiento dm
left join mod_datosmaestros.nom_unidadmedida dum on dum.idunidadmedida = dm.idunidadmedida
left join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
left join mod_logistica.nom_categoria nca on nca.idcategoria = dp.idcategoria
where dm.iddocumento = p_iddocumento
loop return next v_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;


CREATE OR REPLACE FUNCTION mod_loginventario.f_modeloaperturaproducto (
  p_iddocumento numeric,
  p_monedaalternativa numeric,
  p_monedacontable numeric
)
RETURNS SETOF mod_loginventario.td_modeloaperturaproducto AS
$body$
declare
  all_rec mod_loginventario.td_modeloaperturaproducto;
begin
for all_rec in
select distinct
(case when (ni.numeropieza is null or ni.numeropieza = '') then ni.codigo else ni.numeropieza END),
ni.denominacion,
num.abreviaturaunidadmedida as unidadmedida,
nc.denominacion as categoria,
(case when (ni.numeropieza is null or ni.numeropieza = '') then ni.codigo else ni.numeropieza END),
coalesce(dm.preciocontable,0),
coalesce(dm.cantidad,0),
coalesce(dm.importecontable,0),
coalesce(dm.precioalternativo,0),
coalesce(dm.importealternativo,0),
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedaalternativa),
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedacontable),
'',--(select atributo from mod_loginventario.f_modeloaperturatribprod(dp.idproducto)) as atribprod
(select concat(nc.concatcta,' ',nc.descripcion) from mod_contabilidad.nom_cuenta nc 
inner join mod_logistica.nom_clasificacioncontable ncc on ncc.idcuenta = nc.idcuenta 
where ncc.idclasificacioncontable = dp.idclasificacioncontable) as cuenta,
(select concat(nc.concatcta,' ',nc.descripcion) from mod_contabilidad.nom_cuenta nc 
inner join mod_logistica.nom_clasificacioncontable ncc on ncc.idcuentaalt = nc.idcuenta 
where ncc.idclasificacioncontable = dp.idclasificacioncontable) as cuentaalt
from mod_logistica.dat_movimiento dm 
left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = dm.idunidadmedida
left join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto 
left join mod_logistica.nom_categoria nc on nc.idcategoria = dp.idcategoria
left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
where dm.iddocumento = p_iddocumento
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT



CREATE OR REPLACE FUNCTION mod_loginventario.f_modelodiferenciaproducto (
  p_iddocumento numeric,
  p_monedaalternativa numeric,
  p_monedacontable numeric
)
RETURNS SETOF mod_loginventario.td_informediferenciasproducto AS
$body$
declare
all_rec mod_loginventario.td_informediferenciasproducto;

begin 

for all_rec in
select distinct
(case when (ni.numeropieza is null or ni.numeropieza = '') then ni.codigo else ni.numeropieza END),
nc.denominacion as catprod,
ni.denominacion as prod,
num.abreviaturaunidadmedida as um,
(case when dmd.signo = '1' then dmd.cantidaddiferencia else 0 end) as sobrante,
(case when dmd.signo = '2' then dmd.cantidaddiferencia else 0 end) as faltante,
coalesce((dmd.cantidaddiferencia * dm.preciocontable),0) as importesobfalt,
coalesce(dmd.preciodiferencia,0),
coalesce(dmd.importediferencia,0),
COALESCE((select sum(dmdc.cantidaddiferencia) from mod_loginventario.dat_movdiferenciacalidad dmdc where dmdc.idmovimiento = dm.idmovimiento),0) as  otros, 
COALESCE((select (sum(dmdc.cantidaddiferencia)* dm.preciocontable) from mod_loginventario.dat_movdiferenciacalidad dmdc where dmdc.idmovimiento = dm.idmovimiento),0) as importeotros,
dm.preciocontable,--coalesce(dmd.preciodiferencia) as punitario,
coalesce(dmd.importediferencia,0) as importe,
ni.numeropieza,
COALESCE(dmd.preciodiferenciaalt,0),
COALESCE(dmd.importediferenciaalt,0),
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedaalternativa) as monedaalternativa,           
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedacontable) as monedacontable
from mod_logistica.dat_movimiento dm
left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = dm.idunidadmedida
left join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto 
left join mod_logistica.nom_categoria nc on nc.idcategoria = dp.idcategoria
left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
left join mod_loginventario.dat_movdiferencia dmd on dmd.idmovimiento = dm.idmovimiento
where dm.iddocumento = p_iddocumento
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

CREATE OR REPLACE FUNCTION mod_loginventario.f_modelodiferenciaproducto (
  p_iddocumento numeric,
  p_monedaalternativa numeric,
  p_monedacontable numeric
)
RETURNS SETOF mod_loginventario.td_informediferenciasproducto AS
$body$
declare
all_rec mod_loginventario.td_informediferenciasproducto;

begin 

for all_rec in
select distinct
(case when (ni.numeropieza is null or ni.numeropieza = '') then ni.codigo else ni.numeropieza END),
nc.denominacion as catprod,
ni.denominacion as prod,
num.abreviaturaunidadmedida as um,
(case when dmd.signo = '1' then dmd.cantidaddiferencia else 0 end) as sobrante,
(case when dmd.signo = '2' then dmd.cantidaddiferencia else 0 end) as faltante,
coalesce((dmd.cantidaddiferencia * dm.preciocontable),0) as importesobfalt,
coalesce(dmd.preciodiferencia,0),
coalesce(dmd.importediferencia,0),
COALESCE((select sum(dmdc.cantidaddiferencia) from mod_loginventario.dat_movdiferenciacalidad dmdc where dmdc.idmovimiento = dm.idmovimiento),0) as  otros, 
COALESCE((select (sum(dmdc.cantidaddiferencia)* dm.preciocontable) from mod_loginventario.dat_movdiferenciacalidad dmdc where dmdc.idmovimiento = dm.idmovimiento),0) as importeotros,
dm.preciocontable,--coalesce(dmd.preciodiferencia) as punitario,
coalesce((dmd.cantidaddiferencia * dm.preciocontable),0),--coalesce(dmd.importediferencia,0) as importe,
ni.numeropieza,
COALESCE(dmd.preciodiferenciaalt,0),
COALESCE(dmd.importediferenciaalt,0),
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedaalternativa) as monedaalternativa,           
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedacontable) as monedacontable
from mod_logistica.dat_movimiento dm
left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = dm.idunidadmedida
left join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto 
left join mod_logistica.nom_categoria nc on nc.idcategoria = dp.idcategoria
left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
left join mod_loginventario.dat_movdiferencia dmd on dmd.idmovimiento = dm.idmovimiento
where dm.iddocumento = p_iddocumento
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;


CREATE OR REPLACE FUNCTION mod_loginventario.f_modelorecepcionproducto (
  p_iddocumento numeric,
  p_monedaalternativa numeric,
  p_monedacontable numeric
)
RETURNS SETOF mod_loginventario.td_recepcionproducto AS
$body$
declare
all_rec mod_loginventario.td_recepcionproducto;
begin
for all_rec in
select distinct
(case when (ni.numeropieza is null or ni.numeropieza = '') then ni.codigo else ni.numeropieza END),
nc.denominacion as categoria,
(case when (ni.numeropieza is null or ni.numeropieza = '') then ni.codigo else ni.numeropieza END),
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
from mod_logistica.dat_movimiento dm
left join mod_loginventario.dat_movrecepcion dmr on dmr.idmovimiento = dm.idmovimiento
left join mod_datosmaestros.nom_unidadmedida dum on dum.idunidadmedida = dm.idunidadmedida
left join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto 
left join mod_logistica.nom_categoria nc on nc.idcategoria = dp.idcategoria
left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
where dm.iddocumento = p_iddocumento --
order by dm.idmovimiento
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;