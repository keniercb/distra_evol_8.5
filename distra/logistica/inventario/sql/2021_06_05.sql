CREATE TYPE mod_logdistribucion.td_modelodistribucionproducto AS
(
	codigoproducto character varying(100),
	denominacionproducto character varying(255),
	numeropieza character varying(100),
	cantidad numeric(25,6),
	unidadmedida character varying(100),
	categoria character varying(100),
	precio numeric(25,6),
	importe numeric(25,2),
	cantdespachada numeric(25,6),
	cantparcial numeric(25,6),
	precioalternativo numeric(25,6),
	importealternativo numeric(25,2),
	monedaalternativa character varying(100),
	monedacontable character varying(100),
	idorden numeric(19,0),
	deposito character varying(255),
	entregar character varying(255),
	direccioncliente character varying(255),
	cuentabancaria character varying(255),
	numerosucursal character varying(255),
	tipocliente numeric(1,0),
	idcliente numeric(19,0)
);

ALTER TYPE mod_logdistribucion.td_modelodistribucionproducto
    OWNER TO zeolides;
 -- object recreation
DROP FUNCTION mod_loginventario.f_modelotranferenciaentreareas(p_iddocumento numeric, p_monedaalternativa numeric, p_monedacontable numeric);

CREATE FUNCTION mod_loginventario.f_modelotranferenciaentreareas (
  p_iddocumento numeric
)
RETURNS SETOF mod_loginventario.td_modelotranferenciaentreareas AS
$body$
declare
 all_rec mod_loginventario.td_modelotranferenciaentreareas;
begin
for all_rec in
select distinct 
(case when ci.idestructuracomun = ci.idpadre then (case when ci.esminfar = 0 then cast(dd.nrodoc as varchar) when ci.esminfar = 1 then cast(dd.nrodoc as varchar) end)
     when ci.idestructuracomun <> ci.idpadre then (case when ci.esminfar = 0 then cast(dd.nrodoc as varchar) when ci.esminfar = 1 then btrim(concat(dd.nrodoc,'-',de.codigo,'-',deop.codigo),'-') end)
end) as numerodocumento,

dd.fechacontable,
(select btrim(concat(deop.codigo,'-',deop.denominacion),'-') from mod_estructuracomp.dat_estructuraop deop where deop.idestructuraop = dd.idestructuracomun) as deposito,

(case when ci.idestructuracomun = ci.idpadre then (case when ci.esminfar = 0 then btrim(concat(de.codigo,'-',de.denominacion),'-') when ci.esminfar = 1 then de.codigo end)
     when ci.idestructuracomun <> ci.idpadre then (case when ci.esminfar = 0 then btrim(concat(de.codigo,'-',de.denominacion),'-') when ci.esminfar = 1 then (select codigo from mod_estructuracomp.v_dametodasestructuras where idestructura = ci.idpadre limit 1) end)
end) as entidad,

su1.nombreusuario as aprobadopor,
(select deuo.descripcion
from mod_logubicacion.dat_estructuraubicacion deuo 
inner join mod_logubicacion.dat_area dao on dao.idarea = deuo.idarea
where dao.idarea = dta.areaorigen and deuo.nivel = 1) as areaorigen,

(select deud.descripcion
from mod_logubicacion.dat_estructuraubicacion deud 
inner join mod_logubicacion.dat_area dad on dad.idarea = deud.idarea
where dad.idarea = dta.areadestino and deud.nivel = 1) as areadestino,
i.urllogo,
de.codigo,
ndp.denominacion,
dd.estado,

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
inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
inner join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = dd.idestructuracomun
inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
inner join mod_loginventario.conf_inventario ci on ci.idestructuracomun = des.idestructuracomun
inner join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = des.idestructuracomun
left join mod_logistica.conf_general i on i.idestructura = de.idestructura
inner join mod_seguridad.seg_usuario su on su.idusuario = dd.idusuario
left join mod_seguridad.seg_usuario su1 on su1.idusuario = dd.aprobadopor
inner join mod_loginventario.dat_transferenciaarea dta on dta.idtransferenciaarea = dd.iddocumento
where dd.iddocumento = p_iddocumento
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

ALTER TYPE mod_loginventario.td_modelotranferenciaentreareas
  DROP ATTRIBUTE codigo,
  DROP ATTRIBUTE denominacion,
  DROP ATTRIBUTE um,
  DROP ATTRIBUTE cantidadprod,
  DROP ATTRIBUTE precio,
  DROP ATTRIBUTE importe,
  DROP ATTRIBUTE existencia,
  DROP ATTRIBUTE categoria,
  DROP ATTRIBUTE numeropieza,
  DROP ATTRIBUTE precioalternativo,
  DROP ATTRIBUTE importealternativo,
  DROP ATTRIBUTE monedaalternativa,
  DROP ATTRIBUTE monedacontable;

CREATE OR REPLACE FUNCTION mod_loginventario.f_modelotranferenciaentreareasproducto (
  p_iddocumento numeric,
  p_monedaalternativa numeric,
  p_monedacontable numeric
)
RETURNS SETOF mod_loginventario.td_modelotranferenciaentreareasproducto AS
$body$
declare
 all_rec mod_loginventario.td_modelotranferenciaentreareasproducto;
begin
for all_rec in
select distinct 
(case when (ni.numeropieza is null or ni.numeropieza = '') then ni.codigo else ni.numeropieza END),
ni.denominacion,
dum.abreviaturaunidadmedida as unidadmedida,
coalesce(dm.cantidad,0),
coalesce(dm.preciocontable,0),
coalesce(dm.importecontable,0),
coalesce(dm.existenciaactual,0),
nc.denominacion,
ni.numeropieza,
coalesce(dm.precioalternativo,0),
coalesce(dm.importealternativo,0),
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedaalternativa) as monedaalternativa,           
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedacontable) as monedacontable
from mod_logistica.dat_movimiento dm
left join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto 
left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
left join mod_datosmaestros.nom_unidadmedida dum on dum.idunidadmedida = dm.idunidadmedida
left join mod_logistica.nom_categoria nc on nc.idcategoria = dp.idcategoria
where dm.iddocumento = p_iddocumento
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

CREATE OR REPLACE FUNCTION mod_loginventario.f_modelotranferenciaentreareasproducto (
  p_iddocumento numeric,
  p_monedaalternativa numeric,
  p_monedacontable numeric
)
RETURNS SETOF mod_loginventario.td_modelotranferenciaentreareasproducto AS
$body$
declare
 all_rec mod_loginventario.td_modelotranferenciaentreareasproducto;
begin
for all_rec in
select distinct 
(case when (ni.numeropieza is null or ni.numeropieza = '') then ni.codigo else ni.numeropieza END),
ni.denominacion,
dum.abreviaturaunidadmedida as unidadmedida,
coalesce(dm.cantidad,0),
coalesce(dm.preciocontable,0),
coalesce(dm.importecontable,0),
coalesce(dm.existenciaactual,0),
nc.denominacion,
ni.numeropieza,
coalesce(dm.precioalternativo,0),
coalesce(dm.importealternativo,0),
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedaalternativa) as monedaalternativa,           
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedacontable) as monedacontable,
dp.idproducto
from mod_logistica.dat_movimiento dm
left join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto 
left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
left join mod_datosmaestros.nom_unidadmedida dum on dum.idunidadmedida = dm.idunidadmedida
left join mod_logistica.nom_categoria nc on nc.idcategoria = dp.idcategoria
where dm.iddocumento = p_iddocumento
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

ALTER TYPE mod_loginventario.td_modelotranferenciaentreareasproducto
  ADD ATTRIBUTE idproducto NUMERIC(19,0);
  
 -- object recreation
DROP FUNCTION mod_loginventario.f_modelosolicitudentrega(p_iddocumento numeric, p_monedaalternativa numeric, p_monedacontable numeric);

CREATE FUNCTION mod_loginventario.f_modelosolicitudentrega (
  p_iddocumento numeric
)
RETURNS SETOF mod_loginventario.td_solicitudentrega AS
$body$
declare
all_rec mod_loginventario.td_solicitudentrega;
begin 
for all_rec in
select distinct 
(case when ci.idestructuracomun = ci.idpadre then (case when ci.esminfar = 0 then btrim(concat(de.codigo,'-',de.denominacion),'-') when ci.esminfar = 1 then de.codigo end)
     when ci.idestructuracomun <> ci.idpadre then (case when ci.esminfar = 0 then btrim(concat(de.codigo,'-',de.denominacion),'-') when ci.esminfar = 1 then (select codigo from mod_estructuracomp.v_dametodasestructuras where idestructura = ci.idpadre limit 1) end)
end) as entidad,

btrim(concat(deop.codigo,'-',deop.denominacion),'-'),

(case when ci.idestructuracomun = ci.idpadre then (case when ci.esminfar = 0 then cast(dd.nrodoc as varchar) when ci.esminfar = 1 then cast(dd.nrodoc as varchar) end)
     when ci.idestructuracomun <> ci.idpadre then (case when ci.esminfar = 0 then cast(dd.nrodoc as varchar) when ci.esminfar = 1 then btrim(concat(dd.nrodoc,'-',de.codigo,'-',deop.codigo),'-') end)
end) as numerodocumento,

