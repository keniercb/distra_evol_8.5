<?php

require_once __DIR__ . '/../../planmeta/controllers/BpcalculoController.php';

class BpcalculosisplaninversionesController extends BpcalculoController {

    public function init() {
        parent::init();
    }

    public function operacionesBasesDeCalculoAction() {
        $identidad = $this->_request->getPost('identidad');
        $operacion = $this->_request->getPost('operacion');
        $isLeaf = $this->_request->getPost('is_leaf');
        $idejercicio = $this->_request->getPost('idejercicio');
        $idtipocalc = $this->_request->getPost('idtipocalc');

        if (($identidad != null) && ($identidad != 0)) {
            $modelBasesCalculo = new DatBasescalculoModel();
            if ($operacion == 'actualizar') {
                ini_set("max_execution_time", 600);
                $dominioEntidades = array();
                if ($isLeaf == 'true') {
                    $dominioEntidades[] = $identidad;
                } else {
                    $dominioEntidades = $modelBasesCalculo->auxObtenerEntidadesHijas($identidad);
                    array_push($dominioEntidades, $identidad);
                    $var = implode(',', $dominioEntidades);
                    $dominioEntidades = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);
                }

                $arrayParaleloEntEsp = $this->objModel->getArrayEspecialidades($dominioEntidades, '3');

                if (DatBasescalculosisplaninversionesModel::generarBaseDeCalculoDeUnaEntidad($arrayParaleloEntEsp, $idtipocalc, $idejercicio)) {
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
                    $dominioEntidadesHijas = DatActividadentidad::auxObtenerEntidadesHijas($identidad, $security);
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
