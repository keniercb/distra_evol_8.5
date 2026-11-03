ALTER TYPE mod_loginventario.td_ajuste
  DROP ATTRIBUTE codigo,
  DROP ATTRIBUTE categoria,
  DROP ATTRIBUTE codigoproveedor,
  DROP ATTRIBUTE nombreproducto,
  DROP ATTRIBUTE unidadmedida,
  DROP ATTRIBUTE cantidadproducto,
  DROP ATTRIBUTE preciocontable,
  DROP ATTRIBUTE importetotal,
  DROP ATTRIBUTE precioalternativo,
  DROP ATTRIBUTE importealternativo,
  DROP ATTRIBUTE monedaalternativa,
  DROP ATTRIBUTE monedacontable,
  DROP ATTRIBUTE cuenta,
  DROP ATTRIBUTE cuentaalt,
  DROP ATTRIBUTE existencia,
  DROP ATTRIBUTE existenciainventario,
  DROP ATTRIBUTE importefinal,
  DROP ATTRIBUTE precioalternativoant,
  DROP ATTRIBUTE preciocontableant;


 -- object recreation
DROP FUNCTION mod_loginventario.f_modeloajuste(p_iddocumento numeric, p_monedaalternativa numeric, p_monedacontable numeric);

CREATE FUNCTION mod_loginventario.f_modeloajuste (
  p_iddocumento numeric
)
RETURNS SETOF mod_loginventario.td_ajuste AS
$body$
declare
all_rec mod_loginventario.td_ajuste;
begin
for all_rec in
select distinct
(case when ci.idestructuracomun = ci.idpadre then (case when ci.esminfar = 0 then (btrim(concat(de.codigo,'-',de.denominacion),'-')) when ci.esminfar = 1 then de.codigo end)
     when ci.idestructuracomun <> ci.idpadre then (case when ci.esminfar = 0 then (btrim(concat(de.codigo,'-',de.denominacion),'-')) when ci.esminfar = 1 then (select codigo from mod_estructuracomp.v_dametodasestructuras where idestructura = ci.idpadre) end)
end) as entidad,

btrim(concat(deop.codigo,'-',deop.denominacion),'-'),

(case when ci.idestructuracomun = ci.idpadre then (case when ci.esminfar = 0 then cast(dd.nrodoc as varchar) when ci.esminfar = 1 then cast(dd.nrodoc as varchar) end)
     when ci.idestructuracomun <> ci.idpadre then (case when ci.esminfar = 0 then cast(dd.nrodoc as varchar) when ci.esminfar = 1 then btrim(concat(dd.nrodoc,'-',de.codigo,'-',deop.codigo),'-') end)
end) as numerodocumento,

dd.fechacontable as fechadocumento,
nop.denominacion as motivo,
nes.denespecialidad,
dd.observaciones,
i.urllogo,
ndp.denominacion,
de.codigo,
dd.estado,
dd.numeroref,

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

(select btrim(concat(b.nombre,' ',b.snombre,' ',b.papel,' ',b.sapel))
from mod_seguridad.seg_usuario a
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
where a.idusuario = daj.contabilizadopor limit 1) as nombrepersonacontab,

(select f.denominacion from mod_seguridad.seg_usuario a
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
inner join mod_persona.dat_personaentidad c on c.idpersona = b.idpersona and (c.fhasta > now() or c.fhasta is null )
inner join mod_persona.dat_situacionlaboral d on d.idpersonaentidad = c.idpersonaentidad and (d.fhasta > now() or d.fhasta is null)
inner join mod_estructuracomp.dat_cargo e on e.idcargo = d.idcargo
inner join mod_estructuracomp.nom_cargo f on f.idnomcargo = e.idnomcargo
where a.idusuario = daj.contabilizadopor limit 1) as cargopersonacontab
from mod_logistica.dat_documento dd
inner join mod_datosmaestros.dat_documentoprim dpr on dpr.iddoc = dd.iddoc
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = dpr.iddocumentos
inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = dpr.idestructurasubsist
inner join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = des.idestructuracomun
inner join mod_loginventario.conf_inventario ci on ci.idestructuracomun = des.idestructuracomun
inner join mod_estructuracomp.nom_filaestruc nf on nf.idfila = dd.idestructuracomun
inner join mod_estructuracomp.v_dametodasestructuras deop on deop.idestructura = nf.idfila
inner join mod_loginventario.dat_ajuste daj on daj.idajuste = dd.iddocumento
left join mod_datosmaestros.nom_operacion nop on nop.idnomoperaciones = daj.idoperacion
left join mod_datosmaestros.nom_especialidad nes on nes.idespecialidad = dd.idespecialidad
left join mod_logistica.conf_general i on i.idestructura = de.idestructura
where dd.iddocumento = $1
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;


