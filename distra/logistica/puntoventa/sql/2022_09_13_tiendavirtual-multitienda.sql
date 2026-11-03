ALTER TABLE mod_logpuntoventa.dat_almacenregion
  ADD COLUMN IF NOT EXISTS idareaventa NUMERIC(19,0);


/*Procesar pedidos*/  

CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_procesarpedidostienda (
  p_idusuario numeric,
  p_idejercicio numeric,
  p_idperiodo numeric,
  p_idestructuracomun numeric,
  p_areaventa numeric
)
RETURNS void AS
$body$
DECLARE
  v_iddocdistribucion numeric;
  v_iddocfacturacion numeric;
  v_iddocumento numeric;
  v_idfactura numeric;
  v_idespecialidad numeric;
  v_idperiododistribucion record;
  v_idperiodofacturacion record;
  v_fechadistribucion date;
  v_fechafacturacion date;
  v_centroentrega record;
  v_idcliente numeric;
  v_pedidos record;
  v_idoperacionfactura numeric;
  v_producto record;
  v_iddepositoorigen numeric;
  v_condicionpago record;
  v_idcuentacliente numeric;
  v_datosareaventa record;
  v_datosprecioventa record;
  v_idmovfactura numeric;
  v_precioventa numeric;
  v_margenAux numeric;
  v_referencia numeric;
