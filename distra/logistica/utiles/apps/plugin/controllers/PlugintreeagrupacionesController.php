<?php

/**
 * Clase controladora para gestionar el plugin treeAgrupaciones
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication
        . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(
        get_include_path() . PATH_SEPARATOR . $config['include_path']
    );
}

class PlugintreeagrupacionesController extends BaseController
{
    private $serviceAtributo;

    public function init()
    {
        parent::init('log.lb.treeagrupaciones');
        $this->serviceAtributo = new AtributosdinamicosxService();
    }

    /**
     * Funcion para cargar los datos del treeAgrupaciones
     */
    public function cargarTreeAgrupacionesAction()
    {
        $result = $this->serviceAtributo->getTreeAgrupaciones($this->uiParams);
        $this->jsonResponse($result);
    }

    /**
     * Funcion para guardar la relacion del atributo dinamico con el elemento que lo usa
     */
    public function guardarRelacAtributoAction()
    {
        $this->uiParams['adicionados'] = Zend_Json::decode($this->uiParams['adicionados']);
        $this->uiParams['eliminados'] = Zend_Json::decode($this->uiParams['eliminados']);
        $this->serviceAtributo->guardarTablaMeta($this->uiParams);
    }

    /**
     * Funcion para obtener el codigo UI de los atributos por cada agrupacion
     * para el elemento que los usa
     */
    public function getCodUiAtributosAction()
    {
        $params = $this->_request->GetPost();
        $result = $this->serviceAtributo->getCodUiAtributos($params);
        $this->jsonResponse($result);
    }

}
