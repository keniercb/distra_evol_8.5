/*Vale entrega*/

ALTER TYPE mod_loginventario.td_modelovalentrega
  ADD ATTRIBUTE operacion VARCHAR,
  ADD ATTRIBUTE ubicacion VARCHAR;


CREATE OR REPLACE FUNCTION mod_loginventario.f_modelovalentrega (
  p_iddocumento numeric,
  p_monedaalternativa numeric,
  p_monedacontable numeric
)
RETURNS SETOF mod_loginventario.td_modelovalentrega AS
$body$
declare
  all_rec mod_loginventario.td_modelovalentrega;
begin
for all_rec in
select distinct
de.denominacion as entidad,

(case when ci.idestructuracomun = ci.idpadre then (case when ci.esminfar = 0 then cast(dd.nrodoc as varchar) when ci.esminfar = 1 then cast(dd.nrodoc as varchar) end)
     when ci.idestructuracomun <> ci.idpadre then (case when ci.esminfar = 0 then cast(dd.nrodoc as varchar) when ci.esminfar = 1 then btrim(concat(dd.nrodoc,'-',de.codigo,'-',deop.codigo),'-') end)
end) as numerodocumento, 

dd.fechacontable,
btrim(concat(deop.codigo,'-',deop.denominacion ),'-') as deposito,
btrim(concat(ncc.codigocentrogrupo,'-',ncc.descripcioncentrogrupo),'-'),
su1.nombreusuario as aprobadopor,
(case when (ni.numeropieza is null or ni.numeropieza = '') then ni.codigo else ni.numeropieza END),
ni.denominacion,
num.abreviaturaunidadmedida as unidadmedida,
coalesce(dm.cantidad,0) as disponible,
coalesce(dm.preciocontable,0) as precio,
coalesce(round(dm.importecontable,2),0) as importe,
--coalesce(dp.cantidad,0) as existencia,
coalesce(dm.existenciaactual,0) as existencia,
i.urllogo,
--0,_dd.nrodoc,
_dd.nrodoc,
now(),--_dd.fechacontable,
_ndp.denominacion,
dd.observaciones,
de.codigo,
ndp.denominacion,
ni.numeropieza,
coalesce(dm.precioalternativo,0),
coalesce(round(dm.importealternativo,2),0),
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedaalternativa,           
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedacontable,
dd.estado,
0,--_dd.numeroref,
nca.denominacion,

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
where a.idusuario = dd.idusuario limit 1) as cargopersona,

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
where a.idusuario = dd.aprobadopor limit 1) as cargopersonaprobar,
no.denominacion as operacion,
(
	select concat(eup.descripcion,' ',eup2.descripcion,' ', eu.descripcion) 
    from mod_logubicacion.dat_ubicacionproducto up 
    inner join mod_logubicacion.dat_estructuraubicacion eu on eu.idestructuraubicacion = up.idubicacion
    left join mod_logubicacion.dat_estructuraubicacion eup2 on eup2.idestructuraubicacion = eu.idpadre and eup2.idestructuraubicacion <> eup2.idpadre
    left join mod_logubicacion.dat_estructuraubicacion eup on eup.idarea = eu.idarea and eup.idestructuraubicacion = eup.idpadre
    where up.idproducto = dp.idproducto limit 1
) as ubicacion

from mod_logistica.dat_documento dd
left join mod_logistica.dat_documentopadre dpdre on dpdre.iddocumento = dd.iddocumento
inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
LEFT join mod_logistica.dat_documento _dd on _dd.iddocumento = dpdre.idpadre
LEFT join mod_datosmaestros.dat_documentoprim _ddp on _ddp.iddoc = _dd.iddoc
LEFT join mod_datosmaestros.nom_docprim _ndp on _ndp.iddocumentos = _ddp.iddocumentos
inner join mod_logistica.dat_documentocliente ddc on ddc.iddocumento = dd.iddocumento
inner join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = dd.idestructuracomun
inner join mod_seguridad.seg_usuario su on su.idusuario = dd.idusuario
inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
inner join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = des.idestructuracomun
inner join mod_loginventario.conf_inventario ci on ci.idestructuracomun = des.idestructuracomun

