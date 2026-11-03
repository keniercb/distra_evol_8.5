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

class GestcierreaftController extends BaseController {

    private $cierreaftModel, $documentoModel, $configServ, $sDatMaestros;

    public function init() {
        parent::init('log.aft.utilcierreaft');
        $this->cierreaftModel = new CierreActivoFijoModel();
        $arreglo = array('noexception' => true);
        $this->configServ = new ConfiguracionActivosService();
        $result = $this->configServ->getConfiguracionPG($this->global->Estructura->idestructura);
        $this->documentoModel = new DocumentoLogisticaModel($arreglo);
        $this->sDatMaestros = DatosMaestrosHelper::__init();
        $incremento = $this->sDatMaestros->getFechaContableSubsistemaObj(
                $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_AFT
        );
        if (!$incremento)
            die('Falta configurar la fecha para el subsistema de AFT');

        $this->view->uiVariables = array_merge(
                array(
                    'contIntegrada' => $this->objectHelper->getBooleanStr($result[0]['contabilidad']),
                    'cargaInicial' => $this->configuracionHelper->subsistemaAperturado(
                            $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_AFT
                    ),
                    'existenDocsAprobados' => ($this->cierreaftModel->existenDocsAprobados($this->global->Estructura->idestructura)) ? 'true' : 'false',
                    'incremento' => $incremento->incremento,
                    'development' => 'false'
                ), $this->view->uiVariables
        );
    }

