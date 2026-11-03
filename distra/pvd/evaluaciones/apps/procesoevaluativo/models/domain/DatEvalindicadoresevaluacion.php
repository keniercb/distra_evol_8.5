<?php

class DatEvalindicadoresevaluacion extends BaseDatEvalindicadoresevaluacion {

    public function setUp() {
        parent::setUp();
        $this->hasMany('DatEvalescala', array('local' => 'idescala', 'foreign' => 'idescala'));
        $this->hasOne('DatEvalpersonaevaluacion', array('local' => 'idpersonaevaluacion', 'foreign' => 'idpersonaevaluacion'));
        $this->hasOne('DatEvalindicadoresplanilla', array('local' => 'idindicadorplanilla', 'foreign' => 'idindicadorplanilla'));
    }

    public function GetTodos() {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvalindicadoresevaluacion')->execute();
        return $result->toArray();
    }

    public function Buscar($DatEvalindicadoresevaluacion) {
        return $objAux = Doctrine::getTable('DatEvalindicadoresevaluacion')->find($DatEvalindicadoresevaluacion);
    }

    public function obtenerIndicadorEvaluacion($idpersonaevaluacion, $idindicadorplanilla) {
        $query = new Doctrine_Query ( );
        $result = $query->from('DatEvalindicadoresevaluacion ie')
                ->where("ie.idpersonaevaluacion = {$idpersonaevaluacion} and ie.idindicadorplanilla = {$idindicadorplanilla}")
                ->setHydrationMode(Doctrine:: HYDRATE_ARRAY)
                ->execute();
        $objAux = Doctrine::getTable('DatEvalindicadoresevaluacion')->find($result[0]['idindicadorevaluacion']);
        return $objAux;
    }

    public function GetPorLimite($limite = 15, $inicio = 0) {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvalindicadoresevaluacion')->limit($limite)->offset($inicio)->execute();
        return $result->toArray();
    }

    public function getIndicadorEvaluacion($idpersonaevaluacion, $idindicadorplanilla) {
        $query = new Doctrine_Query();
        $result = $query->from('DatEvalindicadoresevaluacion ie')
                ->where("ie.idpersonaevaluacion = {$idpersonaevaluacion} and ie.idindicadorplanilla = {$idindicadorplanilla}")
                ->setHydrationMode(Doctrine:: HYDRATE_ARRAY)
                ->execute();
        return $result;
    }



    public function getIndicadoresByPersonEvaluacion($idpersonaevaluacion)
    {
        $query = Doctrine_Manager::getInstance();
        $sql = "SELECT ie.idindicadorevaluacion, ie.valor, ie.complementotextual as valorComplementotextual, ie.resultado, iae.idescala, iae.complementotextual, ie.idindicadorplanilla as indicadorplanilla
                FROM mod_evaluaciones.dat_evalindicadoresevaluacion ie
                INNER JOIN mod_evaluaciones.dat_evalindicadoresevaluar iae ON (ie.idindicadorplanilla = iae.idindicadorplanilla)
                WHERE ie.idpersonaevaluacion = {$idpersonaevaluacion}";
        return $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getEvalIndicadoresHijos($idpersona, $idindicadorplanillaPadre, $idpersonaevaluacion=null)
    {
        /*$query = Doctrine_Manager::getInstance();
        $sql = " SELECT inp.idindicador, ie.valor
            FROM mod_evaluaciones.dat_evalindicadoresevaluacion ie
            INNER JOIN mod_evaluaciones.dat_evalindicadoresplanilla inp ON(ie.idindicadorplanilla = inp.idindicadorplanilla)
            WHERE ie.idpersonaevaluacion = {$idpersonaevaluacion} AND inp.idpadre = {$idindicadorplanillaPadre} AND inp.idindicadorplanilla<>{$idindicadorplanillaPadre}";
        $result = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);*/

        $query = Doctrine_Manager::getInstance();
        $sql = " SELECT inp.idindicador, ie.valor
            FROM mod_evaluaciones.dat_evalpersonaevaluacion e
            INNER JOIN mod_evaluaciones.dat_evalindicadoresevaluacion ie ON (ie.idpersonaevaluacion = e.idpersonaevaluacion)
            INNER JOIN mod_evaluaciones.dat_evalindicadoresplanilla inp ON(ie.idindicadorplanilla = inp.idindicadorplanilla)
            WHERE e.idpersonaevaluacion = $idpersonaevaluacion and e.idpersonaevaluado = {$idpersona} AND inp.idpadre = {$idindicadorplanillaPadre} AND inp.idindicadorplanilla<>{$idindicadorplanillaPadre}";
        $result = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);


        return $result;
    }

    public function updateValorIndicador($idindicadorplanilla, $valor, $idpersonaevaluacion)
    {
        try {
            $query = Doctrine_Query::create()
                ->update('DatEvalindicadoresevaluacion')
                ->where("idindicadorplanilla = '$idindicadorplanilla' and idpersonaevaluacion = '$idpersonaevaluacion'");
            $query->set('valor', "'$valor'");
            $query->execute();
            return true;
        } catch (Exception $exc) {
            return false;
        }
    }
}
