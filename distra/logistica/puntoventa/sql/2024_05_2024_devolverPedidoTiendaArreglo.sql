-- FUNCTION: mod_logpuntoventa.f_devolverpedidostienda(numeric, numeric, numeric, numeric)

-- DROP FUNCTION IF EXISTS mod_logpuntoventa.f_devolverpedidostienda(numeric, numeric, numeric, numeric);

CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_devolverpedidostienda(
	p_idpedidotienda numeric,
	p_idusuario numeric,
	p_idestructuracomun numeric,
	p_areaventa numeric)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
  v_iddoc numeric;
  v_iddocumento numeric;
  v_transferencia record;
  v_idrecepcion numeric;
  v_idespecialidad numeric;
  v_idperiodo record;
  v_fechadistribucion date;
  v_fechatransferencia date;
  v_idcliente numeric;
  v_datospedido record;
  v_idoperaciontransferencia numeric;
  v_datosareaventa record;
  v_rec record;
  v_reccomp record;
  v_cant numeric;
  v_iddocTV numeric;
  v_iddocRecep numeric;
  v_idproducto numeric;
  v_cancelacion record;
  v_facturapedido numeric;
  v_producto record;
  v_productotransf record; 
  v_datosproducto record;
  v_cronologia numeric;
  v_numerotransferencia numeric;
  v_productotransferir numeric;