dd.fechacontable as fechadocumento,
btrim(concat(ncc.codigocentrogrupo,'-', ncc.descripcioncentrogrupo),'-'),
i.urllogo,
de.codigo,
ndp.denominacion, 
dd.estado,

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
inner join mod_datosmaestros.dat_documentoprim dpr on dpr.iddoc = dd.iddoc
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = dpr.iddocumentos
inner join mod_logistica.dat_documentocliente ddc on ddc.iddocumento = dd.iddocumento
inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = dpr.idestructurasubsist
inner join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = des.idestructuracomun
inner join mod_estructuracomp.nom_filaestruc nf on nf.idfila = dd.idestructuracomun
inner join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = nf.idfila
inner join mod_loginventario.conf_inventario ci on ci.idestructuracomun = des.idestructuracomun
left join mod_contabilidadcosto.nom_centrocosto ncc on ncc.idcentrogrupo = ddc.idcliente
left join mod_logistica.conf_general i on i.idestructura = de.idestructura
where dd.iddocumento = p_iddocumento
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

ALTER TYPE mod_loginventario.td_solicitudentrega
  DROP ATTRIBUTE codigo,
  DROP ATTRIBUTE categoria,
  DROP ATTRIBUTE codigoproveedor,
  DROP ATTRIBUTE nombreproducto,
  DROP ATTRIBUTE unidadmedida,
  DROP ATTRIBUTE cantidadproducto,
  DROP ATTRIBUTE preciocontable,
  DROP ATTRIBUTE importeparcial,
  DROP ATTRIBUTE precioalternativo,
  DROP ATTRIBUTE importealternativo,
  DROP ATTRIBUTE monedaalternativa,
  DROP ATTRIBUTE monedacontable;

CREATE OR REPLACE FUNCTION mod_loginventario.f_modelosolicitudentregaproducto (
  p_iddocumento numeric,
  p_monedaalternativa numeric,
  p_monedacontable numeric
)
RETURNS SETOF mod_loginventario.td_solicitudentregaproducto AS
$body$
declare
all_rec mod_loginventario.td_solicitudentregaproducto;
begin 
for all_rec in
select distinct 
ni.codigo,
nc.denominacion as categoria,
ni.numeropieza,
ni.denominacion as nombreproducto,
dum.abreviaturaunidadmedida as unidadmedida,
coalesce(dm.cantidad,0) as cantidadproducto,
coalesce(dm.preciocontable,0),
coalesce((dm.cantidad * dm.preciocontable),0) as importeparcial,
COALESCE(dm.precioalternativo,0),
COALESCE(dm.importealternativo,0),
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedaalternativa) as monedaalternativa,           
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedacontable) as monedacontable
from mod_logistica.dat_movimiento dm
left join mod_datosmaestros.nom_unidadmedida dum on dum.idunidadmedida = dm.idunidadmedida
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
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER TYPE mod_loginventario.td_modelopredespacho
  DROP ATTRIBUTE codigoproducto,
  DROP ATTRIBUTE denominacionproducto,
  DROP ATTRIBUTE unidadmedida,
  DROP ATTRIBUTE preciocontable,
  DROP ATTRIBUTE importecontable,
  DROP ATTRIBUTE ordenado,
  DROP ATTRIBUTE entregado,
  DROP ATTRIBUTE ubicacion,
  DROP ATTRIBUTE categoria;

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
des.codigo,
ndp.denominacion,
dd.estado,
_dd.numeroref,
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
left join mod_datosmaestros.nom_clientesproveedor ncp on ddc.idcliente = ncp.idclientesproveedores
left join mod_estructuracomp.dat_estructuraop deop on ddc.idcliente = deop.idestructuraop
left join mod_contabilidadcosto.nom_centrocosto ncc on ncc.idcentrogrupo = ddc.idcliente
left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = ncp.idestructura
left join mod_persona.dat_persona dp on dp.idpersona = ncp.idpersona
left join mod_logistica.conf_general i on i.idestructura = des.idestructura
left join mod_datosmaestros.dat_estructurasubsist _des on _des.idestructurasubsist = _ddp.idestructurasubsist
left join mod_estructuracomp.v_dametodasestructuras _de on _de.idestructura = _des.idestructuracomun
left join mod_loginventario.conf_inventario _ci on _ci.idestructuracomun = _des.idestructuracomun
left join mod_estructuracomp.dat_estructuraop _deop on _deop.idestructuraop = _dd.idestructuracomun
where dd.iddocumento = p_iddocumento
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;


CREATE TYPE mod_loginventario.td_modelopredespachoproducto AS (
  codigoproducto VARCHAR,
  denominacionproducto VARCHAR,
  unidadmedida VARCHAR,
  preciocontable NUMERIC(25,6),
  importecontable NUMERIC(25,6),
  ordenado NUMERIC(25,6),
  entregado NUMERIC(25,6),
  ubicacion VARCHAR,
  categoria VARCHAR
);

ALTER TYPE mod_loginventario.td_modelopredespachoproducto
  OWNER TO zeolides;
  
CREATE OR REPLACE FUNCTION mod_loginventario.f_modelopredespachoproducto (
  p_iddocumento numeric
)
RETURNS SETOF mod_loginventario.td_modelopredespachoproducto AS
$body$
declare
all_rec mod_loginventario.td_modelopredespachoproducto;
begin
 for all_rec in
select distinct

ni.codigo,
ni.denominacion,
dum.abreviaturaunidadmedida,
dm.preciocontable,
dm.importecontable,
(select dme.ordenado from mod_loginventario.dat_moventrega dme where dme.idmovimiento = dm.idmovimiento and dme.iddocorigen = dm.iddocumento)as ordenado,
dm.cantidad as entregado,
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
nc.denominacion as categoria

from mod_logistica.dat_movimiento dm
left join mod_logistica.dat_producto dpo on dpo.idproducto = dm.idproducto
left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dpo.idindicador
left join mod_datosmaestros.nom_unidadmedida dum on dum.idunidadmedida = ni.idumedida
left join mod_datosmaestros.nom_categoria nc on nc.idcategoria = dpo.idcategoria
where dm.iddocumento = p_iddocumento
order by ni.denominacion
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

ALTER FUNCTION mod_loginventario.f_modelopredespachoproducto (p_iddocumento numeric)
  OWNER TO zeolides;

CREATE OR REPLACE FUNCTION mod_loginventario.f_modelotranfalmacenesproducto (
  p_iddocumento numeric,
  p_monedaalternativa numeric,
  p_monedacontable numeric
)
RETURNS SETOF mod_loginventario.td_tranferenciaentrealmacenesproducto AS
$body$
declare
all_rec mod_loginventario.td_tranferenciaentrealmacenesproducto;
begin
for all_rec in
select distinct
ni.codigo as codprod,
ni.denominacion as denomprod,
dum.abreviaturaunidadmedida as um,
coalesce(dm.preciocontable,0) as punitario,
coalesce(dm.cantidad,0),    
coalesce(round(dm.cantidad*dm.preciocontable,2),0),
coalesce(dm.existenciaactual,0),      
coalesce(dm.cantidad,0) as cantprecep,
coalesce(round(dm.importecontable,2),0) as importeprecep,
coalesce(dm.existenciaactual,0) as saldoprecep,      
ni.numeropieza,
COALESCE(dm.precioalternativo,0),
COALESCE(round(dm.cantidad*dm.precioalternativo,2),0),
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedaalternativa) as monedaalternativa,           
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedacontable) as monedacontable,
COALESCE(dm.precioalternativo,0) as precioalternativo,
COALESCE(round(dm.cantidad*dm.precioalternativo,2),0) as importealternativo,
dp.idproducto,
round((select sum(round(ddmv.importecontable,2)) from mod_logistica.dat_movimiento ddmv where ddmv.iddocumento = dm.iddocumento),2) as importecup, 
round((select sum(round(ddmv.importealternativo,2)) from mod_logistica.dat_movimiento ddmv where ddmv.iddocumento = dm.iddocumento),2) as importecuc,
(
	select concat(eup.descripcion,' ',eup2.descripcion,' ', eu.descripcion) 
    from mod_logubicacion.dat_ubicacionproducto up 
    inner join mod_logubicacion.dat_estructuraubicacion eu on eu.idestructuraubicacion = up.idubicacion
    left join mod_logubicacion.dat_estructuraubicacion eup2 on eup2.idestructuraubicacion = eu.idpadre and eup2.idestructuraubicacion <> eup2.idpadre
    left join mod_logubicacion.dat_estructuraubicacion eup on eup.idarea = eu.idarea and eup.idestructuraubicacion = eup.idpadre
    where up.idproducto = dp.idproducto limit 1
) as ubicacion  
from mod_logistica.dat_movimiento dm
left join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
left join mod_datosmaestros.nom_unidadmedida dum on dum.idunidadmedida = dp.idumedida
where dm.iddocumento = p_iddocumento
order by dp.idproducto
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

ALTER TYPE mod_loginventario.td_tranferenciaentrealmacenesproducto
  ADD ATTRIBUTE ubicacion VARCHAR(255);
 
 -- object recreation
DROP FUNCTION mod_loginventario.f_modelotranfalmacenes(p_iddocumento numeric, p_monedaalternativa numeric, p_monedacontable numeric);