BEGIN
	--Inicializando parametros para adicionar distribucion general con los productos de los pedidos
    v_iddocdistribucion := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
    inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
    inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
    where ndp.abreviatura = 'entregaLog' and des.idestructuracomun = p_idestructuracomun limit 1);
    
    v_iddocfacturacion := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
        inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
        inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
        where ndp.abreviatura = 'facturaLog' and des.idestructuracomun = p_idestructuracomun limit 1);
     
    v_idespecialidad := (select cue.idespecialidad from mod_logistica.conf_usuarioespecialidad cue 
                where cue.idusuario = p_idusuario limit 1);
    
    v_idperiododistribucion = mod_logistica.f_obtenerejercicioactivo(10, p_idestructuracomun);            
                
    v_fechadistribucion := (select df.fecha from mod_datosmaestros.dat_fecha df
    inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = df.idestructurasubsist
    where des.idsubsistema = 10 and des.idestructuracomun = p_idestructuracomun limit 1);
    
    /*v_idoperacionfactura := (select dop.idnomoperaciones from mod_logfacturacion.dat_operacionsubsistema dop 
    where dop.idestructura = p_idestructuracomun and dop.tiendavirtual = 1 limit 1);
    
    v_iddepositoorigen := (select da.idestructuraop from mod_logpuntoventa.dat_areaventa da where da.idareaventa = p_areaventa);*/
    
    select da.* into v_datosareaventa from mod_logpuntoventa.dat_areaventa da where da.idareaventa = p_areaventa;
    
    v_idoperacionfactura := v_datosareaventa.idnomoperaciones;
    
    v_iddepositoorigen := v_datosareaventa.idestructuraop;
    
    raise notice 'idespecialidad ,%', v_idespecialidad ;
    raise notice 'fechadist ,%', v_fechadistribucion ; 
    --Insertando distribucion
    for v_centroentrega in (
    	select distinct cent.idestructura from mod_logpuntoventa.dat_centroentregaalmacen cent
        inner join mod_logpuntoventa.dat_almacenregion ar on ar.idestructura = cent.iddeposito
        inner join mod_logpuntoventa.dat_pedidotienda pt on pt.id_state = ar.id_state
        where cent.idareaventa = p_areaventa and pt.estado = 2
    ) loop
    	
        if v_centroentrega.idestructura = p_idestructuracomun THEN
        	
        else
        	v_idcliente := (select nc.idclientesproveedores from mod_datosmaestros.nom_clientesproveedor nc
          					where nc.idestructura = v_centroentrega.idestructura limit 1);
        	INSERT INTO mod_logistica.dat_documento
            (
              iddoc,anno,fechacontable,observaciones,cronologia,version,idusuario,estado,idejercicio,
              idestructuracomun,idperiodo,numeroref,idespecialidad,nrodoc,aprobadopor
            )
            VALUES (
              v_iddocdistribucion, date_part('year', CAST(to_char(v_fechadistribucion, 'DD/MM/YYYY HH24:MI') as timestamp)),
              v_fechadistribucion,'Distribucion generada de tienda virtual',0,1,p_idusuario,3,v_idperiododistribucion.idejercicioactual,
              p_idestructuracomun, v_idperiododistribucion.idperiodoactual,
              (COALESCE((
                select max(dd.numeroref) from mod_logistica.dat_documento dd where dd.iddoc = v_iddocdistribucion
                and dd.idejercicio = v_idperiododistribucion.idejercicioactual and dd.idestructuracomun = p_idestructuracomun
              ),0)+1),1,(COALESCE((
                select max(dd.nrodoc) from mod_logistica.dat_documento dd where dd.iddoc = v_iddocdistribucion
                and dd.idejercicio = v_idperiododistribucion.idejercicioactual and dd.idestructuracomun = p_idestructuracomun
              ),0)+1),p_idusuario
            ) returning iddocumento into v_iddocumento;
            INSERT INTO mod_logdistribucion.dat_distribucion
            (
              iddistribucion,idestructuraop,tipodestino,tipodistribucion,salidaporfactura
            )
            VALUES (v_iddocumento,p_idestructuracomun,1,7,1);
            INSERT INTO mod_logistica.dat_documentocliente
            (
              iddocumento,idcliente,tipocliente
            )
            VALUES (v_iddocumento,v_idcliente,1);
            --insertando productos de la distribucion
            with prodorden AS (INSERT INTO 
              mod_logdistribucion.dat_prodorden
            (
              idproducto,idcliente,cantidad,idorden
            )
            (
            select DISTINCT pp.idproducto, v_idcliente,sum(pp.cantidad) as cantidad,v_iddocumento
            from mod_logpuntoventa.dat_pedidoproducto pp
            inner join mod_logpuntoventa.dat_pedidotienda ptt on ptt.idpedidotienda = pp.idpedidotienda
            where (pp.cantidad - coalesce(pp.enproceso,0) - coalesce(pp.procesado,0)) > 0
            and ptt.estado = 2 and ptt.id_state in (
            select alr.id_state from mod_logpuntoventa.dat_almacenregion alr
            inner join mod_logpuntoventa.dat_centroentregaalmacen cea on cea.iddeposito = alr.idestructura
            and cea.idestructura = v_centroentrega.idestructura
            )
            group by pp.idproducto
            ) RETURNING idprodorden, cantidad, idproducto)/*,
            cantidadcomp as (
              INSERT INTO 
                mod_logistica.dat_cantidadcomprometida
              (
                iddocumento,idproducto,idcliente,cantidad,estado
              ) 
              select v_iddocumento,idproducto,v_idcliente,cantidad,1 from prodorden
              RETURNING iddocumento
            )*/
            INSERT INTO 
              mod_logdistribucion.dat_prodordencmpto
            (
              idprodorden,enproceso,entregado,pendiente,cantidadoriginal
            )
            select idprodorden,0, 0,cantidad,cantidad from prodorden;
            
            --Insertando relacion de los pedidos y la distribucion
            INSERT INTO mod_logpuntoventa.dat_pedidodocumento
            (
              idpedido,iddocumento,tipo
            )
            (select pt.idpedidotienda, v_iddocumento, 1 from mod_logpuntoventa.dat_pedidotienda pt
                where pt.estado = 2 and pt.id_state in (
            select alr.id_state from mod_logpuntoventa.dat_almacenregion alr
            inner join mod_logpuntoventa.dat_centroentregaalmacen cea on cea.iddeposito = alr.idestructura
            and cea.idestructura = v_centroentrega.idestructura
            )
            );
            --inertando facturas
            select cc.idterminodepago, ntp.plazo into v_condicionpago from mod_datosmaestros.dat_clienteproveedorcobropago cc
            inner join mod_datosmaestros.nom_terminosdepago ntp on ntp.idterminodepago = cc.idterminodepago
            where cc.idclienteproveedor = v_idcliente and cc.clasificacion = 2 and cc.idmoneda = 9900000000 limit 1;
            
            v_idcuentacliente := (select cbc.idcuentabancliente from mod_datosmaestros.dat_cuentabanccliente cbc 
            where cbc.idclienteproveedores = v_idcliente and cbc.idmoneda = 9900000000 limit 1);
            
            
            v_idperiodofacturacion = mod_logistica.f_obtenerejercicioactivo(13, p_idestructuracomun);
            
            v_fechafacturacion := (select df.fecha from mod_datosmaestros.dat_fecha df
            inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = df.idestructurasubsist
            where des.idsubsistema = 13 and des.idestructuracomun = p_idestructuracomun limit 1);
            for v_pedidos in (
                select pt.*, pd.* from mod_logpuntoventa.dat_pedidodocumento pd
                inner join mod_logpuntoventa.dat_pedidotienda pt on pt.idpedidotienda = pd.idpedido
                where pt.estado = 2 and pd.iddocumento = v_iddocumento and (
                    select sum(coalesce(ppp.cantidad,0)-coalesce(ppp.enproceso,0)-coalesce(ppp.procesado,0)) 
                    from mod_logpuntoventa.dat_pedidoproducto ppp where ppp.idpedidotienda = pt.idpedidotienda
                ) > 0 and pt.id_state in (
                select alr.id_state from mod_logpuntoventa.dat_almacenregion alr
                inner join mod_logpuntoventa.dat_centroentregaalmacen cea on cea.iddeposito = alr.idestructura
                and cea.idestructura = v_centroentrega.idestructura
                )
            ) loop
            
                with documento AS (INSERT INTO mod_logistica.dat_documento
                (
                  iddoc,anno,fechacontable,observaciones,cronologia,version,idusuario,estado,idejercicio,
                  idestructuracomun,idperiodo,numeroref,idespecialidad,idoperacion
                )
                VALUES (
                  v_iddocfacturacion, date_part('year', CAST(to_char(v_fechafacturacion, 'DD/MM/YYYY HH24:MI') as timestamp)),
                  v_fechafacturacion,'Factura generada tienda virtual. Pedido '||v_pedidos.nropedido,0,1,p_idusuario,1,v_idperiodofacturacion.idejercicioactual,
                  p_idestructuracomun, v_idperiodofacturacion.idperiodoactual,
                  (COALESCE((
                    select max(dd.numeroref) from mod_logistica.dat_documento dd where dd.iddoc = v_iddocfacturacion
                    and dd.idejercicio = v_idperiodofacturacion.idejercicioactual and dd.idestructuracomun = p_idestructuracomun
                  ),0)+1),1,v_idoperacionfactura
                ) returning iddocumento,iddoc,idejercicio,idestructuracomun),
                factura as (
                INSERT INTO 
                  mod_logfacturacion.dat_docfactura
                  (
                    idfactura,idcliente,iddeposito,oferta,idsubsistema,idejercicio,
                    idestructuracomun,iddoc,nrorden,idcondicionpago,dias
                  )
                  select iddocumento,v_idcliente,v_iddepositoorigen,0,10,idejercicio,idestructuracomun,
                  iddoc,v_pedidos.nropedido,v_condicionpago.idterminodepago,v_condicionpago.plazo from documento
                  returning idcliente, idfactura
                ),
                cuenta as (
                  INSERT INTO 
                    mod_logfacturacion.dat_cuentafacturacliente
                    (
                      idfactura,idcuentacliente
                    )
                    select idfactura, v_idcuentacliente from factura
                    returning idfactura
                ),
                documentocliente as (
                INSERT INTO 
                    mod_logistica.dat_documentocliente
                  (
                    iddocumento,idcliente,tipocliente,idcondicionpago
                  )
                  select idfactura, idcliente, 1, v_condicionpago.idterminodepago from factura
                  RETURNING iddocumento
                )
                INSERT INTO 
                  mod_logistica.dat_documentopadre
                (
                  iddocumento,idpadre
                )
                select iddocumento, v_iddocumento from documentocliente 
                RETURNING iddocumento into v_idfactura;
                --insertando productos a la factura
                for v_producto in (
                    select pp.idproductopedido, dp.idproducto, dp.precio, dp.idumedida, dp.idelementogasto, dp.idclasificacioncontable,
                    dp.idindicador
                     from mod_logpuntoventa.dat_pedidoproducto pp
                    inner join mod_logistica.dat_producto dp on dp.idproducto = pp.idproducto
                    where pp.idpedidotienda = v_pedidos.idpedidotienda and dp.idestructura = v_iddepositoorigen
                    and (pp.cantidad - coalesce(pp.enproceso,0) - coalesce(pp.procesado,0)) > 0 
                ) LOOP
                    v_precioventa := 0;
                    v_referencia := 0;
                    INSERT INTO 
                          mod_logistica.dat_movimiento
                        (
                          iddocumento,idproducto,preciocontable,importecontable,cantidad,cronologia,signo,idunidadmedida,
                          idelementogasto,idclasificacion
                        )
                        VALUES (
                          v_idfactura,v_producto.idproducto,v_producto.precio,0,0,0,'-',
                          v_producto.idumedida,v_producto.idelementogasto,v_producto.idclasificacioncontable
                        ) returning idmovimiento into v_idmovfactura;
                    for v_datosprecioventa in (
                        select distinct dp.idcuentadesgloseprecio, dm.preciopromedio, dmm.idmoneda, dp.concepto, dp.porciento, dp.valor
                         from mod_logfacturacion.dat_matrizprecio dm
                        inner join mod_logfacturacion.dat_matrizpreciodualmonetaria dmm on dmm.idmatrizprecio = dm.idmatrizprecio
                        inner join mod_logfacturacion.dat_precio dp on dp.idmatrizpreciodualidadmonetaria = dmm.idmatrizpreciodualidadmonetaria
                        where dm.idindicador = v_producto.idindicador and dm.idtipoprecio = v_datosareaventa.idtipoprecioagencia and dm.idestructuracomun = (
                            select conf.idpadrematriz from mod_logfacturacion.conf_configuracionfactura conf where conf.idestructuracomun = p_idestructuracomun limit 1
                        ) and dmm.idmoneda = 9900000000
                    ) LOOP
                        if v_referencia = 0 THEN
                            if v_datosprecioventa.preciopromedio = 1 then
                               v_referencia := v_producto.precio;
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
                              v_producto.idindicador,
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
                    select idmovimiento, v_datosareaventa.idtipoprecioagencia, v_precioventa, v_producto.precio from movmoneda;
                    /*with movimiento as (
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
                          idclasificacion
                        )
                        VALUES (
                          v_idfactura,
                          v_producto.idproducto,
                          v_producto.precio,
                          0,
                          0,
                          0,
                          '-',
                          v_producto.idumedida,
                          v_producto.idelementogasto,
                          v_producto.idclasificacioncontable
                        ) returning idmovimiento, preciocontable
                    ), movmoneda as (
                        insert into mod_logistica.dat_movmoneda 
                        (
                            idmovimiento, idmoneda, precio
                        )
                        select idmovimiento, 9900000000, preciocontable from movimiento
                        returning idmovimiento
                    )
                    INSERT INTO 
                      mod_logfacturacion.dat_prodfactura
                    (
                      idmovimiento,
                      idtipoprecio,
                      preciobase,
                      referencia
                    )
                    select idmovimiento, v_datosareaventa.idtipoprecioagencia, , preciocontable from movimiento;*/
                    update mod_logpuntoventa.dat_pedidoproducto
                    set enproceso = cantidad - coalesce(procesado,0)
                    where idproductopedido = v_producto.idproductopedido;
                    
                end loop;
                INSERT INTO mod_logpuntoventa.dat_pedidodocumento
                (
                  idpedido,iddocumento,tipo
                )
                VALUES(v_pedidos.idpedidotienda, v_idfactura, 2);
                /*update mod_logpuntoventa.dat_pedidotienda
                set estado = 3 where idpedidotienda = v_pedidos.idpedidotienda;*/
            end loop;
        end if;
    	
    end loop;  
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
RETURNS NULL ON NULL INPUT
SECURITY INVOKER
COST 100;

