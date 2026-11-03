DROP TYPE mod_loginventario.td_recepcion cascade;

CREATE TYPE mod_loginventario.td_recepcion AS (
  entidad VARCHAR,
  deposito VARCHAR,
  numerodocumento VARCHAR,
  fechadocumento DATE,
  denominacion VARCHAR,
  nrodocorigen VARCHAR,
  fechareclamacion DATE,
  nroreclamacion VARCHAR,
  nrocontrato VARCHAR,
  codigo VARCHAR,
  categoria VARCHAR,
  codigoproveedor VARCHAR,
  nombreproducto VARCHAR,
  unidadmedida VARCHAR,
  cantidadproducto NUMERIC(25,6),
  preciocontable NUMERIC(25,6),
  importetotal NUMERIC(25,6),
  manifiesto NUMERIC(19,0),
  partida NUMERIC(19,0),
  casilla NUMERIC(19,0),
  embarque NUMERIC(19,0),
  entidadtransportadora VARCHAR,
  nombretransportador VARCHAR,
  citransportador VARCHAR,
  cartaporte NUMERIC(19,0),
  matricula VARCHAR,
  saldo NUMERIC(25,6),
  logo TEXT,
  recargodescuento NUMERIC(19,6),
  preciounitariototal NUMERIC(19,6),
  fechacontrat DATE,
  observaciones VARCHAR,
  nombresuministrador VARCHAR,
  aliasdoc VARCHAR,
  reeup VARCHAR,
  codigoop VARCHAR,
  precioalternativo NUMERIC(25,6),
  importealternativo NUMERIC(25,6),
  monedaalternativa VARCHAR,
  monedacontable VARCHAR,
  codigosuministrador VARCHAR,
  estado NUMERIC(2,0),
  numeroref NUMERIC(19,0),
  fechadocorigen DATE,
  cantbulto NUMERIC(25,6),
  tipobulto VARCHAR,
  nombrepersona VARCHAR,
  cargopersona VARCHAR,
  nombrepersonaprobar VARCHAR,
  cargopersonaprobar VARCHAR,
  cantidadporfactura NUMERIC(25,6),
  idproducto NUMERIC,
  registrarcantidad BOOLEAN,
  ubicacion VARCHAR
);


CREATE OR REPLACE FUNCTION mod_loginventario.f_modelorecepcion (
  p_iddocumento numeric,
  p_monedaalternativa numeric,
  p_monedacontable numeric
)
RETURNS SETOF mod_loginventario.td_recepcion AS
$body$
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
(case when (ni.numeropieza is null or ni.numeropieza = '') then ni.codigo else ni.numeropieza END),
nc.denominacion as categoria,
ni.numeropieza,
ni.denominacion as nombreproducto,
dum.abreviaturaunidadmedida as unidadmedida,
coalesce(dm.cantidad,0) as cantidadproducto,
coalesce(round(dm.preciocontable,2),0),
coalesce(round(dm.importecontable,2),0),
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
dp.cantidad,
i.urllogo as icono,
coalesce(round(dm.recargodescuento,2),0),
coalesce(round(dm.preciocontable,2),0) + coalesce(round(dm.recargodescuento/dm.cantidad,2),0) as preciounitariototal,
dr.fechacontrato,
dd.observaciones,(case when ddc.tipocliente = 3 then (select denominacion from mod_estructuracomp.dat_estructuraop where idestructuraop = ddc.idcliente) else 
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
coalesce(dm.precioalternativo,0),
coalesce(round(dm.importealternativo,2),0),
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedaalternativa,           
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedacontable,        
(case when ddc.tipocliente = 3 then (select codigo from mod_estructuracomp.dat_estructuraop where idestructuraop = ddc.idcliente) else 
(select coalesce(ded.codigo,(coalesce(ddi.numero,c.codigo)))
from mod_logistica.dat_documentocliente ddc 
    left join mod_datosmaestros.nom_clientesproveedor c on c.idclientesproveedores = ddc.idcliente 
    left join mod_estructuracomp.v_dametodasestructuras ded on ded.idestructura = c.idestructura 
    left join mod_persona.dat_persona dper on dper.idpersona = c.idpersona
    left join mod_persona.dat_docidentidad ddi on ddi.idpersona = dper.idpersona
    where ddc.iddocumento =dd.iddocumento limit 1) end) as codigosuministrador,
    dd.estado,
    ddo.numeroref as numeroref,
    dr.fechadocorigen as fechadocorigen,
dr.cantbulto,
dr.tipobulto,

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
dmr.cantidad as cantidadporfactura,dm.idproducto, 
(case when ci.registrarcantidad = 1 then true else false END) as registrarcantidad,
(
	select concat(eup.descripcion,' ',eup2.descripcion,' ', eu.descripcion) 
    from mod_logubicacion.dat_ubicacionproducto up 
    inner join mod_logubicacion.dat_estructuraubicacion eu on eu.idestructuraubicacion = up.idubicacion
    left join mod_logubicacion.dat_estructuraubicacion eup2 on eup2.idestructuraubicacion = eu.idpadre and eup2.idestructuraubicacion <> eup2.idpadre
    left join mod_logubicacion.dat_estructuraubicacion eup on eup.idarea = eu.idarea and eup.idestructuraubicacion = eup.idpadre
    where up.idproducto = dp.idproducto limit 1
) as ubicacion
from mod_logistica.dat_documento dd
inner join mod_logistica.dat_documentocliente ddc on ddc.iddocumento = dd.iddocumento 
inner join mod_datosmaestros.dat_documentoprim dpr on dpr.iddoc = dd.iddoc
inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = dpr.idestructurasubsist
inner join mod_loginventario.conf_inventario ci on ci.idestructuracomun = des.idestructuracomun
inner join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = des.idestructuracomun
left join mod_logistica.dat_movimiento dm on dd.iddocumento = dm.iddocumento
left join mod_loginventario.dat_movrecepcion dmr on dmr.idmovimiento = dm.idmovimiento
left join mod_datosmaestros.nom_unidadmedida dum on dum.idunidadmedida = dm.idunidadmedida
left join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto 
left join mod_logistica.nom_categoria nc on nc.idcategoria = dp.idcategoria
left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
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
where dd.iddocumento = $1
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;