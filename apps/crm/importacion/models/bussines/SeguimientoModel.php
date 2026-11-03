<?php
/**
 * Created by PhpStorm.
 * User: work
 * Date: 05/02/18
 * Time: 2:39 PM
 */

class SeguimientoModel extends ZendExt_Model
{

    private $_contratomodel;
    private $_idestructura;
    private $_gestordocumental;
    private $_confcontratacion;
    private $_datosmaestros;
    private $_facturas;
    private $_transicion;
    private $_idproceso;
    private $_estadoRepository;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_contratomodel = new GestioncontratoModel();
        $this->_idestructura = $this->global->Estructura->idestructura;
        $this->_gestordocumental = new GestorDocumentalComunicationInterface();
        $this->_confcontratacion = new ConfContratacionModel();
        $this->_datosmaestros = new DatosMaestrosComunicationInterface();
        $this->_facturas = new GestionfacturasModel();
        $this->_transicion = new NomTransicion();
        $this->_hito = new DatHitoContrato();
        $this->_producto = new DatIndicadorContrato();
        $this->_indicadorfacturaarribo = new DatIndicadorFacturaArribo();
        $this->_idproceso = 'seguimiento';
        $this->_estadoRepository = new SeguimientoRepository();
        $estado = new NomEstado();
        $this->_estadosAceptados = $estado->getEstadoTrabajoTerminado();
        $estados = array();
        foreach ($this->_estadosAceptados as $est) {
            $estados[] = $est['idestado'];
        }
        $this->_idestadosAceptados = implode(',', $estados);
    }

    public function cargarContratos($params)
    {
        $params = $this->crearFiltrosContratoPorDefecto($params);
        $result = $this->_contratomodel->getContratos($params);
        return $result;
    }

