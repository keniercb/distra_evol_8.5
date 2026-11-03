<?php

class DatControlindplan extends BaseDatControlindplan {

    public function setUp() {
        parent::setUp();
    }

    public function Buscar($iddesagregacionindplan) {
        $temp = $this->conn->getTable('DatControlindplan')->find($iddesagregacionindplan);
        return $temp->toArray();
    }

    public function GetTodos() {
        $query = new Doctrine_Query ();
        $result = $query->from('DatControlindplan')->execute();
        return $result->toArray();
    }
    
    public function actualizarValor($idTabla, $idind, $valor) {
        $query = new Doctrine_Query ();
        $query->update('DatControlindplan n')
                ->set('valor', $valor)
                ->where('idcontrolplantiempocontrol = ' . $idTabla . ' AND idnomotrosindicadores = '. $idind)
                ->execute();
        return true;
    }
}
