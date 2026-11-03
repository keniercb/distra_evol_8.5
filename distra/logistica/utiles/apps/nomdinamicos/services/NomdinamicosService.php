<?php
/**
  * @author
 */
if (!class_exists('BaseModel')) {
    $dirLog = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/comun/config.php';
    include_once $dirLog;
    set_include_path(
        get_include_path() . PATH_SEPARATOR . $config['include_path']
    );
}

/**
 * @class      NomdinamicosService
 * @package
 * @author     Osleidy Quiala
 * @copyright  2017 XETID
 */
class NomdinamicosService extends LogisticaComponentService
{
    private $modelNomDinamicos;

    public function __construct()
    {
        $this->modelNomDinamicos = new NomdinamicosModel();
    }

    public function getNomDinamicos()
    {
        return $this->modelNomDinamicos->getNomDinamicos();
    }

}
