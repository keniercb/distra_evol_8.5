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

class GestcierretalleresController extends BaseController
{
 private $cierretallModel,$documentoModel;
    

    public function init()
    {
        parent::init('log.tall.cierretalleres');
        $this->cierretallModel = new GestcierretalleresModel();
        $arreglo = array('noexception' => true);
        $this->documentoModel = new DocumentoLogisticaModel($arreglo);
        $fecha = $this->configuracionHelper->getFechaContableSubsistemaObj(
            $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_TALLERES
        );
        $this->view->uiVariables = array_merge(
        array(
            'fechaAutomatica' => $this->objectHelper->getBooleanStr($fecha->incremento == 1 ? true : false),
            'cargaInicial' => 1,), $this->view->uiVariables
        );
    }

    public function gestcierretalleresAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.tall.cierretalleres');
        $this->renderTemplate();
    }

   

   

    /**
     * @method cargarDocumentosInv
     * Acción para cargar los documentos pendientes que se
     * encuentran en el subsistema de Inventario
     * @params null
     * @return null
     */

    public function cargarDocumentosPendienteAction()
    {
        $result = $this->cierretallModel->cargarDocuPendTall($this->uiParams);
        $usuario = $this->documentoModel->cargaInicial();
        $this->usuarios = $usuario['usuarios'];
        $this->documentos = $this->configuracionHelper
                        ->documentosPorSubsistemaEntidad(LogisticaGlobal::SUBSISTEMA_TALLERES, $this->global->Estructura->idestructura);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];

    }

  
    /**
     * @method cierreDiario
     * Acción para realizar el cierre diario de los documentos
     * pendientes de los subsistemas
     * @params null
     * @return null
     */

    public function cierreDiarioAction()
    {
       
        $this->success = $this->cierretallModel->cierreDiario();
    }

    /**
     * @method cierrePeriodo
     * Acción para realizar el cierre período de los documentos
     * pendientes de los subsistemas
     * @params null
     * @return null
     */

    public function cierrePeriodoAction()
    {
        $datperiodo = $this->configuracionHelper->getPeriodoActualSubsistema(
            $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_TALLERES, 1
        );
        $this->periodo = $datperiodo[0]['periodo'];
        $result = $this->cierretallModel->cierrePeriodo();
        $this->diferencia = $result['diferencia'];
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
        
        $this->success = $this->cierretallModel->cierreEjercico();

    }

    public function cargaDatosFechaAction()
    {
        $datosPeriodo = $this->cierretallModel->cargaDatosFecha();
        $this->periodo = $datosPeriodo['periodo'];
        $this->fechaContable = $datosPeriodo['fechaContable'];
    }

}
