<?php

/**
 * Created by JetBrains PhpStorm.
 * User: yosniel
 * Date: 6/05/16
 * Time: 9:23
 */

class DatDesagregacionplanpreparacionplan extends BaseDatDesagregacionplanpreparacionplan {

    public function setUp() {
        parent::setUp();
    }

    public function Buscar($iddesagregacionplanpreparacionplan) {
        $temp = $this->conn->getTable('DatDesagregacionplanpreparacionplan')->find($iddesagregacionplanpreparacionplan);
        return $temp->toArray();
    }

    public function GetTodos() {
        $query = new Doctrine_Query ();
        $result = $query->from('DatDesagregacionplanpreparacionplan')->execute();
        return $result->toArray();
    }
    
    public function actualizarValor($idTabla, $idmonModelo, $valor) {
		$conn = Doctrine_Manager::connection();
		$query = "UPDATE 
				  mod_planifinversiones.dat_desagregacionplanpreparacionplan  
				SET 
				  valor = " . $valor . "
				WHERE 
				  iddesagregacionplan = " . $idTabla . "
				  AND
				  idmonedaentidad = " . $idmonModelo . "";
// pre_r($query);die;
		$conn->execute($query);
        return true;
    }

}