left join mod_logistica.dat_movimiento dm on dd.iddocumento = dm.iddocumento
left join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto 
--left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = dp.idumedida
left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = dm.idunidadmedida
left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
left join mod_contabilidadcosto.nom_centrocosto ncc on ncc.idcentrogrupo = ddc.idcliente
left join mod_seguridad.seg_usuario su1 on su1.idusuario = dd.aprobadopor
left join mod_logistica.conf_general i on i.idestructura = de.idestructura
left join mod_logistica.nom_categoria nca on nca.idcategoria = dp.idcategoria
left join mod_datosmaestros.nom_operacion no on no.idnomoperaciones = dd.idoperacion
where dd.iddocumento = $1
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;




/*Predespacho*/

CREATE OR REPLACE FUNCTION mod_loginventario.f_modelopredespacho (
  p_iddocumento numeric
)
RETURNS SETOF mod_loginventario.td_modelopredespacho AS
$body$
declare
all_rec mod_loginventario.td_modelopredespacho;
begin
 for all_rec in
select distinct
(case when ci.idestructuracomun = ci.idpadre then (case when ci.esminfar = 0 then cast(dd.nrodoc as varchar) when ci.esminfar = 1 then cast(dd.nrodoc as varchar) end)
     when ci.idestructuracomun <> ci.idpadre then (case when ci.esminfar = 0 then cast(dd.nrodoc as varchar) when ci.esminfar = 1 then btrim(concat(dd.nrodoc,'-',des.codigo,'-',desop.codigo),'-') end)
end) as numerodocumento,

dd.fechacontable,
dd.observaciones,

(case when ci.idestructuracomun = ci.idpadre then (case when ci.esminfar = 0 then btrim(concat(des.codigo,'-',des.denominacion),'-') when ci.esminfar = 1 then des.codigo end)
     when ci.idestructuracomun <> ci.idpadre then (case when ci.esminfar = 0 then btrim(concat(des.codigo,'-',des.denominacion),'-') when ci.esminfar = 1 then (select codigo from mod_estructuracomp.v_dametodasestructuras where idestructura = ci.idpadre limit 1) end)
end) as entidad,

ni.codigo,
ni.denominacion,
dum.abreviaturaunidadmedida,
dm.preciocontable,
dm.importecontable,
(select (case when ddc.tipocliente = 1 then (coalesce((case when (btrim(concat(ncp.codigo,'-',ncp.nombre),'-') <> '' ) then btrim(concat(ncp.codigo,'-',ncp.nombre),'-') end),
  coalesce((case when (btrim(concat(de.codigo,'-',de.denominacion),'-') <> '') then btrim(concat(de.codigo,'-',de.denominacion),'-') end),
  btrim(concat(dp.nombre,' ',dp.snombre,' ',dp.papel,' ',dp.sapel)))))
      when ddc.tipocliente = 2 then (btrim(concat(ncc.codigocentrogrupo,'-',ncc.descripcioncentrogrupo),'-'))
      when ddc.tipocliente = 3 then (btrim(concat(deop.codigo,'-',deop.denominacion),'-')) end)) as entregar,

btrim(concat(desop.codigo,'-',desop.denominacion),'-') as deposito,
i.urllogo,
_ndp.denominacion,

(case when _ci.idestructuracomun = _ci.idpadre then (case when _ci.esminfar = 0 then cast(_dd.nrodoc as varchar) when _ci.esminfar = 1 then cast(_dd.nrodoc as varchar) end)
     when _ci.idestructuracomun <> _ci.idpadre then (case when _ci.esminfar = 0 then cast(_dd.nrodoc as varchar) when _ci.esminfar = 1 then btrim(concat(_dd.nrodoc,'-',_de.codigo,'-',_deop.codigo),'-') end)
end) as nrodocorigen,

