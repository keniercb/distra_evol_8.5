<?php 
class DatEvalregla extends BaseDatEvalregla
 { 
	public function setUp() 
    {   parent::setUp(); 
         $this->hasOne('DatEvalhecho', array('local'=>'idregla','foreign'=>'idregla')); 
         $this->hasMany('NomEvalestado', array('local'=>'idestado','foreign'=>'idestado')); 
         $this->hasMany('DatEvalplanillasevaluativas', array('local'=>'idplanilla','foreign'=>'idplanilla')); 
         $this->hasOne('DatEvalreferenciaregla', array('local'=>'idregla','foreign'=>'idregla')); 
         $this->hasOne('DatEvalindicadorescalculado', array('local'=>'idregla','foreign'=>'idregla')); 
    } 
 
	public function Buscar($idregla) 
	{ 
		$query = new Doctrine_Query ( );
		$result = $query->from ('DatEvalregla r')
						->where ("r.idregla='$idregla'")
						->setHydrationMode( Doctrine:: HYDRATE_ARRAY )
						->execute();
		return $result;
	} 
 
	public function GetTodos() 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('DatEvalregla')->execute (); 
          return $result->toArray(); 

    } 
 
	public function GetPorLimite($limite = 15,$inicio = 0) 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('DatEvalregla')->limit($limite)->offset($inicio)->execute (); 
          return $result->toArray(); 

    } 
	//Devuelve la cantidad total que tiene la tabla
	public function GetCantTotal() {
		try {
			$query = new Doctrine_Query ();
			$result = $query->select ('COUNT(idregla)')->from ('DatEvalregla')->execute ();
			$arr = $result->toArray ();
			return (is_array ($arr) ? $arr [0] ['COUNT'] : 0);
		} catch ( Doctrine_Exception $e ) {
			return $e;
		}		
	}
	//Devuelve las reglas asociadas a una planilla evaluativa
	public function getReglasPorPlanilla($idplanilla,$limite = 15,$inicio = 0){
		try {
			$query = new Doctrine_Query ();
			$result = $query->select('r.idregla, r.denom, r.descripcion,r.expnatural,e.denom as estado, r.idplanilla, r.idestado')
							->from ('DatEvalregla r')
							->leftJoin('r.NomEvalestado e')
							->where('r.idplanilla = ?',$idplanilla)
							->limit($limite)
							->offset($inicio)
							->setHydrationMode( Doctrine:: HYDRATE_ARRAY )
							->execute ();
			 return $result;
		} catch ( Doctrine_Exception $e ) {
			return $e;
		}
	}

	
    //Devuelve las reglas que su denominacion contiene el texto que se pasa por par�metro
	public function getReglaPorTexto($texto,$limite,$inicio){
		try {
			$query = new Doctrine_Query ();
			$result = $query->from ('DatEvalregla')							
							->where("denom ILIKE '%$texto%'")
							->limit($limite)
							->offset($inicio)
							->execute ();
			return $result->toArray();
		} catch ( Doctrine_Exception $e ) {
			return $e;
		}
	}

	
	//Devuelve las reglas de una misma denominaci�n y de una misma planilla evaluativa
	public function existeRegla($idplanilla, $denom) {
		
		$query = new Doctrine_Query ( );
		$result = $query->from ( 'DatEvalregla r' )
				->where ( "r.idplanilla = '$idplanilla' and r.denom = '$denom'" )
				->execute ();
		return $result->toArray ();	
	}
	
	public function reglaEnUso($idregla){
		$query = new Doctrine_Query ( );
		$result = $query->from ('DatEvalregla r')->where ("r.idregla='$idregla' and r.idestado != '0'" )->execute();
		return $result->toArray ();
	}
	
	public function reglaEnUsoHecho($idregla){
		$query = new Doctrine_Query ( );
		$result = $query->from ('DatEvalregla r')
			->innerJoin('r.DatEvalhecho h')
			->where ("r.idregla='$idregla'" )->execute();
		return $result->toArray ();
	}
	
	public function getRegla($idplanilla, $denom){
		$query = new Doctrine_Query ( );
		$result = $query->from ('DatEvalregla r')->where ("r.idplanilla='$idplanilla' and r.denom = '$denom'" )->execute();
		return $result->toArray ();
	}

 
}