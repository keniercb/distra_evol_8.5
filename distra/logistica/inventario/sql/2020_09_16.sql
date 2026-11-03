ALTER TYPE mod_loginventario.td_ajuste
  ADD ATTRIBUTE preciocontableant NUMERIC(25,6),
  ADD ATTRIBUTE precioalternativoant NUMERIC(25,6);



CREATE OR REPLACE FUNCTION mod_loginventario.f_modeloajuste (
  p_iddocumento numeric,
  p_monedaalternativa numeric,
  p_monedacontable numeric
)
RETURNS SETOF mod_loginventario.td_ajuste AS
$body$
declare
all_rec mod_loginventario.td_ajuste;
begin 
for all_rec in
select distinct 
(case when ci.idestructuracomun = ci.idpadre then (case when ci.esminfar = 0 then btrim((de.denominacion),'-') when ci.esminfar = 1 then de.codigo end)
     when ci.idestructuracomun <> ci.idpadre then (case when ci.esminfar = 0 then btrim((de.denominacion),'-') when ci.esminfar = 1 then (select codigo from mod_estructuracomp.v_dametodasestructuras where idestructura = ci.idpadre) end)
end) as entidad,
 
btrim(concat(deop.codigo,'-',deop.denominacion),'-'),

(case when ci.idestructuracomun = ci.idpadre then (case when ci.esminfar = 0 then cast(dd.nrodoc as varchar) when ci.esminfar = 1 then cast(dd.nrodoc as varchar) end)
     when ci.idestructuracomun <> ci.idpadre then (case when ci.esminfar = 0 then cast(dd.nrodoc as varchar) when ci.esminfar = 1 then btrim(concat(dd.nrodoc,'-',de.codigo,'-',deop.codigo),'-') end)
end) as numerodocumento,

dd.fechacontable as fechadocumento,
nop.denominacion as motivo,
(case when (ni.numeropieza is null or ni.numeropieza = '') then ni.codigo else ni.numeropieza END),
nc.denominacion as categoria,
ni.numeropieza,
ni.denominacion as nombreproducto,
dum.abreviaturaunidadmedida as unidadmedida,
coalesce(dm.cantidad,0) as cantidadproducto,
coalesce(dm.preciocontable,0),
coalesce(dm.importecontable,0),
nes.denespecialidad,
dd.observaciones,
i.urllogo,
ndp.denominacion,
de.codigo,
COALESCE(dm.precioalternativo,0),
COALESCE(dm.importealternativo,0),
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedaalternativa,           
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedacontable,
(select concat(nc.concatcta,' ',nc.descripcion) from mod_contabilidad.nom_cuenta nc 
inner join mod_logistica.nom_clasificacioncontable ncc on ncc.idcuenta = nc.idcuenta 
where ncc.idclasificacioncontable = dp.idclasificacioncontable limit 1) as cuenta,

(select concat(nc.concatcta,' ',nc.descripcion) from mod_contabilidad.nom_cuenta nc 
inner join mod_logistica.nom_clasificacioncontable ncc on ncc.idcuentaalt = nc.idcuenta 
where ncc.idclasificacioncontable = dp.idclasificacioncontable limit 1) as cuentaalt,
coalesce(dp.cantidad,0) as existencia,
( case when nop.codigooperacion in ('OPER_INV_SOBRANTE') then coalesce(dp.cantidad,0) + coalesce(dm.cantidad,0)
       when nop.codigooperacion in ('OPER_INV_FALTANTE','OPER_INV_ROTURA','OPER_INV_MERMA') then coalesce(dp.cantidad,0) - coalesce(dm.cantidad,0)
       else coalesce(dp.cantidad,0)
       end) as existenciainventario,
dd.estado,
dd.numeroref,

(select btrim(concat(b.nombre,' ',b.snombre,' ',b.papel,' ',b.sapel))
from mod_seguridad.seg_usuario a 
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
where a.idusuario = dd.idusuario limit 1) as nombrepersona,

