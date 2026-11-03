CREATE SEQUENCE /*IF NOT EXISTS*/ mod_logpuntoventa.sec_serviciodevolucion_seq
  INCREMENT 1 MINVALUE 1000000
  MAXVALUE 1099999999 START 1000000
  CACHE 1;

ALTER SEQUENCE mod_logpuntoventa.sec_serviciodevolucion_seq RESTART WITH 1000000;

CREATE TABLE /*IF NOT EXISTS*/ mod_logpuntoventa.dat_serviciodevolucion (
  idserviciodevolucion NUMERIC(19,0) DEFAULT nextval('mod_logpuntoventa.sec_serviciodevolucion_seq'::regclass) NOT NULL,
  iddevolucion NUMERIC(19,0),
  idindicador NUMERIC(19,0),
  cantidadcomprada NUMERIC(25,6),
  precioventa NUMERIC(25,6),
  recargo NUMERIC(25,6),
  importe NUMERIC(25,6),
  descuento NUMERIC(25,6),
  cantidaddevolver NUMERIC(25,6),
  CONSTRAINT pk_serviciodevolucion PRIMARY KEY(idserviciodevolucion),
  CONSTRAINT fk_devolucion_serviciodevolucion FOREIGN KEY (iddevolucion)
    REFERENCES mod_logpuntoventa.dat_devolucion(iddevolucion)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT fk_producto_indicadordevolucion FOREIGN KEY (idindicador)
    REFERENCES mod_datosmaestros.nom_indicador(idindicador)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);

CREATE INDEX idx_devolucionservicios ON mod_logpuntoventa.dat_serviciodevolucion
  USING btree (iddevolucion);

ALTER TABLE mod_logpuntoventa.dat_serviciodevolucion
  CLUSTER ON idx_devolucionservicios;

ALTER TABLE mod_logpuntoventa.dat_serviciodevolucion
  OWNER TO zeolides;


ALTER TYPE mod_logpuntoventa.td_serviciosventa
  ADD ATTRIBUTE decimales NUMERIC;
 

-- FUNCTION: mod_logpuntoventa.f_modelocomprobante(numeric, numeric, numeric)

-- DROP FUNCTION IF EXISTS mod_logpuntoventa.f_modelocomprobante(numeric, numeric, numeric);

CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_modelocomprobante(
	p_iddocumento numeric,
	p_idestructura numeric,
	p_original numeric DEFAULT 0)
    RETURNS SETOF mod_logpuntoventa.td_modelocomprobante 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
declare
all_rec mod_logpuntoventa.td_modelocomprobante;
v_rec record;
v_recdes numeric = 0;
begin
for all_rec in
select 
COALESCE(dv.nrofactura,cast(dd.nrodoc as varchar)) as nrofactura,
dd.fechacontable,
mp.denominacion as modopago,
dvc.nombre as nombrecliente,
dvc.numeroidentidad as cicliente,
dvc.direccion as dircliente,
dvc.telefono as telefcliente,
dvc.correo as correocliente,
dd.observaciones,
case when p_original = 1 then dv.importe else dv.importe - coalesce(dv.importedevuelto,0) end as subtotal,
((select sum(vp.descuento) from mod_logpuntoventa.dat_ventaproducto vp where vp.idventas = dd.iddocumento)
 + case when dv.conceptoventa = '-' then COALESCE(dv.calculoconcepto,0) else 0 end) as descuento,