_dd.fechacontable,
(select dme.ordenado from mod_loginventario.dat_moventrega dme where dme.idmovimiento = dm.idmovimiento and dme.iddocorigen = dd.iddocumento)as ordenado,
dm.cantidad as entregado,
des.codigo,
ndp.denominacion,
dd.estado,
_dd.numeroref,
/*(select array_to_string(array_agg(case when deu2.idestructuraubicacion = deu1.idpadre then coalesce(deu2.descripcion,deu1.descripcion) 
else btrim(concat(deu2.descripcion,'-',deu1.descripcion)) end), ',') as ubicacion       
from mod_logubicacion.dat_ubicacionproducto dup 
inner join mod_logubicacion.dat_estructuraubicacion deu1 on (deu1.idestructuraubicacion = dup.idubicacion) 
inner join mod_logubicacion.dat_area da on deu1.idarea = da.idarea 
inner join mod_logubicacion.dat_areaproducto dap on da.idarea = dap.idarea 
inner join mod_logubicacion.dat_estructuraubicacion deu2 on ((deu2.idarea = da.idarea and deu2.idestructuraubicacion = deu2.idpadre))
where (deu2.idarbol = deu1.idarbol and dup.idproducto = dap.idproducto) and dap.idproducto = dpo.idproducto) as ubicacion,*/
(
	select concat(eup.descripcion,' ',eup2.descripcion,' ', eu.descripcion) 
    from mod_logubicacion.dat_ubicacionproducto up 
    inner join mod_logubicacion.dat_estructuraubicacion eu on eu.idestructuraubicacion = up.idubicacion
    left join mod_logubicacion.dat_estructuraubicacion eup2 on eup2.idestructuraubicacion = eu.idpadre and eup2.idestructuraubicacion <> eup2.idpadre
    left join mod_logubicacion.dat_estructuraubicacion eup on eup.idarea = eu.idarea and eup.idestructuraubicacion = eup.idpadre
    where up.idproducto = dpo.idproducto limit 1
) as ubicacion,
nc.denominacion as categoria,

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
where a.idusuario = dd.aprobadopor) as cargopersonaprobar

from mod_logistica.dat_documento dd 
inner join mod_logistica.dat_documentopadre dpdre on dpdre.iddocumento = dd.iddocumento
inner join mod_logistica.dat_entrega dee on dee.iddocumento = dd.iddocumento
inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
inner join mod_logistica.dat_documento _dd on _dd.iddocumento = dpdre.idpadre
inner join mod_datosmaestros.dat_documentoprim _ddp on _ddp.iddoc = _dd.iddoc
inner join mod_datosmaestros.nom_docprim _ndp on _ndp.iddocumentos = _ddp.iddocumentos
inner join mod_datosmaestros.dat_estructurasubsist desu on desu.idestructurasubsist = ddp.idestructurasubsist
inner join mod_loginventario.conf_inventario ci on ci.idestructuracomun = desu.idestructuracomun
inner join mod_estructuracomp.v_dametodasestructuras des on des.idestructura = desu.idestructuracomun
inner join mod_estructuracomp.dat_estructuraop desop on desop.idestructuraop = dd.idestructuracomun
inner join mod_logistica.dat_documentocliente ddc on ddc.iddocumento = dd.iddocumento
left join mod_logistica.dat_movimiento dm on dd.iddocumento = dm.iddocumento
left join mod_logistica.dat_producto dpo on dpo.idproducto = dm.idproducto
left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dpo.idindicador
left join mod_datosmaestros.nom_unidadmedida dum on dum.idunidadmedida = ni.idumedida
left join mod_datosmaestros.nom_clientesproveedor ncp on ddc.idcliente = ncp.idclientesproveedores
left join mod_estructuracomp.dat_estructuraop deop on ddc.idcliente = deop.idestructuraop
left join mod_contabilidadcosto.nom_centrocosto ncc on ncc.idcentrogrupo = ddc.idcliente
left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = ncp.idestructura
left join mod_persona.dat_persona dp on dp.idpersona = ncp.idpersona
left join mod_logistica.conf_general i on i.idestructura = des.idestructura
left join mod_datosmaestros.nom_categoria nc on nc.idcategoria = dpo.idcategoria
left join mod_datosmaestros.dat_estructurasubsist _des on _des.idestructurasubsist = _ddp.idestructurasubsist
left join mod_estructuracomp.v_dametodasestructuras _de on _de.idestructura = _des.idestructuracomun
left join mod_loginventario.conf_inventario _ci on _ci.idestructuracomun = _des.idestructuracomun
left join mod_estructuracomp.dat_estructuraop _deop on _deop.idestructuraop = _dd.idestructuracomun
where dd.iddocumento = $1
order by ni.denominacion
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;