DROP TYPE mod_loginventario.td_ajusteproducto CASCADE;
CREATE TYPE mod_loginventario.td_ajusteproducto AS (
  codigo VARCHAR,
  categoria VARCHAR,
  codigoproveedor VARCHAR,
  nombreproducto VARCHAR,
  unidadmedida VARCHAR,
  cantidadproducto NUMERIC(25,6),
  preciocontable NUMERIC(25,6),
  importetotal NUMERIC(25,6),
  precioalternativo NUMERIC(25,6),
  importealternativo NUMERIC(25,6),
  monedaalternativa VARCHAR,
  monedacontable VARCHAR,
  cuenta VARCHAR,
  cuentaalt VARCHAR,
  existencia VARCHAR,
  existenciainventario VARCHAR,
  importefinal VARCHAR,
  precioalternativoant VARCHAR,
  preciocontableant VARCHAR
);

ALTER TYPE mod_loginventario.td_ajusteproducto
  OWNER TO zeolides;

CREATE OR REPLACE FUNCTION mod_loginventario.f_modeloajusteproducto (
  p_iddocumento numeric,
  p_monedaalternativa numeric,
  p_monedacontable numeric
)
RETURNS SETOF mod_loginventario.td_ajusteproducto AS
$body$
declare
all_rec mod_loginventario.td_ajusteproducto;
begin
for all_rec in
select distinct
(case when (ni.numeropieza is null or ni.numeropieza = '') then ni.codigo else ni.numeropieza END),
nc.denominacion as categoria,
ni.numeropieza,
ni.denominacion as nombreproducto,
dum.abreviaturaunidadmedida as unidadmedida,
coalesce(dm.cantidad,0) as cantidadproducto,
coalesce(dm.preciocontable,0),
coalesce(dm.importecontable,0),
COALESCE(dm.precioalternativo,0),
COALESCE(dm.importealternativo,0),
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedaalternativa,
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedacontable,
(select concat(nc.concatcta,' ',nc.descripcion) from mod_contabilidad.nom_cuenta nc
inner join mod_logistica.nom_clasificacioncontable ncc on ncc.idcuenta = nc.idcuenta
where ncc.idclasificacioncontable = dp.idclasificacioncontable limit 1) as cuenta,

(select concat(nc.concatcta,' ',nc.descripcion) from mod_contabilidad.nom_cuenta nc
inner join mod_logistica.nom_clasificacioncontable ncc on ncc.idcuentaalt = nc.idcuenta
where ncc.idclasificacioncontable = dp.idclasificacioncontable limit 1) as cuentaalt,
coalesce(dp.cantidad,0) as existencia,
( case when nop.codigooperacion in ('OPER_INV_SOBRANTE') then coalesce(dp.cantidad,0) + coalesce(dm.cantidad,0)
       when nop.codigooperacion in ('OPER_INV_FALTANTE','OPER_INV_ROTURA','OPER_INV_MERMA') then coalesce(dp.cantidad,0) - coalesce(dm.cantidad,0)
       else coalesce(dp.cantidad,0)
       end) as existenciainventario,

(select sum(COALESCE(dm1.importecontable,0)) from mod_logistica.dat_movimiento dm1 where dm1.iddocumento = daj.idajuste) as importetotalcontable,

(select sum(COALESCE(dm1.importealternativo,0)) from mod_logistica.dat_movimiento dm1 where dm1.iddocumento = daj.idajuste) as importetotalalternativo,

