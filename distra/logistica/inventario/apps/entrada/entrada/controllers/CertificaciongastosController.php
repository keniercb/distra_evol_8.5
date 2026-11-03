<?php
/**
 * Created by PhpStorm.
 * User: kenier
 * Date: 28/10/2017
 * Time: 10:22
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class CertificaciongastosController extends BaseController
{
    private $model;

    public function init($strComponent = '')
    {
        parent::init($strComponent);
        $this->model = new CertificarGastosModel();
    }

    public function cargarCuentasGastoAction()
    {
        $this->objectHelper->synchronize($this, $this->model->devolverCunetasGasto($this->uiParams));
    }

    public function salvarAction()
    {
        $this->uiParams['data'] = $this->objectHelper->stdClassToArray(Zend_Json::decode($this->uiParams['data']));
        $this->uiParams = array_merge($this->uiParams, $this->uiParams['data']);
        unset($this->uiParams['data']);
        unset($this->uiParams['idcertificaciongasto']);
        $this->objectHelper->synchronize($this, $this->model->salvarCertificacion($this->uiParams));
    }

    public function eliminarAction()
    {
        $id = Zend_Json::decode($this->uiParams['id']);
        $this->objectHelper->synchronize($this, $this->model->eliminarCertificacion($id));
    }

    public function obtenerAction()
    {
        $this->objectHelper->synchronize($this, $this->model->obtenerCertificaciones($this->uiParams));
    }

    public function confirmarAction()
    {
        $this->objectHelper->synchronize($this, $this->model->confirmarCertifiacion($this->uiParams['iddocumento']));
    }

    public function aprobarAction()
    {
        $this->objectHelper->synchronize($this, $this->model->aprobarCertifiacion($this->uiParams['iddocumento']));
    }

}