((select sum(vp.recargo) from mod_logpuntoventa.dat_ventaproducto vp where vp.idventas = dd.iddocumento)
+ case when dv.conceptoventa = '+' then COALESCE(dv.calculoconcepto,0) else 0 end) as recargo,
case when p_original = 1 then dv.importe else dv.importe - coalesce(dv.importedevuelto,0) end as total,
nm.codigoiso,
COALESCE(dav.nombre,(SELECT es.denominacion FROM mod_estructuracomp.dat_estructuraop es WHERE es.idestructuraop = p_idestructura)) as entidad,
COALESCE(dav.direccion,(SELECT dir.direccion FROM mod_estructuracomp.dat_estructuraop dir WHERE dir.idestructuraop = p_idestructura)) as direccion,
COALESCE(dav.telefono,(SELECT tl.telefono FROM mod_estructuracomp.dat_estructuraop tl WHERE tl.idestructuraop = p_idestructura)) as telefono,
COALESCE(dav.correo,(SELECT cr.correo FROM mod_estructuracomp.dat_estructuraop cr WHERE cr.idestructuraop = p_idestructura)) as correo,
i.urllogo as logo,
(per.nombre||' '||coalesce(per.snombre,'')||' '||per.papel||' '||per.sapel) as vendedor,
dd.estado, /*tarj.titular, tarj.digitos, nmv.codigoiso,*/'','','',dv.idpago, coalesce(dvo.nroorden, '-') as nropedido,
dv.idoperacion,doc.imagen as qrdocumento, imgtr.imagen as qrenzona, imgez.imagen as qrtransfermovil
from mod_logistica.dat_documento dd
inner join mod_logpuntoventa.dat_ventas dv on dv.idventas = dd.iddocumento
left join mod_logpuntoventa.dat_ventaorden dvo on dvo.idventas = dv.idventas
inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
inner join mod_logpuntoventa.dat_areaventa dav on dav.idestructuraop = dd.idestructuracomun and dav.idestructuracomun = p_idestructura
left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = des.idestructuracomun
left join mod_datosmaestros.nom_operacion nop on nop.idnomoperaciones = dd.idoperacion
inner join mod_logistica.dat_documentocliente ddc on ddc.iddocumento = dd.iddocumento 
left join mod_datosmaestros.nom_moneda nm on nm.idmoneda = dv.idmoneda
inner join mod_logpuntoventa.nom_modopago mp on mp.idmodopago = dv.idpago
left join mod_logpuntoventa.dat_ventacliente dvc on dvc.idventacliente = dv.idpersona
--left join mod_logpuntoventa.dat_ventastarjeta tarj on tarj.idventas = dv.idventas
--left join mod_datosmaestros.nom_moneda nmv on nmv.idmoneda = tarj.idmoneda
left join mod_logistica.conf_general i on i.idestructura = de.idestructura
inner join mod_seguridad.seg_usuario u on u.idusuario = dd.idusuario
left join mod_persona.dat_persona per on per.idpersona = u.idpersona 
left join mod_logistica.dat_documentoimagen ddoc on ddoc.iddocumento = dd.iddocumento and ddoc.tipo = 3
left join mod_logistica.nom_imagen doc on doc.idimagen = ddoc.idimagen
left join mod_logistica.dat_documentoimagen dtr on dtr.iddocumento = dd.iddocumento and dtr.tipo = 2
left join mod_logistica.nom_imagen imgtr on dtr.idimagen = imgtr.idimagen
left join mod_logistica.dat_documentoimagen dez on dez.iddocumento = dd.iddocumento and dez.tipo = 1
left join mod_logistica.nom_imagen imgez on dez.idimagen = imgez.idimagen
where dd.iddocumento = p_iddocumento
loop
return next all_rec;
end loop;
end;
$BODY$;

ALTER FUNCTION mod_logpuntoventa.f_modelocomprobante(numeric, numeric, numeric)
    OWNER TO zeolides;
 
  
-- FUNCTION: mod_logpuntoventa.f_modelocomprobanteprod(numeric, numeric)

-- DROP FUNCTION IF EXISTS mod_logpuntoventa.f_modelocomprobanteprod(numeric, numeric);

CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_modelocomprobanteprod(
	p_iddocumento numeric,
	p_original numeric DEFAULT 0)
    RETURNS SETOF mod_logpuntoventa.td_modelocomprobanteprod 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
	DECLARE

	v_rec mod_logpuntoventa.td_modelocomprobanteprod;

	BEGIN    
		for v_rec in select q.* from (select DISTINCT coalesce(ni.numeropieza, ni.codigo) as codigo,
        ni.denominacion as denom,num.abreviaturaunidadmedida as um, 
        (case when p_original = 1 then vp.cantidad else (vp.cantidad - coalesce(vp.cantidaddev,0)) end)  as cantidad, 
        vp.precio, 
        (case when p_original = 1 then vp.importetotal else ((vp.cantidad - coalesce(vp.cantidaddev,0)) * vp.precio) end)  as importetotal, 
        vp.descuento,
        (vp.cantidad * COALESCE(nih.peso,0)/1000) as peso,
		ni.tipo
        from mod_logpuntoventa.dat_ventaproducto vp
        inner join mod_logistica.dat_producto dprod on dprod.idproducto = vp.idproducto
        left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dprod.idindicador        
        left join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ni.idindicador
        left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = dprod.idumedida
        --left join mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = dm.idmovimiento
        --left join mod_logfacturacion.dat_prodfactura dpf on dpf.idmovimiento = dm.idmovimiento
        where vp.idventas = $1
        group by ni.numeropieza,ni.codigo,nih.descripcionventa,ni.denominacion,num.abreviaturaunidadmedida,
        vp.cantidad,vp.cantidaddev,vp.precio,vp.importetotal,vp.descuento,nih.peso,ni.tipo
        having (case when p_original = 1 then vp.cantidad else vp.cantidad - coalesce(vp.cantidaddev,0) end) > 0
		UNION
		select DISTINCT coalesce(ni.numeropieza, ni.codigo) as codigo,
		        ni.denominacion as denom,num.abreviaturaunidadmedida as um, 
		        (case when p_original = 1 then vp.cantidad else (vp.cantidad - coalesce(vp.cantidaddev,0)) end)  as cantidad, 
        		vp.precio, 
        		(case when p_original = 1 then vp.importetotal else ((vp.cantidad - coalesce(vp.cantidaddev,0)) * vp.precio) end)  as importetotal, 
		        vp.descuento,
		        (vp.cantidad * COALESCE(nih.peso,0)/1000) as peso,
			    ni.tipo
		        from mod_logpuntoventa.dat_ventaservicio vp
		        inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = vp.idindicador        
		        inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ni.idindicador
		        inner join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = ni.idumedida
		        --left join mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = dm.idmovimiento
		        --left join mod_logfacturacion.dat_prodfactura dpf on dpf.idmovimiento = dm.idmovimiento
		        where vp.idventas = $1
		        group by ni.numeropieza,ni.codigo,nih.descripcionventa,ni.denominacion,num.abreviaturaunidadmedida,
		        vp.cantidad,vp.cantidaddev,vp.precio,vp.importetotal,vp.descuento,nih.peso,ni.tipo
				having (case when p_original = 1 then vp.cantidad else vp.cantidad - coalesce(vp.cantidaddev,0) end) > 0
		) q order by q.tipo, q.codigo
		loop
			return next v_rec;
		end loop;
	END;
$BODY$;

ALTER FUNCTION mod_logpuntoventa.f_modelocomprobanteprod(numeric, numeric)
    OWNER TO zeolides;
	
	
-- FUNCTION: mod_logpuntoventa.f_serviciosventa(numeric, numeric, character varying, numeric, numeric, numeric, numeric, numeric, numeric, numeric)

-- DROP FUNCTION IF EXISTS mod_logpuntoventa.f_serviciosventa(numeric, numeric, character varying, numeric, numeric, numeric, numeric, numeric, numeric, numeric);

CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_serviciosventa (
  p_idareaventa numeric,
  p_idnaturaleza numeric,
  p_criterio varchar,
  p_idmonedacontable numeric,
  p_idmonedaventa numeric,
  p_limit numeric,
  p_start numeric,
  p_criterioavan numeric,
  p_idnaturalezapadre numeric,
  p_precio numeric = 0
)
RETURNS SETOF mod_logpuntoventa.td_serviciosventa AS
$body$
declare
all_rec mod_logpuntoventa.td_serviciosventa;
v_inindextable record;
v_cantoperario numeric;
v_recordoperario record;
begin
for all_rec in
select dsa.idindicador,num.abreviaturaunidadmedida as um,dsa.idservicio,
(COALESCE(ni.numeropieza,ni.codigo)||' - '||coalesce(nih.descripcionventa,substring(ni.denominacion,0,30))) as text,
nn.denominacion as naturaleza,
(case when p_idmonedacontable is not null then (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_idmonedacontable) else '' end) as monedacontable,
(case when p_idmonedaventa is not null then (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_idmonedaventa) else '' end) as monedaventa,
count(*) OVER() as total,coalesce(nih.codigobarra, ni.codigo) as referencia,coalesce(nih.descripcionventa,substring(ni.denominacion,0,25)) as descripcionventa,
ni.denominacion,nn.idnaturaleza,dsa.preciobase as preciobase, dsa.precio as precioventa,
(select natv.idreferencia from mod_logpuntoventa.dat_naturalezaagrupacion natv 
inner join mod_logpuntoventa.dat_naturalezaventa nvv on nvv.idpadre = natv.idnaturalezaagrupacion
where nvv.idnaturaleza = nn.idnaturaleza limit 1) as idcategoriapadre,null,null,null,num.decimales
from mod_logpuntoventa.dat_servicioareaventa dsa
inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dsa.idindicador
left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = ni.idumedida
left join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador= ni.idindicador
left join mod_datosmaestros.nom_naturaleza nn on nn.idnaturaleza = ni.idnaturaleza
left join mod_datosmaestros.nom_especialidad ne on ne.idespecialidad = ni.idespecialidad
where dsa.idareaventa = p_idareaventa
and (case when p_criterio is not null then (ni.denominacion ilike '%' || p_criterio || '%' or ni.numeropieza ilike '%' || p_criterio || '%' or ni.codigo ilike '%' || p_criterio || '%') else
true end)
and(case when p_idnaturaleza is not null then ni.idnaturaleza = p_idnaturaleza else true end)
and(case when p_idnaturalezapadre is not null then ni.idnaturaleza =any(
select idnaturaleza from mod_logpuntoventa.dat_naturalezaventa where idpadre = p_idnaturalezapadre
)else true end)
and(case when p_precio = 1 then dsa.precio > 0 else true end)

group by dsa.idindicador,ni.codigo,ni.numeropieza,nih.codigobarra,ni.denominacion,ni.descripcion,num.abreviaturaunidadmedida,dsa.idservicio,nih.descripcionventa,
nn.idnaturaleza,nn.denominacion,ne.denespecialidad,
dsa.preciobase,dsa.precio,dsa.idareaventa,num.decimales

order by text
offset p_start limit p_limit
loop
select ps.idindicador, ps.idareaventa into v_inindextable from mod_logpuntoventa.dat_prodservareaventa ps 
  where ps.idareaventa = p_idareaventa and ps.idindicador = all_rec.idindicador;
  if v_inindextable.idindicador is null then
      insert into mod_logpuntoventa.dat_prodservareaventa(idindicador, idareaventa)
      values(all_rec.idindicador, p_idareaventa) RETURNING indexaux into all_rec.indexauxiliar;
  end if; 
  select count(distinct sp.idpersona) into v_cantoperario from mod_logpuntoventa.dat_serviciopersona sp 
  where sp.idservicio = all_rec.idservicio;
  if v_cantoperario = 1 THEN
  	select sp.idpersona, per.nombre || ' ' || coalesce(per.snombre, '') || ' ' || per.papel || ' ' || per.sapel as nombre 
    into v_recordoperario from mod_logpuntoventa.dat_serviciopersona sp 
    inner join mod_persona.dat_persona per on per.idpersona = sp.idpersona 
    where sp.idservicio = all_rec.idservicio limit 1;
  	all_rec.idpersona := v_recordoperario.idpersona;
    all_rec.nombrepersona := v_recordoperario.nombre;
  else
  	all_rec.idpersona := -1;
    all_rec.nombrepersona := '';
  end if;
--raise exception '%', all_rec;
return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

-- FUNCTION: mod_logpuntoventa.f_productosventa(numeric, numeric, numeric, numeric, character varying, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric)

-- DROP FUNCTION IF EXISTS mod_logpuntoventa.f_productosventa(numeric, numeric, numeric, numeric, character varying, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric);

CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_productosventa(
	p_idestructura numeric,
	p_idnaturaleza numeric,
	p_disponibilidad numeric,
	p_existencia numeric,
	p_criterio character varying,
	p_idmonedacontable numeric,
	p_idmonedaalternativa numeric,
	p_idmonedaventa numeric,
	p_idmarca numeric,
	p_idmodelo numeric,
	p_limit numeric,
	p_start numeric,
	p_criterioavan numeric,
	p_connumeropieza numeric,
	p_idnaturalezapadre numeric,
	p_precio numeric DEFAULT 0)
    RETURNS SETOF mod_logpuntoventa.td_productosventa 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
