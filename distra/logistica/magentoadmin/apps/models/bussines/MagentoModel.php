<?php

/**
 * Class MagentoModel
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()
            ->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

/**
 * Testing  2
 */
class   MagentoModel extends BaseModel
{

    private $reportConfig;
    private $variablesGlobales;

    /**
     * MagentoModel constructor.
     * @param false $esExterno
     */
    public function __construct($esExterno = false)
    {
        parent::__construct($esExterno);
        $this->reportConfig = parse_ini_file('config_report.ini');
        $this->variablesGlobales = new VariablesGlobalesModel();
    }

    /**
     *
     */
    public function devolverOrdenes($params)
    {
        $estadoInicial = '';
        $sqlGet = "select mgo.id,mgo.id as nroorodenventa, fct, fcb, (case when transferido = 1 then 'Si' else 'No' end) as transferido,
       (case when estadoov = 1 then 'Pago pendiente' 
           when estadoov = 2 then 'Pago aceptado' 
           when estadoov = 3 then 'Entregado en el cliente' 
           else '' end) as estadoov,esatdofac,
       (case when esatdofac = 1 then 'Sin generar' 
           when esatdofac = 2 then 'Generada' 
           when esatdofac = 3 then 'Contabilizada' 
           else '' end) as estadofac , mgo.direccion, entregar, mgo.importe, idueb, mercancia, transportacion, vest.denominacion as ueb,
       count(mgo.id) over () as total, mgo.fechaentrega as fef, coalesce(ddf.nrofactura, dd.numeroref) as nfactura
                from mod_logfacmagentoadmin.dat_mgtorders mgo
                left join mod_estructuracomp.v_dametodasestructuras vest on vest.idestructura = mgo.idueb
                left join mod_logfacturacion.dat_docfactura ddf on ddf.nrorden = mgo.id
                left join mod_logistica.dat_documento dd on dd.iddocumento = ddf.idfactura";
        $sqlGet .= $this . $this->getSearchParams($params);
        $sqlGet .= " order by mgo.id asc offset {$params['start']} limit {$params['limit']}";
        $data = LogisticaDoctrineHelper::__init()->executeQuery($sqlGet)->fetchAll(PDO::FETCH_ASSOC);
        return array('datos' => $data, 'cantidad' => $data[0]['total']);
    }

    /**
     * @param $params
     * @return array
     */
    public function cargarProductos($params)
    {
        $filter = [];
        if (isset($params['query'])) {
            $filter[] = " ni.numeropieza ilike '%{$params['query']}%'";
            $filter[] = " ni.denominacion ilike '%{$params['query']}%'";
            if ($this->variablesGlobales->obtenerValor('isNovaBank') == 1) {
                $filter[] = " dp.numerolote ilike '%{$params['query']}%'";
            }
        }
        $andSql = (count($filter) > 0) ? " and (" . implode(" or ", $filter) . ")" : "";

        if ($params['orderId']) {
            $sqlProductos = "select mgi.orderid, mgi.productid, mgi.cantidad, mgi.precio, mgi.importe, coalesce( ncp.codigo || '-' || ncp.nombre , ncp.nombre) as fabricante,
                    ni.denominacion, ni.numeropieza as codigo, count(mgi.productid) over() as total
                from mod_logfacmagentoadmin.dat_mgtorderitems mgi
                join mod_datosmaestros.nom_indicador ni on ni.idindicador = mgi.productid
                left join mod_datosmaestros.nom_clientesproveedor ncp on ncp.idclientesproveedores = ni.idfabricante
                where mgi.orderid = '{$params['orderId']}' $andSql  
                order by ni.numeropieza asc offset {$params['start']} limit {$params['limit']}";
            $datos = LogisticaDoctrineHelper::__init()->executeQuery($sqlProductos)->fetchAll(PDO::FETCH_ASSOC);
        } else {
            if ($this->variablesGlobales->obtenerValor('isNovaBank') == 1) {
                $storageId = $this->variablesGlobales->obtenerValor('novaBankStorage');
                $sqlProductos = "select ni.idindicador as idindicador, TRIM(CONCAT_WS(' ', ni.numeropieza, ni.denominacion, dp.numerolote, dp.precio::money)) as text,
                    dp.idproducto as productid,
                    ni.numeropieza as code, ni.denominacion as name, dp.precio as price, count(dp.idproducto) over() as total
                    from mod_logistica.dat_producto dp
                    join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
                    where dp.idestructura = $storageId and dp.cantidad > 0  {$andSql}
                    order by ni.numeropieza asc, dp.numerolote offset {$params['start']} limit {$params['limit']}";
                $datos = LogisticaDoctrineHelper::__init()->executeQuery($sqlProductos)->fetchAll(PDO::FETCH_ASSOC);
            } else {
                LogisticaComponentService::__init()->initComponent('log.lb.maestroproductos', true);
                $params['almacenado'] = 1;
                if ($params['query']) {
                    $params['criterio'] = $params['query'];
                }
                return (new MaestroProductoModel())->cargarGridNomenclador($params);
            }

        }
        return array('datos' => $datos, 'cantidad' => $datos[0]['total']);
    }

