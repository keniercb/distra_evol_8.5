ALTER TYPE mod_logpuntoventa.td_productosventa
    ADD ATTRIBUTE idcategoriapadre numeric;

ALTER TABLE mod_logpuntoventa.dat_cajausuario
  ADD CONSTRAINT dat_cajausuario_pincaja 
    UNIQUE (idcaja, pin) NOT DEFERRABLE;

ALTER TABLE mod_logpuntoventa.dat_pedidoproducto
  ADD COLUMN IF NOT EXISTS tipo NUMERIC(1,0) DEFAULT 1;

CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_procesarpedidosinfoventa(
	p_idpedido numeric)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE STRICT PARALLEL UNSAFE
AS $BODY$
DECLARE
  v_lineinfo record;
  v_datosareaventa record;
  v_lineprod varchar[];
  v_codprod varchar;
  v_cantidadprod numeric;
  v_precioprod numeric;
  v_importeprod numeric;
  v_contadoroper integer;
  v_nombretabla varchar;
  v_sql varchar;
  v_sql2 varchar;
BEGIN
   delete from mod_logpuntoventa.dat_pedidoproducto where idpedidotienda = p_idpedido;
   v_nombretabla := 'tem_infoventas_'||p_idpedido;
   select av.* into v_datosareaventa from mod_logpuntoventa.dat_areaventa av
   inner join mod_logpuntoventa.dat_pedidotienda pt on pt.idareaventa = av.idareaventa and pt.idpedidotienda = p_idpedido;
     
   v_sql := 'CREATE TEMPORARY TABLE '||v_nombretabla||' ON COMMIT DROP AS (
   		select
		regexp_split_to_table(
			pt.infoventa
			, ''\n'') as linea 
		from mod_logpuntoventa.dat_pedidotienda pt
	   where pt.idpedidotienda ='|| p_idpedido||'
   )';
   execute v_sql;
	--'||$$'{$$ ||v_rangofecha.startdate|| $$}'$$||' and '||$$'{$$ ||v_rangofecha.enddate|| $$}'$$||'
	v_sql2 := 'select iv.linea from '||v_nombretabla||' iv';
   for v_lineinfo in execute v_sql2 loop
   		select
		array_agg(t.fragmento) into v_lineprod from (
			select regexp_split_to_table(v_lineinfo.linea, ';') as fragmento
		) t;  
   		if v_lineprod[4]::numeric = 4 then
			v_codprod := v_lineprod[5];
			v_cantidadprod := REGEXP_REPLACE(v_lineprod[8],',','')::numeric;
			v_importeprod := REGEXP_REPLACE(v_lineprod[9],',','')::numeric;
			v_precioprod := REGEXP_REPLACE(v_lineprod[17],',','')::numeric;
			INSERT INTO mod_logpuntoventa.dat_pedidoproducto(
				idpedidotienda, codreferencia, idindicador, idproducto, 
				cantidad, precio, importe, idumedida, enproceso, procesado, 
				devuelto, devolver, cantidadreal, preciounitario, tipo
			)
				select 
				p_idpedido, ni.numeropieza, ni.idindicador, dp.idproducto, v_cantidadprod, v_precioprod, v_importeprod, coalesce(dp.idumedida, ni.idumedida),
				0,0,0,0,v_cantidadprod,v_precioprod, ni.tipo
				from mod_datosmaestros.nom_indicador ni 
				inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ni.idindicador
				inner join (
					select dpp.idproducto, dpp.idindicador, dpp.idestructura, dpp.idumedida, (
						case when dpa.idproducto is null then 1 else 0 end
					) as activo from mod_logistica.dat_producto dpp
					left join mod_logistica.dat_productoinactivo dpa on dpa.idproducto = dpp.idproducto 
				) dp on dp.idindicador = ni.idindicador and dp.idestructura = v_datosareaventa.idestructuraop and dp.activo = 1
				where ni.codigo = v_codprod or nih.codigobarra = v_codprod;
					elseif array_length(v_lineprod,1)::numeric = 8 
						and REGEXP_REPLACE(v_lineprod[1],'\''','')::numeric = 0 and v_lineprod[2]::numeric = 0 and v_lineprod[3]::numeric = 0 and v_lineprod[4]::numeric = 0 and v_lineprod[5]::numeric = 6 then
						v_contadoroper := v_lineprod[8]::numeric;
					end if;
					raise notice 'linea %', v_lineinfo.linea;
   end loop;
   update mod_logpuntoventa.dat_pedidotienda set receiptnumber = v_contadoroper where idpedidotienda = p_idpedido;
   return;
   commit;
END;
$BODY$;

ALTER FUNCTION mod_logpuntoventa.f_procesarpedidosinfoventa(numeric)
    OWNER TO zeolides;
	
CREATE TYPE mod_logpuntoventa.td_infopagopedido AS (
  idpago NUMERIC,
  denominacion VARCHAR(255),
  importe NUMERIC(25,2)
);

ALTER TYPE mod_logpuntoventa.td_infopagopedido
  OWNER TO postgres;

CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_getpagopedido (
  p_idpedido numeric
)
RETURNS SETOF mod_logpuntoventa.td_infopagopedido AS
$body$
	DECLARE

	v_rec mod_logpuntoventa.td_infopagopedido;
    v_pedidostienda record;
    v_infopago record;
    v_lineinfopago varchar[];

	BEGIN    
    select pt.* into v_pedidostienda from mod_logpuntoventa.dat_pedidotienda pt where pt.idpedidotienda = p_idpedido;
		for v_infopago in (
					select t.fragmento from (
							select regexp_split_to_table(v_pedidostienda.infopago, '\n') as fragmento
						) t
					)
		loop
        	select array_agg(t.fragmento) into v_lineinfopago from (
                        select regexp_split_to_table(v_infopago.fragmento, ';') as fragmento
                    ) t;
                if v_lineinfopago[4]::numeric = 6 then
                    --v_tipopago := (select np.idmodopago from mod_logpuntoventa.nom_modopago np where np.codigocaja = v_lineinfopago[5]::numeric limit 1);
                    v_rec.idpago = v_lineinfopago[5]::numeric;
                    v_rec.denominacion = REPLACE(v_lineinfopago[6],'"','');
                    v_rec.importe = v_lineinfopago[9]::numeric;
                    --if v_tipopago is not null then
                        /*INSERT INTO mod_logpuntoventa.dat_desglosepago(
                        iddocumento, idformapago, importe)
                        VALUES (v_iddocumento, v_tipopago, v_importepago);*/
                        return next v_rec;
                    --end if;	
                end if;
		end loop;
	END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

ALTER FUNCTION mod_logpuntoventa.f_getpagopedido (p_idpedido numeric)
  OWNER TO zeolides;  
  
  
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
begin
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
) as idcategoriapadre
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
return next all_rec; end loop;
end;
$BODY$;

ALTER FUNCTION mod_logpuntoventa.f_productosventa(numeric, numeric, numeric, numeric, character varying, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric)
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
	p_precio numeric DEFAULT 0)
    RETURNS SETOF mod_logpuntoventa.td_serviciosventa 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
declare
all_rec mod_logpuntoventa.td_serviciosventa;
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
where nvv.idnaturaleza = nn.idnaturaleza limit 1) as idcategoriapadre
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
dsa.preciobase,dsa.precio,dsa.idareaventa

order by text
offset p_start limit p_limit
loop
--raise exception '%', all_rec;
return next all_rec; end loop;
end;
$BODY$;

ALTER FUNCTION mod_logpuntoventa.f_serviciosventa(numeric, numeric, character varying, numeric, numeric, numeric, numeric, numeric, numeric, numeric)
    OWNER TO zeolides;