declare
all_rec mod_logpuntoventa.td_productosventa;
v_inindextable record;
v_idareaventa numeric;
begin
	select ar.idareaventa into v_idareaventa from mod_logpuntoventa.dat_areaventa ar where ar.idestructuraop = p_idestructura;
for all_rec in
select dp.idindicador,num.abreviaturaunidadmedida as um,dp.idproducto,
(COALESCE(ni.numeropieza,ni.codigo)||' - '||coalesce(nih.descripcionventa,substring(ni.denominacion,0,30))) as text,
dp.cantidad -(select coalesce(sum(cantidad),0) from mod_logistica.dat_cantidadcomprometida where estado = 1 and idproducto = dp.idproducto)
/*-coalesce((select sum(coalesce(pp1.cantidad,0)) from mod_logpuntoventa.dat_pedidoproducto pp1 
                inner join mod_logpuntoventa.dat_pedidotienda pt on pt.idpedidotienda = pp1.idpedidotienda
                where pp1.idproducto = dp.idproducto and pt.estado in (1)),0)*/ as disponible,
coalesce(l.existencia, dp.cantidad) as existencia,dp.precio as preciocontable,dp.precioalternativo as precioalternativo,dp.importe as importetotalcup,
dp.importealternativo as importetotalcuc,num.decimales,nn.denominacion as naturaleza,
(case when nih.tipocontrol = 2 then 1 else 0 end) as tienelote,
(case when nih.tipocontrol = 3 then 1 else 0 end) as equipo,
(case when p_idmonedacontable is not null then (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_idmonedacontable) else '' end) as monedacontable,
(case when p_idmonedaalternativa is not null then (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_idmonedaalternativa) else '' end) as monedaalternativa,
(case when p_idmonedaventa is not null then (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_idmonedaventa) else '' end) as monedaventa,
nma.denominacion||' - '||nmo.denominacion as marcamodelo,
(select 'data:image/jpg;base64,'||imag.imagen from mod_datosmaestros.dat_imagenindicador dim
inner join mod_logistica.nom_imagen imag on imag.idimagen = dim.idimagen
where dim.idindicador = ni.idindicador limit 1) as imagen,
count(*) OVER() as total,coalesce(nih.codigobarra, (case when p_connumeropieza = 10 then ni.codigo else ni.numeropieza end)) as referencia,nih.descripcionventa,
ni.denominacion,ni.descripcion,nn.idnaturaleza,coalesce(l.preciobase,pv.preciobase) as preciobase,coalesce(l.precioventa,pv.precio) as precio,
coalesce((select sum(cantidad) from mod_logpuntoventa.dat_ventaproducto where idproducto = dp.idproducto),0) as vendida,
coalesce((select sum(importetotal) from mod_logpuntoventa.dat_ventaproducto where idproducto = dp.idproducto),0) as total,
coalesce(dp.cantidad-coalesce(
	(select sum(COALESCE(dpped.enproceso,0)-COALESCE(dpped.devuelto,0)) from mod_logpuntoventa.dat_pedidoproducto dpped where dpped.idproducto = dp.idproducto
    and dpped.enproceso > 0)
,0),0)-(dp.cantidad-coalesce((select sum(cc.cantidad) from mod_logistica.dat_cantidadcomprometida cc where cc.idproducto = dp.idproducto and cc.estado = 1),0)),
(
case when p_connumeropieza = 10 then
(select natv.idreferencia from mod_logpuntoventa.dat_naturalezaagrupacion natv 
inner join mod_logpuntoventa.dat_naturalezaventa nvv on nvv.idpadre = natv.idnaturalezaagrupacion
where nvv.idnaturaleza = nn.idnaturaleza limit 1)
 else (select natv.idreferencia from mod_logpuntoventa.dat_areaventanaturaleza natv where natv.idareaventa = pv.idareaventa
and natv.idnaturaleza = nn.idnaturaleza limit 1) end
) as idcategoriapadre, null, nih.codigobarra
from mod_logistica.dat_producto dp
inner join mod_estructuracomp.v_dametodasestructuras deop on deop.idestructura = dp.idestructura
left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
left join mod_logpuntoventa.dat_productoareaventa pv on pv.idproducto = dp.idproducto
left join (
select distinct pl.idproducto, pls.preciobase, pls.precioventa, sum(l.existencia) as existencia from mod_logpuntoventa.dat_preciolotes pls 
inner join mod_logpuntoventa.dat_productolote pl on pl.idprecioslotes = pls.idprecioslotes
inner join mod_logistica.dat_lote l on l.idlote = pl.idlote
group by pl.idproducto, pls.preciobase, pls.precioventa
) l on l.idproducto = dp.idproducto
left join mod_logistica.nom_categoria nc on nc.idcategoria = dp.idcategoria
left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = dp.idumedida
left join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador= ni.idindicador
left join mod_datosmaestros.nom_naturaleza nn on nn.idnaturaleza = ni.idnaturaleza
left join mod_datosmaestros.nom_especialidad ne on ne.idespecialidad = ni.idespecialidad
left join mod_datosmaestros.nom_marca nma on nih.idmarca = nma.idmarca
left join mod_datosmaestros.nom_modelo nmo on nih.idmodelo = nmo.idmodelo
--left join mod_datosmaestros.nom_imagenindicador nii on nii.idimagen = ni.idindicador
where dp.cronologia > 0 and dp.idestructura = p_idestructura

