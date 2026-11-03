DROP FUNCTION mod_logfacturacion.f_productosdespacho(p_idoperacion varchar, p_iddeposito numeric, p_iddocumentos varchar, p_monedacont numeric, p_monedaalt numeric, p_idestructura numeric);

DROP TYPE IF EXISTS mod_logfacturacion.td_productosorden CASCADE;

CREATE TYPE mod_logfacturacion.td_productosorden AS (
  codigo VARCHAR,
  denominacion VARCHAR,
  cantidad NUMERIC(25,6),
  iddeposito NUMERIC(19,0),
  deposito VARCHAR,
  logo VARCHAR,
  entidad VARCHAR,
  codigoentidad VARCHAR,
  um VARCHAR,
  importecontable NUMERIC(25,2),
  importealternativo NUMERIC(25,2),
  peso NUMERIC(25,2)
);

ALTER TYPE mod_logfacturacion.td_productosorden
  OWNER TO zeolides;
  
CREATE OR REPLACE FUNCTION mod_logfacturacion.f_productosdespacho (
  p_idoperacion varchar,
  p_iddeposito numeric,
  p_iddocumentos varchar,
  p_monedacont numeric,
  p_monedaalt numeric,
  p_idestructura numeric
)
RETURNS SETOF mod_logfacturacion.td_productosorden AS
$body$
	DECLARE



	v_rec mod_logfacturacion.td_productosorden;



	BEGIN    



		for v_rec in              



        (

        SELECT ni.numeropieza as codigo, ni.denominacion, sum(dm.cantidad) as cantidad,

        df.iddeposito, (select deo.codigo|| ' ' ||deo.denominacion from mod_estructuracomp.dat_estructuraop deo where deo.idestructuraop = df.iddeposito) as deposito ,

        (select cg.urllogo from mod_logistica.conf_general cg where cg.idestructura = p_idestructura limit 1),

        (SELECT es.denominacion FROM mod_estructuracomp.v_dametodasestructuras es WHERE es.idestructura = p_idestructura) as entidad,

        (SELECT es.codigo FROM mod_estructuracomp.v_dametodasestructuras es WHERE es.idestructura = p_idestructura) as codigoentidad,

        (select um.abreviaturaunidadmedida from mod_datosmaestros.nom_unidadmedida um where um.idunidadmedida = dp.idumedida) as um,

        sum((select dmm.importe from mod_logistica.dat_movmoneda dmm where dmm.idmovimiento = dm.idmovimiento and dmm.idmoneda = p_monedacont)) as importecontable,

        sum((select dmm.importe from mod_logistica.dat_movmoneda dmm where dmm.idmovimiento = dm.idmovimiento and dmm.idmoneda = p_monedaalt)) as importealternativo,

        (sum(dm.cantidad)*COALESCE(nih.peso,0)/1000) as peso

        

        from mod_logistica.dat_movimiento dm

        inner join mod_logistica.dat_documento dd on dd.iddocumento = dm.iddocumento

        inner join mod_logfacturacion.dat_docfactura df on df.idfactura = dd.iddocumento

        --inner join mod_logistica.dat_documentopadre ddp on ddp.iddocumento = dd.iddocumento

        inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto

        inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador

        inner join mod_datosmaestros.nom_indicadorhoja nih on ni.idindicador = nih.idindicador        

        where (case when p_iddocumentos is not null then dd.iddocumento = any(cast(p_iddocumentos as numeric[])) else true end) group by df.iddeposito, ni.numeropieza, ni.denominacion, dp.idumedida,nih.peso

        )



		loop



			return next v_rec;



		end loop;



	END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION mod_logfacturacion.f_productosdespacho (p_idoperacion varchar, p_iddeposito numeric, p_iddocumentos varchar, p_monedacont numeric, p_monedaalt numeric, p_idestructura numeric)
  OWNER TO zeolides;
  
DROP TYPE IF EXISTS mod_logfacturacion.td_ventasvendedor CASCADE;

