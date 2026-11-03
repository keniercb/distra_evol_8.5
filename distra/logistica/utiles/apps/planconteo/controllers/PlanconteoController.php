<?php

/**
 * @class      GestplanesconteoController
 * Controlador de Gestión de Planes de Conteo
 *
 * @package    Utiles
 * @subpackage Inventario
 * @author     Daniel Arias Espinosa
 * @version    1.1
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class PlanconteoController extends BaseController
{

    private $planConteoModel;

    function init()
    {
        parent::init('log.lb.planconteo');
        $this->planConteoModel = new GestPlanConteoModel();
    }

    public function gestPlanconteoAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.lb.planconteo');
        $this->renderTemplate();
    }

    public function cargarSistemasAction()
    {
        $datos = array();
        $dirindex = $_SERVER['SCRIPT_FILENAME'];
        $dircomponenteinventario = substr($dirindex, 0, strrpos($dirindex, 'web')) . 'apps/logistica/inventario';
        $dircomponenteactivo = substr($dirindex, 0, strrpos($dirindex, 'web')) . 'apps/logistica/activos_fijos';
        if (file_exists($dircomponenteactivo)) {
            $datos[] = array(
                'denominacion' => 'Activo fijo', 'idsubsistema' => LogisticaGlobal::SUBSISTEMA_AFT,
            );
        }
        if (file_exists($dircomponenteinventario)) {
            $datos[] = array(
                'denominacion' => 'Inventario', 'idsubsistema' => LogisticaGlobal::SUBSISTEMA_INV,
            );
        }
        $this->datos = $datos;
    }

    public function cargarPlanesConteoAction()
    {
        
        $source = $this->planConteoModel->cargarPlanesConteo($this->uiParams);
        $this->datos = $source;
        $this->cantidad = count($source);
    }

    public function adicionarPlanConteoAction()
    {
        $this->uiParams['data'] = Zend_Json::decode($this->uiParams['data']);
        $this->uiParams = array_merge($this->uiParams, $this->uiParams['data']);
        $this->objectHelper->unsetArrayValues($this->uiParams,array('data'));
        $this->success = $this->planConteoModel->crearPlanConteo($this->uiParams);
    }

    public function aplicarPorcientoPeriodosAction()
    {
        $param = Zend_Json::decode($this->uiParams['data']);
        $this->datos = $this->planConteoModel->aplicarPorcientoTodosPeridos($param['idplan'][0], $param['porciento']);
    }

    public function modificarPlanConteoAction()
    {
        $param['idplanconteom'] = Zend_Json::decode($this->uiParams['idplanconteom']);
        $param['porciento'] = Zend_Json::decode($this->uiParams['porciento']);
        $this->datos = $this->planConteoModel->modificarPlanConteo($param);
    }

    public function eliminarPlanConteoAction()
    {
        $param = Zend_Json::decode($this->uiParams['id']);
        $this->datos = $this->planConteoModel->eliminarPlanConteo($param[0]);
    }

    public function confirmarPeriodoPlanAction()
    {
        $this->datos = $this->planConteoModel->confirmarPeriodoPlanConteo(
            $this->uiParams['idplanconteom'],
            $this->uiParams['idplan']
        );
    }

    public function aprobarPeriodoPlanAction()
    {
        $this->datos = $this->planConteoModel->aprobarPeriodoPlanConteo(
            $this->uiParams['idplanconteom'],
            $this->uiParams['idplan']
        );
    }

    public function anularPeriodoPlanAction()
    {
        $this->datos = $this->planConteoModel->anularPeriodoPlanConteo(
            $this->uiParams['idplanconteom'],
            $this->uiParams['idplan']
        );
    }

    public function cargarAreasResponsabilidadAction()
    {
        $this->datos = $this->estructuraHelper->getEstructurasInternas(
            $this->global->Estructura->idestructura
        );
    }

}
