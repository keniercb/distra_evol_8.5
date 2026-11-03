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
COST 100 ROWS 1000;

ALTER FUNCTION mod_loginventario.f_modelovaledevolucionproducto (p_iddocumento numeric, p_monedaalternativa numeric, p_monedacontable numeric)
  OWNER TO zeolides;
  

DROP TYPE mod_loginventario.td_modelovalentrega CASCADE; 
 
CREATE TYPE mod_loginventario.td_modelovalentrega AS (
  almacen VARCHAR,
  nrodoc VARCHAR,
  fechacreacion DATE,
  deposito VARCHAR,
  centrocosto VARCHAR,
  aprobadopor VARCHAR,
  logo TEXT,
  nrodocorigen NUMERIC(19,0),
  fechadocumento DATE,
  denominacion VARCHAR,
  observaciones VARCHAR,
  reeup VARCHAR,
  aliasdoc VARCHAR,
  estado NUMERIC(2,0),
  numeroref NUMERIC(19,0),
  nombrepersona VARCHAR,
  cargopersona VARCHAR,
  nombrepersonaprobar VARCHAR,
  cargopersonaprobar VARCHAR,
  operacion VARCHAR
);

ALTER TYPE mod_loginventario.td_modelovalentrega
  OWNER TO zeolides;
  
   
  
 CREATE OR REPLACE FUNCTION mod_loginventario.f_modelovalentrega (
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

ALTER FUNCTION mod_loginventario.f_modelovalentrega (p_iddocumento numeric)
  OWNER TO zeolides;
  
   

DROP TYPE mod_loginventario.td_modelovalentregaproducto CASCADE; 
CREATE TYPE mod_loginventario.td_modelovalentregaproducto AS (
  codigo VARCHAR,
  denominacionproducto VARCHAR,
  um VARCHAR,
  disponible NUMERIC(25,6),
  precio NUMERIC(25,6),
  importe NUMERIC(25,6),
  existencia NUMERIC(25,6),
  numeropieza VARCHAR,
  precioalternativo NUMERIC(25,6),
  importealternativo NUMERIC(25,6),
  monedaalternativa VARCHAR,
  monedacontable VARCHAR,
  categoria VARCHAR,
  importecup NUMERIC(25,2),
  importecuc NUMERIC(25,2),
  ubicacion VARCHAR(255)
);

ALTER TYPE mod_loginventario.td_modelovalentregaproducto
  OWNER TO zeolides;
 
  
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
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION mod_loginventario.f_modelovalentregaproducto (p_iddocumento numeric, p_monedaalternativa numeric, p_monedacontable numeric)
  OWNER TO zeolides;
  
CREATE OR REPLACE FUNCTION mod_loginventario.f_reclentomov (
  p_idestructuraop varchar,
  p_fechainicio date,
  p_fechafin date,
  p_nombreproducto varchar,
  p_idestructuracomun numeric,
  p_idsubsistema numeric
)
RETURNS SETOF mod_loginventario.td_reclentomov AS
$body$
declare
v_result mod_loginventario.td_reclentomov;
v_rec record;
v_recent record;
v_cant numeric = 0;
v_id record;
v_ejerciciocontable record;
v_idejercicio numeric;
v_fechasist date;
begin
if p_idestructuracomun is not null and p_idsubsistema is not null then
v_ejerciciocontable = mod_logistica.f_obtenerejercicioactivo(p_idsubsistema, p_idestructuracomun);
v_idejercicio = v_ejerciciocontable.idejercicioactual;
v_fechasist = v_ejerciciocontable.fechamax;
else  v_idejercicio = null; end if;

create temp table datos (
idproducto numeric(19,0),
codigoproducto varchar(255),
categoria varchar(255),
denomproducto varchar(255),
fechaentrada date,
fechamov date,
cantidad numeric(25,6),
operacion varchar(255),
existencia numeric(25,6),
disponible numeric(25,6),
cant numeric(19,0),
deposito varchar(255),
almacen varchar(255),
logo VARCHAR);

for v_rec in 
select distinct p.idproducto, 
(case when (np.numeropieza is null or np.numeropieza = '') then np.codigo else np.numeropieza END) as codigo, 
np.denominacion as descripcion, 
p.cantidad, 
p.cantidad - coalesce((select sum(dcc.cantidad) 
from mod_logistica.dat_cantidadcomprometida dcc 
where dcc.idproducto = p.idproducto and dcc.estado <> 2),0) as disponible, op.denominacion as den, e.denominacion,
ii.urllogo as logo,ncp.denominacion as categoria
from mod_logistica.dat_producto p 
left join mod_logistica.nom_categoria ncp on p.idcategoria = ncp.idcategoria
inner join mod_datosmaestros.nom_indicador np on p.idindicador = np.idindicador 
inner join mod_estructuracomp.v_dametodasestructuras op on op.idestructura = p.idestructura 
inner join mod_estructuracomp.nom_filaestruc f on f.idfila = op.idestructura
inner join mod_estructuracomp.v_dametodasestructuras e on e.idestructura = f.idpadre
left join mod_logistica.conf_general ii on ii.idestructura = e.idestructura    
where p.idproducto <> 0    
and (p.idestructura = any(cast(p_idestructuraop as numeric[])))
and (case when p_nombreproducto is not null then (np.denominacion ilike '%' || p_nombreproducto || '%') else true end)
and p.cantidad > 0
and p.cronologia > 0 	    
loop    
insert into datos (idproducto, codigoproducto, denomproducto, fechaentrada,fechamov, cantidad, operacion, existencia, disponible, cant, deposito, almacen, logo, categoria)
values (v_rec.idproducto, v_rec.codigo, v_rec.descripcion, null,null, null, null, v_rec.cantidad, v_rec.disponible, null, v_rec.den, v_rec.denominacion, v_rec.logo, v_rec.categoria);
end loop;

for v_id in
select d.idproducto from datos d
loop    
select d.fechacontable, m.cantidad as cant, ndoc.denominacion, m.idproducto as id ,m.existenciaactual
from mod_logistica.dat_documento d
inner join mod_logistica.dat_movimiento m on m.iddocumento = d.iddocumento
inner join mod_datosmaestros.dat_documentoprim dp on d.iddoc = dp.iddoc
inner join mod_datosmaestros.nom_docprim ndoc on ndoc.iddocumentos = dp.iddocumentos  
where m.idproducto = v_id.idproducto
and ndoc.abreviatura in('conduceLog','facturaLog','valeLog')    
--and m.signo in('-')
and d.estado in ('4')
and d.cronologia > 0
and d.idejercicio = v_idejercicio  
order by d.cronologia desc limit 1
into v_rec;      
update datos set 
fechamov = v_rec.fechacontable,
cantidad = v_rec.cant,
operacion =  v_rec.fechacontable,
cant = (cast(v_fechasist as date) - v_rec.fechacontable)
where v_rec.id = idproducto; 

select d.fechacontable, m.cantidad as cant, ndoc.denominacion, m.idproducto as id ,m.existenciaactual
from mod_logistica.dat_documento d
inner join mod_logistica.dat_movimiento m on m.iddocumento = d.iddocumento
inner join mod_datosmaestros.dat_documentoprim dp on d.iddoc = dp.iddoc
inner join mod_datosmaestros.nom_docprim ndoc on ndoc.iddocumentos = dp.iddocumentos  
where m.idproducto = v_id.idproducto
and ndoc.abreviatura in('recepcionLog','aperturaLog')    
and d.estado in ('3','4')
and d.cronologia > 0
and d.idejercicio = v_idejercicio  
order by d.cronologia asc limit 1
into v_recent;      
update datos set 
fechaentrada = v_recent.fechacontable,    
operacion = v_rec.denominacion,
cant = (cast(v_fechasist as date) - v_recent.fechacontable) 
where v_recent.id = idproducto;   

end loop;

for v_result in 
select d.idproducto, codigoproducto, denomproducto, fechamov, cantidad, operacion, existencia, disponible, cant, deposito, almacen, d.logo, d.categoria 
from datos d
where ( case when p_fechainicio is not null then d.fechamov  not between p_fechainicio and p_fechafin else true end )
and ( case when  p_fechainicio is not null then d.fechaentrada  not between p_fechainicio and p_fechafin else true end )
order by d.deposito,d.codigoproducto 
loop
return next v_result; end loop; 
drop table datos;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;