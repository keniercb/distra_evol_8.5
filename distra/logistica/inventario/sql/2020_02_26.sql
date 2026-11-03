CREATE OR REPLACE FUNCTION mod_loginventario.f_modelohojadeinventarioproducto (
  p_iddocumento numeric,
  p_monedaalternativa numeric,
  p_monedacontable numeric
)
RETURNS SETOF mod_loginventario.td_modelohojadeinventarioproducto AS
$body$
declare
  v_rec mod_loginventario.td_modelohojadeinventarioproducto;
begin
for v_rec in
select distinct
dup.idubicacion as idubicacion,
deup.descripcion as ubicacion,
'',--(select * from mod_loginventario.f_obtenerubicompleta(deup.idestructuraubicacion,deup.nivel)) as ubicacioncompleta,
dp.idproducto,
(case when (ni.numeropieza is null or ni.numeropieza = '') then ni.codigo else ni.numeropieza END),
ni.denominacion as denomprod,
dum.abreviaturaunidadmedida as um,
coalesce(dup.cantidad,0) as cantidadubicada,
dp.cantidad as existencia,
case when dm.cantidad < dm.existenciaactual then dm.existenciaactual - dm.cantidad end as cantidadfaltante,
case when dm.cantidad < dm.existenciaactual then dm.preciopromedio * (dm.existenciaactual - dm.cantidad) end as valorfaltantes,
case when dm.cantidad > dm.existenciaactual then dm.existenciaactual - dm.existenciaactual end as cantidadsobrante,
case when dm.cantidad > dm.existenciaactual then dm.preciopromedio * (dm.cantidad - dm.existenciaactual) end as valorsobrante,
dp.precio,
ni.numeropieza,
dm.cantidad as conteo,
coalesce(dm.importecontable,0),
coalesce(dm.precioalternativo,0),
0,
(select nc.concatcta from mod_contabilidad.nom_cuenta nc
inner join mod_logistica.nom_clasificacioncontable ncc on ncc.idcuenta = nc.idcuenta
where ncc.idclasificacioncontable = dp.idclasificacioncontable) as cuenta,

(select nc.concatcta from mod_contabilidad.nom_cuenta nc
inner join mod_logistica.nom_clasificacioncontable ncc on ncc.idcuentaalt = nc.idcuenta
where ncc.idclasificacioncontable = dp.idclasificacioncontable) as cuentaalt,
round((coalesce(dp.cantidad,0) * coalesce(dp.precio,0)),2) as importe,
dp.precioalternativo as preciopromedioalternativo,  dp.idclasificacioncontable, dm.idmovimiento--, dm.idmovimiento
from mod_logistica.dat_movimiento dm
left join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
left join mod_datosmaestros.nom_unidadmedida dum on dum.idunidadmedida = ni.idumedida
left join mod_logubicacion.dat_ubicacionproducto dup on dup.idproducto = dp.idproducto
left join mod_logubicacion.dat_estructuraubicacion deup on deup.idestructuraubicacion = dup.idubicacion
where dm.iddocumento = p_iddocumento
order by dp.idclasificacioncontable, dm.idmovimiento
loop return next v_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;


ALTER TYPE mod_loginventario.td_modelohojadeinventario
  ADD ATTRIBUTE reup VARCHAR;
  
  
CREATE OR REPLACE FUNCTION mod_loginventario.f_modelohojadeinventario (
  p_iddocumento numeric,
  p_monedaalternativa numeric,
  p_monedacontable numeric
)
RETURNS SETOF mod_loginventario.td_modelohojadeinventario AS
$body$
declare
  v_rec  mod_loginventario.td_modelohojadeinventario;
begin
for v_rec in
select distinct
(case when ci.idestructuracomun = ci.idpadre then (case when ci.esminfar = 0 then cast(dd.nrodoc as varchar) when ci.esminfar = 1 then cast(dd.nrodoc as varchar) end)
     when ci.idestructuracomun <> ci.idpadre then (case when ci.esminfar = 0 then cast(dd.nrodoc as varchar) when ci.esminfar = 1 then btrim(concat(dd.nrodoc,'-',de.codigo,'-',deop.codigo),'-') end)
end) as numerodocumento,

