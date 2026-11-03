<?php

class ClasificacionabcController extends ZendExt_Controller_Secure
{
    public function init()
    {
        parent::init();
        ini_set("max_execution_time", 3600); //3600 1hora
    }

    public function clasificacionabcAction()
    {
        $this->view->idioma = $this->global->Perfil->idioma;
        $this->render();
    }

    public function obtenerperiodosAction()
    {

        $obj = new Confperiodosclasificacionabc();
        $idestructura = $this->global->Estructura->idestructura;

        if ($this->global->Estructura->idorgano == -2) {
            $e = $this->integrator->metadatos->obtenerPadreEntidad($idestructura);
            if (count($e) > 0) {
                $idestructura = $e[0]->idestructura;
            } else {
                echo json_encode(array('datos' => array()));
                return false;
            }
        }
        $m = $obj->obtenerPeriodosClasificacionABC($idestructura);
        $objABC = new AbcModel();

        $r = array();
        foreach ($m as &$v) {
            if($v['analizar'] == 1) {
                $arrN = $objABC->obtenerLineasProductoBusqueda($v['idconfperiodosclasificacionabc']);
                $arrNat = array();
                $arIdNat = array();
                foreach ($arrN as $n){
                    $arrNat[] = $n['denominacion'];
                    $arIdNat[] = $n['idnaturaleza'];
                }
                $r = array('idconfperiodosclasificacionabc' => $v['idconfperiodosclasificacionabc'], 'periodo' => $v['fechainicio'] . ' - ' . $v['fechafin'], 'fechainicio' => $v['fechainicio'],
                    'fechafin' => $v['fechafin'], 'cerrado' => $v['cerrado'], 'naturalezas' => $arrNat, 'idnaturalezas' => $arIdNat,
                    'depositos' => json_decode(stripslashes($v['depositos'])));
                   
                break;
            } 
        } // print_r($r);die;
       return $r;
    } 

     public function obtenerUEBsAction()
    {
        $m = array();
        $m['codigo'] = 1;
        $m['success'] = true;
        $arrEstructura = array();
        $objABC = new AbcModel();
        $texto = '';
        $tipo = 2;

        /*Busco el periodo de clasificacion a analizar*/
        $p = $this->obtenerperiodosAction();
        $arrUEBSAnalizar = array();

        if(!empty($p['depositos'])){
            /*Busco las ueb a las que pertenecen los depositos configurados en el periodo a analizar*/
            $arrUEBSAnalizar = $objABC->obtenerUEBsPeriodoAnalizar($p['idconfperiodosclasificacionabc']);
        }

        $arrEstruct = array();
        if ($this->global->Estructura->idorgano == -2) {
            $arrEstruct[] = array('idestructura' => $this->global->Estructura->idestructura, 'denominacion' => $this->global->Estructura->denominacion);
            $texto = 'UEB: ' . $this->global->Estructura->denominacion;
        } else {
            $tipo = 1;
            $e = $objABC->obtenerUEBs($this->global->Estructura->idestructura, false);
            $texto = 'Entidad: ' . $this->global->Estructura->denominacion;
            if (count($e) > 0) {
                $arrEstruct = $e;
            } else {
                $m['codigo'] = 2;
                $m['success'] = false;
                $m['mensaje'] = "No existen las estructuras.";
            }
        }

        if(!empty($arrUEBSAnalizar)){
            foreach($arrUEBSAnalizar as $ea){
                foreach ($arrEstruct as $e){
                    if($e['idestructura'] == $ea['idestructura']){
                        $arrEstructura[] = $e;
                    }
                }
            }
        }

        if(!empty($arrEstructura)) {
            $m['uebs'] = $arrEstructura;
            $m['idestructura'] = $this->global->Estructura->idestructura;
            $m['estructura'] = $texto;
            $m['tipo'] = $tipo;
            $m['periodo'] = $p;
        }else{
            $m['codigo'] = 2;
            $m['success'] = false;
            $m['mensaje'] = "No existen las estructuras a analizar.";
        }

        echo json_encode($m);
    }

