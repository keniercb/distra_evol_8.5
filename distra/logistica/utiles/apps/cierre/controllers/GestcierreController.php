<?php

/**
 * @class     GestcierreController
 * Clase que se encarga de manejar las acciones
 * para el cierre de los documentos.
 * @namespace Logistica\Utiles\Cierre\Controllers
 * @author    Divisiçon de Gestiçon de Entidades
 * @copyright XETID
 * @version   1.0
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class GestcierreController extends BaseController
{

    private $cierreModel, $serviciosAyuda, $documentoModel, $servConfig;

    public function init()
    {
        parent::init('log.lb.cierre');
        $this->serviciosAyuda = ServiciosAyudaHelper::__init();
        $this->servConfig = ServiciosConfiguracionGeneralHelper::__init();
        $this->cierreModel = new GestcierreModel();
        $arreglo = array('noexception' => true);
        $this->documentoModel = new DocumentoLogisticaModel($arreglo);
        $this->setDefaultParam('start', 0);
        $this->setDefaultParam('limit', 30);
    }

    public function gestcierreAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        
        $this->initComponent('log.lb.cierre');
        $this->renderTemplate();
    }


    /**
     * @method cargarDocumentosFac
     * Acción para cargar los documentos pendientes que se
     * encuentran en el subsistema de Facturación
     *
     * @params null
     *
     * @return null
     */

    public function cargarDocumentosFacAction()
    {
        $result = $this->cierreModel->cargarDocuPendFac($this->uiParams);
        $usuario = $this->documentoModel->cargaInicial();
         $this->usuarios = $usuario['usuarios'];
        $this->documentos = $usuario['iddocs'];
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }


    /**
     * @method cargarDocumentosInv
     * Acción para cargar los documentos pendientes que se
     * encuentran en el subsistema de Inventario
     *
     * @params null
     *
     * @return null
     */

    public function cargarDocumentosInvAction()
    {

        $result = $this->cierreModel->cargarDocuPendInv($this->uiParams);
        $usuario = $this->documentoModel->cargaInicial();
        $this->usuarios = $usuario['usuarios'];
        $this->documentos = $usuario['iddocs'];
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];

    }

    /**
     * @method cargarDocumentosTrans
     * Acción para cargar los documentos pendientes que se
     * encuentran en el subsistema de Activos Fijos
     *
     * @params null
     *
     * @return null
     */

    public function cargarDocumentosTransAction()
    {
        $result = $this->cierreModel->cargarDocuPendTrans($this->uiParams);
        $usuario = $this->documentoModel->cargaInicial();
        $this->usuarios = $usuario['usuarios'];
        $this->documentos = $usuario['iddocs'];
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    /**
     * @method cargarDocumentosTrans
     * Acción para cargar los documentos pendientes que se
     * encuentran en el subsistema de Activos Fijos
     *
     * @params null
     *
     * @return null
     */

    public function cargarDocumentosAftAction()
    {
        $result = $this->cierreModel->cargarDocuPendTrans($this->uiParams);
        $usuario = $this->documentoModel->cargaInicial();
        $this->usuarios = $usuario['usuarios'];
        $this->documentos = $usuario['iddocs'];
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    /**
     * @method cierreDiario
     * Acción para realizar el cierre diario de los documentos
     * pendientes de los subsistemas
     *
     * @params null
     *
     * @return null
     */

    public function cierreDiarioAction()
    {
        $subsistema = json_decode($this->_getParam('valor'));
        $this->success = $this->cierreModel->cierreDiario($subsistema);
    }

    /**
     * @method cierrePeriodo
     * Acción para realizar el cierre período de los documentos
     * pendientes de los subsistemas
     *
     * @params null
     *
     * @return null
     */

    public function cierrePeriodoAction()
    {
        $subsistema = json_decode($this->_getParam('valor'));
        $this->success = $this->cierreModel->cierrePeriodo($subsistema);
    }

    /**
     * @method cierreEjercicio
     * Acción para realizar el cierre ejercicio de los documentos
     * pendientes de los subsistemas
     *
     * @params null
     *
     * @return null
     */

    public function cierreEjercicioAction()
    {
        $subsistema = json_decode($this->_getParam('valor'));
        $this->success = $this->cierreModel->cierreEjercico($subsistema);

    }
    
    public function cargaDatosFechaAction()
    {

        $datosPeriodo = $this->cierreModel->cargaDatosFecha();
        $this->periodo = $datosPeriodo['periodo'];
        $this->fechaContable = $datosPeriodo['fechaContable'];
    }
    public function cierreAperturaAction()
    {

        $this->datos = $this->cierreModel->cierreApertura();
       
    }


}
