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
class ValordepositosController extends BaseController
{
    private $serviciosAyuda;
    private $model;

    function init()
    {
        parent::init('log.inv.valordepositos');
        $this->serviciosAyuda = ServiciosAyudaHelper::__init();
        $this->model = new ValordepositosModel();
        $monedas = $this->configuracionHelper->monedaContableEntidad($this->global->Estructura->idestructura);
        $alternativa = 0;

        foreach ($monedas['datos'] as $value) {
            if ($value['dualidad'] == 1) {
                $alternativa = 1;
                $moneda['codigoAlternativa'] = $value['codigoiso'];
                $moneda['monedaalternativa'] = $value['idmoneda'];
            } else {
                $moneda['codigoContable'] = $value['codigoiso'];
                $moneda['monedacontable'] = $value['idmoneda'];
            }
        }
        $this->view->uiVariables = array_merge(array(
                'alternativa' => $alternativa == 1 ? 'true' : 'false',
                'codigoContable' => "'" . "{$moneda['codigoContable']}" . "'",
                'codigoAlternativa' => "'" . "{$moneda['codigoAlternativa']}" . "'",
                'monedacontable' => "'" . "{$moneda['monedacontable']}" . "'",
                'monedaalternativa' => "'" . "{$moneda['monedaalternativa']}" . "'"
            ), $this->view->uiVariables
        );
    }

    public function valordepositosAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();

        $this->initComponent('log.inv.valordepositos');
        $this->rendertemplate();
    }

    public function cargarDepositosAction()
    {
        $this->uiParams['pordeposito'] = 1;
        $result = $this->model->devolverValorDepositos($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
        $this->iddocs = $result['iddocs'];
        $this->iddepositos = $result['iddepositos'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_INV;
    }


}
