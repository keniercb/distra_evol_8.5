<?php

class DatControletapaplan extends BaseDatControletapaplan {

    public function setUp() {
        parent::setUp();
    }

    public function Buscar($iddesagregacionetapaplan) {
        $temp = $this->conn->getTable('DatControletapaplan')->find($iddesagregacionetapaplan);
        return $temp->toArray();
    }

    public function GetTodos() {
        $query = new Doctrine_Query ();
        $result = $query->from('DatControletapaplan')->execute();
        return $result->toArray();
    }
    
    public function actualizarValor($idTabla, $valor) {
        $query = new Doctrine_Query ();
        $query->update('DatControletapaplan n')
                ->set('valor', $valor)
                ->whereIn('idcontroletapaplan', $idTabla)
                ->execute();
                
        return true;
    }

}
