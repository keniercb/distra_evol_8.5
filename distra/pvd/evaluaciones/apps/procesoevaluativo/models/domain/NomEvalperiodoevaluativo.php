<?php

class NomEvalperiodoevaluativo extends BaseNomEvalperiodoevaluativo {

    public function setUp() {
        parent::setUp();
    }

    public function Buscar($idperiodoevaluativo) {
        $temp = $this->conn->getTable('NomEvalperiodoevaluativo')->find($idperiodoevaluativo);
        return $temp->toArray();
    }

    public function GetTodos() {
        $query = new Doctrine_Query ();
        $result = $query->from('NomEvalperiodoevaluativo')->execute();
        return $result->toArray();
    }

    public function GetPorLimite($limite = 15, $inicio = 0) {
        $query = new Doctrine_Query ();
        $result = $query->from('NomEvalperiodoevaluativo')
                        ->orderBy('idperiodoevaluativo DESC')
                        ->limit($limite)->offset($inicio)->execute();
        return $result->toArray();
    }

    public function filtrarPeriodos($filtro, $limite = 15, $inicio = 0) {
        $query = new Doctrine_Query ();
        $result = $query->from('NomEvalperiodoevaluativo p')
                ->where("p.periodo = '$filtro'")
                ->orderBy('p.idperiodoevaluativo DESC')
                ->limit($limite)
                ->offset($inicio)
                ->execute();
        return $result->toArray();
    }

    public function cantidadTotalFiltro($filtro) {
        try {
            $query = new Doctrine_Query ();
            $result = $query->select('COUNT(idperiodoevaluativo)')
                    ->from('NomEvalperiodoevaluativo p')
                    ->where("p.periodo = '$filtro'")
                    ->execute();
            $arr = $result->toArray();
            return (is_array($arr) ? $arr [0] ['COUNT'] : 0);
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function GetCantTotal() {
        try {
            $query = new Doctrine_Query ();
            $result = $query->select('COUNT(idperiodoevaluativo)')->from('NomEvalperiodoevaluativo')->execute();
            $arr = $result->toArray();
            return (is_array($arr) ? $arr [0] ['COUNT'] : 0);
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function ExistePeriodo($periodo, $medidatiempo) {
        $query = new Doctrine_Query ();
        $result = $query->from('NomEvalperiodoevaluativo e')
                ->where("e.periodo = '$periodo' and e.medidatiempo = '$medidatiempo'")
                ->execute();
        return $result->toArray();
    }

    public function ExistePeriodoMod($id, $periodo, $medidatiempo) {
        $query = new Doctrine_Query ();
        $result = $query->from('NomEvalperiodoevaluativo e')
                ->where("e.periodo = '$periodo' and e.medidatiempo = '$medidatiempo' and e.idperiodoevaluativo <> '$id'")
                ->execute();
        return $result->toArray();
    }

    public function PeriodoEnUso($idPer) {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvaldefprocesoevaluativo')
                ->where("idperiodoevaluativo='$idPer'")
                ->execute();
        return $result->toArray();
    }

}

//fin clase
?>


