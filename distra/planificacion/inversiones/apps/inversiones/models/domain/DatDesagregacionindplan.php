<?php

class DatDesagregacionindplan extends BaseDatDesagregacionindplan {

    public function setUp() {
        parent::setUp();
    }

    public function Buscar($iddesagregacionindplan) {
        $temp = $this->conn->getTable('DatDesagregacionindplan')->find($iddesagregacionindplan);
        return $temp->toArray();
    }

    public function GetTodos() {
        $query = new Doctrine_Query ();
        $result = $query->from('DatDesagregacionindplan')->execute();
        return $result->toArray();
    }
    
    public function actualizarValor($idTabla, $idind, $valor) {
		$conn = Doctrine_Manager::connection();
		$query = "UPDATE 
				  mod_planifinversiones.dat_desagregacionindplan  
				SET 
				  valor = " . $valor . "
				WHERE 
				  iddesagregacionplan = " . $idTabla . "
				  AND
				  idnomotrosindicadores = " . $idind . "";
// pre_r($query);die;
		$conn->execute($query);
        return true;
    }
}
