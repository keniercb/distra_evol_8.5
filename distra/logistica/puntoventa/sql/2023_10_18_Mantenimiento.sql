DROP TABLE IF EXISTS mod_logpuntoventa.temp_mantenimiento;

CREATE TABLE IF NOT EXISTS mod_logpuntoventa.temp_mantenimiento (
  numeropieza VARCHAR,
  cantidad VARCHAR(25),
  idareaventa NUMERIC(19,0),
  ajustado NUMERIC(1,0) DEFAULT 0
) 
WITH (oids = false);

ALTER TABLE mod_logpuntoventa.temp_mantenimiento
  OWNER TO zeolides;
  
ALTER TABLE IF EXISTS mod_logpuntoventa.dat_pedidotiendadevolucion
  ADD COLUMN IF NOT EXISTS devueltotienda NUMERIC(1,0) DEFAULT 0;
  

CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_arreglardisponibletienda(
	p_iddeposito numeric,
	p_idareaventa numeric,
	p_references character varying,
	p_disponible numeric,
	p_existencia numeric,
	p_tipodiferencia numeric)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
  v_datos record;
  v_datospedidos record;
  v_iddocTV numeric;
  v_reservaIdeal numeric;
  v_reccomp record;
  v_dispAux numeric;
  v_disponibleIdeal numeric;
  v_countReservados numeric;
