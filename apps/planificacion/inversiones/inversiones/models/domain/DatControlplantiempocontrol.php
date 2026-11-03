<?php

class DatControlplantiempocontrol extends BaseDatControlplantiempocontrol {

    public function setUp() {
        parent::setUp();
    }

    public function Buscar($iddesagregacionplan) {
        $temp = $this->conn->getTable('DatControlplantiempocontrol')->find($iddesagregacionplan);
        return $temp->toArray();
    }

    public function GetTodos() {
        $query = new Doctrine_Query ();
        $result = $query->from('DatControlplantiempocontrol')->execute();
        return $result->toArray();
    }
}