    /**
     * @param $params
     * @return string
     */
    private function getSearchParams($params)
    {
        $arrayConditions = array();
        if ($params['criterio']) {
            $arrayConditions[] = '(' . implode(' or ', array("mgo.direccion ilike '%{$params['criterio']}%'", "mgo.id like '%{$params['criterio']}%'")) . ')';
        }
        if (isset($params['estadoov']) && $params['estadoov'] != '') {

            $arrayConditions[] = $params['estadoov'] != -1 ? "mgo.estadoov ={$params['estadoov']}" : "mgo.estadoov in(1,2,3)";
        } else {
            $arrayConditions[] = "mgo.estadoov in(1)";
        }
        if (isset($params['estadofac']) && !is_null($params['estadofac'])) {
            $arrayConditions[] = "mgo.estadofac ={$params['estadofac']}";
        }
        if (isset($params['direccion'])) {
            $arrayConditions[] = "mgo.direccion  ilike '%{$params['direccion']}%'";
        }

        if (isset($params['fabricante'])) {
            $arrayConditions[] = "(ncp.nombre  ilike '%{$params['fabricante']}%' OR ncp.codigo  ilike '%{$params['fabricante']}%')";
        }
        if (isset($params['idueb']) && $params['idueb'] != -1) {
            $arrayConditions[] = $params['idueb'] != -2 ? "mgo.idueb ={$params['idueb']}" : "mgo.idueb is null";
        }
        if (count($arrayConditions)) {
            return ' where ' . implode(' and ', $arrayConditions);
        }
        return '';
    }

    /**
     * @param $params
     * @return array
     */
    public function obtenerUEB($params)
    {
        $sqlSelect = "select v.idestructura as id, v.denominacion
                        from mod_estructuracomp.v_dametodasestructuras v where v.idconcepto = 5 and v.idorgano = -2";
        $data = LogisticaDoctrineHelper::__init()->executeQuery($sqlSelect)->fetchAll(PDO::FETCH_ASSOC);
        $dataMerge = array();
        if ($params['ueb'] == 1) {
            $dataMerge = array(array('id' => -1, 'denominacion' => 'Todas'), array('id' => -2, 'denominacion' => 'Sin UEB'));
        }
        return array('datos' => array_merge($dataMerge, $data));
    }

    /**
     * @param $params
     * @return bool[]
     */
    public function salvarUEB($params)
    {
        $id = implode("','", $params['idorden']);
        $sqlUpd = "update mod_logfacmagentoadmin.dat_mgtorders mgo set idueb = {$params['idueb']} where  mgo.id in ('{$id}');";
        LogisticaDoctrineHelper::__init()->executeQuery($sqlUpd);
        return array('success' => true);
    }