CREATE TYPE mod_logfacturacion.td_ventasvendedor AS (
  entidad VARCHAR,
  vendedor VARCHAR,
  cliente VARCHAR,
  importecup NUMERIC,
  importecuc NUMERIC,
  logo VARCHAR,
  devolucionescup NUMERIC,
  devolucionescuc NUMERIC,
  monedacontable VARCHAR,
  monedaalternativa VARCHAR
);

ALTER TYPE mod_logfacturacion.td_ventasvendedor
  OWNER TO zeolides;
  
CREATE OR REPLACE FUNCTION mod_logfacturacion.f_ventasvendedor (
  p_iddeposito varchar,
  p_idoperacion varchar,
  p_vendedores varchar,
  p_fechafin date,
  p_fechainicio date,
  p_idestructura numeric,
  p_monedaalt numeric,
  p_monedacont numeric
)
RETURNS SETOF mod_logfacturacion.td_ventasvendedor AS
$body$
DECLARE



	v_rec mod_logfacturacion.td_ventasvendedor;



	BEGIN    



		for v_rec in              



        (

        SELECT (SELECT es.denominacion FROM mod_estructuracomp.v_dametodasestructuras es WHERE es.idestructura = p_idestructura) as entidad,

		(select (dper.nombre || ' ' || dper.papel || ' ' || dper.sapel) from mod_persona.dat_persona dper where dper.idpersona = ddf.idvendedor) as vendedor,

        (select (ncp.codigo || ' ' || ncp.nombre) from mod_datosmaestros.nom_clientesproveedor ncp where ncp.idclientesproveedores = ddf.idcliente) as cliente,

        ((select coalesce(sum(def.cantidad * dde.preciotarifa),0) 
    from mod_logfacturacion.dat_elementosfactura def
    inner join mod_logfacturacion.dat_docfactura ddfi on ddfi.idfactura = def.idfactura
    inner join mod_logistica.dat_documento ddi on ddi.iddocumento = ddfi.idfactura
    inner join mod_logfacturacion.dat_desgloselemento dde on dde.idelementofactura = def.idelementofactura
    where ddfi.idvendedor = ddf.idvendedor and dde.idmoneda = p_monedacont
    and ddi.idestructuracomun = p_idestructura 
		and ddfi.idcliente = ddf.idcliente
        and ddi.estado = 4 and ddfi.idvendedor is not null
        
        and (case when p_iddeposito is not null then ddfi.iddeposito = any (cast(p_iddeposito as numeric[])) else true end)
        
        and (case when p_idoperacion is not null then ddi.idoperacion = any (cast(p_idoperacion as numeric[])) else true end)
        
        and (case when p_vendedores is not null then ddfi.idvendedor = any(cast(p_vendedores as numeric[])) else true end)
        
        and ((ddi.fechacontable >= p_fechainicio or p_fechainicio is null) and (ddi.fechacontable <= p_fechafin or p_fechafin is null))) +
    ((select coalesce(sum(dmm.precio*(dm.cantidad-COALESCE((select mdev.cantidad from mod_logistica.dat_movimiento mdev
     where mdev.iddocumento in (select dev.iddocumento from mod_logistica.dat_documento dev
 inner join mod_logistica.dat_documentopadre devp on devp.iddocumento = dev.iddocumento
 inner join mod_datosmaestros.dat_documentoprim dprim on dprim.iddoc = dev.iddoc
 inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = dprim.iddocumentos
 where ndp.abreviatura = 'valedev' and devp.idpadre = dm.iddocumento) and dm.idproducto = mdev.idproducto),0))),0)
    from mod_logistica.dat_movimiento dm
    inner join mod_logfacturacion.dat_docfactura ddfi on ddfi.idfactura = dm.iddocumento
    inner join mod_logistica.dat_documento ddi on ddi.iddocumento = ddfi.idfactura
    inner join mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = dm.idmovimiento
    where ddfi.idvendedor = ddf.idvendedor and dmm.idmoneda = p_monedacont and ddi.idestructuracomun = p_idestructura 
		and ddfi.idcliente = ddf.idcliente
        and ddi.estado = 4 
        
        and (case when p_iddeposito is not null then ddfi.iddeposito = any (cast(p_iddeposito as numeric[])) else true end)
        
        and (case when p_idoperacion is not null then ddi.idoperacion = any (cast(p_idoperacion as numeric[])) else true end)
        
        and (case when p_vendedores is not null then ddfi.idvendedor = any(cast(p_vendedores as numeric[])) else true end)
        
        and ((ddi.fechacontable >= p_fechainicio or p_fechainicio is null) and (ddi.fechacontable <= p_fechafin or p_fechafin is null))) +
    (select coalesce(-1 * sum(ddcp.valorcalculo),0) 
    from mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
    inner join mod_logfacturacion.dat_categoriapreciofactura dcpf on dcpf.idcategoriafactura = ddcp.idcategoriafactura
    inner join mod_logfacturacion.dat_docfactura ddfi on ddfi.idfactura = dcpf.idfactura
    inner join mod_logistica.dat_documento ddi on ddi.iddocumento = ddfi.idfactura
    where ddfi.idvendedor = ddf.idvendedor and ddcp.idmoneda = p_monedacont and ddcp.concepto = '-' and ddi.idestructuracomun = p_idestructura 
		and ddfi.idcliente = ddf.idcliente
        and ddi.estado = 4 
        
        and (case when p_iddeposito is not null then ddfi.iddeposito = any (cast(p_iddeposito as numeric[])) else true end)
        
        and (case when p_idoperacion is not null then ddi.idoperacion = any (cast(p_idoperacion as numeric[])) else true end)
        
        and (case when p_vendedores is not null then ddfi.idvendedor = any(cast(p_vendedores as numeric[])) else true end)
        
        and ((ddi.fechacontable >= p_fechainicio or p_fechainicio is null) and (ddi.fechacontable <= p_fechafin or p_fechafin is null))) +
    (select coalesce(sum(ddcp.valorcalculo),0)
    from mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
    inner join mod_logfacturacion.dat_categoriapreciofactura dcpf on dcpf.idcategoriafactura = ddcp.idcategoriafactura
    inner join mod_logfacturacion.dat_docfactura ddfi on ddfi.idfactura = dcpf.idfactura
    inner join mod_logistica.dat_documento ddi on ddi.iddocumento = ddfi.idfactura
    where ddfi.idvendedor = ddf.idvendedor and ddcp.idmoneda = p_monedacont and ddcp.concepto = '+' and ddi.idestructuracomun = p_idestructura 
		and ddfi.idcliente = ddf.idcliente
        and ddi.estado = 4 
        
        and (case when p_iddeposito is not null then ddfi.iddeposito = any (cast(p_iddeposito as numeric[])) else true end)
        
        and (case when p_idoperacion is not null then ddi.idoperacion = any (cast(p_idoperacion as numeric[])) else true end)
        
        and (case when p_vendedores is not null then ddfi.idvendedor = any(cast(p_vendedores as numeric[])) else true end)
        
        and ((ddi.fechacontable >= p_fechainicio or p_fechainicio is null) and (ddi.fechacontable <= p_fechafin or p_fechafin is null))))) as importecontable,

        /*(sum((select dmm.importe from mod_logistica.dat_movmoneda dmm where dmm.idmovimiento = dm.idmovimiento and dmm.idmoneda = p_monedaalt)) - 
         coalesce(sum((select dmm1.importe from mod_logistica.dat_movmoneda dmm1 where dmm1.idmovimiento = dm1.idmovimiento and dmm1.idmoneda = p_monedaalt and dd1.estado = 4 and ddp1.sigla = 'valedev')),0))*/0 as importealternativo,

        (select cg.urllogo from mod_logistica.conf_general cg where cg.idestructura = p_idestructura limit 1),
        
        (
    (sum((select coalesce(sum(dmm.precio*(COALESCE((select mdev.cantidad from mod_logistica.dat_movimiento mdev
     where mdev.iddocumento in (select dev.iddocumento from mod_logistica.dat_documento dev
     inner join mod_logistica.dat_documentopadre devp on devp.iddocumento = dev.iddocumento
     inner join mod_datosmaestros.dat_documentoprim dprim on dprim.iddoc = dev.iddoc
     inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = dprim.iddocumentos
     where ndp.abreviatura = 'valedev' and devp.idpadre = dd.iddocumento) and dm.idproducto = mdev.idproducto),0))),0)
      from mod_logistica.dat_movimiento dm
      inner join mod_logfacturacion.dat_docfactura ddfi on ddfi.idfactura = dm.iddocumento
      inner join mod_logistica.dat_documento ddi on ddi.iddocumento = ddfi.idfactura
      inner join mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = dm.idmovimiento
      where ddfi.idvendedor = ddf.idvendedor and dmm.idmoneda = p_monedacont and ddi.idestructuracomun = p_idestructura 
		and ddfi.idcliente = ddf.idcliente
        and ddi.estado = 4 and ddfi.idvendedor is not null
        
        and (case when p_iddeposito is not null then ddfi.iddeposito = any (cast(p_iddeposito as numeric[])) else true end)
        
        and (case when p_idoperacion is not null then ddi.idoperacion = any (cast(p_idoperacion as numeric[])) else true end)
        
        and (case when p_vendedores is not null then ddfi.idvendedor = any(cast(p_vendedores as numeric[])) else true end)
        
        and ((ddi.fechacontable >= p_fechainicio or p_fechainicio is null) and (ddi.fechacontable <= p_fechafin or p_fechafin is null)))))) as importecontabledevolucion,

        /*coalesce(sum((select dmm1.importe from mod_logistica.dat_movmoneda dmm1 where dmm1.idmovimiento = dm1.idmovimiento and dmm1.idmoneda = p_monedaalt and dd1.estado = 4 and ddp1.sigla = 'valedev')),0)*/0 as importealternativodevolucion,
        
        (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedacont) as monedacontable,
        
        (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedaalt) as monedaalternativa         
        
        from mod_logfacturacion.dat_docfactura ddf

        inner join mod_persona.dat_persona dp on dp.idpersona = ddf.idvendedor

        inner join mod_logistica.dat_documento dd on dd.iddocumento = ddf.idfactura

        /*left join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento
        
        left join mod_logistica.dat_documentopadre ddp on ddp.idpadre = dd.iddocumento
        
        left join mod_logistica.dat_documento dd1 on dd1.iddocumento = ddp.iddocumento
          
        left join mod_logistica.dat_movimiento dm1 on dm1.iddocumento = dd1.iddocumento
        
        left join mod_datosmaestros.dat_documentoprim ddp1 on ddp1.iddoc = dd1.iddoc*/   

        where dd.idestructuracomun = p_idestructura 

        and dd.estado = 4 and ddf.idvendedor is not null
        
        and (case when p_iddeposito is not null then ddf.iddeposito = any (cast(p_iddeposito as numeric[])) else true end)
        
        and (case when p_idoperacion is not null then dd.idoperacion = any (cast(p_idoperacion as numeric[])) else true end)
        
        and (case when p_vendedores is not null then ddf.idvendedor = any(cast(p_vendedores as numeric[])) else true end)
        
        and ((dd.fechacontable >= p_fechainicio or p_fechainicio is null) and (dd.fechacontable <= p_fechafin or p_fechafin is null))
        
        group by ddf.idvendedor, ddf.idcliente
        order by ddf.idvendedor, ddf.idcliente

        )



		loop



			return next v_rec;



		end loop;



	END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION mod_logfacturacion.f_ventasvendedor (p_iddeposito varchar, p_idoperacion varchar, p_vendedores varchar, p_fechafin date, p_fechainicio date, p_idestructura numeric, p_monedaalt numeric, p_monedacont numeric)
  OWNER TO zeolides;
  

