CREATE OR REPLACE VIEW mod_logistica.v_movimiento(
    idindicador,
    idproducto,
    idmovimiento,
    iddocumento,
    idunidadmedida,
    codigoproducto,
    nombreproducto,
    naturaleza,
    disponible,
    existencia,
    preciocontable,
    precioalternativo,
    importetotalcup,
    importetotalcuc,
    cuentacontable,
    cuentaalternativa,
    categoria,
    deposito,
    codeposito,
    ubicacion,
    unidadmedidamovimiento,
    cantidadmovimiento,
    preciocontablemovimiento,
    importetotalmovimiento,
    existenciaactualmovimiento,
    recargodescuentomovimiento,
    preciounitariototalmovimiento,
    precioalternativomovimiento,
    importetotalaltmovimiento,
    signo,
    cronologia,
    ubicacioncompleta,
    unidadmedidaproducto)
AS
  SELECT DISTINCT dp.idindicador,
         dp.idproducto,
         dm.idmovimiento,
         dm.iddocumento,
         dm.idunidadmedida,
         dp.codigoproducto,
         dp.nombreproducto,
         dp.naturaleza,
         dp.disponible,
         dp.existencia,
         dp.preciocontable,
         dp.precioalternativo,
         dp.importetotalcup,
         dp.importetotalcuc,
         dp.cuentacontable,
         dp.cuentaalternativa,
         dp.categoria,
         dp.deposito,
         dp.codeposito,
         dp.ubicacion,
         dum.abreviaturaunidadmedida AS unidadmedidamovimiento,
         COALESCE(dm.cantidad, 0::numeric) AS cantidadmovimiento,
         COALESCE(round(dm.preciocontable, 6), 0::numeric) AS preciocontablemovimiento,
         COALESCE(round(dm.importecontable, 2), 0::numeric) AS importetotalmovimiento,
         dm.existenciaactual AS existenciaactualmovimiento,
         COALESCE(round(dm.recargodescuento, 2), 0::numeric) AS recargodescuentomovimiento,
         COALESCE(round(dm.preciocontable, 6), 0::numeric) AS preciounitariototalmovimiento,
         COALESCE(round(dm.precioalternativo, 6), 0::numeric) AS precioalternativomovimiento,
         COALESCE(round(dm.precioalternativo * dm.cantidad, 2), 0::numeric) AS importetotalaltmovimiento,
         dm.signo,
         dm.cronologia,
         (
           SELECT f_obtenerubicompleta.f_obtenerubicompleta
           FROM mod_loginventario.f_obtenerubicompleta(deup.idestructuraubicacion, deup.nivel) f_obtenerubicompleta(f_obtenerubicompleta)
         ) AS ubicacioncompleta,
         dp.unidadmedidaproducto
  FROM mod_logistica.dat_movimiento dm
       JOIN mod_logistica.v_producto dp ON dp.idproducto = dm.idproducto
       LEFT JOIN mod_datosmaestros.nom_unidadmedida dum ON dum.idunidadmedida = dm.idunidadmedida
       LEFT JOIN mod_logubicacion.dat_movubicacion dmu ON dm.idmovimiento = dmu.idmovimiento
       LEFT JOIN mod_logubicacion.dat_estructuraubicacion deup ON deup.idestructuraubicacion = dmu.idestructuraubicacion;

CREATE OR REPLACE FUNCTION mod_loginventario.f_reclentomov (
  p_idestructuraop varchar,
  p_fechafin date,
  p_desde numeric,
  p_hasta numeric,
  p_nombreproducto varchar,
  p_idestructuracomun numeric,
  p_idsubsistema numeric,
  p_idnaturaleza numeric
)
RETURNS SETOF mod_loginventario.td_reclentomov AS
$body$
declare
v_result mod_loginventario.td_reclentomov;
v_rec record;
v_recent record;
v_id record;
v_fechafin date;
begin
if p_fechafin is not null then
v_fechafin = p_fechafin;
else  v_fechafin = now(); end if;

create temp table datos (
idproducto numeric(19,0),
codigoproducto varchar(255),
categoria varchar(255),
denomproducto varchar(255),
fechamov date,
cantidad numeric(25,6),
operacion varchar(255),
existencia numeric(25,6),
disponible numeric(25,6),
envejecimiento numeric(19,0),
deposito varchar(255),
almacen varchar(255),
logo VARCHAR);