/*Tranferencia entre clientes*/


ALTER TYPE mod_loginventario.td_modelotransferenciacliente
  ADD ATTRIBUTE ubicacion VARCHAR;


CREATE OR REPLACE FUNCTION mod_loginventario.f_modelotransferenciacliente (
  iddocumento numeric,
  p_monedaalternativa numeric,
  p_monedacontable numeric
)
RETURNS SETOF mod_loginventario.td_modelotransferenciacliente AS
$body$
declare
v_rec mod_loginventario.td_modelotransferenciacliente;
begin
for v_rec in 
select distinct
(case when cio.idestructuracomun = cio.idpadre then (case when cio.esminfar = 0 then cast(ddo.nrodoc as varchar) when cio.esminfar = 1 then cast(ddo.nrodoc as varchar) end)
     when cio.idestructuracomun <> cio.idpadre then (case when cio.esminfar = 0 then cast(ddo.nrodoc as varchar) when cio.esminfar = 1 then btrim(concat(ddo.nrodoc,'-',dee.codigo,'-',deoop.codigo),'-') end)
end) as numerodocumento,

(case when cih.idestructuracomun = cih.idpadre then (case when cih.esminfar = 0 then cast(ddh.nrodoc as varchar) when cih.esminfar = 1 then cast(ddh.nrodoc as varchar) end)
     when cih.idestructuracomun <> cih.idpadre then (case when cih.esminfar = 0 then cast(ddh.nrodoc as varchar) when cih.esminfar = 1 then btrim(concat(ddh.nrodoc,'-',de.codigo,'-',deop.codigo),'-') end)
end) as nrohijo,

ddo.fechacontable as forigina,
ddh.fechacontable as fhijo,
ddh.observaciones,
ndpo.denominacion as aliasdocorigina,
ndph.denominacion as aliasdochijo,
dum.abreviaturaunidadmedida,
coalesce(dm.cantidad,0),
coalesce(dm.preciocontable,0),
coalesce(dm.importecontable,0),

(case when cio.idestructuracomun = cio.idpadre then (case when cio.esminfar = 0 then btrim(concat(deo.codigo,'-',deo.denominacion),'-') when cio.esminfar = 1 then deo.codigo end)
     when cio.idestructuracomun <> cio.idpadre then (case when cio.esminfar = 0 then btrim(concat(deo.codigo,'-',deo.denominacion),'-') when cio.esminfar = 1 then (select codigo from mod_estructuracomp.v_dametodasestructuras where idestructura = cio.idpadre limit 1) end)
end) as entsum,

