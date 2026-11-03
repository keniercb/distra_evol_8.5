-- FUNCTION: mod_logpuntoventa.f_procesarpedidosfecha(numeric, numeric, numeric)

-- DROP FUNCTION IF EXISTS mod_logpuntoventa.f_procesarpedidosfecha(numeric, numeric, numeric);

CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_procesarpedidosfecha(
	p_idareaventa numeric,
	p_idestructuracomun numeric,
	p_idusuario numeric)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
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
  v_pedidostienda record;
  v_cronologia numeric;
  v_codigodeposito varchar;
  v_importe numeric;
  v_tipoventa numeric;
  v_cantProdPedido numeric;
  v_idcomprobante numeric;
BEGIN
  CREATE TEMPORARY TABLE tem_pedidosprocesar(
      idpedidotienda NUMERIC(19,0)) ON COMMIT DROP;

  CREATE TEMPORARY TABLE tem_productossinexistencia(
      idproducto NUMERIC(19,0)) ON COMMIT DROP; v_iddoc :=(
    select ddp.iddoc
    from mod_datosmaestros.dat_documentoprim ddp
         inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
         inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
    where ndp.abreviatura = 'compventaLog' and
          des.idestructuracomun = p_idestructuracomun
    limit 1); v_idespecialidad :=(
      select cue.idespecialidad
      from mod_logistica.conf_usuarioespecialidad cue
      where cue.idusuario = p_idusuario
      limit 1);

      v_idperiodo = mod_logistica.f_obtenerejercicioactivo(13, p_idestructuracomun);
      select da.*
      into v_configtienda
      from mod_logpuntoventa.dat_areaventa da
      where da.idareaventa = p_idareaventa
      limit 1;
	  
	  select case when
		(select count(*) from mod_logpuntoventa.dat_areaventa da where da.idareaventa = p_idareaventa 
		 and da.idnomoperaciones = any(cast((select regexp_split_to_array(
	replace(vg.valor, '''', '')
	, ',') from mod_logistica.nom_variableglobal vg where vg.nombre = 'OPER_NO_CONTABILIZA')as numeric[])) limit 1) > 0
	then -1 else null end into v_idcomprobante;

      v_codigodeposito := (
      select est.codigo
      from mod_estructuracomp.v_dametodasestructuras est
      where est.idestructura = v_configtienda.idestructuraop);

      v_fechafacturacion := (
      select da.fecha
      from mod_logistica.dat_estadoalmacen da
      where da.iddeposito = v_configtienda.idestructuraop
      limit 1);
      if v_fechafacturacion is null then
        v_fechafacturacion := (
        select df.fecha
        from mod_datosmaestros.dat_fecha df
             inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = df.idestructurasubsist
        where des.idsubsistema = 13 and
              des.idestructuracomun = p_idestructuracomun
        limit 1);
      end if;
      --insertando pedidos que tienen los productos con existencias a procesar

      insert into tem_productossinexistencia(idproducto) (
                                                           select distinct pp.idproducto /*, sum(pp.cantidad) as pedida*/
                                                           from mod_logpuntoventa.dat_pedidoproducto pp
                                                           where pp.idpedidotienda in (
                                                                                        select pt.idpedidotienda
                                                                                        from mod_logpuntoventa.dat_pedidotienda pt
                                                                                             left join mod_logpuntoventa.dat_pedidodocumento pd on
                                                                                               pd.idpedido = pt.idpedidotienda and pd.tipo = 4
                                                                                        where pt.idareaventa = p_idareaventa and
                                                                                              pt.fechapedido <= v_fechafacturacion and
                                                                                              pt.estado = 2 and
                                                                                              pd.idpedidodocumento is null
                                                                 )
                                                           group by pp.idproducto
                                                           having sum(pp.cantidad) >
                                                                  (
                                                                    select dp.cantidad
                                                                    from mod_logistica.dat_producto dp
                                                                    where dp.idproducto = pp.idproducto
                                                                  )
                  );
      insert into tem_pedidosprocesar(idpedidotienda) (
                                                        select pt.idpedidotienda
                                                        from mod_logpuntoventa.dat_pedidotienda pt
                                                             left join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pt.idpedidotienda and
                                                               pd.tipo = 4
                                                        where pt.idareaventa = p_idareaventa and
                                                              pt.fechapedido <= v_fechafacturacion and
                                                              pt.estado = 2 and
                                                              pd.idpedidodocumento is null and
                                                              pt.idpedidotienda not in (
                                                                                         select distinct pt1.idpedidotienda
                                                                                         from mod_logpuntoventa.dat_pedidotienda pt1
                                                                                              inner join mod_logpuntoventa.dat_pedidoproducto pp1 on
                                                                                                pp1.idpedidotienda = pt1.idpedidotienda
                                                                                              left join mod_logpuntoventa.dat_pedidodocumento pd1 on
                                                                                                pd1.idpedido = pt1.idpedidotienda and pd.tipo = 4
                                                                                         where pt1.idareaventa = p_idareaventa and
                                                                                               pt1.fechapedido <= v_fechafacturacion and
                                                                                               pt1.estado = 2 and
                                                                                               pp1.idproducto in (
                                                                                                                   select tp.idproducto
                                                                                                                   from tem_productossinexistencia tp
                                                                                               )
                                                              )
                  );
      --generando comprobante de venta por cada pedido

      select max(d.cronologia)
      into v_cronologia
      from mod_logistica.dat_documento d;
      if v_configtienda.tipoventa = 1 then
        for v_pedidostienda in (
        select pt.*
        from mod_logpuntoventa.dat_pedidotienda pt
             inner join tem_pedidosprocesar tpp on tpp.idpedidotienda = pt.idpedidotienda
             left join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pt.idpedidotienda and pd.tipo = 4
        where pt.idareaventa = p_idareaventa and
              pt.fechapedido <= v_fechafacturacion and
              pt.estado = 2 and
              pd.idpedidodocumento is null)
        LOOP
          v_cronologia := v_cronologia + 1;
          v_idpersona := (
          select vc.idventacliente
          from mod_logpuntoventa.dat_ventacliente vc
          where vc.numeroidentidad = v_pedidostienda.cibeneficiario);

          if v_idpersona is null then
            INSERT INTO mod_logpuntoventa.dat_ventacliente(numeroidentidad, nombre, telefono, direccion /*,
                  correo,
                  fechainscripcion,
                  idprovincia,
                  provincia,
                  idmunicipio,
                  municipio,
                  tipo,
                  idexterno*/)
            VALUES (v_pedidostienda.cibeneficiario, v_pedidostienda.beneficiario, v_pedidostienda.telbeneficiario, v_pedidostienda.dirbeneficiario)
              returning idventacliente
            into v_idpersona;
          end if;

          with documento AS (          INSERT INTO mod_logistica.dat_documento(iddoc, anno, fechacontable, observaciones, cronologia, version,
            idusuario, estado, idejercicio, idestructuracomun, idperiodo, numeroref, idespecialidad, idoperacion, nrodoc, aprobadopor, idcomprobante)
          VALUES (v_iddoc, date_part('year', CAST (to_char(v_fechafacturacion, 'DD/MM/YYYY HH24:MI') as timestamp)), v_fechafacturacion,
            'Factura generada automaticamente: Pedido ' || v_pedidostienda.nropedido, v_cronologia, 1, p_idusuario, 4, v_idperiodo.idejercicioactual,
            v_configtienda.idestructuraop, v_idperiodo.idperiodoactual, (COALESCE((
                                                                                    select max(dd.numeroref)
                                                                                    from mod_logistica.dat_documento dd
                                                                                    where dd.iddoc = v_iddoc and
                                                                                          dd.idejercicio = v_idperiodo.idejercicioactual and
                                                                                          dd.idestructuracomun = v_configtienda.idestructuraop
                 ), 0) + 1), 1, v_configtienda.idnomoperaciones, (COALESCE((
                                                                             select max(dd.nrodoc)
                                                                             from mod_logistica.dat_documento dd
                                                                             where dd.iddoc = v_iddoc and
                                                                                   dd.idejercicio = v_idperiodo.idejercicioactual and
                                                                                   dd.idestructuracomun = v_configtienda.idestructuraop
                 ), 0) + 1), p_idusuario, v_idcomprobante) returning iddocumento,
                 iddoc,
                 idejercicio,
                 idestructuracomun,
                 nrodoc),
          venta as (
          INSERT INTO mod_logpuntoventa.dat_ventas(idventas, idpersona, fechaventa, importe,
                      --idcaja,
                      idpago, idareaventa,
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
                      nrofactura)
          select iddocumento,
                 v_idpersona,
                 v_fechafacturacion,
                 (
                   select sum(pp.importe)
                   from mod_logpuntoventa.dat_pedidoproducto pp
                   where pp.idpedidotienda = v_pedidostienda.idpedidotienda
                 ),
                 --?idcaja,
                 v_configtienda.idmodopago,
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
                 nrodoc || '.' || v_codigodeposito || '.' || date_part('year', CAST (to_char(v_fechafacturacion, 'DD/MM/YYYY HH24:MI') as timestamp))
          from documento returning idventas),

          ventaorden as (
          INSERT INTO mod_logpuntoventa.dat_ventaorden(idorden, nroorden,
                      --pago,
                      --envio,
                      fechaorden, estadoorden, idventas, tiendavirtual)
          select v_pedidostienda.idreferencia,
                 v_pedidostienda.nropedido,
                 v_pedidostienda.fechapedido,
                 v_pedidostienda.estado,
                 idventas,
                 2
          from venta),
          documentopedido as (
          INSERT INTO mod_logpuntoventa.dat_pedidodocumento(idpedido, iddocumento, tipo)
          select v_pedidostienda.idpedidotienda,
                 iddocumento,
                 4
          from documento)
          INSERT INTO mod_logistica.dat_documentocliente(iddocumento, idcliente, tipocliente, idcondicionpago)
          select iddocumento,
                 v_configtienda.idcliente,
                 1,
                 v_configtienda.idcondicionpago
          from documento RETURNING iddocumento
          into v_iddocumento;

          for v_productos in (
          select dp.precio,
                 dp.cantidad as existencia,
                 pp.cantidad as cantidadpedido,
                 dp.idumedida,
                 dp.*,
                 pp.idproductopedido,
                 pp.precio as preciopedido
          from mod_logistica.dat_producto dp
               inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idproducto = dp.idproducto
          where pp.idpedidotienda = v_pedidostienda.idpedidotienda)
          loop

            with movimiento as (
            INSERT INTO mod_logistica.dat_movimiento(iddocumento, idproducto, preciocontable, importecontable, cantidad, cronologia, signo,
              idunidadmedida, idelementogasto, idclasificacion, existenciaactual, preciopromedio, importetotal)
            VALUES (v_iddocumento, v_productos.idproducto, v_productos.precio, round(v_productos.cantidadpedido * v_productos.precio, 2),
              v_productos.cantidadpedido, v_cronologia, '-', v_productos.idumedida, v_productos.idelementogasto, v_productos.idclasificacioncontable,
              (v_productos.existencia - v_productos.cantidadpedido), (case
                                                                        when (v_productos.existencia - v_productos.cantidadpedido) > 0 then (round(
                                                                          v_productos.importe -(v_productos.precio * v_productos.cantidadpedido), 2))
                                                                          /(v_productos.existencia - v_productos.cantidadpedido)
                                                                        else 0
                                                                      end), (case
                                                                               when (v_productos.existencia - v_productos.cantidadpedido) > 0 then (
                                                                                 round(v_productos.importe -(v_productos.precio *
                                                                                 v_productos.cantidadpedido), 2))
                                                                               else 0
                                                                             end)) returning idmovimiento,
                   preciocontable,
                   idproducto), movmoneda as (
                            insert into mod_logistica.dat_movmoneda(idmovimiento, idmoneda, precio)
                            select idmovimiento,
                                   v_configtienda.idmoneda,
                                   v_productos.preciopedido
                            from movimiento)/*, cantidadcomp as (
                          INSERT INTO 
                            mod_logistica.dat_cantidadcomprometida
                          (
                            iddocumento,idproducto,idcliente,cantidad,estado
                          ) 
                          select v_iddocumento,idproducto,v_configtienda.idcliente,v_productos.cantidadpedido,1 from movimiento
                          RETURNING iddocumento
                        )*/
                        INSERT INTO mod_logpuntoventa.dat_ventaproducto(idproducto, idventas, cantidad, precio, importetotal)
                        select idproducto,
                               v_iddocumento,
                               v_productos.cantidadpedido,
                               v_productos.preciopedido,
                               round(v_productos.preciopedido * v_productos.cantidadpedido, 2)
                        from movimiento;
                    update mod_logistica.dat_producto as dp
                    set cantidad = dp.cantidad - v_productos.cantidadpedido,
                        precio =(case
                                   when (dp.cantidad - v_productos.cantidadpedido) > 0 then (round(dp.importe -(dp.precio * v_productos.cantidadpedido
                                     ), 2)) /(dp.cantidad - v_productos.cantidadpedido)
                                   else 0
                                 end),
                        cronologia = v_cronologia,
                        importe =(case
                                    when (dp.cantidad - v_productos.cantidadpedido) > 0 then (round(dp.importe -(dp.precio *
                                      v_productos.cantidadpedido), 2))
                                    else 0
                                  end)
                    where dp.idproducto = v_productos.idproducto;
                end loop;
                update mod_logpuntoventa.dat_pedidotienda
                set estado = 5
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
    v_cantProdPedido := (select count(distinct dp.idproducto)
                         from mod_logistica.dat_producto dp
                              inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idproducto = dp.idproducto
                         where pp.idpedidotienda in (
                                                      select pt.idpedidotienda
                                                      from mod_logpuntoventa.dat_pedidotienda pt
                                                           inner join tem_pedidosprocesar tpp on tpp.idpedidotienda = pt.idpedidotienda
                                                           left join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pt.idpedidotienda and
                                                             pd.tipo = 4
                                                      where pt.idareaventa = p_idareaventa and
                                                            pt.fechapedido <= v_fechafacturacion and
                                                            pt.estado = 2 and
                                                            pd.idpedidodocumento is null
                               ));
        
        if v_cantProdPedido > 0 then
            with documento AS (INSERT INTO mod_logistica.dat_documento(iddoc, anno, fechacontable, observaciones, cronologia, version, idusuario,
              estado, idejercicio, idestructuracomun, idperiodo, numeroref, idespecialidad, idoperacion, nrodoc, aprobadopor,idcomprobante)
                               VALUES (v_iddoc, date_part('year', CAST (to_char(v_fechafacturacion, 'DD/MM/YYYY HH24:MI') as timestamp)),
                                 v_fechafacturacion, 'Comprobante de venta reumen', v_cronologia, 1, p_idusuario, 4, v_idperiodo.idejercicioactual,
                                 v_configtienda.idestructuraop, v_idperiodo.idperiodoactual, (COALESCE((
                                                                                                         select max(dd.numeroref)
                                                                                                         from mod_logistica.dat_documento dd
                                                                                                         where dd.iddoc = v_iddoc and
                                                                                                               dd.idejercicio =
                                                                                                                 v_idperiodo.idejercicioactual and
                                                                                                               dd.idestructuracomun =
                                                                                                                 v_configtienda.idestructuraop
                                      ), 0) + 1), 1, v_configtienda.idnomoperaciones, (COALESCE((
                                                                                                  select max(dd.nrodoc)
                                                                                                  from mod_logistica.dat_documento dd
                                                                                                  where dd.iddoc = v_iddoc and
                                                                                                        dd.idejercicio = v_idperiodo.idejercicioactual
  and
                                                                                                        dd.idestructuracomun =
                                                                                                          v_configtienda.idestructuraop
                                      ), 0) + 1), p_idusuario,v_idcomprobante) returning iddocumento,
                                      iddoc,
                                      idejercicio,
                                      idestructuracomun,
                                      nrodoc),
    venta as (
    INSERT INTO mod_logpuntoventa.dat_ventas(idventas,
                --idpersona,
                fechaventa, importe,
                --idcaja,
                idpago, idareaventa,
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
                nrofactura)
    select iddocumento,
           --v_idpersona,
           v_fechafacturacion,
           0,
           --?idcaja,
           v_configtienda.idmodopago,
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
           nrodoc || '.' || v_codigodeposito || '.' || date_part('year', CAST (to_char(v_fechafacturacion, 'DD/MM/YYYY HH24:MI') as timestamp))
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
    INSERT INTO mod_logistica.dat_documentocliente(iddocumento, idcliente, tipocliente, idcondicionpago)
    select iddocumento,
           v_configtienda.idcliente,
           1,
           v_configtienda.idcondicionpago
    from documento RETURNING iddocumento
    into v_iddocumento;  
    
    
    for v_productos in (
        select DISTINCT dp.idproducto,
               dp.precio,
               dp.cantidad as existencia,
               sum(pp.cantidad) as cantidadpedido,
               dp.idumedida,
               round(sum(round(pp.precio*pp.cantidad,2))/sum(pp.cantidad),6) as preciopedido,
               dp.idelementogasto,
               dp.idclasificacioncontable,
               dp.importe
        from mod_logistica.dat_producto dp
             inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idproducto = dp.idproducto
        where pp.idpedidotienda in (
                                     select pt.idpedidotienda
                                     from mod_logpuntoventa.dat_pedidotienda pt
                                          inner join tem_pedidosprocesar tpp on tpp.idpedidotienda = pt.idpedidotienda
                                          left join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pt.idpedidotienda and pd.tipo = 4
                                     where pt.idareaventa = p_idareaventa and
                                           pt.fechapedido <= v_fechafacturacion and
                                           pt.estado = 2 and
                                           pd.idpedidodocumento is null
              )
        group by dp.idproducto) loop
                    
    with movimiento as (
            INSERT INTO mod_logistica.dat_movimiento(iddocumento, idproducto, preciocontable, importecontable, cantidad, cronologia, signo,
              idunidadmedida, idelementogasto, idclasificacion, existenciaactual, preciopromedio, importetotal)
            VALUES (v_iddocumento, v_productos.idproducto, v_productos.precio, round(v_productos.cantidadpedido * v_productos.precio, 2),
              v_productos.cantidadpedido, v_cronologia, '-', v_productos.idumedida, v_productos.idelementogasto, v_productos.idclasificacioncontable,
              (v_productos.existencia - v_productos.cantidadpedido), (case
                                                                        when (v_productos.existencia - v_productos.cantidadpedido) > 0 then (round(
                                                                          v_productos.importe -(v_productos.precio * v_productos.cantidadpedido), 2))
                                                                          /(v_productos.existencia - v_productos.cantidadpedido)
                                                                        else 0
                                                                      end), (case
                                                                               when (v_productos.existencia - v_productos.cantidadpedido) > 0 then (
                                                                                 round(v_productos.importe -(v_productos.precio *
                                                                                 v_productos.cantidadpedido), 2))
                                                                               else 0
                                                                             end)) returning idmovimiento,
                   preciocontable,
                   idproducto), movmoneda as (
            insert into mod_logistica.dat_movmoneda(idmovimiento, idmoneda, precio)
            select idmovimiento,
                   v_configtienda.idmoneda,
                   v_productos.preciopedido
            from movimiento)/*, cantidadcomp as (
          INSERT INTO 
            mod_logistica.dat_cantidadcomprometida
          (
            iddocumento,idproducto,idcliente,cantidad,estado
          ) 
          select v_iddocumento,idproducto,v_configtienda.idcliente,v_productos.cantidadpedido,1 from movimiento
          RETURNING iddocumento
        )*/
        INSERT INTO mod_logpuntoventa.dat_ventaproducto(idproducto, idventas, cantidad, precio, importetotal)
        select idproducto,
               v_iddocumento,
               v_productos.cantidadpedido,
               v_productos.preciopedido,
               round(v_productos.preciopedido * v_productos.cantidadpedido, 2)
        from movimiento;
    update mod_logistica.dat_producto as dp
    set cantidad = dp.cantidad - v_productos.cantidadpedido,
        precio =(case
                   when (dp.cantidad - v_productos.cantidadpedido) > 0 then (round(dp.importe -(dp.precio * v_productos.cantidadpedido), 2)) /(
                     dp.cantidad - v_productos.cantidadpedido)
                   else 0
                 end),
        cronologia = v_cronologia,
        importe =(case
                    when (dp.cantidad - v_productos.cantidadpedido) > 0 then (round(dp.importe -(dp.precio * v_productos.cantidadpedido), 2))
                    else 0
                  end)
    where dp.idproducto = v_productos.idproducto;
    v_importe = v_importe + (round(v_productos.preciopedido*v_productos.cantidadpedido,2));
end loop;
    update mod_logpuntoventa.dat_ventas
    set importe = v_importe
    where idventas = v_iddocumento;
    
    INSERT INTO mod_logpuntoventa.dat_pedidodocumento(idpedido, iddocumento, tipo)
    select pt.idpedidotienda,
           v_iddocumento,
           4
    from mod_logpuntoventa.dat_pedidotienda pt
         inner join tem_pedidosprocesar tpp on tpp.idpedidotienda = pt.idpedidotienda
         left join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pt.idpedidotienda and pd.tipo = 4
    where pt.idareaventa = p_idareaventa and
          pt.fechapedido <= v_fechafacturacion and
          pt.estado = 2 and
          pd.idpedidodocumento is null;
    
    update mod_logpuntoventa.dat_pedidotienda
    set estado = 5
    where idpedidotienda in (
                              select pt.idpedidotienda
                              from tem_pedidosprocesar pt
          );
    
    update mod_logpuntoventa.dat_pedidoproducto
    set procesado = cantidad
    where idpedidotienda in (
                              select pt.idpedidotienda
                              from tem_pedidosprocesar pt
          );
        end if;
    
    INSERT INTO 
      mod_logfarmacia.dat_entregaproducto
    (
      fechaentrega,
      cantidadentregada,
      entregadapor,
      idproductotarjetamedicamento
    )
    (select pt.fechapedido, pp.cantidad, 'TPV',q.idproductotarjetamedicamento
    from mod_logpuntoventa.dat_pedidotienda pt
    	 inner join mod_logpuntoventa.dat_areaventa av on av.idareaventa = pt.idareaventa
         inner join tem_pedidosprocesar ptt on ptt.idpedidotienda = pt.idpedidotienda
         inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idpedidotienda = pt.idpedidotienda
	 	 inner join mod_logistica.dat_producto dp on dp.idproducto = pp.idproducto
         inner join (select vc.numeroidentidad, ptm.idproductotarjetamedicamento, ptm.idindicador, dd.idestructuracomun
                     from mod_logfarmacia.dat_productotarjetamedicamento ptm
                    --inner join mod_logfarmacia.conf_cuadrobasico cb on cb.idcuadrobasico = ptm.idcuadrobasico
                    --inner join mod_logfarmacia.conf_anno ca on ca.idanno = cb.idanno
                    inner join mod_logfarmacia.dat_tarjetamedicamento tm on tm.idtarjetamedicamento = ptm.idtarjetamedicamento
                    inner join mod_logistica.dat_documento dd on dd.iddocumento = tm.idtarjetamedicamento
                    inner join mod_logpuntoventa.dat_ventacliente vc on vc.idventacliente = tm.idpaciente
                    where /*ca.activo = 1 and*/ dd.estado = 3) q on q.numeroidentidad = pt.cibeneficiario and q.idestructuracomun = av.idestructuracomun and q.idindicador = dp.idindicador
    where pt.idareaventa = p_idareaventa and
          pt.fechapedido <= v_fechafacturacion);
    
    
    end if;
    
END;
$BODY$;

ALTER FUNCTION mod_logpuntoventa.f_procesarpedidosfecha(numeric, numeric, numeric)
    OWNER TO zeolides;
