<?php 
class DatEvalaccesoevalentidad extends BaseDatEvalaccesoevalentidad
 { 
	public function setUp() {   
		parent::setUp(); 
		$this->hasOne('DatEvalseguridadevalentidad', array('local'=>'idevalseguridadevalentidad','foreign'=>'idevalseguridadevalentidad'));
    } 
 
	public function GetTodos(){ 
		$query = new Doctrine_Query (); 
		$result = $query->from('DatEvalaccesoevalentidad')->execute (); 
		return $result->toArray();
    } 
 
	public function GetPorLimite($limite = 15,$inicio = 0){ 
		$query = new Doctrine_Query (); 
		$result = $query->from('DatEvalaccesoevalentidad')->limit($limite)->offset($inicio)->execute (); 
		return $result->toArray();
    }
	
	public function Buscar($idevalaccesoevalentidad){
		return $DatEvalregla = Doctrine::getTable('DatEvalaccesoevalentidad')->find($idevalaccesoevalentidad);		
	} 
	
	public function obtenerEvaluadosPE($limit, $start, $idevalseguridadevalentidad){
		if($limit != null && $start != null){
			$query = new Doctrine_Query ();
			$result = $query->select('de.idevalaccesoevalentidad, de.idpersona, de.ver, de.modificar')
							->from ('DatEvalaccesoevalentidad de')							
							->where('de.idevalseguridadevalentidad = ?',$idevalseguridadevalentidad)
							->orderBy('de.idevalaccesoevalentidad DESC')
							->limit($limit)
							->offset($start)
							->setHydrationMode( Doctrine:: HYDRATE_ARRAY )
							->execute ();
			 return $result;
		} else{
			$query = new Doctrine_Query ();
			$result = $query->select('de.idevalaccesoevalentidad, de.idpersona, de.ver, de.modificar')
							->from ('DatEvalaccesoevalentidad de')							
							->where('de.idevalseguridadevalentidad = ?',$idevalseguridadevalentidad)
							->orderBy('de.idevalaccesoevalentidad DESC')
							->setHydrationMode( Doctrine:: HYDRATE_ARRAY )
							->execute ();
			 return $result;
		}
	}
	
	public function getCantEvaluadosPE($idevalseguridadevalentidad){
		try {
			$query = new Doctrine_Query ();
			$result = $query->select ('COUNT(de.idevalaccesoevalentidad)')
						->from ('DatEvalaccesoevalentidad de')
						->where('de.idevalseguridadevalentidad = ?',$idevalseguridadevalentidad)
						->execute ();
			$arr = $result->toArray ();
			return (is_array ($arr) ? $arr [0] ['COUNT'] : 0);
		} catch ( Doctrine_Exception $e ) {
			return $e;
		}	
	}
	
	public function ExisteDatEvalaccesoevalentidad($idpersona, $idevalseguridadevalentidad){
		$query = new Doctrine_Query();
		$result = $query->from ('DatEvalaccesoevalentidad a')->where("a.idpersona = '$idpersona' and a.idevalseguridadevalentidad ='$idevalseguridadevalentidad'" )->execute ();
		return $result->toArray();
	}

}//fin clase 
?>


