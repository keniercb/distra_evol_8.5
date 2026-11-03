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
class ValordepositosxfechaController extends BaseController
{
    private $serviciosAyuda;
    private $model;

    function init()
    {
        parent::init('log.inv.valordepositosxfecha');
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

    public function valordepositosxfechaAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();

        $this->initComponent('log.inv.valordepositosxfecha');
        $this->rendertemplate();
    }

    public function cargarDepositosxFechaAction()
    {
        $this->uiParams['pordeposito'] = 1;
        $result = $this->model->devolverValorDepositosxFecha($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
        $this->iddocs = $result['iddocs'];
        $this->fechainicio = $this->global->FechaContable->fecha;
        $this->iddepositos = $result['iddepositos'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_INV;
    }

    public function restablecerSubmayorAction()
    {
        $this->model->restablecerDisponible(explode(',', $this->uiParams['idestructura']));
    }
    
    


}
