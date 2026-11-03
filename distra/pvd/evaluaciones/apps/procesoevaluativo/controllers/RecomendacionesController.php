<?php

class RecomendacionesController extends ZendExt_Controller_Secure {

    function init() {
        parent::init();
    }

    function recomendacionesAction() {
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }

    function todosrecomendacionesAction() {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $objRecomendaciones = new NomEvalrecomendacion();
        $r['datos'] = $objRecomendaciones->GetPorLimite($limit, $start);
        $r['cantidad'] = $objRecomendaciones->GetCantTotal();

        echo (json_encode($r));
    }

    function todosrecomendacionesportipoAction() {
        $filtro = $this->_request->getPost('filtro');
        $idtiporecomendacionevaluativa = $this->_request->getPost('idtiporecomendacion');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $objRecomendacion = new NomEvalrecomendacion();
        if ($filtro == "") {
            $r['datos'] = $objRecomendacion->ObtenerRecomendacionPorIdTipo($idtiporecomendacionevaluativa, $limit, $start);
            $r['cantidad'] = $objRecomendacion->GetCantTotalPorIdTipo($idtiporecomendacionevaluativa);
            echo (json_encode($r));
        } else {
            $r['datos'] = $objRecomendacion->buscarRecomendacionPorIdTipo($filtro, $idtiporecomendacionevaluativa, $limit, $start);
            $r['cantidad'] = $objRecomendacion->GetCantTotalPorIdTipoFiltro($filtro, $idtiporecomendacionevaluativa);
            echo (json_encode($r));
        }
    }

    function adicionarrecomendacionAction() {
        $objRecomendacion = new NomEvalrecomendacion();
        $objRecomendacion->denom = $this->_request->getPost('denom');
        $objRecomendacion->descripcion = $this->_request->getPost('descripcion');
        $objRecomendacion->fechainicio = $this->_request->getPost('fechainicio');
        $objRecomendacion->idtiporecomendacion = $this->_request->getPost('idtiporecomendacion');
        if ($this->_request->getPost('fechafin') == '')
            $ff = null;
        else
            $ff = $this->_request->getPost('fechafin');
        $objRecomendacion->fechafin = $ff;
        $objRecomendacionModel = new NomEvalrecomendacionModel();

        $objRecomendacionModel->Insertar($objRecomendacion);
        $r->codResult = 1;
        $r->mensaje = "La recomendaci&oacute;n ha sido adicionada satisfactoriamente.";

        echo (json_encode($r));
    }

    function modificarrecomendacionAction() {
        $idrecomendacionevaluativo = $this->_request->getPost('idrecomendacion');
        $objRecomendacion = Doctrine::getTable('NomEvalrecomendacion')->find($idrecomendacionevaluativo);
        $recomendacion = $this->_request->getPost('denom');

        $objRecomendacion->descripcion = $this->_request->getPost('descripcion');
        $objRecomendacion->fechainicio = $this->_request->getPost('fechainicio');
        if ($this->_request->getPost('fechafin') == '')
            $ff = null;
        else
            $ff = $this->_request->getPost('fechafin');
        $objRecomendacion->fechafin = $ff;

        if ($objRecomendacion->denom != $recomendacion) {
            if (!$this->verificarRecomendacion($recomendacion)) {
                $objRecomendacion->denom = $recomendacion;
                $objRecomendacionModel = new NomEvalrecomendacionModel();
                $objRecomendacionModel->Actualizar($objRecomendacion);
                $r->codResult = 1;
                $r->mensaje = "La recomendaci&oacute;n ha sido modificada satisfactoriamente.";
            } else {
                $r->codResult = 3;
                $r->mensaje = "La recomendaci&oacute;n ya existe.";
            }
        } else {
            $objRecomendacion->denom = $recomendacion;
            $objRecomendacionModel = new NomEvalrecomendacionModel();
            $objRecomendacionModel->Actualizar($objRecomendacion);
            $r->codResult = 1;
            $r->mensaje = "La recomendaci&oacute;n ha sido modificada satisfactoriamente.";
        }

        echo (json_encode($r));
    }

    function verificarRecomendacion($denom) {
        $reco = NomEvalrecomendacion::ExisteDenomRecon($denom);
        if ($reco)
            return 1;
        else
            return 0;
    }

