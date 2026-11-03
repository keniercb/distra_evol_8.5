<?php 
class DatEvalindicadoresevalfueraproceso extends BaseDatEvalindicadoresevalfueraproceso
 { 
	public function setUp() {   
		parent::setUp();
		$this->hasMany('DatEvalescala', array('local'=>'idescala','foreign'=>'idescala'));
		$this->hasOne('DatEvalpersonafueraproceso', array('local'=>'idpersonaevalfueraproceso','foreign'=>'idpersonaevalfueraproceso'));
		
    } 
 
	public function GetTodos() 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('DatEvalindicadoresevalfueraproceso')->execute (); 
          return $result->toArray();
    }
	
	public function Buscar($idindicadorevalfueraproceso)
	{
		return $objAux = Doctrine::getTable( 'DatEvalindicadoresevalfueraproceso' )->find ( $idindicadorevalfueraproceso );
	} 
	
	public function obtenerIndicadorEvaluacion($idpersonaevalfueraproceso, $idindicadorplanilla) {
		$query = new Doctrine_Query ( );
		$result = $query->from('DatEvalindicadoresevalfueraproceso ie')
						->where("ie.idpersonaevalfueraproceso = {$idpersonaevalfueraproceso} and ie.idindicadorplanilla = {$idindicadorplanilla}")
						->setHydrationMode( Doctrine:: HYDRATE_ARRAY )
						->execute();
		$objAux = Doctrine::getTable('DatEvalindicadoresevalfueraproceso')->find($result[0]['idindicadorevalfueraproceso']);
		return $objAux;
	}
	
	public function GetPorLimite($limite = 15,$inicio = 0) 
    {
		$query = new Doctrine_Query (); 
		$result = $query->from('DatEvalindicadoresevalfueraproceso')->limit($limite)->offset($inicio)->execute (); 
		return $result->toArray();
    }
	
	public function getIndicadorEvaluacion($idpersonaevalfueraproceso, $idindicadorplanilla) {
		$query = new Doctrine_Query();
		$result = $query->from('DatEvalindicadoresevalfueraproceso ie')
						->where("ie.idpersonaevalfueraproceso = {$idpersonaevalfueraproceso} and ie.idindicadorplanilla = {$idindicadorplanilla}")
						->setHydrationMode( Doctrine:: HYDRATE_ARRAY )
						->execute();
		return $result;
	}
	
	public function getIndicadoresByPersonEvaluacion($idpersonaevalfueraproceso){
		$query = Doctrine_Manager::getInstance();
		$sql="SELECT ie.idindicadorevalfueraproceso, ie.idvalor, ie.complementotextual as valorComplementotextual, iae.idescala, iae.complementotextual
				FROM mod_evaluaciones.dat_evalindicadoresevalfueraproceso ie
				INNER JOIN mod_evaluaciones.dat_evalindicadoresevaluar iae ON (ie.idindicadorplanilla = iae.idindicadorplanilla)
				WHERE ie.idpersonaevalfueraproceso = {$idpersonaevalfueraproceso}";
		return  $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
		
	}
	
}//fin clase 
?>


