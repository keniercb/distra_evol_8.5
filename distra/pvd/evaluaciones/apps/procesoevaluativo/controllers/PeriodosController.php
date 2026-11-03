<?php

class PeriodosController extends ZendExt_Controller_Secure {

    function init() {
        parent::init();
    }

    function periodosAction() {
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }

    function todosperiodosAction() {
        $filtro = $this->_request->getPost('filtro');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $objPeriodos = new NomEvalperiodoevaluativo();
        if ($filtro == '') {
            $r['datos'] = $objPeriodos->GetPorLimite($limit, $start);
            $r['cantidad'] = $objPeriodos->GetCantTotal();
            echo (json_encode($r));
        } else {
            $r['datos'] = $objPeriodos->filtrarPeriodos($filtro, $limit, $start);
            $r['cantidad'] = $objPeriodos->cantidadTotalFiltro($filtro);
            echo (json_encode($r));
        }
    }

    function adicionarperiodoAction() {
        $objPeriodos = new NomEvalperiodoevaluativo();
        $objPeriodos->periodo = $this->_request->getPost('periodo');
        $objPeriodos->medidatiempo = $this->_request->getPost('medidatiempo');

        $objPeriodos->fechainicio = $this->_request->getPost('fechainicio');
        if ($this->_request->getPost('fechafin') == '')
            $ff = null;
        else {
            $ff = $this->_request->getPost('fechafin');
        }
        $objPeriodos->fechafin = $ff;
        $objPeriodosModel = new NomEvalperiodoevaluativoModel();

        $objPeriodosModel->Insertar($objPeriodos);
        $r->rcodMsg = 1;
        $r->mensaje = "El per&iacute;odo ha sido adicionado satisfactoriamente.";

        echo (json_encode($r));
    }

    function modificarperiodoAction() {
        $idperiodo = $this->_request->getPost('idperiodo');
        $objPeriodos = Doctrine::getTable('NomEvalperiodoevaluativo')->find($idperiodo);
        $periodo = $this->_request->getPost('periodo');
        $medidatiempo = $this->_request->getPost('medidatiempo');
        //$objPeriodos->periodo = $this->_request->getPost ( 'periodo' );

        $objPeriodos->fechainicio = $this->_request->getPost('fechainicio');
        if ($this->_request->getPost('fechafin') == '')
            $ff = null;
        else
            $ff = $this->_request->getPost('fechafin');
        $objPeriodos->fechafin = $ff;
        $objPeriodos->medidatiempo = $medidatiempo;
        $val = NomEvalperiodoevaluativo::ExistePeriodoMod($idperiodo, $periodo, $medidatiempo);
        if (!$val) {
            $objPeriodos->periodo = $periodo;
            $objPeriodosModel = new NomEvalperiodoevaluativoModel();
            $objPeriodosModel->Actualizar($objPeriodos);
            $r->rcodMsg = 1;
            $r->mensaje = "El per&iacute;odo ha sido modificado satisfactoriamente.";
        } else {
            // throw new ZendExt_Exception('CHE049');
            $r->rcodMsg = 3;
            $r->mensaje = "El per&iacute;odo ya existe.";
        }
        echo (json_encode($r));
    }

    function verificarPeriodo($nomPeriodo, $medidatiempo) {
        $periodo = NomEvalperiodoevaluativo::ExistePeriodo($nomPeriodo, $medidatiempo);
        if ($periodo)
            return true;
        else
            return false;
    }

    function eliminarperiodoAction() {	
	        try {			
            $idperiodoevaluativo = $this->_request->getPost('idperiodo');            
            $objPeriodos = Doctrine::getTable('NomEvalperiodoevaluativo')->find($idperiodoevaluativo);
            $objPeriodosModel = new NomEvalperiodoevaluativoModel();
            $objPeriodosModel->Eliminar($objPeriodos);
            $r->rcodMsg = 1;
            $r->mensaje = "El per&iacute;odo ha sido eliminado satisfactoriamente.";
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
