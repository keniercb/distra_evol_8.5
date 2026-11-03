ALTER TABLE mod_logpuntoventa.dat_infoconexion
  ADD COLUMN usuario_api VARCHAR(100);
  
ALTER TABLE mod_logpuntoventa.dat_infoconexion
  ADD COLUMN password_api VARCHAR(100);  

ALTER TABLE mod_logpuntoventa.dat_pedidotienda
  ADD COLUMN motivocancelacion VARCHAR(255);
  
ALTER TABLE mod_logpuntoventa.dat_pedidotienda
  ADD COLUMN idusuariocancela NUMERIC(19,0);
  
ALTER TABLE mod_logpuntoventa.dat_pedidoproducto
  ADD COLUMN addmod NUMERIC(1,0);

COMMENT ON COLUMN mod_logpuntoventa.dat_pedidoproducto.addmod
IS '1-adicionado, 2-modificado';

ALTER TABLE mod_logpuntoventa.dat_pedidoproducto
  ADD COLUMN idusuarioaddmod NUMERIC(19,0);  
  
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
	p_precio numeric DEFAULT 0,
	p_idproductos varchar = NULL::character varying)
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
and (case when p_idproductos is not null then dp.idproducto = any (cast(p_idproductos as numeric[])) else true end)
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

ALTER FUNCTION mod_logpuntoventa.f_productosventa(numeric, numeric, numeric, numeric, character varying, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, character varying)
    OWNER TO zeolides;
	
-- FUNCTION: mod_logpuntoventa.f_serviciosventa(numeric, numeric, character varying, numeric, numeric, numeric, numeric, numeric, numeric, numeric)

-- DROP FUNCTION IF EXISTS mod_logpuntoventa.f_serviciosventa(numeric, numeric, character varying, numeric, numeric, numeric, numeric, numeric, numeric, numeric);

CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_serviciosventa(
	p_idareaventa numeric,
	p_idnaturaleza numeric,
	p_criterio character varying,
	p_idmonedacontable numeric,
	p_idmonedaventa numeric,
	p_limit numeric,
	p_start numeric,
	p_criterioavan numeric,
	p_idnaturalezapadre numeric,
	p_precio numeric DEFAULT 0,
	p_idservicios varchar = NULL::character varying)
    RETURNS SETOF mod_logpuntoventa.td_serviciosventa 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
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
and (case when p_idservicios is not null then ni.idindicador = any (cast(p_idservicios as numeric[])) else true end)
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
$BODY$;

ALTER FUNCTION mod_logpuntoventa.f_serviciosventa(numeric, numeric, character varying, numeric, numeric, numeric, numeric, numeric, numeric, numeric, character varying)
    OWNER TO zeolides;