for v_rec in 
select distinct p.idproducto, np.numeropieza, np.denominacion as descripcion, p.cantidad, p.cantidad - coalesce((select sum(dcc.cantidad) 
from mod_logistica.dat_cantidadcomprometida dcc 
where dcc.idproducto = p.idproducto and dcc.estado <> 2),0) as disponible, op.denominacion as den, e.denominacion,
ii.urllogo as logo,ncp.denominacion as categoria
from mod_logistica.dat_producto p 
left join mod_logistica.nom_categoria ncp on p.idcategoria = ncp.idcategoria
inner join mod_datosmaestros.nom_indicador np on p.idindicador = np.idindicador 
inner join mod_estructuracomp.v_dametodasestructuras op on op.idestructura = p.idestructura 
inner join mod_estructuracomp.nom_filaestruc f on f.idfila = op.idestructura
inner join mod_estructuracomp.v_dametodasestructuras e on e.idestructura = f.idpadre
left join mod_logistica.conf_general ii on ii.idestructura = e.idestructura    
where p.idproducto <> 0    
and (p.idestructura = any(cast(p_idestructuraop as numeric[])))
and (case when p_nombreproducto is not null then (np.denominacion ilike '%' || p_nombreproducto || '%') else true end)
and (case when p_idnaturaleza is not null then np.idnaturaleza = p_idnaturaleza else true end)
and p.cantidad > 0
and p.cronologia > 0 	    
loop    
insert into datos (idproducto, codigoproducto, denomproducto, fechamov, cantidad, operacion, existencia, disponible, envejecimiento, deposito, almacen, logo, categoria)
values (v_rec.idproducto, v_rec.numeropieza, v_rec.descripcion, null, null, null, v_rec.cantidad, v_rec.disponible, null, v_rec.den, v_rec.denominacion, v_rec.logo, v_rec.categoria);
end loop;

for v_id in
select d.idproducto from datos d
loop    
select d.fechacontable, 
m.cantidad, 
ndoc.denominacion as operacion, 
m.idproducto as id,
(cast(NOW() as date) - d.fechacontable) as envejecimiento
from mod_logistica.dat_documento d
inner join mod_logistica.dat_movimiento m on m.iddocumento = d.iddocumento
inner join mod_datosmaestros.dat_documentoprim dp on d.iddoc = dp.iddoc
inner join mod_datosmaestros.nom_docprim ndoc on ndoc.iddocumentos = dp.iddocumentos  
where m.idproducto = v_id.idproducto
and ndoc.abreviatura in('aperturaLog','conduceLog','facturaLog','valeLog')    
and d.estado in ('4')
and d.cronologia > 0
order by d.cronologia desc limit 1
into v_rec;       
update datos set 
fechamov = v_rec.fechacontable,
cantidad = v_rec.cantidad,
operacion =  v_rec.operacion,
envejecimiento = v_rec.envejecimiento
where v_rec.id = idproducto; 


end loop;
for v_result in 
select d.idproducto, codigoproducto, denomproducto, fechamov, cantidad, operacion, existencia, disponible, envejecimiento, deposito, almacen, d.logo, d.categoria 
from datos d
where (d.fechamov <= v_fechafin) 
and (CASE WHEN p_desde IS NOT NULL AND p_hasta IS NOT NULL THEN d.envejecimiento >= p_desde AND d.envejecimiento <= p_hasta --lento movimiento
 		WHEN p_desde IS NOT NULL THEN d.envejecimiento >= p_desde --ocioso
         WHEN p_hasta IS NOT NULL THEN d.envejecimiento >= p_hasta ELSE true END) --ocioso
order by d.codigoproducto 
loop
return next v_result; end loop; 
drop table datos;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

ALTER FUNCTION mod_loginventario.f_reclentomov (p_idestructuraop varchar, p_fechafin date, p_desde numeric, p_hasta numeric, p_nombreproducto varchar, p_idestructuracomun numeric, p_idsubsistema numeric, p_idnaturaleza numeric)
  OWNER TO zeolides;