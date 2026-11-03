-- FUNCTION: mod_logdistribucion.f_modelodistribucion(numeric)

DROP FUNCTION IF EXISTS mod_logdistribucion.f_modelodistribucion(numeric);
DROP FUNCTION IF EXISTS mod_logdistribucion.f_modelodistribucion(numeric, numeric, numeric);

DROP TYPE IF EXISTS mod_logdistribucion.td_modelodistribucion;
DROP TYPE IF EXISTS mod_logdistribucion.td_modelodistribucion_monedas;

CREATE TYPE mod_logdistribucion.td_modelodistribucion_monedas AS
(
	entidad character varying,
	nrodoc numeric(19,0),
	fechacontable date,
	observaciones character varying,
	codigoproducto character varying,
	denominacionproducto character varying,
	numeropieza character varying,
	entregar character varying,
	cantidadproducto numeric(25,6),
	unidadmedida character varying,
	logo text,
	reeup character varying,
	aliasdoc character varying,
	categoria character varying,
	precio numeric(25,6),
	importe numeric(25,6),
	deposito character varying,
	direccioncliente character varying,
	cuentabancaria character varying,
	numerosucursal character varying,
	cantdespechada numeric(25,6),
	cantparcial numeric(25,6),
	tipocliente numeric(1,0),
	estado numeric(2,0),
	denominventario character varying,
	suministrador character varying,
	especialidad character varying,
	cantotal numeric(25,6),
	idcliente numeric(19,0),
	nombrepersona character varying,
	cargopersona character varying,
	nombrepersonaprobar character varying,
	cargopersonaprobar character varying,
	precioalternativo numeric(25,6),
	importealternativo numeric(25,6),
	monedaalternativa character varying,
	monedacontable character varying
);

ALTER TYPE mod_logdistribucion.td_modelodistribucion_monedas OWNER TO zeolides;


CREATE OR REPLACE FUNCTION mod_logdistribucion.f_modelodistribucion(
	p_iddocumento numeric,
	p_monedaalternativa numeric,
	p_monedacontable numeric)
    RETURNS SETOF mod_logdistribucion.td_modelodistribucion_monedas
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
declare
 all_rec mod_logdistribucion.td_modelodistribucion_monedas;
begin
 for all_rec in
select DISTINCT
--btrim(concat(dd.nrodoc,'-',de.codigo,'-',de.denominacion),'-'),
de.denominacion,
dd.nrodoc,
dd.fechacontable,
dd.observaciones,
(case when (ni.numeropieza is null or ni.numeropieza = '') then ni.codigo else ni.numeropieza END),
ni.denominacion as denominacionproducto,
ni.numeropieza,
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
dpo.cantidad,
dum.abreviaturaunidadmedida,
i.urllogo,
de.codigo as reuup,
ndp.denominacion,
ncat.denominacion as categoria,
dp.precio as precio,
coalesce(dp.precio * dpo.cantidad,0) as importe, 
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

(select dpoc.entregado from mod_logdistribucion.dat_prodordencmpto dpoc where dpoc.idprodorden = dpo.idprodorden)  as cantdespachado,

(select (dpoc.cantidadoriginal - dpoc.entregado) from mod_logdistribucion.dat_prodordencmpto dpoc where dpoc.idprodorden = dpo.idprodorden)  as catparcial,

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
(select denominacion from mod_estructuracomp.dat_estructuraop where idestructuraop = dp.idestructura and idproyecto = 0)),'-')) 
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
where a.idusuario = dd.aprobadopor) as cargopersonaprobar,

dp.precioalternativo as preciocuc,
coalesce(dp.precioalternativo * dpo.cantidad,0) as importecuc,

(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedaalternativa,           
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedacontable

from mod_logistica.dat_documento dd 
inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
inner join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = des.idestructuracomun
inner join mod_logdistribucion.dat_distribucion ddis on ddis.iddistribucion = dd.iddocumento
left join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = dd.idestructuracomun
left join mod_logdistribucion.dat_prodorden dpo on dpo.idorden = dd.iddocumento
left join mod_logistica.dat_producto dp on dpo.idproducto = dp.idproducto  
left join mod_loginventario.conf_inventario ci on ci.idestructuracomun = dp.idestructuracomun
left join mod_logistica.nom_categoria ncat on ncat.idcategoria = dp.idcategoria
left join mod_datosmaestros.nom_indicador ni on dp.idindicador = ni.idindicador 
left join mod_datosmaestros.nom_unidadmedida dum on dp.idumedida = dum.idunidadmedida
left join mod_estructuracomp.nom_filaestruc nf on nf.idfila = dp.idestructura
left join mod_estructuracomp.dat_estructuraop desop on desop.idestructuraop = nf.idfila
left join mod_logistica.conf_general i on i.idestructura = de.idestructura
where dd.iddocumento = $1
order by entregara
loop return next all_rec; end loop;
end;
$BODY$;

ALTER FUNCTION mod_logdistribucion.f_modelodistribucion(numeric, numeric, numeric) OWNER TO zeolides;
--cimex
CREATE TYPE mod_logdistribucion.td_modelodistribucion AS
(
	entidad character varying,
	nrodoc numeric(19,0),
	fechacontable date,
	observaciones character varying,
	logo text,
	reeup character varying,
	aliasdoc character varying,
	estado numeric(2,0),
	suministrador character varying,
	especialidad character varying,
	nombrepersona character varying,
	cargopersona character varying,
	nombrepersonaprobar character varying,
	cargopersonaprobar character varying,
	denominventario character varying(255)
);

ALTER TYPE mod_logdistribucion.td_modelodistribucion OWNER TO zeolides;

CREATE OR REPLACE FUNCTION mod_logdistribucion.f_modelodistribucion(
	p_iddocumento numeric)
    RETURNS SETOF mod_logdistribucion.td_modelodistribucion 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
declare
 all_rec mod_logdistribucion.td_modelodistribucion;
begin
 for all_rec in
  select distinct btrim(concat(dd.nrodoc,'-',de.codigo,'-',de.denominacion),'-'),
   coalesce (dd.nrodoc,dd.numeroref),
   dd.fechacontable,
   dd.observaciones,
   i.urllogo,
   de.codigo as reuup,
   ndp.denominacion,
   dd.estado,
   (select btrim((array_to_string(array_agg (distinct (case when dp.idestructuracomun = ci.idestructuracomun 
                  and ci.idestructuracomun <> ci.idpadre 
                 then (btrim(concat((select codigo from mod_estructuracomp.v_dametodasestructuras 
                       where idestructura = ci.idpadre),'-',
                      (select denominacion from mod_estructuracomp.v_dametodasestructuras 
                       where idestructura = dp.idestructuracomun)),'-'))
                 when dp.idestructuracomun = ci.idestructuracomun and ci.idestructuracomun = ci.idpadre 
                 then (btrim(concat((select codigo from mod_estructuracomp.v_dametodasestructuras 
                       where idestructura = dp.idestructuracomun),'-',
                      (select denominacion from mod_estructuracomp.dat_estructuraop 
                       where idestructuraop = dp.idestructura and idproyecto = 0)),'-'))
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
 loop 
  return next all_rec;
 end loop;
end;
$BODY$;

ALTER FUNCTION mod_logdistribucion.f_modelodistribucion(numeric) OWNER TO zeolides;
