<?php

require_once __DIR__ . '/../../planmeta/controllers/ConfigurarejercicioController.php';

class ConfigurarplanController extends ConfigurarejercicioController {

    private $auxgridsalva = array();
    private $cont = 0;

    public function init() {
        parent::init();
        $this->_meta = ZendExt_Metadata::getInstance();
    }

    public function configurarplanAction() {
        $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->jsestructura = $jsestructura;
        $this->render();
    }

    public function listarPlanes711Action() {
        $parametros['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $parametros['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $parametros['tipoplan'] = 1254;
        $parametros['filtros'] = $this->_request->getPost('filtros');

        ini_set("max_execution_time", 3600); //1hora
        //Creando el modelo de negocio de gestion de usuarios.
        $modeloplan = new DatPlan711Model();
        $data = $modeloplan->listarPlanes711($parametros);
        echo json_encode(array("data" => $data, "total" => count($data)));
    }

    public function listarCCAction() {

        $valor->uri = 'Conceptodecompra';
        $data = array();
        $modelonomenclador = new NomDatosnomenclador();
        $data = $modelonomenclador->getDatosNomPorUriTipoNomIdestado($valor);
//        for ($index = 0; $index < count($resultados); $index++) {
//            if ($resultados[$index]['denominacion'] != '-') {
//                $resultados[$index]['iddatos'] = $resultados[$index]['iddatosnomenclador'];
//                $data[] = $resultados[$index];
//            }
//        }
        echo json_encode(array("data" => $data));
    }

    public function listarFFyCCAction() {
        $valor;
        $paramestros['accion'] = $this->_request->getPost('accion');
        $paramestros['idejercicio'] = $this->_request->getPost('idejercicio');
        $paramestros['idplan711'] = $this->_request->getPost('idplan711');
        $paramestros['idempimp'] = $this->_request->getPost('idempimp');
        $cont = 0;
        $data = array();
        $modelonomenclador = new NomDatosnomenclador();
        $valor->uri = 'FuentesdeFinanciamiento';
        $resultados1 = $modelonomenclador->getDatosNomPorUriTipoNomIdestado($valor);
        $valor->uri = 'Conceptodecompra';
        $resultados2 = $modelonomenclador->getDatosNomPorUriTipoNomIdestado($valor);
        for ($index1 = 0; $index1 < count($resultados1); $index1++) {
            if ($resultados1[$index1]['denominacion'] != '-') {
                $data[$cont]['iddatosff'] = $resultados1[$index1]['iddatosnomenclador'];
                $data[$cont]['denominacionff'] = $resultados1[$index1]['denominacion'];
                $data[$cont]['asociado'] = FALSE;
                for ($index2 = 0; $index2 < count($resultados2); $index2++) {
                    if ($resultados1[$index2]['denominacion'] != '-') {
                        $data[$cont][$resultados2[$index2]['iddatosnomenclador']] = 0;
                    }
                }
                $cont++;
            }
        }
        $totalimp = 0;
        if (!is_null($paramestros['accion'])) {
            $modeloplanes = new DatPlan711Model();
            $paramestros['uri'] = $valor->uri;
            $resultados3 = $modeloplanes->listarFFyCC($paramestros);
            for ($index2 = 0; $index2 < count($resultados2); $index2++) {
                if ($resultados2[$index2]['denominacion'] != '-') {
                    for ($index = 0; $index < count($data); $index++) {
                        for ($i = 0; $i < count($resultados3); $i++) {
                            if ($resultados3[$i]['iddatoscc'] == $resultados2[$index2]['iddatosnomenclador'] && $data[$index]['iddatosff'] == $resultados3[$i]['iddatosff']) {
                                $data[$index][$resultados3[$i]['iddatoscc']] = $resultados3[$i]['monto'];
                                $totalimp += $resultados3[$i]['monto'];
                            }
                        }
                    }
                }
            }
        }
        echo json_encode(array("data" => $data, "total" => count($data), "totalimport" => $totalimp));
    }

    public function adicionarModificarPlanAction() {
        //var_dump('aa'); die;
        $paramestros['idejercicio'] = $this->_request->getPost('ejercicio');
        $paramestros['montototal'] = $this->_request->getPost('montototal');
        $distribuc = json_decode($this->_request->getPost('distribuc'), true);
        //$paramsejerc->ejercicioactual = ($this->_request->getParam('planactual') == 'true') ? 1 : 0;
        $paramestros['idempimp'] = $this->_request->getPost('idempimp');
        $accion = $this->_request->getPost('accion');
        //este sirve para contar la cantidad de salvas que se han hecho
        $contarsalvas = $this->_request->getPost('contarsalvas');
        //print_r($distribuc); die;
        //este param viene si es modificicacion        
        $paramestros['idp711'] = $this->_request->getPost('idp711');

        $paramsejerc->accion = $accion;
        $modelosplan = new DatPlan711Model();

        $modelonomenclador = new NomDatosnomenclador();
        $paramestros['tipoplan'] = 1254;
        if ($paramestros['tipoplan'] == 1254) {
            $valor->uri = 'Conceptodecompra';
            $paramsejerc->denom = $paramsejerc->denominacion;
            $paramsejerc->denominacion = $paramsejerc->denominacion . 'E';
        }
        if ($paramestros['tipoplan'] == 1255) {
            $valor->uri = 'CCFar';
            $paramsejerc->denom = $paramsejerc->denominacion;
            $paramsejerc->denominacion = $paramsejerc->denominacion . 'F';
        }
        $resultados2 = $modelonomenclador->getDatosNomPorUriTipoNomIdestado($valor);
        $arrayaux = array();
        $montodist = 0;
        $cont = 0;
        for ($i = 0; $i < count($resultados2); $i++) {
            if ($resultados2[$i]['denominacion'] != '-') {
                for ($index1 = 0; $index1 < count($distribuc); $index1++) {
                    for ($index2 = 0; $index2 < count($distribuc[$index1][0]); $index2++) {
                        $arrayaux[$cont]['idplan711'] = $idplan;
                        $arrayaux[$cont]['iddatosff'] = $distribuc[$index1][0][$index2]['iddatosff'];
                        $arrayaux[$cont]['iddatoscc'] = $resultados2[$i]['iddatosnomenclador'];
                        $arrayaux[$cont]['monto'] = floatval(str_replace(',', '', $distribuc[$index1][0][$index2][$resultados2[$i]['iddatosnomenclador']]));
                        $arrayaux[$cont]['iddatosempimp'] = $distribuc[$index1][1];
                        $cont++;
                        $montodist += floatval(str_replace(',', '', $distribuc[$index1][0][$index2][$resultados2[$i]['iddatosnomenclador']]));
                    }
                }
            }
        }        
        if(bcsub(floatval($paramestros['montototal']), floatval($montodist), 6)==0.000000){
            if ($accion == 1) {
                $resp = $modelosplan->adicionarPlan($paramestros, $paramestros['idejercicio'], $arrayaux);
                echo json_encode(array('mensaje' => $resp));
            } else {
                $resp = $modelosplan->modificarPlan($paramestros, $arrayaux);
                $result = $plan = Doctrine::getTable('DatPlan711')
                        ->find($paramestros['idp711']);
                $paramestros['idejercicio'] = $result->idejercicio;
                $paramestros['usuario'] = $this->global->Perfil->usuario;
                $modelmotivo = new DatMotivoModificacionModel();
                $paramestros['tipo'] = 1;
                $paramestros['motivo'] = $this->_request->getPost('motivo');
                $salida = $modelmotivo->AdicionarMotivo($paramestros);
                echo json_encode(array('mensaje' => 1));
            }
        }else{
            $montosinasignar = bcsub(floatval($paramestros['montototal']), floatval($montodist), 6);
            echo json_encode(array('mensaje' => 'La suma de la distribución no es igual al monto asignado, error en monto de: '.$montosinasignar));
        }
    }

    public function SalvarGridAction() {
        $distribuc = json_decode($this->_request->getPost('distribuc'), true);
        $paramestros['idempimp'] = $this->_request->getPost('idempimp');

        //if(empty($this->auxgridsalva)){
        $this->auxgridsalva[$this->cont]['datos'] = $distribuc;
        $this->auxgridsalva[$this->cont]['idempimp'] = $paramestros['idempimp'];
        $this->cont++;
        //var_dump($this->auxgridsalva); die;
        //}
        echo json_encode(array('mensaje' => 1));
    }

    public function listarModifAction() {

        $modelomodif = new DatMotivoModificacionModel();
        $paramestros['idplan711'] = $this->_request->getPost('idplan711');
        $paramestros['idejercicio'] = $this->_request->getPost('idejercicio');
        $paramestros['tipo'] = 1;
        $data = $modelomodif->listarModif($paramestros);
        echo json_encode(array("data" => $data, "total" => count($data)));
    }

    public function cambiarEstadoAction() {
        $paramestros['idejercicio'] = $this->_request->getParam('idejercicio');
        $paramestros['estado'] = $this->_request->getParam('estado');
        $modelosplan = new DatPlan711Model();
        $result = $modelosplan->cambiarEstado($paramestros);
        echo json_encode(array('mensaje' => $result));
    }

    public function EliminarPlanAction() {
        $paramestros['idplan711'] = $this->_request->getParam('idplan711');
        $modelosplan = new DatPlan711Model();
        $result = $modelosplan->EliminarPlan($paramestros);
        echo json_encode(array('mensaje' => $result));
    }

    public function cargarUsuariosAction() {
        $users = $this->integrator->seguridad->getAllUsers();
        echo json_encode(array("data" => $users));
    }

    public function listarDatosAction() {
        $uri = $this->_request->getPost('uri');
        $tipoplan = $this->_request->getPost('tipoplan');
        $modelPlan = new DatPlan711Model();
        $data = $modelPlan->listarDatos($uri);
        if ($tipoplan == 1255) {
            $resul = array();
            foreach ($data as $value) {
                if ($value['denominacion'] == 'Tecnoimport') {
                    $resul[] = $value;
                }
            }
            $data = $resul;
        }
        if ($uri == 16) {
            $resul = array();
            foreach ($data as $value) {
                if ($value['denominacion'] != 'Plan FAR') {
                    $resul[] = $value;
                }
            }
            $data = $resul;
        }

        echo json_encode(array("data" => $data));
    }

    public function listarEjercAction() {
        $parametros['tipoplan'] = 1254;
        $parametros['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $parametros['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $parametros['filtros'] = null;
        $planessisplan = new ConfigurarejercicioModel();
        $annossisplan = $planessisplan->obtenerListadoEjercicios($parametros);
        //print_r($annossisplan->data); die;
        $modeloplan = new DatPlan711Model();
        $arrEjercicios = $modeloplan->listarPlanes711($parametros);
        $salida = array();
        $cont = 0;
        foreach ($annossisplan->data as $val) {
            $band = false;
            foreach ($arrEjercicios as $value) {
                if ($value['idejercicio'] == $val['idejercicio']) {
                    $band = true;
                }
            }
            if ($band == false) {
                $salida[$cont]['ejercicio'] = $val['ejercicio'];
                $salida[$cont]['idejercicio'] = $val['idejercicio'];
                $cont++;
            }
        }
        echo json_encode(array("data" => $salida, "total" => 1));
    }

}
