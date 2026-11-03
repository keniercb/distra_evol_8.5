<?php

/**
 * @class GestcierreController
 * Clase que se encarga de manejar las acciones
 * para el cierre de los documentos.
 * @namespace Logistica\Utiles\Cierre\Controllers
 * @author Divisiçon de Gestiçon de Entidades
 * @copyright XETID
 * @version 1.0
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class GestcierreinventarioController extends BaseController
{

    private $cierreinvModel, $documentoModel, $contintegrada;

    public function init()
    {
        parent::init('log.inv.comuninvcierre');
        $this->cierreinvModel = new GestcierreinventarioModel();
        $arreglo = array('noexception' => true);
        $this->documentoModel = new DocumentoLogisticaModel($arreglo);
        $config = new ConfiguracioninventarioService();
        $result = $config->devolverConfiguracion($this->idestructuracomun);
        $this->contintegrada = $result['contintegrada'];
        $fecha = $this->configuracionHelper->getFechaContableSubsistemaObj($this->global->Estructura->idestructura,
            LogisticaGlobal::SUBSISTEMA_INV);
        $this->view->uiVariables = array_merge(
            array(
            'contIntegrada' => $this->objectHelper->getBooleanStr($result['contintegrada']),
            'fechaAutomatica' => $this->objectHelper->getBooleanStr($fecha->incremento == 1 ? true : false),
            'cargaInicial' => $this->configuracionHelper->subsistemaAperturado($this->global->Estructura->idestructura,
            LogisticaGlobal::SUBSISTEMA_INV),
            ), $this->view->uiVariables
        );
       
    }

    public function gestcierreinventarioAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.inv.comuninvcierre');
        $this->renderTemplate();
    }

    /**
     * @method cargarDocumentosInv
     * Accion para cargar los documentos pendientes que se
     * encuentran en el subsistema de Inventario
     * @params null
     * @return null
     */
    public function cargarDocumentosPendienteAction()
    {
        
        $result = $this->cierreinvModel->cargarDocuPendInv($this->uiParams, true);
        $usuario = $this->documentoModel->cargaInicial();
        
        $this->usuarios = $usuario['usuarios'];
        $this->documentos = $usuario['iddocs'];
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
       
    }

    /**
     * @method cierreDiario
     * Accion para realizar el cierre diario de los documentos
     * pendientes de los subsistemas
     * @params null
     * @return null
     */
    public function cierreDiarioAction()
    {
        $this->success = $this->cierreinvModel->cierreDiario();
    }

    /**
     * @method cierrePeriodo
     * Accion para realizar el cierre período de los documentos
     * pendientes de los subsistemas
     * @params null
     * @return null
     */
    public function cierrePeriodoAction()
    {
        if (!$this->contintegrada) {
            $this->success = true;
        }
        $datperiodo = $this->configuracionHelper->getPeriodoActualSubsistema(
            $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_INV, 1
        );
        $this->periodo = $datperiodo[0]['periodo'];
        $this->objectHelper->synchronize($this, $this->cierreinvModel->cierrePeriodo());
        //$this->success = $this->cierreinvModel->cierrePeriodo();
    }

    /**
     * @method cierreEjercicio
     * Acción para realizar el cierre ejercicio de los documentos
     * pendientes de los subsistemas
     * @params null
     * @return null
     */
    public function cierreEjercicioAction()
    {
        if (!$this->contintegrada) {
            $this->success = true;
        }
        $this->success = $this->cierreinvModel->cierreEjercico();
    }

    public function cargaDatosFechaAction()
    {
        $datosPeriodo = $this->cierreinvModel->cargaDatosFecha();
        $this->periodo = $datosPeriodo['periodo'];
        $this->fechaContable = $datosPeriodo['fechaContable'];
    }
    
    public function cierreAperturaAction()
    {
        $respuesta = $this->cierreinvModel->cierreApertura();
        $this->datos = $respuesta;
        $this->success = ($respuesta['error'])? false : true;
       
    }

    public function configurarAlmacenesAction()
    {
        LogisticaFechasHelper::__init()->configurarFechaEntidad();
    }

}
