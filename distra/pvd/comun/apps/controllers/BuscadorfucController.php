<?php
class BuscadorfucController extends ZendExt_Controller_Secure
{
    public function init()
    {
        parent::init();
    }

    public function buscadorfucAction()
    {
        $this->render();
    }

    public function buscarpersonaAction()
    {
        $fuc = new FUCModel();
        $params = $this->_request->getParams();
        echo $fuc->buscarPersonaFUC($params);
    }
}