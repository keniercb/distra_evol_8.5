<?php
/**
 * Esta clase controla la gestión de los productos de movimiento lento
 * @copyright XETID
 * @author DIvicion de Gestion de Entidades
 * @version 1.0
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}
class LentosController extends BaseController
{
    private $serviciosAyuda, $model;


    function init()
    {
        parent::init('log.inv.movimientolento');
        $this->serviciosAyuda = ServiciosAyudaHelper::__init();
        $this->model = new MovimientoLentoModel();
    }

    public function gestLentosAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.inv.movimientolento');
        $this->rendertemplate();
    }

    public function getProductosLentoMovAction()
    {
        $this->uiParams['start'] = ($this->uiParams['start']) ? $this->uiParams['start'] : 0;
        $this->uiParams['limit'] = ($this->uiParams['limit']) ? $this->uiParams['limit'] : 30;
        $this->setDefaultParam('valor',10);
        $result = $this->model->cargarProductos($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_INV;
    }

    public function getFechaAction()
    {
        $result = $this->model->calculaFecha($this->uiParams['dias']);
        $this->fechainicio = $result['fechainicio'];
        $this->fechafin = $result['fechafin'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_INV;
    }

    public function cargardepositosAction()
    {
        $datas = $this->model->loadDepositos();
        $this->datos = $datas['datos'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_INV;
    }

}
