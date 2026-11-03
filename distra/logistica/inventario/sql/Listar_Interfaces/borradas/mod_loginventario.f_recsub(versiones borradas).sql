-- Type: td_recsub

-- DROP TYPE IF EXISTS mod_loginventario.td_recsub;

CREATE TYPE mod_loginventario.td_recsub AS
(
	idindicador numeric(25,6),
	codigo character varying,
	codigoproveedor character varying,
	denominacion character varying,
	umedida character varying,
	nacionalidad character varying,
	idproducto numeric(19,0),
	disponible numeric(25,6),
	existencia numeric(25,6),
	precio numeric(25,6),
	precioalternativo numeric(25,6),
	importetotalcup numeric(25,6),
	importetotalcuc numeric(25,6),
	tienelote numeric(19,0),
	equipo numeric(19,0),
	municion numeric(19,0),
	minimo numeric(19,0),
	maximo numeric(19,0),
	cuentacontable character varying,
	cuentaalternativa character varying,
	nomcategoria character varying,
	decimales numeric(19,0),
	fechaminima date,
	fechamaxima date,
	deposito character varying,
	codeposito character varying,
	naturaleza character varying,
	entidad character varying,
	logo text,
	estadoop character varying,
	monedacontable character varying,
	monedaalternativa character varying,
	importecalculado numeric(25,2),
	importealtcalculado numeric(25,2),
	especialidad character varying,
	imagenesindicador character varying,
	marca character varying,
	modelo character varying,
	ubicacion character varying,
	total numeric(19,0),
	numerolote character varying,
	fechavencelote date
);

ALTER TYPE mod_loginventario.td_recsub
    OWNER TO zeolides;

-- FUNCTION: mod_loginventario.f_recsub(numeric, character varying, character varying, character varying, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, date, date, numeric, numeric, numeric, numeric)

-- DROP FUNCTION IF EXISTS mod_loginventario.f_recsub(numeric, character varying, character varying, character varying, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, date, date, numeric, numeric, numeric, numeric);

CREATE OR REPLACE FUNCTION mod_loginventario.f_recsub(
	p_idestructura numeric,
	p_codigo character varying,
	p_codigoproveedor character varying,
	p_denominacion character varying,
	p_idtipoproducto numeric,
	p_idnaturaleza numeric,
	p_idcategoria numeric,
	p_idclasifcontable numeric,
	p_idestructuraubic numeric,
	p_disponibilidad numeric,
	p_existencia numeric,
	p_criterio numeric,
	p_cantidadmov numeric,
	p_fechainicio date,
	p_fechafin date,
	p_idmonedacontable numeric,
	p_idmonedaalternativa numeric,
	p_limit numeric,
	p_start numeric)
    RETURNS SETOF mod_loginventario.td_recsub 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
declare
all_rec mod_loginventario.td_recsub;
begin
for all_rec in
select
dp.idindicador,
dc.codigo,
ni.numeropieza as codproveedor,
ni.denominacion as denomprod,
num.abreviaturaunidadmedida as um,
np.siglas as nacionalidad,
dp.idproducto,
dp.cantidad -(select coalesce(sum(cantidad),0) from mod_logistica.dat_cantidadcomprometida where estado = 1 and idproducto = dp.idproducto) as disponible,
dp.cantidad as existencia,
dp.precio as preciocontable,
dp.precioalternativo as precioalternativo,
dp.importe as importetotalcup,
dp.importealternativo as importetotalcuc,
(case when nih.tipocontrol = 2 then 1 else 0 end) as tienelote,
(case when nih.tipocontrol = 3 then 1 else 0 end) as equipo,
(case when nih.tipocontrol = 4 then 1 else 0 end) as municion,
dp.minimo as minimo,
dp.maximo as maximo,

(select concat(nc.concatcta,' ',nc.descripcion) from mod_contabilidad.nom_cuenta nc 
inner join mod_logistica.nom_clasificacioncontable ncc on ncc.idcuenta = nc.idcuenta 
where ncc.idclasificacioncontable = dp.idclasificacioncontable)  as cuentacontable,

