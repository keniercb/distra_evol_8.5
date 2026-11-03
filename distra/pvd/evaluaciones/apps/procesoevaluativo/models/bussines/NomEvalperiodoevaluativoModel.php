<?php

class NomEvalperiodoevaluativoModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function Insertar(NomEvalperiodoevaluativo $NomEvalperiodoevaluativo) {
        $NomEvalperiodoevaluativo->save();
    }

    public function Actualizar(NomEvalperiodoevaluativo $NomEvalperiodoevaluativo) {
        $NomEvalperiodoevaluativo->save();
    }

    public function Eliminar($NomEvalperiodoevaluativo) {
		
        $NomEvalperiodoevaluativo->delete();
    }

    public function existePeriodo($periodo, $medidatiempo) {
        $existe = NomEvalperiodoevaluativo :: ExistePeriodo($periodo, $medidatiempo);
        return $existe;
    }

    public function PeriodoEnUso($id) {
        $valores = NomEvalperiodoevaluativo :: PeriodoEnUso($id);
        if ($valores)
            return true;
        return false;
    }

}

