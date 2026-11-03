<?php

/**
 * DesgloseindicadoresporfechaController
 * Controlador para gestionar los desgloses por fecha
 *
 * @ author
 * @ package Planificaci?n
 * @ subpackage Planificaci?n Empresarial y Presupuestaria
 * @ copyright Planificacion
 * @ version 1.0-0
 * */
class DistribucionplanfarController extends ZendExt_Controller_Secure
{

    public function init()
    {
        $this->_meta = ZendExt_Metadata::getInstance();
        parent::init();
    }
    
    public function cargarUsuariosAction() {
        $users = $this->integrator->seguridad->getAllUsers();
        echo json_encode(array("data" => $users));
    }

    public function distribucionplanfarAction()
    {

        $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->jsestructura = $jsestructura;
        $this->view->jsayuda = $jsayuda;
        $this->render();
    }

    /*     * Ejercicio actual y la lista de ejecicios
     */

    public function getEjerciciosAction()
    {
        $data = null;
//        $data->data = $this->pIntegrator->planmeta->obtenerEjercicios();
//        $data->idejercicioactual = $this->pIntegrator->planmeta->obtenerEjercicioActual();
        
        $parametros['tipoplan'] = 1255;

        ini_set("max_execution_time", 3600); //1hora
        //Creando el modelo de negocio de gestion de usuarios.
        $modeloplan = new DatPlan711Model();
        $data->data = $modeloplan->listarPlanes711($parametros);
        echo json_encode($data);
    }


    public function listarDatosAction()
    {
        $uri= $this->_request->getPost('uri');
        $modelPlan = new DatPlan711Model();
        $data = $modelPlan->listarDatos($uri);
        $resul = array();
        foreach ($data as $value) {
            //if ($value['denominacion'] == 'Tecnoimport') {
                $resul[] = $value;
            //}
        }
        $data = $resul;
        echo json_encode(array("data" => $data));
    }

    public function MontoTotalAction()
    {
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['idempimp'] = $this->_request->getPost('idempimp');
        $parametros['idcc'] = $this->_request->getPost('idcc');
        $parametros['idff'] = $this->_request->getPost('idff');

        $modeldist = new DatDistribucionModel();
        $data = $modeldist->MontoTotal($parametros);
        echo json_encode(array("data" => $data));
    }

    public function listarCCAction()
    {
        $valor->uri = 'CCFar';

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

    public function listarMontoDisponibleAction()
    {
        $valor;
        $paramestros['idejercicio'] = $this->_request->getPost('idejercicio');
        $paramestros['idempimp'] = $this->_request->getPost('idempimp');
        $paramestros['idplan711'] = $this->_request->getPost('idplan711');        
        $modeloplanes = new DatPlan711Model();
        $data = $modeloplanes->listarMontoDisponibleFar($paramestros);
            
        echo json_encode(array("data" => $data['data'], "total" => count($data['data']), "montototaldisponible" => $data['montototal'], "montototalreal" => $data['montototalreal']));
    }

    public function listarDistribucionAction()
    {
        $valor;
        $paramestros['idempimp'] = $this->_request->getPost('idempimp');
        $paramestros['idejercicio'] = $this->_request->getPost('idejercicio');
        $paramestros['identidad'] = $this->_request->getPost('identidad');
        $paramestros['idplan711'] = $this->_request->getPost('idplan711');  
        $modeloplanes = new DatPlan711Model();
        $data = $modeloplanes->listarDistribucion($paramestros);
        
        echo json_encode(array("data" => $data['data'], "total" => count($data['data']), "band"=>$data['band']));
    }

    public function listarCodigoAction()
    {
        $valor;
        $paramestros['idempimp'] = $this->_request->getPost('idempimp');
        $paramestros['idejercicio'] = $this->_request->getPost('idejercicio');
        $paramestros['identidad'] = $this->_request->getPost('identidad');
        $cont = 0;
        $data = array();      
        $modelodistr = new DatCodigodeCCModel();
        $resultados3 = $modelodistr->listarCodigo($paramestros);
        if (!is_null($resultados3)) {
            for ($i = 0; $i < count($resultados3); $i++) {
                $data[$cont]['denominacion'] = 'Credito financiero';
                $data[$cont][$resultados3[$i]['iddatoscc']] = $resultados3[$i]['codigo'];
                $data[$cont][$resultados3[$i + 1]['iddatoscc']] = $resultados3[$i + 1]['codigo'];
                $i++;
                $cont++;
            }
        }
        echo json_encode(array("data" => $data));
    }

    public function adicionarModificarDistrAction()
    {
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['idempimp'] = $this->_request->getPost('idempimp');
        $parametros['idplan711'] = $this->_request->getPost('idplan711');
        $parametros['motivo'] = $this->_request->getPost('textomotivo');
        $distribuc = json_decode($this->_request->getPost('distribuc'), true);
        
        if (!is_null($parametros['motivo'])) {
            $parametros['usuario'] = $this->global->Perfil->usuario;
            $parametros['tipo'] = 2;
            $modelmotivo = new DatMotivoModificacionModel();
            $salida = $modelmotivo->AdicionarMotivo($parametros);
        }

        $modelodistr = new DatDistribucioncodentidadModel();
        $result = $modelodistr->adicionarModificarDistr($parametros, $distribuc);
        
        echo json_encode(array("mensaje" => $result));
    }

}