(select f.denominacion from mod_seguridad.seg_usuario a
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
inner join mod_persona.dat_personaentidad c on c.idpersona = b.idpersona and (c.fhasta > now() or c.fhasta is null )
inner join mod_persona.dat_situacionlaboral d on d.idpersonaentidad = c.idpersonaentidad and (d.fhasta > now() or d.fhasta is null)
inner join mod_estructuracomp.dat_cargo e on e.idcargo = d.idcargo
inner join mod_estructuracomp.nom_cargo f on f.idnomcargo = e.idnomcargo
where a.idusuario = dd.idusuario limit 1) as cargopersona,

(select btrim(concat(b.nombre,' ',b.snombre,' ',b.papel,' ',b.sapel))
from mod_seguridad.seg_usuario a 
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
where a.idusuario = dd.aprobadopor limit 1) as nombrepersonaprobar,

(select f.denominacion from mod_seguridad.seg_usuario a
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
inner join mod_persona.dat_personaentidad c on c.idpersona = b.idpersona and (c.fhasta > now() or c.fhasta is null )
inner join mod_persona.dat_situacionlaboral d on d.idpersonaentidad = c.idpersonaentidad and (d.fhasta > now() or d.fhasta is null)
inner join mod_estructuracomp.dat_cargo e on e.idcargo = d.idcargo
inner join mod_estructuracomp.nom_cargo f on f.idnomcargo = e.idnomcargo
where a.idusuario = dd.aprobadopor limit 1) as cargopersonaprobar,

(select btrim(concat(b.nombre,' ',b.snombre,' ',b.papel,' ',b.sapel))
from mod_seguridad.seg_usuario a 
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
where a.idusuario = daj.contabilizadopor limit 1) as nombrepersonacontab,

(select f.denominacion from mod_seguridad.seg_usuario a
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
inner join mod_persona.dat_personaentidad c on c.idpersona = b.idpersona and (c.fhasta > now() or c.fhasta is null )
inner join mod_persona.dat_situacionlaboral d on d.idpersonaentidad = c.idpersonaentidad and (d.fhasta > now() or d.fhasta is null)
inner join mod_estructuracomp.dat_cargo e on e.idcargo = d.idcargo
inner join mod_estructuracomp.nom_cargo f on f.idnomcargo = e.idnomcargo
where a.idusuario = daj.contabilizadopor limit 1) as cargopersonacontab,


coalesce((select dm1.preciocontable from mod_logistica.dat_movimiento dm1 where dm1.idproducto = dm.idproducto and dm1.cronologia = 
(select max(mov.cronologia) from mod_logistica.dat_movimiento mov where mov.idproducto = dm.idproducto and mov.cronologia < dm.cronologia)),0) as preciocontableant,

coalesce((select dm1.precioalternativo from mod_logistica.dat_movimiento dm1 where dm1.idproducto = dm.idproducto and dm1.cronologia = 
(select max(mov.cronologia) from mod_logistica.dat_movimiento mov where mov.idproducto = dm.idproducto and mov.cronologia < dm.cronologia)),0) as precioalterant

     
from mod_logistica.dat_documento dd 
inner join mod_datosmaestros.dat_documentoprim dpr on dpr.iddoc = dd.iddoc
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = dpr.iddocumentos
inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = dpr.idestructurasubsist
inner join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = des.idestructuracomun
inner join mod_loginventario.conf_inventario ci on ci.idestructuracomun = des.idestructuracomun
inner join mod_estructuracomp.nom_filaestruc nf on nf.idfila = dd.idestructuracomun
inner join mod_estructuracomp.v_dametodasestructuras deop on deop.idestructura = nf.idfila
inner join mod_loginventario.dat_ajuste daj on daj.idajuste = dd.iddocumento
left join mod_datosmaestros.nom_especialidad nes on nes.idespecialidad = dd.idespecialidad
left join mod_logistica.dat_movimiento dm on dd.iddocumento = dm.iddocumento
left join mod_datosmaestros.nom_unidadmedida dum on dum.idunidadmedida = dm.idunidadmedida
left join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto 
left join mod_logistica.nom_categoria nc on nc.idcategoria = dp.idcategoria
left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
left join mod_datosmaestros.nom_operacion nop on nop.idnomoperaciones = daj.idoperacion
left join mod_logistica.conf_general i on i.idestructura = de.idestructura
where dd.iddocumento = $1
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;