CREATE FUNCTION mod_loginventario.f_modelotranfalmacenes (
  p_iddocumento numeric
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
dd.estado,
(select (case when ddc.tipocliente = 3 then (coalesce((case when (btrim(concat(ncp.codigo,'-',ncp.nombre),'-') <> '' ) then btrim(concat(ncp.codigo,'-',ncp.nombre),'-') end),
  (case when (btrim(concat(de.codigo,'-',de.denominacion),'-') <> '') then btrim(concat(de.codigo,'-',de.denominacion),'-') end))) end)
from mod_datosmaestros.nom_clientesproveedor ncp 
left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = ncp.idestructura
where ncp.idclientesproveedores = ddt.idorganizacion limit 1) as entidadtransp,

(select (case when ddc.tipocliente = 3 then (coalesce(ncp.direccion,de.direccion)) end)
from mod_datosmaestros.nom_clientesproveedor ncp 
left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = ncp.idestructura
where ncp.idclientesproveedores = ddt.idorganizacion limit 1) as direntidadtransp,

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
deop.denominacion as cliente
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
left join mod_logistica.conf_general i on i.idestructura = de.idestructura   
left join mod_logistica.dat_documentotransporte ddt on ddt.iddocumento = dd.iddocumento
left join mod_loginventario.conf_inventario cio on cio.idestructuracomun = deso.idestructuracomun
left join mod_estructuracomp.dat_estructuraop deopo on deopo.idestructuraop = ddo.idestructuracomun
where dd.iddocumento = p_iddocumento
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

ALTER TYPE mod_loginventario.td_tranferenciaentrealmacenes
  DROP ATTRIBUTE codprod,
  DROP ATTRIBUTE denomprod,
  DROP ATTRIBUTE um,
  DROP ATTRIBUTE punitario,
  DROP ATTRIBUTE cantpsum,
  DROP ATTRIBUTE importepsum,
  DROP ATTRIBUTE saldopsum,
  DROP ATTRIBUTE cantprecep,
  DROP ATTRIBUTE importeprecep,
  DROP ATTRIBUTE saldoprecep,
  DROP ATTRIBUTE numeropieza,
  DROP ATTRIBUTE precioalternativo,
  DROP ATTRIBUTE importealternativo,
  DROP ATTRIBUTE monedaalternativa,
  DROP ATTRIBUTE monedacontable,
  DROP ATTRIBUTE precioalternativopadre,
  DROP ATTRIBUTE importealternativopadre,
  DROP ATTRIBUTE idproducto,
  DROP ATTRIBUTE ubicacion;

CREATE TYPE mod_loginventario.td_modelotransferenciaclienteproducto AS (
  abreviaturaunidadmedida VARCHAR,
  cantidad NUMERIC(25,6),
  preciocontable NUMERIC(25,6),
  importecontable NUMERIC(25,6),  
  codprod VARCHAR,
  catprod VARCHAR,
  prod VARCHAR,
  codigoproveedor VARCHAR,
  precioalternativo NUMERIC(25,6),
  importealternativo NUMERIC(25,6),
  monedaalternativa VARCHAR,
  monedacontable VARCHAR,
  ubicacion VARCHAR
);

ALTER TYPE mod_loginventario.td_modelotransferenciaclienteproducto
  OWNER TO zeolides;
  
CREATE OR REPLACE FUNCTION mod_loginventario.f_modelotransferenciaclienteproducto (
  p_iddocumento numeric,
  p_monedaalternativa numeric,
  p_monedacontable numeric
)
RETURNS SETOF mod_loginventario.td_modelotransferenciaclienteproducto AS
$body$
declare
v_rec mod_loginventario.td_modelotransferenciaclienteproducto;
begin
for v_rec in 
select distinct
dum.abreviaturaunidadmedida,
coalesce(dm.cantidad,0),
coalesce(dm.preciocontable,0),
coalesce(dm.importecontable,0),
ni.codigo as codprod,
nc.denominacion as catprod,
ni.denominacion as prod,
ni.numeropieza,  
coalesce(dm.precioalternativo,0),
coalesce(dm.importealternativo,0),
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedaalternativa) as monedaalternativa,           
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedacontable) as monedacontable,
(
	select concat(eup.descripcion,' ',eup2.descripcion,' ', eu.descripcion) 
    from mod_logubicacion.dat_ubicacionproducto up 
    inner join mod_logubicacion.dat_estructuraubicacion eu on eu.idestructuraubicacion = up.idubicacion
    left join mod_logubicacion.dat_estructuraubicacion eup2 on eup2.idestructuraubicacion = eu.idpadre and eup2.idestructuraubicacion <> eup2.idpadre
    left join mod_logubicacion.dat_estructuraubicacion eup on eup.idarea = eu.idarea and eup.idestructuraubicacion = eup.idpadre
    where up.idproducto = dprod.idproducto limit 1
) as ubicacion

from  mod_logistica.dat_movimiento dm
inner join mod_loginventario.dat_moventrega dme on dme.idmovimiento = dm.idmovimiento
left join mod_datosmaestros.nom_unidadmedida dum on dum.idunidadmedida = dm.idunidadmedida
left join mod_logistica.dat_producto dprod on dprod.idproducto = dm.idproducto 
left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dprod.idindicador
left join mod_datosmaestros.nom_categoria nc on nc.idcategoria = dprod.idcategoria
where dm.iddocumento = p_iddocumento
loop return next v_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

ALTER FUNCTION mod_loginventario.f_modelotransferenciaclienteproducto (iddocumento numeric, p_monedaalternativa numeric, p_monedacontable numeric)
  OWNER TO zeolides;
 
 ALTER TYPE mod_loginventario.td_modelotransferenciacliente
  DROP ATTRIBUTE abreviaturaunidadmedida,
  DROP ATTRIBUTE cantidad,
  DROP ATTRIBUTE preciocontable,
  DROP ATTRIBUTE importecontable,
  DROP ATTRIBUTE codprod,
  DROP ATTRIBUTE catprod,
  DROP ATTRIBUTE prod,
  DROP ATTRIBUTE codigoproveedor,
  DROP ATTRIBUTE precioalternativo,
  DROP ATTRIBUTE importealternativo,
  DROP ATTRIBUTE monedaalternativa,
  DROP ATTRIBUTE monedacontable,
  DROP ATTRIBUTE ubicacion;

 -- object recreation
DROP FUNCTION mod_loginventario.f_modelotransferenciacliente(iddocumento numeric, p_monedaalternativa numeric, p_monedacontable numeric);

CREATE FUNCTION mod_loginventario.f_modelotransferenciacliente (
  p_iddocumento numeric
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
(case when cih.idestructuracomun = cih.idpadre then (case when cih.esminfar = 0 then btrim(concat(de.codigo,'-',de.denominacion),'-') when cih.esminfar = 1 then de.codigo end)
     when cih.idestructuracomun <> cih.idpadre then (case when cih.esminfar = 0 then btrim(concat(de.codigo,'-',de.denominacion),'-') when cih.esminfar = 1 then (select codigo from mod_estructuracomp.v_dametodasestructuras where idestructura = cih.idpadre limit 1) end)
end) as entidad,

de.codigo as reeup,
i.urllogo,
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
where a.idusuario = ddh.aprobadopor) as cargopersonaprobar
from  mod_logistica.dat_documento ddh
inner join mod_logistica.dat_documentopadre ddp on ddp.iddocumento = ddh.iddocumento
inner join mod_datosmaestros.dat_documentoprim ddprimh on ddprimh.iddoc = ddh.iddoc
inner join mod_datosmaestros.nom_docprim ndph on ndph.iddocumentos = ddprimh.iddocumentos
inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddprimh.idestructurasubsist
inner join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = des.idestructuracomun
inner join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = ddh.idestructuracomun
inner join mod_seguridad.seg_usuario su on su.idusuario = ddh.idusuario
inner join mod_logistica.dat_documento ddo on ddo.iddocumento = ddp.idpadre
inner join mod_datosmaestros.dat_documentoprim ddprimo on ddprimo.iddoc = ddo.iddoc
inner join mod_datosmaestros.nom_docprim ndpo on ndpo.iddocumentos = ddprimo.iddocumentos
inner join mod_datosmaestros.dat_estructurasubsist deso on deso.idestructurasubsist = ddprimo.idestructurasubsist
inner join mod_estructuracomp.v_dametodasestructuras deo on deo.idestructura = deso.idestructuracomun
inner join mod_logistica.dat_documentocliente ddc on ddc.iddocumento = ddo.iddocumento
inner join mod_loginventario.conf_inventario cih on cih.idestructuracomun = des.idestructuracomun
inner join mod_loginventario.conf_inventario cio on cio.idestructuracomun = deso.idestructuracomun
left join mod_seguridad.seg_usuario su1 on su1.idusuario = ddh.aprobadopor
left join mod_logistica.conf_general i on i.idestructura = de.idestructura
left join mod_estructuracomp.dat_estructuraop deoop on deoop.idestructuraop = ddo.idestructuracomun
left join mod_estructuracomp.v_dametodasestructuras dee on dee.idestructura = ddo.idestructuracomun
left join mod_logistica.dat_documentotransporte ddt on ddt.iddocumento = ddh.iddocumento
where ddh.iddocumento = p_iddocumento
loop return next v_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

CREATE OR REPLACE FUNCTION mod_loginventario.f_modelovalentregaproducto (
  p_iddocumento numeric,
  p_monedaalternativa numeric,
  p_monedacontable numeric
)
RETURNS SETOF mod_loginventario.td_modelovalentregaproducto AS
$body$
declare
  all_rec mod_loginventario.td_modelovalentregaproducto;