(select concat(nc.concatcta,' ',nc.descripcion) from mod_contabilidad.nom_cuenta nc 
inner join mod_logistica.nom_clasificacioncontable ncc on ncc.idcuentaalt = nc.idcuenta 
where ncc.idclasificacioncontable = dp.idclasificacioncontable)  as cuentaalternativa,

nc.denominacion as categoria,
num.decimales,

(select min(dd.fechacontable) from mod_logistica.dat_documento dd
inner join mod_datosmaestros.dat_documentoprim ddp on dd.iddoc = ddp.iddoc
inner join mod_datosmaestros.dat_estructurasubsist deb on deb.idestructurasubsist = ddp.idestructurasubsist
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
--inventario general
left join mod_logistica.dat_movimiento m on m.iddocumento = dd.iddocumento
left join mod_logistica.dat_producto pm on pm.idproducto = m.idproducto
left join mod_estructuracomp.dat_estructuraop eom on eom.idestructuraop = pm.idestructura
--distribucion
left join mod_logdistribucion.dat_prodorden o on o.idorden = dd.iddocumento
left join mod_logistica.dat_producto po on po.idproducto = o.idproducto
left join mod_estructuracomp.dat_estructuraop eoo on eoo.idestructuraop = po.idestructura
--facturacion
left join mod_logfacturacion.dat_docfactura df on df.idfactura = dd.iddocumento
left join mod_estructuracomp.dat_estructuraop eof on eof.idestructuraop = df.iddeposito
where deb.idsubsistema in(10,13)
and (df.iddeposito is not null or pm.idestructura is not null or po.idestructura is not null ) and ((df.iddeposito = p_idestructura  or pm.idestructura = p_idestructura  or po.idestructura = p_idestructura ) or p_idestructura is null)) as fechaminima,

(select max(dd.fechacontable) from mod_logistica.dat_documento dd
inner join mod_datosmaestros.dat_documentoprim ddp on dd.iddoc = ddp.iddoc
inner join mod_datosmaestros.dat_estructurasubsist deb on deb.idestructurasubsist = ddp.idestructurasubsist
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
--inventario general
left join mod_logistica.dat_movimiento m on m.iddocumento = dd.iddocumento
left join mod_logistica.dat_producto pm on pm.idproducto = m.idproducto
left join mod_estructuracomp.dat_estructuraop eom on eom.idestructuraop = pm.idestructura
--distribucion
left join mod_logdistribucion.dat_prodorden o on o.idorden = dd.iddocumento
left join mod_logistica.dat_producto po on po.idproducto = o.idproducto
left join mod_estructuracomp.dat_estructuraop eoo on eoo.idestructuraop = po.idestructura
--facturacion
left join mod_logfacturacion.dat_docfactura df on df.idfactura = dd.iddocumento
left join mod_estructuracomp.dat_estructuraop eof on eof.idestructuraop = df.iddeposito
 where deb.idsubsistema in(10,13)
and (df.iddeposito is not null or pm.idestructura is not null or po.idestructura is not null ) and ((df.iddeposito = p_idestructura  or pm.idestructura = p_idestructura  or po.idestructura = p_idestructura ) or p_idestructura is null)) as fechamaxima,

deop.denominacion as deposito,
deop.codigo as codeposito,
nn.denominacion as naturaleza,

((select distinct des.denominacion
from mod_estructuracomp.dat_estructura des
inner join mod_datosmaestros.dat_estructurasubsist desu on des.idestructura = desu.idestructuracomun
inner join mod_datosmaestros.dat_documentoprim ddp on desu.idestructurasubsist = ddp.idestructurasubsist
inner join mod_logistica.dat_documento dd on ddp.iddoc = dd.iddoc
inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento where dm.idproducto = dp.idproducto limit 1)) as entidad,

