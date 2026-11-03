<?php

class DatDesagregacionplan extends BaseDatDesagregacionplan {

    public function setUp() {
        parent::setUp();
    }

    public function Buscar($iddesagregacionplan) {
        $temp = $this->conn->getTable('DatDesagregacionplan')->find($iddesagregacionplan);
        return $temp->toArray();
    }

    public function GetTodos() {
        $query = new Doctrine_Query ();
        $result = $query->from('DatDesagregacionplan')->execute();
        return $result->toArray();
    }

	public function cleanDesag($idInvs, $params) {
		$conn = Doctrine_Manager::connection();
		$query = "DELETE FROM 
			  mod_planifinversiones.dat_desagregacionplan 
			WHERE 
			  idinversion IN (" . $idInvs . ") AND idejercicio = " . $params['idejercicio'] . "";
// pre_r($query);die;
		$conn->execute($query);
        return true;
	}
}