BEGIN
	--Inicializando parametros para adicionar distribucion general con los productos de los pedidos
    v_productotransferir := (select count(pp.idproducto)
    from mod_logpuntoventa.dat_pedidoproducto pp
    inner join mod_logistica.dat_producto dp on dp.idproducto = pp.idproducto
    where coalesce(pp.devolver,0) > 0 and coalesce(pp.devolver,0) <= (dp.cantidad - coalesce(
            (select sum(COALESCE(dpped.enproceso,0)-COALESCE(dpped.devuelto,0)) from mod_logpuntoventa.dat_pedidoproducto dpped where dpped.idproducto = dp.idproducto
            and dpped.enproceso > 0)
            ,0)) 
	    and (pp.devolver - (pp.cantidadreal - pp.cantidad) > 0)
	    and pp.idpedidotienda = p_idpedidotienda);
    v_iddocTV := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
        inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
        inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
        where ndp.abreviatura = 'transTiendaLog' and des.idestructuracomun = p_idestructuracomun limit 1);
    
    v_idoperaciontransferencia := (select CAST(vg.valor as NUMERIC) from mod_logistica.nom_variableglobal vg 
            where vg.nombre = 'OPRE_REC_TRANS_INT_TV' limit 1);
            
    select pd.iddocumento into v_facturapedido from mod_logpuntoventa.dat_pedidodocumento pd where pd.idpedido = p_idpedidotienda
    and pd.tipo = 2 limit 1;
    
    select pt.* into v_datospedido from mod_logpuntoventa.dat_pedidotienda pt where pt.idpedidotienda = p_idpedidotienda;
    
    v_iddoc := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
    inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
    inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
    where ndp.abreviatura = 'entregaLog' and des.idestructuracomun = p_idestructuracomun limit 1);
     
    v_idespecialidad := (select cue.idespecialidad from mod_logistica.conf_usuarioespecialidad cue 
                where cue.idusuario = p_idusuario limit 1);
    
    v_idperiodo = mod_logistica.f_obtenerejercicioactivo(10, p_idestructuracomun);            
                
    v_fechadistribucion := (select df.fecha from mod_datosmaestros.dat_fecha df
    inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = df.idestructurasubsist
    where des.idsubsistema = 10 and des.idestructuracomun = p_idestructuracomun limit 1);
    
    /*v_idoperacionfactura := (select dop.idnomoperaciones from mod_logfacturacion.dat_operacionsubsistema dop 
    where dop.idestructura = p_idestructuracomun and dop.tiendavirtual = 1 limit 1);
    
    v_iddepositoorigen := (select da.idestructuraop from mod_logpuntoventa.dat_areaventa da where da.idareaventa = p_areaventa);*/
    
    select da.* into v_datosareaventa from mod_logpuntoventa.dat_areaventa da where da.idareaventa = p_areaventa;
    
    --v_idoperaciontransferencia := 990000005928;
    
    --v_iddepositoorigen := v_datosareaventa.idestructuraop;
    
    raise notice 'iddoc ,%', v_iddoc ; 
    raise notice 'idespecialidad ,%', v_idespecialidad ;
    raise notice 'fechadist ,%', v_fechadistribucion ; 
    --Insertando distribucion
    v_idcliente := (select nc.iddeposito from mod_logpuntoventa.dat_areaventacorriente nc
      where nc.idareaventa = p_areaventa limit 1);
    if v_productotransferir > 0 then  
    INSERT INTO mod_logistica.dat_documento
    (
      iddoc,anno,fechacontable,observaciones,cronologia,version,idusuario,estado,idejercicio,
      idestructuracomun,idperiodo,numeroref,idespecialidad,nrodoc,aprobadopor
    )
    VALUES (
      v_iddoc, date_part('year', CAST(to_char(v_fechadistribucion, 'DD/MM/YYYY HH24:MI') as timestamp)),
      v_fechadistribucion,'Distribucion para devolucion de pedido '|| v_datospedido.nropedido,0,1,p_idusuario,3,v_idperiodo.idejercicioactual,
      p_idestructuracomun, v_idperiodo.idperiodoactual,
      (COALESCE((
        select max(dd.numeroref) from mod_logistica.dat_documento dd where dd.iddoc = v_iddoc
        and dd.idejercicio = v_idperiodo.idejercicioactual and dd.idestructuracomun = p_idestructuracomun
      ),0)+1),1,(COALESCE((
        select max(dd.nrodoc) from mod_logistica.dat_documento dd where dd.iddoc = v_iddoc
        and dd.idejercicio = v_idperiodo.idejercicioactual and dd.idestructuracomun = p_idestructuracomun
      ),0)+1),p_idusuario
    ) returning iddocumento into v_iddocumento;
    INSERT INTO mod_logdistribucion.dat_distribucion
    (
      iddistribucion,idestructuraop,tipodestino,tipodistribucion,salidaporfactura
    )
    VALUES (v_iddocumento,p_idestructuracomun,3,3,0);
    INSERT INTO mod_logistica.dat_documentocliente
    (
      iddocumento,idcliente,tipocliente,idestructura
    )
    VALUES (v_iddocumento,v_idcliente,3,p_idestructuracomun);
    --insertando productos de la distribucion
    with prodorden AS (INSERT INTO 
      mod_logdistribucion.dat_prodorden
    (
      idproducto,idcliente,cantidad,idorden
    )
    (
    select DISTINCT pp.idproducto, v_idcliente,(pp.devolver - (pp.cantidadreal - pp.cantidad)),v_iddocumento
        from mod_logpuntoventa.dat_pedidoproducto pp
        inner join mod_logistica.dat_producto dp on dp.idproducto = pp.idproducto
        where coalesce(pp.devolver,0) > 0 and coalesce(pp.devolver,0) <= dp.cantidad 
        and (pp.devolver - (pp.cantidadreal - pp.cantidad) > 0)
        and pp.idpedidotienda = p_idpedidotienda
	--group by pp.idproducto
    ) RETURNING idprodorden, cantidad, idproducto),
    cantidadcomp as (
      INSERT INTO 
        mod_logistica.dat_cantidadcomprometida
      (
        iddocumento,idproducto,idcliente,cantidad,estado
      ) 
      select v_iddocumento,idproducto,v_idcliente,cantidad,2 from prodorden
      RETURNING iddocumento
    )
    INSERT INTO 
      mod_logdistribucion.dat_prodordencmpto
    (
      idprodorden,enproceso,entregado,pendiente,cantidadoriginal
    )
    select idprodorden,0, cantidad,0,cantidad from prodorden;
    end if;
    --rebajar disponible reservado en la transferencia virtual
    for v_rec in (select DISTINCT pp.idproducto,(pp.devolver - (pp.cantidadreal - pp.cantidad)) as cantidad,
    pord.idprodorden, pp.cantidadreal as cantpedida, pp.devuelto, pp.devolver
    from mod_logpuntoventa.dat_pedidoproducto pp
    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pp.idpedidotienda
    inner join mod_logdistribucion.dat_prodorden pord on pord.idorden = pd.iddocumento
    where pp.idpedidotienda = p_idpedidotienda and pp.devolver > 0
    and pd.tipo = 1 and pord.idproducto = pp.idproducto) loop
    
    for v_reccomp in SELECT cc.*
      FROM mod_logistica.dat_cantidadcomprometida cc
      inner join mod_logistica.dat_documento d on d.iddocumento = cc.iddocumento
      where d.iddoc = v_iddocTV and cc.idproducto = v_rec.idproducto
      order by d.fechacontable asc loop

      if v_idproducto is null or v_idproducto <> v_rec.idproducto then
          v_cant = v_rec.cantidad;
          v_idproducto = v_rec.idproducto;
      end if;
      
      if v_reccomp.cantidad >= v_cant and v_cant > 0 then
          UPDATE mod_logistica.dat_cantidadcomprometida 
            SET cantidad = cantidad - v_cant --, estado = 2
          WHERE 
  			idcantidadcomprometida = v_reccomp.idcantidadcomprometida;
          v_cant = 0;
          CONTINUE;
      else if v_reccomp.cantidad < v_cant and v_cant > 0 then
          v_cant = v_cant - v_reccomp.cantidad;          
          UPDATE mod_logistica.dat_cantidadcomprometida 
            SET cantidad = 0, estado = 2
          WHERE 
  			idcantidadcomprometida = v_reccomp.idcantidadcomprometida;
          CONTINUE;
      end if;
          --v_cant = v_rec.cantidad - v_rec.vendida;
      end if;
    end loop;
