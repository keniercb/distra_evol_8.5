DROP FUNCTION IF EXISTS mod_loginventario.f_modelovalentrega(numeric);
DROP FUNCTION IF EXISTS mod_loginventario.f_modelovalentrega(numeric, numeric, numeric);

DROP TYPE IF EXISTS mod_loginventario.td_modelovalentrega;

CREATE TYPE mod_loginventario.td_modelovalentrega AS
(
	almacen character varying,
	nrodoc character varying,
	fechacreacion date,
	deposito character varying,
	centrocosto character varying,
	aprobadopor character varying,
	logo text,
	nrodocorigen numeric(19,0),
	fechadocumento date,
	denominacion character varying,
	observaciones character varying,
	codigo character varying,
	denominacionproducto character varying,
	estado numeric(2,0),
	numeroref numeric(19,0),
	nombrepersona character varying,
	cargopersona character varying,
	nombrepersonaprobar character varying,
	cargopersonaprobar character varying,
	operacion character varying
);

ALTER TYPE mod_loginventario.td_modelovalentrega OWNER TO zeolides;

--mod_loginventario.f_modelovalentrega(numeric);
CREATE OR REPLACE FUNCTION mod_loginventario.f_modelovalentrega(
	p_iddocumento numeric)
    RETURNS SETOF mod_loginventario.td_modelovalentrega 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
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
$BODY$;

ALTER FUNCTION mod_loginventario.f_modelovalentrega(numeric)
    OWNER TO zeolides;


--f_modelovalentrega(numeric, numeric, numeric)

CREATE OR REPLACE FUNCTION mod_loginventario.f_modelovalentrega(
	p_iddocumento numeric,
	p_monedaalternativa numeric,
	p_monedacontable numeric)
    RETURNS SETOF mod_loginventario.td_modelovalentrega 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$

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
ni.codigo,
ni.denominacion,
num.abreviaturaunidadmedida as unidadmedida,
coalesce(dm.cantidad,0) as disponible,
coalesce(dm.preciocontable,0) as precio,
coalesce(round(dm.importecontable,2),0) as importe,
--coalesce(dp.cantidad,0) as existencia,
coalesce(dm.existenciaactual,0) as existencia,
i.urllogo,
0,--_dd.nrodoc,
now(),--_dd.fechacontable,
_ddp.sigla,
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
where a.idusuario = dd.aprobadopor limit 1) as cargopersonaprobar

from mod_logistica.dat_documento dd
left join mod_logistica.dat_documentopadre dpdre on dpdre.iddocumento = dd.iddocumento
inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
LEFT join mod_logistica.dat_documento _dd on _dd.iddocumento = dpdre.idpadre
LEFT join mod_datosmaestros.dat_documentoprim _ddp on _ddp.iddoc = _dd.iddoc
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
where dd.iddocumento = $1
loop return next all_rec; end loop;
end;
$BODY$;

ALTER FUNCTION mod_loginventario.f_modelovalentrega(numeric, numeric, numeric)
    OWNER TO zeolides;