begin
for all_rec in
select distinct
(case when (ni.numeropieza is null or ni.numeropieza = '') then ni.codigo else ni.numeropieza END),
ni.denominacion,
num.abreviaturaunidadmedida as unidadmedida,
coalesce(dm.cantidad,0) as disponible,
coalesce(dm.preciocontable,0) as precio,
coalesce(round(dm.importecontable,2),0) as importe,
--coalesce(dp.cantidad,0) as existencia,
coalesce(dm.existenciaactual,0) as existencia,
ni.numeropieza,
coalesce(dm.precioalternativo,0),
coalesce(round(dm.importealternativo,2),0),
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedaalternativa) as monedaalternativa,           
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedacontable) as monedacontable,
nca.denominacion,
round((select sum(round(ddmv.importecontable,2)) from mod_logistica.dat_movimiento ddmv where ddmv.iddocumento = dm.iddocumento),2) as importecup, 
round((select sum(round(ddmv.importealternativo,2)) from mod_logistica.dat_movimiento ddmv where ddmv.iddocumento = dm.iddocumento),2) as importecuc,
(
	select concat(eup.descripcion,' ',eup2.descripcion,' ', eu.descripcion) 
    from mod_logubicacion.dat_ubicacionproducto up 
    inner join mod_logubicacion.dat_estructuraubicacion eu on eu.idestructuraubicacion = up.idubicacion
    left join mod_logubicacion.dat_estructuraubicacion eup2 on eup2.idestructuraubicacion = eu.idpadre and eup2.idestructuraubicacion <> eup2.idpadre
    left join mod_logubicacion.dat_estructuraubicacion eup on eup.idarea = eu.idarea and eup.idestructuraubicacion = eup.idpadre
    where up.idproducto = dp.idproducto limit 1
) as ubicacion  
from mod_logistica.dat_movimiento dm
left join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto 
left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = dp.idumedida
left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = dm.idunidadmedida
left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
left join mod_logistica.nom_categoria nca on nca.idcategoria = dp.idcategoria
where dm.iddocumento = p_iddocumento
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

ALTER TYPE mod_loginventario.td_modelovalentregaproducto
  ADD ATTRIBUTE ubicacion VARCHAR(255);
  
  
   -- object recreation
DROP FUNCTION mod_loginventario.f_modelovalentrega(p_iddocumento numeric, p_monedaalternativa numeric, p_monedacontable numeric);

CREATE FUNCTION mod_loginventario.f_modelovalentrega (
  p_iddocumento numeric
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
i.urllogo,
--0,_dd.nrodoc,
_dd.nrodoc,
now(),--_dd.fechacontable,
_ndp.denominacion,
dd.observaciones,
de.codigo,
ndp.denominacion,
dd.estado,
0,--_dd.numeroref,
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
no.denominacion as operacion
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
left join mod_contabilidadcosto.nom_centrocosto ncc on ncc.idcentrogrupo = ddc.idcliente
left join mod_seguridad.seg_usuario su1 on su1.idusuario = dd.aprobadopor
left join mod_logistica.conf_general i on i.idestructura = de.idestructura
left join mod_datosmaestros.nom_operacion no on no.idnomoperaciones = dd.idoperacion
where dd.iddocumento = p_iddocumento
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;


CREATE OR REPLACE FUNCTION mod_loginventario.f_modelovalentregaproducto (
  p_iddocumento numeric,
  p_monedaalternativa numeric,
  p_monedacontable numeric
)
RETURNS SETOF mod_loginventario.td_modelovalentregaproducto AS
$body$
declare
  all_rec mod_loginventario.td_modelovalentregaproducto;
begin
for all_rec in
select distinct
(case when (ni.numeropieza is null or ni.numeropieza = '') then ni.codigo else ni.numeropieza END),
ni.denominacion,
num.abreviaturaunidadmedida as unidadmedida,
coalesce(dm.cantidad,0) as disponible,
coalesce(dm.preciocontable,0) as precio,
coalesce(round(dm.importecontable,2),0) as importe,
--coalesce(dp.cantidad,0) as existencia,
coalesce(dm.existenciaactual,0) as existencia,
ni.numeropieza,
coalesce(dm.precioalternativo,0),
coalesce(round(dm.importealternativo,2),0),
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedaalternativa) as monedaalternativa,           
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedacontable) as monedacontable,
nca.denominacion,
round((select sum(round(ddmv.importecontable,2)) from mod_logistica.dat_movimiento ddmv where ddmv.iddocumento = dm.iddocumento),2) as importecup, 
round((select sum(round(ddmv.importealternativo,2)) from mod_logistica.dat_movimiento ddmv where ddmv.iddocumento = dm.iddocumento),2) as importecuc,
(
	select concat(eup.descripcion,' ',eup2.descripcion,' ', eu.descripcion) 
    from mod_logubicacion.dat_ubicacionproducto up 
    inner join mod_logubicacion.dat_estructuraubicacion eu on eu.idestructuraubicacion = up.idubicacion
    left join mod_logubicacion.dat_estructuraubicacion eup2 on eup2.idestructuraubicacion = eu.idpadre and eup2.idestructuraubicacion <> eup2.idpadre
    left join mod_logubicacion.dat_estructuraubicacion eup on eup.idarea = eu.idarea and eup.idestructuraubicacion = eup.idpadre
    where up.idproducto = dp.idproducto limit 1
) as ubicacion  
from mod_logistica.dat_movimiento dm
left join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto 
left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = dm.idunidadmedida
left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
left join mod_logistica.nom_categoria nca on nca.idcategoria = dp.idcategoria
where dm.iddocumento = p_iddocumento
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

DROP FUNCTION mod_logdistribucion.f_modelodistribucion(p_iddocumento numeric, p_monedaalternativa numeric, p_monedacontable numeric);
CREATE OR REPLACE FUNCTION mod_logdistribucion.f_modelodistribucion (
  p_iddocumento numeric
)
RETURNS SETOF mod_logdistribucion.td_modelodistribucion AS
$body$
declare
 all_rec mod_logdistribucion.td_modelodistribucion;
begin
 for all_rec in
select DISTINCT
btrim(concat(dd.nrodoc,'-',de.codigo,'-',de.denominacion),'-'),
dd.nrodoc,
dd.fechacontable,
dd.observaciones,
(select (case when ddc.tipocliente = 1 then (coalesce((case when (btrim(concat(ncp.codigo,'-',ncp.nombre),'-') <> '' ) then btrim(concat(ncp.codigo,'-',ncp.nombre),'-') end),
  coalesce((case when (btrim(concat(de.codigo,'-',de.denominacion),'-') <> '') then btrim(concat(de.codigo,'-',de.denominacion),'-') end),
  btrim(concat(dp.nombre,' ',dp.snombre,' ',dp.papel,' ',dp.sapel)))))
      when ddc.tipocliente = 2 then (btrim(concat(ncc.codigocentrogrupo,'-',ncc.descripcioncentrogrupo),'-'))
      when ddc.tipocliente = 3 then (btrim(concat(deop.codigo,'-',deop.denominacion),'-')) end)
from mod_logistica.dat_documentocliente ddc 
left join mod_datosmaestros.nom_clientesproveedor ncp on ddc.idcliente = ncp.idclientesproveedores 
left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = ncp.idestructura
left join mod_contabilidadcosto.nom_centrocosto ncc on ncc.idcentrogrupo = ddc.idcliente
left join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = ddc.idcliente
left join mod_persona.dat_persona dp on dp.idpersona = ncp.idpersona 
where ddc.iddocumento = dd.iddocumento and ncp.idclientesproveedores = dpo.idcliente) as entregara,
i.urllogo,
de.codigo as reuup,
ndp.denominacion,
btrim(concat(desop.codigo,'-',desop.denominacion ),'-') as deposito,
(select (case when a.tipocliente = 1 then (coalesce(b.direccion,coalesce(e.direccion,d.direccion))) end) 
from mod_logistica.dat_documentocliente a 
left join mod_datosmaestros.nom_clientesproveedor b on a.idcliente = b.idclientesproveedores
left join mod_estructuracomp.v_dametodasestructuras e on e.idestructura = b.idestructura 
left join mod_persona.dat_persona c on c.idpersona = b.idpersona
left join mod_persona.dat_direccion d on d.idpersona = c.idpersona
where a.iddocumento = dd.iddocumento and b.idclientesproveedores = dpo.idcliente
) as direccion,

(select (case when a.tipocliente = 1 then (select dcb.numerocuenta from mod_datosmaestros.dat_cuentabanccliente dcb 
where dcb.idclienteproveedores = b.idclientesproveedores and dcb.predeterminado = 1)end)
from mod_logistica.dat_documentocliente a
left join mod_datosmaestros.nom_clientesproveedor b on a.idcliente = b.idclientesproveedores 
where a.iddocumento = dd.iddocumento and b.idclientesproveedores = dpo.idcliente) as cuentabancaria,

(select ns.numero from mod_datosmaestros.nom_sucursal ns
inner join mod_datosmaestros.dat_cuentabanccliente dcb on dcb.idsucursal = ns.idsucursal
left join mod_datosmaestros.nom_clientesproveedor b on  dcb.idclienteproveedores = b.idclientesproveedores
left join mod_logistica.dat_documentocliente a on a.idcliente = b.idclientesproveedores
where dcb.predeterminado = 1 and a.iddocumento = dd.iddocumento and b.idclientesproveedores = dpo.idcliente) as numerosucursal,

