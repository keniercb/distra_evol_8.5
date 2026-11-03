<?php

class SenyalamientosController extends ZendExt_Controller_Secure {

    function init() {
        parent::init();
    }

    function senyalamientosAction() {
       // $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }

    function todossenyalamientosAction() {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $objSenyalamientos = new NomEvalsenyalamiento();
        $r['datos'] = $objSenyalamientos->GetPorLimite($limit, $start);
        $r['cantidad'] = $objSenyalamientos->GetCantTotal();
        echo (json_encode($r));
    }

    //Funcion para obtener todos los se�alamientos dado un tipo...
    function todossenyalamientosportipoAction() {
        $filtro = $this->_request->getPost('filtro');
        $idtiposenyalamientosevaluativo = $this->_request->getPost('idtiposenyalamiento');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $objSenyalamientos = new NomEvalsenyalamiento();
        if ($filtro == '') {
            $r['datos'] = $objSenyalamientos->GetSenyalamientoPorIdTipo($idtiposenyalamientosevaluativo, $limit, $start);
            $r['cantidad'] = $objSenyalamientos->GetCantTotalPorIdTipo($idtiposenyalamientosevaluativo);
            echo (json_encode($r));
        } else {
            $r['datos'] = $objSenyalamientos->filtrarSenyalamientoPorIdTipo($filtro, $idtiposenyalamientosevaluativo, $limit, $start);
            $r['cantidad'] = $objSenyalamientos->cantidadTotalPorIdTipoFiltro($filtro, $idtiposenyalamientosevaluativo);
            echo (json_encode($r));
        }
    }

    function adicionarsenyalamientosAction() {
        $objSenyalamientos = new NomEvalsenyalamiento();
        $objSenyalamientos->denom = $this->_request->getPost('denom');
        $objSenyalamientos->descripcion = $this->_request->getPost('descripcion');
        $objSenyalamientos->fechainicio = $this->_request->getPost('fechainicio');
        $objSenyalamientos->idtiposenyalamiento = $this->_request->getPost('idtiposenyalamiento');
        if ($this->_request->getPost('fechafin') == '')
            $ff = null;
        else
            $ff = $this->_request->getPost('fechafin');
        $objSenyalamientos->fechafin = $ff;

        $objSenyalamientosModel = new NomEvalsenyalamientoModel();
        $objSenyalamientosModel->Insertar($objSenyalamientos);
        $r->codMsg = 1;
        $r->mensaje = "El se&ntilde;alamiento ha sido adicionado satisfactoriamente.";

        echo (json_encode($r));
    }

    function modificarsenyalamientosAction() {
        $idsenyalamientosevaluativo = $this->_request->getPost('idsenyalamiento');
        $objSenyalamientos = Doctrine::getTable('NomEvalsenyalamiento')->find($idsenyalamientosevaluativo);
        $senyalamientos = $this->_request->getPost('denom');

        $objSenyalamientos->descripcion = $this->_request->getPost('descripcion');
        $objSenyalamientos->fechainicio = $this->_request->getPost('fechainicio');
        if ($this->_request->getPost('fechafin') == '')
            $ff = null;
        else
            $ff = $this->_request->getPost('fechafin');
        $objSenyalamientos->fechafin = $ff;
        $val = NomEvalsenyalamiento::ExisteDenomSenyaMod($idsenyalamientosevaluativo, $senyalamientos);
        if (!$val) {
            $objSenyalamientos->denom = $senyalamientos;
            $objSenyalamientosModel = new NomEvalsenyalamientoModel();
            $objSenyalamientosModel->Actualizar($objSenyalamientos);
            $r->codMsg = 1;
            $r->mensaje = "El se&ntilde;alamiento ha sido modificado satisfactoriamente.";
        } else {
            $r->codMsg = 3;
            $r->mensaje = "El se&ntilde;alamiento ya existe.";
        }

        echo (json_encode($r));
    }

    function verificarSenyalamiento($denom) {
        $senya = NomEvalsenyalamiento::ExisteDenomSenya($denom);
        if ($senya)
            return 1;
        else
            return 0;
    }

    function eliminarsenyalamientosAction() {
        try {
            $idsenyalamientosevaluativo = $this->_request->getPost('idsenyalamiento');
            $objSenyalamientos = Doctrine::getTable('NomEvalsenyalamiento')->find($idsenyalamientosevaluativo);
            //print_r($idsenyalamientosevaluativo);die;
            $objSenyalamientosModel = new NomEvalsenyalamientoModel();
            $objSenyalamientosModel->Eliminar($objSenyalamientos);
            $r->codMsg = 1;
            $r->mensaje = "El se&ntilde;alamiento ha sido eliminado satisfactoriamente.";
            echo (json_encode($r));
        } catch (Exception $e) {
            if ($e->getCode() == 23503) {//Code for foreignKeyViolation
                $r->exception = 1;
                echo (json_encode($r));
            } else {
                echo (json_encode($e->getMessage()));
            }
        }
    }

    //TIPO DE SENYALAMIENTO

    function todostiposenyalamientosAction() {
        $filtro = $this->_request->getPost('filtro');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $objTipoSenyalamientos = new NomEvaltiposenyalamiento();
        if ($filtro == '') {
            $r['datos'] = $objTipoSenyalamientos->GetPorLimite($limit, $start);
            $r['cantidad'] = $objTipoSenyalamientos->GetCantTotal();
            echo (json_encode($r));
        } else {
            $r['datos'] = $objTipoSenyalamientos->filtrarTipoSenyalamiento($filtro, $limit, $start);
            $r['cantidad'] = $objTipoSenyalamientos->cantidadFiltroTipoSenyalamiento($filtro);
            echo (json_encode($r));
        }
    }

    function adicionartiposenyalamientosAction() {

        $objTipoSenyalamientos = new NomEvaltiposenyalamiento();
        $objTipoSenyalamientos->denom = $this->_request->getPost('denominacion');
        $objTipoSenyalamientos->descripcion = $this->_request->getPost('descripcion');
        $objTipoSenyalamientos->fechainicio = $this->_request->getPost('fechainicio');
        if ($this->_request->getPost('fechafin') == '')
            $ff = null;
        else
            $ff = $this->_request->getPost('fechafin');
        $objTipoSenyalamientos->fechafin = $ff;
        $val = $objTipoSenyalamientos->ExisteDenomTipoSenya($this->_request->getPost('denominacion'));
        if (!$val) {
            $objTipoSenyalamientosModel = new NomEvaltiposenyalamientoModel();
            $objTipoSenyalamientosModel->Insertar($objTipoSenyalamientos);
            $r->codMsg = 1;
            $r->mensaje = "El tipo de se&ntilde;alamiento ha sido adicionado satisfactoriamente.";
        } else {
            $r->codMsg = 3;
            $r->mensaje = "El tipo de se&ntilde;alamiento que quiere adicionar ya existe.";
        }

        echo (json_encode($r));
    }

    function modificartiposenyalamientosAction() {
        $idtiposenyalamientosevaluativo = $this->_request->getPost('idtiposenyalamiento');
        $objTipoSenyalamientos = Doctrine::getTable('NomEvaltiposenyalamiento')->find($idtiposenyalamientosevaluativo);
        $tiposenyalamientos = $this->_request->getPost('denominacion');

        $objTipoSenyalamientos->descripcion = $this->_request->getPost('descripcion');
        $objTipoSenyalamientos->fechainicio = $this->_request->getPost('fechainicio');
        if ($this->_request->getPost('fechafin') == '')
            $ff = null;
        else
            $ff = $this->_request->getPost('fechafin');
        $objTipoSenyalamientos->fechafin = $ff;
        $val = NomEvaltiposenyalamiento::ExisteDenomTipoSenyaMod($idtiposenyalamientosevaluativo, $tiposenyalamientos);
        if (!$val) {
            $objTipoSenyalamientos->denom = $tiposenyalamientos;
            $objTipoSenyalamientosModel = new NomEvaltiposenyalamientoModel();
            $objTipoSenyalamientosModel->Actualizar($objTipoSenyalamientos);
            $r->codMsg = 1;
            $r->mensaje = "El tipo de se&ntilde;alamiento ha sido modificado satisfactoriamente.";
        } else {
            $r->codMsg = 3;
            $r->mensaje = "El tipo de se&ntilde;alamiento ya existe.";
        }

        echo (json_encode($r));
    }

    function verificarTipoSenyalamiento($denom) {
        $tiposenya = NomEvaltiposenyalamiento::ExisteDenomTipoSenya($denom);
        if ($tiposenya)
            return 1;
        else
            return 0;
    }

    function eliminartiposenyalamientosAction() {
        try {
            $idtiposenyalamientosevaluativo = $this->_request->getPost('idtiposenyalamiento');
            $objTipoSenyalamientos = Doctrine::getTable('NomEvaltiposenyalamiento')->find($idtiposenyalamientosevaluativo);
            //print_r($idtiposenyalamientosevaluativo);die;
            $objTipoSenyalamientosModel = new NomEvaltiposenyalamientoModel();
            $objTipoSenyalamientosModel->Eliminar($objTipoSenyalamientos);
            $r->codMsg = 1;
            $r->mensaje = "El tipo de se&ntilde;alamiento ha sido eliminado satisfactoriamente.";
            echo (json_encode($r));
        } catch (Exception $e) {
            if ($e->getCode() == 23503) {//Code for foreignKeyViolation
                $r->exception = 1;
                echo (json_encode($r));
            } else {
                echo (json_encode($e->getMessage()));
            }
        }
    }

}
