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

//    if ($params->archivos) {
//        foreach ($params->archivos as $arch) {
//            $archivo = $dir_abs_mt . $params->direccion . $arch->name;
//            chmod($archivo, 0777);
//            $mail->AddAttachment($archivo, $arch->name); //Archivo adjunto
//        }
//    }


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
        $this->_confoferta = new ConfOfertaNegocio();
        $this->_datindicador = new DatIndicadorOferta();
        $this->_ofertacontenedor = new DatOfertaContenedor();
    }

    public function getOfertas($params)
    {
        $params['filters'][] = array('field' => 'idestructuracomun',
                                     'data'  => array('value' => $this->_idestructura));
        $params['filters'][] = array('field' => 'cliente',
                                     'data'  => array('type'=>'list', 'value' => '[3]'));
        $params['modelName']='OfertaNegocio';
        $params['filters']=array_merge($params['filters'], $this->_confcontratacion->loadFiltersCompartimentacion($params));
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

            $incoterms = $conn->fetchAll(
                "SELECT * FROM mod_crmcontratacion.dat_incotermoferta mpo
                LEFT JOIN mod_crmcontratacion.nom_incoterm mp ON mpo.idincoterm=mp.idincoterm
                WHERE mpo.idoferta=" . $actual['idoferta']
            );
            $datosi = array('id' => '', 'nombre' => array());
            foreach ($incoterms as $e) {
                $datosi['id'] = $datosi['id'] . $e['idincoterm'] . ',';
                $datosi['nombre'][] = $e['abreviatura'];
            }
            $result['datos'][$index]['idincoterm'] = trim($datosi['id'], ',');
            $result['datos'][$index]['incoterms'] = $datosi['nombre'];

            $puertoorigen = $conn->fetchAll(
                "SELECT * FROM mod_crmcontratacion.dat_puertoorigenoferta mpo
                LEFT JOIN mod_crmcontratacion.nom_puertoorigen mp ON mpo.idpuertoorigen=mp.idpuertoorigen
                WHERE mpo.idoferta=" . $actual['idoferta']
            );
            $datospo = array('id' => '', 'nombre' => array());
            foreach ($puertoorigen as $e) {
                $datospo['id'] = $datospo['id'] . $e['idpuertoorigen'] . ',';
                $datospo['nombre'][] = $e['denominacion'];
            }
            $result['datos'][$index]['idpuertoorigen'] = trim($datospo['id'], ',');
            $result['datos'][$index]['puertoorigen'] = $datospo['nombre'];

            $puertodestino = $conn->fetchAll(
                "SELECT * FROM mod_crmcontratacion.dat_puertodestinooferta mpo
                LEFT JOIN mod_crmcontratacion.nom_puertodestino mp ON mpo.idpuertodestino=mp.idpuertodestino
                WHERE mpo.idoferta=" . $actual['idoferta']
            );
            $datos = array('id' => '', 'nombre' => array());
            foreach ($puertodestino as $e) {
                $datos['id'] = $datos['id'] . $e['idpuertodestino'] . ',';
                $datos['nombre'][] = $e['denominacion'];
            }
            $result['datos'][$index]['idpuertodestino'] = trim($datos['id'], ',');
            $result['datos'][$index]['puertodestino'] = $datos['nombre'];
        }
        return array(
            'cantidad'          => $result['cantidad'],
            'datos'             => $result['datos'],
            'estados_cliente'   => $this->_estadoDService->getConfiguracionEstados(),
            'estados_compra' => $this->_estadoDService->getConfiguracionEstados(
                'ofertacompra'
            ),
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

            $documentos = $this->_gestordocumental->getContenido(
                array('idespaciotrabajo' => $idespacioTrabajo)
            );
            return $documentos;
        }
        return $result;
    }

    public function adicionarOferta($params)
    {
//        print_r($params['idoferta']);die;
        try {
            $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
//        print_r($params['add']!='duplicate');die;
            if ($params['add'] != 'duplicate') {
                $result = $conn->fetchAll(
                    "SELECT count(o.idoferta) FROM mod_crmcontratacion.dat_ofertanegocio o 
                      WHERE o.numero='" . $params['numero']
                    . "' AND o.idestructuracomun=" . $this->_idestructura
                );
            } else {
                $result = $conn->fetchAll(
                    "SELECT count(o.idoferta) FROM mod_crmcontratacion.dat_ofertanegocio o 
                      WHERE o.numero='" . $params['numero'] .
                    "' AND o.idestructuracomun=" . $this->_idestructura
                    . " AND o.idoferta!=" . $params['idoferta']
                );
            }
            if ($result[0]['count'] == 0) {
                $idmediopago = $params['idmediopago'];
                $hitos = json_decode($params['hitos']);
                $productos = json_decode($params['productos']);
                $saveValues = array();
                $saveValues['nombre'] = $params['nombre'];
                $saveValues['codigo'] = $params['codigo'];
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
                $saveValues['cobros'] = $params['cobros']?json_encode($params['cobros']):'';

                if ($params['add'] == 'duplicate') {
                    $params['idpadre'] = $params['idoferta'];
                }
                $this->updateUploadFilesName($params);
                if (count($_FILES) != 0
                    && $this->_confoferta->getConfig()['activo'] == '1'
                ) {
                    $saveValues['idespaciotrabajo'] = $this->generateEspacioTrabajo(
                        $params
                    );
                    $this->insertarDocumentos($saveValues['idespaciotrabajo']);
                }

                $idoferta = $this->_ofertaRepository->insertRecord($saveValues);
                if ($idoferta) {
                    if (array_key_exists('idofertanegociosolicitud', $params)) {
                        $idofertaimportacion=$this->gestionarOferta($params, $idoferta);
                    }
                    $this->_estadoDService->registrarEstadoInicial($idoferta);
                    $this->guardarMonedasOferta($idoferta, $params);
//                    if ($hitos) {
//                        $this->guardarHitos($hitos, $idoferta);
//                    }
                    if ($productos) {
                        $this->saveIndicador($productos, $idoferta);
                    }
                    if ($idmediopago) {
                        $this->saveMediosPago($idmediopago, $idoferta);
                    }
                    if($params['idpuertoorigen'])
                        $this->savePuertosOrigen($idoferta, $params['idpuertoorigen']);
                    if($params['idpuertodestino'])
                        $this->savePuertosDestino($idoferta, $params['idpuertodestino']);
                    if($params['idincoterm'])
                        $this->saveIncoterms($idoferta, $params['idincoterm']);
                    if ($params['datoscontenedores'] && $idofertaimportacion) {
                        $this->saveDatosContenedores(
                            $params['datoscontenedores'], $idofertaimportacion
                        );
                    }
                }
//                print('/*finale*/');
//                die;

                return array('success' => true,
                    'array_key_exists' => array_key_exists(
                        'idofertanegociosolicitud', $params
                    ),
                    'normal' => $params['idofertanegociosolicitud'],
                );
            } else {
                return array('success' => false, 'code' => 1);
            }
        }catch (Exception $e) {
            return array('success' => false, 'code' => $e->getCode(), 'message'=>$e->getMessage());
        }
    }

    public function modificarOferta($params)
    {
        try{
//        print_r($params);die;
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
                $saveValues['codigo'] = $params['codigo'];
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
                    ?$this->formatearNumero($params['montototal']) : 0;
                $saveValues['idsector'] = $params['idsector']?$params['idsector']:null;
                $saveValues['idarea'] = $params['idarea']?$params['idarea']:null;
                $saveValues['idresponsable'] = $params['idpersona']?$params['idpersona']:null;
                $saveValues['descripcion'] = $params['descripcion'];
                $saveValues['objeto'] = $params['objeto'];
                $saveValues['cliente'] = $params['tipo'];
                $saveValues['idclienteproveedor'] = $params['idclienteproveedor'];
//                print_r(json_encode($params['cobros']));die;

    //            print_r($this->_confoferta->getConfig()['activo']=='1');die;

                if ($this->_confoferta->getConfig()['activo'] == '1') {
                    $this->updateUploadFilesName($params);
                    if (count($_FILES) != 0) {
                        $saveValues['idespaciotrabajo']
                            = ($params['idespaciotrabajo'])
                            ? $params['idespaciotrabajo']
                            : $this->generateEspacioTrabajo($params);
                        $this->insertarDocumentos($saveValues['idespaciotrabajo']);
                    }

                    $this->modificarDocumentos(json_decode($params['editfile']));
                    $this->eliminarDocumentos(json_decode($params['delfile']));
                }
    //            print_r($saveValues);die;
                $this->_ofertaRepository->updateRecord($saveValues);
                if (array_key_exists('idofertanegociosolicitud', $params)) {
                    $idofertaimportacion=$this->gestionarOferta($params, $params['idoferta']);
                }
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
                if($params['idpuertoorigen'])
                    $this->savePuertosOrigen($params['idoferta'], $params['idpuertoorigen']);
                if($params['idpuertodestino'])
                    $this->savePuertosDestino($params['idoferta'], $params['idpuertodestino']);
                if($params['idincoterm'])
                    $this->saveIncoterms($params['idoferta'], $params['idincoterm']);
//                print('1');

                if ($params['datoscontenedores'] && $idofertaimportacion) {
                    $this->saveDatosContenedores(
                        $params['datoscontenedores'], $idofertaimportacion
                    );
                }
//                print('2');die;
                return array('success' => true);
            } else {
                return array('success' => false, 'code' => 1);
            }
        }catch (Exception $e) {
            print($e->getMessage());die;
            return array('success' => false, 'code' => $e->getCode(), 'message'=>$e->getMessage());
        }
    }

    public function gestionarOferta($params, $idoferta)
    {
        try {
            $oferta = new DatOferta();
            if ($params['idofertanegociosolicitud']) {
                $oferta = Doctrine::getTable('DatOferta')->find(
                    $params['idofertanegociosolicitud']
                );
            }
            $oferta->garantia = $params['garantia'] ? $params['garantia']
                : null;
            $oferta->garantiatiempo = $params['garantiatiempo']
                ? $params['garantiatiempo'] : null;
            $oferta->idtiempoentrega=$params['idtiempoentrega']?:null;
//            $oferta->entrega = $params['entrega'] ? $params['entrega'] : null;
//            $oferta->entregatiempo = $params['entregatiempo']?: null;
//            $oferta->idpuertoorigen = $params['idpuertoorigen']?: null;
//            $oferta->puertoorigen = $params['puertoorigen']?: null;
//            $oferta->idpuertodestino = $params['idpuertodestino']?: null;
//            $oferta->puertodestino = $params['puertodestino']?: null;
//            $oferta->idincoterms = $params['idincoterm']?: null;
            $oferta->idembalaje = $params['idembalaje']?: null;
            $oferta->idpadre = $params['idpadre']?: null;
            $oferta->idmediotransporte = $params['idmediotransporte']?: null;
            $oferta->cobros = $params['cobros']?:null;
            $oferta->idofertanegocio = $idoferta;
            $oferta->save();
            return $oferta->idofertanegociosolicitud;
//            $idoferta = $oferta->idoferta;
//            $idoferta = $this->_ofertaRepository->insertRecord($saveValues);
//            return array('success' => true);
        } catch (Exception $e) {
            throw $e;
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
        if ($this->existeGestorDocumental()) {
            $result = $this->_confcontratacion->loadConfOfertaNegocio();
            if (count($result['config'])) {
                $idespacioGeneral = $result['config']['idespaciotrabajo'];
            }

            if ($idespacioGeneral) {
                $idespaciocliente = $this->crearEspacioClienteProveedor(
                    $idespacioGeneral, $params
                );

                return $this->crearEspacioOfertaNegocio(
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
                        'proceso'               => 'oferta',
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
                    $temp = explode('_', $k);
                    $moneda = Doctrine::getTable('DatMonedaOferta')->findByDql(
                        'idoferta=? and idmoneda=?', array($idoferta, $v)
                    );
//                    print_r($moneda->count());die;
                    if (!$moneda->count()) {
                        $moneda = new DatMonedaOferta();
                        $moneda->idoferta = $idoferta;
                        $moneda->idmoneda = $v;
                    } else {
                        $moneda = $moneda->getFirst();
                    }
//                    print_r($parametros['montomoneda_' . $temp[1].'_'.$v]);die;
                    $moneda->valor = $parametros['montomoneda_' . $temp[1].'_'.$v]!= '' ?
                        $this->formatearNumero(
                        $parametros['montomoneda_' . $temp[1].'_'.$v]
                    ) : 0;
                    $monedas->add($moneda);
                }
            }
            $monedas->save();
        } catch (Exception $e) {
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
            return array('code' => $e->getCode(),
                         'msg'  => $e->errorMessage(), 'success' => false);
        }
    }

    public function saveIndicador($data, $idoferta)
    {
        try{
//            print_r($data->guardados);die;
//            print($idoferta);
            foreach($data->guardados as $prod){
                $producto = $prod->idindicadorcontrato ? Doctrine::getTable(
                    'DatIndicadorOferta'
                )->find($prod->idindicadorcontrato): new DatIndicadorOferta();
                $producto->idindicador = $prod->idindicador ? $prod->idindicador:null;
                $producto->idactividad = $prod->idactividad ? $prod->idactividad:null;
                $producto->denominacion = $prod->denominacion;
                $producto->codigo = $prod->codigo;
                $producto->tipo = $prod->tipo;
                $producto->idoferta = $idoferta;
                $producto->cantidad = $prod->cantidad;
                $producto->save();
//                print_r($producto->idindicadoroferta.'/');
                DatMonedaIndicadorOferta::guardarMonedaEntidadIndicador(
                    (array)$prod, $producto->idindicadoroferta
                );
                DatMonedaIndicadorOfertaConversion::guardarMonedaEntidadIndicador(
                    (array)$prod, $producto->idindicadoroferta
                );
            }
            if (count($data->eliminados)) {
                DatIndicadorOferta::eliminarIndicador($data->eliminados);
            }
//            print('/*indicador*/');die;
        } catch (Doctrine_Exception $e) {
            throw $e;
//            return array('code' => $e->getCode(),
//                         'msg'  => $e->errorMessage(), 'success' => false);
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

    public function savePuertosOrigen($idoferta, $idpuertoorigen){
        $exists = array();
        foreach (explode(',', $idpuertoorigen) as $mp) {
            $tabla = Doctrine::getTable('DatPuertoOrigenOferta')
                ->findBySql(
                    'idpuertoorigen=' . $mp . ' AND idoferta='
                    . $idoferta
                )
                ->getFirst();
            if (!$tabla) {
                $tabla = new DatPuertoOrigenOferta();
                $tabla->idoferta = $idoferta;
                $tabla->idpuertoorigen = $mp;
                $tabla->save();
            }
            $exists[] = $tabla->idpuertoorigenoferta;
        }
        foreach (
            Doctrine::getTable('DatPuertoOrigenOferta')
                ->findBySql(
                    'idoferta=' . $idoferta . ' AND
                        idpuertoorigenoferta NOT IN (' . implode(',', $exists)
                    . ')'
                ) as $aeliminar
        ) {
            $aeliminar->delete();
        }
    }

    public function savePuertosDestino($idoferta, $idpuertodestino){
        $exists = array();
        foreach (explode(',', $idpuertodestino) as $mp) {
            $tabla = Doctrine::getTable('DatPuertoDestinoOferta')
                ->findBySql(
                    'idpuertodestino=' . $mp . ' AND idoferta='
                    . $idoferta
                )
                ->getFirst();
            if (!$tabla) {
                $tabla = new DatPuertoDestinoOferta();
                $tabla->idoferta = $idoferta;
                $tabla->idpuertodestino = $mp;
                $tabla->save();
            }
            $exists[] = $tabla->idpuertodestinooferta;
        }
        foreach (
            Doctrine::getTable('DatPuertoDestinoOferta')
                ->findBySql(
                    'idoferta=' . $idoferta . ' AND
                        idpuertodestinooferta NOT IN (' . implode(',', $exists)
                    . ')'
                ) as $aeliminar
        ) {
            $aeliminar->delete();
        }
    }

    public function saveIncoterms($idoferta, $idincoterm){
        $exists = array();
        foreach (explode(',', $idincoterm) as $mp) {
            $tabla = Doctrine::getTable('DatIncotermOferta')
                ->findBySql(
                    'idincoterm=' . $mp . ' AND idoferta='
                    . $idoferta
                )
                ->getFirst();
            if (!$tabla) {
                $tabla = new DatIncotermOferta();
                $tabla->idoferta = $idoferta;
                $tabla->idincoterm = $mp;
                $tabla->save();
            }
            $exists[] = $tabla->idincotermoferta;
        }
        foreach (
            Doctrine::getTable('DatIncotermOferta')
                ->findBySql(
                    'idoferta=' . $idoferta . ' AND
                        idincotermoferta NOT IN (' . implode(',', $exists)
                    . ')'
                ) as $aeliminar
        ) {
            $aeliminar->delete();
        }
    }

    private function saveDatosContenedores($datoscontenedores, $idoferta){
        try {
            foreach($datoscontenedores as $con){
                $params=(array)$con;
                $params['idoferta']=$idoferta;
                $this->_ofertacontenedor->saveOfertaContenedor($params);
            }
        } catch (Exception $e) {
//            print($e->getMessage());die;
            throw $e;
        }
    }

    public function formatearNumero($numero)
    {
        return floatval(str_replace(',', '.', $numero));
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
            $oferta = Doctrine::getTable('OfertaNegocio')->find(
                $params['idoferta']
            );
            $documentos = array();
            if ($oferta && $oferta->idespaciotrabajo
                && $this->existeGestorDocumental()
            ) {
                $idespacio = $oferta['idespaciotrabajo'];
                $documentos = $this->getOfertaDocs($idespacio);
            }
            return $documentos;
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

    public function getNumeroOfertaAutomatico($tipo, $codigolinea)
    {
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        $anoActual = date('Y');
        $separador = $tipo == 1 ? '/' : '.';
        $consulta
            = "SELECT numero FROM mod_crmcontratacion.dat_ofertanegocio
            WHERE idestructuracomun=" . $this->_idestructura . " AND cliente=$tipo AND
            numero LIKE '%$separador" . $anoActual . "' ORDER BY idoferta ";
        //   print_r($consulta);die;
        $ofertas = $conn->fetchAll($consulta);
        $mayor = 0;
        foreach ($ofertas as $o) {
            $aux = explode('$separador', $o['numero']);
            if ($mayor < intval($aux[0])) {
                $mayor = intval($aux[0]);
            }
        }
        return str_pad(strval($mayor + 1), 4, '0', STR_PAD_LEFT) .
            ($tipo == 3 && $codigolinea ? $separador . $codigolinea : '')
            . $separador . strval($anoActual);
    }

    public function getNumeroReofertaAutomatico($params)
    {
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        $anoActual = date('Y');
        $consulta
            = "SELECT COUNT(o.idofertanegociosolicitud) FROM mod_crmcontratacion.dat_oferta o
            INNER JOIN mod_crmcontratacion.dat_ofertanegocio don ON don.idoferta=o.idofertanegociosolicitud
            WHERE don.idestructuracomun=" . $this->_idestructura . " AND don.cliente=3 AND
            o.idpadre=".$params['idsolicitud'];
        $ofertas = $conn->fetchAll($consulta);
//        print_r($ofertas[0]['count']+1);die;
        return $params['numero'].".".(strval($ofertas[0]['count']+1));
    }

    public function getMonedas($params){
        try{
            $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
            $result=$conn->fetchAll("
                SELECT m.*, me.tipomoneda, me.dualidad
                FROM mod_datosmaestros.nom_moneda m
                LEFT JOIN mod_datosmaestros.dat_monedaentidad me ON me.idmoneda=m.idmoneda
                WHERE me.idestructuracomun=".$this->_idestructura
            );
            return array('success'=>true, 'data'=>$result);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getTasasMoneda($params){
        try{
            $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
            $where='';
            if($params['idmoneda']){
                $where.=" AND t.idmoneda=".$params['idmoneda'];
            }
            $result=$conn->fetchAll("
                SELECT t.*, mc.codigoiso as monedainicial, m.codigoiso as monedafinal,
                       mc.idmoneda as idmonedainicial, m.idmoneda as idmonedafinal
                FROM mod_datosmaestros.dat_tasa t 
                LEFT JOIN mod_datosmaestros.nom_moneda m ON m.idmoneda=t.idmoneda
                LEFT JOIN mod_datosmaestros.dat_monedaentidad mec ON mec.idmonedaentidad=t.idmonedacontable
                LEFT JOIN mod_datosmaestros.nom_moneda mc ON mc.idmoneda=mec.idmoneda
                WHERE t.hasta IS NULL AND t.idestructuracomun=".$this->_idestructura . $where
            );
            return array('success'=>true, 'data'=>$result);
        } catch (Exception $e) {
            throw $e;
        }
    }
}