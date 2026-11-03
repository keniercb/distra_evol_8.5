-- object recreation
ALTER TABLE mod_logpuntoventa.dat_ventaservicio
  DROP CONSTRAINT fk_ventas_ventaservicio RESTRICT;

ALTER TABLE mod_logpuntoventa.dat_ventaservicio
  ADD CONSTRAINT fk_ventas_ventaservicio FOREIGN KEY (idventas)
    REFERENCES mod_logistica.dat_documento(iddocumento)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;
	
ALTER TABLE mod_logpuntoventa.dat_ventaservicio
  ADD COLUMN idmoneda NUMERIC(19,0);	
   
	
ALTER TABLE mod_logpuntoventa.nom_modopago
  ADD COLUMN valor NUMERIC(25,2);
  
ALTER TABLE mod_logpuntoventa.nom_modopago
ADD COLUMN recargodescuento VARCHAR(1);

ALTER TABLE mod_logpuntoventa.nom_modopago
  ADD COLUMN porcentual NUMERIC(1,0);

ALTER TABLE mod_logpuntoventa.dat_ventas
  ADD COLUMN tipoconceptoventa NUMERIC(1,0);

ALTER TABLE mod_logpuntoventa.dat_ventas
  ADD COLUMN conceptoventa VARCHAR(1);

ALTER TABLE mod_logpuntoventa.dat_ventas
  ADD COLUMN valorconcepto NUMERIC(25,2);

ALTER TABLE mod_logpuntoventa.dat_ventas
  ADD COLUMN calculoconcepto NUMERIC(25,2);  
  
-- FUNCTION: mod_logpuntoventa.f_procesarpedidoscaja(numeric, numeric, numeric)

-- DROP FUNCTION IF EXISTS mod_logpuntoventa.f_procesarpedidoscaja(numeric, numeric, numeric);

CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_procesarpedidoscaja(
	p_idareaventa numeric,
	p_idestructuracomun numeric,
	p_idusuario numeric)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE STRICT PARALLEL UNSAFE
AS $BODY$
DECLARE
  v_iddoc numeric;
  v_iddocumento numeric;
  v_idespecialidad numeric;
  v_idperiodo record;
  v_fechafacturacion date;
  v_configtienda record;
  v_datosrecep record;
  v_idpersona numeric;
  v_datospersona record;
  v_productos record;
  v_servicios record;
  v_pedidostienda record;
  v_cronologia numeric;
  v_codigodeposito varchar;
  v_importe numeric;
  v_tipoventa numeric;
  v_infopago record;
  v_existepago record;
  v_lineinfopago varchar[];
  v_tipopago numeric;
  v_importepago numeric;
  v_countpendientes numeric;
