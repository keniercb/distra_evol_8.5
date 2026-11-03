<?php

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class EstandarcodigobarrasController extends BaseController
{
    private $estandarCodigoBarrasModel;
    public function init()
    {
        parent::init('log.lb.estandarcodigobarras');
        $this->estandarCodigoBarrasModel = new EstandarCodigoBarrasModel();
    }

    public function estandarCodigoBarrasAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.lb.estandarcodigobarras');
        $this->renderTemplate();
    }

    public function addModEstandarCodigoBarrasAction()
    {
        $this->objectHelper->synchronize(
            $this, $this->estandarCodigoBarrasModel->addModEstandarCodigoBarras($this->uiParams)
        );
    }

    public function cargarEstandaresCodigoBarraAction()
    {
        $this->objectHelper->synchronize(
            $this, $this->estandarCodigoBarrasModel->cargarEstandaresCodigoBarra($this->uiParams)
        );
    }

    public function eliminarEstandarCodigoBarrasAction()
    {
        $this->objectHelper->synchronize(
            $this, $this->estandarCodigoBarrasModel->eliminarEstandarCodigoBarras($this->uiParams['idestandarcodigobarra'])
        );
    }

    public function probarEstandarCodigoBarrasAction()
    {
        $this->objectHelper->synchronize(
            $this, $this->estandarCodigoBarrasModel->probarEstandarCodigoBarras($this->uiParams)
        );
    }

    public function setearSequenciaEstandarCodigoBarrasAction()
    {
        $this->objectHelper->synchronize(
            $this, $this->estandarCodigoBarrasModel->setearSequenciaEstandarCodigoBarras($this->uiParams)
        );
    }

    public function generarCodigoBarrasAction()
    {
        $idestandarcodigobarra = $this->uiParams['idestandarcodigobarra'];
        if ($idestandarcodigobarra) {
            $this->objectHelper->synchronize(
                $this, $this->estandarCodigoBarrasModel->generarCodigoBarra($idestandarcodigobarra)
            );
        }
        
    }

    public function comprobarCodigoBarrasAction()
    {
        $codigobarra = $this->uiParams['codigobarra'];
        if ($codigobarra) {
            $this->objectHelper->synchronize(
                $this, $this->estandarCodigoBarrasModel->comprobarCodigoChequeo($codigobarra)
            );
        }
        
    }
}
