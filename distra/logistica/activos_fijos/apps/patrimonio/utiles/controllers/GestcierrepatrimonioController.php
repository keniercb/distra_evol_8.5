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

class GestcierrepatrimonioController extends BaseController
{

    private $cierreaftModel, $documentoModel, $configServ, $sDatMaestros, $fechaSub;

    public function init()
    {   
        parent::init('log.aft.utilcierrepatrimonio');
        $this->cierreaftModel = new CierrePatrimonioModel();
        $arreglo = array('noexception' => true);
        $this->configServ = new ConfiguracionActivosService();
        $result = $this->configServ->getConfiguracionPG($this->global->Estructura->idestructura, 1);
        $this->documentoModel = new DocumentoLogisticaModel($arreglo);
        $this->sDatMaestros = DatosMaestrosHelper::__init();
        $this->fechaSub = $this->sDatMaestros->getFechaContableSubsistemaObj(
            $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_PATRIMONIO
        );
        $periodo = $this->cierreaftModel->cargaDatosFecha()['periodo'];
        $finPeriodo = 0;
        if ($this->fechaSub->fecha == $periodo->fin)
            $finPeriodo = 1;
        $idejercicio = $this->configuracionHelper->getEjercicioActualSubsistema($this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_PATRIMONIO);
        $ejercicio = $this->configuracionHelper->obtenerEjercicio($idejercicio, $this->global->Estructura->idestructura)[0];
        $finEjercicio = 0;
        if ($this->fechaSub->fecha == $ejercicio->fin)
            $finEjercicio = 1;
        $this->view->uiVariables = array_merge(
            array(
            'contIntegrada' => $this->objectHelper->getBooleanStr($result[0]['contabilidad']),
            'cargaInicial' => $this->configuracionHelper->subsistemaAperturado(
                $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_PATRIMONIO
            ),
            'incremento'=>$this->fechaSub->incremento,
            'finPeriodo'=>$finPeriodo,
            'finEjercicio'=>$finEjercicio,
            ), $this->view->uiVariables
        );
    }

    public function gestcierrepatrimonioAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.aft.utilcierrepatrimonio');
        $this->renderTemplate();
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
    public function cargarDocumentosPendienteAction()
    {
        if ($this->uiParams['fecha']) {
            $arrfecha = explode('T', $this->uiParams['fecha']);
            $this->uiParams['fecha'] = $arrfecha[0];
        }else{
            $datosPeriodo = $this->cierreaftModel->cargaDatosFecha();
            $this->uiParams['fecha'] = $datosPeriodo['fechaContable'];
        }
        $result = $this->cierreaftModel->cargarDocuPendientes($this->uiParams);
        $usuario = $this->documentoModel->cargaInicial();        
        $this->usuarios = $usuario['usuarios'];
        $this->documentos = $usuario['iddocs'];
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    /*
     * * @method getTipoDocumento
     * Acción para cargar los tipos de documentos
     * @params null
     * @return null
     */

    public function getTipoDocumentoAction()
    {

        $tipodoc = $this->cierreaftModel->devolverTipoDocumento();
        $this->datos = $tipodoc;
        $this->cantidad = count($tipodoc);
    }

    /*
     * * @method getCreadoPor
     * Acción para cargar los usuarios
     * @params null
     * @return null
     */

    public function getCreadoPorAction()
    {
        $usuario = $this->cierreaftModel->cargaInicial();
        $this->datos = $usuario['usuarios'];
        $this->cantidad = count($usuario['usuarios']);
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
        $periodo = $this->cierreaftModel->cargaDatosFecha()['periodo'];

        $finPeriodo = 0;
        if ($this->fechaSub->fecha == $periodo->fin)
            $finPeriodo = 1;

        $idejercicio = $this->configuracionHelper->getEjercicioActualSubsistema($this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_PATRIMONIO);
        $ejercicio = $this->configuracionHelper->obtenerEjercicio($idejercicio, $this->global->Estructura->idestructura)[0];

        $finEjercicio = 0;
        if ($this->fechaSub->fecha == $ejercicio->fin)
            $finEjercicio = 1;

        $this->success = $this->cierreaftModel->cierreDiario();;
        $this->finPeriodo = $finPeriodo;
        $this->finEjercicio = $finEjercicio;
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
        $datperiodo = $this->configuracionHelper->getPeriodoActualSubsistema(
            $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_PATRIMONIO, 1
        );

        $idejercicio = $this->configuracionHelper->getEjercicioActualSubsistema(
            $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_PATRIMONIO
        );
        $ejercicio = $this->configuracionHelper->obtenerEjercicio(
            $idejercicio, $this->global->Estructura->idestructura
        )[0];

        $finEjercicio = 0;
        if ($this->fechaSub->fecha == $ejercicio->fin)
            $finEjercicio = 1;

        $this->periodo = $datperiodo[0]['periodo'];
        $this->success = $this->cierreaftModel->cierrePeriodo();
        $this->finEjercicio = $finEjercicio;

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
        $this->success = $this->cierreaftModel->cierreEjercico();
    }

    /*
     *  Carga los registros numericos que tienen que depreciar
     *  */

    public function getRegNumQueDeprecianAction()
    {
        $datos = $this->cierreaftModel->getBuscarRegNumDepreciado(LogisticaGlobal::SUBSISTEMA_PATRIMONIO);

        $this->datos = $datos;
    }

    public function cargaDatosFechaAction()
    {
        $datosPeriodo = $this->cierreaftModel->cargaDatosFecha();
        $this->periodo = $datosPeriodo['periodo'];
        $this->fechaContable = $datosPeriodo['fechaContable'];
    }
    
    public function cierreAperturaAction()
    { 
        $respuesta = $this->cierreaftModel->cierreApertura();
        $this->datos = $respuesta;
        $this->success = ($respuesta['error']) ? false : true;
    }


}