(select distinct ii.urllogo
from mod_logistica.conf_general ii 
inner join mod_estructuracomp.dat_estructura des on des.idestructura = ii.idestructura
inner join mod_datosmaestros.dat_estructurasubsist desu on des.idestructura = desu.idestructuracomun
inner join mod_datosmaestros.dat_documentoprim ddp on desu.idestructurasubsist = ddp.idestructurasubsist
inner join mod_logistica.dat_documento dd on ddp.iddoc = dd.iddoc
inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento where dm.idproducto = dp.idproducto limit 1) as logo,

(case when (select dea.estado from mod_estructuracomp.nom_filaestruc nf inner join mod_logistica.dat_estadoalmacen dea on dea.iddeposito = nf.idfila where nf.idfila = deop.idestructuraop) = 1
then 'abierto' else 'cerrado' end) as estadoop,

(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_idmonedacontable) as monedacontable,   
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_idmonedaalternativa) as monedaalternativa,

round(dp.precio * dp.cantidad,2) as importecalculado,
round(dp.precioalternativo * dp.cantidad,2) as importealtcalculado,

ne.denespecialidad,'',dp.precioventa,null,lp.denominacion as denomlineaprodfarm,dp.cantidad,
count(*) OVER() as total,

(
	select concat(eup.descripcion,' ',eup2.descripcion,' ', eu.descripcion) 
    from mod_logubicacion.dat_ubicacionproducto up 
    inner join mod_logubicacion.dat_estructuraubicacion eu on eu.idestructuraubicacion = up.idubicacion
    left join mod_logubicacion.dat_estructuraubicacion eup2 on eup2.idestructuraubicacion = eu.idpadre and eup2.idestructuraubicacion <> eup2.idpadre
    left join mod_logubicacion.dat_estructuraubicacion eup on eup.idarea = eu.idarea and eup.idestructuraubicacion = eup.idpadre
    where up.idproducto = dp.idproducto limit 1
)as ubicacion
    
from mod_logistica.dat_producto dp
inner join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = dp.idestructura
left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
left join mod_logistica.nom_categoria nc on nc.idcategoria = dp.idcategoria 
left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = dp.idumedida
left join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador= ni.idindicador 
left join mod_datosmaestros.nom_pais np on np.idpais = ni.idpais
left join mod_datosmaestros.nom_naturaleza nn on nn.idnaturaleza = ni.idnaturaleza 
left join mod_datosmaestros.nom_especialidad ne on ne.idespecialidad = ni.idespecialidad
left join mod_datosmaestros.dat_codificador dc on dc.idindicador = ni.idindicador
inner join mod_logfarmacia.nom_lineaprod lp on lp.idlineaprod = dp.idlineaprod
where dp.cronologia > 0 and dp.idestructura = p_idestructura

and (case when p_codigo is not null or p_codigoproveedor is not null or p_denominacion is not null then ((case when p_codigo is not null then dc.codigo ilike '%' || p_codigo || '%' end)
or (case when p_codigoproveedor is not null then ni.numeropieza ilike '%' || p_codigoproveedor || '%' end)
or (case when p_denominacion is not null then ni.denominacion ilike '%' || p_denominacion || '%' end)) else true end)
and(case when p_idtipoproducto is not null then nih.tipocontrol = p_idtipoproducto else true end)
and(case when p_idnaturaleza is not null then ni.idnaturaleza = p_idnaturaleza else true end)
and(case when p_idcategoria is not null then nc.idcategoria = p_idcategoria else true end)
and(case when p_idclasifcontable is not null then dp.idclasificacioncontable = p_idclasifcontable else true end)
and(dp.idproducto in(select idproducto from mod_logubicacion.dat_ubicacionproducto where idubicacion = p_idestructuraubic) or p_idestructuraubic is null)
and(case when p_disponibilidad = 1 then (dp.cantidad -(select coalesce(sum(cantidad),0) from mod_logistica.dat_cantidadcomprometida where estado = 1 and idproducto = dp.idproducto)) > 0 else true end)
and(case when p_existencia = 1 then dp.cantidad > 0 else true end)
and (case when p_fechainicio is not null then ((select distinct dd.fechacontable from mod_logistica.dat_documento dd inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento where dm.idproducto = dp.idproducto and dm.signo in ('+','-') limit 1) >= p_fechainicio) else true end)
and (case when p_fechafin is not null then ((select distinct dd.fechacontable from mod_logistica.dat_documento dd inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento where dm.idproducto = dp.idproducto and dm.signo in ('+','-') limit 1) <= p_fechafin) else true end)