    public function obtenerUEBsBusquedaAction()
    {
        $m = array();
        $m['codigo'] = 1;
        $m['success'] = true;
        $arrEstructura = array();
        $objABC = new AbcModel();

        /*Busco el periodo de clasificacion a analizar*/
        $p = $this->obtenerperiodosAction();
        $arrUEBSAnalizar = array();

        if(!empty($p['depositos'])){
            /*Busco las ueb a las que pertenecen los depositos configurados en el periodo a analizar*/
            $arrUEBSAnalizar = $objABC->obtenerUEBsPeriodoAnalizar($p['idconfperiodosclasificacionabc']);

        }

        $arrEstruct = array();
        if ($this->global->Estructura->idorgano == -2) {
            $arrEstruct[] = array('idestructura' => $this->global->Estructura->idestructura, 'denominacion' => $this->global->Estructura->denominacion);
        } else {
            $e = $objABC->obtenerUEBs($this->global->Estructura->idestructura, false);
            if (count($e) > 0) {
                $arrEstruct = $e;
            } else {
                $m['codigo'] = 2;
                $m['success'] = false;
                $m['mensaje'] = "No existen las estructuras.";
            }
        }

        if(!empty($arrUEBSAnalizar)){
            foreach($arrUEBSAnalizar as $ea){
                foreach ($arrEstruct as $e){
                    if($e['idestructura'] == $ea['idestructura']){
                        $arrEstructura[] = $e;
                    }
                }
            }
        }

        echo json_encode(array('datos' => $arrEstructura));
    }


    public function obtenerclasificacionabcAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $idconf = $this->_request->getPost('idconf');
        $criterio = $this->_request->getPost('criterio');
        $idlineaproducto = $this->_request->getPost('idlineaproducto');
        $idestructura = $this->_request->getPost('idestructura');
        $idclasificacionabc = $this->_request->getPost('idclasificacionabc');
        $arrEst = json_decode(stripslashes($this->_request->getPost('uebs')));

        $r = array();
        if (empty($idconf)) {
            $r['datos'] = array();
            $r['cantidad'] = 0;
        } else {
            $obj = new Datclasificacionabcproductos();
            $r = $obj->obtenerClasificacionProducto($limit, $start, $idconf, $arrEst, $criterio, $idlineaproducto, $idestructura, $idclasificacionabc);
        }