BEGIN
	v_iddoc := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
    inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
    inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
    where ndp.abreviatura = 'compventaLog' and des.idestructuracomun = p_idestructuracomun limit 1);
     
    v_idespecialidad := (select cue.idespecialidad from mod_logistica.conf_usuarioespecialidad cue 
                where cue.idusuario = p_idusuario limit 1);
    
    v_idperiodo = mod_logistica.f_obtenerejercicioactivo(13, p_idestructuracomun);            
                
    select da.* into v_configtienda from mod_logpuntoventa.dat_areaventa da where da.idareaventa = p_idareaventa limit 1;
    
    v_codigodeposito := (select est.codigo from mod_estructuracomp.v_dametodasestructuras est where est.idestructura = v_configtienda.idestructuraop);
    
    v_fechafacturacion := (select da.fecha from mod_logistica.dat_estadoalmacen da where da.iddeposito = v_configtienda.idestructuraop limit 1);
    if v_fechafacturacion is null then
    	v_fechafacturacion := (select df.fecha from mod_datosmaestros.dat_fecha df
        inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = df.idestructurasubsist
        where des.idsubsistema = 13 and des.idestructuracomun = p_idestructuracomun limit 1);
    end if;
    --generando comprobante de venta por cada pedido
    select max(d.cronologia) into v_cronologia from mod_logistica.dat_documento d;
    if v_configtienda.tipoventa = 1 then 
    	for v_pedidostienda in (
        	select pt.*, dc.idtiporegistradora from mod_logpuntoventa.dat_pedidotienda pt
			inner join mod_logpuntoventa.dat_caja dc on dc.identificador = pt.identificador
            left join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pt.idpedidotienda and pd.tipo = 4 
            where pt.idareaventa = p_idareaventa and pt.fechapedido <= v_fechafacturacion and pt.estado = 1
            and pd.idpedidodocumento is null
        ) LOOP
        	v_cronologia := v_cronologia + 1;
            with documento AS (INSERT INTO mod_logistica.dat_documento
                (
                  iddoc,anno,fechacontable,observaciones,cronologia,version,idusuario,estado,idejercicio,
                  idestructuracomun,idperiodo,numeroref,idespecialidad,idoperacion,nrodoc,aprobadopor
                )
                VALUES (
                  v_iddoc, date_part('year', CAST(to_char(v_fechafacturacion, 'DD/MM/YYYY HH24:MI') as timestamp)),
                  v_fechafacturacion,'Factura generada automaticamente: Pedido '||v_pedidostienda.nropedido,v_cronologia
                  ,1,p_idusuario,4,v_idperiodo.idejercicioactual,
                  v_configtienda.idestructuraop, v_idperiodo.idperiodoactual,
                  (COALESCE((
                    select max(dd.numeroref) from mod_logistica.dat_documento dd where dd.iddoc = v_iddoc
                    and dd.idejercicio = v_idperiodo.idejercicioactual and dd.idestructuracomun = v_configtienda.idestructuraop
                  ),0)+1),1,v_configtienda.idnomoperaciones,
                  (COALESCE((
                    select max(dd.nrodoc) from mod_logistica.dat_documento dd where dd.iddoc = v_iddoc
                    and dd.idejercicio = v_idperiodo.idejercicioactual and dd.idestructuracomun = v_configtienda.idestructuraop
                  ),0)+1),p_idusuario
                ) returning iddocumento,iddoc,idejercicio,idestructuracomun,nrodoc),
                venta as (
                INSERT INTO 
                    mod_logpuntoventa.dat_ventas
                  (
                    idventas,
                    --idpersona,
                    fechaventa,
                    importe,
                    --idcaja,
                    idpago,
                    idareaventa,
                    --efectivo,
                    --cambio,
                    --fechaexpiracion,
                    --nroventa,
                    estado,
                    --idcierreventa,
                    --tipoventa,
                    --vendedor,
                    idmoneda,
                    --importedevuelto,
                    --identrega,
                    nrofactura
                  )
                  select iddocumento,
                    --v_idpersona,
                    v_fechafacturacion,
                    (select sum(pp.importe) from mod_logpuntoventa.dat_pedidoproducto pp 
                    where pp.idpedidotienda = v_pedidostienda.idpedidotienda),
                    --?idcaja,
                    -3,
                    v_pedidostienda.idareaventa,
                    --?efectivo,
                    --?cambio,
                    --?fechaexpiracion,
                    --?nroventa,
                    1,
                    --?idcierreventa,
                    --?tipoventa,
                    --?vendedor,
                    v_configtienda.idmoneda,
                    --?importedevuelto,
                    --?identrega,
                    nrodoc||'.'||v_codigodeposito||'.'||date_part('year', CAST(to_char(v_fechafacturacion, 'DD/MM/YYYY HH24:MI') as timestamp))
                    from documento returning idventas)--,
                    
                /*ventaorden as (
                    INSERT INTO 
                      mod_logpuntoventa.dat_ventaorden
                    (
                      idorden,
                      nroorden,
                      --pago,
                      --envio,
                      fechaorden,
                      estadoorden,
                      idventas,
                      tiendavirtual
                    )
                    select v_pedidostienda.idreferencia, v_pedidostienda.nropedido,v_pedidostienda.fechapedido,v_pedidostienda.estado, idventas, 2 from venta 
                ),
                documentopedido as (
                    INSERT INTO mod_logpuntoventa.dat_pedidodocumento
                    (
                      idpedido,iddocumento,tipo
                    )
                    select v_pedidostienda.idpedidotienda, iddocumento, 4 from documento
                )*/
                INSERT INTO 
                    mod_logistica.dat_documentocliente
                  (
                    iddocumento,idcliente,tipocliente,idcondicionpago
                  )
                  select iddocumento, v_configtienda.idcliente, 1, v_configtienda.idcondicionpago from documento
                  RETURNING iddocumento into v_iddocumento;  
                
                for v_productos in (
                        select dp.precio, dp.cantidad as existencia, pp.cantidad as cantidadpedido,dp.idumedida, dp.*, pp.idproductopedido, pp.precio as preciopedido
                        from mod_logistica.dat_producto dp
                        inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idproducto = dp.idproducto
                        where pp.idpedidotienda = v_pedidostienda.idpedidotienda and pp.tipo = 1
                    ) loop
                    
                    with movimiento as (
                            INSERT INTO 
                              mod_logistica.dat_movimiento
                            (
                              iddocumento,
                              idproducto,
                              preciocontable,
                              importecontable,
                              cantidad,
                              cronologia,
                              signo,
                              idunidadmedida,
                              idelementogasto,
                              idclasificacion,
                              existenciaactual,
                              preciopromedio,
                              importetotal
                            )
                            VALUES (
                              v_iddocumento,
                              v_productos.idproducto,
                              v_productos.precio,
                              round(v_productos.cantidadpedido*v_productos.precio,2),
                              v_productos.cantidadpedido,
                              v_cronologia,
                              '-',
                              v_productos.idumedida,
                              v_productos.idelementogasto,
                              v_productos.idclasificacioncontable,
                              (v_productos.existencia-v_productos.cantidadpedido),
                              (case when (v_productos.existencia-v_productos.cantidadpedido) > 0 
                                  then (round(v_productos.importe - (v_productos.precio*v_productos.cantidadpedido),2))/(v_productos.existencia-v_productos.cantidadpedido)  
                              else 0 end),
                              (case when (v_productos.existencia-v_productos.cantidadpedido) > 0 
                                    then (round(v_productos.importe - (v_productos.precio*v_productos.cantidadpedido), 2) )
                              else 0 end)
                            ) returning idmovimiento, preciocontable, idproducto
                        ), movmoneda as (
                            insert into mod_logistica.dat_movmoneda 
                          (
                              idmovimiento, idmoneda, precio
                          )
                          select idmovimiento, v_configtienda.idmoneda, v_productos.preciopedido from movimiento
                        )/*, cantidadcomp as (
                          INSERT INTO 
                            mod_logistica.dat_cantidadcomprometida
                          (
                            iddocumento,idproducto,idcliente,cantidad,estado
                          ) 
                          select v_iddocumento,idproducto,v_configtienda.idcliente,v_productos.cantidadpedido,1 from movimiento
                          RETURNING iddocumento
                        )*/
                        INSERT INTO 
                          mod_logpuntoventa.dat_ventaproducto
                        (
                          idproducto,
                          idventas,
                          cantidad,
                          precio,
                          importetotal
                        )
                        select idproducto, v_iddocumento, v_productos.cantidadpedido, v_productos.preciopedido,
                         round(v_productos.preciopedido*v_productos.cantidadpedido,2) from movimiento;
                    update mod_logistica.dat_producto as dp
                    set cantidad = dp.cantidad - v_productos.cantidadpedido,
                    precio = (case when (dp.cantidad-v_productos.cantidadpedido) > 0 
                              then (round(dp.importe - (dp.precio*v_productos.cantidadpedido),2))/(dp.cantidad-v_productos.cantidadpedido)  
                          else 0 end),
                    cronologia = v_cronologia,
                    importe = (case when (dp.cantidad-v_productos.cantidadpedido) > 0 
                                then (round(dp.importe - (dp.precio*v_productos.cantidadpedido), 2) )
                          else 0 end)     
                    where dp.idproducto = v_productos.idproducto;
                end loop;
				
				/*Servicios*/
				for v_servicios in (
                        select ni.idindicador, pp.cantidad as cantidadpedido,pp.idproductopedido, pp.precio as preciopedido
                        from mod_datosmaestros.nom_indicador ni
                        inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idindicador = ni.idindicador
                        where pp.idpedidotienda = v_pedidostienda.idpedidotienda and pp.tipo = 2
                    ) loop
                        INSERT INTO 
                          mod_logpuntoventa.dat_ventaservicio
                        (
                          idindicador,
                          idventas,
                          cantidad,
                          precio,
                          importetotal,
					       idmoneda
                        )
                        values (v_servicios.idindicador, v_iddocumento, v_servicios.cantidadpedido, v_servicios.preciopedido,
                         round(v_servicios.preciopedido*v_servicios.cantidadpedido,2), v_configtienda.idmoneda);
                end loop;				
				/*Fin servicios*/
				
                update mod_logpuntoventa.dat_pedidotienda set estado = 5
                where idpedidotienda = v_pedidostienda.idpedidotienda;
				
				for v_infopago in (
					select t.fragmento from (
							select regexp_split_to_table(v_pedidostienda.infopago, '\n') as fragmento
						) t
					) loop
						select
							array_agg(t.fragmento) into v_lineinfopago from (
								select regexp_split_to_table(v_infopago.fragmento, ';') as fragmento
							) t;
						if v_lineinfopago[4]::numeric = 6 then
							if v_pedidostienda.idtiporegistradora = 1 then
								v_tipopago := (select np.idmodopago from mod_logpuntoventa.nom_modopago np where np.codigocaja = v_lineinfopago[5]::numeric limit 1);
							else
								v_tipopago := (select np.idmodopago from mod_logpuntoventa.nom_modopago np where np.codigocajaapos = v_lineinfopago[5]::numeric limit 1);
							end if;
							v_importepago := v_lineinfopago[9]::numeric;
							if v_tipopago is not null then
								INSERT INTO mod_logpuntoventa.dat_desglosepago(
								iddocumento, idformapago, importe)
								VALUES (v_iddocumento, v_tipopago, v_importepago);
							end if;	
						end if;
				end loop;
        end loop;
    ELSE
    --generando comprobante de venta resumen de los pedidos pendientes a procesar
    
    v_cronologia := v_cronologia + 1;   
    v_importe := 0;
	select count(pt.idpedidotienda) into v_countpendientes from mod_logpuntoventa.dat_pedidotienda pt
			inner join mod_logpuntoventa.dat_caja dc on dc.identificador = pt.identificador
            left join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pt.idpedidotienda and pd.tipo = 4 
            where pt.idareaventa = p_idareaventa and pt.fechapedido <= v_fechafacturacion and pt.estado = 1
            and pd.idpedidodocumento is null;
    if v_countpendientes > 0 then 
		with documento AS (INSERT INTO mod_logistica.dat_documento
		    (
		      iddoc,anno,fechacontable,observaciones,cronologia,version,idusuario,estado,idejercicio,
		      idestructuracomun,idperiodo,numeroref,idespecialidad,idoperacion,nrodoc,aprobadopor
		    )
		    VALUES (
		      v_iddoc, date_part('year', CAST(to_char(v_fechafacturacion, 'DD/MM/YYYY HH24:MI') as timestamp)),
		      v_fechafacturacion,'Comprobante de venta reumen',v_cronologia
		      ,1,p_idusuario,4,v_idperiodo.idejercicioactual,
		      v_configtienda.idestructuraop, v_idperiodo.idperiodoactual,
		      (COALESCE((
		        select max(dd.numeroref) from mod_logistica.dat_documento dd where dd.iddoc = v_iddoc
		        and dd.idejercicio = v_idperiodo.idejercicioactual and dd.idestructuracomun = v_configtienda.idestructuraop
		      ),0)+1),1,v_configtienda.idnomoperaciones,
		      (COALESCE((
		        select max(dd.nrodoc) from mod_logistica.dat_documento dd where dd.iddoc = v_iddoc
		        and dd.idejercicio = v_idperiodo.idejercicioactual and dd.idestructuracomun = v_configtienda.idestructuraop
		      ),0)+1),p_idusuario
		    ) returning iddocumento,iddoc,idejercicio,idestructuracomun,nrodoc),
		    venta as (
		    INSERT INTO 
		        mod_logpuntoventa.dat_ventas
		      (
		        idventas,
		        --idpersona,
		        fechaventa,
		        importe,
		        --idcaja,
		        idpago,
		        idareaventa,
		        --efectivo,
		        --cambio,
		        --fechaexpiracion,
		        --nroventa,
		        estado,
		        --idcierreventa,
		        --tipoventa,
		        --vendedor,
		        idmoneda,
		        --importedevuelto,
		        --identrega,
		        nrofactura
		      )
		      select iddocumento,
		        --v_idpersona,
		        v_fechafacturacion,
		        0,
		        --?idcaja,
		        -3,
		        p_idareaventa,
		        --?efectivo,
		        --?cambio,
		        --?fechaexpiracion,
		        --?nroventa,
		        1,
		        --?idcierreventa,
		        --?tipoventa,
		        --?vendedor,
		        v_configtienda.idmoneda,
		        --?importedevuelto,
		        --?identrega,
		        nrodoc||'.'||v_codigodeposito||'.'||date_part('year', CAST(to_char(v_fechafacturacion, 'DD/MM/YYYY HH24:MI') as timestamp))
		        from documento returning idventas)--,
		                    
		    /*ventaorden as (
		        INSERT INTO 
		          mod_logpuntoventa.dat_ventaorden
		        (
		          idorden,
		          nroorden,
		          --pago,
		          --envio,
		          fechaorden,
		          estadoorden,
		          idventas,
		          tiendavirtual
		        )
		        select v_pedidostienda.idreferencia, v_pedidostienda.nropedido,v_pedidostienda.fechapedido,v_pedidostienda.estado, idventas, 2 from venta 
		    ),*/
		    /*documentopedido as (
		        INSERT INTO mod_logpuntoventa.dat_pedidodocumento
		        (
		          idpedido,iddocumento,tipo
		        )
		        select v_pedidostienda.idpedidotienda, iddocumento, 4 from documento
		    )*/
		    INSERT INTO 
		        mod_logistica.dat_documentocliente
		      (
		        iddocumento,idcliente,tipocliente,idcondicionpago
		      )
		      select iddocumento, v_configtienda.idcliente, 1, v_configtienda.idcondicionpago from documento
		      RETURNING iddocumento into v_iddocumento;  
		    
		    
		    for v_productos in (
		        select DISTINCT dp.idproducto, dp.precio, dp.cantidad as existencia, sum(pp.cantidad) as cantidadpedido,dp.idumedida, pp.precio as preciopedido,
		        dp.idelementogasto, dp.idclasificacioncontable, dp.importe
		        from mod_logistica.dat_producto dp
		        inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idproducto = dp.idproducto
		        where pp.idpedidotienda in (
		        	select pt.idpedidotienda from mod_logpuntoventa.dat_pedidotienda pt
		            left join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pt.idpedidotienda and pd.tipo = 4 
		            where pt.idareaventa = p_idareaventa and pt.fechapedido <= v_fechafacturacion and pt.estado = 1
		            and pd.idpedidodocumento is null
		        ) and pp.tipo = 1
				group by dp.idproducto,pp.precio
		    ) loop
		                    
		    with movimiento as (
		            INSERT INTO 
		              mod_logistica.dat_movimiento
		            (
		              iddocumento,
		              idproducto,
		              preciocontable,
		              importecontable,
		              cantidad,
		              cronologia,
		              signo,
		              idunidadmedida,
		              idelementogasto,
		              idclasificacion,
		              existenciaactual,
		              preciopromedio,
		              importetotal
		            )
		            VALUES (
		              v_iddocumento,
		              v_productos.idproducto,
		              v_productos.precio,
		              round(v_productos.cantidadpedido*v_productos.precio,2),
		              v_productos.cantidadpedido,
		              v_cronologia,
		              '-',
		              v_productos.idumedida,
		              v_productos.idelementogasto,
		              v_productos.idclasificacioncontable,
		              (v_productos.existencia-v_productos.cantidadpedido),
		              (case when (v_productos.existencia-v_productos.cantidadpedido) > 0 
		                  then (round(v_productos.importe - (v_productos.precio*v_productos.cantidadpedido),2))/(v_productos.existencia-v_productos.cantidadpedido)  
		              else 0 end),
		              (case when (v_productos.existencia-v_productos.cantidadpedido) > 0 
		                    then (round(v_productos.importe - (v_productos.precio*v_productos.cantidadpedido), 2) )
		              else 0 end)
		            ) returning idmovimiento, preciocontable, idproducto
		        ), movmoneda as (
		            insert into mod_logistica.dat_movmoneda 
		          (
		              idmovimiento, idmoneda, precio
		          )
		          select idmovimiento, v_configtienda.idmoneda, v_productos.preciopedido from movimiento
		        )/*, cantidadcomp as (
		          INSERT INTO 
		            mod_logistica.dat_cantidadcomprometida
		          (
		            iddocumento,idproducto,idcliente,cantidad,estado
		          ) 
		          select v_iddocumento,idproducto,v_configtienda.idcliente,v_productos.cantidadpedido,1 from movimiento
		          RETURNING iddocumento
		        )*/
		        INSERT INTO 
		          mod_logpuntoventa.dat_ventaproducto
		        (
		          idproducto,
		          idventas,
		          cantidad,
		          precio,
		          importetotal
		        )
		        select idproducto, v_iddocumento, v_productos.cantidadpedido, v_productos.preciopedido,
		         round(v_productos.preciopedido*v_productos.cantidadpedido,2) from movimiento;
		    update mod_logistica.dat_producto as dp
		    set cantidad = dp.cantidad - v_productos.cantidadpedido,
		    precio = (case when (dp.cantidad-v_productos.cantidadpedido) > 0 
		              then (round(dp.importe - (dp.precio*v_productos.cantidadpedido),2))/(dp.cantidad-v_productos.cantidadpedido)  
		          else 0 end),
		    cronologia = v_cronologia,
		    importe = (case when (dp.cantidad-v_productos.cantidadpedido) > 0 
		                then (round(dp.importe - (dp.precio*v_productos.cantidadpedido), 2) )
		          else 0 end)     
		    where dp.idproducto = v_productos.idproducto;
		    v_importe = v_importe + (round(v_productos.preciopedido*v_productos.cantidadpedido,2));
		end loop;
			
			for v_servicios in (
					select ni.idindicador, sum(pp.cantidad) as cantidadpedido, pp.precio as preciopedido
					from mod_datosmaestros.nom_indicador ni
					inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idindicador = ni.idindicador
					where pp.idpedidotienda in (
		        	select pt.idpedidotienda from mod_logpuntoventa.dat_pedidotienda pt
		            left join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pt.idpedidotienda and pd.tipo = 4 
		            where pt.idareaventa = p_idareaventa and pt.fechapedido <= v_fechafacturacion and pt.estado = 1
		            and pd.idpedidodocumento is null
		        ) and pp.tipo = 2
				group by ni.idindicador,pp.precio
				) loop
					INSERT INTO 
					  mod_logpuntoventa.dat_ventaservicio
					(
					  idindicador,
					  idventas,
					  cantidad,
					  precio,
					  importetotal,
				      idmoneda
					)
					values (v_servicios.idindicador, v_iddocumento, v_servicios.cantidadpedido, v_servicios.preciopedido,
					 round(v_servicios.preciopedido*v_servicios.cantidadpedido,2),v_configtienda.idmoneda);
					v_importe = v_importe + (round(v_servicios.preciopedido*v_servicios.cantidadpedido,2));		
			end loop;									
										
			update mod_logpuntoventa.dat_ventas set importe = v_importe where idventas = v_iddocumento;
			
			update mod_logpuntoventa.dat_pedidotienda set estado = 5
		    where idpedidotienda in (
		    	select pt.idpedidotienda from mod_logpuntoventa.dat_pedidotienda pt
		            left join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pt.idpedidotienda and pd.tipo = 4 
		            where pt.idareaventa = p_idareaventa and pt.fechapedido <= v_fechafacturacion and pt.estado = 1
		            and pd.idpedidodocumento is null
		    );
			
			INSERT INTO mod_logpuntoventa.dat_pedidodocumento
		        (
		          idpedido,iddocumento,tipo
		        )
		        select pt.idpedidotienda, v_iddocumento, 4 from mod_logpuntoventa.dat_pedidotienda pt
		            left join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pt.idpedidotienda and pd.tipo = 4 
		            where pt.idareaventa = p_idareaventa and pt.fechapedido <= v_fechafacturacion and pt.estado = 5
		            and pd.idpedidodocumento is null;
		    
			for v_pedidostienda in (
		        	select pt.*, dc.idtiporegistradora from mod_logpuntoventa.dat_pedidotienda pt
					inner join mod_logpuntoventa.dat_caja dc on dc.identificador = pt.identificador
		            inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pt.idpedidotienda and pd.tipo = 4 
		            where pt.idareaventa = p_idareaventa and pd.iddocumento = v_iddocumento
		        ) LOOP
				for v_infopago in (
				select t.fragmento from (
						select regexp_split_to_table(v_pedidostienda.infopago, '\n') as fragmento
					) t
				) loop
					select
						array_agg(t.fragmento) into v_lineinfopago from (
							select regexp_split_to_table(v_infopago.fragmento, ';') as fragmento
						) t;
					if v_lineinfopago[4]::numeric = 6 then
						if v_pedidostienda.idtiporegistradora = 1 then
							v_tipopago := (select np.idmodopago from mod_logpuntoventa.nom_modopago np where np.codigocaja = v_lineinfopago[5]::numeric limit 1);
						else
							v_tipopago := (select np.idmodopago from mod_logpuntoventa.nom_modopago np where np.codigocajaapos = v_lineinfopago[5]::numeric limit 1);
						end if;
						v_importepago := replace(v_lineinfopago[9], ',','')::numeric;
						if v_tipopago is not null then
							select dp.* into v_existepago from mod_logpuntoventa.dat_desglosepago dp where dp.iddocumento = v_iddocumento
							and dp.idformapago = v_tipopago;
							if v_existepago.idformapago is null then
								INSERT INTO mod_logpuntoventa.dat_desglosepago(
								iddocumento, idformapago, importe)
								VALUES (v_iddocumento, v_tipopago, v_importepago);
							else
								update mod_logpuntoventa.dat_desglosepago as dp
								set importe = dp.importe + v_importepago
								where dp.iddocumento = v_iddocumento
								and dp.idformapago = v_tipopago;
							end if;
						end if;	
					end if;
			end loop;
			end loop;
	end if;
	
    end if;
    
END;
$BODY$;

ALTER FUNCTION mod_logpuntoventa.f_procesarpedidoscaja(numeric, numeric, numeric)
    OWNER TO zeolides;
  