deo.direccion as dirsum,
(select coalesce(ncp1.nombre,coalesce(de1.denominacion,concat(dp1.nombre,' ',dp1.snombre,' ',dp1.papel,' ',dp1.sapel)))
from mod_datosmaestros.nom_clientesproveedor ncp1 left join mod_estructuracomp.v_dametodasestructuras de1 on de1.idestructura = ncp1.idestructura left join mod_persona.dat_persona dp1 on dp1.idpersona = ncp1.idpersona 
where ncp1.idclientesproveedores = ddc.idcliente limit 1) as entrecep,
(select coalesce(ncp2.direccion,de2.direccion)
from mod_datosmaestros.nom_clientesproveedor ncp2 left join mod_estructuracomp.v_dametodasestructuras de2 on de2.idestructura = ncp2.idestructura 
where ncp2.idclientesproveedores = ddc.idcliente limit 1) as direcep,
ddt.nombreconductor as transp,
(select coalesce(ncp.direccion,de.direccion)
from mod_datosmaestros.nom_clientesproveedor ncp left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = ncp.idestructura
where ncp.idclientesproveedores = ddt.idorganizacion limit 1) as dirtransp,
ddt.ciconductor as  ci,
ddt.matricula as chapa,
ddt.cartaporte as cartaporte,
ni.codigo as codprod,
nc.denominacion as catprod,
ni.denominacion as prod,
ni.numeropieza,  

(case when cih.idestructuracomun = cih.idpadre then (case when cih.esminfar = 0 then btrim(concat(de.codigo,'-',de.denominacion),'-') when cih.esminfar = 1 then de.codigo end)
     when cih.idestructuracomun <> cih.idpadre then (case when cih.esminfar = 0 then btrim(concat(de.codigo,'-',de.denominacion),'-') when cih.esminfar = 1 then (select codigo from mod_estructuracomp.v_dametodasestructuras where idestructura = cih.idpadre limit 1) end)
end) as entidad,

de.codigo as reeup,
i.urllogo,
coalesce(dm.precioalternativo,0),
coalesce(dm.importealternativo,0),
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedaalternativa,           
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedacontable,
ddh.estado,

(select (case when ddc.tipocliente = 1 then (coalesce((case when (btrim(concat(ncp.codigo,'-',ncp.nombre),'-') <> '' ) then btrim(concat(ncp.codigo,'-',ncp.nombre),'-') end),
  (case when (btrim(concat(de.codigo,'-',de.denominacion),'-') <> '') then btrim(concat(de.codigo,'-',de.denominacion),'-') end))) end)
from mod_datosmaestros.nom_clientesproveedor ncp 
left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = ncp.idestructura
where ncp.idclientesproveedores = ddt.idorganizacion) as entidadtransp,

(select (case when ddc.tipocliente = 1 then (coalesce(ncp.direccion,de.direccion)) end)
from mod_datosmaestros.nom_clientesproveedor ncp 
left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = ncp.idestructura
where ncp.idclientesproveedores = ddt.idorganizacion) as direntidadtransp,
ddt.casilla,

(select btrim(concat(b.nombre,' ',b.snombre,' ',b.papel,' ',b.sapel))
from mod_seguridad.seg_usuario a 
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
where a.idusuario = ddh.idusuario) as nombrepersona,

(select f.denominacion from mod_seguridad.seg_usuario a
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
inner join mod_persona.dat_personaentidad c on c.idpersona = b.idpersona and (c.fhasta > now() or c.fhasta is null )
inner join mod_persona.dat_situacionlaboral d on d.idpersonaentidad = c.idpersonaentidad and (d.fhasta > now() or d.fhasta is null)
inner join mod_estructuracomp.dat_cargo e on e.idcargo = d.idcargo
inner join mod_estructuracomp.nom_cargo f on f.idnomcargo = e.idnomcargo
where a.idusuario = ddh.idusuario) as cargopersona,

(select btrim(concat(b.nombre,' ',b.snombre,' ',b.papel,' ',b.sapel))
from mod_seguridad.seg_usuario a 
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
where a.idusuario = ddh.aprobadopor) as nombrepersonaprobar,

