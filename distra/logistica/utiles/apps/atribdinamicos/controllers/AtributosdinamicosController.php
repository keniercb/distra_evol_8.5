<?php

/**
 * @class     AtributosdinamicosController
 * @package
 * @author
 * @copyright XETID
 * @version   1.0
 */

if (!class_exists('BaseController')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class AtributosdinamicosController extends BaseController
{
    private $model, $nomdinamicos;

    public function init()
    {
        parent::init('log.lb.atributosdinamicos');
        $this->model = new AtributosdinamicosModel();
        $this->nomdinamicos = new NomdinamicosService();
    }

    public function atributosdinamicosAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.lb.atributosdinamicos');
        $this->renderTemplate();
    }

    public function cargarAtributosAction()
    {
        $this->uiParams['agrupacion'] = Zend_Json::decode($this->uiParams['agrupacion']);
        $this->objectHelper->synchronize($this, $this->model->cargarAtributos($this->uiParams));
    }

    public function adicionarAtributoAction()
    {
        $this->unsetNullValues();
        $this->uiParams['data'] = Zend_Json::decode($this->uiParams['data']);
        $this->setDefaultParam('idagrupacion', 1);
        $this->uiParams = array_merge($this->uiParams, $this->uiParams['data']);
        unset($this->uiParams['data']);
        $this->objectHelper->synchronize($this, $this->model->adicionarAtributo($this->uiParams));
    }

    public function eliminarAtributoAction()
    {
        $params = Zend_Json::decode($this->uiParams['id']);
        $this->model->eliminarAtributo($params);
    }

    public function cargarComboExpresionRegAction()
    {
        $this->objectHelper->synchronize($this, $this->model->cargarComboExpresionReg());
    }

    public function cargarComboNomencladoresAction()
    {
        $this->objectHelper->synchronize($this, $this->nomdinamicos->getNomDinamicos());
    }

    public function asociarAtributoAction()
    {
        $this->uiParams['idatributos'] = Zend_Json::decode($this->uiParams['idatributos']);
        $this->model->asociarAtributo($this->uiParams);
    }

}