DROP TYPE IF EXISTS mod_logfacturacion.td_precioventa CASCADE; 
  
  
CREATE TYPE mod_logfacturacion.td_precioventa AS (
  idproducto NUMERIC,
  precio NUMERIC,
  precioventa NUMERIC,
  precioalt NUMERIC,
  precioventaalt NUMERIC,
  monedacontable NUMERIC,
  monedaalternativa NUMERIC,
  producto VARCHAR,
  agencia VARCHAR,
  deposito VARCHAR
);


ALTER TYPE mod_logfacturacion.td_precioventa
  OWNER TO zeolides;
  
CREATE OR REPLACE FUNCTION mod_logfacturacion.f_getproductosprecioventasector (
  p_iddeposito numeric,
  p_idcliente numeric,
  p_idtipoprecio numeric,
  p_idmoneda numeric,
  p_idestructuracomun numeric,
  p_sector numeric
)
RETURNS SETOF mod_logfacturacion.td_precioventa AS
$body$
declare
all_rec mod_logfacturacion.td_precioventa;
v_conf record;
v_idmonedacontable numeric;
v_idmonedaalt numeric;
v_monedas record;
v_productos record;
v_degloseprecio record;
v_matrizdualidad record;
v_configurado numeric;
v_medianaturaleza numeric;
v_mediasector numeric;
v_ventaredondeo numeric;
begin
select conf.idpadrematriz,conf.preciocentral into v_conf from mod_logfacturacion.conf_configuracionfactura conf 
where conf.idestructuracomun = p_idestructuracomun;
--raise notice 'padre %', v_idmatrizpadre;
/*for v_monedas in SELECT nm.idmoneda, me.dualidad
				FROM mod_datosmaestros.dat_monedaentidad me
				LEFT JOIN mod_datosmaestros.nom_moneda nm on me.idmoneda = nm.idmoneda
				LEFT JOIN mod_datosmaestros.nom_pais p ON nm.idpais = p.idpais
                WHERE me.idestructuracomun=p_idestructuracomun AND (me.tipomoneda = 0 or me.dualidad = 1)
				ORDER BY nm.codigo ASC
LOOP
	if v_monedas.dualidad = 1 then
		v_idmonedaalt = v_monedas.idmoneda; 
        all_rec.monedaalternativa = v_idmonedaalt;
    ELSE
		v_idmonedacontable = v_monedas.idmoneda; 
        all_rec.monedacontable = v_idmonedacontable;
    end if;
end loop;*/
                
