<?php

/**
 * @package Punto de venta
 * @author XETID <xetid@xetid.cu>
 */
class DevolucionpuntoventaModel extends ComunpuntoventaModel
{
    private $_logisticaDoctrine;
    public function __construct($datos = array())
    {
        parent::__construct($datos);
        $this->_logisticaDoctrine = LogisticaDoctrineHelper::__init();
        $relationsS[] = array(
            'cardinalidad' => 'one',
            'relation' => 'DatVentaproducto',
            'properties' => array('local' => 'idproducto', 'foreign' => 'idproducto')
        );
        $this->_logisticaDoctrine->tryInyectRelactions(new DatProductoLogistica(), $relationsS);
    }

    /**
     * @description Retorna las devoluciones
     * @param array $params
     * @return array
     */
    public function devoluciones($params)
    {
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();

        $sqlWhere = "";

        if(!empty($params['idestructura'])){
            $sqlWhere = " AND d.idestructuracomun = {$params['idestructura']} ";
        }

        /*Criterio de busqueda simple*/
        if(!empty($params['criterio'])){
            $sqlWhere = " AND (dv.nroventa = {$params['criterio']} OR dvc.numeroidentidad = '{$params['criterio']}') ";
        }

        /*Producto de la venta*/
        if(!empty($params['idproducto'])){
            $sqlWhere = " AND (dvp.idproducto = {$params['idproducto']}) ";
        }

        /*Estado del documento*/
        if(!empty($params['idestado'])){
            $sqlWhere = " AND (d.estado = {$params['idestado']}) ";
        }

        /*Tipo de documento*/
        if(!empty($params['alias'])){
            $sqlWhere = " AND (d.iddoc = {$params['alias']}) ";
        }

        /*Vendedor que hizo la venta*/
        if(!empty($params['idusuario'])){
            $sqlWhere = " AND (dcu.idusuario = {$params['idusuario']}) ";
        }

        /*Cliente de la venta*/
        if(!empty($params['idventacliente'])){
            $sqlWhere = " AND (dv.idpersona = {$params['idventacliente']}) ";
        }

        /*Modo de pago*/
        if(!empty($params['idventacliente'])){
            $sqlWhere = " AND (dv.idpago = {$params['idmodopago']}) ";
        }

        /*Desde y Hasta*/
        if(!empty($params['desde']) && !empty($params['hasta'])){
            $sqlWhere = " AND (dv.fechaventa BETWEEN '{$params['desde']}'::date AND '{$params['hasta']}'::date) ";
        }
        /*Desde*/
        else  if(!empty($params['desde'])){
            $sqlWhere = " AND (dv.fechaventa >= '{$params['desde']}'::date) ";
        }/*Hasta*/
        else  if(!empty($params['hasta'])){
            $sqlWhere = " AND (dv.fechaventa <= '{$params['hasta']}'::date) ";
        }

        $sql = "SELECT distinct dd.iddevolucion, dd.motivodevolucion, dd.fecha, dd.totalefectdevuelto, dd.idventas, 
               dd.tipodevolucion, (dvc.numeroidentidad ||' - '||dvc.nombre) as cliente, dd.fecha as fechadevolucion,
               dv.fechaventa, dv.fechaexpiracion, dv.nroventa, d.nrodoc,
                (select count(dpd.idproductodevolucion) FROM mod_logpuntoventa.dat_productodevolucion dpd 
                WHERE dpd.iddevolucion = dd.iddevolucion) as cantidadproddevolver, d.idcomprobante, 
                (select c.numerocomprobante from mod_contabilidad.dat_comprobante c where c.idcomprobante = d.idcomprobante) as nrocomprobante, dv.idpersona
          FROM mod_logpuntoventa.dat_devolucion dd
          INNER JOIN mod_logpuntoventa.dat_ventas dv ON (dv.idventas = dd.idventas)
          INNER JOIN mod_logpuntoventa.dat_ventaproducto dvp ON (dvp.idventas = dv.idventas)
          LEFT JOIN mod_logpuntoventa.dat_cajausuario dcu ON (dcu.idcaja = dv.idcaja)
          INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = dd.iddevolucion
          INNER JOIN mod_datosmaestros.dat_documentoprim ddp ON ddp.iddoc = d.iddoc
          INNER JOIN mod_datosmaestros.dat_estructurasubsist des ON des.idestructurasubsist = ddp.idestructurasubsist
          LEFT JOIN mod_logpuntoventa.dat_ventacliente dvc ON (dvc.idventacliente = dv.idpersona)
          WHERE des.idestructuracomun = {$this->global->estructura->idestructura} AND 1 = 1 
        ".$sqlWhere. " ORDER BY dd.iddevolucion desc,dv.idpersona LIMIT {$params['limit']} OFFSET {$params['start']}";
        $sqlc = "SELECT count(distinct dd.iddevolucion) as cantidad
          FROM mod_logpuntoventa.dat_devolucion dd
          INNER JOIN mod_logpuntoventa.dat_ventas dv ON (dv.idventas = dd.idventas)
          INNER JOIN mod_logpuntoventa.dat_ventaproducto dvp ON (dvp.idventas = dv.idventas)
          LEFT JOIN mod_logpuntoventa.dat_cajausuario dcu ON (dcu.idcaja = dv.idcaja)
          INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = dd.iddevolucion
          INNER JOIN mod_datosmaestros.dat_documentoprim ddp ON ddp.iddoc = d.iddoc
          INNER JOIN mod_datosmaestros.dat_estructurasubsist des ON des.idestructurasubsist = ddp.idestructurasubsist
          LEFT JOIN mod_logpuntoventa.dat_ventacliente dvc ON (dvc.idventacliente = dv.idpersona)
          WHERE des.idestructuracomun = {$this->global->estructura->idestructura} AND 1 = 1 
        ".$sqlWhere;
        
        $r = $conn->fetchAll($sql);
        $rc = $conn->fetchAll($sqlc);
        return array('cantidad' => $rc[0]['cantidad'], 'datos' => $r);
    }

