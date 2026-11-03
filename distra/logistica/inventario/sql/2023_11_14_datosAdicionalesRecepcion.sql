ALTER TABLE mod_loginventario.dat_recepcion
  ADD COLUMN IF NOT EXISTS idcontrato numeric(19,0);

ALTER TABLE mod_loginventario.dat_recepcion
  ADD COLUMN IF NOT EXISTS contenedor VARCHAR(100);

ALTER TABLE mod_loginventario.dat_recepcion
  ADD COLUMN IF NOT EXISTS bl VARCHAR(100);
  
ALTER TABLE mod_loginventario.dat_recepcion
  ADD COLUMN IF NOT EXISTS puertodestino VARCHAR(255);

ALTER TABLE mod_loginventario.dat_recepcion
  ADD COLUMN IF NOT EXISTS idpuertodestino numeric(19,0);

ALTER TABLE mod_loginventario.dat_recepcion
  ADD COLUMN IF NOT EXISTS destinocomercial VARCHAR(255);

ALTER TABLE mod_loginventario.dat_recepcion
  ADD COLUMN IF NOT EXISTS prodgenerico VARCHAR(255);    
  
  
-- Type: td_recepcion

DROP TYPE IF EXISTS mod_loginventario.td_recepcion CASCADE;

CREATE TYPE mod_loginventario.td_recepcion AS
(
	entidad character varying,
	deposito character varying,
	numerodocumento character varying,
	fechadocumento date,
	denominacion character varying,
	nrodocorigen character varying,
	fechareclamacion date,
	nroreclamacion character varying,
	nrocontrato character varying,
	manifiesto numeric(19,0),
	partida numeric(19,0),
	casilla numeric(19,0),
	embarque numeric(19,0),
	entidadtransportadora character varying,
	nombretransportador character varying,
	citransportador character varying,
	cartaporte numeric(19,0),
	matricula character varying,
	logo text,
	fechacontrat date,
	observaciones character varying,
	nombresuministrador character varying,
	aliasdoc character varying,
	reeup character varying,
	codigoop character varying,
	codigosuministrador character varying,
	estado numeric(2,0),
	numeroref numeric(19,0),
	fechadocorigen date,
	cantbulto numeric(25,6),
	tipobulto character varying,
	nombrepersona character varying,
	cargopersona character varying,
	nombrepersonaprobar character varying,
	cargopersonaprobar character varying,
	registrarcantidad NUMERIC,
	bl VARCHAR,
	contenedor VARCHAR,
	puertodestino VARCHAR,
	destinocomercial VARCHAR,
	prodgenerico VARCHAR
);

ALTER TYPE mod_loginventario.td_recepcion
    OWNER TO zeolides;
	
-- FUNCTION: mod_loginventario.f_modelorecepcion(numeric)

-- DROP FUNCTION IF EXISTS mod_loginventario.f_modelorecepcion(numeric);

CREATE OR REPLACE FUNCTION mod_loginventario.f_modelorecepcion(
	p_iddocumento numeric)
    RETURNS SETOF mod_loginventario.td_recepcion 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$

declare
all_rec mod_loginventario.td_recepcion;
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
nop.denominacion,
dr.nrodocorigen,
(select ddo.fechacontable from mod_loginventario.dat_reclamacion drr   where drr.iddocumento = ddo.iddocumento limit 1) as fechareclamacion,

(case when cio.idestructuracomun = cio.idpadre then (case when cio.esminfar = 0 then cast(ddo.nrodoc as varchar) when cio.esminfar = 1 then cast(ddo.nrodoc as varchar) end)
     when cio.idestructuracomun <> cio.idpadre then (case when cio.esminfar = 0 then cast(ddo.nrodoc as varchar) when cio.esminfar = 1 then btrim(concat(ddo.nrodoc,'-',deo.codigo,'-',deopo.codigo),'-') end)
end) as nroreclamacion,
--(select ddo.nrodoc from mod_loginventario.dat_reclamacion _dr where _dr.iddocumento = ddo.iddocumento limit 1) as nroreclamacion,
dr.nrocontrato,
ddt.manifiesto,
ddt.partida,
ddt.casilla,
ddt.embarque,
(select coalesce(c.nombre,coalesce(de.denominacion,concat(dper0.nombre,' ',dper0.snombre,' ',dper0.papel,' ',dper0.sapel)))
from mod_logistica.dat_documentotransporte ddt 
    left join mod_datosmaestros.nom_clientesproveedor c on c.idclientesproveedores = ddt.idorganizacion 
    left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = c.idestructura 
    left join mod_persona.dat_persona dper0 on dper0.idpersona = c.idpersona
    where ddt.iddocumento =dd.iddocumento limit 1) as enttransp,
