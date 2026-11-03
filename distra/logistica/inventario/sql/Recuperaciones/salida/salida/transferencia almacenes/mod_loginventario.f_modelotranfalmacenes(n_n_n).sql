DROP FUNCTION IF EXISTS mod_loginventario.f_modelotranfalmacenes(numeric, numeric, numeric);
DROP TYPE IF EXISTS mod_loginventario.td_tranferenciaentrealmacenes;

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
	codprod character varying,
	denomprod character varying,
	um character varying,
	punitario numeric(25,6),
	cantpsum numeric(25,6),
	importepsum numeric(25,6),
	saldopsum numeric(25,6),
	cantprecep numeric(25,6),
	importeprecep numeric(25,6),
	saldoprecep numeric(25,6),
	numeropieza character varying,
	precioalternativo numeric(25,6),
	importealternativo numeric(25,6),
	monedaalternativa character varying,
	monedacontable character varying,
	precioalternativopadre numeric(25,6),
	importealternativopadre numeric(25,6),
	idproducto numeric(19,0),
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
	centrocosto character varying
);

ALTER TYPE mod_loginventario.td_tranferenciaentrealmacenes OWNER TO zeolides;

CREATE OR REPLACE FUNCTION mod_loginventario.f_modelotranfalmacenes(
	p_iddocumento numeric,
	p_monedaalternativa numeric,
	p_monedacontable numeric)
    RETURNS SETOF mod_loginventario.td_tranferenciaentrealmacenes 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$

declare
all_rec mod_loginventario.td_tranferenciaentrealmacenes;
begin
--raise exception 'asdsadasd';
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
coalesce(round(dm.importecontable,2),0) as importeprecep,
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
(
  select ncct.codigocentrogrupo ||' - '|| ncct.descripcioncentrogrupo from 
        mod_contabilidadcosto.nom_centrocosto ncct  
	where (ncct.idcentrogrupo = dd.idcentrocostotransf OR ncct.codigocentrogrupo = dd.idcentrocostotransf::varchar) limit 1
)::varchar

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
inner join mod_logistica.dat_documentocliente ddc on ddc.iddocumento = dd.iddocumento
inner join mod_estructuracomp.v_dametodasestructuras deop on deop.idestructura = ddc.idcliente
left join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento
left join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
left join mod_datosmaestros.nom_unidadmedida dum on dum.idunidadmedida = dp.idumedida
left join mod_logistica.conf_general i on i.idestructura = de.idestructura   
left join mod_logistica.dat_documentotransporte ddt on ddt.iddocumento = dd.iddocumento
left join mod_loginventario.conf_inventario cio on cio.idestructuracomun = deso.idestructuracomun
left join mod_estructuracomp.dat_estructuraop deopo on deopo.idestructuraop = ddo.idestructuracomun
where dd.iddocumento = $1
order by dp.idproducto
loop return next all_rec; end loop;
end;
$BODY$;

ALTER FUNCTION mod_loginventario.f_modelotranfalmacenes(numeric, numeric, numeric)
    OWNER TO zeolides;
