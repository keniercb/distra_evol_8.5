<?php

/**
 * @class     PlanificaionmantenimientoController
 * Clase que se encarga de manejar las acciones
 * para las recuperaciones de la planificacion del mantenimiento.
 * @namespace Logistica\Activos fijos\Recuperaciones\Controllers
 * @author    Daniel Arias Espinosa
 * @copyright XETID
 * @version   2.0
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class PlanificacionmantenimientoController extends BaseController
{

    private $_modelo;

    public function init()
    {
        parent::init('log.aft.planificacionmantenimiento');

        /* parent::init();
          $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
          $dirPhtml = $dirApps . '/logistica/utiles/reporte/views/script/reporte/reporte.phtml';
          $js = file_get_contents($dirPhtml);
          $this->serviciosAyuda = ServiciosAyudaHelper::__init();
          $this->view->arrayJs = array($this->serviciosAyuda->getJSAyuda(),
          $this->serviciosCfg->getJSAtributosDinamicos(),
          $js);
          $this->areaSeleccionada = $this->global->Estructura->idestructura; */

        //        $this->mSubMayor = new SubmayorModel();
        //        $this->serviciosCfg = ServiciosConfiguracionGeneralHelper::__init();
        $this->_modelo = new PlanificacionMantenimientoModel();
    }

    public function planificacionmantenimientoAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.aft.planificacionmantenimiento');
        $this->renderTemplate();
        //$x = new PlanificacionMantenimientoModel();
    }

    public function cargarEncabezadoPlanificacionAction()
    {

    }

    public function cargarPlanificacionesAction()
    {
        // $result = $this->_modelo->CargarRegNumMantenimiento(704, 0, 20);
        $result = $this->_modelo->cargarActividadesDelMedioSistema($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function cargarRegNumMantenimientoAction()
    {
        // $result = $this->_modelo->CargarRegNumMantenimiento(704, 0, 20);
        if ($this->uiParams['AFT']) {
            $aft = true;
        } else {
            $aft = false;
        }
        $result = $this->_modelo->cargarRegNumMantenimiento($this->uiParams, $aft);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function realizarMantenimientoAction()
    {
        $result = $this->_modelo->realizarMantenimiento($this->uiParams);
        $this->success = $result['success'];
        $this->msg = $result['msg'];
    }

    public function deshacerMantenimientoAction()
    {
        $result = $this->_modelo->deshacerMantenimiento($this->uiParams);
        $this->success = $result['success'];
        $this->msg = $result['msg'];
    }

}
