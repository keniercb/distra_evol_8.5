<?php

class DatEvalpersonafueraproceso extends BaseDatEvalpersonafueraproceso {

    public function setUp() {
        parent::setUp();
        $this->hasMany('DatEvalindicadoresevalfueraproceso', array('local' => 'idpersonaevalfueraproceso', 'foreign' => 'idpersonaevalfueraproceso'));
    }

    public function Buscar($idpersonaevalfueraproceso) {
        return $DatEvalregla = Doctrine::getTable('DatEvalpersonafueraproceso')->find($idpersonaevalfueraproceso);
    }

    public function getPersonasXEvaluador($idpersonaevaluador, $limit, $start, $fechaevaluacion) {
        $query = new Doctrine_Query ( );
        if ($fechaevaluacion == '') {
            $result = $query->from('DatEvalpersonafueraproceso')
                    ->where('idpersonaevaluador = ?', $idpersonaevaluador)
                    ->orderBy('idpersonaevalfueraproceso DESC')
                    ->limit($limit)
                    ->offset($start)
                    ->execute();
            return $result->toArray();
        } else {
            $result = $query->from('DatEvalpersonafueraproceso')
                    ->where("idpersonaevaluador = {$idpersonaevaluador} and fechaevaluacion = '$fechaevaluacion'")
                    ->orderBy('idpersonaevalfueraproceso DESC')
                    ->limit($limit)
                    ->offset($start)
                    ->execute();
            return $result->toArray();
        }
    }

    public function cantPersonasXEvaluador($idpersonaevaluador, $fechaevaluacion) {
        $query = new Doctrine_Query ( );
        if ($fechaevaluacion == '') {
            $result = $query->select('idpersonaevalfueraproceso')
                    ->from('DatEvalpersonafueraproceso')
                    ->where('idpersonaevaluador = ?', $idpersonaevaluador)
                    ->count();
            return $result;
        } else {
            $result = $query->select('idpersonaevalfueraproceso')
                    ->from('DatEvalpersonafueraproceso')
                    ->where("idpersonaevaluador = {$idpersonaevaluador} and fechaevaluacion = '$fechaevaluacion'")
                    ->count();
            return $result;
        }
    }

}

//fin clase 
?>


