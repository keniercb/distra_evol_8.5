<?php
/**
 * Esta clase controla la gestión de los productos por debajo del mínimo
 * y por encima del máximo
 * @copyright XETID
 * @author DIvicion de Gestion de Entidades
 * @version 1.0
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}
class ProductominimomaximoController extends BaseController
{
    private $serviciosAyuda;
    private $model;

    function init()
    {
        parent::init('log.inv.productominimomaximo');
        $this->serviciosAyuda = ServiciosAyudaHelper::__init();
        $this->model= new ProductoMinimoMaximoModel();
    }

    public function gestProductominimomaximoAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.inv.productominimomaximo');
        $this->rendertemplate();
    }
    /**
     * Este metodo se encarga de resolver las peticiones de la vista de
     * productos minimos y la de productos maximo y en dependecia de la que
     * esté solicitando devuelve los productos.
     * @params no posee parametros
     * @author Daniel Arias Espinosa
     * @return void     *
     */
    public function getProductoMinORMaxAction()
    {
        $this->uiParams['start'] = ($this->uiParams['start']) ? $this->uiParams['start'] : 0;
        $this->uiParams['limit'] = ($this->uiParams['limit']) ? $this->uiParams['limit'] : 30;
        $res= $this->model->getProductosMinORMax($this->uiParams);
        $this->datos = $res['datos'];
        $this->cantidad = $res['cantidad'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_INV;
    }

    public function cargardepositosAction()
    {
        $datas = $this->model->loadDepositos();
        $this->datos = $datas['datos'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_INV;
    }
}
