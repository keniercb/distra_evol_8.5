DROP FUNCTION IF EXISTS mod_loginventario.f_modelotranfalmacenes(numeric);
DROP TYPE IF EXISTS mod_loginventario.td_tranferenciaentrealmacenes;

-- DROP TYPE IF EXISTS mod_loginventario.td_tranferenciaentrealmacenes;

CREATE TYPE mod_loginventario.td_tranferenciaentrealmacenes AS
(
	entidad character varying,
	reeup character varying,
	aliasdoc character varying,
	nrodoc character varying,
	fechacontable date,
	observaciones character varying,
	logo text,
	almsum character varying,
	dirsum character varying,
	codsum character varying,
	almrecep character varying,
	direcep character varying,
	codrecep character varying,
	estado numeric(2,0),
	entidadtransp character varying,
	direntidadtransp character varying,
	casilla numeric(19,0),
	ciconductor character varying,
	chapa character varying,
	cartaporte numeric(19,0),
	nrodocorigen character varying,
	aliasdocorigen character varying,
	fechadocorigen date,
	nombreconductor character varying,
	nombrepersona character varying,
	cargopersona character varying,
	nombrepersonaprobar character varying,
	cargopersonaprobar character varying,
	cliente character varying,
	operacion character varying(255)
);

ALTER TYPE mod_loginventario.td_tranferenciaentrealmacenes OWNER TO zeolides;

-- DROP FUNCTION IF EXISTS mod_loginventario.f_modelotranfalmacenes(numeric);

CREATE OR REPLACE FUNCTION mod_loginventario.f_modelotranfalmacenes(
	p_iddocumento numeric)
    RETURNS SETOF mod_loginventario.td_tranferenciaentrealmacenes 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
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
deop.denominacion as cliente,
nop.denominacion as operacion
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
left join mod_datosmaestros.nom_operacion nop on nop.idnomoperaciones = dd.idoperacion
where dd.iddocumento = p_iddocumento
limit 1
loop return next all_rec; end loop;
end;
$BODY$;

ALTER FUNCTION mod_loginventario.f_modelotranfalmacenes(numeric) OWNER TO zeolides;
