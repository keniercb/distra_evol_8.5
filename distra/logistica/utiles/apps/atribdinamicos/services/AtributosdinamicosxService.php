<?php
/**
  * @author
 */
if (!class_exists('BaseModel')) {
    $dirLog = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/comun/config.php';
    include_once $dirLog;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

/**
 * @class      AtributosdinamicosService
 * @package
 * @author     Osleidy Quiala
 * @copyright  2017 XETID
 */
class AtributosdinamicosxService extends LogisticaComponentService
{
    private $modelAgrupaciones, $modelTablaMeta;

    public function __construct()
    {
        parent::__construct();
        $this->modelAgrupaciones = new AgrupacionesModel();
        $this->modelTablaMeta = new TablametaModel();
    }

    public function getTreeAgrupaciones($node)
    {
        return $this->modelAgrupaciones->getTreeAgrupaciones($node);
    }

    public function guardarTablaMeta($params)
    {
        $this->modelTablaMeta->guardarTablaMeta($params);
    }

    public function getCodUiAtributos($params)
    {
        return $this->modelAgrupaciones->getCodUiAtributos($params);
    }

    public function getAtribPropiedades($params)
    {
        return $this->modelTablaMeta->getAtribPropiedades($params);
    }

}
