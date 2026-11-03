<?php
/**
 * Esta clase controla la gestión de los lotes vencidos
 * @copyright XETID
 * @author Divicion de Gestion de Entidades
 * @version 1.0
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}
class LotesvencidosController extends BaseController
{

    private $serviciosAyuda,$model;

    function init()
    {
        parent::init('log.inv.lotesvencidos');
        $this->serviciosAyuda = ServiciosAyudaHelper::__init();
        $this->model =new LotesvencidosModel();
    }

    public function gestLotesvencidosAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.inv.lotesvencidos');
        $this->rendertemplate();
    }

    public function getLotesVencidosAction()
    {
        $result = $this->model->cargarLotesVencidos($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_INV;
    }

    public function cargardepositosAction()
    {
        $datas = $this->model->loadDepositos();
        $this->datos = $datas['datos'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_INV;
    }




}