(select a.tipocliente from mod_logistica.dat_documentocliente a 
left join mod_datosmaestros.nom_clientesproveedor b on a.idcliente = b.idclientesproveedores 
where a.iddocumento = dd.iddocumento and b.idclientesproveedores = dpo.idcliente) as tipocliente,

dd.estado,
(select btrim(concat(a.codigo,'-',a.denominacion),'-') 
from mod_estructuracomp.v_dametodasestructuras a 
inner join mod_loginventario.conf_inventario ci on ci.idpadre = a.idestructura
where ci.idpadre = des.idestructuracomun) as denominventario,

(select btrim((array_to_string(array_agg
(distinct (case when dp.idestructuracomun = ci.idestructuracomun and ci.idestructuracomun <> ci.idpadre then (btrim(concat((
select codigo from mod_estructuracomp.v_dametodasestructuras where idestructura = ci.idpadre
),'-',
(select denominacion from mod_estructuracomp.v_dametodasestructuras where idestructura = dp.idestructuracomun)
),'-')) 

when dp.idestructuracomun = ci.idestructuracomun and ci.idestructuracomun = ci.idpadre then (btrim(concat((
select codigo from mod_estructuracomp.v_dametodasestructuras where idestructura = dp.idestructuracomun
),'-',
(select denominacion from mod_estructuracomp.dat_estructuraop where idestructuraop = dp.idestructura)
),'-')) 
end)) ,',')) ,',')
from mod_logdistribucion.dat_prodorden dpo 
left join mod_logistica.dat_producto dp on dp.idproducto = dpo.idproducto 
left join mod_loginventario.conf_inventario ci on ci.idestructuracomun = dp.idestructuracomun 
where dpo.idorden = dd.iddocumento) as suministrador,

btrim((select array_to_string(array_agg(ne.denespecialidad ),',')
from mod_datosmaestros.nom_especialidad ne
inner join mod_logistica.conf_usuarioespecialidad cu on cu.idespecialidad = ne.idespecialidad
where cu.idusuario = dd.idusuario),',') as especialidad,
(select sum(cantidad) from mod_logdistribucion.dat_prodorden where idproducto  = dp.idproducto and idorden = dd.iddocumento) as cantotal,
dpo.idcliente,

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
inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
inner join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = des.idestructuracomun
inner join mod_logdistribucion.dat_distribucion ddis on ddis.iddistribucion = dd.iddocumento
left join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = dd.idestructuracomun
left join mod_loginventario.conf_inventario ci on ci.idestructuracomun = dp.idestructuracomun
left join mod_estructuracomp.nom_filaestruc nf on nf.idfila = dp.idestructura
left join mod_estructuracomp.dat_estructuraop desop on desop.idestructuraop = nf.idfila
left join mod_logistica.conf_general i on i.idestructura = de.idestructura
where dd.iddocumento = p_iddocumento
order by entregara
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

ALTER TYPE mod_logdistribucion.td_modelodistribucion
  DROP ATTRIBUTE codigoproducto,
  DROP ATTRIBUTE denominacionproducto,
  DROP ATTRIBUTE numeropieza,
  DROP ATTRIBUTE cantidadproducto,
  DROP ATTRIBUTE unidadmedida,
  DROP ATTRIBUTE categoria,
  DROP ATTRIBUTE precio,
  DROP ATTRIBUTE importe,
  DROP ATTRIBUTE cantdespechada,
  DROP ATTRIBUTE cantparcial,
  DROP ATTRIBUTE cantotal,
  DROP ATTRIBUTE monedacontable,
  DROP ATTRIBUTE monedaalternativa,
  DROP ATTRIBUTE importealternativo,
  DROP ATTRIBUTE precioalternativo;
  

CREATE OR REPLACE FUNCTION mod_logdistribucion.f_modelodistribucionproducto (
  p_iddocumento numeric,
  p_monedaalternativa numeric, 
  p_monedacontable numeric
)
RETURNS SETOF mod_logdistribucion.td_modelodistribucionproducto AS
$body$
declare
 all_rec mod_logdistribucion.td_modelodistribucionproducto;
begin
 for all_rec in
select DISTINCT
(case when (ni.numeropieza is null or ni.numeropieza = '') then ni.codigo else ni.numeropieza END),
ni.denominacion as denominacionproducto,
ni.numeropieza,
dpo.cantidad,
dum.abreviaturaunidadmedida,
ncat.denominacion as categoria,
dp.precio as precio,
coalesce(dp.precio * dpo.cantidad,0) as importe, 

(select dpoc.entregado from mod_logdistribucion.dat_prodordencmpto dpoc where dpoc.idprodorden = dpo.idprodorden)  as cantdespachado,

(select (dpoc.cantidadoriginal - dpoc.entregado) from mod_logdistribucion.dat_prodordencmpto dpoc where dpoc.idprodorden = dpo.idprodorden)  as catparcial,
dp.precioalternativo as preciocuc,
coalesce(dp.precioalternativo * dpo.cantidad,0) as importecuc,

(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedaalternativa) as monedaalternativa,           
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedacontable) as monedacontable,
dpo.idorden
from mod_logdistribucion.dat_prodorden dpo
left join mod_logistica.dat_producto dp on dpo.idproducto = dp.idproducto  
left join mod_logistica.nom_categoria ncat on ncat.idcategoria = dp.idcategoria
left join mod_datosmaestros.nom_indicador ni on dp.idindicador = ni.idindicador 
left join mod_datosmaestros.nom_unidadmedida dum on dp.idumedida = dum.idunidadmedida
where dpo.idorden = p_iddocumento
order by dpo.idorden DESC
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

CREATE OR REPLACE FUNCTION mod_logdistribucion.f_modelodistribucion (
  p_iddocumento numeric
)
RETURNS SETOF mod_logdistribucion.td_modelodistribucion AS
$body$
declare
 all_rec mod_logdistribucion.td_modelodistribucion;
begin
 for all_rec in
select DISTINCT
btrim(concat(dd.nrodoc,'-',de.codigo,'-',de.denominacion),'-'),
dd.nrodoc,
dd.fechacontable,
dd.observaciones,
(select (case when ddc.tipocliente = 1 then (coalesce((case when (btrim(concat(ncp.codigo,'-',ncp.nombre),'-') <> '' ) then btrim(concat(ncp.codigo,'-',ncp.nombre),'-') end),
  coalesce((case when (btrim(concat(de.codigo,'-',de.denominacion),'-') <> '') then btrim(concat(de.codigo,'-',de.denominacion),'-') end),
  btrim(concat(dp.nombre,' ',dp.snombre,' ',dp.papel,' ',dp.sapel)))))
      when ddc.tipocliente = 2 then (btrim(concat(ncc.codigocentrogrupo,'-',ncc.descripcioncentrogrupo),'-'))
      when ddc.tipocliente = 3 then (btrim(concat(deop.codigo,'-',deop.denominacion),'-')) end)
from mod_logistica.dat_documentocliente ddc 
left join mod_datosmaestros.nom_clientesproveedor ncp on ddc.idcliente = ncp.idclientesproveedores 
left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = ncp.idestructura
left join mod_contabilidadcosto.nom_centrocosto ncc on ncc.idcentrogrupo = ddc.idcliente
left join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = ddc.idcliente
left join mod_persona.dat_persona dp on dp.idpersona = ncp.idpersona 
where ddc.iddocumento = dd.iddocumento and ncp.idclientesproveedores = dpo.idcliente) as entregara,
i.urllogo,
de.codigo as reuup,
ndp.denominacion,
btrim(concat(desop.codigo,'-',desop.denominacion ),'-') as deposito,
(select (case when a.tipocliente = 1 then (coalesce(b.direccion,coalesce(e.direccion,d.direccion))) end) 
from mod_logistica.dat_documentocliente a 
left join mod_datosmaestros.nom_clientesproveedor b on a.idcliente = b.idclientesproveedores
left join mod_estructuracomp.v_dametodasestructuras e on e.idestructura = b.idestructura 
left join mod_persona.dat_persona c on c.idpersona = b.idpersona
left join mod_persona.dat_direccion d on d.idpersona = c.idpersona
where a.iddocumento = dd.iddocumento and b.idclientesproveedores = dpo.idcliente
) as direccion,

(select (case when a.tipocliente = 1 then (select dcb.numerocuenta from mod_datosmaestros.dat_cuentabanccliente dcb 
where dcb.idclienteproveedores = b.idclientesproveedores and dcb.predeterminado = 1)end)
from mod_logistica.dat_documentocliente a
left join mod_datosmaestros.nom_clientesproveedor b on a.idcliente = b.idclientesproveedores 
where a.iddocumento = dd.iddocumento and b.idclientesproveedores = dpo.idcliente) as cuentabancaria,

(select ns.numero from mod_datosmaestros.nom_sucursal ns
inner join mod_datosmaestros.dat_cuentabanccliente dcb on dcb.idsucursal = ns.idsucursal
left join mod_datosmaestros.nom_clientesproveedor b on  dcb.idclienteproveedores = b.idclientesproveedores
left join mod_logistica.dat_documentocliente a on a.idcliente = b.idclientesproveedores
where dcb.predeterminado = 1 and a.iddocumento = dd.iddocumento and b.idclientesproveedores = dpo.idcliente) as numerosucursal,