    /**
     * @param $file
     * @param $params
     */
    public function importarFichero($datos, $params)
    {
        foreach ($datos as $row) {
            $sqlVerify = "select count(dto.id) as cantidad from mod_logfacmagentoadmin.dat_mgtorders dto where dto.id ='{$row['id']}'";
            $data = LogisticaDoctrineHelper::__init()->executeQuery($sqlVerify)->fetchAll(PDO::FETCH_ASSOC);
            if ($data[0]['cantidad'] == 0) {
                $sqlInsert = "insert into mod_logfacmagentoadmin.dat_mgtorders (id, fct, estadoov, direccion, entregar, importe,  mercancia, transportacion,idueb)
                                values ('{$row['id']}','{$row['fecha']}',1,'{$row['direccion']}','{$row['cliente']}',{$row['importe']},{$row['mercancia']},{$row['transporte']},{$row['provincia']})";
                LogisticaDoctrineHelper::__init()->executeQuery($sqlInsert);
            }
            /*Insertar producto**/
            $buscaProd = "select idindicador from mod_datosmaestros.nom_indicadorhoja ih where codigoauxiliar ilike '{$row['codigo']}' limit 1";
            $dataProd = LogisticaDoctrineHelper::__init()->executeQuery($buscaProd)->fetchAll(PDO::FETCH_ASSOC);

            if (count($dataProd) && $dataProd[0]['idindicador']) {
                $id = $dataProd[0]['idindicador'];
                $sqlVerify = "select count(dto.productid) as cantidad from mod_logfacmagentoadmin.dat_mgtorderitems dto 
								where dto.orderid ='{$row['id']}' and dto.productid = $id";
                $data = LogisticaDoctrineHelper::__init()->executeQuery($sqlVerify)->fetchAll(PDO::FETCH_ASSOC);

                if ($data[0]['cantidad'] == 0) {
                    $sqlInsertP = "insert into mod_logfacmagentoadmin.dat_mgtorderitems(orderid, productid, cantidad, precio, importe) 
									values ('{$row['id']}', $id,{$row['cantidad']},{$row['precio']},{$row['importeprod']})";
                    LogisticaDoctrineHelper::__init()->executeQuery($sqlInsertP);
                }
            }
        }
        return true;
    }

    /**
     * @param $datos
     * @param $params
     * @return array
     */
    public function importarFicheroCSV($datos, $params)
    {
        //print_r($datos);die;
        foreach ($datos as $index => $row) {
            $row = /*is_array($row) ? $row :*/
                explode(',', $row[0]);
            $fecha = substr($row[1], 1, -8);
            $id = substr($row[0], 2, -1);
            if ($index > 0) {
                //print_r($row);die;

                $sqlUpd = "update mod_logfacmagentoadmin.dat_mgtorders mgo set estadoov = 2, fcb = '{$fecha}' where  mgo.id = '{$id}';";
                LogisticaDoctrineHelper::__init()->executeQuery($sqlUpd);
            }
        }
        return array();
    }

    /**
     * @param $datosExcel
     * @param $param
     * @return mixed
     */
    public function sincronizarArray($datosExcel, $param)
    {
        $datosRes = array();
        foreach ($datosExcel as $pos => $row) {
            $datosExcel[$pos][2] = substr($row[2], 0, -3);
            $datosRes[] = array(
                'id' => $row[0],
                'cliente' => strtoupper($this->string_sanitize($row[7])),
                'direccion' => strtoupper($this->string_sanitize($row[13])),
                'fecha' => substr($row[2], 0, -3),
                'importe' => $row[33],
                'mercancia' => $row[33] - $row[35],
                'transporte' => $row[35],
                'provincia' => $this->provincia($row[10]),
                'codigo' => $row[4],
                'cantidad' => $row[16],
                'precio' => $row[20],
                'importeprod' => $row[22],
            );
        }
        //print_r($datosRes);die;
        return $datosRes;
    }

    /**
     * @param $str
     * @return string|string[]
     */
    private function string_sanitize($str)
    {
        return str_replace(array('\'', '"', '\n'), '', html_entity_decode($str, ENT_QUOTES));
    }

    private function provincia($string)
    {
        $pos = strpos($string, '/');
        $string = ($pos == false ? $string : substr($string, 0, $pos));
        switch ($string) {
            case 'Pinar del Río':
            case 'Pinar del Rio':
            case 'Artemisa':
                return 200531044;
            case 'La Habana':
            case 'Maybeque':
            case 'Mayabeque':
                return 200531042;
            case 'Camagüey':
            case 'Camaguey':
            case 'Ciego de Ávila':
            case 'Ciego de Avila':
            case 'Moron':
            case 'Morón':
                return 200531047;
            case 'Villa Clara':
            case 'Cienfuegos':
            case 'Sancti Spiritus':
            case 'Sancti Spíritus':
                return 200531046;
            case 'Las Tunas':
                return 200531048;
            case 'Holguín':
            case 'Holguin':
            case 'Granma':
                return 200531049;
            case 'Santiago de Cuba':
            case 'Guantanamo':
                return 200531050;
            case 'Matanzas':
                return 200531045;
            default:
                return 'null';
        }
    }

