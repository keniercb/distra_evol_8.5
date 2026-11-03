<?php

class RecursosController extends ZendExt_Controller_Secure {

    function init() {
        parent::init();
    }

    function recursosAction() {
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }

    function todosrecursosAction() {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        if($this->_request->getPost('denom') != ''){
            $denom = $this->_request->getPost('denom');
            $objRecurso = new DatEvalrecursoevaluativo();
            $r['datos'] = $objRecurso->buscarDenominacion($denom,$limit,$start);
            $r['cantidad'] = $objRecurso->cantDenominacion($denom);
        }else{
            $objRecurso = new DatEvalrecursoevaluativo();
            $r['datos'] = $objRecurso->GetPorLimite($limit, $start);
            $r['cantidad'] = $objRecurso->GetCantTotal();
        }
        echo (json_encode($r));
    }

    function adicionarrecursoAction() {
        $objRecurso = new DatEvalrecursoevaluativo();        
        $objRecurso->denom = $this->_request->getPost('denom');
        $objRecurso->descripcion = $this->_request->getPost('heDescripcion');
        $objRecurso->fechainicio = $this->_request->getPost('fechainicio');
        if ($this->_request->getPost('fechafin') == '')
            $ff = null;
        else
            $ff = $this->_request->getPost('fechafin');
        $objRecurso->fechafin = $ff;
        $model = new DatEvalrecursoevaluativoModel();
        $model->Insertar($objRecurso);
        $r->rcodMsg = 1;
        $r->mensaje = "El recurso evaluativo ha sido adicionado satisfactoriamente.";

        echo (json_encode($r));
    }

    function modificarrecursoAction() {
        $idrecursoevaluativo = $this->_request->getPost('idrecurso');
        $objRecurso = Doctrine::getTable('DatEvalrecursoevaluativo')->find($idrecursoevaluativo);

        $objRecurso->denom = $this->_request->getPost('denom');
        $objRecurso->descripcion = $this->_request->getPost('heDescripcion');
        $objRecurso->fechainicio = $this->_request->getPost('fechainicio');
        if ($this->_request->getPost('fechafin') == '')
            $ff = null;
        else
            $ff = $this->_request->getPost('fechafin');
        $objRecurso->fechafin = $ff;
        $objRecursoModel = new DatEvalrecursoevaluativoModel();
        $objRecursoModel->Actualizar($objRecurso);
        $r->rcodMsg = 1;
        $r->mensaje = "El recurso evaluativo ha sido modificado satisfactoriamente.";
        echo (json_encode($r));
    }

    function eliminarrecursoAction() {
        try{
        $idrecursoevaluativo = $this->_request->getPost('idrecurso');
        $objRecurso = Doctrine::getTable('DatEvalrecursoevaluativo')->find($idrecursoevaluativo);
        $objRecursoModel = new DatEvaldominioevaluativoModel();
        $objRecursoModel->Eliminar($objRecurso);
        $r->rcodMsg = 1;
        $r->exception = 0;
        $r->mensaje = "El recurso evaluativo ha sido eliminado satisfactoriamente.";
        echo (json_encode($r));
    }  catch (Exception $e) {
            if($e->getCode() == 23503) {//Code for foreignKeyViolation
                $r->exception = 1;
                echo (json_encode($r));
            }else{
                echo (json_encode($e->getMessage()));
            }
        }

    }