(select a.tipocliente from mod_logistica.dat_documentocliente a 
left join mod_datosmaestros.nom_clientesproveedor b on a.idcliente = b.idclientesproveedores 
where a.iddocumento = dd.iddocumento and b.idclientesproveedores = dpo.idcliente) as tipocliente,

dd.estado,
(select btrim(concat(a.codigo,'-',a.denominacion),'-') 
from mod_estructuracomp.v_dametodasestructuras a 
inner join mod_loginventario.conf_inventario ci on ci.idpadre = a.idestructura
where ci.idpadre = des.idestructuracomun) as denominventario,

(select btrim((array_to_string(array_agg
(distinct (case when dp.idestructuracomun = ci.idestructuracomun and ci.idestructuracomun <> ci.idpadre then (btrim(concat((
select codigo from mod_estructuracomp.v_dametodasestructuras where idestructura = ci.idpadre
),'-',
(select denominacion from mod_estructuracomp.v_dametodasestructuras where idestructura = dp.idestructuracomun)
),'-')) 

when dp.idestructuracomun = ci.idestructuracomun and ci.idestructuracomun = ci.idpadre then (btrim(concat((
select codigo from mod_estructuracomp.v_dametodasestructuras where idestructura = dp.idestructuracomun
),'-',
(select denominacion from mod_estructuracomp.dat_estructuraop where idestructuraop = dp.idestructura)
),'-')) 
end)) ,',')) ,',')
from mod_logdistribucion.dat_prodorden dpo 
left join mod_logistica.dat_producto dp on dp.idproducto = dpo.idproducto 
left join mod_loginventario.conf_inventario ci on ci.idestructuracomun = dp.idestructuracomun 
where dpo.idorden = dd.iddocumento) as suministrador,

btrim((select array_to_string(array_agg(ne.denespecialidad ),',')
from mod_datosmaestros.nom_especialidad ne
inner join mod_logistica.conf_usuarioespecialidad cu on cu.idespecialidad = ne.idespecialidad
where cu.idusuario = dd.idusuario),',') as especialidad,
dpo.idcliente,

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
inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
inner join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = des.idestructuracomun
inner join mod_logdistribucion.dat_distribucion ddis on ddis.iddistribucion = dd.iddocumento
left join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = dd.idestructuracomun
left join mod_loginventario.conf_inventario ci on ci.idestructuracomun = dp.idestructuracomun
left join mod_estructuracomp.nom_filaestruc nf on nf.idfila = dp.idestructura
left join mod_estructuracomp.dat_estructuraop desop on desop.idestructuraop = nf.idfila
left join mod_logistica.conf_general i on i.idestructura = de.idestructura
where dd.iddocumento = p_iddocumento
order by entregara
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

CREATE OR REPLACE FUNCTION mod_logdistribucion.f_modelodistribucionproducto (
  p_iddocumento numeric,
  p_monedaalternativa numeric, 
  p_monedacontable numeric
)
RETURNS SETOF mod_logdistribucion.td_modelodistribucionproducto AS
$body$
declare
 all_rec mod_logdistribucion.td_modelodistribucionproducto;
begin
 for all_rec in
select DISTINCT
(case when (ni.numeropieza is null or ni.numeropieza = '') then ni.codigo else ni.numeropieza END),
ni.denominacion as denominacionproducto,
ni.numeropieza,
dpo.cantidad,
dum.abreviaturaunidadmedida,
ncat.denominacion as categoria,
dp.precio as precio,
coalesce(dp.precio * dpo.cantidad,0) as importe, 

(select dpoc.entregado from mod_logdistribucion.dat_prodordencmpto dpoc where dpoc.idprodorden = dpo.idprodorden)  as cantdespachado,

(select (dpoc.cantidadoriginal - dpoc.entregado) from mod_logdistribucion.dat_prodordencmpto dpoc where dpoc.idprodorden = dpo.idprodorden)  as catparcial,
dp.precioalternativo as preciocuc,
coalesce(dp.precioalternativo * dpo.cantidad,0) as importecuc,

(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedaalternativa) as monedaalternativa,           
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedacontable) as monedacontable,
dpo.idorden,
btrim(concat(desop.codigo,'-',desop.denominacion ),'-') as deposito,
(select btrim(concat(a.codigo,'-',a.denominacion),'-') 
from mod_estructuracomp.v_dametodasestructuras a 
inner join mod_loginventario.conf_inventario ci on ci.idpadre = a.idestructura
where ci.idpadre = des.idestructuracomun) as denominventario
from mod_logdistribucion.dat_prodorden dpo
left join mod_logistica.dat_producto dp on dpo.idproducto = dp.idproducto  
left join mod_logistica.nom_categoria ncat on ncat.idcategoria = dp.idcategoria
left join mod_datosmaestros.nom_indicador ni on dp.idindicador = ni.idindicador 
left join mod_datosmaestros.nom_unidadmedida dum on dp.idumedida = dum.idunidadmedida
left join mod_estructuracomp.nom_filaestruc nf on nf.idfila = dp.idestructura
left join mod_estructuracomp.dat_estructuraop desop on desop.idestructuraop = nf.idfila
left join mod_loginventario.conf_inventario ci on ci.idestructuracomun = dp.idestructuracomun
where dpo.idorden = p_iddocumento
order by dpo.idorden DESC
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;


 
CREATE OR REPLACE FUNCTION mod_logdistribucion.f_modelodistribucionproducto (
  p_iddocumento numeric,
  p_monedaalternativa numeric, 
  p_monedacontable numeric
)
RETURNS SETOF mod_logdistribucion.td_modelodistribucionproducto AS
$body$
declare
 all_rec mod_logdistribucion.td_modelodistribucionproducto;
begin
 for all_rec in
select DISTINCT
(case when (ni.numeropieza is null or ni.numeropieza = '') then ni.codigo else ni.numeropieza END),
ni.denominacion as denominacionproducto,
ni.numeropieza,
dpo.cantidad,
dum.abreviaturaunidadmedida,
ncat.denominacion as categoria,
dp.precio as precio,
coalesce(dp.precio * dpo.cantidad,0) as importe, 

(select dpoc.entregado from mod_logdistribucion.dat_prodordencmpto dpoc where dpoc.idprodorden = dpo.idprodorden)  as cantdespachado,

(select (dpoc.cantidadoriginal - dpoc.entregado) from mod_logdistribucion.dat_prodordencmpto dpoc where dpoc.idprodorden = dpo.idprodorden)  as catparcial,
dp.precioalternativo as preciocuc,
coalesce(dp.precioalternativo * dpo.cantidad,0) as importecuc,

(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedaalternativa) as monedaalternativa,           
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedacontable) as monedacontable,
dpo.idorden,
btrim(concat(desop.codigo,'-',desop.denominacion ),'-') as deposito,
(select btrim(concat(a.codigo,'-',a.denominacion),'-') 
from mod_estructuracomp.v_dametodasestructuras a 
inner join mod_loginventario.conf_inventario ci on ci.idpadre = a.idestructura
where ci.idpadre = des.idestructuracomun) as denominventario,

(select (case when ddc.tipocliente = 1 then (coalesce((case when (btrim(concat(ncp.codigo,'-',ncp.nombre),'-') <> '' ) then btrim(concat(ncp.codigo,'-',ncp.nombre),'-') end),
  coalesce((case when (btrim(concat(de.codigo,'-',de.denominacion),'-') <> '') then btrim(concat(de.codigo,'-',de.denominacion),'-') end),
  btrim(concat(dp.nombre,' ',dp.snombre,' ',dp.papel,' ',dp.sapel)))))
      when ddc.tipocliente = 2 then (btrim(concat(ncc.codigocentrogrupo,'-',ncc.descripcioncentrogrupo),'-'))
      when ddc.tipocliente = 3 then (btrim(concat(deop.codigo,'-',deop.denominacion),'-')) end)
from mod_logistica.dat_documentocliente ddc 
left join mod_datosmaestros.nom_clientesproveedor ncp on ddc.idcliente = ncp.idclientesproveedores 
left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = ncp.idestructura
left join mod_contabilidadcosto.nom_centrocosto ncc on ncc.idcentrogrupo = ddc.idcliente
left join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = ddc.idcliente
left join mod_persona.dat_persona dp on dp.idpersona = ncp.idpersona 
where ddc.iddocumento = dd.iddocumento and ncp.idclientesproveedores = dpo.idcliente) as entregara,

(select (case when a.tipocliente = 1 then (coalesce(b.direccion,coalesce(e.direccion,d.direccion))) end) 
from mod_logistica.dat_documentocliente a 
left join mod_datosmaestros.nom_clientesproveedor b on a.idcliente = b.idclientesproveedores
left join mod_estructuracomp.v_dametodasestructuras e on e.idestructura = b.idestructura 
left join mod_persona.dat_persona c on c.idpersona = b.idpersona
left join mod_persona.dat_direccion d on d.idpersona = c.idpersona
where a.iddocumento = dd.iddocumento and b.idclientesproveedores = dpo.idcliente
) as direccion,

(select (case when a.tipocliente = 1 then (select dcb.numerocuenta from mod_datosmaestros.dat_cuentabanccliente dcb 
where dcb.idclienteproveedores = b.idclientesproveedores and dcb.predeterminado = 1)end)
from mod_logistica.dat_documentocliente a
left join mod_datosmaestros.nom_clientesproveedor b on a.idcliente = b.idclientesproveedores 
where a.iddocumento = dd.iddocumento and b.idclientesproveedores = dpo.idcliente) as cuentabancaria,