for v_productos in select dp.idproducto,
--dm.preciopromedio,
dp.idindicador,
0.0 as precio,
0.0 as precioventa,
0.0 as precioalt,
0.0 as precioventaalt,
concat(ni.numeropieza,'-',ni.denominacion) as producto,
concat(des.codigo,'-',des.denominacion) as agencia,
concat(dop.codigo,'-',dop.denominacion) as deposito,
ni.idnaturaleza
from mod_logistica.dat_producto dp
inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
inner join mod_estructuracomp.v_dametodasestructuras des on des.idestructura = dp.idestructuracomun
inner join mod_estructuracomp.v_dametodasestructuras dop on dop.idestructura = dp.idestructura
--left join mod_logfacturacion.dat_matrizprecio dm on dm.idindicador = dp.idindicador
where dp.idestructura = p_iddeposito --and dm.idtipoprecio = p_idtipoprecio --and dp.idproducto = 1000446144
loop
	v_medianaturaleza = 1;
    v_mediasector = 1;
	v_configurado = 0;
    all_rec.precio = 0;
    all_rec.precioventa = 0; 
    all_rec.precioalt = 0;
    all_rec.precioventaalt = 0; 
    all_rec.producto = v_productos.producto;
    all_rec.agencia = v_productos.agencia;
    all_rec.deposito = v_productos.deposito;
	for v_matrizdualidad in select dm.preciopromedio, dmd.idmatrizpreciodualidadmonetaria, dmd.idmoneda, coalesce(dmd.precio,0) as precio, coalesce(dmd.precioventa,0) as precioventa 
    						from mod_logfacturacion.dat_matrizpreciodualmonetaria dmd 
                            inner join mod_logfacturacion.dat_matrizprecio dm on dm.idmatrizprecio = dmd.idmatrizprecio
                            where dm.idindicador = v_productos.idindicador and dm.idtipoprecio = p_idtipoprecio
                            and dm.idestructuracomun = v_conf.idpadrematriz
	LOOP
         
	    if v_matrizdualidad.idmoneda = p_idmoneda then
        	if v_matrizdualidad.preciopromedio = 1 then
            	if v_conf.preciocentral = 1 then
                	v_productos.precio := (select precio from mod_datosmaestros.nom_indicador where idindicador = v_productos.idindicador);
                else
        			v_productos.precio := (select coalesce(dmov.preciopromedio,0) from mod_logistica.dat_movimiento dmov
            						where dmov.idproducto = v_productos.idproducto
                                     and dmov.cronologia = (
                                     select dmov1.cronologia from mod_logistica.dat_movimiento dmov1 where dmov1.idproducto = dmov.idproducto
                                     and dmov1.preciopromedio <> 0 limit 1
                                     ) limit 1);
                end if;
            	all_rec.precio = v_productos.precio;
                all_rec.precioventa = v_productos.precio; 
        		for v_degloseprecio in select dpr.valor, dpr.porciento, dpr.concepto from mod_logfacturacion.dat_precio dpr
                where dpr.idmatrizpreciodualidadmonetaria = v_matrizdualidad.idmatrizpreciodualidadmonetaria
                LOOP
                	v_configurado = 1;
                    if v_degloseprecio.valor > 0 THEN
                        --if v_matrizdualidad.preciopromedio = 1 then
                          if v_degloseprecio.porciento = 1 then  
                            --raise notice 'valor %', v_degloseprecio.valor;                       
                            all_rec.precioventa = all_rec.precioventa + (v_productos.precio*v_degloseprecio.valor/100);
                          ELSE                
                            all_rec.precioventa = all_rec.precioventa + v_degloseprecio.valor;
                          end if;
                        --end if;
                    end if;
                end LOOP;
                if v_configurado = 0 then
                	all_rec.precioventa = 0;
                end if;
            else
            	all_rec.precio = v_matrizdualidad.precio;
	            all_rec.precioventa = v_matrizdualidad.precioventa;            
	        end if;
        else
        	all_rec.precioalt = 0;
	        all_rec.precioventaalt = 0;
        end if;
    end loop;  
    v_medianaturaleza := (select coalesce((Select nm.media from mod_logfacturacion.dat_naturalezamedia nm  
                where nm.idtipoprecio = p_idtipoprecio and nm.idnaturaleza = v_productos.idnaturaleza),1));
    v_mediasector := (select coalesce((Select sm.media from mod_logfacturacion.dat_sectormedia sm  
                where sm.idtipoprecio = p_idtipoprecio and sm.idnaturaleza = v_productos.idnaturaleza 
                and sm.idsector = p_sector),1)); 
    all_rec.precioventa = all_rec.precioventa*v_medianaturaleza*v_mediasector; 
    all_rec.precioventa = round(all_rec.precioventa,6);
    if p_sector = 10 THEN
		all_rec.precioventa = round(all_rec.precioventa,2);
        v_ventaredondeo = all_rec.precioventa*100;
        if v_ventaredondeo%10 <> 0 THEN
        	all_rec.precioventa = (v_ventaredondeo - v_ventaredondeo%10 + 10)/100;
            all_rec.precioventa = round(all_rec.precioventa,2);
        end if;
    end if;    
	all_rec.idproducto = v_productos.idproducto;    
	return next all_rec;