    function eliminarrecomendacionAction() {
        try {
            $idrecomendacionevaluativo = $this->_request->getPost('idrecomendacion');
            $objRecomendacion = Doctrine::getTable('NomEvalrecomendacion')->find($idrecomendacionevaluativo);
            $objRecomendacionModel = new NomEvalrecomendacionModel();
            $objRecomendacionModel->Eliminar($objRecomendacion);
            $r->codResult = 1;
            $r->mensaje = "La recomendaci&oacute;n ha sido eliminada satisfactoriamente.";
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

    //FUNCIONES PARA LOS TIPOS DE RECOMENDACIONES************************************************************


    function todostiporecomendacionesAction() {
        $filtro = $this->_request->getPost('filtro');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        if ($filtro == '') {
            $objTipoRecomendaciones = new NomEvaltiporecomendacion();
            $r['datos'] = $objTipoRecomendaciones->GetPorLimite($limit, $start);
            $r['cantidad'] = $objTipoRecomendaciones->GetCantTotal();
            echo (json_encode($r));
        } else {
            $objTipoRecomendaciones = new NomEvaltiporecomendacion();
            $r['datos'] = $objTipoRecomendaciones->buscarTipoRecomendacion($filtro, $limit, $start);
            $r['cantidad'] = $objTipoRecomendaciones->buscarGetCantTotal($filtro);
            echo (json_encode($r));
        }
    }

    function adicionartiporecomendacionAction() {
		$objTipoRecomendaciones = new NomEvaltiporecomendacion();
        $objTipoRecomendaciones->denom = $this->_request->getPost('denominacion');
        $objTipoRecomendaciones->descripcion = $this->_request->getPost('descripcion');
        $objTipoRecomendaciones->fechainicio = $this->_request->getPost('fechainicio');
        if ($this->_request->getPost('fechafin') == ''){
            $ff = null;
		}
        else{
            $ff = $this->_request->getPost('fechafin');
		}
        $objTipoRecomendaciones->fechafin = $ff;
        $objTipoRecomendacionesModel = new NomEvaltiporecomendacionModel();
        $verif = $objTipoRecomendacionesModel->existeDenominacion($this->_request->getPost('denominacion'));
		if ($verif) {
            $objTipoRecomendacionesModel->Insertar($objTipoRecomendaciones);
            $r->codResult = 1;
            $r->mensaje = "El tipo de recomendaci&oacute;n ha sido adicionada satisfactoriamente.";
        } else {
            $r->codResult = 3;
            $r->mensaje = "El tipo de recomendaci&oacute;n ya existe.";
        }

        echo (json_encode($r));
    }

    function modificartiporecomendacionAction() {
        $idtiporecomendacionevaluativo = $this->_request->getPost('idtiporecomendacion');
        $objTipoRecomendaciones = Doctrine::getTable('NomEvaltiporecomendacion')->find($idtiporecomendacionevaluativo);
        $tiporecomendaciones = $this->_request->getPost('denominacion');

        $objTipoRecomendaciones->descripcion = $this->_request->getPost('descripcion');
        $objTipoRecomendaciones->fechainicio = $this->_request->getPost('fechainicio');
        $ff = "";
        if ($this->_request->getPost('fechafin') == '')
            $ff = null;
        else
            $ff = str_replace('/', "-", $this->_request->getPost('fechafin'));

        $objTipoRecomendaciones->fechafin = $ff;
        if ($objTipoRecomendaciones->denom != $tiporecomendaciones) {
            if (!$this->verificarTipoRecomendacion($tiporecomendaciones)) {
                $objTipoRecomendaciones->denom = $tiporecomendaciones;
                $objTipoRecomendacionesModel = new NomEvaltiporecomendacionModel();
                $objTipoRecomendacionesModel->Actualizar($objTipoRecomendaciones);
                $r->codResult = 1;
                $r->mensaje = "El tipo de recomendaci&oacute;n ha sido modificada satisfactoriamente.";
            } else {
                $r->codResult = 3;
                $r->mensaje = "El tipo de recomendaci&oacute;n ya existe.";
            }
        } else {
            $objTipoRecomendaciones->denom = $tiporecomendaciones;
            $objTipoRecomendacionesModel = new NomEvaltiporecomendacionModel();
            $objTipoRecomendacionesModel->Actualizar($objTipoRecomendaciones);
            $r->codResult = 1;
            $r->mensaje = "El tipo de recomendaci&oacute;n ha sido modificada satisfactoriamente.";
        }
        echo (json_encode($r));
    }

    function verificarTipoRecomendacion($denom) {
        $tiporeco = NomEvaltiporecomendacion::ExisteDenomTipoRecon($denom);
        if ($tiporeco)
            return 1;
        else
            return 0;
    }

    function eliminartiporecomendacionAction() {
        try {
            $idtiporecomendacionevaluativo = $this->_request->getPost('idtiporecomendacion');
            $objTipoRecomendaciones = Doctrine::getTable('NomEvaltiporecomendacion')->find($idtiporecomendacionevaluativo);
            $objTipoRecomendacionesModel = new NomEvaltiporecomendacionModel();
            $objTipoRecomendacionesModel->Eliminar($objTipoRecomendaciones);
            $r->codResult = 1;
            $r->mensaje = "El tipo de recomendaci&oacute;n ha sido eliminado satisfactoriamente.";
            echo (json_encode($r));
        } catch (Exception $e) {
            if ($e->getCode() == 23503) {//Code for foreignKeyViolation
                $r->exception = 1;
                echo (json_encode($r));
            }
        }
    }

}