group by dp.idindicador,dc.codigo,ni.codigo,ni.numeropieza,ni.denominacion,num.abreviaturaunidadmedida,np.siglas,dp.cantidad,dp.idproducto,nih.tipocontrol,nc.denominacion,num.decimales,deop.denominacion,deop.codigo,nn.denominacion,deop.idestructuraop,ne.denespecialidad,lp.denominacion

having (case when ((p_criterio = 1 or p_criterio = 2 or p_criterio = 3) and p_cantidadmov is not null) 
then (case when p_criterio = 1 then ((select count(dm.idmovimiento) from mod_logistica.dat_movimiento dm where dm.idproducto = dp.idproducto and dm.signo in ('+','-')) < p_cantidadmov and (case when p_fechainicio is not null then ((select distinct dd.fechacontable from mod_logistica.dat_documento dd inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento where dm.idproducto = dp.idproducto and dm.signo in ('+','-')) >= p_fechainicio) else true end) and (case when p_fechafin is not null then ((select distinct dd.fechacontable from mod_logistica.dat_documento dd inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento where dm.idproducto = dp.idproducto and dm.signo in ('+','-')) <= p_fechafin) else true end)) 
       when p_criterio = 2 then ((select count(dm.idmovimiento) from mod_logistica.dat_movimiento dm where dm.idproducto = dp.idproducto and dm.signo in ('+','-')) < p_cantidadmov and (case when p_fechainicio is not null then ((select distinct dd.fechacontable from mod_logistica.dat_documento dd inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento where dm.idproducto = dp.idproducto and dm.signo in ('+','-')) >= p_fechainicio) else true end) and (case when p_fechafin is not null then ((select distinct dd.fechacontable from mod_logistica.dat_documento dd inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento where dm.idproducto = dp.idproducto and dm.signo in ('+','-')) <= p_fechafin) else true end))
       when p_criterio = 3 then ((select count(dm.idmovimiento) from mod_logistica.dat_movimiento dm where dm.idproducto = dp.idproducto and dm.signo in ('+','-')) < p_cantidadmov and (case when p_fechainicio is not null then ((select distinct dd.fechacontable from mod_logistica.dat_documento dd inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento where dm.idproducto = dp.idproducto and dm.signo in ('+','-')) >= p_fechainicio) else true end) and (case when p_fechafin is not null then ((select distinct dd.fechacontable from mod_logistica.dat_documento dd inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento where dm.idproducto = dp.idproducto and dm.signo in ('+','-')) <= p_fechafin) else true end)) end) 
else true end)
order by lp.denominacion,ni.denominacion
offset p_start limit p_limit
loop 
return next all_rec; end loop;
end;
$BODY$;

ALTER FUNCTION mod_loginventario.f_recsub(numeric, character varying, character varying, character varying, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, date, date, numeric, numeric, numeric, numeric)
    OWNER TO zeolides;

-- FUNCTION: mod_loginventario.f_recsub_new(numeric, character varying, character varying, character varying, numeric, numeric, numeric, numeric, numeric, numeric, numeric, character varying, numeric, date, date, numeric, numeric, numeric, numeric, numeric, numeric, numeric)

