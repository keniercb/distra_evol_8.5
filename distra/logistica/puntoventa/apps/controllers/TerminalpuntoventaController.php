<?php

/**
 * Esta clase controla todo lo referente al punto de venta
 * @copyright Xetid
 * @author  División de Gestión de Entidades
 * @version 1.0
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}
class TerminalpuntoventaController extends BaseController
{
    private $_terminalpuntoventa, $_objHelper, $_serviciosLogisticaGlobal, $_serviciosConfiguracionGeneral,
        $_logisticaGlobal, $_cfgpuntoventa, $_moneda, $_fechacontable,$_fechaactual, $_arrayData;

    public function init()
    {
        $this->_arrayData = array('isPrincipal' => true, 'alias' => 'compventaLog', 'subsistema' =>
            LogisticaGlobal::SUBSISTEMA_FAC);
        parent::init('log.fac.puntoventa');
        $this->_terminalpuntoventa = new TerminalpuntoventaModel($this->_arrayData);
        $this->_cfgpuntoventa = new ConfiguracionpuntoventaModel();        
        $this->_serviciosLogisticaGlobal = LogisticaGlobal::__init();
        $this->_objHelper = LogisticaObjectHelper::__init();
        $this->_serviciosConfiguracionGeneral = ServiciosConfiguracionGeneralHelper::__init();
        $this->_logisticaGlobal = LogisticaGlobal::__init()->getMonedaEntidad();
        if (!$this->global->Perfil) {
            throw new LogisticaException('LOG_LB_PUNTOVENTA_008');
        }
        $fechaGlobal = $this->global->FechaContable;
        $this->_fechacontable = $fechaGlobal->fecha;
        $this->_fechaactual = $fechaGlobal->fechasist;
        if (!$this->_terminalpuntoventa->existeUsuarioConCaja()) {
            throw new LogisticaException('LOG_LB_PUNTOVENTA_001');
        }
        //if($this->uiParams['action'] == 'iniciarSesion' || $this->uiParams['action'] == 'cargaInicial'){
        $consumer = $this->_terminalpuntoventa->datosPagoQREnzona(/*$this->uiParams*/);
            $this->view->uiVariables = array_merge(
                array(
                    'consumerkey' => "'{$consumer[0]['consumerkey']}'",
                    'consumersecret' => "'{$consumer[0]['consumersecret']}'"
                ), $this->view->uiVariables
            );
        //}
        
        /*if($this->_terminalpuntoventa->validarAperturaCaja($this->_fechacontable) && !$consumer[0]['nocierrediario']){
            throw new LogisticaException('LOG_LB_PUNTOVENTA_003');
        }*/
        /*if($this->global->FechaContable->fechasist != $this->_fechacontable && !$consumer[0]['nocierreperiodo']){
            throw new LogisticaException('LOG_LB_PUNTOVENTA_002');
        }*/

        $this->cargarPP();
        $this->view->uiVariables = array_merge(
            array(
                'alternativa' => $this->_logisticaGlobal->codigoisoalt ? 'true' : 'false',
                'codContable' => "'{$this->_logisticaGlobal->codigoiso}'",
                'codAlternativa' => "'{$this->_logisticaGlobal->codigoisoalt}'",
                'idContable' => "'{$this->_logisticaGlobal->idmoneda}'",
                'idAlternativa' => "'{$this->_logisticaGlobal->idmonedaalternativa}'",
                'fechacontable' => "'{$this->_fechaactual}'"
            ), $this->view->uiVariables
        );
        if($this->_moneda['idmoneda']){
            $this->view->uiVariables = array_merge(
                array(
                    'idMlc' => "'{$this->_moneda['idmoneda']}'",
                    'codMlc' => "'{$this->_moneda['codigoiso']}'"
                ), $this->view->uiVariables
            );
        }
        
    }

    public function terminalpuntoventaAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $existeInv = $this->_serviciosLogisticaGlobal->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_INV);
        $existeFact = $this->_serviciosLogisticaGlobal->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_FAC);
        $this->prepareView();
        $this->view->arrayJs = array($this->_serviciosConfiguracionGeneral->mostrarNomencladoresGenerales());
        
        /*$idmonedaalternativa = $this->_logisticaGlobal->idmonedaalternativa;
        if ($idmonedaalternativa) {
            $this->view->uiVariables = array_merge(["dualidad" => $idmonedaalternativa], $this->view->uiVariables);
        }*/
        $this->view->uiVariables = array_merge(
        array("existeInv" => $existeInv ? $existeInv : 0, 'existeFact' => $existeFact ? $existeFact : 0, 'fechacontable' => "'{$this->_fechacontable}'"),
                $this->view->uiVariables
        );
        $this->initComponent('log.fac.puntoventa');
        $this->rendertemplate();
    }

    public function cargarProductosAction()
    {
        //$this->cargarPP();
        $this->uiParams['idmonedaalternativa'] = $this->_logisticaGlobal->idmonedaalternativa;
        $this->uiParams['idmonedacontable'] = $this->_logisticaGlobal->idmonedacontable;
        //$this->uiParams['idmonedaventa'] = $this->_logisticaGlobal->idmoneda;
        $this->uiParams['condisponible'] = 1;
        //$this->uiParams['limit'] = 10;
        $this->objectHelper->synchronize($this, $this->_terminalpuntoventa->cargarProductos($this->uiParams));
    }

    public function cargarServiciosAction()
    {
        //$this->cargarPP();
        $this->uiParams['idmonedaalternativa'] = $this->_logisticaGlobal->idmonedaalternativa;
        $this->uiParams['idmonedacontable'] = $this->_logisticaGlobal->idmonedacontable;
        //$this->uiParams['idmonedaventa'] = $this->_logisticaGlobal->idmoneda;
        $this->uiParams['condisponible'] = 1;
        //$this->uiParams['limit'] = 10;
        $this->objectHelper->synchronize($this, $this->_terminalpuntoventa->cargarServicios($this->uiParams));
    }

    public function cargarCajasAction()
    {
        $this->uiParams['areaVenta'] = true;
        $this->uiParams['activo'] = true;
        $this->uiParams['idusuario'] = $this->global->Perfil->idusuario;
        $this->uiParams['idestructura'] = $this->global->estructura->idestructura;
        $this->objectHelper->synchronize($this, $this->_terminalpuntoventa->cargarCajas($this->uiParams));
    }

    public function iniciarSesionAction()
    {
        $this->uiParams['idusuario'] = $this->global->Perfil->idusuario;
        //$this->uiParams['fechaapertura'] = $this->_fechacontable;//date('d-m-Y');
        $this->uiParams['fechaapertura'] = $this->_fechaactual;//date('d-m-Y');
        $this->objectHelper->synchronize($this, $this->_terminalpuntoventa->iniciarSesion($this->uiParams));
    }

    public function cerrarSesionAction()
    {
        //$this->uiParams['fechacierre'] = $this->_fechacontable;//date('d-m-Y');
        $this->uiParams['fechacierre'] = $this->_fechaactual;//date('d-m-Y');
        $this->objectHelper->synchronize($this, $this->_terminalpuntoventa->cerrarSesion($this->uiParams));
    }

    public function cargaInicialAction()
    {
        $this->objectHelper->synchronize($this, $this->_terminalpuntoventa->cargaInicial($this->uiParams));
    }

    public function realizarVentaAction()
    {
        $sesion = Doctrine::getTable('DatSeccion')->find($this->uiParams['idseccion']);
        if($sesion->fechacierre != ''){
            throw new LogisticaException('LOG_LB_PUNTOVENTA_005');
        }
        $this->uiParams['productos'] = $this->_objHelper->stdClassToArray(
            Zend_Json::decode($this->uiParams['productos'])
        );
        $this->uiParams['servicios'] = $this->_objHelper->stdClassToArray(
            Zend_Json::decode($this->uiParams['servicios'])
        );
        $this->uiParams['pagos'] = Zend_Json::decode($this->uiParams['pagos']);
        $compventa = new ComprobanteVentaModel(array('alias' => 'compventaLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_FAC));
        $this->objectHelper->synchronize($this, $compventa->adicionarVenta($this->uiParams));
    }

    public function insertarDatosPosVentaAction()
    {
        $this->objectHelper->synchronize($this, $this->_terminalpuntoventa->insertarDatosPosVenta($this->uiParams));
    }

    public function cargarProveedoresAction()
    {
        if ($this->uiParams['query'] || $this->uiParams['criterio']) {
            $this->uiParams['query'] = ($this->uiParams['query'])?$this->uiParams['query']:$this->uiParams['criterio'];
            $filtro['nombre'] = $this->uiParams['query'];
            $filtro['codigo'] = $this->uiParams['query'];
        }
        $datos = $this->configuracionHelper->getClientesProveedorByParams(
            null, $this->global->Estructura->idestructura, true, false, true, $filtro, $this->uiParams['start'],
            $this->uiParams['limit']
        );
        $datos->total = $datos['cantidad'];
        $this->objectHelper->synchronize($this, $datos);
    }

    /*Cargar nombre y apellido de las personas*/
    public function cargarPersonasAction()
    {
        $result = $this->_terminalpuntoventa->cargarPersonas($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    private function cargarPP()
    {
        $monedasEntidad = $this->configuracionHelper->obtenerMonedasPorEntidad($this->global->Estructura->idestructura);
        foreach ($monedasEntidad['datos'] as $value) {          
            if($value['idmoneda']!= $this->_logisticaGlobal->idmoneda && $value['idmoneda']!= $this->_logisticaGlobal->idmonedaalternativa){
                $this->_moneda['idmoneda'] = $value['idmoneda'];
                $this->_moneda['codigoiso'] = $value['codigoiso'];                
            }
        }
    }    
    
    public function cargarModoPagoAction()
    {
        $this->objectHelper->synchronize($this,$this->_cfgpuntoventa->getModosPago());
    }

    public function cargarNaturalezasAction()
    {
        $this->uiParams['tpv'] = 1;        
        $this->objectHelper->synchronize($this,array('datos'=>$this->_cfgpuntoventa->devolverNaturalezasSincronizar($this->uiParams,$this->_serviciosConfiguracionGeneral)));
    }

    public function cargarMonedasVentasAction()
    {
        $this->objectHelper->synchronize($this,$this->configuracionHelper->obtenerMonedasPorEntidad(
            $this->global->Estructura->idestructura
        ));
    }

    public function registrarEfectivoAction()
    {
        $this->uiParams['fecha'] = $this->_fechaactual;
        $this->objectHelper->synchronize($this,$this->_terminalpuntoventa->registrarEfectivo($this->uiParams));
    }
    
    public function actualizarDatosVentaAction() {
        $this->objectHelper->synchronize($this,$this->_terminalpuntoventa->actualizarDatosVenta($this->uiParams));
    }

    public function testFUCAction(){        
        try{
            $fuc = new FUCModel();
            $params['identidad_numero'] = '85070105829';//$params['query'];
            $res = json_decode($fuc->buscarPersonaFUC($params));
            print_r($res);die;
        } catch (Exception $ex) {
            throw DBALException::driverExceptionDuringQuery($this->_driver, $ex, $statement);
        }
    }

    public function cargarPersonasAreaAction()
    {
//        $this->datos = $this->_modeloOrden->cargarPersonasAreaIinterna($this->uiParams['idarea'], $this->uiParams);
        $this->objectHelper->synchronize(
            $this,
            $this->_terminalpuntoventa->cargarPersonasArea($this->uiParams['idarea'], $this->uiParams)
        );
    }
}