    /**
     * @description Adiciona filtros a la consulta
     * @param Doctrine_Query $query
     * @param array $params
     */
    private function filtrersDevoluciones(Doctrine_Query $query, $params)
    {
        if ($params['criterio']) {
            $criterio = is_numeric($params['criterio']) ? $params['criterio'] : 0;
            $query->addWhere(
                "dd.idventas = (SELECT dv2.idventas FROM DatVenta dv2 WHERE dv2.nroventa = ?)", array($criterio)
            );
        }
        if ($params['idestructura']) {
            $query->addWhere(
                'dd.idventas IN (SELECT dv3.idventas FROM DatVenta dv3 INNER JOIN dv3.DatAreaventa dav2 '
                . 'ON dav2.idareaventa = dv3.idareaventa WHERE dav2.idestructuraop = ?)', array($params['idestructura'])
            );
        }
    }

    /**
     * @description Retorna todos los productos devueltos
     * @param array $params
     * @return array
     */
    public function cargarProdDevueltos($params)
    {
        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatProductoDevuelto',
            'properties' => array('local' => 'idproducto', 'foreign' => 'idproducto')
        );
        $this->_logisticaDoctrine->tryInyectRelactions(new DatProductoLogistica(), $relations);
        $productoLogistica = new LogisticaProductoModel();
        $query = $productoLogistica->cargarProductos($params, true);
        $query->innerJoin('p.DatProductoDevuelto dpd')
            ->addWhere('dpd.iddevolucion = ?', array($params['iddevolucion']))
            ->addSelect('dpd.precioventa as precioventa, dpd.cantidaddevolver as cantidaddevolver');
        return array('datos' => $query->fetchArray(), 'cantidad' => $query->count());
    }

    /**
     * @description Realiza la devolución de los productos por cada venta
     * @param array $params
     * @return boolean
     */
    public function realizarDevolucion($params)
    {
        $devolucion = new DatDevolucion();
        $devolucion->synchronizeWithArray($params);
        foreach ($params['productos'] as $prods) {
            $producto = new DatProductoDevuelto();
            $producto->synchronizeWithArray($prods);
            $devolucion->DatProductoDevuelto->add($producto);
            $this->updateExistenciaProducto($params);
        }
        $devolucion->save();
        return true;
    }

    /**
     * @description Actualiza la existencia de los productos en el depósito
     * @param array $params
     * @void
     */
    private function updateExistenciaProducto($params)
    {
        $collection = new Doctrine_Collection('DatProductoLogistica');
        foreach ($params['productos'] as $product) {
            $producto = new DatProductoLogistica();
            $producto->assignIdentifier($product['idproducto']);
            $producto->cantidad += $product['cantidaddevolver'];
            $producto->disponible += $product['cantidaddevolver'];
            $collection->add($producto);
        }
        $collection->save();
    }


    /*f dpublic function obtenerVentasRealizadas($params)
    {
        $dc = Doctrine_Manager::getInstance();
        $conn = $dc->getCurrentConnection();
        $sqlWhere = "";

        if(!empty($params['criterio'])){
            $sqlWhere = " AND (dv.nroventa = {$params['criterio']} OR dvc.numeroidentidad = '{$params['criterio']}') ";
        }

        $sql = "SELECT dv.idventas, dv.idpersona, dv.fechaventa, dv.importe, dv.fechaexpiracion, dv.nroventa, 
        (dvc.numeroidentidad ||' - '||dvc.nombre) as cliente,
        (select count(dvp.idventaproducto) FROM mod_logpuntoventa.dat_ventaproducto dvp WHERE dvp.idventas = dv.idventas) as cantidadproductos
          FROM mod_logpuntoventa.dat_ventas dv
        INNER JOIN mod_logpuntoventa.dat_areaventa dav ON (dav.idareaventa = dv.idareaventa)
        LEFT JOIN mod_logpuntoventa.dat_ventacliente dvc ON (dvc.idventacliente = dv.idpersona)
        WHERE dv.estado = 2 AND dv.idventas NOT IN (SELECT idventas FROM mod_logpuntoventa.dat_devolucion) "
        .$sqlWhere. " LIMIT {$params['limit']} OFFSET {$params['start']}";

        $sqlc = "SELECT count(dv.idventas) as cantidad
          FROM mod_logpuntoventa.dat_ventas dv
        INNER JOIN mod_logpuntoventa.dat_areaventa dav ON (dav.idareaventa = dv.idareaventa)
        LEFT JOIN mod_logpuntoventa.dat_ventacliente dvc ON (dvc.idventacliente = dv.idpersona)
        WHERE dv.estado = 2 AND dv.idventas NOT IN (SELECT idventas FROM mod_logpuntoventa.dat_devolucion) "
        .$sqlWhere;

        $r = $conn->fetchAll($sql);
        $rc = $conn->fetchAll($sqlc);
        $resultado = array();
        $resultado['datos'] = $r;
        $resultado['cantidad'] = $rc[0]['cantidad'];

        return $resultado;

    }*/

    public function obtenerProductosVendidos($params)
    {
        $idventas = $params['idventas'];
        $dc = Doctrine_Manager::getInstance();
        $conn = $dc->getCurrentConnection();
        $sql = "SELECT q.* FROM (SELECT dvp.idproducto, dvp.idventas, (coalesce(dvp.cantidad,0)-coalesce(dvp.cantidaddev,0)) as cantidadvendida, 
                dvp.recargo, dvp.descuento, dvp.precio, dvp.importetotal, 
          (coalesce(i.numeropieza,i.codigo)||' - '||i.denominacion) as codigodenominacionproducto, 
          0 as cantidaddevolver, 0 as importedevolver,
          dvs.idmoneda as idmoneda,dvp.idventaproducto as idventaproducto, i.tipo 
          FROM mod_logpuntoventa.dat_ventaproducto dvp
          INNER JOIN mod_logistica.dat_producto dp ON (dp.idproducto = dvp.idproducto)
          INNER JOIN mod_datosmaestros.nom_indicador i ON (i.idindicador = dp.idindicador)
          INNER JOIN mod_logpuntoventa.dat_ventas dvs ON (dvp.idventas = dvs.idventas)
        UNION
        SELECT -1 as idproducto, dvp.idventas, (coalesce(dvp.cantidad,0)-coalesce(dvp.cantidaddev,0)) as cantidadvendida, 
                dvp.recargo, dvp.descuento, dvp.precio, dvp.importetotal, 
          (coalesce(i.numeropieza,i.codigo)||' - '||i.denominacion) as codigodenominacionproducto, 
          0 as cantidaddevolver, 0 as importedevolver,
          dvs.idmoneda as idmoneda,dvp.idventaservicio as idventaproducto, i.tipo 
          FROM mod_logpuntoventa.dat_ventaservicio dvp
          INNER JOIN mod_datosmaestros.nom_indicador i ON (i.idindicador = dvp.idindicador)
          INNER JOIN mod_logpuntoventa.dat_ventas dvs ON (dvp.idventas = dvs.idventas)) q
          WHERE q.idventas = ? order by q.tipo";


        $r = $conn->fetchAll($sql, array($idventas));
        $resultado = array();
        $resultado['datos'] = $r;
        $resultado['cantidad'] = count($r);

        return $resultado;
    }

    public function obtenerProductosDevTotal($idventas)
    {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT dvp.idproducto as idproducto,dp.idproducto, dvp.cantidad as cantidadcomprada, 
            (coalesce(dvp.cantidad,0)-coalesce(dvp.cantidaddev,0)) as cantidaddevolver,dvp.recargo, dvp.descuento, dvp.precio as precioventa, 
            dvp.importetotal as importe, dvs.idmoneda as idmoneda,(coalesce(dvp.cantidad,0)-coalesce(dvp.cantidaddev,0)) as cantidad,
            dvp.idventaproducto as idventaproducto 
            FROM mod_logpuntoventa.dat_ventaproducto dvp
            INNER JOIN mod_logistica.dat_producto dp ON (dp.idproducto = dvp.idproducto)
            INNER JOIN mod_logpuntoventa.dat_ventas dvs ON (dvp.idventas = dvs.idventas)
            WHERE dvp.idventas = ? and ((coalesce(dvp.cantidad,0)-coalesce(dvp.cantidaddev,0)) > 0)";

        $r = $conn->execute($sql,array($idventas))->fetchAll(PDO::FETCH_ASSOC);
        return $r;
    }

    public function obtenerServiciosDevTotal($idventas)
    {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT -1 as idproducto, dvp.idindicador, dvp.cantidad as cantidadcomprada, 
            (coalesce(dvp.cantidad,0)-coalesce(dvp.cantidaddev,0)) as cantidaddevolver,dvp.recargo, dvp.descuento, dvp.precio as precioventa, 
            dvp.importetotal as importe, dvs.idmoneda as idmoneda,(coalesce(dvp.cantidad,0)-coalesce(dvp.cantidaddev,0)) as cantidad,
            dvp.idventaservicio as idventaproducto 
            FROM mod_logpuntoventa.dat_ventaservicio dvp
            INNER JOIN mod_logpuntoventa.dat_ventas dvs ON (dvp.idventas = dvs.idventas)
            WHERE dvp.idventas = ? and ((coalesce(dvp.cantidad,0)-coalesce(dvp.cantidaddev,0)) > 0)";

        $r = $conn->execute($sql,array($idventas))->fetchAll(PDO::FETCH_ASSOC);
        return $r;
    }

    public function devolverVenta($arrParametros){
        $conn = Doctrine_Manager::connection();
        
        $objVentas = Doctrine::getTable('DatVenta')->find($arrParametros['idventas']);
        $objVentas->importedevuelto += $arrParametros['totalefectivodevuelto'];
        $objDevolucion = new DatDevolucion();
        $objDevolucion->iddevolucion = $arrParametros['iddevolucion'];
        $objDevolucion->idventas = $arrParametros['idventas'];
        $objDevolucion->motivodevolucion = $arrParametros['motivo'];
        $objDevolucion->totalefectdevuelto = $arrParametros['totalefectivodevuelto'];
        $objDevolucion->fecha = $arrParametros['fechadevolucion'];
        $objDevolucion->tipodevolucion = $arrParametros['tipodevolucion'];
        $objDevolucion->save();
        $objVentas->save();

        if($arrParametros['tipodevolucion'] == 1){/*Devolucion total*/
            $collMoneda = new Doctrine_Collection('DatMovmoneda');
            $collProdDev = new Doctrine_Collection('DatProductoDevuelto');
            $collProdVent = new Doctrine_Collection('DatVentaproducto');

            $collServDev = new Doctrine_Collection('DatServicioDevuelto');
            $collServVent = new Doctrine_Collection('DatVentaservicio');
            foreach ($arrParametros['movimientos'] as $index => $mov) {
                $producto = $arrParametros['productos'][$index];
                $producto['iddevolucion'] = $arrParametros['iddevolucion'];
                $ventaprod = Doctrine::getTable('DatVentaproducto')->find($producto['idventaproducto']);
                $ventaprod->cantidaddev += $producto['cantidad'];
                $collProdVent->add($ventaprod);
                $movMoneda = new DatMovmoneda();
                $movMoneda->idmoneda = $arrParametros['idmoneda'];
                $movMoneda->idmovimiento = $mov['idmovimiento'];
                $movMoneda->precio = $producto['precioventa'];
                $movMoneda->importe = $producto['importetotal'];
                $collMoneda->add($movMoneda);
                unset($producto['idmoneda']);
                $devProducto = new DatProductoDevuelto();
                $devProducto->synchronizeWithArray($producto);
                $collProdDev->add($devProducto);
            }

            foreach ($arrParametros['servicios'] as $mov) {
                $servicio = (array)$mov;
                $servicio['iddevolucion'] = $arrParametros['iddevolucion'];
                $ventaserv = Doctrine::getTable('DatVentaservicio')->find($servicio['idventaproducto']);
                $ventaserv->cantidaddev += $servicio['cantidad'];
                $collServVent->add($ventaserv);
                $devServicio = new DatServicioDevuelto();
                $devServicio->synchronizeWithArray($servicio);
                $collServDev->add($devServicio);
            }
            $collMoneda->save();                 
            $collProdDev->save(); 
            $collProdVent->save();

            $collServDev->save();
            $collServVent->save();

            $insert = "insert into mod_logpuntoventa.dat_desglosepago(iddocumento, idformapago, importe) 
                      (select {$arrParametros['iddevolucion']}, dp.idformapago, dp.importe from mod_logpuntoventa.dat_desglosepago dp 
                      where dp.iddocumento = {$arrParametros['idventas']})";
            LogisticaDoctrineHelper::__init()->getConnection()->execute($insert);
            
            /*$sqlInsert = "INSERT INTO mod_logpuntoventa.dat_productodevolucion(iddevolucion, idproducto, cantidadcomprada, 
            precioventa, recargo, importe, descuento, cantidaddevolver)
            SELECT {$objDevolucion->iddevolucion} as iddevolucion, idproducto, cantidad, precio, recargo, importetotal, descuento, 
            cantidad as cantidaddevolver
            FROM mod_logpuntoventa.dat_ventaproducto WHERE idventas = ?;";
            $conn->execute($sqlInsert, array($arrParametros['idventas']));*/

        }else{/*Devolucion parcial*/

            $collMoneda = new Doctrine_Collection('DatMovmoneda');
            $collProdDev = new Doctrine_Collection('DatProductoDevuelto');
            $collProdVent = new Doctrine_Collection('DatVentaproducto');

            $collServDev = new Doctrine_Collection('DatServicioDevuelto');
            $collServVent = new Doctrine_Collection('DatVentaservicio');
            foreach ($arrParametros['movimientos'] as $mov) {
                $producto = $arrParametros['productos'][$mov['idproducto']];
                $producto['iddevolucion'] = $arrParametros['iddevolucion'];
                $ventaprod = Doctrine::getTable('DatVentaproducto')->find($producto['idventaproducto']);
                $ventaprod->cantidaddev += $producto['cantidad'];
                $collProdVent->add($ventaprod);
                $movMoneda = new DatMovmoneda();
                $movMoneda->idmoneda = $producto['idmoneda'];
                $movMoneda->idmovimiento = $mov['idmovimiento'];
                $movMoneda->precio = $producto['precioventa'];
                $movMoneda->importe = $producto['importetotal'];
                $collMoneda->add($movMoneda);
                unset($producto['idmoneda']);
                $devProducto = new DatProductoDevuelto();
                $devProducto->synchronizeWithArray($producto);
                $collProdDev->add($devProducto);
            }

            foreach ($arrParametros['servicios'] as $mov) {
                $servicio = (array)$mov;
                $servicio['iddevolucion'] = $arrParametros['iddevolucion'];
                $ventaserv = Doctrine::getTable('DatVentaservicio')->find($servicio['idventaproducto']);
                $ventaserv->cantidaddev += $servicio['cantidad'];
                $collServVent->add($ventaserv);
                $devServicio = new DatServicioDevuelto();
                $devServicio->synchronizeWithArray($servicio);
                $collServDev->add($devServicio);
            }
            $collMoneda->save();
            $collProdDev->save();
            $collProdVent->save();

            $collServDev->save();
            $collServVent->save();

            if(isset($arrParametros['desglose'])){
                $desglose = json_decode($arrParametros['desglose']);
                $paymentValues = [];
                foreach ($desglose as $pago) {
                    $paymentValues[] = "({$arrParametros['iddevolucion']},{$pago->idpago},{$pago->importedevolver})";
                }
                $paymentValues = implode(',', $paymentValues);
                $insert = "insert into mod_logpuntoventa.dat_desglosepago(iddocumento, idformapago, importe) values {$paymentValues}";
                LogisticaDoctrineHelper::__init()->getConnection()->execute($insert);
            }
            /*$productos = $arrParametros['productos'];
            foreach ($productos as $p){
                $sqlInsert = "INSERT INTO mod_logpuntoventa.dat_productodevolucion(iddevolucion, idproducto, cantidadcomprada, 
                    precioventa, recargo, importe, descuento, cantidaddevolver)
                    VALUES ({$objDevolucion->iddevolucion}, {$p['idproducto']}, {$p['cantidadcomprada']}, {$p['precioventa']}
                    , {$p['recargo']}, {$p['importe']}, {$p['descuento']}, {$p['cantidad']})";

                $conn->execute($sqlInsert);
            }*/

        }
        $tienda = "select nv.nombre from mod_logistica.nom_variableglobal nv 
                          where nv.nombre = 'TV_EXIST' and nv.valor = 'true'";
        $existeTienda = LogisticaDoctrineHelper::__init()->getConnection()->execute($tienda)->fetchAll(PDO::FETCH_COLUMN);
        if(count($existeTienda)) {
            $this->devolverTienda($arrParametros);
        }
        return array('codigo' => 1);
    }

    public function devolverTienda($parametros) {
        $documento = Doctrine::getTable('DatDocumento')->find($parametros['idventas']);
        $docVenta = Doctrine::getTable('DatVenta')->find($parametros['idventas']);
        $sqlExiste = "select pd.idpedido from mod_logpuntoventa.dat_pedidodocumento pd 
                          where pd.iddocumento = {$parametros['idventas']}";
        $existe = LogisticaDoctrineHelper::__init()->getConnection()->execute($sqlExiste)->fetchAll(PDO::FETCH_COLUMN);
        if (count($existe)) {
            $sqlPedido = "select pt.* from mod_logpuntoventa.dat_pedidotienda pt
                      where pt.idpedidotienda = {$existe[0]}";
            $datosPedido = LogisticaDoctrineHelper::__init()->getConnection()->execute($sqlPedido)->fetchAll(PDO::FETCH_ASSOC);
            $query = Doctrine_Query::create()->select('da.*,inf.*')->from('DatAreaventa da')
                ->leftJoin('da.DatInfoConexion inf');
            $query->where('da.idareaventa = ?', array($datosPedido[0]['idareaventa']));
            $areaVenta = Doctrine::getTable('DatAreaventa')->find($docVenta->idareaventa);
            $infoConfig = $query->fetchArray();
            $infoConect = $infoConfig[0]['DatInfoConexion'];
            $iddeposito = $documento->idestructuracomun;
            $usuarioez = $areaVenta->usuarioez;
            unset($infoConfig[0]['DatInfoConexion']);
            if ($infoConect['tipo'] == "ps") {
                $factory = new ExternalIntegrationFactory($infoConect['tipo']);
                $factory->setStoreConfig(array('URL' => $infoConect['url'], 'KEY' => $infoConect['clave'], 'DEBUG' => false))->connect();
            }
            $arrayProd = array();
            $importe = 0;
            $sumDev = 0;
            foreach ($parametros['productos'] as &$pAux) {
                $prodPedido = "select dpp.idproductopedido from mod_logpuntoventa.dat_pedidoproducto dpp
                      where dpp.codreferencia = '{$pAux['codreferencia']}' and dpp.idpedidotienda = {$existe[0]}";
                $idprodpedido = LogisticaDoctrineHelper::__init()->getConnection()->execute($prodPedido)->fetchAll(PDO::FETCH_COLUMN);
                $pAux['idproductopedido'] = $idprodpedido[0];
                $arrayProd[$pAux['codreferencia']] = $pAux;
                $importe += round($pAux['precio']*$pAux['devolver'],2);
                $sumDev += $pAux['devolver'];
            }
            if ($parametros['descuento'] && is_numeric($parametros['descuento'])) {
                $importe -= round(($importe*$parametros['descuento']/100),2);
            }
            if (isset($factory)) {
                $id_orderslip = $factory->devolverPedido($datosPedido[0]['idreferencia'], $arrayProd);
            }
            $devuelto = Doctrine_Manager::connection()->fetchAll(
                "SELECT SUM(dpp.cantidad) as cantidad, SUM(dpp.devuelto) as devuelto FROM mod_logpuntoventa.dat_pedidoproducto dpp
                 where dpp.idpedidotienda = {$existe[0]}"
            );
            if ($devuelto[0]['cantidad'] > $devuelto[0]['devuelto']+$sumDev) {
                if (isset($factory)) {
                    $factory->cambiarEstado($datosPedido[0]['idreferencia'], 3);
                }
            } else {
                Doctrine_Manager::connection()->fetchAll(
                    "update mod_logpuntoventa.dat_pedidotienda
                 set estado = 7 where idpedidotienda = {$existe[0]}"
                );
            }
            $anno = date('Y');
            $nroDevSql = "select max(dev.numero) from mod_logpuntoventa.dat_pedidotiendadevolucion dev
                      where dev.idareaventa = {$datosPedido[0]['idareaventa']} and dev.anno = {$anno}";
            $nroDev = LogisticaDoctrineHelper::__init()->getConnection()->execute($nroDevSql)->fetchAll(PDO::FETCH_COLUMN);
            $nroDev = (count($nroDev) && $nroDev[0]) ? $nroDev[0]+1 : 1;
            //devolviendo enzona
            $devEZ = "select count(nv.nombre) from mod_logistica.nom_variableglobal nv
                      where nv.nombre = 'DEV_EZ' and nv.valor = 'true'";
            $existeDevEz = LogisticaDoctrineHelper::__init()->getConnection()->execute($devEZ)->fetchAll(PDO::FETCH_COLUMN);
            $respEnzObj = null;
            $entidad = Doctrine_Manager::connection()->fetchAll(
                "SELECT (est.codigo||' '||est.denominacion) as entidad  FROM mod_estructuracomp.v_dametodasestructuras est
                                where est.idestructura = {$this->global->Estructura->idestructura}"
            );
            $usuario = Doctrine_Manager::connection()->fetchAll(
                "SELECT seg.nombreusuario as usuario FROM mod_seguridad.seg_usuario seg
                                where seg.idusuario = {$this->global->Perfil->idusuario}"
            );
            $descripcion = "{$entidad[0]['entidad']} Devolucion de pedido ".$datosPedido[0]['nropedido'].' usuario '.$usuario[0]['usuario'];
            $commercerefundid = '';
            if ($existeDevEz[0] > 0 && $infoConect['tipo'] == "ps") {
                $deposito = Doctrine_Manager::connection()->fetchAll(
                    "SELECT est.codigo as deposito  FROM mod_estructuracomp.v_dametodasestructuras est
                                 where est.idestructura = {$iddeposito}"
                );
                $commercerefundid = $this->objectHelper->gcommerceRefundId(array(
                    'coddeposito' => $deposito[0]['deposito'],
                    'consecutivo' => $nroDev
                ));
                $enzonaTemp = LogisticaGlobal::__init()->getEznContainer();
                $data = array(
                    'consumerKey' => $infoConect['consumerkey'],
                    'consumerSecret' => $infoConect['consumersecret'],
                    'monto' => $importe,
                    'transaction_uuid' => $datosPedido[0]['idtransaccion'],
                    'commercerefundid' => $commercerefundid,
                    'usuario' => $usuarioez,
                    'descripcion' => $descripcion
                );
                $respEnz = $enzonaTemp->refund($data);
                $respEnzObj = json_encode($respEnz);
            }
            $sqlDev = "INSERT INTO mod_logpuntoventa.dat_pedidotiendadevolucion
                (
                  idpedidotienda,importe,idusuario,refund_response,idareaventa,numero,descripcion,commercerefundid
                )
                VALUES ({$datosPedido[0]['idpedidotienda']},{$importe},{$this->global->Perfil->idusuario},'{$respEnzObj}',
                {$datosPedido[0]['idareaventa']},{$nroDev},'{$descripcion}','{$commercerefundid}')
                returning idpedidodevolucion";
            $iddev = Doctrine_Manager::connection()->fetchAll($sqlDev);
            $sqlInsertProdDev = "INSERT INTO mod_logpuntoventa.dat_pedidoproductodev
                        (
                          idpedidodevolucion,idproductopedido,cantidad,importe
                        ) VALUES";
            $pos = 0;
            foreach ($parametros['productos'] as $index => $p) {
                $sqlInsertProdDev .= " (
                              {$iddev[0]['idpedidodevolucion']},{$p['idproductopedido']},{$p['devolver']},round({$p['devolver']}*{$p['precio']},2)
                            )";
                if ($pos+1 < count($parametros['productos'])) {
                    $sqlInsertProdDev .= ',';
                }
                $pos += 1;
            }
            Doctrine_Manager::connection()->fetchAll($sqlInsertProdDev);
        }
    }
}
