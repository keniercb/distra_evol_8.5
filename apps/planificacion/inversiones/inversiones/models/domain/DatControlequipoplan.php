<?php

class DatControlequipoplan extends BaseDatControlequipoplan {

    public function setUp() {
        parent::setUp();
    }

    public function Buscar($iddesagregacionequipoplan) {
        $temp = $this->conn->getTable('DatControlequipoplan')->find($iddesagregacionequipoplan);
        return $temp->toArray();
    }

    public function GetTodos() {
        $query = new Doctrine_Query ();
        $result = $query->from('DatControlequipoplan')->execute();
        return $result->toArray();
    }
    
    public function actualizar($idTabla, $valor) {
        $query = new Doctrine_Query ();
        $query->update('DatControlequipoplan n')
                ->set('valor', $valor)
                ->whereIn('idcontrolequipoplan', $idTabla)
                ->execute();
                
        return true;
    }

}
