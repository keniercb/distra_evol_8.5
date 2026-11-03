CREATE SEQUENCE mod_logpuntoventa.sec_datpreciolotes_seq
  INCREMENT 1 MINVALUE 1000
  MAXVALUE 1099999999 START 1000
  CACHE 1;
  
CREATE TABLE mod_logpuntoventa.dat_preciolotes (
  idprecioslotes NUMERIC(19,0) DEFAULT nextval('mod_logpuntoventa.sec_datpreciolotes_seq'::regclass) NOT NULL,
  preciobase NUMERIC(25,6) DEFAULT 0,
  precioventa NUMERIC(25,6) DEFAULT 0,
  fecha DATE,
  idproducto NUMERIC(19,0),
  CONSTRAINT dat_preciolotes_pkey PRIMARY KEY(idprecioslotes)
) 
WITH (oids = false);

ALTER TABLE mod_logpuntoventa.dat_preciolotes
  OWNER TO zeolides;
  
CREATE TABLE mod_logpuntoventa.dat_productolote (
  idlote NUMERIC(19,0) NOT NULL,
  idproducto NUMERIC(19,0),
  preciobase NUMERIC(25,6),
  precioventa NUMERIC(25,6),
  fecha DATE,
  cantidadentienda NUMERIC(25,6),
  idprecioslotes NUMERIC(19,0),
  CONSTRAINT dat_productolote_pkey PRIMARY KEY(idlote)
) 
WITH (oids = false);

ALTER TABLE mod_logpuntoventa.dat_productolote
  OWNER TO zeolides;
  
CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_productosventa (
  p_idestructura numeric,
  p_idnaturaleza numeric,
  p_disponibilidad numeric,
  p_existencia numeric,
  p_criterio varchar,
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
  p_precio numeric = 0
)
RETURNS SETOF mod_logpuntoventa.td_productosventa AS
$body$
declare
all_rec mod_logpuntoventa.td_productosventa;
begin
for all_rec in
select dp.idindicador,num.abreviaturaunidadmedida as um,dp.idproducto,
(COALESCE(ni.numeropieza,ni.codigo)||' - '||coalesce(nih.descripcionventa,substring(ni.denominacion,0,30))) as text,
dp.cantidad -(select coalesce(sum(cantidad),0) from mod_logistica.dat_cantidadcomprometida where estado = 1 and idproducto = dp.idproducto) as disponible,
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
count(*) OVER() as total,ni.numeropieza as referencia,nih.descripcionventa,
ni.denominacion,ni.descripcion,nn.idnaturaleza,coalesce(l.preciobase,pv.preciobase) as preciobase,coalesce(l.precioventa,pv.precio) as precio,
coalesce((select sum(cantidad) from mod_logpuntoventa.dat_ventaproducto where idproducto = dp.idproducto),0) as vendida,
coalesce((select sum(importetotal) from mod_logpuntoventa.dat_ventaproducto where idproducto = dp.idproducto),0) as total,
coalesce(dp.cantidad-coalesce(
	(select sum(COALESCE(dpped.enproceso,0)-COALESCE(dpped.devuelto,0)) from mod_logpuntoventa.dat_pedidoproducto dpped where dpped.idproducto = dp.idproducto
    and dpped.enproceso > 0)
,0),0)-(dp.cantidad-coalesce((select sum(cc.cantidad) from mod_logistica.dat_cantidadcomprometida cc where cc.idproducto = dp.idproducto and cc.estado = 1),0)),
(select natv.idreferencia from mod_logpuntoventa.dat_areaventanaturaleza natv where natv.idareaventa = pv.idareaventa
and natv.idnaturaleza = nn.idnaturaleza limit 1) as idcategoriapadre
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

group by dp.idindicador,ni.codigo,ni.numeropieza,ni.denominacion,ni.descripcion,num.abreviaturaunidadmedida,existencia,dp.idproducto,nih.tipocontrol,nih.descripcionventa,imagen,
nc.denominacion,num.decimales,deop.denominacion,deop.codigo,nn.idnaturaleza,nn.denominacion,deop.idestructura,ne.denespecialidad,nma.idmarca,nmo.idmodelo,nma.denominacion,nmo.denominacion,
coalesce(l.preciobase,pv.preciobase),coalesce(l.precioventa,pv.precio),pv.cantidadentienda, pv.idareaventa

order by text
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
COST 100 ROWS 1000;

ALTER FUNCTION mod_logpuntoventa.f_productosventa (p_idestructura numeric, p_idnaturaleza numeric, p_disponibilidad numeric, p_existencia numeric, p_criterio varchar, p_idmonedacontable numeric, p_idmonedaalternativa numeric, p_idmonedaventa numeric, p_idmarca numeric, p_idmodelo numeric, p_limit numeric, p_start numeric, p_criterioavan numeric, p_connumeropieza numeric, p_idnaturalezapadre numeric, p_precio numeric)
  OWNER TO zeolides;
  
CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_actualizarpreciosventa (
  p_idareaventa numeric,
  p_fechacontable date
)
RETURNS void AS
$body$
DECLARE
v_datosconf record;
v_recprodutos record;
v_in record;
v_tasa record;
v_preciobase numeric;
v_precio numeric;
v_idprecioslotes numeric;
v_count numeric;
BEGIN
SELECT * into v_datosconf FROM mod_logpuntoventa.dat_areaventa where idareaventa = p_idareaventa;
--raise notice 'v_datosconf %',v_datosconf;
for v_recprodutos in SELECT idproducto, precio, precioventa, precioalt, precioventaalt, monedacontable, monedaalternativa 
                      FROM mod_logfacturacion.f_getproductosprecioventa(v_datosconf.idestructuraop, v_datosconf.idcliente, 
                      v_datosconf.idtipoprecio, v_datosconf.idmoneda, v_datosconf.idestructuracomun)
loop
	/*if v_recprodutos.monedaalternativa != v_datosconf.idmoneda then
        v_preciobase = 0;
        v_precio = 0;
   		select * into v_tasa from mod_logpuntoventa.nom_tasacambio where idmonedabase = v_recprodutos.monedaalternativa and idmonedacambio = v_datosconf.idmoneda; 	
        if v_tasa.idtasacambio is not null then
        	v_preciobase = round((v_recprodutos.precioalt * v_tasa.venta),2);
            v_precio = round((v_recprodutos.precioventaalt * v_tasa.venta),2);
        else 
        	select * into v_tasa from mod_logpuntoventa.nom_tasacambio where idmonedabase = v_datosconf.idmoneda and idmonedacambio = v_recprodutos.monedaalternativa; 
            if v_tasa.idtasacambio is not null then
            	v_preciobase = round((v_recprodutos.precioalt / v_tasa.venta),2);
                v_precio = round((v_recprodutos.precioventaalt / v_tasa.venta),2);
            end if;
        end if;
    else*/
    	v_preciobase = v_recprodutos.precio;
        v_precio = v_recprodutos.precioventa;
    --end if;
    --raise notice 'v_tasa %',v_tasa;
	select * into v_in from mod_logpuntoventa.dat_productoareaventa where idproducto = v_recprodutos.idproducto;
    --raise notice 'v_in %',v_in.precio||'---'|| v_recprodutos.precioventaalt;
      if v_in.idproducto is not null and (v_in.precio != v_precio or v_in.preciobase != v_preciobase) then
       	UPDATE mod_logpuntoventa.dat_productoareaventa 
        SET preciobase = v_preciobase,
            precio = v_precio,
            idmoneda = v_datosconf.idmoneda,
            fecha = p_fechacontable
        WHERE idproducto = v_in.idproducto; 
          INSERT INTO mod_logpuntoventa.his_productoareaventa(idproducto,preciobase,precio,idmoneda,fechaanterior,fechaactualizacion)
			VALUES (v_in.idproducto,v_in.preciobase,v_in.precio,v_in.idmoneda,v_in.fecha,p_fechacontable);
          --enviar el otro para el historico
      else if v_in.idproducto is null then 
        INSERT INTO mod_logpuntoventa.dat_productoareaventa(idproducto,preciobase,precio,idmoneda,idareaventa,fecha)
          VALUES (v_recprodutos.idproducto,v_preciobase,v_precio,v_datosconf.idmoneda,p_idareaventa,p_fechacontable);
        end if;
      end if;
      v_count := (select count(l.idlote) 
       from mod_logistica.dat_lote l 
      left join mod_logpuntoventa.dat_productolote pl on pl.idlote = l.idlote
      where l.idproducto = v_recprodutos.idproducto and l.cronologia > 0 and pl.idlote is null);
      if v_count > 0 and v_precio > 0 and v_preciobase > 0 then
        v_idprecioslotes := COALESCE((select pl.idprecioslotes from mod_logpuntoventa.dat_preciolotes pl where pl.idproducto = v_recprodutos.idproducto
        and pl.preciobase = v_preciobase and pl.precioventa = v_precio limit 1),0);
        if v_idprecioslotes = 0 then
            insert into mod_logpuntoventa.dat_preciolotes
            (
                preciobase,precioventa,fecha,idproducto
            )
            values (v_preciobase, v_precio, p_fechacontable, v_recprodutos.idproducto)
            returning idprecioslotes into v_idprecioslotes;
        end if; 
        insert into mod_logpuntoventa.dat_productolote(idlote, idproducto, preciobase, precioventa, fecha, idprecioslotes)
        (select l.idlote, v_recprodutos.idproducto, v_preciobase, v_precio, p_fechacontable, v_idprecioslotes 
         from mod_logistica.dat_lote l 
        left join mod_logpuntoventa.dat_productolote pl on pl.idlote = l.idlote
        where l.idproducto = v_recprodutos.idproducto and l.cronologia > 0 and pl.idlote is null);
     end if; 	
end loop;  
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

ALTER FUNCTION mod_logpuntoventa.f_actualizarpreciosventa (p_idareaventa numeric, p_fechacontable date)
  OWNER TO zeolides;