ddt.nombreconductor,
ddt.ciconductor,
ddt.cartaporte,
ddt.matricula,
i.urllogo as icono,
dr.fechacontrato,
dd.observaciones,
(case when ddc.tipocliente = 3 then (select denominacion from mod_estructuracomp.dat_estructuraop where idestructuraop = ddc.idcliente) else 
(select coalesce(c.nombre,coalesce(dee.denominacion,(concat(dper.nombre,' ',dper.snombre,' ',dper.papel,' ',dper.sapel))))
from mod_logistica.dat_documentocliente ddc 
    left join mod_datosmaestros.nom_clientesproveedor c on c.idclientesproveedores = ddc.idcliente 
    left join mod_estructuracomp.v_dametodasestructuras dee on dee.idestructura = c.idestructura 
    left join mod_persona.dat_persona dper on dper.idpersona = c.idpersona
    where ddc.iddocumento =dd.iddocumento limit 1) end)
 as suministrador,
ndp.denominacion,
de.codigo as reeup,
deop.codigo as codigoop,      
(case when ddc.tipocliente = 3 then (select codigo from mod_estructuracomp.dat_estructuraop where idestructuraop = ddc.idcliente) else 
(select coalesce(ded.codigo,(coalesce(ddi.numero,c.codigo)))
from mod_logistica.dat_documentocliente ddc 
    left join mod_datosmaestros.nom_clientesproveedor c on c.idclientesproveedores = ddc.idcliente 
    left join mod_estructuracomp.v_dametodasestructuras ded on ded.idestructura = c.idestructura 
    left join mod_persona.dat_persona dper on dper.idpersona = c.idpersona
    left join mod_persona.dat_docidentidad ddi on ddi.idpersona = dper.idpersona
    where ddc.iddocumento =dd.iddocumento limit 1) end) as codigosuministrador,
    (case when (select count(pppd.idpedido) from mod_logpuntoventa.dat_pedidodocumento pppd where pppd.iddocumento = dd.iddocumento) > 0 then 4 else dd.estado end) as estado,
    dd.numeroref as numeroref,
    dr.fechadocorigen as fechadocorigen,
dr.cantbulto,
dr.tipobulto,

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
null as registrarcantidad,
(select f.denominacion from mod_seguridad.seg_usuario a
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
inner join mod_persona.dat_personaentidad c on c.idpersona = b.idpersona and (c.fhasta > now() or c.fhasta is null )
inner join mod_persona.dat_situacionlaboral d on d.idpersonaentidad = c.idpersonaentidad and (d.fhasta > now() or d.fhasta is null)
inner join mod_estructuracomp.dat_cargo e on e.idcargo = d.idcargo
inner join mod_estructuracomp.nom_cargo f on f.idnomcargo = e.idnomcargo
where a.idusuario = dd.aprobadopor limit 1) as cargopersonaprobar,
dr.bl,dr.contenedor,dr.puertodestino, dr.destinocomercial,dr.prodgenerico
from mod_logistica.dat_documento dd
inner join mod_logistica.dat_documentocliente ddc on ddc.iddocumento = dd.iddocumento 
inner join mod_datosmaestros.dat_documentoprim dpr on dpr.iddoc = dd.iddoc
inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = dpr.idestructurasubsist
inner join mod_loginventario.conf_inventario ci on ci.idestructuracomun = des.idestructuracomun
inner join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = des.idestructuracomun
inner join mod_loginventario.dat_recepcion dr on dr.iddocumento = dd.iddocumento
inner join mod_estructuracomp.nom_filaestruc nf on nf.idfila = dd.idestructuracomun
inner join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = nf.idfila
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = dpr.iddocumentos
left join mod_logistica.dat_documentotransporte ddt on ddt.iddocumento = dd.iddocumento
left join mod_datosmaestros.nom_clientesproveedor ncp on ncp.idclientesproveedores = ddt.idorganizacion
left join mod_datosmaestros.nom_operacion nop on nop.idnomoperaciones = dd.idoperacion
left join mod_logistica.conf_general i on i.idestructura = de.idestructura        
left join mod_logistica.dat_documentopadre ddp on ddp.idpadre = dd.iddocumento
left join mod_logistica.dat_documento ddo on ddo.iddocumento = ddp.iddocumento
left join mod_datosmaestros.dat_documentoprim ddpo on ddpo.iddoc = ddo.iddoc
left join mod_datosmaestros.dat_estructurasubsist deso on deso.idestructurasubsist = ddpo.idestructurasubsist
left join mod_estructuracomp.v_dametodasestructuras deo on deo.idestructura = deso.idestructuracomun
left join mod_loginventario.conf_inventario cio on cio.idestructuracomun = deso.idestructuracomun
left join mod_estructuracomp.dat_estructuraop deopo on deopo.idestructuraop = ddo.idestructuracomun
where dd.iddocumento = p_iddocumento
loop return next all_rec; end loop;
end;
$BODY$;

ALTER FUNCTION mod_loginventario.f_modelorecepcion(numeric)
    OWNER TO zeolides;

  