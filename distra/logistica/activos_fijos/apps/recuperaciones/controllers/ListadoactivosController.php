<?php

/**
 * Created by PhpStorm.
 * User: yoendy
 * Date: 2/23/2016
 * Time: 10:45 AM
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class ListadoactivosController extends BaseController
{

    protected $_sConfGeneral;

    function init()
    {
        parent::init('log.aft.listadoactivos');
        $this->serviciosAyuda = ServiciosAyudaHelper::__init();
//        $this->movimientoLento = new MovimientoLentoModel();
//        $this->serviciosDepositos = LogisticaEstructuraUbicHelper::__init();
        $monedas = $this->configuracionHelper->monedaContableEntidad($this->global->Estructura->idestructura);
        $this->_sConfGeneral = ServiciosConfiguracionGeneralHelper::__init();
        $alternativa = 0;
        $moneda = array();
        foreach ($monedas['datos'] as $value) {
            if ($value['dualidad'] == 1) {
                $alternativa = 1;
                $moneda['monedaalternativa'] = $value['idmoneda'];
                $moneda['nombremonedaalternativa'] = $value['codigoiso'];
            } else {
                $moneda['monedacontable'] = $value['idmoneda'];
                $moneda['nombremonedacontable'] = $value['codigoiso'];
            }
        }
        $this->view->uiVariables = array_merge(
            array(
                'alternativa' => $alternativa,
                'monedacontable' => "'" . "{$moneda['monedacontable']}" . "'",
                'nommonedacontable' => "'" . "{$moneda['nombremonedacontable']}" . "'",
                'monedaalternativa' => "'" . "{$moneda['monedaalternativa']}" . "'",
                'nommonedaalternativa' => "'" . "{$moneda['nombremonedaalternativa']}" . "'"
            ), $this->view->uiVariables
        );
    }

    public function gestListadoactivosAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.aft.listadoactivos');
        $this->rendertemplate();
    }

    public function getListadoActivosAction()
    {
        $model = new RecuperacionesModel();
        
        $this->setDefaultParam('start', 0);
        $this->setDefaultParam('limit', 30);
        $parametros = $this->uiParams;
        
        $idestructura = $this->global->Estructura->idestructura;
        $parametros['idestructura'] = $idestructura;
        
        $resp = $model->getActivosDepreciados($parametros);

        $this->datos = $resp['datos'];
        $this->total = $resp['total'];
        $this->cantidad = $resp['total'];
    }

    public function getMetodosDepreciacionAction()
    {
        $model = new RecuperacionesModel();
        $dat = $model->getMetodosDep();
        $respuesta = array();
        foreach ($dat as $d) {
            $respuesta[] = $d['idmetodo'];
        }
        $this->datos = $respuesta;
    }

}
