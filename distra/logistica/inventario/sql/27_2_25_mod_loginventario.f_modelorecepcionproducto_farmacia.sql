CREATE OR REPLACE FUNCTION mod_loginventario.f_modelorecepcionproducto_farmacia (
  p_iddocumento numeric,
  p_monedaalternativa numeric,
  p_monedacontable numeric,
  p_idestructura numeric
)
RETURNS TABLE (
  codigo varchar,
  categoria varchar,
  nombreproducto varchar,
  unidadmedida varchar,
  cantidadproducto numeric,
  preciocontable numeric,
  preciocontablecant numeric,
  existenciaactual numeric,
  asrecargodescuento numeric,
  preciounitariototal numeric,
  precioalternativo numeric,
  totalprecioalternativo numeric,
  monedaalternativa varchar,
  monedacontable varchar,
  cantidadporfactura numeric,
  idmovimiento numeric,
  importecup numeric,
  importecuc numeric,
  ubicacion text,
  codigoproducto varchar,
  denomproducto varchar,
  ordeninsercion numeric,
  codigofabricante varchar,
  naturalezaprod varchar,
  ordenproducto numeric,
  idindicador numeric,
  precioventa numeric
) AS
$body$
declare
all_rec mod_loginventario.td_recepcionproducto_farmacia;
begin
--for all_rec in
return query (
select distinct
coalesce(ni.numeropieza, ni.codigo) as codigo,
nc.denominacion as categoria,
ni.denominacion as nombreproducto,
dum.abreviaturaunidadmedida as unidadmedida,
coalesce(dm.cantidad,0) as cantidadproducto,
coalesce(round(dm.preciocontable,6),0) as preciocontable,
coalesce(round((dm.preciocontable * dm.cantidad),2),0) as preciocontablecant,
dm.existenciaactual as saldo,
coalesce(round(dm.recargodescuento,2),0) as recargodescuento,
coalesce(round(dm.preciocontable,6),0) + coalesce(round(dm.recargodescuento / (case when dm.cantidad = 0 then 1 else dm.cantidad end),6),0) as preciounitariototal,
coalesce(round(dm.precioalternativo,6),0) as precioalternativo,
coalesce(round((dm.precioalternativo * dm.cantidad + dm.recargodescuentoalt),2),0) as totalprecioalternativo,
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedaalternativa) as monedaalternativa,           
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedacontable) as monedacontable,
dmr.cantidad as cantidadporfactura,
dm.idmovimiento as idmovimiento,
round((select sum(round(ddmv.importecontable,2)) from mod_logistica.dat_movimiento ddmv where ddmv.iddocumento = p_iddocumento),2) as importecup, 
round((select sum(round(ddmv.importealternativo,2)) from mod_logistica.dat_movimiento ddmv where ddmv.iddocumento = p_iddocumento),2) as importecuc,
(SELECT concat(eup.descripcion , ' ', (case when eup2.descripcion is null then ' ' else eup2.descripcion end), ' ' , deu.descripcion) FROM mod_logubicacion.dat_ubicacionproducto dup
INNER JOIN mod_logubicacion.dat_estructuraubicacion deu on (deu.idestructuraubicacion = dup.idubicacion)
LEFT JOIN mod_logubicacion.dat_estructuraubicacion eup2 on (eup2.idestructuraubicacion = deu.idpadre and eup2.idestructuraubicacion <> eup2.idpadre)
LEFT JOIN mod_logubicacion.dat_estructuraubicacion eup on (eup.idarea = deu.idarea and eup.idestructuraubicacion = eup.idpadre)
WHERE dup.idproducto = dp.idproducto limit 1) as ubicacion,
(case when conf.ordenproducto = 1 then ni.codigo else null end) as codigoproducto,
(case when conf.ordenproducto = 2 then ni.denominacion else null end) as denomproducto,
(case when conf.ordenproducto = 3 then dm.idmovimiento else null end) as ordeninsercion,
(case when conf.ordenproducto = 4 then ni.numeropieza else null end) as codigofabricante,
(case when conf.ordenproducto = 5 then nat.denominacion else null end) as naturalezaprod,
conf.ordenproducto,
ni.idindicador,
precio_matriz.precioventa
from mod_logistica.dat_movimiento dm
left join mod_loginventario.dat_movrecepcion dmr on dmr.idmovimiento = dm.idmovimiento
left join mod_datosmaestros.nom_unidadmedida dum on dum.idunidadmedida = dm.idunidadmedida
left join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto 
left join mod_logistica.nom_categoria nc on nc.idcategoria = dp.idcategoria
left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
left join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = ni.idnaturaleza
left join mod_loginventario.conf_inventario conf on conf.idestructuracomun = dp.idestructuracomun
left join (select * from mod_loginventario.f_obtener_preciopublico()) as precio_matriz on (precio_matriz.idindicador = ni.idindicador)
where dm.iddocumento =  p_iddocumento and precio_matriz.idestructuracomun = p_idestructura

--order by dm.idmovimiento
order by 
case when conf.ordenproducto = 1 then ni.codigo end,
case when conf.ordenproducto = 2 then ni.denominacion end,
case when conf.ordenproducto = 3 then dm.idmovimiento end,
case when conf.ordenproducto = 4 then ni.numeropieza end,
case when conf.ordenproducto = 5 then nat.denominacion end
);	
--loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION mod_loginventario.f_modelorecepcionproducto_farmacia (p_iddocumento numeric, p_monedaalternativa numeric, p_monedacontable numeric, p_idestructura numeric)
  OWNER TO zeolides;