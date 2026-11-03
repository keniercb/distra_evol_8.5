<?php
/**
 * Created by PhpStorm.
 * User: kcumba
 * Date: 4/06/18
 * Time: 15:01
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class ReposicionproductoController extends BaseController
{
    private $model;

    public function init()
    {
        parent::init('log.inv.reposicion');
        $this->model = new ReposicionModel();
        $this->setDefaultParam('limit',30);
    }

    public function reposicionProductoAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();

        /*$this->view->arrayJs = array(
            $this->configuracionHelper->mostrarNomencladoresGenerales(),
            $this->configuracionHelper->ObtenerJSArbolNaturaleza(),
            $this->configuracionHelper->ObtenerJSArbolUM()
        );*/

        $this->initComponent('log.inv.reposicion');
        $this->renderTemplate();
    }

    public function getProductosReposicionAction()
    {
        LogisticaObjectHelper::__init()->synchronize($this, $this->model->cargarProductosReposicion($this->uiParams));
    }
    public function guardarReposicionAction()
    {
        $this->model->guardarReposicion($this->uiParams);
    }

    public function reponerAction()
    {
        $resp = $this->model->reponer($this->uiParams);
        if($resp['msg']) {
            $this->msg = $resp['msg'];
        }
        if($resp['nrodoc']) {
            $this->nrodoc = $resp['nrodoc'];
            $this->fechacontable = $resp['fechacontable'];
        }
    }
}