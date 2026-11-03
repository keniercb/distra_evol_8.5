<?php

/**
 * SolicitudNegocioDService
 *
 * @package    Domain.
 * @subpackage Domain services.
 * @copyright  UCID
 * @version    1.0
 */
class DemandaDService extends ZendExt_Model
{
    private $_solicitudRepository, $_areaimplicadaDService, $_estadoDService, $_gestordocumental, $_iddominio, $_idestructura;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_solicitudRepository = new SolicitudNegocioRepository();
        $this->_areaimplicadaDService
            = new SolicitudNegocioAreaImplicadaDService();
        $this->_estadoDService = new SolicitudOfertaEstadoDService();
        $this->_gestordocumental = new GestorDocumentalComunicationInterface();
        $this->_idestructura = $this->global->Estructura->idestructura;
        $this->_datosmaestros = new DatosMaestrosComunicationInterface();
        $this->_confcontratacion = new ConfContratacionModel();
        $this->_iddominio = $this->global->Perfil->iddominio;
        $this->_idestructura = $this->global->Estructura->idestructura;
    }

    public function getDemandas($params, $includeextravalues = true)
    {
//        echo '<pre>';print_r($_SERVER);die;
//        $params['filters'][] = array('field' => 'idestructuracomun',
//                                     'data'  => array('value' => $this->_idestructura));
        $params['filters'][] = array('field' => 'cliente',
                                     'data'  => array('value' => '[3]'));
        if (!isset($params['incluirtransiciones'])) {
            $params['incluirtransiciones'] = true;
        }
        $result = $this->_solicitudRepository->getSolicitudesNegocio($params);
//        print_r($result);die;
        $listSolicitudes = array();
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        foreach ($result['datos'] as $field => $value) {
            $mon = $conn->fetchAll(
                " SELECT  sum(mi.valor), m.codigoiso, m.idmoneda 
                FROM mod_crmcontratacion.dat_indicadorsolicitud i
                LEFT JOIN mod_crmcontratacion.dat_monedaindicadorsolicitud mi ON i.idindicadorsolicitud=mi.idindicadorsolicitud
                LEFT JOIN mod_datosmaestros.nom_moneda m ON m.idmoneda=mi.idmoneda
                WHERE i.idsolicitudnegocio=" . $value['idsolicitud']
                . " GROUP BY m.codigoiso, m.idmoneda "
            );
            if (array_key_exists($value, $listSolicitudes)) {
                continue;
            }
            foreach ($mon as $m) {
                $value['montomoneda_' . strtolower(
                    $m['codigoiso'] . '_' . $m['idmoneda']
                )]
                    = $m['sum'];
            }
            $value['areasimplicadas']
                = $this->_areaimplicadaDService->getAreasImplicadasFromArray(
                $value['idsolicitud'], $result
            );
            $value['idarea'] = $value['idarearesponsable'];
            if ($value['cliente'] == 2 || $value['cliente'] == 4) {
                $conexionActual = Doctrine_Manager::getInstance()
                    ->getCurrentConnection();
                $datos = $this->cargarProveedoresSolicitud(
                    $value['idsolicitud']
                );
                $provee = array();
                $idprovee = array();
                foreach ($datos['datos'] as $temp) {
                    $provee[] = $temp['nombre'];
                    $idprovee[] = $temp['idclientesproveedores'];
                }
                $value['clienteproveedor'] = implode(', ', $provee);
                $value['idproveedores'] = implode(',', $idprovee);
            }
            $listSolicitudes[] = $value;
        }
        return array(
            'cant'              => $result['cant'],
            'datos'             => $listSolicitudes,
//            'estados_cliente'   => $this->_estadoDService->getConfiguracionEstados(),
//            'estados_proveedor' => $this->_estadoDService->getConfiguracionEstados(
//                'solicitudnegocioproveedor'
//            ),
            'estados_demanda'   => $this->_estadoDService->getConfiguracionEstados(
                'solicituddemanda'
            ),
//            'estados_oferta'    => $this->_estadoDService->getConfiguracionEstados(
//                'solicitudofertaimportacion'
//            ),
            'monedaentidad'     => $this->_datosmaestros->getMonedasEntidad(
                $this->_idestructura
            ),
        );
    }

    public function setValoresExtras($listSolicitudes)
    {
        try {
            $t = array();
            $monedas = $this->getArrayMonedasValores();
//            print_r($monedas);die;
            $listSolicitudes['metaData'] = $this->getMetaData();
            $extra = [];
            $listSolicitudes['monedasentidad']
                = $monedasEntidad[$this->_idestructura]
                = $this->getArrayMonedasEntidad($this->_idestructura);
            $v = array();

            foreach ($listSolicitudes['data'] as $index => $d) {
                $idestructura = $d['idestructuracomun'];

                if (!isset($monedasEntidad[$idestructura])) {
                    $monedasEntidad[$idestructura]
                        = $this->getArrayMonedasEntidad($idestructura);
                }
                foreach ($monedasEntidad[$idestructura] as $k => $m) {
                    $field = strtolower($m['codigoiso']);
                    if (!in_array($field, $extra)) {
                        $extra[] = $field;
                        $listSolicitudes['metaData']['fields'][]
                            = array('name' => 'montomoneda_' . $field . '_'
                            . $m['idmoneda']);
                    }
                    $monedasEntidad[$idestructura][$k]['monto']
                        =
                    $listSolicitudes['data'][$index]['montomoneda_' . $field
                    . '_1']
                        = $monedas[$d['idcontrato']][$m['idmoneda']];
                }
                $listSolicitudes['data'][$index]['monedas']
                    = $monedasEntidad[$idestructura];
                $objDoctrine = Doctrine_Manager::getInstance();
                $conexionActual = $objDoctrine->getCurrentConnection();
//                $query
//                    = 'SELECT mp.idmediopago, nmp.nombre
//                  FROM mod_crmcontratacion.dat_mediopagocontrato mp
//                  INNER JOIN mod_crmcontratacion.nom_mediodepago nmp
//                  ON nmp.idmediodepago=mp.idmediopago
//                  WHERE mp.idcontrato=' . $d['idcontrato'];
//                $a = $conexionActual->fetchAll($query);
                $datos = array('id' => '', 'nombre' => array());
//                foreach ($a as $e) {
//                    $datos['id'] = $datos['id'] . $e['idmediopago'] . ',';
//                    $datos['nombre'][] = $e['nombre'];
//                }
//                $result['data'][$index]['idmediopago'] = trim($datos['id'], ',');
//                $result['data'][$index]['mediopago'] = $datos['nombre'];
            }
//            print_r($result['metaData']['fields']);die;
//            if ($this->getContabilidad()['habilitado']) {
//                if (count($idclientesproveedores) > 0) {
//                    $datosDeudas
//                        = $this->integrator->copa->cargarDatosDuoClientes(
//                        array('clientes' => $idclientesproveedores)
//                    );
//                    foreach ($result['data'] as $index => $d) {
//                        $cont = 0;
//                        foreach ($datosDeudas as $a) {
//                            if ($d['idclienteproveedor'] == $a['idcliente']) {
//                                $cont += 1;
//                            }
//                        }
//                        $result['data'][$index]['deuda'] = $cont > 0;
//                    }
//                }
//            }
            return $listSolicitudes;
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function getArrayMonedasValores()
    {
        try {
            $monedas = $this->_solicitudRepository->cargarMonedasDominio(
                $this->_iddominio
            );
            $resultado = [];
            foreach ($monedas as $moneda) {
                if (!isset($resultado[$moneda['idsolicitud']][$moneda['idmoneda']])) {
                    $resultado[$moneda['idsolicitud']][$moneda['idmoneda']]
                        = $moneda['valor'];
                }
            }
            return $resultado;
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function getMetaData()
    {
        try {
            $types = array('numeric' => 'int', 'character varying' => 'string');
            $demanda = new DatSolicitudDemanda();
            $columns = $demanda->getTable()->getColumns();
            $merge = array_merge($columns, $this->_extrafields);
            $fields = [];
            $idproperty = '';
            foreach ($merge as $key => $conf) {
                if ($conf['type'] && $types[$conf['type']]) {
                    $conf['type'] = $types[$conf['type']];
                }
                if ($conf['type'] == 'date') {
                    unset($conf['type']);
                }
                if ($conf['mapping']) {
                    $conf['name'] = $conf['mapping'];
                    unset($conf['mapping']);
                }
                if ($conf['primary']) {
                    $idproperty = $key;
                }
                $fields[] = array_merge(array('name' => $key), $conf);
            }
//            print_r($fields);die;
            return array('fields' => $fields, 'idProperty' => $idproperty);
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function getArrayMonedasEntidad($idestructura)
    {
        try {
            $resultado = $this->_datosmaestros->getMonedasEntidad(
                $idestructura
            );
            return $resultado;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function historial($params)
    {
        try {
            if ($params['idsolicitud']) {
                $params['filters'] = array(array('field' => 'idsolicitud',
                                                 'data'  => array('type'  => 'numeric',
                                                                  'value' => $params['idsolicitud'])));
            }

            $demandas = [];
            do {
                $result = $this->getDemandas($params, false, true);
                $demanda = $result['datos'][0];
                array_unshift($demandas, $demanda);
                $params['filters'] = array(array('field' => 'idsolicitud',
                                                 'data'  => array('type'  => 'numeric',
                                                                  'value' => $demanda['idpadre'])));
            } while ($demanda['idpadre'] != null);
//            print_r($demandas);die;
            $resultado['data'] = $demandas;
            return $resultado;
        } catch (Exception $e) {
            return array();
        }
    }
//    public function historial($params)
//    {
//        try {
//            if ($params['idsolicitud']) {
//                $params['filter'] = array(array('field' => 'idsolicitud',
//                                                'data'  => array('type'  => 'numeric',
//                                                                 'value' => $params['idsolicitud'])));
//            }
//            $result = $this->getDemandas($params, false, true);
//            $demanda = $result['datos'];
//            while ($demanda['idpadre'] != null) {
//                $demandas = [];
//                array_unshift($demandas, $demanda);
//                $params['filter'] = array(array('field' => 'idsolicitud',
//                                                'data'  => array('type'  => 'numeric',
//                                                                 'value' => $demanda['idpadre'])));
//                $resultado['data'] = $demandas;
//                return $resultado;
//            }
//
//
//        } catch (Exception $e) {
//            return array();
//        }
//    }

    public function getConfigSolicitudNegocio()
    {
        return (new ConfSolicitudNegocio())->getConfig();
    }

    public function getSolicitudDocs($idespacioTrabajo)
    {
        $result = [];
        if ($this->existeGestorDocumental() && !empty($idespacioTrabajo)) {

            $result = $this->_gestordocumental->getContenido(
                array('idespaciotrabajo' => $idespacioTrabajo)
            );
        }
        return $result;
    }

    public function getMonedasEstructura()
    {
        try {
            $resultado = $this->_datosmaestros->getMonedasEntidad(
                $this->_idestructura
            );
            return $resultado;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function adicionarDemanda($params)
    {
        try {
            $saveValues = array();
//              print_r($params);die;
            $saveValues['nombre'] = $params['nombre'];
            $saveValues['idclienteproveedor'] = $params['idclienteproveedor']
            == '' ? null : $params['idclienteproveedor'];
            $saveValues['clienteproveedor'] = $params['clienteproveedor']
            == '' ? null : $params['clienteproveedor'];
            $saveValues['idsector'] = $params['idsector'] ? $params['idsector']
                : null;
            $saveValues['idarearesponsable'] = $params['idarea']
                ? $params['idarea'] : null;
            $saveValues['descripcion'] = $params['descripcion'];
            $saveValues['cliente'] = $params['cliente'];
            $saveValues['idlinea'] = $params['idlinea'] ? $params['idlinea']
                : null;
            $saveValues['idtipolinea'] = $params['idtipolinea']
                ? $params['idtipolinea'] : null;
            $saveValues['idestructuracomun']
                = $this->global->Estructura->idestructura;
            $saveValues['idpersona'] = $params['idpersona']
                ? $params['idpersona'] : null;
            $saveValues['fechafin'] = $params['fechafin'] ? $params['fechafin']
                : null;
            $saveValues['fechacreada'] = $params['fechacreada']
                ? $params['fechacreada'] : date('d/m/Y');
            $saveValues['numero'] = $params['numero'] ? $params['numero']
                : null;
            $saveValues['idpadre'] = $params['idpadre'] ? $params['idpadre']
                : null;
            $saveValues['objeto'] = $params['objeto'] ? $params['objeto']: null;
            $saveValues['idbalanceo'] = $params['idbalanceo'] ? $params['idbalanceo']: null;
            $saveValues['montototal'] = $params['montototal'] != ''
                ? $this->formatearNumero($params['montototal']) : 0;
            if (count($_FILES) != 0) {
                $this->updateUploadFilesName($params);
                $saveValues['idespaciotrabajo'] = $this->generateEspacioTrabajo(
                    $params
                );
                $this->insertarDocumentos($saveValues['idespaciotrabajo']);
            }

            // print_r($saveValues);die;
            $idsolicitud = $this->_solicitudRepository->insertRecord(
                $saveValues
            );
            $this->_estadoDService->registrarEstadInicial($idsolicitud);
            $this->_areaimplicadaDService->adicionarAreasImplicadas(
                $idsolicitud, $params['areasimplicadas']
            );
            if ($params['proveedores']) {
                $this->adicionarProveedores(
                    $idsolicitud, $params['proveedores']
                );
            }
            if ($params['productosservicios']) {
                $this->adicionarProductoServicio(
                    $idsolicitud, $params['productosservicios']
                );
            }
            return $idsolicitud;

        } catch (Exception $e) {
            if ($e->getCode() == 335) {
                return;
            }
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                         'success' => false);
        }
    }

    public function salvarMonedasDemanda($idsolicitud, $params)
    {
        try {
            $monedas = new Doctrine_Collection('DatMonedaDemanda');
            foreach ($params as $k => $v) {
                if (preg_match('/idmoneda_/i', $k)) {
                    $temp = explode('_', $k);
                    $moneda = Doctrine::getTable('DatMonedaDemanda')
                        ->findByDql(
                            'idsolicitud=? and idmoneda=?',
                            array($idsolicitud, $v)
                        );
                    if (!$moneda->count()) {
                        $moneda = new DatMonedaDemanda();
                        $moneda->iddemanda = $idsolicitud;
                        $moneda->idmoneda = $v;
                    } else {
                        $moneda = $moneda->getFirst();
                    }
                    $moneda->valor = $params['montomoneda_' . $temp[1] . '_'
                    . $v]
                        ? $this->formatearNumero(
                            $params['montomoneda_' . $temp[1] . '_' . $v]
                        ) : 0;
                    $monedas->add($moneda);
                }
            }
            $monedas->save();
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function formatearNumero($numero)
    {
        return str_replace(',', '.', $numero);
    }

    public function modificarDemanda($params)
    {
        try {
            $saveValues = array();
            $saveValues['idsolicitud'] = $params['idsolicitud'];
            $saveValues['nombre'] = $params['nombre'];
            $saveValues['idclienteproveedor'] = $params['idclienteproveedor']
            == '' ? null : $params['idclienteproveedor'];
            $saveValues['clienteproveedor'] = $params['clienteproveedor']
            == '' ? null : $params['clienteproveedor'];
            $saveValues['idsector'] = $params['idsector'] ? $params['idsector']
                : null;
            $saveValues['idarearesponsable'] = $params['idarea']
                ? $params['idarea'] : null;
            $saveValues['descripcion'] = $params['descripcion'];
            $saveValues['idlinea'] = $params['idlinea'] ? $params['idlinea']
                : null;
            $saveValues['idtipolinea'] = $params['idtipolinea']
                ? $params['idtipolinea'] : null;
            $saveValues['idpersona'] = $params['idpersona']
                ? $params['idpersona'] : null;
            $saveValues['fechafin'] = $params['fechafin'] ? $params['fechafin']
                : null;
            $saveValues['numero'] = $params['numero'] ? $params['numero']
                : null;
            $saveValues['idpadre'] = $params['idpadre']
                ? $params['idpadre'] : null;
            $saveValues['montototal'] = $params['montototal'] != ''
                ?$this->formatearNumero($params['montototal']) : 0;
            if ($params['fechacreada']) {
                $saveValues['fechacreada'] = $params['fechacreada'];
            }

            if (count($_FILES) != 0) {
                $this->updateUploadFilesName($params);
                $saveValues['idespaciotrabajo'] = ($params['idespaciotrabajo'])
                    ? $params['idespaciotrabajo']
                    : $this->generateEspacioTrabajo($params);
                $this->insertarDocumentos($saveValues['idespaciotrabajo']);
            }

            $this->modificarDocumentos(json_decode($params['editfile']));
            $this->eliminarDocumentos(json_decode($params['delfile']));
            $this->_solicitudRepository->updateRecord($saveValues);
            $this->_areaimplicadaDService->modificarAreasImplicadas(
                $params['idsolicitud'], $params['areasimplicadas']
            );
            if ($params['proveedores']) {
                $this->adicionarProveedores(
                    $params['idsolicitud'], $params['proveedores']
                );
            }
            if ($params['productosservicios']) {
                $this->adicionarProductoServicio(
                    $params['idsolicitud'], $params['productosservicios']
                );
            }
        } catch (Exception $e) {
//            print_r($e->getMessage());die;
//            if ($e->getCode() == 335) {
//                return;
//            }
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                         'success' => false);
        }
    }

    public function eliminarDemanda($ids)
    {
        $this->_solicitudRepository->deleteRecords($ids);
    }

    private function adicionarProveedores($idsolicitud, $proveedores)
    {
        try {
            foreach ($proveedores['nuevos'] as $n) {
                $solprov = new DatSolicitudNegocioProveedor();
                $solprov->idsolicitudnegocio = $idsolicitud;
                $solprov->idproveedor = $n;
                $solprov->save();
            }
            if ($proveedores['eliminados']) {
                $query = Doctrine_Query::create();
                $query->delete()->from('DatSolicitudNegocioProveedor')
                    ->whereIn(
                        'idsolicitudnegocioproveedor',
                        $proveedores['eliminados']
                    )
                    ->execute();
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    private function adicionarProductoServicio($idsolicitud, $prodServ)
    {
        try {
            foreach ($prodServ['nuevos'] as $n) {
                $producto = ($n['idindicadorcontrato']&& $n['idindicadorcontrato'] != '')?
                    Doctrine::getTable('DatIndicadorSolicitud')->find(
                        $n['idindicadorcontrato']
                    ):new DatIndicadorSolicitud();
                $producto->idsolicitudnegocio = $idsolicitud;

                $producto->idindicador = $n['idindicador'] ? $n['idindicador']
                    : null;
                $producto->idactividad = $n['idactividad'] ? $n['idactividad']
                    : null;
                $producto->denominacion = $n['denominacion'];
                $producto->codigo = $n['codigo'];
                $producto->tipo = $n['tipo'];
                $producto->cantidad = $n['cantidad'];
                $producto->datosadicionales = $n['datos_json'];
                $producto->save();

                DatMonedaIndicadorSolicitud::guardarMonedaEntidadIndicador(
                    $n, $producto->idindicadorsolicitud
                );
            }

            $eliminar = [];
            $pos = 0;

            foreach ($prodServ['eliminados'] as $v) {
                $eliminar[$pos++] = $v['codigo'];
            }

            if ($prodServ['eliminados']) {
                $query = Doctrine_Query::create();
                $query->delete()->from('DatIndicadorSolicitud')
                    ->whereIn('codigo', $eliminar)
                    ->execute();
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    private function getNombreClienteProveedorById($idclientproveedor)
    {
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $datos = $conexionActual->fetchAll(
            "SELECT count(idclientesproveedores) FROM mod_datosmaestros.nom_clientesproveedor 
            WHERE idclientesproveedores=" . $idclientproveedor
        );
        $nombre = '';
        if ($datos[0]['count'] > 0) {
        }
        return $nombre;
    }

    private function updateUploadFilesName($params)
    {
        foreach ($_FILES as $k => $file) {
            $id = explode("_new", $k)[1];
            if ($_FILES[$k]['name']) {
                $_FILES[$k]['realname'] = $params['params']["nombre_new" . $id];
            } else {
                unset($_FILES[$k]);
            }
        }
    }

    private function generateEspacioTrabajo($params)
    {
        if ($this->existeGestorDocumental()) {
            $result = $this->_confcontratacion->loadConfSolicitudNegocio();
            if (count($result['config'])) {
                $idespacioGeneral = $result['config']['idespaciotrabajo'];
            }

            if ($idespacioGeneral) {

                $idespaciocliente = $this->crearEspacioClienteProveedor(
                    $idespacioGeneral, $params
                );
                return $this->crearEspacioSolicitudNegocio(
                    $idespaciocliente, $params
                );
            }

            return '';
        }
    }

    private function crearEspacioClienteProveedor($idespacio, $parametros)
    {
        try {
            $coneccion = Doctrine_Manager::getInstance()->getCurrentConnection()
                ->getName();
            $parametros
                = array('idclientesproveedores' => $parametros['idclienteproveedor'],
                        'idestructuracomun'     => $this->_idestructura,
                        'idespaciotrabajo'      => $idespacio,
                        'proceso'               => 'solicitudnegocio',
                        'coneccion'             => $coneccion);
            $resultado = $this->_datosmaestros->getEspacioTrabajoCliente(
                $parametros
            );
            if (count($resultado)) {
                $idespacio = $resultado['idespaciotrabajo'];
            }
            return $idespacio;
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function crearEspacioSolicitudNegocio($idespacio, $parametros)
    {
        try {
            return $this->_gestordocumental->CreateWorkSpace(
                $idespacio, $parametros['nombre']
            );
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function existeGestorDocumental()
    {
        try {
            $conf = new ConfContratacionModel();
            $result = $conf->loadConfSolicitudNegocio();
            if (count($result) && count($result['config'])
                && $result['config']['activo']
                && $this->_gestordocumental->testGD()
            ) {
                return true;
            }
            return false;
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function insertarDocumentos($idespaciosolicitud)
    {
        try {
            if (count($_FILES) != 0 && $idespaciosolicitud) {

                $documento = $this->_gestordocumental->saveDocument(
                    $idespaciosolicitud
                );
                if (count($documento) == 0) {
                    throw new Exception(
                        'Ocurrio un error al salvar el documento.', 335
                    );
                }
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function modificarDocumentos($docs)
    {
        try {
            foreach ($docs as $doc) {
                $this->_gestordocumental->editDocument(
                    $doc->idnodo, array('nombre' => $doc->nombre)
                );
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getEstadoSolicitud()
    {
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        return $conn->fetchOne(
            "
            SELECT idestadosolicitudinsertar FROM mod_crmadministracion.conf_ofertanegocio
        "
        );
    }

    public function eliminarDocumentos($docs)
    {
        try {
            if (count($docs)) {
                $this->_gestordocumental->delFile($docs);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function cargarProveedoresSolicitud($idsolicitud)
    {
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $datos = $conexionActual->fetchAll(
            'SELECT cp.idclientesproveedores, snp.idsolicitudnegocioproveedor,
            (CASE WHEN cp.registrado = 0 THEN cp.nombre else COALESCE (estru.denominacion, per.nombre||\' \'||per.papel||\' \'||per.sapel) END) as nombre
            FROM mod_crmcontratacion.dat_solicitudnegocioproveedor snp
            INNER JOIN mod_datosmaestros.nom_clientesproveedor cp ON cp.idclientesproveedores=snp.idproveedor
            LEFT JOIN mod_estructuracomp.dat_estructura estru ON (cp.idestructura = estru.idestructura and estru.idproyecto=0)
            LEFT JOIN mod_persona.dat_persona per ON (cp.idpersona = per.idpersona)
            WHERE snp.idsolicitudnegocio=' . $idsolicitud
        );
        return array('success' => true, 'datos' => $datos);
    }

    public function obtenerProductoServicio($params)
    {
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $extrawhere='';
        if(isset($params['notmarcocontractual'])){
            $marcoscontractuales=$conexionActual->fetchAll(
                "SELECT mc.idindicadorcontrato 
                FROM mod_crmcontratacion.dat_contratodemandamarcocontractual mc
                WHERE mc.idsolicitud=".$params['idsolicitud']
            );
            $idindicadorescontratos=''; $inicial=true;
            foreach($marcoscontractuales as $mc){
                if(!$inicial)
                    $idindicadorescontratos.=',';
                $idindicadorescontratos.=implode(',', json_decode($mc['idindicadorcontrato']));
                $inicial=false;
            }
            if($idindicadorescontratos!='')
                $extrawhere=' AND isn.idindicadorsolicitud not in ('.$idindicadorescontratos.')';
        }
//        print($extrawhere);die;
        $datos = $conexionActual->fetchAll(
            "SELECT isn.*, isn.idindicadorsolicitud as idindicadorcontrato,
            isn.datosadicionales as datos_json, isn.datosadicionales as datos_json_encode,
            COALESCE(isn.denominacion, i.denominacion) as denominacion,
            COALESCE(num.denominacionunidadmedida, 'Unidad') as unidadmedida,
            COALESCE(i.precio, 0) as precio, ip.preciodivisa, isn.codigo as codigoproveedor
            FROM mod_crmcontratacion.dat_indicadorsolicitud isn
            LEFT JOIN mod_datosmaestros.nom_indicador i ON i.idindicador = isn.idindicador
            LEFT JOIN mod_datosmaestros.nom_indicadorplanif ip on i.idindicador = ip.idindicador
            LEFT JOIN mod_datosmaestros.nom_unidadmedida num ON num.idunidadmedida = i.idumedida
            WHERE isn.idsolicitudnegocio=" . $params['idsolicitud'].$extrawhere
        );
        foreach ($datos as $indexindi => $indi) {
            $moneda = DatMonedaIndicadorSolicitud::cargarMonedasIndicador(
                array('idindicador' => $indi['idindicadorsolicitud'])
            );
            if (count($moneda)) {
                foreach ($moneda as $mon) {
                    if ($mon['moneda'] == 'CUP') {
                        $datos[$indexindi]['precio'] = $mon['monto'];
                    }
                    if ($mon['moneda'] == 'CUC') {
                        $datos[$indexindi]['preciodivisa'] = $mon['monto'];
                    }
                    $datos[$indexindi]['montomoneda_' . strtolower($mon['moneda'].'_'.$mon['idmoneda'])] = $mon['monto'];
                }
            }
            $datosAdd = Doctrine_Query::create()->select()->from(
                'DatProductosDatosAdicionales pda'
            )
                ->where('idproducto = ?', $indi['idindicadorsolicitud'])
                ->execute()->getFirst();
            if ($datosAdd) {
//                    $datosAdd['datos']['datos_json_encode']=$datosAdd['datos']['datos_json'];
                $datos[$indexindi]['datos_json'] = $datosAdd['datos'];
            }
        }
        return array('success' => true, 'datos' => $datos);
    }

    public function getAreasImplicadas($idsolicitud)
    {
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        return $conn->fetchAll(
            "
            SELECT COALESCE (estuc1.denominacion, estucop1.denominacion) as area, sai.idarea, sai.idestructura
            FROM mod_crmcontratacion.dat_solicitudnegocioareaimplicada sai
            LEFT JOIN mod_estructuracomp.dat_estructura estuc1 ON (sai.idestructura = estuc1.idestructura and estuc1.idproyecto = 0)
            LEFT JOIN mod_estructuracomp.dat_estructuraop estucop1 ON (sai.idestructura = estucop1.idestructuraop and estucop1.idproyecto = 0)
            WHERE sai.idsolicitud=" . $idsolicitud
        );
    }

    public function cargarLineas($params)
    {
        try {
            $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
            $where = "";
            if ($params['denominacion']) {
                $where = " WHERE n.denominacion ILIKE '%" . $params['denominacion'] . "%' ";
            }
            $result = $conexionActual->fetchAll(
                "SELECT count(n.idnaturaleza) over(), n.idnaturaleza, n.denominacion, n.idnaturaleza as idindicador
                    FROM mod_datosmaestros.nom_naturaleza n
                    $where
                    ORDER BY n.denominacion
                    LIMIT " . $params['limit'] . " OFFSET " . $params['start']
            );
//        if (!$params['idnaturaleza']) {
//            $params['idnaturaleza'] = $this->cargarNaturaleza();
//        }
//        if ($params['idnaturaleza']) {
//            $result = $this->integrator->logistica->getIndicadoresByParams(
//                array('idnaturaleza' => $params['idnaturaleza'], 'nivel' => 2),
//                0, 0
//            );
//        }

//        $result=$this->integrator->datosmaestros->getArrIndicadoresDescendencia(null, null, null, array());
//        $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
//        $result=$conexionActual->fetchAll(
//            "select m.denominacion, m.codigo, m.*
//            FROM mod_datosmaestros.nom_indicador m
//            LEFT JOIN mod_datosmaestros.nom_indicadorhoja m2 ON m.idindicador = m2.idindicador
//            WHERE m.idindicador <> m.idpadre AND m2.idindicador is null
//            AND m.idnaturaleza=1000261
//            /*AND denominacion='PEUGEOT'*/
//            ORDER BY m.codigo"
//        );
            return array('total'=>count($result)>0?$result[0]['count']:0, 'datos'=>$result);
        }catch (Exception $e) {
            throw $e;
        }
    }

    public function obtenerTiposLineas($post)
    {
//        return $this->integrator->crm->obtenerTiposLineas($post);
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $where = '';
        $arrwhere = [];
        foreach ($post as $index => $value) {
            if ($index == 'idlinea') {
                $arrwhere[] = " tl.lineas::text like '%" . $value . "%' ";
            }
        }
        if (count($arrwhere) > 0) {
            $where = ' WHERE ' . implode(' AND ', $arrwhere);
        }
        $resp = $conexionActual->fetchAll(
            'SELECT tl.*, tl.denominacion as tipolinea FROM mod_crmcontratacion.nom_tipolinea tl '
            . $where
        );
        $cant = $conexionActual->fetchAll(
            'SELECT count(tl.idtipolinea) FROM mod_crmcontratacion.nom_tipolinea tl '
            . $where
        );
        return array('datos' => $resp, 'total' => $cant[0]['count']);
    }

    public function cargarNaturaleza()
    {
        $resultado = '';
        $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection(
        );
        $naturaleza = $conexionActual->fetchAll(
            "SELECT n.idnaturaleza FROM mod_datosmaestros.nom_naturaleza n
                      WHERE n.denominacion='Partes y piezas SASA'"
        );
        if ($naturaleza) {
            $resultado = $naturaleza[0]['idnaturaleza'];
        }
        return $resultado;
    }

    public function getLineasClientes($params)
    {
        $disctinctStatement = '';
        $where = '';
        $arrWhere = array();
        $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection(
        );
        foreach ($params as $index => $value) {
            if ($value)
                switch ($index) {
                    case 'idclienteproveedor':
                        $arrWhere[] = 'cpl.idclienteproveedor=' . $value;
                        break;
                    case 'idlinea':
                        $arrWhere[] = 'cpl.idlinea=' . $value;
                        break;
                    case 'linea':
                        $arrWhere[] = 'i.denominacion ILIKE "%' . $value . '%"';
                        break;
                    case 'tipolinea':
                        $arrWhere[] = 'tl.denominacion ILIKE "%' . $value
                            . '%"';
                        break;
                    case 'soloLineas':
                        $disctinctStatement
                            = ' DISTINCT ON (cpl.idlinea) cpl.idlinea, ';
                        break;
                }
        }
        if (count($arrWhere) > 0) {
            $where = ' WHERE ' . implode(' AND ', $arrWhere);
        }
        $query
            = "
              FROM mod_datosmaestros.dat_clienteproveedorlinea cpl
              LEFT JOIN mod_datosmaestros.nom_indicador i ON i.idindicador=cpl.idlinea 
              LEFT JOIN mod_crmcontratacion.nom_tipolinea tl ON tl.idtipolinea=cpl.idtipolinea
              " . $where;
        $resultado = $conexionActual->fetchAll(
            "SELECT $disctinctStatement cpl.*, i.codigo,
              i.denominacion as linea, tl.denominacion as tipolinea, i.idnaturaleza "
            . $query .
            ' LIMIT ' . $params['limit'] . ' OFFSET ' . $params['start']
        );
        if (count($resultado) < $params['limit']) {
            $total = count($resultado);
        } else {
            $total = $conexionActual->fetchAll(
                "SELECT count(i.denominacion)" . $query
            )[0]['count']; //PENDIENTE
        }
//        $total=count($resultado)?$resultado[0]['count']:0;
        return array('success' => true, 'cantidad' => $total,
                     'datos'   => $resultado);
    }

    public function generarConsecutivoAño($tiposolicitud, $cantCeros = 3)
    {
        $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();

        $result = $conexionActual->fetchAll(
            "SELECT count(s.idsolicitud) FROM mod_crmcontratacion.dat_solicitudnegocio s
            WHERE s.cliente=" . $tiposolicitud . " AND s.numero LIKE '%."
            . date('Y') . "'"
        );
        return str_pad(
                ((string)$result[0]['count'] + 1), $cantCeros, '0', STR_PAD_LEFT
            ) . '.' . date('Y');
    }

    public function comprobarMarco($params){
        $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
        $contratos=array(); $productosxcontratos=array();
        $sumaDemandas=0;
        if($params['iddemanda']){
            $extrawhere='';
            $marcoscontractuales=$conexionActual->fetchAll(
                "SELECT mc.idindicadorcontrato 
                FROM mod_crmcontratacion.dat_contratodemandamarcocontractual mc
                WHERE mc.idsolicitud=".$params['iddemanda']
            );
            $idindicadorescontratos=''; $inicial=true;
            foreach($marcoscontractuales as $mc){
                if(!$inicial)
                    $idindicadorescontratos.=',';
                $idindicadorescontratos.=implode(',', json_decode($mc['idindicadorcontrato']));
                $inicial=false;
            }
            if($idindicadorescontratos!='')
                $extrawhere=' AND ins.idindicadorsolicitud not in ('.$idindicadorescontratos.')';
            $result=$conexionActual->fetchAll("
                SELECT sum(mins.valor*ins.cantidad) as monto 
                FROM mod_crmcontratacion.dat_indicadorsolicitud ins
                LEFT JOIN mod_crmcontratacion.dat_monedaindicadorsolicitud mins ON(mins.idindicadorsolicitud=ins.idindicadorsolicitud)
                WHERE ins.idsolicitudnegocio=".$params['iddemanda'].$extrawhere
            );
            if (count($result) && $result[0]['monto']) {
                $sumaDemandas = $result[0]['monto'];
            }
        }
        if ($params['idcontratos'] && count(json_decode($params['idcontratos']))) {
            $sumaFacturado=$conexionActual->fetchAll("
                SELECT sum(mc.valor) as monto, c.idcontratomarco
                FROM mod_crmcontratacion.dat_contrato c
                LEFT JOIN mod_crmcontratacion.dat_monedacontrato mc ON mc.idcontrato=c.idcontrato
                WHERE c.idcontratomarco IN (".implode(',', json_decode($params['idcontratos'])).") 
                GROUP BY c.idcontrato"
            );
            $productosxcontrato=$conexionActual->fetchAll(
                "SELECT ic.codigo, ic.idcontrato FROM mod_crmcontratacion.dat_indicadorcontrato ic 
                  WHERE ic.idcontrato IN (".implode(',', json_decode($params['idcontratos'])).")"
            );
            foreach($sumaFacturado as $value){
                if($value['monto'])
                    $contratos[$value['idcontratomarco']]=floatval($value['monto']);
            }
            foreach($productosxcontrato as $prod){
                if($productosxcontratos[$prod['idcontrato']]) {
                    $productosxcontratos[$prod['idcontrato']][] = $prod['codigo'];
                }else{
                    $productosxcontratos[$prod['idcontrato']]=array($prod['codigo']);
                }
            }
        }
        return array(
            'success'=>true,
            'totalDemanda'=>$sumaDemandas,
            'facturasContratos'=>$contratos,
            'productosContratos'=>$productosxcontratos,
        );
    }

    public function guardarMarcoContractual($params){
        try {
            if($params['idcontrato']) {
                $marcocontractual = new DatContratoDemandaMarcoContractual();
                $marcocontractual->idcontrato = $params['idcontrato'];
                $marcocontractual->idsolicitud = $params['idsolicitud'];
                $marcocontractual->fechainicio = date('d/m/Y');
                $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
                $indicadorescontratos = $conexionActual->fetchAll(
                    "SELECT isn.idindicadorsolicitud
                    FROM mod_crmcontratacion.dat_indicadorsolicitud isn
                    where isn.idsolicitudnegocio=".$params['idsolicitud']." AND 
                    isn.idindicador IN (
                        select ic.idindicador FROM mod_crmcontratacion.dat_indicadorcontrato ic
                        WHERE ic.idcontrato = ".$params['idcontrato']."
                    )"
                );
                $idindicadores = array();
                foreach ($indicadorescontratos as $indi) {
                    $idindicadores[] = $indi['idindicadorsolicitud'];
                }
                $marcocontractual->idindicadorcontrato = json_encode($idindicadores);
                $marcocontractual->save();
                return array('success' => true);
            }
            return array('success' => false, 'msg'=>'No se ha podido obtener el contrato.');
        }catch (Exception $e) {
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                'success' => false);
        }
    }

}




















