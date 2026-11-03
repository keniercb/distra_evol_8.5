-- FUNCTION: mod_logfacturacion.f_aprobardespachotienda(numeric, numeric)

-- DROP FUNCTION IF EXISTS mod_logfacturacion.f_aprobardespachotienda(numeric, numeric);

CREATE OR REPLACE FUNCTION mod_logfacturacion.f_aprobardespachotienda(
	p_iddespacho numeric,
	p_idusuario numeric)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE STRICT PARALLEL UNSAFE
AS $BODY$
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
  v_configTienda record;
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
        
        select da.*, desp.nrodespacho into v_configTienda from mod_logpuntoventa.dat_areaventa da
        inner join mod_logpuntoventa.dat_centroentregaalmacen cent on cent.idareaventa = da.idareaventa
        inner join mod_logfacturacion.dat_despachotienda desp on desp.iddeposito = da.idestructuraop
        where desp.iddespachotienda = p_iddespacho limit 1;
        raise notice 'config %', v_configTienda;
        if v_configTienda.tipoventa = 2 then 
        	--Despacho de factura resumen
        	for v_facturas in (
                select distinct df.idfactura, df.*, ff.idcliente, ff.idestructuracomun--, pt.nropedido, pt.idareaventa 
                from mod_logfacturacion.dat_despachofactura df
                inner join mod_logfacturacion.dat_docfactura ff on ff.idfactura = df.idfactura
                inner join mod_logpuntoventa.dat_pedidodocumento dpd on dpd.iddocumento = ff.idfactura and dpd.tipo = 2
                --inner join mod_logpuntoventa.dat_pedidotienda pt on pt.idpedidotienda = dpd.idpedido
                where df.iddespachotienda = p_iddespacho
            ) loop
                select da.*, di.tipo into v_datosareaventa from mod_logpuntoventa.dat_areaventa da 
                inner join mod_logpuntoventa.dat_infoconexion di on di.idinfoconexion = da.idinfoconexion
                where da.idareaventa = v_configTienda.idareaventa;
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
                set cantidad = (case when tempdesp.cantidad >= (
                	COALESCE((select (sum(pp.cantidad)-sum(COALESCE(pp.devolver,0))-sum(COALESCE(pp.devuelto,0))) from mod_logpuntoventa.dat_pedidoproducto pp 
                    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pp.idpedidotienda and pd.iddocumento = v_facturas.idfactura
                    where pp.idproducto = mov.idproducto
                    ),0)
                ) 
                then (COALESCE((select (sum(pp.cantidad)-sum(COALESCE(pp.devolver,0))-sum(COALESCE(pp.devuelto,0))) from mod_logpuntoventa.dat_pedidoproducto pp 
                    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pp.idpedidotienda and pd.iddocumento = v_facturas.idfactura
                    where pp.idproducto = mov.idproducto
                    ),0)) else tempdesp.cantidad end),
                importecontable = dp.precio*(case when tempdesp.cantidad >= (COALESCE((select (sum(pp.cantidad)-sum(COALESCE(pp.devolver,0))-sum(COALESCE(pp.devuelto,0))) from mod_logpuntoventa.dat_pedidoproducto pp 
                    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pp.idpedidotienda and pd.iddocumento = v_facturas.idfactura
                    where pp.idproducto = mov.idproducto
                    ),0))
                 then (COALESCE((select (sum(pp.cantidad)-sum(COALESCE(pp.devolver,0))-sum(COALESCE(pp.devuelto,0))) from mod_logpuntoventa.dat_pedidoproducto pp 
                    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pp.idpedidotienda and pd.iddocumento = v_facturas.idfactura
                    where pp.idproducto = mov.idproducto
                    ),0)) else tempdesp.cantidad end),
                preciocontable = dp.precio,
                existenciaactual = dp.cantidad-(case when tempdesp.cantidad >= (COALESCE((select (sum(pp.cantidad)-sum(COALESCE(pp.devolver,0))-sum(COALESCE(pp.devuelto,0))) from mod_logpuntoventa.dat_pedidoproducto pp 
                    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pp.idpedidotienda and pd.iddocumento = v_facturas.idfactura
                    where pp.idproducto = mov.idproducto
                    ),0)) 
                then (COALESCE((select (sum(pp.cantidad)-sum(COALESCE(pp.devolver,0))-sum(COALESCE(pp.devuelto,0))) from mod_logpuntoventa.dat_pedidoproducto pp 
                    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pp.idpedidotienda and pd.iddocumento = v_facturas.idfactura
                    where pp.idproducto = mov.idproducto
                    ),0)) else tempdesp.cantidad end),
                preciopromedio = (case when (dp.cantidad-(case when tempdesp.cantidad >= (COALESCE((select (sum(pp.cantidad)-sum(COALESCE(pp.devolver,0))-sum(COALESCE(pp.devuelto,0))) from mod_logpuntoventa.dat_pedidoproducto pp 
                    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pp.idpedidotienda and pd.iddocumento = v_facturas.idfactura
                    where pp.idproducto = mov.idproducto
                    ),0))
                 then (COALESCE((select (sum(pp.cantidad)-sum(COALESCE(pp.devolver,0))-sum(COALESCE(pp.devuelto,0))) from mod_logpuntoventa.dat_pedidoproducto pp 
                    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pp.idpedidotienda and pd.iddocumento = v_facturas.idfactura
                    where pp.idproducto = mov.idproducto
                    ),0)) else tempdesp.cantidad end)) > 0 
                    then (round(dp.importe - (dp.precio*(case when tempdesp.cantidad >= (COALESCE((select (sum(pp.cantidad)-sum(COALESCE(pp.devolver,0))-sum(COALESCE(pp.devuelto,0))) from mod_logpuntoventa.dat_pedidoproducto pp 
                    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pp.idpedidotienda and pd.iddocumento = v_facturas.idfactura
                    where pp.idproducto = mov.idproducto
                    ),0))
                    then (COALESCE((select (sum(pp.cantidad)-sum(COALESCE(pp.devolver,0))-sum(COALESCE(pp.devuelto,0))) from mod_logpuntoventa.dat_pedidoproducto pp 
                    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pp.idpedidotienda and pd.iddocumento = v_facturas.idfactura
                    where pp.idproducto = mov.idproducto
                    ),0)) else tempdesp.cantidad end)),2))/(dp.cantidad-(case when tempdesp.cantidad >= (COALESCE((select (sum(pp.cantidad)-sum(COALESCE(pp.devolver,0))-sum(COALESCE(pp.devuelto,0))) from mod_logpuntoventa.dat_pedidoproducto pp 
                    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pp.idpedidotienda and pd.iddocumento = v_facturas.idfactura
                    where pp.idproducto = mov.idproducto
                    ),0))
                    then (COALESCE((select (sum(pp.cantidad)-sum(COALESCE(pp.devolver,0))-sum(COALESCE(pp.devuelto,0))) from mod_logpuntoventa.dat_pedidoproducto pp 
                    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pp.idpedidotienda and pd.iddocumento = v_facturas.idfactura
                    where pp.idproducto = mov.idproducto
                    ),0)) else tempdesp.cantidad end))  
                else 0 end),
                importetotal = (case when (dp.cantidad-(case when tempdesp.cantidad >= (COALESCE((select (sum(pp.cantidad)-sum(COALESCE(pp.devolver,0))-sum(COALESCE(pp.devuelto,0))) from mod_logpuntoventa.dat_pedidoproducto pp 
                    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pp.idpedidotienda and pd.iddocumento = v_facturas.idfactura
                    where pp.idproducto = mov.idproducto
                    ),0)) 
                then (COALESCE((select (sum(pp.cantidad)-sum(COALESCE(pp.devolver,0))-sum(COALESCE(pp.devuelto,0))) from mod_logpuntoventa.dat_pedidoproducto pp 
                    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pp.idpedidotienda and pd.iddocumento = v_facturas.idfactura
                    where pp.idproducto = mov.idproducto
                    ),0)) else tempdesp.cantidad end)) > 0 
                      then (round(dp.importe - (dp.precio*(case when tempdesp.cantidad >= (COALESCE((select (sum(pp.cantidad)-sum(COALESCE(pp.devolver,0))-sum(COALESCE(pp.devuelto,0))) from mod_logpuntoventa.dat_pedidoproducto pp 
                    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pp.idpedidotienda and pd.iddocumento = v_facturas.idfactura
                    where pp.idproducto = mov.idproducto
                    ),0))
                      then (COALESCE((select (sum(pp.cantidad)-sum(COALESCE(pp.devolver,0))-sum(COALESCE(pp.devuelto,0))) from mod_logpuntoventa.dat_pedidoproducto pp 
                    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pp.idpedidotienda and pd.iddocumento = v_facturas.idfactura
                    where pp.idproducto = mov.idproducto
                    ),0)) else tempdesp.cantidad end)), 2) )
                else 0 end),
                idclasificacion = dp.idclasificacioncontable
                from mod_logistica.dat_producto dp
                inner join mod_logfacturacion.dat_despachoproducto desp on desp.idproducto = dp.idproducto 
                inner join tem_despachocmpto tempdesp on tempdesp.iddespachoproducto = desp.iddespachoproducto
                inner join mod_logfacturacion.dat_despachofactura df on df.iddespachotienda = desp.iddespachotienda and df.idfactura = v_facturas.idfactura
                --inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.iddocumento = v_facturas.idfactura
                --inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idpedidotienda = pd.idpedido and pp.idproducto = dp.idproducto
                where mov.iddocumento = v_facturas.idfactura and dp.idproducto = mov.idproducto;
                
                update mod_logistica.dat_movimiento set cronologia = v_cronologia where iddocumento = v_facturas.idfactura;
                
                update mod_logistica.dat_producto as dp
                set cantidad = dp.cantidad-(case when tempdesp.cantidad >= (COALESCE((select (sum(pp.cantidad)-sum(COALESCE(pp.devolver,0))-sum(COALESCE(pp.devuelto,0))) from mod_logpuntoventa.dat_pedidoproducto pp 
                    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pp.idpedidotienda and pd.iddocumento = v_facturas.idfactura
                    where pp.idproducto = mov.idproducto
                    ),0))
                 then (COALESCE((select (sum(pp.cantidad)-sum(COALESCE(pp.devolver,0))-sum(COALESCE(pp.devuelto,0))) from mod_logpuntoventa.dat_pedidoproducto pp 
                    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pp.idpedidotienda and pd.iddocumento = v_facturas.idfactura
                    where pp.idproducto = mov.idproducto
                    ),0)) else tempdesp.cantidad end),
                precio = (case when (dp.cantidad-(case when tempdesp.cantidad >= (COALESCE((select (sum(pp.cantidad)-sum(COALESCE(pp.devolver,0))-sum(COALESCE(pp.devuelto,0))) from mod_logpuntoventa.dat_pedidoproducto pp 
                    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pp.idpedidotienda and pd.iddocumento = v_facturas.idfactura
                    where pp.idproducto = mov.idproducto
                    ),0))
                 then (COALESCE((select (sum(pp.cantidad)-sum(COALESCE(pp.devolver,0))-sum(COALESCE(pp.devuelto,0))) from mod_logpuntoventa.dat_pedidoproducto pp 
                    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pp.idpedidotienda and pd.iddocumento = v_facturas.idfactura
                    where pp.idproducto = mov.idproducto
                    ),0)) else tempdesp.cantidad end)) > 0 
                    then (round(dp.importe - (dp.precio*(case when tempdesp.cantidad >= (COALESCE((select (sum(pp.cantidad)-sum(COALESCE(pp.devolver,0))-sum(COALESCE(pp.devuelto,0))) from mod_logpuntoventa.dat_pedidoproducto pp 
                    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pp.idpedidotienda and pd.iddocumento = v_facturas.idfactura
                    where pp.idproducto = mov.idproducto
                    ),0))
                    then (COALESCE((select (sum(pp.cantidad)-sum(COALESCE(pp.devolver,0))-sum(COALESCE(pp.devuelto,0))) from mod_logpuntoventa.dat_pedidoproducto pp 
                    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pp.idpedidotienda and pd.iddocumento = v_facturas.idfactura
                    where pp.idproducto = mov.idproducto
                    ),0)) else tempdesp.cantidad end)),2))/(dp.cantidad-(case when tempdesp.cantidad >= (COALESCE((select (sum(pp.cantidad)-sum(COALESCE(pp.devolver,0))-sum(COALESCE(pp.devuelto,0))) from mod_logpuntoventa.dat_pedidoproducto pp 
                    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pp.idpedidotienda and pd.iddocumento = v_facturas.idfactura
                    where pp.idproducto = mov.idproducto
                    ),0)) then (COALESCE((select (sum(pp.cantidad)-sum(COALESCE(pp.devolver,0))-sum(COALESCE(pp.devuelto,0))) from mod_logpuntoventa.dat_pedidoproducto pp 
                    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pp.idpedidotienda and pd.iddocumento = v_facturas.idfactura
                    where pp.idproducto = mov.idproducto
                    ),0)) else tempdesp.cantidad end))  
                else 0 end),
                cronologia = v_cronologia,
                importe = (case when (dp.cantidad-(case when tempdesp.cantidad >= (COALESCE((select (sum(pp.cantidad)-sum(COALESCE(pp.devolver,0))-sum(COALESCE(pp.devuelto,0))) from mod_logpuntoventa.dat_pedidoproducto pp 
                    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pp.idpedidotienda and pd.iddocumento = v_facturas.idfactura
                    where pp.idproducto = mov.idproducto
                    ),0)) then (COALESCE((select (sum(pp.cantidad)-sum(COALESCE(pp.devolver,0))-sum(COALESCE(pp.devuelto,0))) from mod_logpuntoventa.dat_pedidoproducto pp 
                    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pp.idpedidotienda and pd.iddocumento = v_facturas.idfactura
                    where pp.idproducto = mov.idproducto
                    ),0)) else tempdesp.cantidad end)) > 0 
                      then (round(dp.importe - (dp.precio*(case when tempdesp.cantidad >= (COALESCE((select (sum(pp.cantidad)-sum(COALESCE(pp.devolver,0))-sum(COALESCE(pp.devuelto,0))) from mod_logpuntoventa.dat_pedidoproducto pp 
                    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pp.idpedidotienda and pd.iddocumento = v_facturas.idfactura
                    where pp.idproducto = mov.idproducto
                    ),0)) then (COALESCE((select (sum(pp.cantidad)-sum(COALESCE(pp.devolver,0))-sum(COALESCE(pp.devuelto,0))) from mod_logpuntoventa.dat_pedidoproducto pp 
                    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pp.idpedidotienda and pd.iddocumento = v_facturas.idfactura
                    where pp.idproducto = mov.idproducto
                    ),0)) else tempdesp.cantidad end)), 2) )
                else 0 end)
                from mod_logistica.dat_movimiento mov
                inner join mod_logistica.dat_producto dp1 on dp1.idproducto = mov.idproducto
                inner join mod_logfacturacion.dat_despachoproducto desp on desp.idproducto = dp1.idproducto 
                inner join tem_despachocmpto tempdesp on tempdesp.iddespachoproducto = desp.iddespachoproducto
                inner join mod_logfacturacion.dat_despachofactura df on df.iddespachotienda = desp.iddespachotienda and df.idfactura = v_facturas.idfactura
                --inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.iddocumento = v_facturas.idfactura
                --inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idpedidotienda = pd.idpedido and pp.idproducto = dp1.idproducto
                where mov.iddocumento = v_facturas.idfactura and dp.idproducto = mov.idproducto;
                
                if v_datosareaventa.tipo = 'ps' then
                    PERFORM mod_logpuntoventa.f_actualizardisponibletienda(v_iddocTV, v_facturas.idfactura);
                else 
                    PERFORM mod_logpuntoventa.f_actualizardisponibletiendaint(v_facturas.idfactura);
                end if;
                
                PERFORM mod_logpuntoventa.f_actualizarprecioventa(v_facturas.idfactura, v_datosareaventa.idtipoprecioagencia);
                
                update mod_logdistribucion.dat_prodordencmpto as prod
                set entregado = entregado + (case when tempdesp.cantidad >= (COALESCE((select (sum(pp.cantidad)-sum(COALESCE(pp.devolver,0))-sum(COALESCE(pp.devuelto,0))) from mod_logpuntoventa.dat_pedidoproducto pp 
                    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pp.idpedidotienda and pd.iddocumento = v_facturas.idfactura
                    where pp.idproducto = mov.idproducto
                    ),0))
                 then (COALESCE((select (sum(pp.cantidad)-sum(COALESCE(pp.devolver,0))-sum(COALESCE(pp.devuelto,0))) from mod_logpuntoventa.dat_pedidoproducto pp 
                    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pp.idpedidotienda and pd.iddocumento = v_facturas.idfactura
                    where pp.idproducto = mov.idproducto
                    ),0)) else tempdesp.cantidad end),
                pendiente = pendiente - (case when tempdesp.cantidad >= (COALESCE((select (sum(pp.cantidad)-sum(COALESCE(pp.devolver,0))-sum(COALESCE(pp.devuelto,0))) from mod_logpuntoventa.dat_pedidoproducto pp 
                    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pp.idpedidotienda and pd.iddocumento = v_facturas.idfactura
                    where pp.idproducto = mov.idproducto
                    ),0)) then (COALESCE((select (sum(pp.cantidad)-sum(COALESCE(pp.devolver,0))-sum(COALESCE(pp.devuelto,0))) from mod_logpuntoventa.dat_pedidoproducto pp 
                    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pp.idpedidotienda and pd.iddocumento = v_facturas.idfactura
                    where pp.idproducto = mov.idproducto
                    ),0)) else tempdesp.cantidad end)
                from mod_logistica.dat_producto dp
                inner join mod_logfacturacion.dat_despachoproducto desp on desp.idproducto = dp.idproducto 
                inner join tem_despachocmpto tempdesp on tempdesp.iddespachoproducto = desp.iddespachoproducto
                inner join mod_logistica.dat_movimiento mov on mov.idproducto = dp.idproducto
                inner join mod_logistica.dat_documentocliente ddc on ddc.iddocumento = mov.iddocumento
                inner join mod_logistica.dat_documentopadre dpa on dpa.iddocumento = mov.iddocumento
                inner join mod_logdistribucion.dat_prodorden dprod on dprod.idorden = dpa.idpadre and dprod.idproducto = mov.idproducto
                inner join mod_logfacturacion.dat_despachofactura df on df.iddespachotienda = desp.iddespachotienda and df.idfactura = v_facturas.idfactura
                --inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.iddocumento = v_facturas.idfactura
                --inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idpedidotienda = pd.idpedido and pp.idproducto = dp.idproducto
                where mov.iddocumento = v_facturas.idfactura and dp.idproducto = mov.idproducto and tempdesp.iddespachoproducto = desp.iddespachoproducto
                and dprod.idcliente = ddc.idcliente and prod.idprodorden = dprod.idprodorden;
                
                --insertar movimientos de ubicacion
                
                --fin insertar movimientos ubicacion          
                
                update tem_despachocmpto as tempdesp
                set cantidad = tempdesp.cantidad - (case when tempdesp.cantidad >= (COALESCE((select (sum(pp.cantidad)-sum(COALESCE(pp.devolver,0))-sum(COALESCE(pp.devuelto,0))) from mod_logpuntoventa.dat_pedidoproducto pp 
                    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pp.idpedidotienda and pd.iddocumento = v_facturas.idfactura
                    where pp.idproducto = mov.idproducto
                    ),0)) 
                then (COALESCE((select (sum(pp.cantidad)-sum(COALESCE(pp.devolver,0))-sum(COALESCE(pp.devuelto,0))) from mod_logpuntoventa.dat_pedidoproducto pp 
                    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pp.idpedidotienda and pd.iddocumento = v_facturas.idfactura
                    where pp.idproducto = mov.idproducto
                    ),0)) else tempdesp.cantidad end)
                from mod_logistica.dat_producto dp
                inner join mod_logfacturacion.dat_despachoproducto desp on desp.idproducto = dp.idproducto 
                inner join mod_logistica.dat_movimiento mov on mov.idproducto = dp.idproducto
                inner join mod_logfacturacion.dat_despachofactura df on df.iddespachotienda = desp.iddespachotienda and df.idfactura = v_facturas.idfactura
                --inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.iddocumento = v_facturas.idfactura
                --inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idpedidotienda = pd.idpedido and pp.idproducto = dp.idproducto
                where mov.iddocumento = v_facturas.idfactura and dp.idproducto = mov.idproducto and tempdesp.iddespachoproducto = desp.iddespachoproducto;
            	
                --creando recepcion en el destino
                v_idcentroentrega := (select nc.idestructura from mod_datosmaestros.nom_clientesproveedor nc
                where nc.idclientesproveedores = v_facturas.idcliente limit 1);
                
                v_depositoentrega := (select dce.iddeposito from mod_logpuntoventa.dat_centroentregaalmacen dce
                where dce.idestructura = v_idcentroentrega and dce.idareaventa = v_configTienda.idareaventa);
                
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
                  v_fecharecepcion,'Recepcion generada de tienda virtual. Resumen-Despacho #'||v_configTienda.nrodespacho,0,1,p_idusuario,1,v_idperiodo.idejercicioactual,
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
                    select dm.preciocontable, dmm.precio as preciofactura, dm.cantidad,dm.idunidadmedida, dp.*--, pp.idproductopedido 
                    from mod_logistica.dat_movimiento dm
                    inner join mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = dm.idmovimiento and dmm.idmoneda = 9900000000
                    inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
                    /*inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idproducto = dp.idproducto
                    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.iddocumento = dm.iddocumento and pp.idpedidotienda = pd.idpedido*/
                    where dm.iddocumento = v_facturas.idfactura
                ) loop
                    --buscar indicador para crear tarjeta si no existe
                    select dpd.* into v_datosproducto from mod_logistica.dat_producto dpd
                    where dpd.idestructura = v_depositoentrega and dpd.idindicador = v_productos.idindicador and dpd.idumedida = v_productos.idunidadmedida;
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
                end loop;
                update mod_logpuntoventa.dat_pedidoproducto as ppp
                    set procesado = ppp.enproceso, 
                    enproceso = 0   
                    from mod_logfacturacion.dat_despachofactura df
					inner join mod_logpuntoventa.dat_pedidodocumento pd on df.idfactura = pd.iddocumento and pd.tipo = 2
                    inner join mod_logpuntoventa.dat_pedidotienda pt on pt.idpedidotienda = pd.idpedido 
                    inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idpedidotienda = pt.idpedidotienda
                    
                    where ppp.idproductopedido = pp.idproductopedido and ppp.idproducto = pp.idproducto and df.iddespachotienda = p_iddespacho and df.idfactura = v_facturas.idfactura;              
            end loop;
        else 
        	for v_facturas in (
                select df.*, ff.idcliente, ff.idestructuracomun, pt.nropedido, pt.idareaventa 
                from mod_logfacturacion.dat_despachofactura df
                inner join mod_logfacturacion.dat_docfactura ff on ff.idfactura = df.idfactura
                inner join mod_logpuntoventa.dat_pedidodocumento dpd on dpd.iddocumento = ff.idfactura and dpd.tipo = 2
                inner join mod_logpuntoventa.dat_pedidotienda pt on pt.idpedidotienda = dpd.idpedido
                where df.iddespachotienda = p_iddespacho
            ) loop
                select da.*, di.tipo into v_datosareaventa from mod_logpuntoventa.dat_areaventa da 
                inner join mod_logpuntoventa.dat_infoconexion di on di.idinfoconexion = da.idinfoconexion
                where da.idareaventa = v_facturas.idareaventa;
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
                
                if v_datosareaventa.tipo = 'ps' then
                    PERFORM mod_logpuntoventa.f_actualizardisponibletienda(v_iddocTV, v_facturas.idfactura);
                else 
                    PERFORM mod_logpuntoventa.f_actualizardisponibletiendaint(v_facturas.idfactura);
                end if;
                
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
        end if;
        
	    
        update mod_logfacturacion.dat_despachotienda 
        set estado = 3 where iddespachotienda = p_iddespacho;
END;
$BODY$;

ALTER FUNCTION mod_logfacturacion.f_aprobardespachotienda(numeric, numeric)
    OWNER TO zeolides;
