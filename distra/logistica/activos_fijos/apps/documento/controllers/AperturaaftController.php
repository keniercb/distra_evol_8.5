<?php

/**
 *
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication.'/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path().PATH_SEPARATOR.$config['include_path']);
}

/**
 *
 */
class AperturaaftController extends BaseController
{
    protected $_mApertura;

    /**
     *
     */
    public function init($strComponent = 'log.aft.apertura')
    {
        parent:: init($strComponent);
        $this->_mApertura = new AperturaAFTModel();
    }

    /**
     *
     */
    public function gestaperturaAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.aft.apertura');
        $this->renderTemplate();
    }

    public function adicionarDocumentoAction()
    {
        $this->_mApertura->adicionarDocumento(Zend_Json::decode($this->uiParams['data']));
    }

    public function cargarDocumentosAction()
    {
        $datos = $this->_mApertura->cargarAperturas($this->uiParams);
        $this->datos = $datos['datos'];
        $this->cantidad = $datos['cantidad'];
    }

    public function eliminarDocumentoAction()
    {
        try {
            $this->_mApertura->eliminarApertura(Zend_Json::decode($this->uiParams['id'])[0]);
        } catch (Exception $e) {
            $this->success = false;
            $this->codigoMsg = 3;
            $this->message = $e->getMessage();
        }
    }

    public function confirmarDocumentoAction()
    {
        try {
            $this->_mApertura->confirmarApertura($this->uiParams);
        } catch (Exception $e) {
            $this->success = false;
            $this->codigoMsg = 3;
            $this->message = $e->getMessage();
        }
    }

    public function anularEstadoDocumentoAction()
    {
        try {
            $this->_mApertura->anularEstadoApertura($this->uiParams);
        } catch (Exception $e) {
            $this->success = false;
            $this->codigoMsg = 3;
            $this->message = $e->getMessage();
        }
    }

    public function aprobarDocumentoAction()
    {
        $resp = $this->_mApertura->aprobarApertura($this->uiParams);
        if (!is_null($resp['msg'])) {
            $this->success = false;
            $this->codigoMsg = 3;
            $this->message = $resp['msg'];
        } else {
            $this->datos = $resp;
        }
    }

    public function adicionarMedioAction()
    {
        
    }

    public function eliminarMedioAction()
    {
        
    }

    public function cargarMediosDocAction()
    {
        $datos = $this->_mApertura->cargarMediosDoc($this->uiParams);
        $this->datos = $datos['datos'];
        $this->cantidad = $datos['cantidad'];
    }

    public function cargarMediosExistentesAction()
    {
        $datos = $this->_mApertura->cargarMediosExistentes($this->uiParams);
        $this->datos = $datos['datos'];
        $this->cantidad = $datos['total'];
    }

    public function cargarEstructurasAction()
    {
        $datos = $this->_mApertura->cargarEstructuras($this->uiParams);
        $this->datos = $datos['datos'];
        $this->cantidad = $datos['total'];
        /*$dat = $this->estructuraHelper->getEntidadesByDominio(
            $this->global->perfil->iddominio, false, $this->uiParams['criterio']
        );
        if (!$this->uiParams['todas']) {
            $result = $this->_mApertura->addResultLimits($dat, $this->uiParams);
            $this->datos = $result['datos'];
            $this->cantidad = $result['cantidad'];
        } else {
            $this->datos = $dat;
            $this->cantidad = count($dat);
        }*/
    }

    public function cargarEstructurasHijasAction()
    {
        $result = $this->_mApertura->cargarEstructurasHijas();
        $this->datos = $result;
        $this->cantidad = count($result);
    }

}
