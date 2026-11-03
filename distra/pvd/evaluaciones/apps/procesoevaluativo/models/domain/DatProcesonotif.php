<?php

class DatProcesonotif extends BaseDatProcesonotif {

    public function setUp() {
        parent::setUp();
        $this->hasOne('DatEvaldefprocesoevaluativo', array('local' => 'iddefprocesoevaluativo', 'foreign' => 'iddefprocesoevaluativo'));
    }

    public function GetTodos() {
        $query = new Doctrine_Query ();
        $result = $query->from('DatProcesonotif')->execute();
        return $result->toArray();
    }
    public function GetPorLimite($limite = 10, $inicio = 0) {
        $query = new Doctrine_Query ();
        $result = $query->from('DatProcesonotif')->limit($limite = 10)->offset($inicio = 0)->execute();
        return $result->toArray();
    }
	public function existe($iddefprocesoevaluativo) {
		$query = new Doctrine_Query ( );
		$result = $query->select('asunto')
			->from('DatProcesonotif')
			->where('iddefprocesoevaluativo = ? ', $iddefprocesoevaluativo)
			->execute();			
		if(count($result->toArray())>0){
			return true;			
		}
		return false;
    }
}