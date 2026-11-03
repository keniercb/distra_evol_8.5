<?php
/**
 * Created by PhpStorm.
 * User: yoendy
 * Date: 8/28/2017
 * Time: 9:16 AM
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}
class ListadolecturasController extends BaseController
{
    function init()
    {
        parent::init('log.aft.listadolecturas');
        $this->serviciosAyuda = ServiciosAyudaHelper::__init();
//        $this->movimientoLento = new MovimientoLentoModel();
//        $this->serviciosDepositos = LogisticaEstructuraUbicHelper::__init();
    }

    public function ListadolecturasAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.aft.listadolecturas');
        $this->rendertemplate();
    }

    public function getListadoLecturasAction()
    {
        $model = new RecuperacionesModel();
        $parametros = $this->uiParams;

        $parametros['vista'] = 2;
        ComunAFTModel::getInstance()->configStartAndLimitInParams(
            $parametros, $this->_request->getPost('start'), $this->_request->getPost('limit')
        );

        $dat = $model->obtenerLecturasRecursosConsumidos($parametros);

        $this->datos = ($dat['datos']) ? $dat['datos'] : array();
        $this->total = $dat['total'];
        $this->cantidad = $dat['total'];

    }
} 