(select sum(COALESCE(dm1.importecontable,0)) + sum(COALESCE(dm1.importealternativo,0)) from mod_logistica.dat_movimiento dm1 where dm1.iddocumento = daj.idajuste) as importetotal
from mod_loginventario.dat_ajuste daj
left join mod_logistica.dat_movimiento dm on daj.idajuste = dm.iddocumento
left join mod_datosmaestros.nom_unidadmedida dum on dum.idunidadmedida = dm.idunidadmedida
left join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
left join mod_logistica.nom_categoria nc on nc.idcategoria = dp.idcategoria
left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
left join mod_datosmaestros.nom_operacion nop on nop.idnomoperaciones = daj.idoperacion
where daj.idajuste = $1
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
SECURITY INVOKER
COST 100 ROWS 1000;

ALTER FUNCTION mod_loginventario.f_modeloajusteproducto (p_iddocumento numeric, p_monedaalternativa numeric, p_monedacontable numeric)
  OWNER TO zeolides;





CREATE OR REPLACE FUNCTION mod_loginventario.f_recdocemitidorecibido (
  p_tipodocumento varchar,
  p_cliente varchar,
  p_transportador varchar,
  p_fechainicio date,
  p_fechafin date,
  p_idestructuraop varchar,
  p_idestructuracomun numeric,
  p_idsubsistema numeric,
  p_idmonedacontable numeric,
  p_idmonedaalternativa numeric
)
RETURNS SETOF mod_loginventario.td_listadodocumentoemitidos AS
$body$
declare
all_rec mod_loginventario.td_listadodocumentoemitidos;
v_ejerciciocontable record;
v_idejercicio numeric;
begin
if p_idestructuracomun is not null and p_idsubsistema is not null then
v_ejerciciocontable = mod_logistica.f_obtenerejercicioactivo(p_idsubsistema, p_idestructuracomun);
v_idejercicio = v_ejerciciocontable.idejercicioactual;
else v_idejercicio = null; end if;

for all_rec in
select
btrim(concat(des.codigo,'-',des.denominacion),'-') as entidad,

btrim(concat(desop.codigo,'-',desop.denominacion ),'-') as deposito,

cast(dd.nrodoc as varchar) as numerodocumento,

dd.fechacontable,
case when dd.estado = 1 then 'Elaboración'
     when dd.estado = 2 then 'Preparado'
     when dd.estado = 3 then 'Aprobado'
     when dd.estado = 4 then concat('Contab.',' CD ', dcp.numerocomprobante)
     when dd.estado = 5 then 'Eliminado'
     when dd.estado = 6 then 'Anulado'
     when dd.estado = 7 then 'Cancelado'
     when dd.estado = 8 then 'Contabilizado-Anulado'
else null end as estado,
(select count(*) from mod_logistica.dat_movimiento dm where dm.iddocumento = dd.iddocumento) as cantidad,
su.nombreusuario as creadopor,
su1.nombreusuario as aprobadopor,
i.urllogo ,
ndp.denominacion,
desop.codigo,
(case when (select dea.estado
from mod_estructuracomp.nom_filaestruc nf
inner join mod_logistica.dat_estadoalmacen dea on dea.iddeposito = nf.idfila
where nf.idfila = desop.idestructura) = 1 then 'Abierto' else 'Cerrado' end) as estadoop,

(select min(ddd.fechacontable)
from mod_logistica.dat_documento ddd
left join mod_estructuracomp.v_dametodasestructuras desopp on desopp.idestructura = ddd.idestructuracomun
where desopp.idorgano = -1
and( CASE
		WHEN p_idestructuraop = '*' THEN TRUE
        WHEN p_idestructuraop IS NOT NULL THEN ( desopp.idestructura = any(cast(p_idestructuraop as numeric[])) )
        ELSE TRUE END
)
and ddd.estado in(1,2,3,4,7)) as fechaminima,

