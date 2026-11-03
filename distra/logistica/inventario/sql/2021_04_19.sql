ALTER TYPE mod_loginventario.td_modelohojadeinventario
  DROP ATTRIBUTE ubicacion,
  DROP ATTRIBUTE ubicacioncompleta,
  DROP ATTRIBUTE idproducto,
  DROP ATTRIBUTE codigo,
  DROP ATTRIBUTE denomprod,
  DROP ATTRIBUTE um,
  DROP ATTRIBUTE cantidadubicada,
  DROP ATTRIBUTE existencia,
  DROP ATTRIBUTE cantfaltantes,
  DROP ATTRIBUTE valorfaltantes,
  DROP ATTRIBUTE cantsobrante,
  DROP ATTRIBUTE valorsobrante,
  DROP ATTRIBUTE precio,
  DROP ATTRIBUTE numeropieza,
  DROP ATTRIBUTE conteo,
  DROP ATTRIBUTE importecontable,
  DROP ATTRIBUTE precioalternativo,
  DROP ATTRIBUTE importealternativo,
  DROP ATTRIBUTE cuenta,
  DROP ATTRIBUTE cuentaalt,
  DROP ATTRIBUTE importeexistencia;
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
where da.idinventario = dd.iddocumento) as nroajuste,
ndp.denominacion,
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedaalternativa) as monedaalternativa,           
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedacontable) as monedacontable,
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
dp.idproducto
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
left join mod_logistica.conf_general i on i.idestructura = de.idestructura
left join mod_logubicacion.dat_ubicacionproducto dup on dup.idproducto = dp.idproducto
left join  mod_logubicacion.dat_estructuraubicacion deup on deup.idestructuraubicacion = dup.idubicacion
where dd.iddocumento = p_iddocumento
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
PARALLEL UNSAFE
COST 100 ROWS 1000;  

CREATE OR REPLACE FUNCTION mod_loginventario.f_listardocsalida (
  p_idestructuraop numeric,
  p_estado numeric,
  p_aprobadopor numeric,
  p_creadopor numeric,
  p_fechainicio date,
  p_fechafin date,
  p_idestructura numeric
)
RETURNS SETOF mod_loginventario.td_listardocsalida AS
$body$
DECLARE
  all_rec mod_loginventario.td_listardocsalida;
BEGIN
for all_rec in
select
(case when ci.idestructuracomun = ci.idpadre then (case when ci.esminfar = 0 then btrim(concat(des.codigo,'-',des.denominacion),'-') when ci.esminfar = 1 then des.codigo end)
     when ci.idestructuracomun <> ci.idpadre then (case when ci.esminfar = 0 then btrim(concat(des.codigo,'-',des.denominacion),'-') when ci.esminfar = 1 then (select codigo from mod_estructuracomp.dat_estructura where idestructura = ci.idpadre limit 1) end)
end) as entidad,

(case when ci.idestructuracomun = ci.idpadre then (case when ci.esminfar = 0 then cast(dd.nrodoc as varchar) when ci.esminfar = 1 then cast(dd.nrodoc as varchar) end)
     when ci.idestructuracomun <> ci.idpadre then (case when ci.esminfar = 0 then cast(dd.nrodoc as varchar) when ci.esminfar = 1 then btrim(concat(dd.nrodoc,'-',des.codigo,'-',desop.codigo),'-') end)
end) as numerodocumento,

dd.fechacontable,
btrim(concat(desop.codigo,'-',desop.denominacion),'-'),
(select (case when ddc.tipocliente = 1 then (coalesce((case when (btrim(concat(ncp.codigo,'-',ncp.nombre),'-') <> '' ) then btrim(concat(ncp.codigo,'-',ncp.nombre),'-') end),
  coalesce((case when (btrim(concat(de.codigo,'-',de.denominacion),'-') <> '') then btrim(concat(de.codigo,'-',de.denominacion),'-') end),
  btrim(concat(dp.nombre,' ',dp.snombre,' ',dp.papel,' ',dp.sapel)))))

      when ddc.tipocliente = 2 then (btrim(concat(ncc.codigocentrogrupo,'-',ncc.descripcioncentrogrupo),'-'))
      when ddc.tipocliente = 3 then (btrim(concat(deop.codigo,'-',deop.denominacion),'-')) end)) as entregar,
