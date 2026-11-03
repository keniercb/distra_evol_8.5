<?php

/**
 * Created by PhpStorm.
 * User: yoendy
 * Date: 2/23/2016
 * Time: 8:48 AM
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class RecuperacionesController extends BaseController
{

    private $idnatObjObra, $idnatINMUEBLE, $idnatUTIHERR, $model;
    function init()
    {
        parent::init('log.aft.recuperaciones');
        $this->serviciosAyuda = ServiciosAyudaHelper::__init();
//        $this->movimientoLento = new MovimientoLentoModel();
//        $this->serviciosDepositos = LogisticaEstructuraUbicHelper::__init();
        $this->idnatObjObra = IntegracionNomencladoresModel::NATURALEZA_OBJETODEOBRA;
        $this->idnatINMUEBLE = IntegracionNomencladoresModel::NATURALEZA_INMUEBLE;
        $this->idnatUTIHERR = IntegracionNomencladoresModel::NATURALEZA_HERRAMIENTA;
        $monedas = $this->configuracionHelper->monedaContableEntidad($this->global->Estructura->idestructura);
        $this->model = new RecuperacionesModel();
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
                'nommonedaalternativa' => "'" . "{$moneda['nombremonedaalternativa']}" . "'",
                'idNatObjObra'         => "'" . "{$this->idnatObjObra}" . "'",
                'idNatInmueble'        => "'" . "{$this->idnatINMUEBLE}" . "'",
                'idnatUTIHERR'        => "'" . "{$this->idnatUTIHERR}" . "'",
                'idEntiadPadre'        => $this->model->getEstructuraPadre(),
                'integradocontabilidad' =>  ComunAFTModel::integradoContabiliadConf($this->global->Estructura->idestructura),
                'estaestructura'       => $this->global->Estructura->idestructura
            ), $this->view->uiVariables
        );
        $this->view->arrayJs = array(
            '<script type="text/javascript" src="/pvd/comun/views/js/utiles/searchComboBox.js"></script>',
            '<link href="/pvd/persona/views/ext/ComboBoxBtn/ComboBoxBtn.css" media="screen" rel="stylesheet" type="text/css">',
            '<script type=\'text/javascript\' src=\'/pvd/persona/views/ext/ComboBoxBtn/ComboBoxBtn.js\'></script>',
            '<script type=\'text/javascript\' src=\'/pvd/persona/views/js/buscarpersona/buscarpersona.js\'></script>'
        );
    }

    public function gestRecuperacionesAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.aft.recuperaciones');
        $this->rendertemplate();
    }

    public function guardarParamsReportsAction() {
        $parametros = $this->uiParams;
        $model = new RecuperacionesModel();
        $this->idusuario = $model->guardarParamsReports($parametros);
    }

}
