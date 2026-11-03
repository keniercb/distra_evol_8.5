CREATE OR REPLACE FUNCTION mod_loginventario.f_recsub (
  p_idestructura numeric,
  p_codigo varchar,
  p_codigoproveedor varchar,
  p_denominacion varchar,
  p_idtipoproducto numeric,
  p_idnaturaleza numeric,
  p_idcategoria numeric,
  p_idclasifcontable numeric,
  p_idestructuraubic numeric,
  p_disponibilidad numeric,
  p_existencia numeric,
  p_criterio varchar,
  p_cantidadmov numeric,
  p_fechainicio date,
  p_fechafin date,
  p_idmonedacontable numeric,
  p_idmonedaalternativa numeric,
  p_idmarca numeric,
  p_idmodelo numeric,
  p_limit numeric,
  p_start numeric,
  p_criterioavan numeric
)
RETURNS SETOF mod_loginventario.td_recsub AS
$body$
declare
all_rec mod_loginventario.td_recsub;
begin
for all_rec in
select
dp.idindicador,
(case when (ni.numeropieza is null or ni.numeropieza = '') then ni.codigo else ni.numeropieza END) as codigo, 
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

(select nc.concatcta from mod_contabilidad.nom_cuenta nc 
inner join mod_logistica.nom_clasificacioncontable ncc on ncc.idcuenta = nc.idcuenta 
where ncc.idclasificacioncontable = dp.idclasificacioncontable)  as cuentacontable,

(select nc.concatcta from mod_contabilidad.nom_cuenta nc 
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
and (df.iddeposito is not null or pm.idestructura is not null or po.idestructura is not null ) and 
((df.iddeposito = p_idestructura  or pm.idestructura = p_idestructura  or po.idestructura = p_idestructura ) or p_idestructura is null)) as fechaminima,

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
and (df.iddeposito is not null or pm.idestructura is not null or po.idestructura is not null ) and 
((df.iddeposito = p_idestructura  or pm.idestructura = p_idestructura  or po.idestructura = p_idestructura ) or p_idestructura is null)) as fechamaxima,


deop.denominacion as deposito,
deop.codigo as codeposito,
nn.denominacion as naturaleza,

((select distinct des.denominacion
from mod_estructuracomp.v_dametodasestructuras des
inner join mod_datosmaestros.dat_estructurasubsist desu on des.idestructura = desu.idestructuracomun
inner join mod_datosmaestros.dat_documentoprim ddp on desu.idestructurasubsist = ddp.idestructurasubsist
inner join mod_logistica.dat_documento dd on ddp.iddoc = dd.iddoc
inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento where dm.idproducto = dp.idproducto limit 1)) as entidad,

(select distinct ii.urllogo
from mod_logistica.conf_general ii 
inner join mod_estructuracomp.v_dametodasestructuras des on des.idestructura = ii.idestructura
inner join mod_datosmaestros.dat_estructurasubsist desu on des.idestructura = desu.idestructuracomun
inner join mod_datosmaestros.dat_documentoprim ddp on desu.idestructurasubsist = ddp.idestructurasubsist
inner join mod_logistica.dat_documento dd on ddp.iddoc = dd.iddoc
inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento where dm.idproducto = dp.idproducto limit 1) as logo,

(case when (select dea.estado from mod_estructuracomp.nom_filaestruc nf inner join mod_logistica.dat_estadoalmacen dea on dea.iddeposito = nf.idfila 
where nf.idfila = deop.idestructura) = 1
then 'abierto' else 'cerrado' end) as estadoop,

(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_idmonedacontable) as monedacontable,   
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_idmonedaalternativa) as monedaalternativa,

round(dp.precio * dp.cantidad,2) as importecalculado,
round(dp.precioalternativo * dp.cantidad,2) as importealtcalculado,

ne.denespecialidad,'',
nma.denominacion as marca,
nmo.denominacion as modelo,
(
	select concat(eup.descripcion,' ',eup2.descripcion,' ', eu.descripcion) 
    from mod_logubicacion.dat_ubicacionproducto up 
    inner join mod_logubicacion.dat_estructuraubicacion eu on eu.idestructuraubicacion = up.idubicacion
    left join mod_logubicacion.dat_estructuraubicacion eup2 on eup2.idestructuraubicacion = eu.idpadre and eup2.idestructuraubicacion <> eup2.idpadre
    left join mod_logubicacion.dat_estructuraubicacion eup on eup.idarea = eu.idarea and eup.idestructuraubicacion = eup.idpadre
    where up.idproducto = dp.idproducto limit 1
)as ubicacion,
count(*) OVER() as total,
nma.idmarca,nmo.idmodelo

from mod_logistica.dat_producto dp
inner join mod_estructuracomp.v_dametodasestructuras deop on deop.idestructura = dp.idestructura
left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
left join mod_logistica.nom_categoria nc on nc.idcategoria = dp.idcategoria 
left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = dp.idumedida
left join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador= ni.idindicador 
left join mod_datosmaestros.nom_pais np on np.idpais = ni.idpais
left join mod_datosmaestros.nom_naturaleza nn on nn.idnaturaleza = ni.idnaturaleza 
left join mod_datosmaestros.nom_especialidad ne on ne.idespecialidad = ni.idespecialidad
left join mod_datosmaestros.nom_marca nma on nih.idmarca = nma.idmarca
left join mod_datosmaestros.nom_modelo nmo on nih.idmodelo = nmo.idmodelo
--left join mod_datosmaestros.nom_imagenindicador nii on nii.idimagen = ni.idindicador
where dp.cronologia > 0 and dp.idestructura = p_idestructura