(select max(ddd.fechacontable)
from mod_logistica.dat_documento ddd
left join mod_estructuracomp.v_dametodasestructuras desopp on desopp.idestructura = ddd.idestructuracomun
where desopp.idorgano = -1
and( CASE
		WHEN p_idestructuraop = '*' THEN TRUE
        WHEN p_idestructuraop IS NOT NULL THEN ( desopp.idestructura = any(cast(p_idestructuraop as numeric[])) )
        ELSE TRUE END
)
and ddd.estado in(1,2,3,4,7)) as fechamaxima,
dd.numeroref,
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_idmonedacontable) as monedacontable,
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_idmonedaalternativa) as monedaalternativa,
(select sum(coalesce(round(dm.importecontable,2),0)) from mod_logistica.dat_movimiento dm where dm.iddocumento = dd.iddocumento) as importecontable,
(select sum(coalesce(round(dm.importealternativo,2),0)) from mod_logistica.dat_movimiento dm where dm.iddocumento = dd.iddocumento) as importealternativa
from mod_logistica.dat_documento dd
inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
inner join mod_datosmaestros.dat_estructurasubsist desu on desu.idestructurasubsist = ddp.idestructurasubsist
inner join mod_loginventario.conf_inventario ci on ci.idestructuracomun = desu.idestructuracomun
inner join mod_estructuracomp.v_dametodasestructuras des on des.idestructura = desu.idestructuracomun
left join mod_estructuracomp.v_dametodasestructuras desop on desop.idestructura = dd.idestructuracomun
left join mod_seguridad.seg_usuario su on su.idusuario = dd.idusuario
left join mod_seguridad.seg_usuario su1 on su1.idusuario = dd.aprobadopor
left join mod_logistica.dat_documentocliente dc on dc.iddocumento = dd.iddocumento
left join mod_datosmaestros.nom_clientesproveedor c on dc.idcliente = c.idclientesproveedores
left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = c.idestructura
left join mod_persona.dat_persona dp on dp.idpersona = c.idpersona
left join mod_estructuracomp.v_dametodasestructuras co on dc.idcliente = co.idestructura
left join mod_contabilidadcosto.nom_centrocosto ncg on dc.idcliente = ncg.idcentrogrupo
left join mod_logistica.dat_documentotransporte ddt on ddt.iddocumento = dd.iddocumento
left join mod_logistica.conf_general i on i.idestructura = des.idestructura
left join mod_contabilidad.dat_comprobante dcp on dcp.idcomprobante = dd.idcomprobante
where desop.idorgano = -1 and dd.estado in(1,2,3,4,7)
and ( CASE WHEN p_fechainicio is not null THEN dd.fechacontable >= p_fechainicio ELSE TRUE END)
and ( CASE WHEN p_fechafin is not null THEN dd.fechacontable <= p_fechafin ELSE TRUE END)
and ( CASE
		WHEN p_idestructuraop = '*' THEN TRUE
        WHEN p_idestructuraop IS NOT NULL THEN ( desop.idestructura = any(cast(p_idestructuraop as numeric[])) )
        ELSE TRUE END
)
and ( CASE WHEN p_tipodocumento is not null THEN  (ndp.iddocumentos = any (cast(p_tipodocumento as numeric[]))) ELSE TRUE END)
and ( CASE WHEN p_cliente is not null then ((dc.idcliente = any(cast(p_cliente as numeric[]))) OR (dc.idcliente in  (select  distinct idestructura
from mod_datosmaestros.nom_clientesproveedor where idclientesproveedores = any(cast(p_cliente as numeric[])))) ) ELSE TRUE END)
and ( CASE WHEN p_transportador is not null THEN ddt.idorganizacion = any(cast(p_transportador as numeric[])) ELSE TRUE END)

group by co.idestructura, des.denominacion, desop.denominacion, dd.nrodoc, dd.fechacontable,dd.estado, su.nombreusuario,
su1.nombreusuario, i.urllogo, ndp.denominacion,dd.iddocumento,desop.codigo,desop.idestructura,desu.idestructuracomun,ci.idestructuracomun,des.codigo,
dcp.numerocomprobante
order by desop.idestructura
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;