-- DROP FUNCTION IF EXISTS mod_loginventario.f_recsub_new(numeric, character varying, character varying, character varying, numeric, numeric, numeric, numeric, numeric, numeric, numeric, character varying, numeric, date, date, numeric, numeric, numeric, numeric, numeric, numeric, numeric);

CREATE OR REPLACE FUNCTION mod_loginventario.f_recsub_new(
	p_idestructura numeric,
	p_codigo character varying,
	p_codigoproveedor character varying,
	p_denominacion character varying,
	p_idtipoproducto numeric,
	p_idnaturaleza numeric,
	p_idcategoria numeric,
	p_idclasifcontable numeric,
	p_idestructuraubic numeric,
	p_disponibilidad numeric,
	p_existencia numeric,
	p_criterio character varying,
	p_cantidadmov numeric,
	p_fechainicio date,
	p_fechafin date,
	p_idmonedacontable numeric,
	p_idmonedaalternativa numeric,
	p_idmarca numeric,
	p_idmodelo numeric,
	p_limit numeric,
	p_start numeric,
	p_criterioavan numeric)
    RETURNS SETOF mod_loginventario.td_recsub 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
declare
all_rec mod_loginventario.td_recsub;
begin 
if p_fechafin is null then 
	p_fechafin = now()::date ;
end if;

for all_rec in
with q as (select distinct on(dmm.idproducto) dmm.idproducto, dmm.existenciaactual as existencia, dmm.preciopromedio as precio, dmm.importetotal as importe, dd.fechacontable as fecha, dmm.cronologia
    from mod_logistica.dat_movimiento dmm
join mod_logistica.dat_documento dd on dmm.iddocumento = dd.iddocumento
join mod_logistica.dat_producto dp2 on dmm.idproducto = dp2.idproducto
where dp2.idestructura = p_idestructura and dmm.cronologia > 0 and dd.fechacontable <= p_fechafin
and (case when p_fechainicio is not null then  dd.fechacontable >= p_fechainicio else true end) 
order by dmm.idproducto,dmm.cronologia desc)

select 
dp.idindicador,
coalesce(ni.codigo, '') as codigo, 
coalesce(ni.numeropieza,'') as codigoprov, 
upper(ni.denominacion ) as denomprod,
upper(umm.abreviaturaunidadmedida) as umedida,
np.siglas as nacionalidad,
dp.idproducto, 
(case when p_fechafin < dff.fecha then q.existencia else (q.existencia - (select coalesce(sum(cantidad),0) from mod_logistica.dat_cantidadcomprometida where estado = 1 and idproducto = dp.idproducto)) end) as disponible,
q.existencia,
q.precio,
0,
round(q.importe,2) as importe,
0,
(case when nih.tipocontrol = 2 then 1 else 0 end) as tienelote,
(case when nih.tipocontrol = 3 then 1 else 0 end) as equipo,
(case when nih.tipocontrol = 4 then 1 else 0 end) as municion,
coalesce(dp.minimo,0) as minimo, 
coalesce(dp.maximo,0) as maximo,

ncta.concatcta as cuenta,
coalesce(nctaalt.concatcta,'') as cuentaalt, 
coalesce(ncat.denominacion,'S/D') as categoria,
umm.decimales,
now()::date,
now()::date,
alm.denominacion as almacen,
alm.codigo as codeposito,
coalesce(nnat.denominacion,'S/D') as naturaleza,
ent.denominacion as entidad,
ii.urllogo as logo, 
(case when dea.estado = 1 then 'abierto' else 'cerrado' end) as estadoop,
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_idmonedacontable) as monedacontable,   
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_idmonedaalternativa) as monedaalternativa,
round(dp.precio * dp.cantidad,2) as importecalculado,
round(dp.precioalternativo * dp.cantidad,2) as importealtcalculado,
ne.denespecialidad as especialidad,'',
nma.denominacion as marca,
nmo.denominacion as modelo,
'' as ubicacion,
count(*) OVER() as total,
nma.idmarca,nmo.idmodelo

