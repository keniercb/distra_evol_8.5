<?php

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()
            ->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}
class UnificadorconceptosController extends BaseController
{
    /**
     * @var ClientesModel
     */
    private $unificadorModel;
    public function init($concepto)
    {
        parent::init('log.tools.clientes');
        $this->unificadorModel = new UnificadorConceptosFactory($concepto);
    }

    public function devolverAction(){
        $this->objectHelper->synchronize($this,$this->unificadorModel->devolver($this->uiParams));
    }

    public function unificarAction(){
        $this->uiParams['data'] = Zend_Json::decode($this->uiParams['data']);
        $this->success = $this->unificadorModel->unificar($this->uiParams['data']['iddestino'],$this->uiParams['data']['idunificar']);
    }
}