if v_rec.cantidad > 0 then
    update mod_logdistribucion.dat_prodorden set cantidad = cantidad - v_rec.cantidad 
    where idprodorden = v_rec.idprodorden;
    update mod_logdistribucion.dat_prodordencmpto set cantidadoriginal = cantidadoriginal - v_rec.cantidad,
    pendiente = pendiente - v_rec.cantidad where idprodorden = v_rec.idprodorden;
    INSERT INTO 
      mod_logdistribucion.dat_cancelacion
    (
      idprodorden,cantidad,motivo,idusuario,estado,idaprobado,fecha
    )
    VALUES (v_rec.idprodorden,v_rec.cantidad,'Devolucion de pedido '||v_datospedido.nropedido,
      p_idusuario,2,p_idusuario,now()
    );
    --ojo probando update
    /*update mod_logfacturacion.dat_despachoproducto as desp
    set cantidad = desp.cantidad - v_rec.cantidad,
    despachado = (CASE when coalesce(desp.cantidad-v_rec.cantidad,0) >= desp.despachado then desp.despachado - 0 else desp.despachado - v_rec.cantidad end)
    from mod_logfacturacion.dat_despachofactura df
    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.iddocumento = df.idfactura
    inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idpedidotienda = p_idpedidotienda
    where pd.idpedido = p_idpedidotienda and df.iddespachotienda = desp.iddespachotienda
    and pp.idproducto = v_rec.idproducto and pp.idindicador = desp.idindicador;*/
    
    update mod_logfacturacion.dat_despachoproducto as dprod 
    set cantidad = (select sum(pp.cantidad-COALESCE(pp.procesado,0)-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) 
    from mod_logistica.dat_movimiento dm
    inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.iddocumento = dm.iddocumento
    inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idpedidotienda = pd.idpedido and pp.idindicador = dp.idindicador
    where dm.iddocumento in (select def.idfactura 
    from mod_logfacturacion.dat_despachofactura def
    where def.iddespachotienda = (select def1.iddespachotienda from mod_logfacturacion.dat_despachofactura def1
    inner join mod_logpuntoventa.dat_pedidodocumento pd1 on pd1.iddocumento = def1.idfactura
    where pd1.idpedido = p_idpedidotienda))  and pd.tipo = 2 and dp.idindicador = dprod.idindicador),
    despachado = (CASE when coalesce((select sum(pp.cantidad-COALESCE(pp.procesado,0)-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) 
    from mod_logistica.dat_movimiento dm
    inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.iddocumento = dm.iddocumento
    inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idpedidotienda = pd.idpedido and pp.idindicador = dp.idindicador
    where dm.iddocumento in (select def.idfactura 
    from mod_logfacturacion.dat_despachofactura def
    where def.iddespachotienda = (select def1.iddespachotienda from mod_logfacturacion.dat_despachofactura def1
    inner join mod_logpuntoventa.dat_pedidodocumento pd1 on pd1.iddocumento = def1.idfactura
    where pd1.idpedido = p_idpedidotienda)) and pd.tipo = 2 and dp.idindicador = dprod.idindicador),0) >= dprod.despachado then dprod.despachado - 0 else dprod.despachado - v_rec.cantidad end)
    from mod_logfacturacion.dat_despachotienda dt
    inner join mod_logfacturacion.dat_despachofactura df on df.iddespachotienda = dt.iddespachotienda
    inner join mod_logpuntoventa.dat_pedidodocumento pd1 on pd1.iddocumento = df.idfactura
    where dt.iddespachotienda = dprod.iddespachotienda and dt.iddespachotienda = (select def1.iddespachotienda from mod_logfacturacion.dat_despachofactura def1
    inner join mod_logpuntoventa.dat_pedidodocumento pd2 on pd2.iddocumento = def1.idfactura
    where pd2.idpedido = p_idpedidotienda) and pd1.idpedido = p_idpedidotienda;
    --fin ojo
    delete from mod_logfacturacion.dat_despachoproducto desp
    where desp.iddespachoproducto in (
    	select desp1.iddespachoproducto from mod_logfacturacion.dat_despachoproducto desp1 
        inner join mod_logfacturacion.dat_despachofactura df on df.iddespachotienda = desp1.iddespachotienda
        inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.iddocumento = df.idfactura
    	inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idpedidotienda = pd.idpedido
        where pp.idpedidotienda = p_idpedidotienda and desp1.cantidad = 0
    );
    
    /*delete from mod_logistica.dat_movimiento dm
    where dm.iddocumento = v_facturapedido and dm.idproducto = v_rec.idproducto and v_rec.cantpedida = v_rec.devuelto + v_rec.cantidad;*/
	
	delete from mod_logistica.dat_movimiento dm
    where dm.iddocumento = v_facturapedido and dm.idproducto = v_rec.idproducto
    and v_rec.cantpedida = v_rec.devuelto + v_rec.cantidad
     and coalesce((
	select sum(coalesce(pp.cantidadreal,0)) 
    from mod_logpuntoventa.dat_pedidoproducto pp
	inner join mod_logpuntoventa.dat_pedidotienda pt on pt.idpedidotienda = pp.idpedidotienda
	inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pt.idpedidotienda and pd.tipo = 2	
    where pd.iddocumento = v_facturapedido --and pp.devolver > 0
    and  pp.idproducto = v_rec.idproducto
	),0) = coalesce((
	select sum(coalesce(pp.devuelto,0)) + sum(coalesce(pp.devolver,0)) 
    from mod_logpuntoventa.dat_pedidoproducto pp
	inner join mod_logpuntoventa.dat_pedidotienda pt on pt.idpedidotienda = pp.idpedidotienda
	inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pt.idpedidotienda and pd.tipo = 2	
    where pd.iddocumento = v_facturapedido --and pp.devolver > 0
    and  pp.idproducto = v_rec.idproducto
	),0);
