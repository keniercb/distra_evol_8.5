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
class DistribucionplanController extends ZendExt_Controller_Secure
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

    public function distribucionplanAction()
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
        
        $parametros['tipoplan'] = 1254;

        ini_set("max_execution_time", 3600); //1hora
        //Creando el modelo de negocio de gestion de usuarios.
        $modeloplan = new DatPlan711Model();
        $data->data = $modeloplan->listarPlanes711($parametros);
        echo json_encode($data);
    }


    public function listarDatosAction()
    {
        $uri = $this->_request->getPost('uri');

        $modelPlan = new DatPlan711Model();
        $data=$modelPlan->listarDatos($uri);
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

    public function listarMontoDisponibleAction()
    {
        $valor;
        $paramestros['idejercicio'] = $this->_request->getPost('idejercicio');
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
                        //$data[$cont][$resultados2[$index2]['uridatosnomenclador']] = 0;
                    }
                }
                $cont++;
            }
        }
        $modeloplanes = new DatPlan711Model();
        $paramestros['uri'] = $valor->uri;
        $resultados3 = $modeloplanes->listarMontoDisponible($paramestros);
        $montodisponible = 0;
        for ($index2 = 0; $index2 < count($resultados2); $index2++) {
            if ($resultados2[$index2]['denominacion'] != '-') {
                for ($index = 0; $index < count($data); $index++) {
                    for ($i = 0; $i < count($resultados3); $i++) {
                        if ($resultados3[$i]['iddatoscc'] == $resultados2[$index2]['iddatosnomenclador'] && $data[$index]['iddatosff'] == $resultados3[$i]['iddatosff']) {
                            //$data[$index][$resultados2[$index2]['iddatosnomenclador']] = $resultados3[$i]['monto'] - $resultados3[$i]['totaldistribuido'];
                            $data[$index][$resultados2[$index2]['iddatosnomenclador']] = bcsub($resultados3[$i]['monto'], $resultados3[$i]['totaldistribuido'], 6);
                            $data[$index][$resultados2[$index2]['uridatosnomenclador']] = $resultados3[$i]['monto'];
                            $montodisponible += bcsub($resultados3[$i]['monto'], $resultados3[$i]['totaldistribuido'], 6);
                            //$montodisponible += $resultados3[$i]['monto'] - $resultados3[$i]['totaldistribuido'];
                            $montodisponiblereal += $resultados3[$i]['monto'];
                        }
                    }
                }
            }
        }
        
        echo json_encode(array("data" => $data, "total" => count($data), "montototaldisponible" => $montodisponible, "montodisponiblereal" => $montodisponiblereal));
    }

    public function listarDistribucionAction()
    {
        $paramestros['idempimp'] = $this->_request->getPost('idempimp');
        $paramestros['idejercicio'] = $this->_request->getPost('idejercicio');
        $paramestros['identidad'] = $this->_request->getPost('identidad');
        $cont = 0;
        $data = array();
        $modelonomenclador = new NomDatosnomenclador();
        $valor->uri = 'FuentesdeFinanciamiento';
        $resultados1 = $modelonomenclador->getDatosNomPorUriTipoNomIdestado($valor);
        $valor->uri = 'Conceptodecompra';
        $resultados2 = $modelonomenclador->getDatosNomPorUriTipoNomIdestado($valor);
        $band=0;
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
        $modelodistr = new DatDistribucionModel();
        $paramestros['uri'] = $valor->uri;
        $resultados3 = $modelodistr->listarDistribucion($paramestros);
        if (!is_null($resultados3)) {
            for ($index2 = 0; $index2 < count($resultados2); $index2++) {
                if ($resultados2[$index2]['denominacion'] != '-') {
                    for ($index = 0; $index < count($data); $index++) {
                        for ($i = 0; $i < count($resultados3); $i++) {
                            if ($resultados3[$i]['iddatoscc'] == $resultados2[$index2]['iddatosnomenclador'] && $data[$index]['iddatosff'] == $resultados3[$i]['iddatosff']) {
                                $data[$index][$resultados3[$i]['iddatoscc']] = $resultados3[$i]['monto'];
                                $band=1;
                            }
                        }
                    }
                }
            }
        }
        echo json_encode(array("data" => $data, "band"=>$band,"total" => count($data)));
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
                $data[$cont]['denominacion'] = 'Crédito financiero';
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
        $parametros['motivo'] = $this->_request->getPost('textomotivo');
        $idplan = $plan = Doctrine::getTable('DatPlan711')
            ->findByDql("idejercicio= {$parametros['idejercicio']}");;
        $distribuc = json_decode($this->_request->getPost('distribuc'), true);
        
        $modelonomenclador = new NomDatosnomenclador();
        $valor->uri = 'Conceptodecompra';
        $resultados2 = $modelonomenclador->getDatosNomPorUriTipoNomIdestado($valor);
        $valor->uri = 'FuentesdeFinanciamiento';
        $resultados1 = $modelonomenclador->getDatosNomPorUriTipoNomIdestado($valor);
        $arrayaux = array();
        $cont = 0;
        for ($i = 0; $i < count($resultados2); $i++) {
            if ($resultados2[$i]['denominacion'] != '-') {
                for ($index1 = 0; $index1 < count($distribuc); $index1++) {
                    $arrayaux[$cont]['idplan711'] = $idplan[0]->idplan711;
                    $arrayaux[$cont]['iddatosff'] = $distribuc[$index1]['iddatosff'];
                    $arrayaux[$cont]['iddatoscc'] = $resultados2[$i]['iddatosnomenclador'];
                    $arrayaux[$cont]['monto'] = floatval(str_replace(',','',$distribuc[$index1][$resultados2[$i]['iddatosnomenclador']]));
                    $cont++;
                }
            }
        }
        $band = true;
        $ff = 0;
        $cc = 0;
        $modelodistr = new DatDistribucionModel();
        $resultados3 = $modelodistr->listarDistribucion($parametros);
        $modeloplanes = new DatPlan711Model();
            $parametros['uri'] = $valor->uri;
            $resultados4 = $modeloplanes->listarMontoDisponible($parametros);
            
        if (count($resultados3)>0) {
            foreach ($arrayaux as $value1) {
                foreach ($resultados4 as $value2) {
                   foreach ($resultados3 as $value3) {
                       if ($value1['iddatosff'] == $value2['iddatosff'] && $value1['iddatosff'] == $value3['iddatosff'] && $value1['iddatoscc'] == $value2['iddatoscc']
                               && $value1['iddatoscc'] == $value3['iddatoscc']) {
                            if (($value1['monto']-$value3['monto']) > ($value2['monto'] - $value2['totaldistribuido'])) {
                                $band = false;
                                $ff = $value['iddatosff'];
                                $cc = $value['iddatoscc'];
                            }
                       }
                   }
                }
            }
            
        }else{
            foreach ($arrayaux as $value) {
                foreach ($resultados4 as $value2) {
                    if ($value['iddatosff'] == $value2['iddatosff'] && $value['iddatoscc'] == $value2['iddatoscc']) {
                        if ($value['monto'] > ($value2['monto'] - $value2['totaldistribuido'])) {
                            $band = false;
                            $ff = $value['iddatosff'];
                            $cc = $value['iddatoscc'];
                        }
                    }
                }
            }
        }
        if ($band == false) {
            foreach ($resultados1 as $value) {
                if ($value['iddatosnomenclador'] == $ff) {
                    $aux1 = $value['denominacion'];
                }
            }
            foreach ($resultados2 as $value) {
                if ($value['iddatosnomenclador'] == $cc) {
                    $aux2 = $value['denominacion'];
                }
            }
            $result = 'El valor distribuido en la  fuente de financimiento ' . $aux1 . ' por el concepto de compra ' . $aux2 . ' supera la disponibilidad actual planificada';
            echo json_encode(array("mensaje" => $result));
        
        } else {
            if(!is_null($parametros['motivo'])){
                $parametros['usuario'] = $this->global->Perfil->usuario;
                $parametros['tipo'] = 2;
                $modelmotivo = new DatMotivoModificacionModel();
                $salida = $modelmotivo->AdicionarMotivo($parametros);
            }
            $modelodistr = new DatDistribucionModel();
            $result = $modelodistr->adicionarModificarDistr($parametros, $distribuc);

            echo json_encode(array("mensaje" => $result));
        }
    }

    public function adicionarModificarCreditoFinancieroAction()
    {
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['idempimp'] = $this->_request->getPost('idempimp');
        $parametros['credito'] = json_decode($this->_request->getPost('credito'), true);
        $parametros['accion'] = $this->_request->getPost('accion');
        
//        $credito = get_object_vars($parametros['credito'][0]);
//        $arrayKeys = array_keys($credito);
//        $arrayCredito = [];
//        $cod = 1;
//        foreach ($arrayKeys as $key) {
//            if ($key != 'denominacion') {
//                $codigo = trim($credito[$key]);
//                if (!empty($codigo)) {
//                    $data ['codigo'] = $codigo;
//                    $data['iddatoscc'] = $key;
//                    array_push($arrayCredito, $data);
//                } else $cod = 8;
//            }
//        }
//
//        if (count($arrayCredito) == 0) $cod = 5;
//        else if (empty($parametros['idejercicio'])) $cod = 2;
//        else if (empty($parametros['identidad'])) $cod = 3;
//        else if (empty($parametros['idempimp'])) $cod = 4;
//        else if ($cod != 1 && $cod != 8) {
//            echo json_encode(array("mensaje" => $cod));
//        } else {
//            $parametros['credito'] = $arrayCredito;
            if($parametros['accion'] ==2){
                $aux= array();
                $cont=0;
                $modelonomenclador = new NomDatosnomenclador();
                $valor->uri = 'Conceptodecompra';
                $resultados2 = $modelonomenclador->getDatosNomPorUriTipoNomIdestado($valor);
                foreach ($resultados2 as $value) {
                    if($value['denominacion']!='-'){
                        foreach ($parametros['credito'] as $v2){
                            if($v2[0][$value['iddatosnomenclador']] && $v2[1][$value['iddatosnomenclador']]){
                                $aux[$cont]['dtv']=$v2[1][$value['iddatosnomenclador']];
                                $aux[$cont]['dtn']=$v2[0][$value['iddatosnomenclador']];
                                $aux[$cont]['idcc']=$value['iddatosnomenclador'];
                                $cont++;
                            }
                        }
                    }
                }
                $parametros['credito']=$aux;
            }
//            $plan = Doctrine::getTable('DatPlan711')
//                        ->findByDql("idejercicio= {$parametros['idejercicio']}");
            //if (isset($plan[0])) {
                $modeloCod = new DatCodigodeCCModel();
                $parametros['idplan'] = $parametros['idejercicio'];
                $result = $modeloCod->adicionarModificarCreditoFinanciero($parametros);
                //if ($cod == 1) {
                    echo json_encode(array("mensaje" => $result));
                //} else {
                    //echo json_encode(array("mensaje" => $cod));
                //}

//            } else {
//                $cod = 6;
//                echo json_encode(array("mensaje" => $cod));
//            }
        //}
    }
    
    public function listarModifAction()
    {

        $modelomodif = new DatMotivoModificacionModel();
        $paramestros['identidad'] = $this->_request->getPost('identidad');
        $paramestros['idejercicio'] = $this->_request->getPost('idejercicio');
        $paramestros['tipo'] = 2;
        $data = $modelomodif->listarModif($paramestros);
        echo json_encode(array("data" => $data, "total" => count($data)));
    }

}
