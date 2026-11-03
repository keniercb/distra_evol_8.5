<?php

require_once __DIR__ . '/../../planmeta/controllers/BpgestnivelesactividadController.php';

class BpgestnivelesactividadsisplaninversionesController extends BpgestnivelesactividadController {

    public function init() {
        parent::init();
    }

    public function listarActsNivActAction() {
        ini_set("max_execution_time", 600);
        $params = array();
        $params['esrector'] = $this->_request->getPost('esrector');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['columnasamostrar'] = json_decode(stripslashes($this->_request->getPost('columnsToShow')));
        $params['idmodelo'] = $this->_request->getPost('idmodelo');
        $params ['idaprobacion_actividad'] = array(3, 4);
        $params ['idEstructuraPadre'] = $this->_request->getPost('idEstructuraPadre');
        $params ['calcularrestoxdistrib'] = $this->_request->getPost('calcularrestoxdistrib');
        $global = ZendExt_GlobalConcept::getInstance();
        if ($this->_request->getPost('idespecialidad') != '') {
            $params['idespecialidad'] = $this->_request->getPost('idespecialidad');
        } else {
            $params['idespecialidad'] = $global->Estructura->idespecialidad;
        }

        $params['identidad'] = $this->_request->getPost('identidad');
        if ($params ['idEstructuraPadre'] == 'undefined') {
            $params ['idEstructuraPadre'] = $params['identidad'];
        }
        /* aki se guarda si se manda o no a calcular el importe */
        $params ['calcularimporte'] = $this->_request->getPost('calcularimporte');

        if ($params['idespecialidad'] != null && $params['identidad'] != null && $params['identidad'] != '0') {
            $arrayResFormatoUltimonivel = NomActividad::obtener_ConfFormato_UltimoNivel();
            $params ['nivel'] = $arrayResFormatoUltimonivel[1];

            if ($this->_request->getPost('codigo') != '') {
                $params ['codigo'] = $this->_request->getPost('codigo');
            }
            if ($this->_request->getPost('denominacion') != '') {
                $params ['denominacion'] = $this->_request->getPost('denominacion');
            }
            if ($this->_request->getPost('calcularimporte') != '') {
                $params ['calcularimporte'] = $this->_request->getPost('calcularimporte');
            }
            if ($this->_request->getPost('idaprobacion') != '') {
                $params ['idaprobacion'] = $this->_request->getPost('idaprobacion');
            }

            $params['filtros'] = $this->_request->getPost('filtros');
            $params['start'] = $this->_request->getPost('start');
            $params['limit'] = $this->_request->getPost('limit');

            $modelActEnt = new DatActividadentidadsisplaninversionesModel();
            $params['entidades_productoras'] = array('-1');
            $security = ZendExt_Aspect_Security_Sgis::getInstance();

            if ($params ['calcularrestoxdistrib'] == 'true') {
                $params['entidades_productoras'] = DatActividadentidad::auxObtenerEntidadesHijas($params['idEstructuraPadre'], $security);
            }

            if ($this->_request->getPost('glob') == 'false') {
                $params['identidad'] = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($params['identidad']);

                if ($params['identidad'][0] == null || $params['identidad'][0] == '' || !$params['identidad'][0]) {
                    $data->data = array();
                    $data->data[0]['idactividadentidad'] = -1;
                    echo json_encode($data);
                } else {
                    $params['identidad'] = $params['identidad'][0];
                    $params['entidades'] = array('0' => $params['identidad']);
                    $datosEntidad = $this->integrator->metadatos->DameEstructura($params['identidad']);
                    $params['id_especialidades'] [] = $datosEntidad [0]->idespecialidad;

                    if ($params['esrector'] == 'true') {
                        $params['idespecialidad'] = $datosEntidad [0]->idespecialidad;
                    }
                    $result = $modelActEnt->listarActsNivActPorEntidad($params);
                    if ($result == -1) {
                        $data->data = array();
                        echo json_encode($data);
                    } else {
                        echo json_encode($result);
                    }
                }
            } else {
                /* Consolidar niveles de actividad */
                $idestructura = $this->integrator->metadatos->DameEstructura($params['identidad']);
                $params['entidades'] = BpgestnivelesactividadController::auxObtenerEntidadesHijas($idestructura[0]->idestructura);
                array_push($params['entidades'], $idestructura[0]->idestructura);

                $var = implode(',', $params['entidades']);
                $params['entidades'] = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);
                if ($params['entidades'] [0] != null) {
                    $params['id_especialidades'] = array();
                    foreach ($params['entidades'] as $key => $valorIdentidad) {
                        $tempEspecialidades = 0;
                        $entidades[] = $this->integrator->metadatos->DameEstructura($valorIdentidad);

                        foreach ($params['id_especialidades'] as $esp) {
                            if ($esp == $entidades [$key][0]->idespecialidad) {
                                $tempEspecialidades = 1;
                            }
                        }
                        if ($tempEspecialidades == 0) {
                            $params['id_especialidades'] [] = $entidades [$key][0]->idespecialidad;
                        }
                    }

                    $result = $modelActEnt->listarActsNivActPorEntidad($params);
                    if ($result == -1) {
                        $data->data = array();
                        echo json_encode($data);
                    } else {
                        echo json_encode($result);
                    }
                } else {
                    $data->data = array();
                    $data->total = 0;
                    echo json_encode($data);
                }
            }
        } else {
            if ($params['identidad'] == '0' || $params['identidad'] == null) {
                $data->total = 0;
                echo json_encode($data);
            } else {
                echo json_encode(
                        array('codMsg' => 3,
                            'mensaje' => 'Su secci&oacute;n ha expirado, por favor reinicie el sistema. ')
                );
            }
        }
    }

    public function exportarNivelesActvAExcelAction() {
        ini_set("max_execution_time", 600);

        $params = array();
        $params['identidad'] = $this->_request->getParam('identidad');
        $params['idejercicio'] = $this->_request->getParam('idejercicio');
        $params['text'] = $this->_request->getParam('text');
        $params['is_leaf'] = $this->_request->getParam('is_leaf');
        $params['glob'] = $this->_request->getParam('glob');
        $params['esrector'] = $this->_request->getParam('esrector');
        $params ['idEstructuraPadre'] = $this->_request->getParam('idEstructuraPadre');
        $params ['calcularrestoxdistrib'] = $this->_request->getParam('calcularrestoxdistrib');
        $params ['calcularimporte'] = 'true';

        $params['columnasamostrar'] = array(
            0 => 'importe',
            1 => 'importeajustado',
            2 => 'importefinal'
        );

        $global = ZendExt_GlobalConcept::getInstance();
        if ($this->_request->getParam('idespecialidad') != '') {
            //temporal falta enviarlo en el GET
            $params['idespecialidad'] = $this->_request->getParam('idespecialidad');
        } else {
            $params['idespecialidad'] = $global->Estructura->idespecialidad;
        }

        if ($params ['idEstructuraPadre'] == 'undefined') {
            $params ['idEstructuraPadre'] = $params['identidad'];
        }

        if ($params['idespecialidad'] != null && $params['identidad'] != null && $params['identidad'] != '0'
        ) {
            $arrayResFormatoUltimonivel = NomActividad::obtener_ConfFormato_UltimoNivel();
            $params ['nivel'] = $arrayResFormatoUltimonivel[1];

            if (is_array(json_decode(stripslashes($this->_request->getParam('filtros'))))) {
                foreach (json_decode(stripslashes($this->_request->getParam('filtros'))) as $key => $datos) {
                    if ($datos->field == 'codigo' || $datos->field == 'denominacion' || $datos->field == 'denespecialidad' || $datos->field == 'descripcion' || $datos->field == 'idaprobacion' || $datos->field == 'denmodelo' || $datos->field == 'comportamiento') {
                        $params['filtros'][$key]['field'] = $datos->field;
                    } elseif ($datos->field == 'nivelactividadautomatico' || $datos->field == 'nivelactividadmanual' || $datos->field == 'nivelproyecto' || $datos->field == 'nivelinversion' || $datos->field == 'nivelactividadproduccion' || $datos->field == 'nivelactividad' || $datos->field == 'restoxdistrib' || $datos->field == 'ajuste' || $datos->field == 'nivelactividadajuste' || $datos->field == 'importe' || $datos->field == 'importeajustado' || $datos->field == 'importefinal') {
                        $params['filtros'][$key]['field'] = $datos->field;
                        $params['filtros'][$key]['data']['comparison'] = $datos->data->comparison;
                    }
                    if (is_array($datos->data->value)) {
                        $params['filtros'][$key]['data']['value'] = $datos->data->value[0];
                    } else {
                        $params['filtros'][$key]['data']['value'] = $datos->data->value;
                    }
                }
            }

            $params['entidades_productoras'] = array('-1');
            $security = ZendExt_Aspect_Security_Sgis::getInstance();

            if ($params ['calcularrestoxdistrib'] == 'true') {
                $params['entidades_productoras'] = DatActividadentidad::auxObtenerEntidadesHijas($params['idEstructuraPadre'], $security);
            }
            $modelActEnt = new DatActividadentidadsisplaninversionesModel();
            $modelActEnt->exportarAExcel($params);
        }
    }

   /* public function cargarImporteInicialAction() {
        $parametros['idejercicio'] = $this->_request->getParam('idejercicio');
        $parametros['identidad'] = $this->_request->getParam('identidad');
        $parametros['arrayidactividad'] = json_decode(stripslashes($this->_request->getParam('arrayidactividad')));

        $modelActEnt = new DatActividadentidadsisplaninversionesModel();
        $resultado = $modelActEnt->cargarImporteInicial($parametros);
        $resultadoDos = number_format($resultado, '3', '.', ',');
        echo json_encode(array('importe' => $resultado, 'importeformato' => $resultadoDos));
    }

    public function calcularAjusteAction() {
        $parametros['idejercicio'] = $this->_request->getParam('idejercicio');
        $parametros['identidad'] = $this->_request->getParam('identidad');
        $parametros['arrayidactividad'] = json_decode(stripslashes($this->_request->getParam('arrayidactividad')));
        $parametros['porcientoajuste'] = $this->_request->getParam('porciento');

        $modelActEnt = new DatActividadentidadsisplaninversionesModel();
        $resultado = $modelActEnt->calcularAjuste($parametros);
        $resultadoDos = number_format($resultado, '3', '.', ',');
        echo json_encode(array('importe' => $resultado, 'importeformato' => $resultadoDos));
    }

    public function insertarAjusteNivelAction() {
        $parametros['idejercicio'] = $this->_request->getParam('idejercicio');
        $parametros['identidad'] = $this->_request->getParam('identidad');
        $parametros['arrayidactividad'] = json_decode(stripslashes($this->_request->getParam('arrayidactividad')));

        $modelActEnt = new DatActividadentidadsisplaninversionesModel();
        $modelActEnt->insertarAjusteNivel($parametros);
        echo '1';
    }*/

    public function exportarCalculoNivelesActvAExcelAction() {
        ini_set("max_execution_time", 600);

        $params = array();
        $params['identidad'] = $this->_request->getParam('identidad');
        $params['idejercicio'] = $this->_request->getParam('idejercicio');
        $params['is_leaf'] = $this->_request->getParam('is_leaf');
        $params['idactividad'] = json_decode(stripslashes($this->_request->getParam('idactividades')));

        $modelActEnt = new DatActividadentidadsisplaninversionesModel();
        $modelActEnt->exportarCalculoAExcel($params);
    }

}