end if;
    update mod_logpuntoventa.dat_pedidoproducto set devuelto = devuelto + v_rec.devolver, devolver = 0, enproceso = enproceso - v_rec.cantidad 
    where idpedidotienda = p_idpedidotienda and idproducto = v_rec.idproducto
	and devolver > 0;
end loop;

--Devolviendo productos q no estan en la distribucion por falta de existencia
for v_rec in (
select DISTINCT pp.idproducto,(pp.devolver - (pp.cantidadreal - pp.cantidad)) as cantidad,
    pp.cantidadreal as cantpedida, pp.devuelto, pp.devolver
    from mod_logpuntoventa.dat_pedidoproducto pp
    where pp.idpedidotienda = p_idpedidotienda and pp.devolver > 0
) loop
	update mod_logpuntoventa.dat_pedidoproducto set devuelto = devuelto + v_rec.devolver, devolver = 0, enproceso = enproceso - v_rec.cantidad 
    where idpedidotienda = p_idpedidotienda and idproducto = v_rec.idproducto
	and devolver > 0;
end loop;	
--fin

delete from mod_logfacturacion.dat_despachotienda dt
where dt.iddespachotienda in (
	select dt1.iddespachotienda from mod_logfacturacion.dat_despachotienda dt1
    inner join mod_logfacturacion.dat_despachofactura df on df.iddespachotienda = dt1.iddespachotienda
    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.iddocumento = df.idfactura
    where pd.idpedido = p_idpedidotienda and (
    	select count(desp.iddespachoproducto) from mod_logfacturacion.dat_despachoproducto desp
        where desp.iddespachotienda = dt1.iddespachotienda
    ) = 0
);