    /**
     * @param $uiParams
     */
    public function salvarProducto($uiParams)
    {
        LogisticaDoctrineHelper::__init()->executeQuery(
            "insert into mod_logfacmagentoadmin.dat_mgtorderitems(orderid, productid, cantidad, precio, importe,storageproductid) 
                values('{$uiParams['idorden']}',{$uiParams['idproducto']},{$uiParams['cantidad']},
                       {$uiParams['precio']},round({$uiParams['precio']}*{$uiParams['cantidad']},2), {$uiParams['productid']})");
        $amount = round($uiParams['precio'] * $uiParams['cantidad'], 2);
        LogisticaDoctrineHelper::__init()->executeQuery("update  mod_logfacmagentoadmin.dat_mgtorders
            set importe = coalesce(importe,0)  + {$amount},mercancia = coalesce(mercancia,0)  + {$amount}  where id = '{$uiParams['idorden']}'");
        return array('success' => true);
    }

    public function eliminarProductos($uiParams)
    {
        $sqlUpd = "delete from mod_logfacmagentoadmin.dat_mgtorderitems where orderid = '{$uiParams['idorden']}' and productid = {$uiParams['productid']};";
        LogisticaDoctrineHelper::__init()->executeQuery($sqlUpd);
        return array('success' => true);
    }

    public function eliminarOrden($uiParams)
    {
        $sqlUpd = "delete from mod_logfacmagentoadmin.dat_mgtorders where id = '{$uiParams['idorden']}';";
        LogisticaDoctrineHelper::__init()->executeQuery($sqlUpd);
        return array('success' => true);
    }

    /**
     * @param $uiParams
     * @return bool[]
     */
    public function entregarOrden($uiParams)
    {
        $id = implode("','", $uiParams['idorden']);
        $sqlUpd = "update mod_logfacmagentoadmin.dat_mgtorders mgo set estadoov = 3 , esatdofac = 3, fechaentrega = '{$uiParams['fecha']}' where  mgo.id in ('{$id}');";
        LogisticaDoctrineHelper::__init()->executeQuery($sqlUpd);
        return array('success' => true);
    }

    public function getConsolidacion($params, $total = false)
    {
        $rParmas = array(
            'format' => 'excel',
            'ueb' => $params['ueb'] == -1 ? -1 : $this->global->Estructura->idestructura,
        );
        $reporte = $total == true ? $this->reportConfig['RPT_TOTAL'] : $this->reportConfig['RPT_CONSOL'];
        return LogisticaGlobal::__init()->getRSContainer()->getURL($total == true ? '1099598' : '1099371', $rParmas);
    }

    public function transferirProductos($uiParams)
    {
        $rParmas = array(
            'format' => 'json',
            'ueb' => $this->global->Estructura->idestructura,
        );
        $datos = LogisticaGlobal::__init()->getRSContainer()->execute($this->reportConfig['RPT_TRANSINT'], $rParmas);
        if (count($datos) > 0) {
            $datosDoc = array();
            $datosDoc['idcliente'] = array(
                array('idcliente' => $datos[0]['idcomelect'], 'tipocliente' => 3)
            );
            $datosDoc['tipodestino'] = 3;
            $datosDoc['tipodistribucion'] = 3;
            $productosTransf = array();
            foreach ($datos as $producto) {
                $datosProducto = LogisticaGlobal::__init()->getRSContainer()->execute($this->reportConfig['RPT_DISPONIBLE'], array('format' => 'json', 'idproducto' => $producto['idconsig']));
                if ($producto['idconsig'] != -1 && $datosProducto[0]['disponible'] >= $producto['canttotal']) {
                    $cantidad = $datosProducto[0]['disponible'];
                    array_push($productosTransf, array(
                        'idproducto' => $producto['idconsig'],
                        'rotar' => 1,
                        'cantidad' => $producto['canttotal'] > $cantidad ? $cantidad : $producto['canttotal']
                    ));
                }
            }
            $res = $this->crearDistribucion($datosDoc, $productosTransf);
            $sqlUpdate = "update mod_logfacmagentoadmin.dat_mgtorders set transferido = 1 where idueb = {$rParmas['ueb']} and transferido = 0 and esatdofac = 1";
            LogisticaDoctrineHelper::__init()->executeQuery($sqlUpdate);
            return array('success' => $res, 'msg' => $datosDoc['mensaje']);
        }
        return array('failure' => true);
    }

    public function cierreFacturacion()
    {
        $ueb = $this->global->Estructura->idestructura;
        $sqlUpdate = "update mod_logfacmagentoadmin.dat_mgtorders set transferido = 0 where idueb = {$ueb} and and esatdofac = 1";
        LogisticaDoctrineHelper::__init()->executeQuery($sqlUpdate);
    }

    private function devolverProductosFacturar($ordenId)
    {
        $sqlProductos = "select mgi.orderid, mgi.productid, mgi.cantidad, mgi.precio, mgi.importe, esatdofac,
                coalesce((
                    select dp.idproducto from mod_logistica.dat_producto dp
                    join mod_estructuracomp.v_dametodasestructuras ves on ves.idestructura = dp.idestructura
                    where dp.idestructuracomun = {$this->global->Estructura->idestructura} 
                      and ves.codigo = '400' and dp.idindicador = mgi.productid and dp.cantidad >= mgi.cantidad
                ) ,-1) as idproducto,
                coalesce((
                    select dp.idestructura from mod_logistica.dat_producto dp
                    join mod_estructuracomp.v_dametodasestructuras ves on ves.idestructura = dp.idestructura
                    where dp.idestructuracomun = {$this->global->Estructura->idestructura} 
                      and ves.codigo = '400' and dp.idindicador = mgi.productid limit 1
                ) ,-1) as iddeposito, mor.direccion, mor.entregar, mor.id
                from mod_logfacmagentoadmin.dat_mgtorderitems mgi
                join mod_logfacmagentoadmin.dat_mgtorders mor on mor.id = mgi.orderid
                join mod_datosmaestros.nom_indicador ni on ni.idindicador = mgi.productid
                where mgi.orderid = '{$ordenId}'";
        $datos = LogisticaDoctrineHelper::__init()->executeQuery($sqlProductos)->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function facturarOrden($params)
    {
        $datos = $this->devolverProductosFacturar($params['idorden']);
        $arrayProd = array();
        if (count($datos) > 0) {
            if ($datos[0]['esatdofac'] != 1) {
                return array('success' => true, 'codigoMsg' => 6, 'msg' => 'Ya esta orden tiene una factura generada.');
            }
            foreach ($datos as $prod) {
                $datosProducto = LogisticaGlobal::__init()->getRSContainer()->execute($this->reportConfig['RPT_DISPONIBLE'], array('format' => 'json', 'idproducto' => $prod['idproducto']));
                if ($prod['idproducto'] != -1) {
                    if ($datosProducto[0]['existencia'] < $prod['cantidad']) {
                        $nombre = $datosProducto[0]['nombre'];
                        return array('success' => true, 'codigoMsg' => 6, 'msg' => "No se puede facturar la orden. El producto {$nombre} no tiene existencia.");
                    }
                    array_push($arrayProd, array(
                        'idproducto' => $prod['idproducto'],
                        'iddeposito' => $prod['iddeposito'],
                        'rotar' => 1,
                        'cantidad' => $prod['cantidad']
                    ));
                }
            }
        } else {
            return array('success' => true, 'codigoMsg' => 6, 'msg' => 'No se puede facturar la orden porque no se le han cargado productos.');
        }
        if (count($arrayProd) != count($datos)) {
            return array('success' => true, 'codigoMsg' => 6, 'msg' => 'No se puede facturar la orden porque faltan algunos productos en el almac&eacute;n de comercio electr&oacute;nico.');
        }
        $datosDoc = array();
        $datosDoc['idcliente'] = array(
            array('idcliente' => 990000014506, 'tipocliente' => 1)
        );
        $datosDoc['tipodestino'] = 1;
        $datosDoc['salidaporfactura'] = 1;
        $datosDoc['tipodistribucion'] = 3;
        $res = $this->crearDistribucion($datosDoc, $arrayProd);
        $params = new stdClass();
        $params->idcliente = 990000014506;
        $params->documentos = array($datosDoc['iddocumento']);
        $params->deposito = $arrayProd[0]['iddeposito'];
        $parametros['cliente'] = array(
            $params
        );
        $parametros['tipoDoc'] = 4;
        $parametros['accion'] = 'add';
        $parametros['observaciones'] = strtoupper("Orden de venta: {$datos[0]['orderid']}, beneficiario: {$datos[0]['entregar']} en: {$datos[0]['direccion']}");
        $parametros['idsubsistema'] = LogisticaGlobal::SUBSISTEMA_INV;
        $parametros['idoperacion'] = 990000000761;
        $parametros['idtipoprecio'] = -2;
        LogisticaComponentService::__init()->initComponent('log.fac.facturacion');
        $model = new GestionarFacturaModel(array('isPrincipal' => false, 'alias' => 'facturaLog', 'subsistema' =>
            LogisticaGlobal::SUBSISTEMA_FAC));
        $resultado = $model->adicionarFacturasDeDocumentos($parametros);
        $encabezado = $model->cargarEncabezado($resultado['documento']['iddocumento']);
        $sql = "update mod_logfacmagentoadmin.dat_mgtorders set esatdofac = 2 where id = '{$datos[0]['orderid']}'";
        LogisticaDoctrineHelper::__init()->executeQuery($sql);
        $idfactura = $resultado['documento']['iddocumento'];
        $idOrden = $datos[0]['orderid'];
        $mensaje = "Se ha creado la factura #{$encabezado['numero']} con fecha {$encabezado['fecha']}";
        $productos = $model->getProductosDb(
            array(
                'iddocumento' => $idfactura,
                'idsubsistema' => LogisticaGlobal::SUBSISTEMA_INV,
                'externo' => 1
            ));
        $productos = $productos['datos'];
        $datdocfactura = Doctrine::getTable("DatDocfactura")->find($idfactura);
        $datdocfactura->nrorden = $idOrden;
        $datdocfactura->esnota = 0;
        $datdocfactura->oferta = 0;
        $datdocfactura->save();
        foreach ($productos as &$p) {
            $p['cambioTipoPrecio'] = 1;
            $p['idtipoprecio'] = -2;
            $p['datosPrecioMoneda'] = array(
                (object)array('idmoneda' => 9900000000, 'precio' => $this->getPrecio($idOrden, $p['idindicador']))
            );
            unset($p['DatProductoLogistica']);
            unset($p['DatProdFactura']);
            unset($p['DatMovmoneda']);
        }
        $model->modificarProductos(array('productos' => $productos), $datdocfactura);
        return array('success' => $res, 'codigoMsg' => 1, 'msg' => $mensaje);
    }

    private function getPrecio($idorden, $idproducto)
    {
        $sqlPrecio = "select  precio, cantidad from mod_logfacmagentoadmin.dat_mgtorderitems where orderid = '{$idorden}' and productid ={$idproducto}";
        $datos = LogisticaDoctrineHelper::__init()->executeQuery($sqlPrecio)->fetchAll(PDO::FETCH_ASSOC);
        return count($datos) ? (round($datos[0]['precio'] * $datos[0]['cantidad'] * 24, 2) / $datos[0]['cantidad']) : 0;
    }

    private function crearDistribucion(&$datosDoc, $productos)
    {
        LogisticaComponentService::__init()->initComponent('log.dist.distribucion');
        $model = new DistribucionModel(
            array('alias' => 'entregaLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_DIST)
        );
        $datosDoc ['action'] = 'adicionarDocumento';
        $datosDoc['idnomconcepto'] = null;
        $datosDoc['iddocumento'] = $model->adicionarDocumento($datosDoc)['iddocumento'];
        $datosDoc['idproductos'] = $productos;
        $datosDoc['datos'] = $model->adicionarMovimientos($datosDoc)['productos'];
        $model->salvarCantidades($datosDoc);
        $confirmar = $model->confirmarDocumento($datosDoc['iddocumento']);
        $sql = "update mod_logistica.dat_documento set estado = 3, nrodoc = numeroref where iddocumento = {$datosDoc['iddocumento']}";
        LogisticaDoctrineHelper::__init()->executeQuery($sql);
        $encabezado = $model->cargarEncabezado($datosDoc['iddocumento']);
        $datosDoc['mensaje'] = "Se ha creado la distribuci&oacute;n #{$encabezado['numero']} con fecha {$encabezado['fecha']}";
        return true;
    }

    public function crearOrdenVenta($params)
    {
        $idUEB = $this->global->Estructura->idestructura;
        $sqlInsert = "insert into mod_logfacmagentoadmin.dat_mgtorders (id, direccion, entregar, idueb,fct,estadoov) 
                        values ('{$params['identificador']}','{$params['direccion']}', '{$params['entregar']}', $idUEB,'{$params['fecha']}',1);";
        LogisticaDoctrineHelper::__init()->executeQuery($sqlInsert);
        return array('success' => true, 'codigoMsg' => 1, 'msg' => 'Orden generada exitosamente');
    }

    public function aceptarOrdenBanco($uiParams)
    {
        $itemsQuery = "select oo.entregar as client_name, ii.storageproductid as product_id, ii.cantidad  as qty, oo.direccion as addres
            from mod_logfacmagentoadmin.dat_mgtorderitems ii
            join mod_logfacmagentoadmin.dat_mgtorders oo on ii.orderid = oo.id
            where ii.orderid = '{$uiParams['idorden']}'";
        $items = LogisticaDoctrineHelper::__init()->executeQuery($itemsQuery)->fetchAll(PDO::FETCH_ASSOC);
        if (count($items) == 0) {
            return array('success' => false, 'msg' => 'No se pueda aceptar una orden sin productos');
        }
        $invoiceModel = new DocumentoLogisticaModel([
            'isPrincipal' => true,
            'alias' => 'valeLog',
            'subsistema' => LogisticaGlobal::SUBSISTEMA_INV,
        ]);
        $parameters = [
            'idoperacion' => $this->variablesGlobales->obtenerValor('novaBankInvoiceOperation'),
            'idestructuracomun' => $this->variablesGlobales->obtenerValor('novaBankStorage'),
            'observaciones' => "Procesando Orden de Compra #{$uiParams['idorden']}",
        ];
        $invoice = $invoiceModel->adicionarDocumento($parameters);
        $invoice->save();

        $invoiceId = $invoice->iddocumento;
        $invoiceModel->adicionarClientes($invoice->iddocumento, array(
            [
                'idcliente' => $this->global->Estructura->idestructura,
                'tipocliente' => 3
            ]
        ));
        $invoiceDetail = new DatEntrega();
        $invoiceDetail->fromArray([
            'iddocumento' => $invoiceId,
            'nombrecliente' => $items[0]['client_name'],
            'observacion' => $items[0]['addres'],
        ]);
        $invoiceDetail->save();
        $invoiceItems = [];
        foreach ($items as $product) {
            $invoiceItems[] = [
                'idproducto' => $product['product_id'],
                'cantidad' => $product['qty'],
                'signomov' => LogisticaMovimientoModel::SIGNO_MOV_RESTA
            ];
        }
        $invoiceModel->getProductoModel()->getMovimientoModel()->adicionarMovimientos($invoiceId, $invoiceItems);
        $invoiceModel->confirmarDocumento($invoiceId);;
        $invoiceModel->getProductoModel()->getMovimientoModel()->aprobarMovimientos($invoiceId, $invoiceModel->contabilizarDocumento($invoiceId));
        LogisticaDoctrineHelper::__init()->executeQuery(
            "update mod_logfacmagentoadmin.dat_mgtorders 
            set estadoov =  2, fcb= now(), idfactura = {$invoiceId}  WHERE id = '{$uiParams['idorden']}'"
        );
        return array(
            'success' => true,
            'codigoMsg' => 1,
            'msg' => 'Pago acepatdo satisfactoriamente. Se han generado todas las operaciones.',
            'id' => $invoiceId,
            'storageId' => $parameters['idestructuracomun']
        );
    }

}