from mod_logistica.dat_producto dp
join mod_logistica.nom_clasificacioncontable nc on dp.idclasificacioncontable = nc.idclasificacioncontable
join mod_datosmaestros.nom_unidadmedida umm on dp.idumedida = umm.idunidadmedida
join mod_estructuracomp.v_dametodasestructuras ent on ent.idestructura = dp.idestructuracomun
join mod_estructuracomp.v_dametodasestructuras alm on alm.idestructura = dp.idestructura
join mod_datosmaestros.nom_indicador ni on dp.idindicador = ni.idindicador
join mod_datosmaestros.nom_indicadorhoja nih on dp.idindicador = nih.idindicador
join mod_logistica.conf_general ii on ii.idestructura = dp.idestructuracomun
join q on q.idproducto = dp.idproducto
join mod_datosmaestros.nom_naturaleza nnat on ni.idnaturaleza = nnat.idnaturaleza
join mod_logistica.dat_estadoalmacen dea on dea.iddeposito = dp.idestructura
join mod_datosmaestros.dat_estructurasubsist ees on ees.idestructuracomun = dp.idestructuracomun and ees.idsubsistema = 10
join mod_datosmaestros.dat_fecha dff on dff.idestructurasubsist = ees.idestructurasubsist
left join mod_contabilidad.nom_cuenta ncta on nc.idcuenta = ncta.idcuenta
left join mod_contabilidad.nom_cuenta nctaalt on nc.idcuentaalt = nctaalt.idcuenta
left join mod_logistica.nom_categoria ncat on dp.idcategoria = ncat.idcategoria
left join mod_datosmaestros.nom_especialidad ne on ne.idespecialidad = ni.idespecialidad
left join mod_datosmaestros.nom_pais np on np.idpais = ni.idpais
left join mod_datosmaestros.nom_marca nma on nih.idmarca = nma.idmarca
left join mod_datosmaestros.nom_modelo nmo on nih.idmodelo = nmo.idmodelo

where dp.idestructura = p_idestructura and dp.cronologia > 0
and (case when p_codigo is not null or p_codigoproveedor is not null or p_denominacion is not null then ((case when p_codigo is not null then ni.codigo ilike '%' || p_codigo || '%' end)
or (case when p_codigoproveedor is not null then ni.numeropieza ilike '%' || p_codigoproveedor || '%' end)
or (case when p_denominacion is not null then ni.denominacion ilike '%' || p_denominacion || '%' end)) else true end)
and(case when p_idtipoproducto is not null then nih.tipocontrol = p_idtipoproducto else true end)
and(case when p_idnaturaleza is not null then ni.idnaturaleza = p_idnaturaleza else true end)
and(case when p_idmarca is not null then nih.idmarca = p_idmarca else true end)
and(case when p_idmodelo is not null then nih.idmodelo = p_idmodelo else true end)
and(case when p_idcategoria is not null then ncat.idcategoria = p_idcategoria else true end)
and(case when p_idclasifcontable is not null then dp.idclasificacioncontable = p_idclasifcontable else true end)
and(case when p_existencia = 1 then q.existencia > 0 else true end)
and(case when p_disponibilidad = 1 then (case when p_fechafin < dff.fecha then q.existencia else (q.existencia - (select coalesce(sum(cantidad),0) from mod_logistica.dat_cantidadcomprometida where estado = 1 and idproducto = dp.idproducto)) end) > 0 else true end)
order by ncta.concatcta, nctaalt.concatcta , ni.numeropieza, ni.denominacion
offset p_start limit p_limit
loop 
--raise exception '%', all_rec;
return next all_rec; end loop;
end;
$BODY$;

ALTER FUNCTION mod_loginventario.f_recsub_new(numeric, character varying, character varying, character varying, numeric, numeric, numeric, numeric, numeric, numeric, numeric, character varying, numeric, date, date, numeric, numeric, numeric, numeric, numeric, numeric, numeric)
    OWNER TO zeolides;
