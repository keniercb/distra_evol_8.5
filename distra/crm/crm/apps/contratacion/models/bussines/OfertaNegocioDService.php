<?php

/**
 * OfertaNegocioDService
 *
 * @package    Domain.
 * @subpackage Domain services.
 * @copyright  UCID
 * @version    1.0
 */
class OfertaNegocioDService extends ZendExt_Model
{
    private $_ofertaRepository, $_estadoDService, $_gestordocumental, $_idestructura, $_datosmaestros;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_ofertaRepository = new OfertaNegocioRepository();
        $this->_estadoDService = new OfertaNegocioEstadoDService();
        $this->_gestordocumental = new GestorDocumentalComunicationInterface();
        $this->_idestructura = $this->global->Estructura->idestructura;
        $this->_datosmaestros = new DatosMaestrosComunicationInterface();
        $this->_contrato = new GestioncontratoModel();
        $this->_solicitudDService = new SolicitudNegocioDService();
        $this->_confcontratacion = new ConfContratacionModel();
        $this->_datindicador = new DatIndicadorOferta();
    }

    public function getOfertas($params)
    {
        $params['filters'][] = array('field' => 'idestructuracomun',
                                     'data'  => array('value' => $this->_idestructura));
        $params['filters'][] = array('field' => 'cliente',
                                     'data'  => array('type'=>'list', 'value' => '[1,2]'));
        $params['modelName']='OfertaNegocio';
        $params['filters']=array_merge($params['filters'], $this->_confcontratacion->loadFiltersCompartimentacion(
            array('filter'=>
                array('field' => 'idestructuracomun',
                    'data'  => array('value' => $this->_idestructura)),
                'modelName'=>'OfertaNegocio'
            )));
        $result = $this->_ofertaRepository->getOfertasNegocio($params);
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();

        foreach ($result['datos'] as $index => $actual) {
            $mon = $conn->fetchAll(
                "SELECT mo.valor, m.codigoiso, m.idmoneda FROM mod_crmcontratacion.dat_monedaoferta mo
                LEFT JOIN mod_datosmaestros.nom_moneda m ON m.idmoneda=mo.idmoneda
                WHERE idoferta=" . $actual['idoferta']
            );
            $total = 0;
            foreach ($mon as $m) {
                $result['datos'][$index]['montomoneda_' . strtolower(
                    $m['codigoiso'].'_'.$m['idmoneda']
                )]
                    = $m['valor'];
            }
            $mediospago = $conn->fetchAll(
                "SELECT * FROM mod_crmcontratacion.dat_mediopagooferta mpo
                LEFT JOIN mod_crmcontratacion.nom_mediodepago mp ON mpo.idmediopago=mp.idmediodepago
                WHERE mpo.idoferta=" . $actual['idoferta']
            );
            $datos = array('id' => '', 'nombre' => array());
            foreach ($mediospago as $e) {
                $datos['id'] = $datos['id'] . $e['idmediopago'] . ',';
                $datos['nombre'][] = $e['nombre'];
            }
            $result['datos'][$index]['idmediopago'] = trim($datos['id'], ',');
            $result['datos'][$index]['mediopago'] = $datos['nombre'];
        }
        return array(
            'cantidad' => $result['cantidad'],
            'datos' => $result['datos'],
            'estados_cliente' => $this->_estadoDService->getConfiguracionEstados(),
            'estados_proveedor' => $this->_estadoDService->getConfiguracionEstados('ofertanegocioproveedor'),
        );
    }

    private function getNombreClienteProveedorById($idclientproveedor)
    {
        $allData = ZendExt_IoC::getInstance(
        )->datosmaestros->getClientesProveedorByParams($idclientproveedor);
        return $allData['datos'][0]['nombre'];
    }

    private function getOfertaDocs($idespacioTrabajo)
    {
        $result = [];
        if ($this->existeGestorDocumental() && !empty($idespacioTrabajo)) {

            $documentos = $this->_gestordocumental->getContenido( array('idespaciotrabajo' => $idespacioTrabajo));
            return $documentos;
        }
        return $result;
    }

    public function adicionarOferta($params)
    {
        try{
            $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
            $result = $conn->fetchAll(
                "SELECT count(o.idoferta) FROM mod_crmcontratacion.dat_ofertanegocio o 
                          WHERE o.numero='" . $params['numero']
                . "' AND o.idestructuracomun=" . $this->_idestructura
            );
            if ($result[0]['count'] == 0) {
                $idmediopago = $params['idmediopago'];
                $hitos = json_decode($params['hitos']);
                $productos = json_decode($params['productos']);
                $saveValues = array();
                $saveValues['nombre'] = $params['nombre'];
                $saveValues['numero'] = $params['numero'];
                $saveValues['idsolicitud'] = $params['idsolicitud'] != ''
                    ? $params['idsolicitud'] : null;
                $saveValues['fechainicio'] = date('d-m-Y');
                $saveValues['fechafirma'] = $params['fechafirma'];
                $saveValues['vigencia'] = $params['vigencia'];
                $saveValues['unidadtiempo'] = $params['unidadtiempo'];
                $saveValues['idcondicionpago'] = $params['idcondicionpago'] != ''
                    ? $params['idcondicionpago'] : null;
                $saveValues['montototal'] = $params['montototal'] != ''
                    ? $this->formatearNumero($params['montototal']) : 0;
                $saveValues['idsector'] = $params['idsector'];
                $saveValues['idarea'] = $params['idarea'];
                $saveValues['idresponsable'] = $params['idpersona'];
                $saveValues['descripcion'] = $params['descripcion'];
                $saveValues['objeto'] = $params['objeto'];
                $saveValues['cliente'] = $params['tipo'];
                $saveValues['idclienteproveedor'] = $params['idclienteproveedor'];
                $saveValues['idestructuracomun'] = $this->_idestructura;
                $this->updateUploadFilesName($params);
                if (count($_FILES) != 0) {
                    $saveValues['idespaciotrabajo'] = $this->generateEspacioTrabajo(
                        $params
                    );
                    $this->insertarDocumentos($saveValues['idespaciotrabajo']);
                }

                $idoferta = $this->_ofertaRepository->insertRecord($saveValues);
    //            print('llega');die;
                $this->_estadoDService->registrarEstadoInicial($idoferta);
                $this->guardarMonedasOferta($idoferta, $params);
                if ($hitos) {
                    $this->guardarHitos($hitos, $idoferta);
                }
                if ($productos) {
                    $this->saveIndicador($productos, $idoferta);
                }
                if ($idmediopago) {
                    $this->saveMediosPago($idmediopago, $idoferta);
                }

                return array('success' => true);
            } else {
                return array('success' => false, 'code' => 1);
            }
        } catch (Exception $e) {
            return array('success' => false, 'code' => $e->getCode(), 'message'=>$e->getMessage());
        }
    }

    public function modificarOferta($params)
    {
        try {
            $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
            $result = $conn->fetchAll(
                "SELECT count(o.idoferta) FROM mod_crmcontratacion.dat_ofertanegocio o 
                      WHERE o.numero='" . $params['numero'] .
                "' AND o.idestructuracomun=" . $this->_idestructura
                . " AND o.idoferta!=" . $params['idoferta']
            );
            if ($result[0]['count'] == 0) {
                $saveValues = array();
                $saveValues['idoferta'] = $params['idoferta'];
                $saveValues['nombre'] = $params['nombre'];
                $saveValues['numero'] = $params['numero'];
                $saveValues['idsolicitud'] = $params['idsolicitud'] != ''
                    ? $params['idsolicitud'] : null;
                $saveValues['fechafirma'] = $params['fechafirma'];
                $saveValues['vigencia'] = $params['vigencia'];
                $saveValues['unidadtiempo'] = $params['unidadtiempo'];
                $saveValues['idcondicionpago'] = $params['idcondicionpago'] != ''
                    ? $params['idcondicionpago'] : null;
                $saveValues['montototal'] = $params['montototal'] != ''
                    ? $this->formatearNumero($params['montototal']) : 0;
                $saveValues['idsector'] = $params['idsector'];
                $saveValues['idarea'] = $params['idarea'];
                $saveValues['idresponsable'] = $params['idpersona'];
                $saveValues['descripcion'] = $params['descripcion'];
                $saveValues['objeto'] = $params['objeto'];
                $saveValues['cliente'] = $params['tipo'];
                $saveValues['idclienteproveedor'] = $params['idclienteproveedor'];
                $this->updateUploadFilesName($params);
                if (count($_FILES) != 0) {
                    $saveValues['idespaciotrabajo'] = ($params['idespaciotrabajo'])
                        ? $params['idespaciotrabajo']
                        : $this->generateEspacioTrabajo($params);
                    $this->insertarDocumentos($saveValues['idespaciotrabajo']);
                }

                $this->modificarDocumentos(json_decode($params['editfile']));
                $this->eliminarDocumentos(json_decode($params['delfile']));

                $this->_ofertaRepository->updateRecord($saveValues);
                $this->guardarMonedasOferta($params['idoferta'], $params);
                if ($params['hitos']) {
                    $this->guardarHitos(
                        json_decode($params['hitos']), $params['idoferta']
                    );
                }
                if ($params['productos']) {
                    $this->saveIndicador(
                        json_decode($params['productos']), $params['idoferta']
                    );
                }
                if ($params['idmediopago']) {
                    $this->saveMediosPago(
                        $params['idmediopago'], $params['idoferta']
                    );
                }
                return array('success' => true);
            } else {
                return array('success' => false, 'code' => 1);
            }
        } catch (Exception $e) {
            return array('success' => false, 'code' => $e->getCode(), 'message'=>$e->getMessage());
        }
    }

    public function eliminarOferta($ids)
    {
        $this->_ofertaRepository->deleteRecords($ids);
    }

    public function getConfigOfertaNegocio()
    {
        return (new ConfOfertaNegocio())->getConfig();
    }

    public function getSolicitudesNegocio($params)
    {
        $filter = array();
        $filter = $params['filter'];
        if ($params['query']) {
            $filter[] = array('field' => 'nombre',
                              'data'  => array('type'  => 'string',
                                               'value' => $params['query']));
        }

        $lista = $this->_solicitudDService->getSolicitudes(
            array(
                'limit'   => 20,
                'start'   => 0,
                'filters' => $filter
            )
        );
        $resultado = array('count' => $lista['cant'],
                           'data'  => $lista['datos']);
        return $resultado;
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
        if($this->existeGestorDocumental()){
            $result = $this->_confcontratacion->loadConfOfertaNegocio();
            if (count($result['config'])){
                $idespacioGeneral=$result['config']['idespaciotrabajo'];
            }

            if ($idespacioGeneral) {
                $idespaciocliente = $this->crearEspacioClienteProveedor($idespacioGeneral, $params);

                return  $this->crearEspacioOfertaNegocio($idespaciocliente, $params);
            }

            return '';
        }

    }

    private function crearEspacioClienteProveedor($idespacio, $parametros)
    {
        try {
            $coneccion = Doctrine_Manager::getInstance()->getCurrentConnection()->getName();
            $parametros = array('idclientesproveedores' => $parametros['idclienteproveedor'],
                                'idestructuracomun'     => $this->_idestructura,
                                'idespaciotrabajo'      => $idespacio,
                                'proceso'               => 'oferta',
                                'coneccion'             => $coneccion);
            $resultado = $this->_datosmaestros->getEspacioTrabajoCliente($parametros);
            if (count($resultado)) {
                $idespacio = $resultado['idespaciotrabajo'];
            }
            return $idespacio;
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function crearEspacioOfertaNegocio($idespacio, $parametros)
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
            $result = $this->_confcontratacion->loadConfOfertaNegocio();
            if (count($result) && count($result['config']) && $result['config']['activo']
                && $this->_gestordocumental->testGD()
            ) {
                return true;
            }
            return false;
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function insertarDocumentos($idespaciooferta)
    {
        try {
            if (count($_FILES) != 0 && $idespaciooferta) {

                $documento = $this->_gestordocumental->saveDocument(
                    $idespaciooferta
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

    public function eliminarDocumentos($docs)
    {
        try {
            $this->_gestordocumental->delFile($docs);
        } catch (Exception $e) {
            throw $e;
        }
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

    public function guardarMonedasOferta($idoferta, $parametros)
    {
        try {
            $monedas = new Doctrine_Collection('DatMonedaOferta');
            foreach ($parametros as $k => $v) {
                if (preg_match('/idmoneda_/i', $k)) {
//                    print('/'.$k.'--'.$v.'/');
                    $temp = explode('_', $k);
                    $moneda = Doctrine::getTable('DatMonedaOferta')->findByDql(
                        'idoferta=? and idmoneda=?', array($idoferta, $v)
                    );
                    if (!$moneda->count()) {
                        $moneda = new DatMonedaOferta();
                        $moneda->idoferta = $idoferta;
                        $moneda->idmoneda = $v;
                    } else {
                        $moneda = $moneda->getFirst();
                    }
                    $moneda->valor = ($parametros['montomoneda_' . $temp[1].'_'.$v] ? $this->formatearNumero(
                        $parametros['montomoneda_' . $temp[1].'_'.$v]
                    ) : 0);
//                    print('||'.$idoferta.'-'.'montomoneda_' . $temp[1].'_'.$v.':'.($parametros['montomoneda_' . $temp[1].'_'.$v] ? $this->formatearNumero(
//                        $parametros['montomoneda_' . $temp[1].'_'.$v]
//                    ) : 0));
                    $monedas->add($moneda);
                }
            }
//            print_r(count($monedas));
            $monedas->save();
        } catch (Exception $e) {
//            print($e->getMessage());
            throw $e;
        }
    }

    public function guardarHitos($data, $idoferta)
    {
        try {
            $modificados = gettype($data->modificados) == 'string' ?
                json_decode(stripcslashes($data->modificados))
                : $data->modificados;
            $eliminados = gettype($data->eliminados) == 'string' ?
                json_decode(stripcslashes($data->eliminados))
                : $data->eliminados;
            if (count($modificados)) {
                foreach ($modificados as $actual) {
                    $idhito = DatHitoOferta::guardarHitoOferta(
                        $actual, $idoferta
                    );
                }
            }

            if (count($eliminados)) {
                DatHitoOferta::eliminarHitos($eliminados);
            }
        } catch (Doctrine_Exception $e) {
            return array('code'    => $e->getCode(),
                         'msg'     => $e->errorMessage(), 'success' => false);
        }
    }

    public function saveIndicador($data, $idoferta)
    {
        try {
            foreach ($data->guardados as $prod) {
                $producto = $prod->idindicadorcontrato ? Doctrine::getTable(
                    'DatIndicadorOferta'
                )
                    ->find($prod->idindicadorcontrato)
                    : new DatIndicadorOferta();
                $producto->idindicador = $prod->idindicador ? $prod->idindicador
                    : null;
                $producto->idactividad = $prod->idactividad ? $prod->idactividad
                    : null;
                $producto->denominacion = $prod->denominacion;
                $producto->tipo = $prod->tipo;
                $producto->idoferta = $idoferta;
                $producto->cantidad = $prod->cantidad;
                $producto->save();
                DatMonedaIndicadorOferta::guardarMonedaIndicador(
                    $prod, $producto->idindicadoroferta
                );
            }
            if (count($data->eliminados)) {
                DatIndicadorOferta::eliminarIndicador($data->eliminados);
            }
        } catch (Doctrine_Exception $e) {
            return array('code'    => $e->getCode(),
                         'msg'     => $e->errorMessage(), 'success' => false);
        }
    }

    private function saveMediosPago($mediospago, $idoferta)
    {
        $exists = array();
        foreach (explode(',', $mediospago) as $mp) {
            $tabla = Doctrine::getTable('DatMedioPagoOferta')->findBySql(
                'idmediopago=' . $mp . ' AND idoferta=' . $idoferta
            )->getFirst();
            if (!$tabla) {
                $tabla = new DatMedioPagoOferta();
                $tabla->idoferta = $idoferta;
                $tabla->idmediopago = $mp;
                $tabla->save();
            }
            $exists[] = $tabla->idmediopagooferta;
        }
        foreach (
            Doctrine::getTable('DatMedioPagoOferta')
                ->findBySql(
                    'idoferta=' . $idoferta . ' AND
                        idmediopagooferta NOT IN (' . implode(',', $exists)
                    . ')'
                ) as $aelimar
        ) {
            $aelimar->delete();
        }
    }

    public function formatearNumero($numero)
    {
        return str_replace(',', '.', $numero);
    }

    public function getHitosOferta($params)
    {
        $params['idestructura'] = $this->_idestructura;
        return DatHitoOferta::cargarhitosofertas($params);
    }

    public function getProductosServicios($params)
    {
        $params['idestructura'] = $this->_idestructura;
        return DatIndicadorOferta::cargarindicadoresoferta($params);
    }

    public function getAnexos($params)
    {
        try {
//            $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
//        $ofertas = $conn->fetchAll(
//            "SELECT idespaciotrabajo FROM mod_crmcontratacion.dat_ofertanegocio
//              WHERE idoferta=" . $params['idoferta']
//        );
            $idespacio = null;
            $oferta = Doctrine::getTable('OfertaNegocio')->find($params['idoferta']);
            $documentos = array();
            if ($oferta && $oferta->idespaciotrabajo && $this->existeGestorDocumental()) {
                $idespacio = $oferta['idespaciotrabajo'];
                $documentos=$this->getOfertaDocs($idespacio);
            }
            return $documentos;
        }catch(Exception $e){
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

    public function cargandoDatosSolicitud($idsolicitud)
    {
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        return $conn->fetchAll(
            "SELECT sn.*,
              (CASE WHEN cp.registrado = 0 THEN cp.nombre else COALESCE (estru.denominacion, per.nombre||' '||per.papel||' '||per.sapel) END) as clienteproveedor
              FROM mod_crmcontratacion.dat_solicitudnegocio sn
              LEFT JOIN mod_datosmaestros.nom_clientesproveedor cp ON cp.idclientesproveedores= sn.idclienteproveedor 
                       LEFT JOIN mod_estructuracomp.dat_estructura estru ON (cp.idestructura = estru.idestructura and estru.idproyecto=0)
                       LEFT JOIN mod_persona.dat_persona per ON (cp.idpersona = per.idpersona)
              WHERE sn.idsolicitud=" . $idsolicitud
        );
    }

    public function getNumeroOfertaAutomatico()
    {
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        $anoActual = date('y');
        $ofertas = $conn->fetchAll(
            "
            SELECT numero FROM mod_crmcontratacion.dat_ofertanegocio
            WHERE idestructuracomun=" . $this->_idestructura . " AND
            numero LIKE '%/" . $anoActual . "' ORDER BY idoferta LIMIT 20 OFFSET 0"
        );
        $mayor = 0;
        foreach ($ofertas as $o) {
            $aux = explode('/', $o['numero']);
            if ($mayor < intval($aux[0])) {
                $mayor = intval($aux[0]);
            }
        }

        return strval($mayor+1).'/'.strval($anoActual);
    }
}