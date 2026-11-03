<?php

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class VariablesglobalesController extends BaseController
{
    /**
     * @var VariablesGlobalesModel
     */
    private $variablesModel;

    public function init()
    {
        parent::init('log.lb.variablesglobales');
        $this->variablesModel = new VariablesGlobalesModel();
    }

    public function variablesGlobalesAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.lb.variablesglobales');
        $this->renderTemplate();
    }

    public function salvarVariableAction()
    {
        $this->setDefaultParam('ambito', 1);
        $this->variablesModel->adicionar($this->uiParams);
        $this->success = true;
    }

    public function cargarVariablesAction()
    {
        $variables = $this->variablesModel->devolverVariables(VariablesGlobalesModel::AMBIT_UI);
        $this->datos = $variables;
        $this->cantidad = $variables[0]['total'];
    }

    public function eliminarVariableAction()
    {
        $id = $this->uiParams['id'];
        $this->variablesModel->eliminar($id);
        $this->success = true;
    }

    public function activarVariableAction()
    {

    }

    public function modificarVariableAction(){
        $params = $this->uiParams;
        $this->variablesModel->modificar($params);
        $this->success = true;
    }

}