BEGIN
	
	v_iddocTV := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
        inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
        inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
        where ndp.abreviatura = 'transTiendaLog' and des.idestructuracomun = 200531052 limit 1);

	for v_datos in (
	select ni.numeropieza, dp.idproducto, mant.cantidad as canttienda,
dp.cantidad as existenciadistra,
(coalesce(dp.cantidad-coalesce(
(select sum(COALESCE(dpped.enproceso,0)-COALESCE(dpped.devuelto,0)) from mod_logpuntoventa.dat_pedidoproducto dpped where dpped.idproducto = dp.idproducto
and dpped.enproceso > 0)
,0),0)-(dp.cantidad-coalesce((select sum(cc1.cantidad) from mod_logistica.dat_cantidadcomprometida cc1 where cc1.idproducto = dp.idproducto and cc1.estado = 1),0))) as canttiendadistra,
((coalesce(dp.cantidad-coalesce(
(select sum(COALESCE(dpped.enproceso,0)-COALESCE(dpped.devuelto,0)) from mod_logpuntoventa.dat_pedidoproducto dpped where dpped.idproducto = dp.idproducto
and dpped.enproceso > 0)
,0),0)-(dp.cantidad-coalesce((select sum(cc1.cantidad) from mod_logistica.dat_cantidadcomprometida cc1 where cc1.idproducto = dp.idproducto and cc1.estado = 1),0)))-CAST(mant.cantidad as numeric)) as diftienda,
coalesce(
(select sum(COALESCE(dpped.enproceso,0)-COALESCE(dpped.devuelto,0)) from mod_logpuntoventa.dat_pedidoproducto dpped where dpped.idproducto = dp.idproducto
and dpped.enproceso > 0)
,0) as enproceso,
(dp.cantidad-coalesce((select sum(cc1.cantidad) from mod_logistica.dat_cantidadcomprometida cc1 where cc1.idproducto = dp.idproducto and cc1.estado = 1),0)) as disponible
from mod_logistica.dat_producto dp
inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
inner join mod_logpuntoventa.dat_productoareaventa dar on dar.idproducto = dp.idproducto
inner join mod_logpuntoventa.temp_mantenimiento mant on mant.numeropieza = ni.numeropieza and mant.idareaventa = p_idareaventa
where dp.idestructura = p_iddeposito and dar.idareaventa = p_idareaventa /*and dp.cantidad > 0*/
and (case when p_references is not null then ni.numeropieza = ANY(CAST(p_references as VARCHAR[])) else true end)
 and dp.idproducto not in (
select pa.idproducto from mod_logistica.dat_productoinactivo pa
)
and (((coalesce(dp.cantidad-coalesce(
            (select sum(COALESCE(dpped.enproceso,0)-COALESCE(dpped.devuelto,0)) from mod_logpuntoventa.dat_pedidoproducto dpped where dpped.idproducto = dp.idproducto
            and dpped.enproceso > 0)
            ,0),0)-(dp.cantidad-coalesce((select sum(cc1.cantidad) from mod_logistica.dat_cantidadcomprometida cc1 where cc1.idproducto = dp.idproducto and cc1.estado = 1),0)))-CAST(mant.cantidad as numeric)) <> 0
           
		    or ((dp.cantidad-coalesce((select sum(cc1.cantidad) from mod_logistica.dat_cantidadcomprometida cc1 where cc1.idproducto = dp.idproducto and cc1.estado = 1),0))) < 0
			or (select count(dpped.idproducto) from mod_logpuntoventa.dat_pedidoproducto dpped 
				inner join mod_logpuntoventa.dat_pedidotienda pptd on pptd.idpedidotienda = dpped.idpedidotienda
				where pptd.estado in (2,3) and dpped.idproducto = dp.idproducto
            and dpped.cantidadreal <> dpped.cantidad) > 0
	)
--and dp.idproducto = 1000648295
order by ((coalesce(dp.cantidad-coalesce(
(select sum(COALESCE(dpped.enproceso,0)-COALESCE(dpped.devuelto,0)) from mod_logpuntoventa.dat_pedidoproducto dpped where dpped.idproducto = dp.idproducto
and dpped.enproceso > 0)
,0),0)-(dp.cantidad-coalesce((select sum(cc1.cantidad) from mod_logistica.dat_cantidadcomprometida cc1 where cc1.idproducto = dp.idproducto and cc1.estado = 1),0)))-CAST(mant.cantidad as numeric)), ni.numeropieza

	) loop
		raise notice 'existenciadistra %', v_datos.existenciadistra;
		raise notice 'enproceso %', v_datos.enproceso;
		raise notice 'canttienda %', CAST(v_datos.canttienda as numeric);
		if v_datos.existenciadistra >= v_datos.enproceso then
		    v_disponibleIdeal = v_datos.existenciadistra - v_datos.enproceso - CAST(v_datos.canttienda as numeric);
			raise notice 'Reserva ideal %', v_disponibleIdeal;
			if v_disponibleIdeal >= 0 then
				
				if v_datos.disponible > v_disponibleIdeal then
					v_dispAux = v_datos.disponible - v_disponibleIdeal;
					for v_reccomp in SELECT cc.*
					  FROM mod_logistica.dat_cantidadcomprometida cc
					  inner join mod_logistica.dat_documento d on d.iddocumento = cc.iddocumento
					  where d.iddoc = v_iddocTV and cc.idproducto = v_datos.idproducto and cc.estado = 1
					  order by d.fechacontable asc limit 1 loop
					    UPDATE mod_logistica.dat_cantidadcomprometida 
						 SET cantidad = cantidad + v_dispAux
					    WHERE 
						 idcantidadcomprometida = v_reccomp.idcantidadcomprometida;
					end loop;  
				elseif v_datos.disponible < v_disponibleIdeal then
					v_dispAux = v_disponibleIdeal - v_datos.disponible;
					for v_reccomp in SELECT cc.*
					  FROM mod_logistica.dat_cantidadcomprometida cc
					  inner join mod_logistica.dat_documento d on d.iddocumento = cc.iddocumento
					  where d.iddoc = v_iddocTV and cc.idproducto = v_datos.idproducto and cc.estado = 1
					  order by d.fechacontable asc loop
					  	if v_dispAux = 0 then
							continue;
						else	
					    	if v_reccomp.cantidad >= v_dispAux then
								UPDATE mod_logistica.dat_cantidadcomprometida 
								 SET cantidad = cantidad - v_dispAux
								WHERE 
								 idcantidadcomprometida = v_reccomp.idcantidadcomprometida;
								 v_dispAux = 0;
							else 
								UPDATE mod_logistica.dat_cantidadcomprometida 
								 SET estado = 2
								WHERE 
								 idcantidadcomprometida = v_reccomp.idcantidadcomprometida;
								 v_dispAux = v_dispAux - v_reccomp.cantidad;
							end if;
						end if;	
					end loop;
				else
					v_dispAux = v_disponibleIdeal;
					for v_reccomp in SELECT cc.*
					  FROM mod_logistica.dat_cantidadcomprometida cc
					  inner join mod_logistica.dat_documento d on d.iddocumento = cc.iddocumento
					  where d.iddoc = v_iddocTV and cc.idproducto = v_datos.idproducto and cc.estado = 1
					  order by d.fechacontable asc limit 1 loop
					    UPDATE mod_logistica.dat_cantidadcomprometida 
						 SET cantidad = cantidad + v_dispAux
					    WHERE 
						 idcantidadcomprometida = v_reccomp.idcantidadcomprometida;
					end loop; 
				end if;
			elseif v_datos.disponible < 0 then
				v_dispAux = abs(v_datos.disponible);	
				for v_reccomp in SELECT cc.*
					  FROM mod_logistica.dat_cantidadcomprometida cc
					  inner join mod_logistica.dat_documento d on d.iddocumento = cc.iddocumento
					  where d.iddoc = v_iddocTV and cc.idproducto = v_datos.idproducto and cc.estado = 1
					  order by d.fechacontable asc loop
					  	if v_dispAux = 0 then
							continue;
						else	
					    	if v_reccomp.cantidad >= v_dispAux then
								UPDATE mod_logistica.dat_cantidadcomprometida 
								 SET cantidad = cantidad - v_dispAux
								WHERE 
								 idcantidadcomprometida = v_reccomp.idcantidadcomprometida;
								 v_dispAux = 0;
							else 
								UPDATE mod_logistica.dat_cantidadcomprometida 
								 SET estado = 2
								WHERE 
								 idcantidadcomprometida = v_reccomp.idcantidadcomprometida;
								 v_dispAux = v_dispAux - v_reccomp.cantidad;
							end if;
						end if;	
					end loop;
			elseif v_disponibleIdeal < 0 then
				v_dispAux = v_datos.disponible;
					v_countReservados := (SELECT count(cc.*)
					  FROM mod_logistica.dat_cantidadcomprometida cc
					  inner join mod_logistica.dat_documento d on d.iddocumento = cc.iddocumento
					  where d.iddoc = v_iddocTV and cc.idproducto = v_datos.idproducto and cc.estado = 1);
					  if v_countReservados > 0 then
					  	for v_reccomp in SELECT cc.*
						  FROM mod_logistica.dat_cantidadcomprometida cc
						  inner join mod_logistica.dat_documento d on d.iddocumento = cc.iddocumento
						  where d.iddoc = v_iddocTV and cc.idproducto = v_datos.idproducto and cc.estado = 1
						  order by d.fechacontable asc limit 1 loop
							UPDATE mod_logistica.dat_cantidadcomprometida 
							 SET cantidad = cantidad + v_dispAux
							WHERE 
							 idcantidadcomprometida = v_reccomp.idcantidadcomprometida;
						end loop;
					  else
					  	v_countReservados := (SELECT cc.idcantidadcomprometida
						  FROM mod_logistica.dat_cantidadcomprometida cc
						  inner join mod_logistica.dat_documento d on d.iddocumento = cc.iddocumento
						  where d.iddoc = v_iddocTV and cc.idproducto = v_datos.idproducto and cc.estado = 2
						  order by d.fechacontable asc limit 1);
					    UPDATE mod_logistica.dat_cantidadcomprometida 
							 SET cantidad = v_dispAux, estado = 1
							WHERE 
							 idcantidadcomprometida = v_countReservados;
					  end if;
			end if;
		end if;
	end loop;
