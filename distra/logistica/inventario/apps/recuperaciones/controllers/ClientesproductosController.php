<?php
/**
 *
 * * @copyright XETID
 * @author DIvicion de Gestion de Entidades
 * @version 1.0
 */


if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class ClientesproductosController extends BaseController
{
    private $serviciosAyuda;
    private $model;

    function init()
    {
        parent::init('log.inv.clientesproductos');
        $this->serviciosAyuda = ServiciosAyudaHelper::__init();
        $this->model = new RecuperacionesInventarioModel();
    }

    public function gestclientesproductosAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();

        $this->arrayjs = array(
            
            $this->serviciosCFG->mostrarNomencladoresGenerales(),
            $this->serviciosCFG->ObtenerJSArbolNaturaleza()
        );

        $this->initComponent('log.inv.clientesproductos');
        $this->rendertemplate();
    }

    public function cargardepositosAction()
    {
        $datas = $this->model->loadDepositos();
        $this->datos = $datas['datos'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_INV;
    }



}