    function cargardominioEAction() {
        if($this->_request->getPost('denom') != ''){
            $denom = $this->_request->getPost('denom');
            $idrecursoevaluativo = $this->_request->getPost('idrecurso');
            $objDominio = new DatEvaldominioevaluativo();
            $r = $objDominio->buscarDominioEvaluativo($denom, $idrecursoevaluativo);
            $v = null;
            $nodos = array();
            if (count($r) > 0){
                foreach ($r as $v){
                    $nodos[] = array('id' => $v['iddominioevaluativo'], 'text' => $v['denom'], 'descripcion' => $v['descripcion'], 'idpadre' => $v['idpadre']);
                }
            }
        }else{
            $idrecursoevaluativo = $this->_request->getPost('idrecurso');
            $iddominioevaluativo = $this->_request->getPost('iddominio');
            if ($iddominioevaluativo == 'raizDominio')
                $iddominioevaluativo = -1;

            $objDominio = new DatEvaldominioevaluativo();

            $r = $objDominio->GetDominioEvaluativo($iddominioevaluativo, $idrecursoevaluativo);
            $v = null;
            $nodos = array();
            if (count($r) > 0)
                foreach ($r as $v)
                    $nodos[] = array('id' => $v['iddominioevaluativo'], 'text' => $v['denom'], 'descripcion' => $v['descripcion'], 'idpadre' => $v['idpadre']);
        }
        echo (json_encode($nodos));
    }

    function adicionardominioAction() {
        $objDominio = new DatEvaldominioevaluativo();
        $objDominio->denom = $this->_request->getPost('denom');
        $objDominio->descripcion = $this->_request->getPost('heDescripcionDom');
        $objDominio->idpadre = $this->_request->getPost('idpadre');
        $objDominio->idrecursoevaluativo = $this->_request->getPost('idrecurso');

        $id = $objDominio->GetMaxId() + 1; //Para generar la llave
        $objDominio->iddominioevaluativo = $id;
        if ($objDominio->idpadre == 'raizDominio') {
            $objDominio->idpadre = $id;
        }

        //print_r($objDominio);die;
        $objDominioModel = new DatEvaldominioevaluativoModel();
        $objDominioModel->Insertar($objDominio);
        $r->codMsg = 1;
        $r->mensaje = "El dominio evaluativo ha sido adicionado satisfactoriamente.";
        echo (json_encode($r));
    }

    function modificardominioAction() {
        //$iddominioevaluativo = $this->_request->getPost ( 'iddominio' );
        $iddominioevaluativo = $this->_request->getPost('idpadre');
        $objDominio = Doctrine::getTable('DatEvaldominioevaluativo')->find($iddominioevaluativo);
        $objDominio->denom = $this->_request->getPost('denom');
        $objDominio->descripcion = $this->_request->getPost('heDescripcionDom');

        $objDominioModel = new DatEvaldominioevaluativoModel();
        $objDominioModel->Actualizar($objDominio);
        $r->codMsg = 1;
        $r->mensaje = "El dominio evaluativo ha sido modificado satisfactoriamente.";
        echo (json_encode($r));
    }
/*
    function eliminardominioAction() {
        $iddominioevaluativo = $this->_request->getPost('iddominio');
        $resp = DatEvaldominioevaluativo::verificaruso($iddominioevaluativo);

        if ($resp[0]['idplanilla'] == '') {
           
            $objDominio = Doctrine::getTable('DatEvaldominioevaluativo')->find($iddominioevaluativo);
            $objDominioModel = new DatEvaldominioevaluativoModel();
            $objDominioModel->Eliminar($objDominio);
            $r->codMsg = 1;
            $r->mensaje = "El dominio evaluativo ha sido eliminado satisfactoriamente.";

        } else {
            $r->codMsg = 3;
            $r->mensaje = "El dominio evaluativo esta siendo usado por otro concepto.";
        }
        echo (json_encode($r));
    }*/
    
    function eliminardominioAction() {
        try{ 
            $iddominioevaluativo = $this->_request->getPost('iddominio');          
            $objDominio = Doctrine::getTable('DatEvaldominioevaluativo')->find($iddominioevaluativo);
            $objDominioModel = new DatEvaldominioevaluativoModel();
            $objDominioModel->Eliminar($objDominio);
            $r->codMsg = 1;
            $r->exception = 0;
            $r->mensaje = "El dominio evaluativo ha sido eliminado satisfactoriamente.";
            echo (json_encode($r));
        }catch (Exception $e) {
            if($e->getCode() == 23503) {//Code for foreignKeyViolation
                $r->exception = 1;
                echo (json_encode($r));
            }else{
                echo (json_encode($e->getMessage()));
            }
        }
    }

}