(select ns.numero from mod_datosmaestros.nom_sucursal ns
inner join mod_datosmaestros.dat_cuentabanccliente dcb on dcb.idsucursal = ns.idsucursal
left join mod_datosmaestros.nom_clientesproveedor b on  dcb.idclienteproveedores = b.idclientesproveedores
left join mod_logistica.dat_documentocliente a on a.idcliente = b.idclientesproveedores
where dcb.predeterminado = 1 and a.iddocumento = dd.iddocumento and b.idclientesproveedores = dpo.idcliente) as numerosucursal,

(select a.tipocliente from mod_logistica.dat_documentocliente a 
left join mod_datosmaestros.nom_clientesproveedor b on a.idcliente = b.idclientesproveedores 
where a.iddocumento = dd.iddocumento and b.idclientesproveedores = dpo.idcliente) as tipocliente,
dpo.idcliente
from mod_logdistribucion.dat_prodorden dpo
left join mod_logistica.dat_producto dp on dpo.idproducto = dp.idproducto  
left join mod_logistica.nom_categoria ncat on ncat.idcategoria = dp.idcategoria
left join mod_datosmaestros.nom_indicador ni on dp.idindicador = ni.idindicador 
left join mod_datosmaestros.nom_unidadmedida dum on dp.idumedida = dum.idunidadmedida
left join mod_estructuracomp.nom_filaestruc nf on nf.idfila = dp.idestructura
left join mod_estructuracomp.dat_estructuraop desop on desop.idestructuraop = nf.idfila
left join mod_loginventario.conf_inventario ci on ci.idestructuracomun = dp.idestructuracomun
where dpo.idorden = p_iddocumento
order by dpo.idorden DESC
loop 
return next all_rec; 
end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

CREATE OR REPLACE FUNCTION mod_logdistribucion.f_modelodistribucion (
  p_iddocumento numeric
)
RETURNS SETOF mod_logdistribucion.td_modelodistribucion AS
$body$
declare
 all_rec mod_logdistribucion.td_modelodistribucion;
begin
 for all_rec in
select DISTINCT
btrim(concat(dd.nrodoc,'-',de.codigo,'-',de.denominacion),'-'),
dd.nrodoc,
dd.fechacontable,
dd.observaciones,
(select (case when ddc.tipocliente = 1 then (coalesce((case when (btrim(concat(ncp.codigo,'-',ncp.nombre),'-') <> '' ) then btrim(concat(ncp.codigo,'-',ncp.nombre),'-') end),
  coalesce((case when (btrim(concat(de.codigo,'-',de.denominacion),'-') <> '') then btrim(concat(de.codigo,'-',de.denominacion),'-') end),
  btrim(concat(dp.nombre,' ',dp.snombre,' ',dp.papel,' ',dp.sapel)))))
      when ddc.tipocliente = 2 then (btrim(concat(ncc.codigocentrogrupo,'-',ncc.descripcioncentrogrupo),'-'))
      when ddc.tipocliente = 3 then (btrim(concat(deop.codigo,'-',deop.denominacion),'-')) end)
from mod_logistica.dat_documentocliente ddc 
left join mod_datosmaestros.nom_clientesproveedor ncp on ddc.idcliente = ncp.idclientesproveedores 
left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = ncp.idestructura
left join mod_contabilidadcosto.nom_centrocosto ncc on ncc.idcentrogrupo = ddc.idcliente
left join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = ddc.idcliente
left join mod_persona.dat_persona dp on dp.idpersona = ncp.idpersona 
where ddc.iddocumento = dd.iddocumento and ncp.idclientesproveedores = dpo.idcliente) as entregara,
i.urllogo,
de.codigo as reuup,
ndp.denominacion,
(select (case when a.tipocliente = 1 then (coalesce(b.direccion,coalesce(e.direccion,d.direccion))) end) 
from mod_logistica.dat_documentocliente a 
left join mod_datosmaestros.nom_clientesproveedor b on a.idcliente = b.idclientesproveedores
left join mod_estructuracomp.v_dametodasestructuras e on e.idestructura = b.idestructura 
left join mod_persona.dat_persona c on c.idpersona = b.idpersona
left join mod_persona.dat_direccion d on d.idpersona = c.idpersona
where a.iddocumento = dd.iddocumento and b.idclientesproveedores = dpo.idcliente
) as direccion,

(select (case when a.tipocliente = 1 then (select dcb.numerocuenta from mod_datosmaestros.dat_cuentabanccliente dcb 
where dcb.idclienteproveedores = b.idclientesproveedores and dcb.predeterminado = 1)end)
from mod_logistica.dat_documentocliente a
left join mod_datosmaestros.nom_clientesproveedor b on a.idcliente = b.idclientesproveedores 
where a.iddocumento = dd.iddocumento and b.idclientesproveedores = dpo.idcliente) as cuentabancaria,

(select ns.numero from mod_datosmaestros.nom_sucursal ns
inner join mod_datosmaestros.dat_cuentabanccliente dcb on dcb.idsucursal = ns.idsucursal
left join mod_datosmaestros.nom_clientesproveedor b on  dcb.idclienteproveedores = b.idclientesproveedores
left join mod_logistica.dat_documentocliente a on a.idcliente = b.idclientesproveedores
where dcb.predeterminado = 1 and a.iddocumento = dd.iddocumento and b.idclientesproveedores = dpo.idcliente) as numerosucursal,

(select a.tipocliente from mod_logistica.dat_documentocliente a 
left join mod_datosmaestros.nom_clientesproveedor b on a.idcliente = b.idclientesproveedores 
where a.iddocumento = dd.iddocumento and b.idclientesproveedores = dpo.idcliente) as tipocliente,
dd.estado,
(select btrim((array_to_string(array_agg
(distinct (case when dp.idestructuracomun = ci.idestructuracomun and ci.idestructuracomun <> ci.idpadre then (btrim(concat((
select codigo from mod_estructuracomp.v_dametodasestructuras where idestructura = ci.idpadre
),'-',
(select denominacion from mod_estructuracomp.v_dametodasestructuras where idestructura = dp.idestructuracomun)
),'-')) 

when dp.idestructuracomun = ci.idestructuracomun and ci.idestructuracomun = ci.idpadre then (btrim(concat((
select codigo from mod_estructuracomp.v_dametodasestructuras where idestructura = dp.idestructuracomun
),'-',
(select denominacion from mod_estructuracomp.dat_estructuraop where idestructuraop = dp.idestructura)
),'-')) 
end)) ,',')) ,',')
from mod_logdistribucion.dat_prodorden dpo 
left join mod_logistica.dat_producto dp on dp.idproducto = dpo.idproducto 
left join mod_loginventario.conf_inventario ci on ci.idestructuracomun = dp.idestructuracomun 
where dpo.idorden = dd.iddocumento) as suministrador,

btrim((select array_to_string(array_agg(ne.denespecialidad ),',')
from mod_datosmaestros.nom_especialidad ne
inner join mod_logistica.conf_usuarioespecialidad cu on cu.idespecialidad = ne.idespecialidad
where cu.idusuario = dd.idusuario),',') as especialidad,
dpo.idcliente,

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
inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
inner join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = des.idestructuracomun
inner join mod_logdistribucion.dat_distribucion ddis on ddis.iddistribucion = dd.iddocumento
left join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = dd.idestructuracomun
left join mod_logistica.conf_general i on i.idestructura = de.idestructura
where dd.iddocumento = p_iddocumento
order by entregara
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;


CREATE OR REPLACE FUNCTION mod_logdistribucion.f_modelodistribucion (
  p_iddocumento numeric
)
RETURNS SETOF mod_logdistribucion.td_modelodistribucion AS
$body$
declare
 all_rec mod_logdistribucion.td_modelodistribucion;
begin
 for all_rec in
select DISTINCT
btrim(concat(dd.nrodoc,'-',de.codigo,'-',de.denominacion),'-'),
dd.nrodoc,
dd.fechacontable,
dd.observaciones,
i.urllogo,
de.codigo as reuup,
ndp.denominacion,
dd.estado,
(select btrim((array_to_string(array_agg
(distinct (case when dp.idestructuracomun = ci.idestructuracomun and ci.idestructuracomun <> ci.idpadre then (btrim(concat((
select codigo from mod_estructuracomp.v_dametodasestructuras where idestructura = ci.idpadre
),'-',
(select denominacion from mod_estructuracomp.v_dametodasestructuras where idestructura = dp.idestructuracomun)
),'-')) 

when dp.idestructuracomun = ci.idestructuracomun and ci.idestructuracomun = ci.idpadre then (btrim(concat((
select codigo from mod_estructuracomp.v_dametodasestructuras where idestructura = dp.idestructuracomun
),'-',
(select denominacion from mod_estructuracomp.dat_estructuraop where idestructuraop = dp.idestructura)
),'-')) 
end)) ,',')) ,',')
from mod_logdistribucion.dat_prodorden dpo 
left join mod_logistica.dat_producto dp on dp.idproducto = dpo.idproducto 
left join mod_loginventario.conf_inventario ci on ci.idestructuracomun = dp.idestructuracomun 
where dpo.idorden = dd.iddocumento) as suministrador,

