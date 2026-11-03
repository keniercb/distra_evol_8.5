<?php

class DatEvalindicadorescalculado extends BaseDatEvalindicadorescalculado {

    public function setUp() {
        parent::setUp();
        $this->hasMany('DatEvalindicadoresplanilla', array('local' => 'idindicadorplanilla', 'foreign' => 'idindicadorplanilla'));
    }

    public function Buscar($idindicadorcalculado) {
        $temp = $this->conn->getTable('DatEvalindicadorescalculado')->find($idindicadorcalculado);
        return $temp->toArray();
    }

    public function GetTodos() {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvalindicadorescalculado')->execute();
        return $result->toArray();
    }

    public function GetPorLimite($limite = 10, $inicio = 0) {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvalindicadorescalculado')->limit($limite = 10)->offset($inicio = 0)->execute();
        return $result->toArray();
    }

}