case when dd.estado = 1 then 'Elaboración'
     when dd.estado = 2 then 'Preparado'
     when dd.estado = 3 then 'Aprobado'
     when dd.estado = 4 then 'Contabilizado'
else 'Sin Estado' end as estado,
su.nombreusuario as creadopor,
(select count(dp.idproducto) from mod_logistica.dat_producto dp inner join mod_logistica.dat_movimiento dm on dm.idproducto = dp.idproducto where dm.iddocumento = dd.iddocumento) as cantidad,
su1.nombreusuario,
ndp.denominacion as tipodocumento,
i.urllogo,
(select min(ddd.fechacontable) 
from mod_logistica.dat_documento ddd
inner join mod_logistica.dat_entrega ddisd on ddisd.iddocumento = ddd.iddocumento  
where ddd.idestructuracomun = $1) as fechaminima,

(select max(ddd.fechacontable) 
from mod_logistica.dat_documento ddd
inner join mod_logistica.dat_entrega ddisd on ddisd.iddocumento = ddd.iddocumento 
where ddd.idestructuracomun = $1) as fechamaxima,
desop.codigo,
(case when (select dea.estado
from mod_estructuracomp.nom_filaestruc nf
inner join mod_logistica.dat_estadoalmacen dea on dea.iddeposito = nf.idfila
where nf.idfila = desop.idestructuraop) = 1 then 'Abierto' else 'Cerrado' end) as estadoop,
dd.numeroref
from mod_logistica.dat_documento dd 
left join mod_logistica.dat_documentotransporte ddt on dd.iddocumento = ddt.iddocumento 
inner join mod_logistica.dat_entrega den on den.iddocumento = dd.iddocumento
inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc

inner join mod_logistica.dat_documentocliente ddc on ddc.iddocumento = dd.iddocumento 
left join mod_datosmaestros.nom_clientesproveedor ncp on ddc.idcliente = ncp.idclientesproveedores 
left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = ncp.idestructura
left join mod_contabilidadcosto.nom_centrocosto ncc on ncc.idcentrogrupo = ddc.idcliente
left join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = ddc.idcliente
left join mod_persona.dat_persona dp on dp.idpersona = ncp.idpersona

inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
inner join mod_datosmaestros.dat_estructurasubsist desu on desu.idestructurasubsist = ddp.idestructurasubsist
inner join mod_estructuracomp.v_dametodasestructuras des on des.idestructura = desu.idestructuracomun 
inner join mod_logistica.conf_general i on i.idestructura = des.idestructura
left join mod_estructuracomp.dat_estructuraop desop on desop.idestructuraop = dd.idestructuracomun
inner join mod_seguridad.seg_usuario su on su.idusuario = dd.idusuario
left join mod_seguridad.seg_usuario su1 on su1.idusuario = dd.aprobadopor
inner join mod_logistica.dat_documentopadre ddpad on dd.iddocumento = ddpad.iddocumento 
inner join mod_logistica.dat_documento ddo on ddo.iddocumento = ddpad.idpadre
inner join mod_loginventario.conf_inventario ci on ci.idestructuracomun = desu.idestructuracomun
where dd.idestructuracomun = p_idestructuraop and des.idestructura = p_idestructura and dd.iddoc in(select ddp1.iddoc from mod_datosmaestros.dat_documentoprim ddp1 
     inner join mod_datosmaestros.nom_docprim ndp1 on ndp1.iddocumentos = ddp1.iddocumentos
     inner join mod_datosmaestros.dat_estructurasubsist desu1 on desu1.idestructurasubsist = ddp1.idestructurasubsist
   where desu1.idestructuracomun = p_idestructura)
AND ( CASE WHEN p_estado is not null THEN dd.estado = p_estado else dd.estado in(1,2,3,4) END)
AND ( CASE WHEN p_creadopor is not null THEN su.idusuario = p_creadopor else true END)
AND ( CASE WHEN p_aprobadopor is not null THEN su1.idusuario = p_aprobadopor else true END)
AND ( CASE WHEN p_fechainicio is not null THEN dd.fechacontable >= p_fechainicio else true END)
AND ( CASE WHEN p_fechafin is not null THEN dd.fechacontable <= p_fechafin else true END)
order by dd.iddocumento desc
loop
  return next all_rec;
end loop;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;