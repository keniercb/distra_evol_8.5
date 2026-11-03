ALTER TABLE mod_logpuntoventa.dat_areaventa
  ADD COLUMN IF NOT EXISTS tipoventa NUMERIC(1,0);

CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_procesarpedidosfecha (
  p_idareaventa numeric,
  p_idestructuracomun numeric,
  p_idusuario numeric
)
RETURNS void AS
$body$
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
  v_pedidostienda record;
  v_cronologia numeric;
  v_codigodeposito varchar;
  v_importe numeric;
  v_tipoventa numeric;
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
        	select pt.* from mod_logpuntoventa.dat_pedidotienda pt
            left join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pt.idpedidotienda and pd.tipo = 4 
            where pt.idareaventa = p_idareaventa and pt.fechapedido <= v_fechafacturacion and pt.estado = 2
            and pd.idpedidodocumento is null
        ) LOOP
        	v_cronologia := v_cronologia + 1;
        	v_idpersona := (
                select vc.idventacliente from mod_logpuntoventa.dat_ventacliente vc 
                where vc.numeroidentidad = v_pedidostienda.cibeneficiario
            );
            
            if v_idpersona is null then
                
                INSERT INTO 
                  mod_logpuntoventa.dat_ventacliente
                (
                  numeroidentidad,
                  nombre,
                  telefono,
                  direccion/*,
                  correo,
                  fechainscripcion,
                  idprovincia,
                  provincia,
                  idmunicipio,
                  municipio,
                  tipo,
                  idexterno*/
                )
                VALUES (
                  v_pedidostienda.cibeneficiario,
                  v_pedidostienda.beneficiario,
                  v_pedidostienda.telbeneficiario,
                  v_pedidostienda.dirbeneficiario
                ) returning idventacliente into v_idpersona;
            end if;
            
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
                    idpersona,
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
                    v_idpersona,
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
                    from documento returning idventas),
                    
                ventaorden as (
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
                )
                INSERT INTO 
                    mod_logistica.dat_documentocliente
                  (
                    iddocumento,idcliente,tipocliente,idcondicionpago
                  )
                  select iddocumento, v_configtienda.idcliente, 1, 83 from documento
                  RETURNING iddocumento into v_iddocumento;  
                
                for v_productos in (
                        select dp.precio, dp.cantidad as existencia, pp.cantidad as cantidadpedido,dp.idumedida, dp.*, pp.idproductopedido, pp.precio as preciopedido
                        from mod_logistica.dat_producto dp
                        inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idproducto = dp.idproducto
                        where pp.idpedidotienda = v_pedidostienda.idpedidotienda
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
                update mod_logpuntoventa.dat_pedidotienda set estado = 5
                where idpedidotienda = v_pedidostienda.idpedidotienda;
        end loop;
    ELSE
    --generando comprobante de venta resumen de los pedidos pendientes a procesar
    /*v_idpersona := (
                select vc.idventacliente from mod_logpuntoventa.dat_ventacliente vc 
                where vc.numeroidentidad = '-'
            );*/
    v_cronologia := v_cronologia + 1;   
    v_importe := 0;
    /*if v_idpersona is null then
                
        INSERT INTO 
          mod_logpuntoventa.dat_ventacliente
        (
          numeroidentidad,
          nombre,
          telefono,
          direccion
        )
        VALUES (
          '-',
          '-',
          '-',
          ''
        ) returning idventacliente into v_idpersona;
    end if;*/
    
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
      select iddocumento, v_configtienda.idcliente, 1, 83 from documento
      RETURNING iddocumento into v_iddocumento;  
    
    
    for v_productos in (
        select DISTINCT dp.idproducto, dp.precio, dp.cantidad as existencia, sum(pp.cantidad) as cantidadpedido,dp.idumedida, pp.precio as preciopedido,
        dp.idelementogasto, dp.idclasificacioncontable, dp.importe
        from mod_logistica.dat_producto dp
        inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idproducto = dp.idproducto
        where pp.idpedidotienda in (
        	select pt.idpedidotienda from mod_logpuntoventa.dat_pedidotienda pt
            left join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pt.idpedidotienda and pd.tipo = 4 
            where pt.idareaventa = p_idareaventa and pt.fechapedido <= v_fechafacturacion and pt.estado = 2
            and pd.idpedidodocumento is null
        ) group by dp.idproducto,pp.precio
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
	update mod_logpuntoventa.dat_ventas set importe = v_importe where idventas = v_iddocumento;
    
    update mod_logpuntoventa.dat_pedidotienda set estado = 5
    where idpedidotienda in (
    	select pt.idpedidotienda from mod_logpuntoventa.dat_pedidotienda pt
            left join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pt.idpedidotienda and pd.tipo = 4 
            where pt.idareaventa = p_idareaventa and pt.fechapedido <= v_fechafacturacion and pt.estado = 2
            and pd.idpedidodocumento is null
    );
    
    INSERT INTO mod_logpuntoventa.dat_pedidodocumento
        (
          idpedido,iddocumento,tipo
        )
        select pt.idpedidotienda, v_iddocumento, 4 from mod_logpuntoventa.dat_pedidotienda pt
            left join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pt.idpedidotienda and pd.tipo = 4 
            where pt.idareaventa = p_idareaventa and pt.fechapedido <= v_fechafacturacion and pt.estado = 2
            and pd.idpedidodocumento is null;
    
    end if;
    
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
RETURNS NULL ON NULL INPUT
SECURITY INVOKER
COST 100;

ALTER FUNCTION mod_logpuntoventa.f_procesarpedidosfecha (p_idareaventa numeric, p_idestructuracomun numeric, p_idusuario numeric)
  OWNER TO zeolides;