(select f.denominacion from mod_seguridad.seg_usuario a
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
inner join mod_persona.dat_personaentidad c on c.idpersona = b.idpersona and (c.fhasta > now() or c.fhasta is null )
inner join mod_persona.dat_situacionlaboral d on d.idpersonaentidad = c.idpersonaentidad and (d.fhasta > now() or d.fhasta is null)
inner join mod_estructuracomp.dat_cargo e on e.idcargo = d.idcargo
inner join mod_estructuracomp.nom_cargo f on f.idnomcargo = e.idnomcargo
where a.idusuario = ddh.aprobadopor) as cargopersonaprobar,
(
	select concat(eup.descripcion,' ',eup2.descripcion,' ', eu.descripcion) 
    from mod_logubicacion.dat_ubicacionproducto up 
    inner join mod_logubicacion.dat_estructuraubicacion eu on eu.idestructuraubicacion = up.idubicacion
    left join mod_logubicacion.dat_estructuraubicacion eup2 on eup2.idestructuraubicacion = eu.idpadre and eup2.idestructuraubicacion <> eup2.idpadre
    left join mod_logubicacion.dat_estructuraubicacion eup on eup.idarea = eu.idarea and eup.idestructuraubicacion = eup.idpadre
    where up.idproducto = dprod.idproducto limit 1
) as ubicacion

from  mod_logistica.dat_documento ddh
inner join mod_logistica.dat_documentopadre ddp on ddp.iddocumento = ddh.iddocumento
inner join mod_datosmaestros.dat_documentoprim ddprimh on ddprimh.iddoc = ddh.iddoc
inner join mod_datosmaestros.nom_docprim ndph on ndph.iddocumentos = ddprimh.iddocumentos
inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddprimh.idestructurasubsist
inner join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = des.idestructuracomun
inner join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = ddh.idestructuracomun
inner join mod_seguridad.seg_usuario su on su.idusuario = ddh.idusuario
left join mod_logistica.dat_movimiento dm on dm.iddocumento = ddh.iddocumento
inner join mod_loginventario.dat_moventrega dme on dme.idmovimiento = dm.idmovimiento
inner join mod_logistica.dat_documento ddo on ddo.iddocumento = ddp.idpadre
inner join mod_datosmaestros.dat_documentoprim ddprimo on ddprimo.iddoc = ddo.iddoc
inner join mod_datosmaestros.nom_docprim ndpo on ndpo.iddocumentos = ddprimo.iddocumentos
inner join mod_datosmaestros.dat_estructurasubsist deso on deso.idestructurasubsist = ddprimo.idestructurasubsist
inner join mod_estructuracomp.v_dametodasestructuras deo on deo.idestructura = deso.idestructuracomun
inner join mod_logistica.dat_documentocliente ddc on ddc.iddocumento = ddo.iddocumento
inner join mod_loginventario.conf_inventario cih on cih.idestructuracomun = des.idestructuracomun
inner join mod_loginventario.conf_inventario cio on cio.idestructuracomun = deso.idestructuracomun
left join mod_datosmaestros.nom_unidadmedida dum on dum.idunidadmedida = dm.idunidadmedida
left join mod_logistica.dat_producto dprod on dprod.idproducto = dm.idproducto 
left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dprod.idindicador
left join mod_seguridad.seg_usuario su1 on su1.idusuario = ddh.aprobadopor
left join mod_logistica.conf_general i on i.idestructura = de.idestructura
left join mod_estructuracomp.dat_estructuraop deoop on deoop.idestructuraop = ddo.idestructuracomun
left join mod_estructuracomp.v_dametodasestructuras dee on dee.idestructura = ddo.idestructuracomun
left join mod_logistica.dat_documentotransporte ddt on ddt.iddocumento = ddh.iddocumento
left join mod_datosmaestros.nom_categoria nc on nc.idcategoria = dprod.idcategoria
where ddh.iddocumento = $1
loop return next v_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;



/*Tranferencia entre almacenes*/

ALTER TYPE mod_loginventario.td_tranferenciaentrealmacenes
  ADD ATTRIBUTE ubicacion VARCHAR,
  ADD ATTRIBUTE operacion VARCHAR;


