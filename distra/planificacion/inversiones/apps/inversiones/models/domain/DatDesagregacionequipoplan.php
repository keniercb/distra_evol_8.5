<?php

class DatDesagregacionequipoplan extends BaseDatDesagregacionequipoplan {

    public function setUp() {
        parent::setUp();
    }

    public function Buscar($iddesagregacionequipoplan) {
        $temp = $this->conn->getTable('DatDesagregacionequipoplan')->find($iddesagregacionequipoplan);
        return $temp->toArray();
    }

    public function GetTodos() {
        $query = new Doctrine_Query ();
        $result = $query->from('DatDesagregacionequipoplan')->execute();
        return $result->toArray();
    }
    
    public function actualizar($idTabla, $valor) {
        $query = new Doctrine_Query ();
        $query->update('DatDesagregacionequipoplan n')
                ->set('valor', $valor)
                ->whereIn('iddesagregacionequipoplan', $idTabla)
                ->execute();
                
        return true;
    }

}
