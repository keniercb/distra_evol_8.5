
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
    if v_sector = 10 THEN
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

ALTER FUNCTION mod_logfacturacion.f_getproductosprecioventa (p_iddeposito numeric, p_idcliente numeric, p_idtipoprecio numeric, p_idmoneda numeric, p_idestructuracomun numeric)
  OWNER TO zeolides;