CREATE OR REPLACE FUNCTION mod_loginventario.f_modelotranfalmacenes (
  p_iddocumento numeric,
  p_monedaalternativa numeric,
  p_monedacontable numeric
)
RETURNS SETOF mod_loginventario.td_tranferenciaentrealmacenes AS
$body$
declare
all_rec mod_loginventario.td_tranferenciaentrealmacenes;
begin
for all_rec in
select distinct
(case when ci.idestructuracomun = ci.idpadre then (case when ci.esminfar = 0 then btrim(concat(de.codigo,'-',de.denominacion),'-') when ci.esminfar = 1 then de.codigo end)
     when ci.idestructuracomun <> ci.idpadre then (case when ci.esminfar = 0 then btrim(concat(de.codigo,'-',de.denominacion),'-') when ci.esminfar = 1 then (select codigo from mod_estructuracomp.v_dametodasestructuras where idestructura = ci.idpadre limit 1) end)
end) as entidad,
de.codigo as reeup,
ndp.denominacion as aliasdoc,
(case when ci.idestructuracomun = ci.idpadre then (case when ci.esminfar = 0 then cast(dd.nrodoc as varchar) when ci.esminfar = 1 then cast(dd.nrodoc as varchar) end)
     when ci.idestructuracomun <> ci.idpadre then (case when ci.esminfar = 0 then cast(dd.nrodoc as varchar) when ci.esminfar = 1 then btrim(concat(dd.nrodoc,'-',de.codigo,'-',deaph.codigo),'-') end)
end) as nrodoc,
dd.fechacontable,
dd.observaciones,
i.urllogo,   
btrim(concat(deaph.codigo,'-',deaph.denominacion),'-') as almsum,
deo.direccion as dirsum,
deaph.codigo as codsum,
btrim(concat(deop.codigo,'-',deop.denominacion),'-') as almrecep,
de.direccion as direcep,
deop.codigo as codrecep,
ni.codigo as codprod,
ni.denominacion as denomprod,
dum.abreviaturaunidadmedida as um,
coalesce(dm.preciocontable,0) as punitario,

coalesce(dm.cantidad,0),--(select e.cantidad from mod_logdistribucion.dat_prodorden e where e.idorden = ddo.iddocumento and e.idproducto = dm.idproducto) as cantpsum,    
coalesce(round(dm.cantidad*dm.preciocontable,2),0),--(select coalesce(a.importe,0) from mod_logistica.dat_producto a inner join mod_logdistribucion.dat_prodorden f on f.idproducto = a.idproducto where f.idorden = ddo.iddocumento and f.idproducto = dm.idproducto) as importepsum,    
coalesce(dm.existenciaactual,0),--(select coalesce(b.cantidad,0) from mod_logistica.dat_producto b inner join mod_logdistribucion.dat_prodorden g on g.idproducto = b.idproducto where g.idorden = ddo.iddocumento and g.idproducto = dm.idproducto ) as saldopsum,
      
coalesce(dm.cantidad,0) as cantprecep,
round(coalesce(dm.importecontable,0),2) as importeprecep,
coalesce(dm.existenciaactual,0) as saldoprecep,
      
ni.numeropieza,
COALESCE(dm.precioalternativo,0),
COALESCE(round(dm.cantidad*dm.precioalternativo,2),0),
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedaalternativa,           
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedacontable,
COALESCE(dm.precioalternativo,0) as precioalternativo,
COALESCE(round(dm.cantidad*dm.precioalternativo,2),0) as importealternativo,
--(select coalesce(c.precioalternativo,0) from mod_logistica.dat_producto c inner join mod_logdistribucion.dat_prodorden h on h.idproducto = c.idproducto where h.idorden = ddo.iddocumento and h.idproducto = dm.idproducto) as precioalternativo,
--(select coalesce(d.importealternativo,0) from mod_logistica.dat_producto d inner join mod_logdistribucion.dat_prodorden i on i.idproducto = d.idproducto where i.idorden = ddo.iddocumento and i.idproducto = dm.idproducto) as importealternativo
dp.idproducto,
dd.estado,
(select (case when ddc.tipocliente = 3 then (coalesce((case when (btrim(concat(ncp.codigo,'-',ncp.nombre),'-') <> '' ) then btrim(concat(ncp.codigo,'-',ncp.nombre),'-') end),
  (case when (btrim(concat(de.codigo,'-',de.denominacion),'-') <> '') then btrim(concat(de.codigo,'-',de.denominacion),'-') end))) end)
from mod_datosmaestros.nom_clientesproveedor ncp 
left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = ncp.idestructura
where ncp.idclientesproveedores = ddt.idorganizacion) as entidadtransp,