        echo json_encode($r);
    }

    public function calcularValoresCriteriosporProductosAction()
    {
        $fechainicio = $this->_request->getPost('fechainicio');
        $fechafin = $this->_request->getPost('fechafin');
        $idconfperiodosclasificacionabc = $this->_request->getPost('idconf');
        $arrEstructura = json_decode(stripslashes($this->_request->getPost('uebs')));

        $m = array();
        $m['codigo'] = 1;$m['codigo'] = 1;


        $idestructura = $this->global->Estructura->idestructura;

        if ($this->global->Estructura->idorgano == -2) {
            $aE = $this->integrator->metadatos->obtenerPadreEntidad($idestructura, true);
            $idestructura = $aE[0]->idestructura;
        }
        $objPeriodo = new Confperiodosclasificacionabc();
        $rP = $objPeriodo->obtenerPeriodosClasificacionABCById($idconfperiodosclasificacionabc);
        if(empty($rP[0]['cerrado'])) {
            $objABC = new AbcModel();
            $m = $objABC->calcularValores($idestructura, $arrEstructura, $fechainicio, $fechafin, $idconfperiodosclasificacionabc);
        }else{
            $m['codigo'] = 3;
            $m['mensaje'] = 'El per&iacute;odo a analizar est&aacute; cerrado.';
        }
        echo json_encode($m);
    }

    public function clasificarProductosABCAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idconfperiodosclasificacionabc = $this->_request->getPost('idconf');
        $fechainicio = $this->_request->getPost('fechainicio');
        $fechafin = $this->_request->getPost('fechafin');
        $arrEstructura = json_decode(stripslashes($this->_request->getPost('uebs')));

        $m = array();
        $m['codigo'] = 1;

        $idestructura = $this->global->Estructura->idestructura;
        if ($this->global->Estructura->idorgano == -2) {
            $aE = $this->integrator->metadatos->obtenerPadreEntidad($idestructura, true);
            $idestructura = $aE[0]->idestructura;
        }
        $objPeriodo = new Confperiodosclasificacionabc();
        $rP = $objPeriodo->obtenerPeriodosClasificacionABCById($idconfperiodosclasificacionabc);
        if(empty($rP[0]['cerrado'])) {
            $objABC = new AbcModel();
            $m = $objABC->clasificarProductos($idestructura, $arrEstructura, $idconfperiodosclasificacionabc, $fechainicio, $fechafin);
        }else{
            $m['codigo'] = 3;
            $m['mensaje'] = 'El per&iacute;odo a analizar est&aacute; cerrado.';
        }
        echo json_encode($m);
    }

    public function obtenerlineasproductoAction()
    {
        $id = $this->_request->getPost('idconf');
        $objABC = new AbcModel();
        $r = $objABC->obtenerLineasProductoBusqueda($id);
        echo json_encode(array('datos' => $r));
    }
    public function obtenerDetallesClasificacionAction()
    {
        $id = $this->_request->getPost('id');
        $objABC = new AbcModel();
        $r = $objABC->obtenerDetallesClasificacionProducto($id);
        echo json_encode($r);
    }

    public function guardarClasificacionProductosModificadosAction()
    {
        $idconf = $this->_request->getPost('idconf');
        $idueb = $this->_request->getPost('idueb');
        $arrProd = json_decode(stripslashes($this->_request->getPost('prod')));
        $objPeriodo = new Confperiodosclasificacionabc();
        $rP = $objPeriodo->obtenerPeriodosClasificacionABCById($idconf);
        $r = array();
        if(empty($rP[0]['cerrado'])) {
            $objABC = new AbcModel();
            $r = $objABC->salvarClasificacionProductosModificados($idueb, $arrProd);
        }else{
            $r['codigo'] = 3;
            $r['mensaje'] = 'El per&iacute;odo a analizar est&aacute; cerrado.';
        }
        echo json_encode($r);
    }
    public function obtenernomclasificacionabcAction()
    {
        $obj = new Nomclasificacionabc();
        $r = $obj->obtenerClasificacionABC();
        $arr = array();
        foreach ($r as $c){
            $arr[] = array('idclasificacionabc' => $c['idclasificacionabc'], 'denominacion' => $c['denominacion']);
        }
        echo json_encode(array('datos' => $arr));
    }

    public function calcularClasificacionABCTotalAction()
    {
        $idconf = $this->_request->getPost('idconf');
        $arrEst = json_decode(stripslashes($this->_request->getPost('uebs')));
        $objPeriodo = new Confperiodosclasificacionabc();
        $rP = $objPeriodo->obtenerPeriodosClasificacionABCById($idconf);
        $r = array();
        if(empty($rP[0]['cerrado'])) {
            $obj = new AbcModel();
            $r = $obj->calcularyGuardarClasificacionABCTotal($idconf, $arrEst);
        }else{
            $r['codigo'] = 3;
            $r['mensaje'] = 'El per&iacute;odo a analizar est&aacute; cerrado.';
        }
        echo json_encode($r);
    }
    public function obtenerDetallesClasificacionABCAction()
    {
        $idconf = $this->_request->getPost('idconf');
        $arrEst = json_decode(stripslashes($this->_request->getPost('uebs')));

        $obj = new AbcModel();
        $r = $obj->obtenerDetallesClasificacionABC($idconf, $arrEst);
        echo json_encode($r);
    }
    public function obtenerParetoAction()
    {
        $tipo = $this->_request->getPost('tipo');
        $idconf = $this->_request->getPost('idconf');
        $idestructura = $this->_request->getPost('idestructura');
        $idnaturaleza = $this->_request->getPost('idnaturaleza');
        $idcriterio = $this->_request->getPost('idcriterio');

        $obj = new AbcModel();
        $r = $obj->obtenerPareto($tipo,$idconf, $idestructura, $idnaturaleza, $idcriterio);
        echo json_encode($r);
    }

}
