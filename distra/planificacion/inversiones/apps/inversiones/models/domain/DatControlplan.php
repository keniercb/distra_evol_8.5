<?php

class DatControlplan extends BaseDatControlplan {

    public function setUp() {
        parent::setUp();
    }

    public function Buscar($iddesagregacionplan) {
        $temp = $this->conn->getTable('DatControlplan')->find($iddesagregacionplan);
        return $temp->toArray();
    }

    public function GetTodos() {
        $query = new Doctrine_Query ();
        $result = $query->from('DatControlplan')->execute();
        return $result->toArray();
    }
}