dd.fechacontable,
btrim(concat(deop.codigo,'-',deop.denominacion),'-') as deposito,
su.nombreusuario as creadopor,
(select string_agg(cast(ddi.nrodoc as varchar),',') from mod_loginventario.dat_ajuste da
inner join mod_logistica.dat_documento ddi on ddi.iddocumento = da.idajuste
where da.idinventario = dd.iddocumento limit 1) as nroajuste,
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedaalternativa,           
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedacontable,
ndp.denominacion,
dd.estado,
dd.numeroref,
(case when ci.idestructuracomun = ci.idpadre then (case when ci.esminfar = 0 then btrim(concat(coalesce(de.codigo, deop1.codigo),'-',coalesce(de.denominacion, deop1.denominacion)),'-') when ci.esminfar = 1 then coalesce(de.codigo, deop1.codigo) end)
     when ci.idestructuracomun <> ci.idpadre then (case when ci.esminfar = 0 then btrim(concat(coalesce(de.codigo, deop1.codigo),'-',coalesce(de.denominacion, deop1.denominacion)),'-') when ci.esminfar = 1 then (select codigo from mod_estructuracomp.dat_estructura where idestructura = ci.idpadre limit 1) end)
end) as entidad,

(select btrim(concat(b.nombre,' ',b.snombre,' ',b.papel,' ',b.sapel))
from mod_seguridad.seg_usuario a 
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
where a.idusuario = dd.idusuario) as nombrepersona,

(select f.denominacion from mod_seguridad.seg_usuario a
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
inner join mod_persona.dat_personaentidad c on c.idpersona = b.idpersona and (c.fhasta > now() or c.fhasta is null )
inner join mod_persona.dat_situacionlaboral d on d.idpersonaentidad = c.idpersonaentidad and (d.fhasta > now() or d.fhasta is null)
inner join mod_estructuracomp.dat_cargo e on e.idcargo = d.idcargo
inner join mod_estructuracomp.nom_cargo f on f.idnomcargo = e.idnomcargo
where a.idusuario = dd.idusuario) as cargopersona,

(select btrim(concat(b.nombre,' ',b.snombre,' ',b.papel,' ',b.sapel))
from mod_seguridad.seg_usuario a 
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
where a.idusuario = dd.aprobadopor) as nombrepersonaprobar,

(select f.denominacion from mod_seguridad.seg_usuario a
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
inner join mod_persona.dat_personaentidad c on c.idpersona = b.idpersona and (c.fhasta > now() or c.fhasta is null )
inner join mod_persona.dat_situacionlaboral d on d.idpersonaentidad = c.idpersonaentidad and (d.fhasta > now() or d.fhasta is null)
inner join mod_estructuracomp.dat_cargo e on e.idcargo = d.idcargo
inner join mod_estructuracomp.nom_cargo f on f.idnomcargo = e.idnomcargo
where a.idusuario = dd.aprobadopor) as cargopersonaprobar,
dp.idproducto,
dd.observaciones,
i.urllogo as logo,(case when de.idestructura is not null then de.codigo else deop1.codigo END),
dd.numeroref, dm.idmovimiento
from mod_logistica.dat_documento dd
inner join mod_loginventario.dat_inventario di on di.idinventario = dd.iddocumento
inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
inner join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = dd.idestructuracomun
inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
inner join mod_loginventario.conf_inventario ci on ci.idestructuracomun = des.idestructuracomun
left join mod_estructuracomp.dat_estructura de on de.idestructura = des.idestructuracomun
left join mod_estructuracomp.dat_estructuraop deop1 on deop1.idestructuraop = des.idestructuracomun
left join mod_seguridad.seg_usuario su on su.idusuario = dd.idusuario
left join mod_logistica.dat_movimiento dm on dd.iddocumento = dm.iddocumento
left join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto 
left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
left join mod_datosmaestros.nom_unidadmedida dum on dum.idunidadmedida = ni.idumedida
left join mod_logistica.conf_general i on i.idestructura = des.idestructuracomun
left join mod_logubicacion.dat_ubicacionproducto dup on dup.idproducto = dp.idproducto
left join  mod_logubicacion.dat_estructuraubicacion deup on deup.idestructuraubicacion = dup.idubicacion
where dd.iddocumento = $1 ORDER BY dm.idmovimiento
limit 1
loop 
return next v_rec; 
end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

ALTER TYPE mod_loginventario.td_modelohojadeinventarioproducto
  ADD ATTRIBUTE idclasificacioncontable NUMERIC(19,0);