delete from mod_logistica.dat_documento d where d.iddocumento = v_facturapedido and (select count(dm.idmovimiento) 
from mod_logistica.dat_movimiento dm where dm.iddocumento = v_facturapedido) = 0;
--creando tranferencia hacia almacen corriente
if v_productotransferir > 0 then
v_iddoc := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
where ndp.abreviatura = 'transferenciaLog' and des.idestructuracomun = p_idestructuracomun limit 1);

select max(d.cronologia) into v_cronologia from mod_logistica.dat_documento d;

INSERT INTO mod_logistica.dat_documento
  (
    iddoc,anno,fechacontable,observaciones,cronologia,version,idusuario,estado,idejercicio,
    idestructuracomun,idperiodo,numeroref,idespecialidad,nrodoc,aprobadopor, idoperacion
  )
  VALUES (
    v_iddoc, date_part('year', CAST(to_char(v_fechadistribucion, 'DD/MM/YYYY HH24:MI') as timestamp)),
    v_fechadistribucion,'Transferencia para almacen corriente por devolucion de pedido '|| v_datospedido.nropedido,v_cronologia,1,p_idusuario,4,v_idperiodo.idejercicioactual,
    v_datosareaventa.idestructuraop, v_idperiodo.idperiodoactual,
    (COALESCE((
      select max(dd.numeroref) from mod_logistica.dat_documento dd where dd.iddoc = v_iddoc
      and dd.idejercicio = v_idperiodo.idejercicioactual and dd.idestructuracomun = v_datosareaventa.idestructuraop
    ),0)+1),1,(COALESCE((
      select max(dd.nrodoc) from mod_logistica.dat_documento dd where dd.iddoc = v_iddoc
      and dd.idejercicio = v_idperiodo.idejercicioactual and dd.idestructuracomun = v_datosareaventa.idestructuraop
    ),0)+1),p_idusuario, v_idoperaciontransferencia
  ) returning iddocumento, nrodoc into v_transferencia;
  INSERT INTO 
    mod_logistica.dat_entrega
  (
    iddocumento,
    version,
    iddestino,
    origen
  )
  VALUES (
    v_transferencia.iddocumento,
    0,3,1
  );
  INSERT INTO mod_logistica.dat_documentocliente
    (
      iddocumento,idcliente,tipocliente
    )
    VALUES (v_transferencia.iddocumento,v_idcliente,3);
    
    INSERT INTO 
      mod_logistica.dat_documentopadre
    (
      iddocumento,idpadre
    )
    values (v_transferencia.iddocumento, v_iddocumento); 
  --insertando productos de la distribucion
  for v_producto in (
      select dpo.cantidad, dpo.idproducto, dp.precio, dp.cantidad as existencia, dp.importe,
      dp.idumedida, dp.idelementogasto, dp.idclasificacioncontable
       from mod_logdistribucion.dat_prodorden dpo
      inner join mod_logistica.dat_producto dp on dp.idproducto = dpo.idproducto
      where dpo.idorden = v_iddocumento 
  ) LOOP
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
            v_transferencia.iddocumento,
            v_producto.idproducto,
            v_producto.precio,
            round(v_producto.precio*v_producto.cantidad,2),
            v_producto.cantidad,
            v_cronologia,
            '-',
            v_producto.idumedida,
            v_producto.idelementogasto,
            v_producto.idclasificacioncontable,
            (v_producto.existencia-v_producto.cantidad),
            (case when (v_producto.existencia-v_producto.cantidad) > 0 
                then (round(v_producto.importe - (v_producto.precio*v_producto.cantidad),2))/(v_producto.existencia-v_producto.cantidad)  
            else 0 end),
            (case when (v_producto.existencia-v_producto.cantidad) > 0 
                  then (round(v_producto.importe - (v_producto.precio*v_producto.cantidad), 2) )
            else 0 end)
          ) returning idmovimiento, cantidad
      )
      INSERT INTO 
        mod_loginventario.dat_moventrega
      (
        idmovimiento,
        ordenado,
        pendiente,
        iddocorigen
      )
      select idmovimiento, cantidad, cantidad, v_transferencia.iddocumento from movimiento;   
      update mod_logistica.dat_producto as dp
      set cantidad = dp.cantidad - v_producto.cantidad,
      precio = (case when (dp.cantidad-v_producto.cantidad) > 0 
                then (round(dp.importe - (dp.precio*v_producto.cantidad),2))/(dp.cantidad-v_producto.cantidad)  
            else 0 end),
      cronologia = v_cronologia,
      importe = (case when (dp.cantidad-v_producto.cantidad) > 0 
                  then (round(dp.importe - (dp.precio*v_producto.cantidad), 2) )
            else 0 end)     
      where dp.idproducto = v_producto.idproducto;             
  end loop;  
  
  --creando recepcion en elaboracion a partir de la transferencia
  
  v_iddocRecep := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
  inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
  inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
  where ndp.abreviatura = 'recepcionLog' and des.idestructuracomun = p_idestructuracomun limit 1);
  
  INSERT INTO mod_logistica.dat_documento
  (
    iddoc,anno,fechacontable,observaciones,cronologia,version,idusuario,estado,idejercicio,
    idestructuracomun,idperiodo,numeroref,idespecialidad,idoperacion
  )
  VALUES (
    v_iddocRecep, date_part('year', CAST(to_char(v_fechadistribucion, 'DD/MM/YYYY HH24:MI') as timestamp)),
    v_fechadistribucion,'Recepcion generada devolucion pedido '||v_datospedido.nropedido,0,1,p_idusuario,1,v_idperiodo.idejercicioactual,
    v_idcliente, v_idperiodo.idperiodoactual,
    (COALESCE((
      select max(dd.numeroref) from mod_logistica.dat_documento dd where dd.iddoc = v_iddocRecep
      and dd.idejercicio = v_idperiodo.idejercicioactual and dd.idestructuracomun = v_idcliente
    ),0)+1),v_idespecialidad, v_idoperaciontransferencia
  ) returning iddocumento into v_idrecepcion;
  INSERT INTO 
    mod_loginventario.dat_recepcion
  (
    iddocumento,nrodocorigen,fechadocorigen
  )
  VALUES (
    v_idrecepcion, v_transferencia.nrodoc, v_fechadistribucion
  );
  INSERT INTO mod_logistica.dat_documentocliente
  (
    iddocumento,idcliente,tipocliente
  )
  VALUES (v_idrecepcion,v_datosareaventa.idestructuraop,3);
  INSERT INTO 
    mod_logistica.dat_documentopadre
  (
    iddocumento,idpadre
  )
  values (v_idrecepcion, v_transferencia.iddocumento);
  --productos de la recepcion
  for v_productotransf in (
      select dm.preciocontable, dm.cantidad,dm.idunidadmedida, dp.*
      from mod_logistica.dat_movimiento dm
      inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
      where dm.iddocumento = v_transferencia.iddocumento
  ) loop
      --buscar indicador para crear tarjeta si no existe
      select dpd.* into v_datosproducto from mod_logistica.dat_producto dpd
      where dpd.idestructura = v_idcliente and dpd.idindicador = v_productotransf.idindicador;
      --insertar movimientos de la recepcion
      if v_datosproducto.idproducto is not null then
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
              v_productotransf.preciocontable,
              0,
              v_productotransf.cantidad,
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
            v_idcliente,
            v_productotransf.idunidadmedida,
            v_productotransf.idindicador,
            v_productotransf.idclasificacioncontable,
            0,
            0,
            0,
            p_idestructuracomun,
            v_productotransf.idmarca,
            v_productotransf.idmodelo,
            v_productotransf.idelementogasto
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
            select v_idrecepcion, idproducto, v_productotransf.preciocontable,0,
            v_productotransf.cantidad, 0, '+', v_datosproducto.idumedida, v_datosproducto.idelementogasto,
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
      
  end loop;
 end if; 
    --cancelar cantidad en la distribucion resumen del pedido(ok)
    
    --eliminar de la factura que responde al pedido el producto si se queda en cero y si es total eliminar la factura(ok)
    
    --actualizar cantidad devuelta en el pedido(ok)
    
    --actualizar cantidad despachada y cantidad del despacho en caso de no estar aprobado el despacho
    
    --crear transferencia al almacen corriente (ok)
    
    --rebajar existencia de los productos en almacen de tienda(ok)
    
    --crear recepcion en elaboracion en el almacen corriente(ok)
    
END;
$BODY$;

ALTER FUNCTION mod_logpuntoventa.f_devolverpedidostienda(numeric, numeric, numeric, numeric)
    OWNER TO zeolides;