ALTER FUNCTION mod_logpuntoventa.f_procesarpedidostienda (p_idusuario numeric, p_idejercicio numeric, p_idperiodo numeric, p_idestructuracomun numeric, p_areaventa numeric)
  OWNER TO zeolides;
  
/*Generar Despacho*/

CREATE OR REPLACE FUNCTION mod_logfacturacion.f_generardespachotienda (
  p_idusuario numeric,
  p_idestructuracomun numeric,
  p_iddeposito numeric,
  p_destinos varchar
)
RETURNS numeric AS
$body$
DECLARE
  v_facturas record;
  v_iddespacho numeric;
  v_countproductos numeric;
  v_centroentrega record;
BEGIN
	--Inicializando despacho
    for v_centroentrega in 
    (select DISTINCT cent.idestructura, (dest.codigo || ' ' || dest.denominacion) as estructura 
			from mod_logpuntoventa.dat_centroentregaalmacen cent
            inner join mod_estructuracomp.v_dametodasestructuras dest on dest.idestructura = cent.idestructura
			where cent.idestructura = any(cast(p_destinos as NUMERIC[]))
    ) LOOP
    	select count(DISTINCT pp.idindicador) into v_countproductos
        from mod_logpuntoventa.dat_pedidoproducto pp
        where pp.idpedidotienda in (
        	select pd.idpedido from mod_logistica.dat_documento dd
            inner join mod_logfacturacion.dat_docfactura df on df.idfactura = dd.iddocumento
            inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.iddocumento = dd.iddocumento
            inner join mod_logpuntoventa.dat_pedidotienda pt on pt.idpedidotienda = pd.idpedido
            inner join mod_logpuntoventa.dat_areaventa av on av.idareaventa = pt.idareaventa
            left join mod_logfacturacion.dat_despachofactura desp on desp.idfactura = dd.iddocumento
            where av.idestructuraop = p_iddeposito and dd.estado = 1 and pd.tipo = 2 and desp.iddespachotienda is null and pt.id_state in (
                select ar.id_state from mod_logpuntoventa.dat_almacenregion ar
                inner join mod_logpuntoventa.dat_centroentregaalmacen cea on cea.iddeposito = ar.idestructura
                where cea.idestructura = v_centroentrega.idestructura
            )
        ) and (coalesce(pp.enproceso,0)-coalesce(pp.devolver,0)-coalesce(pp.devuelto,0)) > 0;
        if v_countproductos > 0 then 
            INSERT INTO 
              mod_logfacturacion.dat_despachotienda
            (
              nrodespacho,
              nroreferencia,
              fecha,
              idestructuracomun,
              iddeposito,
              idusuario,
              idcentroentrega,
              centroentrega
            )
            VALUES (
            (COALESCE((
                    select max(des.nrodespacho) from mod_logfacturacion.dat_despachotienda des 
                    where des.iddeposito = p_iddeposito
                  ),0)+1),
              (COALESCE((
                    select max(des.nroreferencia) from mod_logfacturacion.dat_despachotienda des 
                    where des.iddeposito = p_iddeposito
                  ),0)+1),
              now(),
              p_idestructuracomun,
              p_iddeposito,
              p_idusuario,
              v_centroentrega.idestructura,
              v_centroentrega.estructura
            ) returning iddespachotienda into v_iddespacho;
            
            INSERT INTO 
              mod_logfacturacion.dat_despachoproducto
            (
              idproducto, 	
              idindicador,
              iddespachotienda,
              cantidad,
              despachado
            )
            select DISTINCT pp.idproducto, pp.idindicador, v_iddespacho, sum(pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) as cantidad, 0
            from mod_logpuntoventa.dat_pedidoproducto pp
            where pp.idpedidotienda in (
                select pd.idpedido from mod_logistica.dat_documento dd
                inner join mod_logfacturacion.dat_docfactura df on df.idfactura = dd.iddocumento
                inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.iddocumento = dd.iddocumento
                inner join mod_logpuntoventa.dat_pedidotienda pt on pt.idpedidotienda = pd.idpedido
                inner join mod_logpuntoventa.dat_areaventa av on av.idareaventa = pt.idareaventa
                left join mod_logfacturacion.dat_despachofactura desp on desp.idfactura = dd.iddocumento
                where av.idestructuraop = p_iddeposito and dd.estado = 1 and pd.tipo = 2 and desp.iddespachotienda is null and pt.id_state in (
                    select ar.id_state from mod_logpuntoventa.dat_almacenregion ar
                    inner join mod_logpuntoventa.dat_centroentregaalmacen cea on cea.iddeposito = ar.idestructura
                    where cea.idestructura = v_centroentrega.idestructura
                )
            ) and (coalesce(pp.enproceso,0)-coalesce(pp.devolver,0)-coalesce(pp.devuelto,0)) > 0 
            group by pp.idproducto,pp.idindicador;
    		
        
        for v_facturas in (
            select dd.* from mod_logistica.dat_documento dd
            inner join mod_logfacturacion.dat_docfactura df on df.idfactura = dd.iddocumento
            inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.iddocumento = dd.iddocumento
            inner join mod_logpuntoventa.dat_pedidotienda pt on pt.idpedidotienda = pd.idpedido
            inner join mod_logpuntoventa.dat_areaventa av on av.idareaventa = pt.idareaventa
            left join mod_logfacturacion.dat_despachofactura desp on desp.idfactura = dd.iddocumento
            where av.idestructuraop = p_iddeposito and dd.estado = 1 and pd.tipo = 2 and desp.iddespachotienda is null
            and pt.id_state in (
                select ar.id_state from mod_logpuntoventa.dat_almacenregion ar
                inner join mod_logpuntoventa.dat_centroentregaalmacen cea on cea.iddeposito = ar.idestructura
                where cea.idestructura = v_centroentrega.idestructura
            )
        ) loop
            INSERT INTO 
              mod_logfacturacion.dat_despachofactura
            (
              iddespachotienda,
              idfactura
            )
            VALUES (
              v_iddespacho,
              v_facturas.iddocumento
            );
        end loop;
       end if;
    end loop;
   return v_iddespacho;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
