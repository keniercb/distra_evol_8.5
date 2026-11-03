<?php

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication.'/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path().PATH_SEPARATOR.$config['include_path']);
}

class ConfiguracionprodController extends ZendExt_Controller_Secure
{

    /**
     *
     */
    /*public function init()
    {
        parent::init('log.produccion.conf');
    }*/

    /**
     *
     */
    public function configuracionprodAction()
    {
        $this->autoShow = false;
        $this->render();
    }

    public function depositosconfiguradosAction(){

        $params = $this->_request->getPost();

        $confProdModel = new ConfProduccionModel();


        $datos = $confProdModel->getDepositos($params);

        echo json_encode(array('datos' => $datos));
    }

    public function gettodosdepositosAction(){
        $params = $this->_request->getPost();

        $confProdModel = new ConfProduccionModel();

        $datos = $confProdModel->getAllDepositos($params);
        echo json_encode(array('datos' => $datos));
    }

    public function addconfdepositosAction() {
        $params = $this->_request->getPost();
        $confProdModel = new ConfProduccionModel();
        $confProdModel->addTodosDepositos($params);
        echo json_encode(array('msg' => 'ok'));
    }

    public function delconfdepositosAction() {
        $params = $this->_request->getPost();

        $almaceneMPM = json_decode($params['almacenesMPM']);
        $almacenesPT = json_decode($params['almacenesPT']);


        $confProdModel = new ConfProduccionModel();
        $confProdModel->delconfdepositos($almaceneMPM, $almacenesPT);
        echo json_encode(array('msg' => 'OK'));
    }

    public function gestionarconfdepositosAction() {
        $params = $this->_request->getPost();
        $accionesEnDepostitos = json_decode($params['acciones']);

        $confProdModel = new ConfProduccionModel();
        $confProdModel->gestionarConfDepostiso($accionesEnDepostitos);
        echo json_encode(array('msg' => 'ok'));
    }

    public function adicionarequiposAction(){

        $params = $this->_request->getPost();
        $ids = json_decode($params['idequipos']);
        $confProdModel = new ConfProduccionModel();
        $confProdModel->addEquipos($ids);

        echo json_encode(array('msg' => 'ok'));
    }

    public function eliminarequiposAction(){

        $params = $this->_request->getPost();
        $ids = json_decode($params['idregistros']);
        $confProdModel = new ConfProduccionModel();
        $confProdModel->deleteEquipos($ids);

        echo json_encode(array('msg' => 'ok'));

    }

    public function cargarequiposAction(){
        $params = $this->_request->getPost();
        $confProdModel = new ConfProduccionModel($params);
        $equipos = $confProdModel->getEquiposConfigurados($params);
        echo json_encode(array('datos' => $equipos));
    }

    public function cargaractividadesAction(){
        /*$this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);*/
        $this->uiParams = $this->_request->getPost();
        $confProdModel = new ConfProduccionModel();
        $actividades = $confProdModel->cargaractividades($this->uiParams);
      
          echo json_encode(array('datos' => $actividades));
    }

    public function eliminaractividadAction(){

        $params = $this->_request->getPost();
        $ids = json_decode($params['idcartatecindustrial']);
        $confProdModel = new ConfProduccionModel();
        $return = $confProdModel->deleteActividad($ids);
        if($return){
            echo json_encode(array('msg' => 'ok'));
        }else {
            echo json_encode(array('msg' => 'nok'));
        }
        
       //print_r($actividades);die;
       // echo json_encode($actividades);

    }

    public function adicionaractividadAction(){

        $params = $this->_request->getPost();
        $confProdModel = new ConfProduccionModel();
        $actividades = $confProdModel->addActividad($params);
      
        echo json_encode(array('datos' => $actividades));
    }
    
    public function listarActividadesCartatecnologicaAction(){
        $params = $this->_request->getPost();
        $confProdModel = new ConfProduccionModel($params);
        $actividades = $confProdModel->listarActividadesCartatecnologica($params);
        echo json_encode(array('datos' => $actividades));
    }
    public function listarIndicadoresAction(){
        $params = $this->_request->getPost();
        $params['arrayActividad'] = (array) Zend_Json::decode(
            $params['arrayActividad']
        );
        $confProdModel = new ConfProduccionModel($params);
        $indicadores = $confProdModel->listarIndicadores($params);
        echo json_encode(array('datos' => $indicadores));
    }
    public function cargarAreasAction(){
        $params = $this->_request->getPost();
        $confProdModel = new ConfProduccionModel($params);
        $areas = $confProdModel->cargarAreas($params);
        echo json_encode(array('datos' => $areas));
    }
    
}