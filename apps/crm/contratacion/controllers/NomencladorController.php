<?php

/**
 * Controlador encargado de manejar lo referente a la gestion
 * de nomencladorescliente del modulo Contratacion de PCRM.
 *
 * @package        ERP-PCRM
 * @subpackage     CRM/contratacion/Controller
 * @author         Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 * @copyright (c)  2015, XETID
 * @version        1.0
 */
class NomencladorController extends NomencladorCmpController
{
    function init()
    {
        parent::init();
        $this->setFileConfig(APP_HOME . '../recursos/nomenclador.ini');
        $this->model = new NomencladorModel();
    }

    function nomencladorAction()
    {
        $this->render();
    }

    public function getUsuariosAction()
    {
        $params = $this->_request->getParams();
        $modelName = $params['modelName'];
        $result = $this->createModel($modelName)->getRoles();
        echo json_encode($result);
    }

    public function obtenerPaisesAction()
    {
        echo $this->model->obtenerPaises();
    }

    public function getIconsAction()
    {
        $estado = new NomEstado();
        $params = $this->_request->getParams();
        $webdir = Zend_Registry::get('config')->dir_webaplication;
        $iconfile = array('ini' => APP_HOME . '../../comun/recursos/iconos.ini',
                          'css' => $webdir . 'lib/ExtJS/temas/default/css/icon-font.css');
        $result = $estado->getIcons($params, $iconfile);
        echo json_encode($result);
    }

    public function getFormatoNumContratoElementosAction()
    {

    }

    public function getFormatoNumContratoNomencladoresAction()
    {
        $nomencladores = (new NomFormatoNumContratoModel())->getNomencladores();
        echo json_encode(array('data' => $nomencladores, 'cant' => count($nomencladores)));
    }

    public function getFormatoNumContratoNomencladoresElemAction()
    {
        $elemNom = (new NomFormatoNumContratoModel())->getNomencladorElementos($this->_getParam('idnom'));
        echo json_encode(array('data' => $elemNom, 'cant' => count($elemNom)));
    }

    public function createModel($modelName)
    {
        if (!$modelName) {
            return null;
        }

        $modelName = $modelName . 'Model';
        if (class_exists($modelName)) {
            return new $modelName();
        }
    }

    public function insertValuesAction()
    {
        $params = $this->_request->getParams();
        if ($params['modelName'] == 'DatArea') {
            $result = $this->model->insertarAreas($params);
            echo json_encode($result);
            return;
        }else if ($params['modelName'] == 'DatPersonaParametro') {
            $result = $this->model->insertarPersonaParametros($params);
            echo json_encode($result);
            return;
        }
        parent::insertValuesAction();
    }

    public function getAreasAction()
    {
        $params = $this->_request->getParams();
        $result = $this->model->getAreas($params);
        echo json_encode(array('data' => $result, 'success' => true));
    }

    public function guardarHerenciaAction(){
//        print('/*carajo*/');
        $result=$this->model->guardarHerencia($this->_request->getParams());
        echo json_encode($result);
    }

    public function getEstructurasAction(){
//        print('/*carajo*/');
        $result=$this->model->getEstructuras($this->_request->getParams());
        echo json_encode($result);
    }

    public function cargarCorreosAction()
    {
        $params = $this->_request->getParams();
        $result = $this->model->cargarCorreos($params);
        echo json_encode($result);
    }
}