RETURNS NULL ON NULL INPUT
SECURITY INVOKER
COST 100;

ALTER FUNCTION mod_logfacturacion.f_generardespachotienda (p_idusuario numeric, p_idestructuracomun numeric, p_iddeposito numeric, p_destinos varchar)
  OWNER TO zeolides;
  
/*Aprobar despacho tienda*/

CREATE OR REPLACE FUNCTION mod_logfacturacion.f_aprobardespachotienda (
  p_iddespacho numeric,
  p_idusuario numeric
)
RETURNS void AS
$body$
DECLARE
  v_facturas record;
  v_iddespacho numeric;
  v_cronologia numeric;
  v_fechafacturacion date;
  
  v_iddocRecep numeric;
  v_idrecepcion numeric;
  v_idespecialidad numeric;
  v_idcentroentrega numeric;
  v_idoperacionrecepcion numeric;
  v_idperiodo record;
  v_fecharecepcion date;
  v_depositoentrega numeric;
  v_nrofactura varchar;
  v_datosproducto record;
  v_datosmov record;
  v_productos record;
  v_iddocTV numeric;
  v_idestructuracomun numeric;
  v_datosareaventa record;
BEGIN
		CREATE TEMPORARY TABLE tem_despachocmpto (
        iddespachoproducto NUMERIC(19,0),
        cantidad NUMERIC(25,6)) ON COMMIT DROP;
        insert into tem_despachocmpto(iddespachoproducto, cantidad)
        (select iddespachoproducto, despachado from mod_logfacturacion.dat_despachoproducto where iddespachotienda = p_iddespacho);
        
        select dt.idestructuracomun into v_idestructuracomun from mod_logfacturacion.dat_despachotienda dt
        where dt.iddespachotienda = p_iddespacho limit 1;
        
        v_fechafacturacion := (select df.fecha from mod_datosmaestros.dat_fecha df
        inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = df.idestructurasubsist
        where des.idsubsistema = 13 and des.idestructuracomun = v_idestructuracomun limit 1);
        
        
        v_iddocTV := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
        inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
        inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
        where ndp.abreviatura = 'transTiendaLog' and des.idestructuracomun = v_idestructuracomun limit 1);
        
	    for v_facturas in (
        	select df.*, ff.idcliente, ff.idestructuracomun, pt.nropedido, pt.idareaventa 
            from mod_logfacturacion.dat_despachofactura df
            inner join mod_logfacturacion.dat_docfactura ff on ff.idfactura = df.idfactura
            inner join mod_logpuntoventa.dat_pedidodocumento dpd on dpd.iddocumento = ff.idfactura and dpd.tipo = 2
            inner join mod_logpuntoventa.dat_pedidotienda pt on pt.idpedidotienda = dpd.idpedido
            where df.iddespachotienda = p_iddespacho
        ) loop
            select da.* into v_datosareaventa from mod_logpuntoventa.dat_areaventa da where da.idareaventa = v_facturas.idareaventa;
        	v_cronologia := (select max(dd.cronologia) from mod_logistica.dat_documento dd);
            
            update mod_logistica.dat_documento as d
            set estado = 4, fechacontable = v_fechafacturacion,
            aprobadopor = p_idusuario,
            cronologia = v_cronologia + 1,
            nrodoc = (COALESCE((
              select max(dd.nrodoc) from mod_logistica.dat_documento dd where dd.iddoc = d.iddoc
              and dd.idejercicio = d.idejercicio and dd.idestructuracomun = d.idestructuracomun
            ),0)+1)
            where iddocumento = v_facturas.idfactura;
             
            update mod_logfacturacion.dat_docfactura as df
            set nrofactura = (COALESCE((
              select max(dff.nrofactura) from mod_logfacturacion.dat_docfactura dff 
              where dff.iddoc = df.iddoc and dff.idejercicio = df.idejercicio and dff.idestructuracomun = df.idestructuracomun
            ),0)+1),
            fechavencimiento = v_fechafacturacion + CAST(df.dias||' days' AS INTERVAL)
            where idfactura = v_facturas.idfactura returning nrofactura into v_nrofactura;
        
        	update mod_logistica.dat_movimiento as mov
            set cantidad = (case when tempdesp.cantidad >= (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) 
            then (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) else tempdesp.cantidad end),
            importecontable = dp.precio*(case when tempdesp.cantidad >= (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0))
             then (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) else tempdesp.cantidad end),
            preciocontable = dp.precio,
            existenciaactual = dp.cantidad-(case when tempdesp.cantidad >= (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) 
            then (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) else tempdesp.cantidad end),
            preciopromedio = (case when (dp.cantidad-(case when tempdesp.cantidad >= (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0))
             then (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) else tempdesp.cantidad end)) > 0 
                then (round(dp.importe - (dp.precio*(case when tempdesp.cantidad >= (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0))
                then (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) else tempdesp.cantidad end)),2))/(dp.cantidad-(case when tempdesp.cantidad >= (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0))
                then (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) else tempdesp.cantidad end))  
            else 0 end),
            importetotal = (case when (dp.cantidad-(case when tempdesp.cantidad >= (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) 
            then (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) else tempdesp.cantidad end)) > 0 
                  then (round(dp.importe - (dp.precio*(case when tempdesp.cantidad >= (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0))
                  then (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) else tempdesp.cantidad end)), 2) )
            else 0 end),
            idclasificacion = dp.idclasificacioncontable
            from mod_logistica.dat_producto dp
            inner join mod_logfacturacion.dat_despachoproducto desp on desp.idproducto = dp.idproducto 
            inner join tem_despachocmpto tempdesp on tempdesp.iddespachoproducto = desp.iddespachoproducto
            inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.iddocumento = v_facturas.idfactura
            inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idpedidotienda = pd.idpedido and pp.idproducto = dp.idproducto
            where mov.iddocumento = v_facturas.idfactura and dp.idproducto = mov.idproducto;
            
            update mod_logistica.dat_movimiento set cronologia = v_cronologia where iddocumento = v_facturas.idfactura;
            
            update mod_logistica.dat_producto as dp
            set cantidad = dp.cantidad-(case when tempdesp.cantidad >= (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0))
             then (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) else tempdesp.cantidad end),
            precio = (case when (dp.cantidad-(case when tempdesp.cantidad >= (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0))
             then (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) else tempdesp.cantidad end)) > 0 
                then (round(dp.importe - (dp.precio*(case when tempdesp.cantidad >= (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0))
                then (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) else tempdesp.cantidad end)),2))/(dp.cantidad-(case when tempdesp.cantidad >= (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) then (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) else tempdesp.cantidad end))  
            else 0 end),
            cronologia = v_cronologia,
            importe = (case when (dp.cantidad-(case when tempdesp.cantidad >= (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) then (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) else tempdesp.cantidad end)) > 0 
                  then (round(dp.importe - (dp.precio*(case when tempdesp.cantidad >= (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) then (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) else tempdesp.cantidad end)), 2) )
            else 0 end)
            from mod_logistica.dat_movimiento mov
            inner join mod_logistica.dat_producto dp1 on dp1.idproducto = mov.idproducto
            inner join mod_logfacturacion.dat_despachoproducto desp on desp.idproducto = dp1.idproducto 
            inner join tem_despachocmpto tempdesp on tempdesp.iddespachoproducto = desp.iddespachoproducto
            inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.iddocumento = v_facturas.idfactura
            inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idpedidotienda = pd.idpedido and pp.idproducto = dp1.idproducto
            where mov.iddocumento = v_facturas.idfactura and dp.idproducto = mov.idproducto;
            
            PERFORM mod_logpuntoventa.f_actualizardisponibletienda(v_iddocTV, v_facturas.idfactura);
			PERFORM mod_logpuntoventa.f_actualizarprecioventa(v_facturas.idfactura, v_datosareaventa.idtipoprecioagencia);
            
            update mod_logdistribucion.dat_prodordencmpto as prod
            set entregado = entregado + (case when tempdesp.cantidad >= (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0))
             then (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) else tempdesp.cantidad end),
            pendiente = pendiente - (case when tempdesp.cantidad >= (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) then (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) else tempdesp.cantidad end)
            from mod_logistica.dat_producto dp
            inner join mod_logfacturacion.dat_despachoproducto desp on desp.idproducto = dp.idproducto 
            inner join tem_despachocmpto tempdesp on tempdesp.iddespachoproducto = desp.iddespachoproducto
            inner join mod_logistica.dat_movimiento mov on mov.idproducto = dp.idproducto
            inner join mod_logistica.dat_documentocliente ddc on ddc.iddocumento = mov.iddocumento
            inner join mod_logistica.dat_documentopadre dpa on dpa.iddocumento = mov.iddocumento
            inner join mod_logdistribucion.dat_prodorden dprod on dprod.idorden = dpa.idpadre and dprod.idproducto = mov.idproducto
            inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.iddocumento = v_facturas.idfactura
            inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idpedidotienda = pd.idpedido and pp.idproducto = dp.idproducto
            where mov.iddocumento = v_facturas.idfactura and dp.idproducto = mov.idproducto and tempdesp.iddespachoproducto = desp.iddespachoproducto
            and dprod.idcliente = ddc.idcliente and prod.idprodorden = dprod.idprodorden;
            
            --insertar movimientos de ubicacion
            
            --fin insertar movimientos ubicacion          
            
            update tem_despachocmpto as tempdesp
            set cantidad = tempdesp.cantidad - (case when tempdesp.cantidad >= (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) 
            then (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) else tempdesp.cantidad end)
            from mod_logistica.dat_producto dp
            inner join mod_logfacturacion.dat_despachoproducto desp on desp.idproducto = dp.idproducto 
            inner join mod_logistica.dat_movimiento mov on mov.idproducto = dp.idproducto
            inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.iddocumento = v_facturas.idfactura
            inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idpedidotienda = pd.idpedido and pp.idproducto = dp.idproducto
            where mov.iddocumento = v_facturas.idfactura and dp.idproducto = mov.idproducto and tempdesp.iddespachoproducto = desp.iddespachoproducto;
        	
            --creando recepcion en el destino
            v_idcentroentrega := (select nc.idestructura from mod_datosmaestros.nom_clientesproveedor nc
          	where nc.idclientesproveedores = v_facturas.idcliente limit 1);
            
            v_depositoentrega := (select dce.iddeposito from mod_logpuntoventa.dat_centroentregaalmacen dce
            where dce.idestructura = v_idcentroentrega and dce.idareaventa = v_facturas.idareaventa);
            
            v_iddocRecep := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
            inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
            inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
            where ndp.abreviatura = 'recepcionLog' and des.idestructuracomun = v_idcentroentrega limit 1);
             
            v_idespecialidad := (select cue.idespecialidad from mod_logistica.conf_usuarioespecialidad cue 
                        where cue.idusuario = p_idusuario limit 1);
            
            v_idperiodo = mod_logistica.f_obtenerejercicioactivo(10, v_idcentroentrega);            
                        
            v_fecharecepcion := (select df.fecha from mod_datosmaestros.dat_fecha df
            inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = df.idestructurasubsist
            where des.idsubsistema = 10 and des.idestructuracomun = v_idcentroentrega limit 1);
            
            v_idoperacionrecepcion := (select CAST(vg.valor as NUMERIC) from mod_logistica.nom_variableglobal vg 
            where vg.nombre = 'OPRE_REC_FAC' limit 1);
            
            INSERT INTO mod_logistica.dat_documento
            (
              iddoc,anno,fechacontable,observaciones,cronologia,version,idusuario,estado,idejercicio,
              idestructuracomun,idperiodo,numeroref,idespecialidad,idoperacion
            )
            VALUES (
              v_iddocRecep, date_part('year', CAST(to_char(v_fecharecepcion, 'DD/MM/YYYY HH24:MI') as timestamp)),
              v_fecharecepcion,'Recepcion generada de tienda virtual. Pedido '||v_facturas.nropedido,0,1,p_idusuario,1,v_idperiodo.idejercicioactual,
              v_depositoentrega, v_idperiodo.idperiodoactual,
              (COALESCE((
                select max(dd.numeroref) from mod_logistica.dat_documento dd where dd.iddoc = v_iddocRecep
                and dd.idejercicio = v_idperiodo.idejercicioactual and dd.idestructuracomun = v_depositoentrega
              ),0)+1),v_idespecialidad, v_idoperacionrecepcion
            ) returning iddocumento into v_idrecepcion;
            INSERT INTO 
              mod_loginventario.dat_recepcion
            (
              iddocumento,nrodocorigen,fechadocorigen
            )
            VALUES (
              v_idrecepcion, v_nrofactura, v_fechafacturacion
            );
            INSERT INTO mod_logistica.dat_documentocliente
            (
              iddocumento,idcliente,tipocliente
            )
            VALUES (v_idrecepcion,(select nc.idclientesproveedores from mod_datosmaestros.nom_clientesproveedor nc
          	where nc.idestructura = v_facturas.idestructuracomun limit 1),1);
            INSERT INTO mod_logpuntoventa.dat_pedidodocumento
            (
              idpedido,iddocumento,tipo
            )
            (select pdd.idpedido, v_idrecepcion, 3 
            from mod_logpuntoventa.dat_pedidotienda pt
            inner join mod_logpuntoventa.dat_pedidodocumento pdd on pdd.idpedido = pt.idpedidotienda
            where pdd.iddocumento = v_facturas.idfactura
            );
            INSERT INTO 
              mod_logistica.dat_documentopadre
            (
              iddocumento,idpadre
            )
            values (v_idrecepcion, v_facturas.idfactura); 
            
            for v_productos in (
            	select dm.preciocontable, dmm.precio as preciofactura, dm.cantidad,dm.idunidadmedida, dp.*, pp.idproductopedido 
                from mod_logistica.dat_movimiento dm
                inner join mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = dm.idmovimiento and dmm.idmoneda = 9900000000
                inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
                inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idproducto = dp.idproducto
                inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.iddocumento = dm.iddocumento and pp.idpedidotienda = pd.idpedido
                where dm.iddocumento = v_facturas.idfactura
            ) loop
            	--buscar indicador para crear tarjeta si no existe
            	select dpd.* into v_datosproducto from mod_logistica.dat_producto dpd
                where dpd.idestructura = v_depositoentrega and dpd.idindicador = v_productos.idindicador;
            	--insertar movimientos de la recepcion
                if v_datosproducto.idproducto is not null then
                	select mov.* into v_datosmov from mod_logistica.dat_movimiento mov
                    where mov.iddocumento = v_idrecepcion and mov.idproducto = v_datosproducto.idproducto;
                	if v_datosmov.idmovimiento is null then
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
                          idclasificacion
                        )
                        VALUES (
                          v_idrecepcion,
                          v_datosproducto.idproducto,
                          v_productos.preciofactura,
                          0,
                          v_productos.cantidad,
                          0,
                          '+',
                          v_datosproducto.idumedida,
                          v_datosproducto.idelementogasto,
                          v_datosproducto.idclasificacioncontable
                        ) returning idmovimiento, cantidad
                        )
                        INSERT INTO 
                          mod_loginventario.dat_movrecepcion
                        (
                          idmovimiento,
                          cantidad
                        )
                        select idmovimiento, cantidad from movimiento;
                    else
                    	update mod_logistica.dat_movimiento
                        set cantidad = cantidad + v_productos.cantidad,
                        preciocontable = (round(preciocontable*cantidad,2)+round(v_productos.preciofactura*v_productos.cantidad,2))/(cantidad+v_productos.cantidad)
                        where idmovimiento = v_datosmov.idmovimiento;
                        
                        update mod_loginventario.dat_movrecepcion
                        set cantidad = cantidad + v_productos.cantidad
                        where idmovimiento = v_datosmov.idmovimiento;
                    end if; 
                	
                else
                  with producto as (
                  	INSERT INTO 
                      mod_logistica.dat_producto
                    (
                      idestructura,
                      idumedida,
                      idindicador,
                      idclasificacioncontable,
                      cronologia,
                      cantidad,
                      importe,
                      idestructuracomun,
                      idmarca,
                      idmodelo,
                      idelementogasto
                    )
                    VALUES (
                      v_depositoentrega,
                      v_productos.idunidadmedida,
                      v_productos.idindicador,
                      v_productos.idclasificacioncontable,
                      0,
                      0,
                      0,
                      v_idcentroentrega,
                      v_productos.idmarca,
                      v_productos.idmodelo,
                      v_productos.idelementogasto
                    ) returning idproducto                      
                  ), movimiento as (
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
                        idclasificacion
                      )
                      select v_idrecepcion, idproducto, v_productos.preciofactura,0,
                      v_productos.cantidad, 0, '+', v_datosproducto.idumedida, v_datosproducto.idelementogasto,
                      v_datosproducto.idclasificacioncontable from producto
                      returning idmovimiento, cantidad
                  )
                  INSERT INTO 
                    mod_loginventario.dat_movrecepcion
                  (
                    idmovimiento,
                    cantidad
                  )
                  select idmovimiento, cantidad from movimiento;
                end if;
                update mod_logpuntoventa.dat_pedidoproducto as ppp
                set enproceso = ppp.enproceso - v_productos.cantidad,
                procesado = procesado + v_productos.cantidad
                where ppp.idproductopedido = v_productos.idproductopedido;
            end loop;
            
        end loop;
        update mod_logfacturacion.dat_despachotienda 
        set estado = 3 where iddespachotienda = p_iddespacho;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
RETURNS NULL ON NULL INPUT
SECURITY INVOKER
COST 100;

ALTER FUNCTION mod_logfacturacion.f_aprobardespachotienda (p_iddespacho numeric, p_idusuario numeric)
  OWNER TO zeolides;  