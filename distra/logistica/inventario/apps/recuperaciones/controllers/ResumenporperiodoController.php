<?php

/**
 *  Esta clase
 * * @copyright XETID
 * @author DIvicion de Gestion de Entidades
 * @version 1.0
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}
class ResumenporperiodoController extends BaseController
{
    private $serviciosAyuda;
    private $serviciosPeriodos;
    private $model;

    function init()
    {
        parent::init('log.inv.resumenperiodo');
        $this->serviciosAyuda = ServiciosAyudaHelper::__init();
        $this->serviciosPeriodos = ServiciosConfiguracionGeneralHelper::__init();
        $this->model = new ValordepositosModel();
    }

    public function resumenpoperiodoAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();

        $this->initComponent('log.inv.resumenperiodo');
        $this->rendertemplate();
    }

    public function cargarPeriodosAction()
    {
        $ejerc = $this->uiParams['idestructura'];
        $periodos = $this->serviciosPeriodos->obtenerPeriodos($ejerc);
        $aux = array();
        foreach ($periodos as $value) {
            if ($value->inicio != $value->fin) {
                array_push($aux, $value);
            }
        }
        $this->datos = $aux;
    }

    public function cargarGraficaAction()
    {
        $periodos = Zend_Json::decode($this->uiParams['idperiodo']);
        LogisticaObjectHelper::__init()->synchronize(
            $this, $this->model->devolverValorPeriodos($periodos)
        );
    }

    public function cargarEjerciciosAction()
    {
        $this->datos = $this->serviciosPeriodos->obtenerEjercicios(
            $this->global->Estructura->idestructura
        );
    }

}