(select (case when ddc.tipocliente = 3 then (coalesce(ncp.direccion,de.direccion)) end)
from mod_datosmaestros.nom_clientesproveedor ncp 
left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = ncp.idestructura
where ncp.idclientesproveedores = ddt.idorganizacion) as direntidadtransp,

ddt.casilla,
ddt.ciconductor,
ddt.matricula as chapa,
ddt.cartaporte,

(case when cio.idestructuracomun = cio.idpadre then (case when cio.esminfar = 0 then cast(ddo.nrodoc as varchar) when cio.esminfar = 1 then cast(ddo.nrodoc as varchar) end)
     when cio.idestructuracomun <> cio.idpadre then (case when cio.esminfar = 0 then cast(ddo.nrodoc as varchar) when cio.esminfar = 1 then btrim(concat(ddo.nrodoc,'-',deo.codigo,'-',deopo.codigo),'-') end)
end) as nrodocorigen,

ndpo.denominacion as aliasdocorigen,
ddo.fechacontable as fechadocorigen,
ddt.nombreconductor,

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
deop.denominacion as cliente,
(
	select concat(eup.descripcion,' ',eup2.descripcion,' ', eu.descripcion) 
    from mod_logubicacion.dat_ubicacionproducto up 
    inner join mod_logubicacion.dat_estructuraubicacion eu on eu.idestructuraubicacion = up.idubicacion
    left join mod_logubicacion.dat_estructuraubicacion eup2 on eup2.idestructuraubicacion = eu.idpadre and eup2.idestructuraubicacion <> eup2.idpadre
    left join mod_logubicacion.dat_estructuraubicacion eup on eup.idarea = eu.idarea and eup.idestructuraubicacion = eup.idpadre
    where up.idproducto = dp.idproducto limit 1
) as ubicacion,

no.denominacion as operacion

from mod_logistica.dat_documento dd
inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
inner join mod_loginventario.conf_inventario ci on ci.idestructuracomun = des.idestructuracomun
inner join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = des.idestructuracomun
inner join mod_estructuracomp.dat_estructuraop deaph on deaph.idestructuraop = dd.idestructuracomun
inner join mod_logistica.dat_documentopadre ddpad on ddpad.iddocumento = dd.iddocumento    
inner join mod_logistica.dat_documento ddo on ddo.iddocumento = ddpad.idpadre
inner join mod_datosmaestros.dat_documentoprim ddpo on ddpo.iddoc = ddo.iddoc
inner join mod_datosmaestros.nom_docprim ndpo on ndpo.iddocumentos = ddpo.iddocumentos
inner join mod_datosmaestros.dat_estructurasubsist deso on deso.idestructurasubsist = ddpo.idestructurasubsist
inner join mod_estructuracomp.v_dametodasestructuras deo on deo.idestructura = deso.idestructuracomun
inner join mod_logistica.dat_documentocliente ddc on ddc.iddocumento = ddo.iddocumento
left join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = ddc.idcliente
left join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento
left join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
left join mod_datosmaestros.nom_unidadmedida dum on dum.idunidadmedida = ni.idumedida
left join mod_logistica.conf_general i on i.idestructura = de.idestructura   
left join mod_logistica.dat_documentotransporte ddt on ddt.iddocumento = dd.iddocumento
left join mod_loginventario.conf_inventario cio on cio.idestructuracomun = deso.idestructuracomun
left join mod_estructuracomp.dat_estructuraop deopo on deopo.idestructuraop = ddo.idestructuracomun
left join mod_datosmaestros.nom_operacion no on no.idnomoperaciones = dd.idoperacion
where dd.iddocumento = $1
order by dp.idproducto
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;  