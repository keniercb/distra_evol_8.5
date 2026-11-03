<?php

require_once __DIR__ . '/../../planmeta/controllers/BpcalculoController.php';

class BpcalculoproduccionesController extends BpcalculoController {

    public function init() {
        parent::init();
    }

    public function operacionesBasesDeCalculoAction() {
        $identidad = $this->_request->getPost('identidad');
        $operacion = $this->_request->getPost('operacion');
        $isLeaf = $this->_request->getPost('is_leaf');
        $idejercicio = $this->_request->getPost('idejercicio');
        $idtipocalc = $this->_request->getPost('idtipocalc'); //1 normas 2 salidas
        $defaultReturn = true;
        if (($identidad != null) && ($identidad != 0)) {
            $modelBasesCalculo = new DatBasescalculoModel();
            $modelBasesCalculoproducciones = new DatBasescalculoproduccionesModel();
            if ($operacion == 'actualizar') {
                ini_set("max_execution_time", 600); //10min
                $dominioEntidades = array();
                if ($isLeaf == 'true') {
                    $dominioEntidades[] = $identidad;
                } else {
                    $security = ZendExt_Aspect_Security_Sgis::getInstance();
                    $dominioEntidades = DatActividadentidad::auxObtenerEntidadesHijasComun($identidad);
                    $var = implode(',', $dominioEntidades);
                    $dominioEntidades = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);
                }
                $arrayParaleloEntEsp = $this->objModel->getArrayEspecialidades($dominioEntidades, '3');
                if ($modelBasesCalculoproducciones->generarBaseDeCalculoDeUnaEntidad($arrayParaleloEntEsp, $idtipocalc, $idejercicio)) {
                    echo json_encode(array('codMsg' => 22));
                } else {
                    echo json_encode(array('codMsg' => 20));
                }
                $defaultReturn = false;
            } elseif ($operacion == 'eliminar') {
                if ($isLeaf == 'true') {
                    $modelBasesCalculo->eliminarBaseDeCalculoDeUnaEntidad($identidad, $idtipocalc, $idejercicio);
                    $defaultReturn = false;
                    echo json_encode(array('codMsg' => 22));
                } else {
                    $security = ZendExt_Aspect_Security_Sgis::getInstance();
                    $modeloActEnt = new DatActividadentidad();
                    $dominioEntidadesHijas = DatActividadentidad::auxObtenerEntidadesHijasComun($identidad);
                    $modelBasesCalculo->eliminarBaseDeCalculoParaVariasEntidades($dominioEntidadesHijas, $idtipocalc, $idejercicio);
                    $defaultReturn = false;
                }
            } else {
                if ($this->_request->getPost('identidad') == 0) {
                    echo json_encode(array('codMsg' => 21));
                } else {
                    echo json_encode(array('codMsg' => 3));
                }
                $defaultReturn = false;
            }
            if ($defaultReturn) {
                echo json_encode(array('codMsg' => 20));
            }
        }
    }

}
