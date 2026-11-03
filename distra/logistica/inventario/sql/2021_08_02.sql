DROP TYPE mod_loginventario.td_modelovaledevolucion CASCADE;
CREATE TYPE mod_loginventario.td_modelovaledevolucion AS (
  nroorigina VARCHAR,
  nrohijo VARCHAR,
  forigina DATE,
  fhijo DATE,
  observaciones VARCHAR,
  aliasdocorigina VARCHAR,
  aliasdochijo VARCHAR,
  entregado VARCHAR,
  logo VARCHAR,
  entidad VARCHAR,
  reeup VARCHAR,
  deposito VARCHAR,
  codigo VARCHAR,
  estado NUMERIC(2,0),
  numeroref NUMERIC(19,0),
  categoria VARCHAR,
  nombrepersona VARCHAR,
  cargopersona VARCHAR,
  nombrepersonaprobar VARCHAR,
  cargopersonaprobar VARCHAR
);

ALTER TYPE mod_loginventario.td_modelovaledevolucion
  OWNER TO zeolides;
CREATE OR REPLACE FUNCTION mod_loginventario.f_modelovaledevolucion (
  p_iddocumento numeric
)
RETURNS SETOF mod_loginventario.td_modelovaledevolucion AS
$body$
declare
v_rec mod_loginventario.td_modelovaledevolucion;
begin
for v_rec in
select
(case when cio.idestructuracomun = cio.idpadre then (case when cio.esminfar = 0 then cast(ddo.nrodoc as varchar) when cio.esminfar = 1 then cast(ddo.nrodoc as varchar) end)
     when cio.idestructuracomun <> cio.idpadre then (case when cio.esminfar = 0 then cast(ddo.nrodoc as varchar) when cio.esminfar = 1 then btrim(concat(ddo.nrodoc,'-',(select deo.codigo from mod_estructuracomp.dat_estructura deo where de.idestructura = deso.idestructuracomun limit 1),'-',deop.codigo),'-') end)
end) as nroorigina,

(case when cih.idestructuracomun = cih.idpadre then (case when cih.esminfar = 0 then cast(ddh.nrodoc as varchar) when cih.esminfar = 1 then cast(ddh.nrodoc as varchar) end)
     when cih.idestructuracomun <> cih.idpadre then (case when cih.esminfar = 0 then cast(ddh.nrodoc as varchar) when cih.esminfar = 1 then btrim(concat(ddh.nrodoc,'-',de.codigo,'-',deop.codigo),'-') end)
end) as nrohijo,

ddo.fechacontable as forigina,
ddh.fechacontable as fhijo,
ddh.observaciones,
ndpo.denominacion as aliasdocorigina,
ndph.denominacion as aliasdochijo,
coalesce( (select nc.descripcioncentrogrupo from mod_contabilidadcosto.nom_centrocosto nc where nc.idcentrogrupo =  ddc.idcliente limit 1),
(select  coalesce(ncp.nombre,coalesce(de1.denominacion,concat(dper.nombre,' ',dper.snombre,' ',dper.papel,' ',dper.sapel)))
  from mod_datosmaestros.nom_clientesproveedor ncp
  left join mod_estructuracomp.v_dametodasestructuras de1 on ncp.idestructura = de1.idestructura
  left join mod_persona.dat_persona dper on ncp.idpersona = dper.idpersona
  where ncp.idclientesproveedores = ddc.idcliente limit 1)
) as entregado,
i.urllogo,

(case when cih.idestructuracomun = cih.idpadre then (case when cih.esminfar = 0 then btrim(concat(de.codigo,'-',de.denominacion),'-') when cih.esminfar = 1 then de.codigo end)
     when cih.idestructuracomun <> cih.idpadre then (case when cih.esminfar = 0 then btrim(concat(de.codigo,'-',de.denominacion),'-') when cih.esminfar = 1 then (select codigo from mod_estructuracomp.dat_estructura where idestructura = cih.idpadre limit 1) end)
end) as entidad,

de.codigo,
btrim(concat(deop.codigo,'-',deop.denominacion ),'-') as deposito,
deop.codigo,
ddh.estado,
ddo.numeroref,
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
where a.idusuario = ddh.idusuario limit 1) as cargopersona,

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
where a.idusuario = ddh.aprobadopor limit 1) as cargopersonaprobar

from mod_logistica.dat_documento ddh
inner join mod_logistica.dat_documentopadre ddp on ddp.iddocumento = ddh.iddocumento
inner join mod_logistica.dat_documento ddo on ddo.iddocumento = ddp.idpadre
inner join mod_datosmaestros.dat_documentoprim ddprimh on ddprimh.iddoc = ddh.iddoc
inner join mod_datosmaestros.nom_docprim ndph on ndph.iddocumentos = ddprimh.iddocumentos
inner join mod_datosmaestros.dat_documentoprim ddprimo on ddprimo.iddoc = ddo.iddoc
inner join mod_datosmaestros.nom_docprim ndpo on ndpo.iddocumentos = ddprimo.iddocumentos
inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddprimh.idestructurasubsist
inner join mod_datosmaestros.dat_estructurasubsist deso on deso.idestructurasubsist = ddprimo.idestructurasubsist
/*inner join mod_estructuracomp.dat_estructura de on de.idestructura = des.idestructuracomun*/
inner join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = ddh.idestructuracomun
inner join mod_estructuracomp.dat_estructuraop deopo on deopo.idestructuraop = ddo.idestructuracomun
inner join mod_seguridad.seg_usuario su on su.idusuario = ddh.idusuario
inner join mod_loginventario.conf_inventario cih on cih.idestructuracomun = des.idestructuracomun
inner join mod_loginventario.conf_inventario cio on cio.idestructuracomun = deso.idestructuracomun
left join mod_seguridad.seg_usuario su1 on su1.idusuario = ddh.aprobadopor

left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = des.idestructuracomun

left join mod_logistica.conf_general i on i.idestructura = de.idestructura
left join mod_logistica.dat_documentocliente ddc on ddc.iddocumento = ddo.iddocumento
where ddh.iddocumento = p_iddocumento
loop return next v_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION mod_loginventario.f_modelovaledevolucion (p_iddocumento numeric)
  OWNER TO postgres;

  DROP TYPE mod_loginventario.td_modelovaledevolucionproducto CASCADE;
CREATE TYPE mod_loginventario.td_modelovaledevolucionproducto AS (
  abreviaturaunidadmedida VARCHAR,
  cantidad NUMERIC(25,6),
  preciocontable NUMERIC(25,6),
  importecontable NUMERIC(25,6),
  numeropieza VARCHAR,
  codigo VARCHAR,
  producto VARCHAR,
  existencia NUMERIC(25,6),
  precioalternativo NUMERIC(25,6),
  importealternativo NUMERIC(25,6),
  monedaalternativa VARCHAR,
  monedacontable VARCHAR,
  categoria VARCHAR
);

ALTER TYPE mod_loginventario.td_modelovaledevolucionproducto
  OWNER TO zeolides;
  
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
ni.codigo,
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

ALTER FUNCTION mod_loginventario.f_modelovaledevolucionproducto (p_iddocumento numeric, p_monedaalternativa numeric, p_monedacontable numeric)
  OWNER TO zeolides;