and (case when p_criterio is not null then (ni.denominacion ilike '%' || p_criterio || '%' or ni.numeropieza ilike '%' || p_criterio || '%' or ni.codigo ilike '%' || p_criterio || '%') else
true end)
and(case when p_idnaturaleza is not null then ni.idnaturaleza = p_idnaturaleza else true end)
and(case when p_idmarca is not null then nih.idmarca = p_idmarca else true end)
and(case when p_idmodelo is not null then nih.idmodelo = p_idmodelo else true end)
and(case when p_disponibilidad = 1 then (dp.cantidad -(select coalesce(sum(cantidad),0)
from mod_logistica.dat_cantidadcomprometida where estado = 1 and idproducto = dp.idproducto)) > 0 else true end)
and(case when p_existencia = 1 then dp.cantidad > 0 else true end)
and(case when p_connumeropieza is not null then ni.numeropieza is not null else true end)
and(case when p_idnaturalezapadre is not null then ni.idnaturaleza =any(
select idnaturaleza from mod_logpuntoventa.dat_naturalezaventa where idpadre = p_idnaturalezapadre
)else true end)
and(case when p_precio = 1 then pv.precio > 0 else true end)

group by dp.idindicador,ni.codigo,ni.numeropieza,nih.codigobarra,ni.denominacion,ni.descripcion,num.abreviaturaunidadmedida,existencia,dp.idproducto,nih.tipocontrol,nih.descripcionventa,imagen,
nc.denominacion,num.decimales,deop.denominacion,deop.codigo,nn.idnaturaleza,nn.denominacion,deop.idestructura,ne.denespecialidad,nma.idmarca,nmo.idmodelo,nma.denominacion,nmo.denominacion,
coalesce(l.preciobase,pv.preciobase),coalesce(l.precioventa,pv.precio),pv.cantidadentienda, pv.idareaventa

order by text
offset p_start limit p_limit
loop
--raise exception '%', all_rec;
	if p_connumeropieza = 10 then
	  select ps.idindicador, ps.idareaventa, ps.indexaux into v_inindextable from mod_logpuntoventa.dat_prodservareaventa ps 
	  where ps.idareaventa = v_idareaventa and ps.idindicador = all_rec.idindicador;
	  if v_inindextable.idindicador is null then
	      insert into mod_logpuntoventa.dat_prodservareaventa(idindicador, idareaventa)
	      values(all_rec.idindicador, v_idareaventa) RETURNING indexaux into all_rec.indexauxiliar;
	  else 
		  all_rec.indexauxiliar := v_inindextable.indexaux;
	  end if;
	end if;
return next all_rec; end loop;
end;
$BODY$;

ALTER FUNCTION mod_logpuntoventa.f_productosventa(numeric, numeric, numeric, numeric, character varying, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric)
    OWNER TO zeolides;


	
  