END;
$BODY$;

ALTER FUNCTION mod_logpuntoventa.f_arreglardisponibletienda(numeric, numeric, character varying, numeric, numeric, numeric)
    OWNER TO zeolides;


CREATE OR REPLACE FUNCTION mod_logfacturacion.f_arreglarpedidostienda (
  p_idareaventa numeric,
  p_idproducto numeric
)
RETURNS void AS
$body$
DECLARE
  v_datos record;
  v_datospedidos record;
  v_datosprecioventa record;
  v_iddocumentopadre numeric;
  v_countexist numeric;
  v_countexistmov numeric;
  v_precioventa numeric;
  v_referencia numeric;
  v_idmovfactura numeric;
  v_margenAux numeric;
  v_configTienda record;
BEGIN
	select da.* into v_configTienda from mod_logpuntoventa.dat_areaventa da
        where da.idareaventa = p_idareaventa limit 1;
        
	for v_datos in (
	select pp.codreferencia, p.idproducto, sum(pp.cantidad) as cantidad,
	coalesce(
	(select sum(COALESCE(dpped.enproceso,0)-COALESCE(dpped.devuelto,0)) from mod_logpuntoventa.dat_pedidoproducto dpped where dpped.idproducto = p.idproducto
	and dpped.enproceso > 0)
	,0) as enproceso
	, sum(pp.cantidadreal) as cantidadreal, p.cantidad as existencia from mod_logpuntoventa.dat_pedidotienda pt
	inner join mod_logpuntoventa.dat_pedidoproducto pp ON pp.idpedidotienda = pt.idpedidotienda
	inner join mod_logistica.dat_producto p on p.idproducto = pp.idproducto
	left join mod_logpuntoventa.dat_pedidodocumento pd ON pd.idpedido = pt.idpedidotienda and pd.tipo = 2
	left join mod_logfacturacion.dat_despachofactura despf on despf.idfactura = pd.iddocumento
	where pt.idareaventa = p_idareaventa and pt.estado = 3 and pp.cantidad < pp.cantidadreal 
	and (despf.iddespachotienda is null or despf.iddespachotienda in (
    	select det.iddespachotienda from mod_logfacturacion.dat_despachotienda det where det.estado = 1
    )) 
    and (case when p_idproducto is not null then p.idproducto = p_idproducto else true end)
	group by pp.codreferencia, p.cantidad, p.idproducto

	) loop
		if ((v_datos.enproceso - v_datos.cantidad + v_datos.cantidadreal) <= v_datos.existencia) then
				for v_datospedidos in (
					select pp.codreferencia, p.idproducto, p.precio, p.idumedida, pp.cantidad, pp.cantidadreal as cantidadreal, pd.iddocumento as idfactura, dc.idcliente,
					pp.idproductopedido, p.idelementogasto, p.idclasificacioncontable, p.idindicador
					 from mod_logpuntoventa.dat_pedidotienda pt
					inner join mod_logpuntoventa.dat_pedidoproducto pp ON pp.idpedidotienda = pt.idpedidotienda
					inner join mod_logistica.dat_producto p on p.idproducto = pp.idproducto
					left join mod_logpuntoventa.dat_pedidodocumento pd ON pd.idpedido = pt.idpedidotienda and pd.tipo = 2
					left join mod_logfacturacion.dat_despachofactura despf on despf.idfactura = pd.iddocumento
					inner join mod_logistica.dat_documentocliente dc on dc.iddocumento = pd.iddocumento
					where pt.idareaventa = p_idareaventa and pt.estado = 3 and pp.cantidad < pp.cantidadreal 
					and (despf.iddespachotienda is null or despf.iddespachotienda in (
                        select det.iddespachotienda from mod_logfacturacion.dat_despachotienda det where det.estado = 1
                    )) and pp.idproducto = v_datos.idproducto

					) loop
						select dp.idpadre into v_iddocumentopadre from mod_logistica.dat_documentopadre dp where dp.iddocumento = v_datospedidos.idfactura;
						select count(prd.idprodorden) into v_countexist from mod_logdistribucion.dat_prodorden prd
						where prd.idorden = v_iddocumentopadre and prd.idproducto = v_datos.idproducto;
						raise notice 'Existe %', v_countexist;
						if v_countexist = 0 then
							with prodorden AS (INSERT INTO 
							mod_logdistribucion.dat_prodorden
						  (
							idproducto,idcliente,cantidad,idorden
						  )						  
						  values (v_datospedidos.idproducto, v_datospedidos.idcliente, v_datospedidos.cantidadreal, v_iddocumentopadre)
						  RETURNING idprodorden, cantidad, idproducto)
						  INSERT INTO 
							mod_logdistribucion.dat_prodordencmpto
						  (
							idprodorden,enproceso,entregado,pendiente,cantidadoriginal
						  )
						  select idprodorden,0, 0,cantidad,cantidad from prodorden;
						else 
							update mod_logdistribucion.dat_prodorden set cantidad = cantidad + v_datospedidos.cantidadreal
							where idorden = v_iddocumentopadre and idproducto = v_datos.idproducto;
							
							update mod_logdistribucion.dat_prodordencmpto as cp set pendiente = cantidad + v_datospedidos.cantidadreal, 
							cantidadoriginal = cantidadoriginal + v_datospedidos.cantidadreal
							from mod_logdistribucion.dat_prodorden pord
							where pord.idorden = v_iddocumentopadre and pord.idproducto = v_datos.idproducto
							and pord.idprodorden = cp.idprodorden;
						end if;
						
						select count(dm.idmovimiento) into v_countexistmov from mod_logistica.dat_movimiento dm
						where dm.iddocumento = v_datospedidos.idfactura and dm.idproducto = v_datos.idproducto;
						if v_countexistmov = 0 then
							v_precioventa := 0;
                          	v_referencia := 0;
							
							INSERT INTO 
                                mod_logistica.dat_movimiento
                              (
                                iddocumento,idproducto,preciocontable,importecontable,cantidad,cronologia,signo,idunidadmedida,
                                idelementogasto,idclasificacion
                              )
                              VALUES (
                                v_datospedidos.idfactura,v_datospedidos.idproducto,v_datospedidos.precio,0,0,0,'-',
                                v_datospedidos.idumedida,v_datospedidos.idelementogasto,v_datospedidos.idclasificacioncontable
                              ) returning idmovimiento into v_idmovfactura;
                          for v_datosprecioventa in (
                              select distinct dp.idcuentadesgloseprecio, dm.preciopromedio, dmm.idmoneda, dp.concepto, dp.porciento, dp.valor
                               from mod_logfacturacion.dat_matrizprecio dm
                              inner join mod_logfacturacion.dat_matrizpreciodualmonetaria dmm on dmm.idmatrizprecio = dm.idmatrizprecio
                              inner join mod_logfacturacion.dat_precio dp on dp.idmatrizpreciodualidadmonetaria = dmm.idmatrizpreciodualidadmonetaria
                              where dm.idindicador = v_datospedidos.idindicador and dm.idtipoprecio = v_configTienda.idtipoprecioagencia and dm.idestructuracomun = (
                                  select conf.idpadrematriz from mod_logfacturacion.conf_configuracionfactura conf where conf.idestructuracomun = v_configTienda.idestructuracomun limit 1
                              ) and dmm.idmoneda = 9900000000
                          ) LOOP
                              if v_referencia = 0 THEN
                                  if v_datosprecioventa.preciopromedio = 1 then
                                     v_referencia := v_datospedidos.precio;
                                  end if;                
                                  v_precioventa := v_referencia;
                              end if;
                              if v_datosprecioventa.porciento = 1 THEN
                                  v_margenAux := (v_referencia*v_datosprecioventa.valor/100);
                                  v_precioventa := v_precioventa + v_margenAux;
                              else
                                  v_margenAux :=  v_datosprecioventa.valor;
                                  v_precioventa := v_precioventa + v_datosprecioventa.valor;
                              end if;
                              INSERT INTO 
                                    mod_logfacturacion.dat_elementocategoria
                                  (
                                    idcuentadesgloseprecio,
                                    valor,
                                    idindicador,
                                    idmovimiento,
                                    idmoneda,
                                    concepto
                                  )
                                  VALUES (
                                    v_datosprecioventa.idcuentadesgloseprecio,
                                    v_margenAux,
                                    v_datospedidos.idindicador,
                                    v_idmovfactura,
                                    v_datosprecioventa.idmoneda,
                                    v_datosprecioventa.concepto
                                  );
                          end loop;
                          with movmoneda as (
                              insert into mod_logistica.dat_movmoneda 
                              (
                                  idmovimiento, idmoneda, precio
                              )
                              values (v_idmovfactura, 9900000000, v_precioventa)
                              returning idmovimiento
                          )
                          INSERT INTO 
                            mod_logfacturacion.dat_prodfactura
                          (
                            idmovimiento,idtipoprecio,preciobase,referencia
                          )
                          select idmovimiento, v_configTienda.idtipoprecioagencia, v_precioventa, v_datospedidos.precio from movmoneda;
						
						end if;
						
						update mod_logpuntoventa.dat_pedidoproducto
                          set cantidad = v_datospedidos.cantidadreal
                          where idproductopedido = v_datospedidos.idproductopedido;
						  
						  update mod_logpuntoventa.dat_pedidoproducto
                          set enproceso = cantidad - coalesce(procesado,0)
                          where idproductopedido = v_datospedidos.idproductopedido;
				end loop;
		end if;
	end loop;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;

ALTER FUNCTION mod_logfacturacion.f_arreglarpedidostienda (p_idareaventa numeric, p_idproducto numeric)
  OWNER TO zeolides;  