end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION mod_logfacturacion.f_getproductosprecioventasector (p_iddeposito numeric, p_idcliente numeric, p_idtipoprecio numeric, p_idmoneda numeric, p_idestructuracomun numeric, p_sector numeric)
  OWNER TO zeolides;
  
  
CREATE OR REPLACE FUNCTION mod_logfacturacion.f_getproductosprecioventa (
  p_iddeposito numeric,
  p_idcliente numeric,
  p_idtipoprecio numeric,
  p_idmoneda numeric,
  p_idestructuracomun numeric
)
RETURNS SETOF mod_logfacturacion.td_precioventa AS
$body$
declare
all_rec mod_logfacturacion.td_precioventa;
v_conf record;
v_idmonedacontable numeric;
v_idmonedaalt numeric;
v_monedas record;
v_productos record;
v_degloseprecio record;
v_matrizdualidad record;
v_configurado numeric;
v_medianaturaleza numeric;
v_mediasector numeric;
v_ventaredondeo numeric;
v_sector numeric;
v_decimasuperior numeric;
begin
select conf.idpadrematriz,conf.preciocentral into v_conf from mod_logfacturacion.conf_configuracionfactura conf 
where conf.idestructuracomun = p_idestructuracomun;
--raise notice 'padre %', v_idmatrizpadre;
/*for v_monedas in SELECT nm.idmoneda, me.dualidad
				FROM mod_datosmaestros.dat_monedaentidad me
				LEFT JOIN mod_datosmaestros.nom_moneda nm on me.idmoneda = nm.idmoneda
				LEFT JOIN mod_datosmaestros.nom_pais p ON nm.idpais = p.idpais
                WHERE me.idestructuracomun=p_idestructuracomun AND (me.tipomoneda = 0 or me.dualidad = 1)
				ORDER BY nm.codigo ASC
LOOP
	if v_monedas.dualidad = 1 then
		v_idmonedaalt = v_monedas.idmoneda; 
        all_rec.monedaalternativa = v_idmonedaalt;
    ELSE
		v_idmonedacontable = v_monedas.idmoneda; 
        all_rec.monedacontable = v_idmonedacontable;
    end if;
end loop;*/
                