//    public function cargarHitos($params)
//    {
//        $objDoctrine = Doctrine_Manager::getInstance();
//        $conexionActual = $objDoctrine->getCurrentConnection();
//        $instance = $conexionActual->fetchAll(
//            'SELECT sp.idarribo, spo.hitos FROM mod_crmcontratacion.dat_solicitudpago sp
//                      LEFT JOIN mod_crmcontratacion.dat_solicitudpagoobjetivo spo ON sp.idarribo=spo.idarribo
//                      WHERE sp.idarribo=' . $params['idarribo']
//            . ' LIMIT 1'
//        );
//        $result1 = array();
//        if ($instance[0]['hitos']) {
//            $stringAux = substr($instance[0]['hitos'], 2, -2);
//            $recorrer = split(",", $stringAux);
//            foreach ($recorrer as $hito) {
//                $resultaaa = $conexionActual->fetchAll(
//                    'SELECT h.numero, h.descripcion, ne.nombre, ne.icono
//                FROM mod_crmcontratacion.dat_hito h
//                LEFT JOIN mod_crmcontratacion.dat_hitoestado he ON he.idhito=h.idhito
//                LEFT JOIN mod_crmcontratacion.nom_estado ne ON he.idestado=ne.idestado
//                WHERE h.idhito=' . $hito
//                );
//                if (count($resultaaa) > 0) {
//                    $result1[] = $resultaaa[0];
//                }
//
//            }
//        }
//        return $result = array('data' => $result1);
//    }

    public function getAEstadoTrazas($idarribo)
    {
        $listEstados = $this->_estadoRepository->getEstados(
            array('equalIdSeguimiento' => $idarribo)
        );
        foreach ($listEstados as &$value) {
            $persona = (new PersonaComunicationInterface())->getPersona(
                $value['idpersona']
            );
            $estruc = (new EstructuraComunicationInterface())->getEstructuraById($persona['idarea']);
            $value['nombreapellidos'] = $persona['nombreapellidos'];
            $value['area'] = $estruc[0]->denominacion;
            $value['duracionestado'] = $this->calcularDuracionEstado($value);
        }
        return $listEstados;
    }

    private function calcularDuracionEstado($value)
    {
        $fechainicio = DateTime::createFromFormat(
            'd/m/Y', $value['fechainicio']
        );
        $fechafin = DateTime::createFromFormat(
            'd/m/Y', ($value['fechafin']) ? $value['fechafin'] : date('d/m/Y')
        );
        $diferencia = $fechainicio->diff($fechafin);
        return $diferencia->days;
    }


    public function crearFiltrosContratoPorDefecto($params)
    {
        if (!$params['filter']) {
            $params['filter'] = [];
        }

        $params['filter'][] = array('field' => 'vigente',
            'data' => array('type' => 'boolean',
                'value' => true));
        $params['filter'][] = array('field' => 'cliente',
            'data' => array('type' => 'list',
                'value' => array(2)));
        $params['filter'][] = array('field' => 'estadoinicial',
            'data' => array('type' => 'list',
                'value' => '['
                    . $this->_idestadosAceptados
                    . ']'));
        return $params;
    }

    public function listarArribos($params)
    {
//        print($params);die;
        $result = DatArribo::listarArribos($params);
        $result['estados'] = $this->obtenerEstados();
//        $instance=null;
//        $instance=Doctrine::getTable('DatProductosArribo')->findBy('idarribo', $params['idarribo'])->getFirst();
//        yo.todosHitos=[];
//        foreach(json_decode($instance->hitos) as yo.todosHitos){
        return $result;
    }

    public function obtenerEstados()
    {
        $idroles = $this->_facturas->getRoles();
        $result = $this->_transicion->getEstadoTransicionesPermisos(
            $this->_idproceso, $idroles
        );
//        print_r($result);
        return $this->_facturas->changeResponse($result);
    }

    public function cargarEstados($idproceso, $mostrarInicial = true)
    {
        if (is_null($idproceso)) {
            $idproceso = $this->_idproceso;
        }
        $idroles = $this->_facturas->getRoles();
//        $result = $this->_transicion->getEstadoTransicionesPermisos($this->_idproceso, $idroles);
        try {
            if (!$this->_idproceso && !$idroles) {
                return array();
            }
            $stringIdsRol = '(' . implode(",", $idroles) . ')';
            $result = Doctrine_Query::create()
                ->select('ne.*, nt.*,rt.*')
                ->from('NomEstado ne')
                ->leftJoin(
                    'ne.NomTransicion nt ON nt.idestadoinicial = ne.idestado OR nt.idestadofinal = ne.idestado'
                )
                ->leftJoin(
                    'nt.DatRolTransicion rt WITH rt.idrol IN ' . $stringIdsRol
                )
                ->leftJoin('nt.NomProceso np')
                ->where('np.identificador =?', $idproceso);
            if (!$mostrarInicial) {
                $result->andWhere('ne.inicial =?', 0);
            }
            return $result->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }

    }

    public function guardarArribo($params)
    {
//        print_r($params);die;
        try {
            $arribo = new DatArribo();
            if ($params['idarribo'] != '') {
                $arribo = Doctrine::getTable('DatArribo')->find(
                    $params['idarribo']
                );
            }
            $arribo->descripcion = $params['descripcion'];
//            $arribo->objetivos = $params['objetivos'];
            $arribo->codigo = $params['codigo'];
            $arribo->idarea = $params['idarea'];
            $arribo->idformapago = $params['idformapago'];
            $arribo->fecharecibo = $params['fecharecibo'];
            $arribo->idcontrato = $params['idcontrato'];
            $arribo->idestructuracomun = $this->_idestructura;
            $con=Doctrine_Manager::getInstance()->getCurrentConnection();
            $con->beginTransaction();
            $arribo->save();
            if ($params['idarribo'] == '') {
                $idestado = $this->obtenerEstadoinicial();
                $this->cambiarEstado(
                    array('idestado' => $idestado,
                        'idarribo' => $arribo->idarribo)
                );
            }
            if ($params['facturas']) {
                $facturas = json_decode($params['facturas']);
                if ($facturas->modificadas) {
//                foreach($facturas->modificadas as $factura){
                    $this->guardarFacturasArribo(
                        $facturas->modificadas, $arribo->idarribo,
                        $arribo->idestructuracomun, $params
                    );
//                }
                }
                if ($facturas->eliminadas) {
                    $this->eliminarFacturas($facturas->eliminadas);
                }
            }
            if ($params['pedidos']) {
                if (json_decode($params['pedidos'])) {
                    $this->guardarArriboPedidos(
                        $params['pedidos'], $arribo->idarribo
                    );
                }
            }
//            if ($params['productos']) {
//                $productos = json_decode($params['productos']);
//                if ($productos->guardados) {
//                    $this->guardarProductosArribo(
//                        $productos->guardados, $arribo->idarribo,
//                        $arribo->idestructuracomun, $params
//                    );
//                }
//            }
//            if (count(json_decode($params['indicadores'])) > 0) {
//                $instance = Doctrine::getTable('DatProductosArribo')
//                    ->findBy('idarribo', $arribo->idarribo)
//                    ->getFirst();
//                if (!$instance) {
//                    $instance = new DatProductosArribo();
//                    $instance->idarribo = $arribo->idarribo;
//                }
//                    $instance->save();
//
//                $instance->save();
//            } else {
//                $instance = Doctrine::getTable('DatProductosArribo')
//                    ->findBy('idarribo', $arribo->idarribo)
//                    ->getFirst();
//                if ($instance) {
//                    $instance->delete();
//                }
//            }
            $cantArchivos = 0;
            foreach ($_FILES as $file) {
                if ($file['name'] != '') {
                    $cantArchivos += 1;
                }
            }
            $con->commit();
            return array('success' => true, 'code' => 1,
                'gestordoc' => $this->existeGestorDocumental(),
                'archivos' => $cantArchivos);
//                'archivos'=>count($_FILES));
        } catch (Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(),
                'success' => false);
        }
    }

    public function obtenerEstadoinicial()
    {
        try {
            $estado = new NomEstado();
            $idestado = $estado->getEstadoInicial()['idestado'];
            if (!$idestado) {
                throw new Exception('No existe el estado inicial.', 333);
            }
            return $idestado;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function cambiarEstado($params)
    {
        try {
            $this->cambiarFechaFinEstado($params['idarribo']);
            $estado = new DatArriboEstado();
            $estado->idarribo = $params['idarribo'];
            $estado->idestado = $params['idestado'];
            $estado->fechainicio = date('d/m/Y');
            $estado->idusuario = $this->global->Perfil->idusuario;
            $estado->save();
//            $instance = null;
            $instance = Doctrine::getTable('DatArriboPedido')->findBy(
                'idarribo', $params['idarribo']
            )->getFirst();
            if ($instance != null && $instance->pedidos) {
                foreach(explode(',', $instance->pedidos) as $idcontratopedido){
                    $anterior = Doctrine::getTable('DatContratoPedidoEstado')->findByDql(
                        'idcontratopedido=? and fechafin ISNULL', array($idcontratopedido)
                    );
                    if (count($anterior)) {
                        $anterior = $anterior[0];
                        $anterior->fechafin = date('d/m/Y');
                        $anterior->save();
                    }
                    $nueva = new DatContratoPedidoEstado();
                    $nueva->idestado = $params['idestado'];
                    $nueva->idcontratopedido = $idcontratopedido;
                    $nueva->idusuario = $this->global->Perfil->idusuario;
                    $nueva->fechainicio = date('d/m/Y');
                    $nueva->save();
                }
            }
            return array('code' => 1, 'success' => true);
        } catch (Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(),
                'success' => false);
        }
    }

    private function cambiarFechaFinEstado($idarribo)
    {
        try {
            $instance = Doctrine::getTable('DatArriboEstado')
                ->findByDql(
                    'idarribo=? and fechafin ISNULL',
                    array($idarribo)
                );
            if (count($instance)) {
                $instance = $instance[0];
                $instance->fechafin = date('d/m/Y');
                $instance->save();
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function eliminarFacturas($idfacturas)
    {
        foreach ($idfacturas as $factura) {
            if ($factura->idnodoarchivo) {
                $this->_gestordocumental->delFile(
                    array($factura->idnodoarchivo)
                );
            }
            $query = Doctrine_Query::create();
            $query->delete()->from('DatFacturaArribo')
                ->where('idfacturaarribo=?', $factura->idfacturaarribo)->execute();
        }
    }

    public function guardarFacturasArribo(
        $facturas, $idarribo, $idestructuracomun, $parametros
    )
    {
//        print_r($facturas);die;

        try {
            foreach ($facturas as $params) {
//                print('llega0');
//                print_r($params);die;
                $factura = $params->idfacturaarribo ?
                    Doctrine::getTable('DatFacturaArribo')->find(
                        $params->idfacturaarribo
                    )
                    : new DatFacturaArribo();
                $factura->numero = $params->numero?$params->numero:null;
                $factura->numerocontenedor = $params->numerocontenedor?$params->numerocontenedor:null;
                $factura->idtipoentrega = $params->idtipoentrega?$params->idtipoentrega:null;
                $factura->fecha = $params->fecha?$params->fecha:null;
                $factura->numerobl = $params->numerobl?$params->numerobl:null;
                $factura->idarribo = $idarribo;
                if ($params->archivoid && $this->existeGestorDocumental()) {
                    if (!$factura->idespaciotrabajo) {
                        $idespacio = $this->crearEspacioClienteProveedor(
                            $parametros, $idarribo, $idestructuracomun
                        );
                        $factura->idespaciotrabajo
                            = $this->crearEspacioContrato(
                            $idespacio, $parametros, $params
                        );
                    }
                    $this->guardarDocumento(
                        $factura->idespaciotrabajo, $params, $idarribo
                    );
                }
                $factura->save();
//                print('llega1');
//                print_r($factura);die;
                if ($params->monedas) {
                    foreach ($params->monedas as $moneda) {
                        DatFacturaArriboMoneda::guardarFacturaArriboMoneda(
                            $moneda, $factura->idfacturaarribo
                        );
                    }
                }
//                print('llega2');
                if ($parametros['productos']) {
                    $productos = json_decode($parametros['productos']);
                    if ($productos->guardados) {
                        $this->guardarProductosArribo(
                            $productos->guardados, $factura->idfacturaarribo,
                            $idestructuracomun, $params
                        );
                    }
                }
            }
        } catch (Doctrine_Exception $e) {
//                print('/*error:' . $e->getCode() . '*/');
//                print_r($e->errorMessage());
            throw $e;
//                return array('code' => $e->getCode(), 'msg' => $e->errorMessage(), 'success' => false);
        }

    }

    public function guardarArriboPedidos($pedidos, $idarribo){
        $instance = Doctrine::getTable('DatArriboPedido')
            ->findBy('idarribo', $idarribo)
            ->getFirst();
        if(!$instance){
            $instance=new DatArriboPedido();
            $instance->idarribo=$idarribo;
        }
        $instance->pedidos = $pedidos;
        $instance->save();
    }

    public function guardarProductosArribo(
        $productos, $idfacturaarribo, $idestructuracomun, $parametros
    )
    {
//        print_r($productos);die;
//
        try {
            foreach ($productos as $i) {
                $params=(array)$i;
                $params['idfacturaarribo']=$idfacturaarribo;
                $model=new DatIndicadorFacturaArribo();
                $model->guardarIndicador($params);
//                print_r($params);die;
//                $producto = $params->idproductoarribo ?
//                    Doctrine::getTable('DatProductosArribo')->find($params->idproductoarribo)
//                    : new DatProductosArribo();
//                $producto->cantidad = $params->cantidad;
//                $producto->idproducto = $params->idindicadorcontrato;
//                $producto->idarribo = $idarribo;
//                $producto->save();
//                print_r($producto);die;
            }
        } catch (Doctrine_Exception $e) {
//                print('/*error:' . $e->getCode() . '*/');
//                print_r($e->errorMessage());
            throw $e;
//                return array('code' => $e->getCode(), 'msg' => $e->errorMessage(), 'success' => false);
        }
    }

    private function guardarDocumento($idespacio, $params, $idarribo)
    {
        $this->establecerNombreDocumento($params, $idarribo);
        if (count($_FILES) && $idespacio) {
//            $gestordocumental=new GestorDocumentalComunicationInterface();
            if ($this->_gestordocumental->testGD()) {
                foreach ($_FILES as $index => $file) {
                    if ($index == $params->archivoid) {
                        if ($params->idfacturaarribo) {
//                            $this->integrator->gestordocumental->editDocument(
//                                $idespacio, $file);
                            $this->_gestordocumental->delFile(
                                array($params->idnodoarchivo)
                            );
                        }
                        $this->saveDocument($file, $idespacio);
                    }
                }
            }
//            $documento = $gestordocumental->saveDocument($idespacio);
//            if (count($documento) == 0) {
//                throw new Exception('Ocurrio un error al salvar el documento.', 335);
//            }
        }
    }

    public function saveDocument($file, $idnodo)
    {

        if ($file['name']) {
            $result = $this->_gestordocumental->saveDocument($idnodo);
            if ($result->id) {
                $documentos[] = array('id' => $result->id,
                    'name' => $file['name']);
            } else {
                return;
            }
        }
    }

    public function crearEspacioClienteProveedor($parametros, $idarribo,
                                                 $idestructuracomun
    )
    {
        try {
            $idespacio = $this->getIdEspacioTrabajo();
            $coneccion = Doctrine_Manager::getInstance()->getCurrentConnection()
                ->getName();
            $parametros = array('idclientesproveedores' => $idarribo,
                'idestructuracomun' => $idestructuracomun,
                'idespaciotrabajo' => $idespacio,
                'coneccion' => $coneccion);
//            $datosmaestros = new DatosMaestrosComunicationInterface();
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

    public function crearEspacioContrato($idespacio, $parametros, $params)
    {
        try {
            $idespacio1 = $this->_gestordocumental->CreateWorkSpace(
                $idespacio, 'Contrato ' . $parametros['contrato']
            );
            $idespacio2 = $this->_gestordocumental->CreateWorkSpace(
                $idespacio1, 'Solicitud de pago ' . $parametros['codigo']
            );
            $idespacio3 = $this->_gestordocumental->CreateWorkSpace(
                $idespacio2, 'Factura #' . $params->numero
            );
            return $idespacio3;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getIdEspacioTrabajo()
    {
//        $result = $this->_confcontratacion->loadContractdoc();
        $result = $this->_confcontratacion->loadConfSolicitudPago();
        return $result[0]['idespaciotrabajo'];
    }

    public function establecerNombreDocumento($parametros, $idarribo)
    {
        foreach ($_FILES as $k => $file) {
//            $id = explode("doc_", $k)[1];
            if ($_FILES[$k]['name']) {
                $_FILES[$k]['realname'] = $_FILES[$k]['name'];
            } else {
                unset($_FILES[$k]);
            }
        }
    }

    public function eliminarArribo($idarribos)
    {
        $upEx = array();
//        try {
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        foreach ($idarribos as $del) {
            $facturas = $conexionActual->fetchAll(
                '
                    SELECT fa.idespaciotrabajo 
                    FROM mod_crmcontratacion.dat_facturaarribo fa
                    WHERE fa.idarribo=' . $del->id
            );
            foreach ($facturas as $fac) {
                if ($fac['idespaciotrabajo']
                    && $this->existeGestorDocumental()
                ) {
                    $this->_gestordocumental->delFile(
                        array($fac['idespaciotrabajo'])
                    );
                }
            }
            $query
                = "DELETE FROM mod_crmcontratacion.dat_arribo ";
            $query .= " WHERE idarribo = " . $del->id;
            $query .= " RETURNING idarribo ;";

            $ex = $conexionActual->fetchAll($query);
            if (!$ex) {
                $upEx[] = $del->codigo;
            }
        }
        if (empty($upEx)) {
            return array('success' => true);
        }
        return array('success' => false, $upEx);
    }

    public function cargarFacturas($params)
    {
        try {
            $objDoctrine = Doctrine_Manager::getInstance();
            $conexionActual = $objDoctrine->getCurrentConnection();
            $gestordoc = $this->existeGestorDocumental();
            $productos = array();
            $datos = $conexionActual->fetchAll(
                'SELECT fa.*, nte.denominacion as tipoentrega
            FROM mod_crmcontratacion.dat_facturaarribo fa
            LEFT JOIN  mod_crmcontratacion.nom_tipoentrega nte ON nte.idtipoentrega=fa.idtipoentrega
            WHERE fa.idarribo=' . $params['idarribo'] .
                'ORDER BY fa.numero'
            );

            foreach ($datos as $pos => $valor) {

                $monedas = $conexionActual->fetchAll(
                    'SELECT fam.valor, m.codigoiso
                FROM mod_crmcontratacion.dat_facturaarribomoneda fam
                LEFT JOIN mod_datosmaestros.nom_moneda m ON fam.idmoneda=m.idmoneda
                WHERE fam.idfacturaarribo=' . $valor['idfacturaarribo']
                );
                foreach ($monedas as $mon) {
                    $datos[$pos]['importe_' . strtolower($mon['codigoiso'])]
                        = $mon['valor'];
                }
                if ($gestordoc) {
                    try {
                        $datosAnexo = $this->getFile($valor);
                        if (count($datosAnexo) > 0) {
                            $datos[$pos]['idnodoarchivo']
                                = $datosAnexo[0]['idnodo'];
                            $datos[$pos]['archivoNombre']
                                = $datosAnexo[0]['nombre'];
                            $datos[$pos]['archivo'] = $datosAnexo[0]['url'];
                        }
                    } catch (Exception $e) {
                        return array('code' => $e->getCode(),
                            'msg' => $e->errorMessage(),
                            'success' => false);
                    }
                }
                $prodtemp = $this->_indicadorfacturaarribo->cargarindicadoresfacturaarribo(
                    array('idfacturaarribo' => $valor['idfacturaarribo']));
                $productos = array_merge($productos, $prodtemp);
            }
            $cant = $conexionActual->fetchAll(
                'SELECT count(fa.idfacturaarribo) 
                FROM mod_crmcontratacion.dat_facturaarribo fa
                WHERE fa.idarribo=' . $params['idarribo']
            );
            $result = array(
                'success'=>true, 'data' => $datos, 'total' => $cant[0]['count'],
                'productos' => $productos, 'gestordoc' => $gestordoc);
            return $result;
        } catch (Exception $e) {
            return array('success'=>false, 'mensaje'=>$e->getMessage());
        }
    }

    public function getFile($params)
    {
        try {
            $resultado = [];
            $contrato = Doctrine::getTable("DatFacturaArribo")->find(
                $params['idfacturaarribo']
            );
            if (
//                $this->existeGestorDocumental() &&
            !empty($contrato->idespaciotrabajo)
            ) {

                $documentos = $this->_gestordocumental->getContenido(
                    array('idespaciotrabajo' => $contrato->idespaciotrabajo)
                );
                foreach ($documentos as $doc) {
                    $params['iddocument'] = $doc['idnodo'];
                    $result = $this->_gestordocumental->getFile($params);
//                    print_r($result);die;
                    if ($result) {
                        $resultado[] = array(
                            'nombre' => $doc['nombre'],
                            'url' => $result,
                            'idnodo' => $doc['idnodo']
                        );
                    }
                }
                return $resultado;
            }
            return array();
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function existeGestorDocumental()
    {
        try {
            $result = $this->_confcontratacion->loadConfSolicitudPago();
            if (count($result) && $result[0]['activo']
                && $this->_gestordocumental->testGD()
            ) {
                return true;
            }
            return false;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function obtenerNumeroCodigo($params)
    {
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $result = $conexionActual->fetchAll(
            "SELECT count(a.idarribo) FROM mod_crmcontratacion.dat_arribo a
            WHERE a.idarea=" . json_decode($params['idarea'])
        );
        return str_pad($result[0]['count'] + 1, 3, '0', STR_PAD_LEFT);
    }

    public function cargarMediosPago($params)
    {
        $result = array();
        $extraWhere = '';
        if ($params['query']) {
            $extraWhere = " mp.nombre ILIKE '%" . $params['query'] . "%' ";
        }

        if ($params['idcontrato']) {
            if ($extraWhere != '') {
                $extraWhere = " AND " . $extraWhere;
            }
            $result = $this->doQuery(
                "SELECT mp.idmediodepago, mp.nombre
            FROM mod_crmcontratacion.dat_mediopagocontrato mpc
            LEFT JOIN mod_crmcontratacion.nom_mediodepago mp ON mpc.idmediopago=mp.idmediodepago
            WHERE mpc.idcontrato=" . $params['idcontrato'] . " " . $extraWhere
            );
        }
        if (count($result) == 0) {
            if ($extraWhere != '') {
                $extraWhere = " WHERE " . str_replace(' AND ', '', $extraWhere);
            }
            $result = $this->doQuery(
                "SELECT mp.idmediodepago, mp.nombre
                    FROM mod_crmcontratacion.nom_mediodepago mp " . $extraWhere
            );
        }
        return $result;
    }

    public function getProductos($params)
    {
        try {
            $indicadorcontrato = new DatIndicadorContrato();
            $params['idestructura'] = $this->_idestructura;
            $productostotalescontratos = $indicadorcontrato->getByParams($params);
            $productostotalesarribos = $this->getProductosArribosByContrato($params);
            if (count($productostotalesarribos) == 0) {
                $result = $productostotalescontratos;
            } else {
                foreach($productostotalescontratos as $prod){
                    $finded=false;
                    foreach($productostotalesarribos as $prod2){
//                        print($prod2['codigo'].'--'.$prod['codigo'].' / ');
                        if($prod2['codigo']==$prod['codigo'])$finded=true;
                    };
                    if(!$finded)$result[]=$prod;
                }
            }
            return $result;
        }catch (Exception $e) {
            return array('message'=>$e->getMessage());
        }
    }

    public function getProductosSeguimiento($params){
        return null;
    }

    public function getProductosArribosByContrato($params){
        return $this->_indicadorfacturaarribo->getIndicadoresfacturaarriboByParams($params);
    }

    public function getPedidos($params){
        if($params['idarribo']){
            $params['idcontratopedidos']='-1';
            $instance = Doctrine::getTable('DatArriboPedido')
                ->findBy('idarribo', $params['idarribo'])
                ->getFirst();
            if($instance)
                $params['idcontratopedidos']=$instance->pedidos;
        }
        $pedidos=new DatContratoPedido();
        return $pedidos->listarPedidos($params);
    }

    public function filterliststore()
    {
        return $this->_estadosAceptados;
    }

    public function doQuery($query)
    {
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        return $conexionActual->fetchAll($query);
    }

    public function getPenalizacionesArribo($params){

    }

}
