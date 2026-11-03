<?php
/**
 * @class         AxchartController
 * Extension
 *
 * @package       Utiles
 * @subpackage    Plugin
 * @author        Division GE
 * @copyright (c) 2016, XETID
 * @version       1.0
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}
class AxchartController extends BaseController
{
    protected $chartModel;
    public function init()
    {
        parent::init();
        $this->autoShow = false;
        $this->chartModel = new AxchartModel();
    }

    public function axchartAction()
    {

    }

    /**
     * Load hash queries
     */
    public function loadHashQueryAction()
    {
        $hashQuery = $this->_request->getParam('hashQuery');
        $data = $this->chartModel->executeSqlQuery($hashQuery);
         $this->jsonResponse($data);
    }

    /**
     * Load sql queries
     */
    public function loadSqlQueryAction()
    {
        $sqlQuery = $this->_request->getParam('sqlQuery');
        $data = $this->chartModel->executeSqlQuery($sqlQuery);
        if(count($data) > 0)
            $this->jsonResponse($data);
        else
            $this->jsonResponse(array(array('' => '')));
    }

}