for v_productos in select dp.idproducto,
--dm.preciopromedio,
dp.idindicador,
0.0 as precio,
0.0 as precioventa,
0.0 as precioalt,
0.0 as precioventaalt,
concat(ni.numeropieza,'-',ni.denominacion) as producto,
concat(des.codigo,'-',des.denominacion) as agencia,
concat(dop.codigo,'-',dop.denominacion) as deposito,
ni.idnaturaleza
from mod_logistica.dat_producto dp
inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
inner join mod_estructuracomp.v_dametodasestructuras des on des.idestructura = dp.idestructuracomun
inner join mod_estructuracomp.v_dametodasestructuras dop on dop.idestructura = dp.idestructura
--left join mod_logfacturacion.dat_matrizprecio dm on dm.idindicador = dp.idindicador
where dp.idestructura = p_iddeposito --and dm.idtipoprecio = p_idtipoprecio --and dp.idproducto = 1000446144
loop
	v_configurado = 0;
    all_rec.precio = 0;
    all_rec.precioventa = 0; 
    all_rec.precioalt = 0;
    all_rec.precioventaalt = 0; 
    all_rec.producto = v_productos.producto;
    all_rec.agencia = v_productos.agencia;
    all_rec.deposito = v_productos.deposito;
	for v_matrizdualidad in select dm.preciopromedio, dmd.idmatrizpreciodualidadmonetaria, dmd.idmoneda, coalesce(dmd.precio,0) as precio, coalesce(dmd.precioventa,0) as precioventa 
    						from mod_logfacturacion.dat_matrizpreciodualmonetaria dmd 
                            inner join mod_logfacturacion.dat_matrizprecio dm on dm.idmatrizprecio = dmd.idmatrizprecio
                            where dm.idindicador = v_productos.idindicador and dm.idtipoprecio = p_idtipoprecio
                            and dm.idestructuracomun = v_conf.idpadrematriz
	LOOP
         
	    if v_matrizdualidad.idmoneda = p_idmoneda then
        	if v_matrizdualidad.preciopromedio = 1 then
            	if v_conf.preciocentral = 1 then
                	v_productos.precio := (select precio from mod_datosmaestros.nom_indicador where idindicador = v_productos.idindicador);
                else
        			v_productos.precio := (select coalesce(dmov.preciopromedio,0) from mod_logistica.dat_movimiento dmov
            						where dmov.idproducto = v_productos.idproducto
                                     and dmov.cronologia = (
                                     select dmov1.cronologia from mod_logistica.dat_movimiento dmov1 where dmov1.idproducto = dmov.idproducto
                                     and dmov1.preciopromedio <> 0 limit 1
                                     ) limit 1);
                end if;
            	all_rec.precio = v_productos.precio;
                all_rec.precioventa = v_productos.precio; 
        		for v_degloseprecio in select dpr.valor, dpr.porciento, dpr.concepto from mod_logfacturacion.dat_precio dpr
                where dpr.idmatrizpreciodualidadmonetaria = v_matrizdualidad.idmatrizpreciodualidadmonetaria
                LOOP
                	v_configurado = 1;
                    if v_degloseprecio.valor > 0 THEN
                        --if v_matrizdualidad.preciopromedio = 1 then
                          if v_degloseprecio.porciento = 1 then  
                            --raise notice 'valor %', v_degloseprecio.valor;                       
                            all_rec.precioventa = all_rec.precioventa + (v_productos.precio*v_degloseprecio.valor/100);
                          ELSE                
                            all_rec.precioventa = all_rec.precioventa + v_degloseprecio.valor;
                          end if;
                        --end if;
                    end if;
                end LOOP;
                if v_configurado = 0 then
                	all_rec.precioventa = 0;
                end if;
            else
            	all_rec.precio = v_matrizdualidad.precio;
	            all_rec.precioventa = v_matrizdualidad.precioventa;            
	        end if;
        else
        	all_rec.precioalt = 0;
	        all_rec.precioventaalt = 0;
        end if;
    end loop;    
    v_sector := (select nicl.idsector from mod_datosmaestros.nom_clientesproveedor nicl where nicl.idclientesproveedores = p_idcliente limit 1);    
    v_medianaturaleza := (select coalesce((Select nm.media from mod_logfacturacion.dat_naturalezamedia nm  
                where nm.idtipoprecio = p_idtipoprecio and nm.idnaturaleza = v_productos.idnaturaleza),1));
    v_mediasector := (select coalesce((Select sm.media from mod_logfacturacion.dat_sectormedia sm  
                where sm.idtipoprecio = p_idtipoprecio and sm.idnaturaleza = v_productos.idnaturaleza 
                and sm.idsector = v_sector),1));
    all_rec.precioventa = all_rec.precioventa*v_medianaturaleza*v_mediasector; 
    all_rec.precioventa = round(all_rec.precioventa,6);
    v_decimasuperior := (select coalesce((select dcr.redondear from mod_logfacturacion.dat_clienteredondeo dcr
    where dcr.idtipoprecio = p_idtipoprecio and dcr.idcliente = p_idcliente limit 1),0));
    if v_decimasuperior = 1 THEN
		all_rec.precioventa = round(all_rec.precioventa,2);
        v_ventaredondeo = all_rec.precioventa*100;
        if v_ventaredondeo%10 <> 0 THEN
        	all_rec.precioventa = (v_ventaredondeo - v_ventaredondeo%10 + 10)/100;
            all_rec.precioventa = round(all_rec.precioventa,2);
        end if;
    end if;    
	all_rec.idproducto = v_productos.idproducto;    
	return next all_rec;
end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

ALTER FUNCTION mod_logfacturacion.f_getproductosprecioventa (p_iddeposito numeric, p_idcliente numeric, p_idtipoprecio numeric, p_idmoneda numeric, p_idestructuracomun numeric)
  OWNER TO zeolides;