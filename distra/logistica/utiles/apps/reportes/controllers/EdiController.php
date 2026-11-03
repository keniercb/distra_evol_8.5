<?php

/**
 * @class JasperclientController
 * A simple application controller extension
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class EdiController extends ZendExt_Controller_Secure
{
  private $model;
    public function init()
    {
        parent:: init();
        $this->model = new EdiModel();
    }

    public function exportAction()
    {
        return $this->model->export($this->_request->getParam('datas'));
    }


}
