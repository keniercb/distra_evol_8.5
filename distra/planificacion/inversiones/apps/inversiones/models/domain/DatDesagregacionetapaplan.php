<?php

class DatDesagregacionetapaplan extends BaseDatDesagregacionetapaplan {

    public function setUp() {
        parent::setUp();
    }

    public function Buscar($iddesagregacionetapaplan) {
        $temp = $this->conn->getTable('DatDesagregacionetapaplan')->find($iddesagregacionetapaplan);
        return $temp->toArray();
    }

    public function GetTodos() {
        $query = new Doctrine_Query ();
        $result = $query->from('DatDesagregacionetapaplan')->execute();
        return $result->toArray();
    }
    
    public function actualizarValor($idTabla, $valor) {
		$conn = Doctrine_Manager::connection();
		$query = "UPDATE mod_planifinversiones.dat_desagregacionetapaplan 
					 SET valor = " . $valor . "
					 WHERE  iddesagregacionetapaplan = " . $idTabla . "";
// pre_r($query);die;
		$conn->execute($query);
        return true;
    }

}