and (case when p_codigo is not null or p_codigoproveedor is not null or p_denominacion is not null then ((case when p_codigo is not null then ni.codigo ilike '%' || p_codigo || '%' end)
or (case when p_codigoproveedor is not null then ni.numeropieza ilike '%' || p_codigoproveedor || '%' end)
or (case when p_denominacion is not null then ni.denominacion ilike '%' || p_denominacion || '%' end)) else true end)
and(case when p_idtipoproducto is not null then nih.tipocontrol = p_idtipoproducto else true end)
and(case when p_idnaturaleza is not null then ni.idnaturaleza = p_idnaturaleza else true end)
and(case when p_idmarca is not null then nih.idmarca = p_idmarca else true end)
and(case when p_idmodelo is not null then nih.idmodelo = p_idmodelo else true end)
and(case when p_idcategoria is not null then nc.idcategoria = p_idcategoria else true end)
and(case when p_idclasifcontable is not null then dp.idclasificacioncontable = p_idclasifcontable else true end)
and(dp.idproducto in(select idproducto from mod_logubicacion.dat_ubicacionproducto where idubicacion = p_idestructuraubic) or p_idestructuraubic is null)
and(case when p_disponibilidad = 1 then (dp.cantidad -(select coalesce(sum(cantidad),0)
from mod_logistica.dat_cantidadcomprometida where estado = 1 and idproducto = dp.idproducto)) > 0 else true end)
and(case when p_existencia = 1 then dp.cantidad > 0 else true end)
and (case when p_fechainicio is not null then ((select distinct dd.fechacontable from mod_logistica.dat_documento dd 
inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento where dm.idproducto = dp.idproducto 
and dm.signo in ('+','-') limit 1) >= p_fechainicio) else true end) 
and (case when p_fechafin is not null then 
((select distinct dd.fechacontable from mod_logistica.dat_documento dd inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento 
where dm.idproducto = dp.idproducto and dm.signo in ('+','-') limit 1) <= p_fechafin) else true end)

group by dp.idindicador,ni.codigo,ni.numeropieza,ni.denominacion,num.abreviaturaunidadmedida,np.siglas,dp.cantidad,dp.idproducto,nih.tipocontrol,
nc.denominacion,num.decimales,deop.denominacion,deop.codigo,nn.denominacion,deop.idestructura,ne.denespecialidad,nma.idmarca,nmo.idmodelo,nma.denominacion,nmo.denominacion,
dp.precio,dp.precioalternativo,dp.importe, dp.importealternativo,dp.minimo,dp.maximo,cuentacontable,cuentaalternativa

having (case when ((p_criterioavan = 1 or p_criterioavan = 2 or p_criterioavan = 3) and p_cantidadmov is not null) 
then (case when p_criterioavan = 1 then ((select count(dm.idmovimiento) from mod_logistica.dat_movimiento dm where dm.idproducto = dp.idproducto and dm.signo in ('+','-')) < p_cantidadmov and (case when p_fechainicio is not null then ((select distinct dd.fechacontable from mod_logistica.dat_documento dd inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento where dm.idproducto = dp.idproducto and dm.signo in ('+','-')) >= p_fechainicio) else true end) and (case when p_fechafin is not null then ((select distinct dd.fechacontable from mod_logistica.dat_documento dd inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento where dm.idproducto = dp.idproducto and dm.signo in ('+','-')) <= p_fechafin) else true end)) 
       when p_criterioavan = 2 then ((select count(dm.idmovimiento) from mod_logistica.dat_movimiento dm where dm.idproducto = dp.idproducto and dm.signo in ('+','-')) < p_cantidadmov and (case when p_fechainicio is not null then ((select distinct dd.fechacontable from mod_logistica.dat_documento dd inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento where dm.idproducto = dp.idproducto and dm.signo in ('+','-')) >= p_fechainicio) else true end) and (case when p_fechafin is not null then ((select distinct dd.fechacontable from mod_logistica.dat_documento dd inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento where dm.idproducto = dp.idproducto and dm.signo in ('+','-')) <= p_fechafin) else true end))
       when p_criterioavan = 3 then ((select count(dm.idmovimiento) from mod_logistica.dat_movimiento dm where dm.idproducto = dp.idproducto and dm.signo in ('+','-')) < p_cantidadmov and (case when p_fechainicio is not null then ((select distinct dd.fechacontable from mod_logistica.dat_documento dd inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento where dm.idproducto = dp.idproducto and dm.signo in ('+','-')) >= p_fechainicio) else true end) and (case when p_fechafin is not null then ((select distinct dd.fechacontable from mod_logistica.dat_documento dd inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento where dm.idproducto = dp.idproducto and dm.signo in ('+','-')) <= p_fechafin) else true end)) end) 
else true end)
order by deposito,cuentacontable,nma.idmarca,nmo.idmodelo, ni.codigo
offset p_start limit p_limit
loop 
--raise exception '%', all_rec;
return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;