    public function gestcierreaftAction() {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.aft.utilcierreaft');
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
    public function cargarDocumentosPendienteAction() {
        /* if ($this->uiParams['fecha']) {
          $arrfecha = explode('T', $this->uiParams['fecha']);
          $this->uiParams['fecha'] = $arrfecha[0];
          }else{
          $datosPeriodo = $this->cierreaftModel->cargaDatosFecha();
          //$this->uiParams['fecha'] = $datosPeriodo['fechaContable'];
          $this->uiParams['hasta'] = $datosPeriodo['fechaContable'];
          } */
        $this->uiParams['tipo'] = 0;
        $result = $this->cierreaftModel->cargarDocuPendAft($this->uiParams);
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

    public function getTipoDocumentoAction() {

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

    public function getCreadoPorAction() {
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
    public function cierreDiarioAction() {

        $this->success = $this->cierreaftModel->cierreDiario();
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
    public function cierrePeriodoAction() {
        try {
            $conn = Zend_Registry::get('conexion');
            $datperiodo = $this->configuracionHelper->getPeriodoActualSubsistema(
                    $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_AFT, 1
            );
            $this->periodo = $datperiodo[0]['periodo'];
            $doc = $this->cierreaftModel->getDocSinComprobante();
            $sqlExistenactivos = "select
                            drna.idregnumerico
                            from mod_logactivofijotangible.dat_regnumericoactivo drna
                            inner join mod_logactivofijotangible.dat_registronumerico drn on drn.idregnumerico = drna.idregnumerico
                            inner join mod_logistica.dat_producto dp on dp.idproducto = drn.idproducto
                            where 
                            dp.idestructuracomun = '{$this->global->Estructura->idestructura}' and drna.esbaja <> 1  "; 
            $resultsqlExistenactivos = $conn->fetchAll($sqlExistenactivos);                       
            if ($doc['cantidad'] == 0) {

                // Validando que existan depreciaciones en el periodo y que esten contabilizadas
                $existenDepreciaciones = $this->cierreaftModel->validarDepreciacion();

                if (count($existenDepreciaciones) == 0) {

                    // Verificando que las cuentas esten cuadradas
                    $cuentasCuadradas = $this->cierreaftModel->validarCuadreCuentas();
                    if ($cuentasCuadradas) {
                        $this->success = $this->cierreaftModel->cierrePeriodo();
                        $this->datos = $this->cierreaftModel->cargaDatosFecha();
                    } else {
                        throw new ZendExt_Exception('LOG_AFT_CUENTAS_DESCUADRADAS');
                        $this->success = false;
                    }
                } else {
                    if ($existenDepreciaciones['noDepreciados'] > 0) {
                      if (count($resultsqlExistenactivos) < 1 ) {
                        $this->success = $this->cierreaftModel->cierrePeriodo();
                        $this->datos = $this->cierreaftModel->cargaDatosFecha();
                      }else {
                        throw new ZendExt_Exception('LOG_AFT_PERIODO_SIN_DEPRE');
                        $this->docsincomprobante = false;
                        $this->cantidad = 0;
                        $this->success = false;
                      }
                       
                    }
                    if ($existenDepreciaciones['noContabilizados'] > 0) {
                        throw new ZendExt_Exception('LOG_AFT_PERIODO_SIN_DEPRE_CONT');
                        $this->docsincomprobante = false;
                        $this->cantidad = $existenDepreciaciones['noContabilizados'];
                        $this->success = false;
                    }
                }
            } else {
                $this->docsincomprobante = true;
                $this->cantidad = $doc['cantidad'];
                $this->success = false;
            }
        } catch (Exception $exc) {
            print_r($exc->getMessage());
            throw $exc;
        }
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
    public function cierreEjercicioAction() {

        $this->success = $this->cierreaftModel->cierreEjercico();
    }

    /*
     *  Carga los registros numericos que tienen que depreciar
     *  */

    public function getRegNumQueDeprecianAction() {
        $sConfActivos = new ConfiguracionActivosService();
        $idestructura = ZendExt_GlobalConcept::getInstance()->$cEstructura->idestructura;
        $confEntidad = $sConfActivos->getConfiguracionPG($idestructura);
        if ($confEntidad[0]['depreciacion']) {
            $datos = $this->cierreaftModel->getBuscarRegNumDepreciado(LogisticaGlobal::SUBSISTEMA_AFT);
            /* $this->datos = 0; */
            $this->datos = $datos;
        } else {
            $this->datos = [];
        }
    }

    public function cargaDatosFechaAction() {

        $datosPeriodo = $this->cierreaftModel->cargaDatosFecha();
        $this->periodo = $datosPeriodo['periodo'];
        $this->fechaContable = $datosPeriodo['fechaContable'];
    }

    public function cierreAperturaAction() {
        try {
            $respuesta = $this->cierreaftModel->cierreApertura();
            $this->datos = $respuesta;
            $this->success = ($respuesta['error']) ? false : true;
        } catch (Exception $e) {
            $this->datos = array('error' => 3, 'msg' => $e->getMessage());
            $this->success = false;
        }
    }

    public function estaSubsistAperturadoAction() {
        $this->aperturado = $this->configuracionHelper->subsistemaAperturado($this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_AFT);
        $this->success = true;
    }

    public function validarAbrirPeriodoAction() {
        $objSubsistema = $this->global->Subsistema;
        $idsubsistema = $objSubsistema->idsubsistema;
        unset($objSubsistema);
        $idestructuracomun = $this->global->EstructuraEconomica->idestructuracomun;

        $response = $this->integrator->datosmaestros->validarCondicionesGeneralesAbrirPeriodo($idsubsistema, $idestructuracomun);
        $this->code = $response['code'];
        $this->message = $response['message'];
    }

    public function solicitarAbrirPeriodoAction() {
        $objSubsistema = $this->global->Subsistema;
        $idsubsistema = $objSubsistema->idsubsistema;
        unset($objSubsistema);
        $idestructuracomun = $this->global->EstructuraEconomica->idestructuracomun;
        $observacion = $this->_request->getPost('observacion');

        if ($observacion != '')
            $response = $this->integrator->datosmaestros->solicitarAbrirPeriodoPorSubsistema($idsubsistema, $idestructuracomun, $observacion);

        $this->code = $response['code'];
        $this->message = $response['message'];
    }

}