btrim((select array_to_string(array_agg(ne.denespecialidad ),',')
from mod_datosmaestros.nom_especialidad ne
inner join mod_logistica.conf_usuarioespecialidad cu on cu.idespecialidad = ne.idespecialidad
where cu.idusuario = dd.idusuario),',') as especialidad,
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
inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
inner join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = des.idestructuracomun
inner join mod_logdistribucion.dat_distribucion ddis on ddis.iddistribucion = dd.iddocumento
left join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = dd.idestructuracomun
left join mod_logistica.conf_general i on i.idestructura = de.idestructura
where dd.iddocumento = p_iddocumento
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

ALTER TYPE mod_logdistribucion.td_modelodistribucion
  DROP ATTRIBUTE entregar,
  DROP ATTRIBUTE deposito,
  DROP ATTRIBUTE direccioncliente,
  DROP ATTRIBUTE cuentabancaria,
  DROP ATTRIBUTE numerosucursal,
  DROP ATTRIBUTE tipocliente,
  DROP ATTRIBUTE denominventario,
  DROP ATTRIBUTE idcliente;
 
  
  CREATE OR REPLACE FUNCTION mod_logdistribucion.f_modelodistribucion (
  p_iddocumento numeric
)
RETURNS SETOF mod_logdistribucion.td_modelodistribucion AS
$body$
declare
 all_rec mod_logdistribucion.td_modelodistribucion;
begin
 for all_rec in
select DISTINCT
btrim(concat(dd.nrodoc,'-',de.codigo,'-',de.denominacion),'-'),
dd.nrodoc,
dd.fechacontable,
dd.observaciones,
i.urllogo,
de.codigo as reuup,
ndp.denominacion,
dd.estado,
(select btrim((array_to_string(array_agg
(distinct (case when dp.idestructuracomun = ci.idestructuracomun and ci.idestructuracomun <> ci.idpadre then (btrim(concat((
select codigo from mod_estructuracomp.v_dametodasestructuras where idestructura = ci.idpadre
),'-',
(select denominacion from mod_estructuracomp.v_dametodasestructuras where idestructura = dp.idestructuracomun)
),'-')) 

when dp.idestructuracomun = ci.idestructuracomun and ci.idestructuracomun = ci.idpadre then (btrim(concat((
select codigo from mod_estructuracomp.v_dametodasestructuras where idestructura = dp.idestructuracomun
),'-',
(select denominacion from mod_estructuracomp.dat_estructuraop where idestructuraop = dp.idestructura)
),'-')) 
end)) ,',')) ,',')
from mod_logdistribucion.dat_prodorden dpo 
left join mod_logistica.dat_producto dp on dp.idproducto = dpo.idproducto 
left join mod_loginventario.conf_inventario ci on ci.idestructuracomun = dp.idestructuracomun 
where dpo.idorden = dd.iddocumento) as suministrador,

btrim((select array_to_string(array_agg(ne.denespecialidad ),',')
from mod_datosmaestros.nom_especialidad ne
inner join mod_logistica.conf_usuarioespecialidad cu on cu.idespecialidad = ne.idespecialidad
where cu.idusuario = dd.idusuario),',') as especialidad,
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
(select btrim(concat(a.codigo,'-',a.denominacion),'-') 
from mod_estructuracomp.v_dametodasestructuras a 
inner join mod_loginventario.conf_inventario ci on ci.idpadre = a.idestructura
where ci.idpadre = des.idestructuracomun) as denominventario
from mod_logistica.dat_documento dd 
inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
inner join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = des.idestructuracomun
inner join mod_logdistribucion.dat_distribucion ddis on ddis.iddistribucion = dd.iddocumento
left join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = dd.idestructuracomun
left join mod_logistica.conf_general i on i.idestructura = de.idestructura
where dd.iddocumento = p_iddocumento
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;
 
 
ALTER TYPE mod_logdistribucion.td_modelodistribucion  
  ADD ATTRIBUTE denominventario VARCHAR(255);
   
 
CREATE OR REPLACE FUNCTION mod_logdistribucion.f_modelodistribucionproducto (
  p_iddocumento numeric,
  p_monedaalternativa numeric, 
  p_monedacontable numeric
)
RETURNS SETOF mod_logdistribucion.td_modelodistribucionproducto AS
$body$
declare
 all_rec mod_logdistribucion.td_modelodistribucionproducto;
begin
 for all_rec in
select DISTINCT
(case when (ni.numeropieza is null or ni.numeropieza = '') then ni.codigo else ni.numeropieza END),
ni.denominacion as denominacionproducto,
ni.numeropieza,
dpo.cantidad,
dum.abreviaturaunidadmedida,
ncat.denominacion as categoria,
dp.precio as precio,
coalesce(dp.precio * dpo.cantidad,0) as importe, 

(select dpoc.entregado from mod_logdistribucion.dat_prodordencmpto dpoc where dpoc.idprodorden = dpo.idprodorden)  as cantdespachado,

(select (dpoc.cantidadoriginal - dpoc.entregado) from mod_logdistribucion.dat_prodordencmpto dpoc where dpoc.idprodorden = dpo.idprodorden)  as catparcial,
dp.precioalternativo as preciocuc,
coalesce(dp.precioalternativo * dpo.cantidad,0) as importecuc,

(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedaalternativa) as monedaalternativa,           
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedacontable) as monedacontable,
dpo.idorden,
btrim(concat(desop.codigo,'-',desop.denominacion ),'-') as deposito,

(select (case when ddc.tipocliente = 1 then (coalesce((case when (btrim(concat(ncp.codigo,'-',ncp.nombre),'-') <> '' ) then btrim(concat(ncp.codigo,'-',ncp.nombre),'-') end),
  coalesce((case when (btrim(concat(de.codigo,'-',de.denominacion),'-') <> '') then btrim(concat(de.codigo,'-',de.denominacion),'-') end),
  btrim(concat(dp.nombre,' ',dp.snombre,' ',dp.papel,' ',dp.sapel)))))
      when ddc.tipocliente = 2 then (btrim(concat(ncc.codigocentrogrupo,'-',ncc.descripcioncentrogrupo),'-'))
      when ddc.tipocliente = 3 then (btrim(concat(deop.codigo,'-',deop.denominacion),'-')) end)
from mod_logistica.dat_documentocliente ddc 
left join mod_datosmaestros.nom_clientesproveedor ncp on ddc.idcliente = ncp.idclientesproveedores 
left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = ncp.idestructura
left join mod_contabilidadcosto.nom_centrocosto ncc on ncc.idcentrogrupo = ddc.idcliente
left join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = ddc.idcliente
left join mod_persona.dat_persona dp on dp.idpersona = ncp.idpersona 
where ddc.iddocumento = dpo.idorden and ncp.idclientesproveedores = dpo.idcliente) as entregara,

(select (case when a.tipocliente = 1 then (coalesce(b.direccion,coalesce(e.direccion,d.direccion))) end) 
from mod_logistica.dat_documentocliente a 
left join mod_datosmaestros.nom_clientesproveedor b on a.idcliente = b.idclientesproveedores
left join mod_estructuracomp.v_dametodasestructuras e on e.idestructura = b.idestructura 
left join mod_persona.dat_persona c on c.idpersona = b.idpersona
left join mod_persona.dat_direccion d on d.idpersona = c.idpersona
where a.iddocumento = dpo.idorden and b.idclientesproveedores = dpo.idcliente
) as direccion,

(select (case when a.tipocliente = 1 then (select dcb.numerocuenta from mod_datosmaestros.dat_cuentabanccliente dcb 
where dcb.idclienteproveedores = b.idclientesproveedores and dcb.predeterminado = 1)end)
from mod_logistica.dat_documentocliente a
left join mod_datosmaestros.nom_clientesproveedor b on a.idcliente = b.idclientesproveedores 
where a.iddocumento = dpo.idorden and b.idclientesproveedores = dpo.idcliente) as cuentabancaria,

(select ns.numero from mod_datosmaestros.nom_sucursal ns
inner join mod_datosmaestros.dat_cuentabanccliente dcb on dcb.idsucursal = ns.idsucursal
left join mod_datosmaestros.nom_clientesproveedor b on  dcb.idclienteproveedores = b.idclientesproveedores
left join mod_logistica.dat_documentocliente a on a.idcliente = b.idclientesproveedores
where dcb.predeterminado = 1 and a.iddocumento = dpo.idorden and b.idclientesproveedores = dpo.idcliente) as numerosucursal,

(select a.tipocliente from mod_logistica.dat_documentocliente a 
left join mod_datosmaestros.nom_clientesproveedor b on a.idcliente = b.idclientesproveedores 
where a.iddocumento = dpo.idorden and b.idclientesproveedores = dpo.idcliente) as tipocliente,
dpo.idcliente
from mod_logdistribucion.dat_prodorden dpo
left join mod_logistica.dat_producto dp on dpo.idproducto = dp.idproducto  
left join mod_logistica.nom_categoria ncat on ncat.idcategoria = dp.idcategoria
left join mod_datosmaestros.nom_indicador ni on dp.idindicador = ni.idindicador 
left join mod_datosmaestros.nom_unidadmedida dum on dp.idumedida = dum.idunidadmedida
left join mod_estructuracomp.nom_filaestruc nf on nf.idfila = dp.idestructura
left join mod_estructuracomp.dat_estructuraop desop on desop.idestructuraop = nf.idfila
left join mod_loginventario.conf_inventario ci on ci.idestructuracomun = dp.idestructuracomun
where dpo.idorden = p_iddocumento
order by dpo.idorden DESC
loop 
return next all_rec; 
end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;