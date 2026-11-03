<?php

class SeguridadevaluacionesService extends ZendExt_Model {

    public function obtenerEvaluados($idevaluador, $identidad, $formaevaluacion, $idPrepProcesoEvaluativo, $limit, $start) {
        $aux = DatEvalseguridadevalentidad::obtenerEvaluados($idevaluador, $identidad, $formaevaluacion, $idPrepProcesoEvaluativo, $limit, $start);
        return $aux; //ZendExt_ClassStandard::ArrayObject ( $aux );
    }

    public function obtenerCantidadEvaluados($idevaluador, $identidad, $formaevaluacion, $idPrepProcesoEvaluativo) {
        $aux = DatEvalseguridadevalentidad::obtenerCantidadEvaluados($idevaluador, $identidad, $formaevaluacion, $idPrepProcesoEvaluativo);
        return $aux;
    }

    public function ExisteDatEvalseguridadevalentidad($idpersona, $idpreprocesoevaluativo, $identidad) {
        $aux = DatEvalseguridadevalentidad::ExisteDatEvalseguridadevalentidad($idpersona, $idpreprocesoevaluativo, $identidad);
        return $aux;
    }

    public function adicionarSeguridadEvalEntidad($idpersona, $identidad, $formaevaluacion, $idpreprocesoevaluativo, $permiso) {
        $objAux = new DatEvalseguridadevalentidad();
        $objAux->idpersona = $idpersona;
        $objAux->identidad = $identidad;
        $objAux->formaevaluacion = $formaevaluacion;
        $objAux->idpreprocesoevaluativo = $idpreprocesoevaluativo;
        $objAux->todo = $permiso;
        $objAux->tipopersona = 1;
        $objAuxModel = new DatEvalseguridadevalentidadModel();
        $objAuxModel->Insertar($objAux);
        $arrAux = $objAux->getIdEvalSeguridadEvalentidad($idpersona, $identidad, $formaevaluacion, $idpreprocesoevaluativo);
        return $arrAux[0]['idevalseguridadevalentidad'];
    }

    public function adicionarAccesoEvalEntidad($idpersona, $ver, $modificar, $idevalseguridadevalentidad) {
        $objAux = new DatEvalaccesoevalentidad();
        $objAux->idpersona = $idpersona;
        $objAux->ver = $ver;
        $objAux->modificar = $modificar;
        $objAux->idevalseguridadevalentidad = $idevalseguridadevalentidad;
        $objAuxModel = new DatEvalaccesoevalentidadModel();
        $objAuxModel->Insertar($objAux);
        return true;
    }

    public function getIdEvalSeguridadEvalentidad($idpersona, $identidad, $formaevaluacion, $idPrepProcesoEvaluativo) {
        $objAux = new DatEvalseguridadevalentidad();
        $result = $objAux->getIdEvalSeguridadEvalentidad($idpersona, $identidad, $formaevaluacion, $idPrepProcesoEvaluativo);
        return $result;
    }

    public function eliminarAccesoEvalEntidad($idpersona, $idevalseguridadevalentidad) {
        $objAux = Doctrine::getTable('DatEvalaccesoevalentidad')->findByDql("idpersona = {$idpersona} and idevalseguridadevalentidad = {$idevalseguridadevalentidad}");
        $objAux->delete();
        return true;
        return true;
    }

    public function eliminarSeguridadEvalEntidad($idpersona, $identidad, $formaevaluacion, $idpreprocesoevaluativo) {
        print_r('Lego');die;
        return true;
    }

}