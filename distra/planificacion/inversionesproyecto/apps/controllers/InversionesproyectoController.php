<?php

require_once __DIR__ . '/../../inversiones/controllers/InversionesController.php';

class InversionesproyectoController extends InversionesController {

//Arielon 2.0
    public function init() {
        parent::init();
    }

    public function inversionesproyectoAction() {
        $this->view->sipac_elementos = $this->integrator->planpdo->getJSElementos();

        $this->view->jsrepresentacion = $this->integrator->gis->DevolverJS();
        $this->render();
    }

    public function asociarInversionaelementoAction() {
        $parametros->idelemento = $this->_request->getPost('idelemento');
        $parametros->idinversion = $this->_request->getPost('idinversion');
        $obj = new DatInversionelemento();
        if ($obj->findByIds($parametros) > 0) {
            $obj->deleteByIds($parametros);
        }

        $obj->insertar($parametros);
        echo json_encode(
                array('success' => true, 'mensaje' => 1)
        );
    }

    public function desasociarInversionProyectoAction() {
        $parametros->idelemento = $this->_request->getPost('idelemento');
        $parametros->idinversion = $this->_request->getPost('idinversion');
        $obj = new DatInversionelemento();
        if ($obj->findByIds($parametros) > 0) {
            $obj->deleteByIds($parametros);
        }
        echo json_encode(
                array('success' => true, 'mensaje' => 1)
        );
    }

    public function getElementoAsociadoAction() {
        
//probando servicio de GANT
//$this->pIntegrator->inversiones->obtenerInversionesPorFecha(100530253, '01/01/2017', '31/12/2017');
        
        
        $parametros->idinversion = $this->_request->getPost('idinversion');
        $obj = new DatInversionelemento();
        $idelemento = $obj->findByIdsElemento($parametros);
        echo json_encode(
                array('success' => true, 'idelemento' => $idelemento['idelemento'])
        );
    }

    //Lista los niveles de actividad de las inversiones
    public function listarActsNivActAction() {
        ini_set("max_execution_time", 600);
        $params = array();
        $params['start'] = $this->_request->getPost('start') ? $this->_request->getPost('start') : 0;
        $params['limit'] = $this->_request->getPost('limit') ? $this->_request->getPost('limit') : 20;
        $params['identidad'] = $this->_request->getPost('identidad') ? $this->_request->getPost('identidad') : 0;
        $params['idejercicio'] = $this->_request->getPost('idejercicio') ? $this->_request->getPost('idejercicio') : 0;
        $params['filtros'] = $this->_request->getPost('filtros');
        $params['idetapainversion'] = $this->_request->getPost('idetapa');
        $params['idespecialidad'] = $this->integrator->metadatos->DameEstructura($params['identidad']);
        $params['idespecialidad'] = $params['idespecialidad'][0]->idespecialidad;
        $modelActividad = new NomActividadInversionesSisplanModel ();
        $result = $modelActividad->listarActividadesInversiones($params);
        echo json_encode($result);
    }

    //Guardar los niveles de actividad de las inversiones
    public function guardarNivelesAction() {
        $params['idetapainversion'] = $this->_request->getPost('idetapainversion');
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['arrayNiveles'] = json_decode(stripslashes($this->_request->getPost('arrayNiveles')));
        $etapainversionactespcomportamientoModel = new DatInversnivelactividadModel();
        $result = $etapainversionactespcomportamientoModel->guardarNiveles($params);
        echo json_encode(array('codMsgAs' => $result));
    }

    public function mostrarVerDetallesIntegracionAction() {
        $datosInv['idinversion'] = $this->_request->getPost('idinversion');
        $datosInv['idejercicio'] = $this->_request->getPost('idejercicio');
        $datosInv['identidad'] = $this->_request->getPost('identidad');
        $parametros->datosinv = json_decode(stripslashes($this->_request->getPost('datosinv')));
        
        $inv = new DatInversnivelactividadModel();
        
        $datos = $inv->verDetallesIntegracion($parametros, $datosInv);
        echo json_encode($datos);
    }

}
