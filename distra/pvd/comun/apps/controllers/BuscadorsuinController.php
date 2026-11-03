<?php

class BuscadorsuinController extends ZendExt_Controller_Secure
{

    public function init()
    {
        parent::init();
    }

    public function buscadorsuinAction()
    {
        $this->render();
    }

    public function buscarpersonaAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $numid = $this->_request->getPost('numid');
        $nombre = $this->_request->getPost('nombre');
        $papel = $this->_request->getPost('papel');
        $sapel = $this->_request->getPost('sapel');
        $selector = $this->_request->getPost('selector');
        $data = $this->_request->getPost('data');
        //print_r($selector);die;
        if ($selector == 2) {
            $objBuscador = new BuscadorSuinModel();
            $result = $objBuscador->buscarPersona($numid, $nombre, $papel, $sapel, $limit, $start);
        } else {
            $objSoap = new SuinSoapService();
            if($data == 1)
                $result = $objSoap->buscarByParams($numid, $nombre, null, $papel, $sapel);
            else if($data == 2)
                $result = $objSoap->buscarByParamsDatos($numid, $nombre, null, $papel, $sapel);
        }
        echo json_encode($result);
    }

    public function getParamConectionAction()
    {
        $objModel = new BuscadorSuinModel();
        $r = $objModel->getParamConection();
        echo json_encode($r);
    }

    /**
     * Chequea conexion al servidor
     */
    public function checkConectionAction()
    {
        $server = $this->_request->getPost('server');
        $port = $this->_request->getPost('port');
        $user = $this->_request->getPost('user');
        $pass = $this->_request->getPost('pass');
        $db = $this->_request->getPost('db');

        $objModel = new BuscadorSuinModel();
        $r = $objModel->checkConection($server, $port, $user, $pass, $db);
        echo json_encode($r);
    }

    /**
     * Guarda los parametros de conexion
     */
    public function saveConectionAction()
    {
        $server = $this->_request->getPost('server');
        $port = $this->_request->getPost('port');
        $user = $this->_request->getPost('user');
        $pass = $this->_request->getPost('pass');
        $db = $this->_request->getPost('db');

        $objModel = new BuscadorSuinModel();
        $r = $objModel->saveConection($server, $port, $user, $pass, $db);
        echo json_encode($r);
    }
}

?>