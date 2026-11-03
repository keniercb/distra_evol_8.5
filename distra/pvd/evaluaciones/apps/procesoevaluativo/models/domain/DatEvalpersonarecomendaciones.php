<?php 
class DatEvalpersonarecomendaciones extends BaseDatEvalpersonarecomendaciones
 { 
	public function setUp() {
		parent::setUp();
		$this->hasOne('NomEvalrecomendacion', array('local'=>'idrecomendacion','foreign'=>'idrecomendacion'));
    }
	
	public function GetTodos() 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('DatEvalpersonarecomendaciones')->execute (); 
          return $result->toArray();
    }
	
	public function Buscar($idpersonarecomendaciones)
	{
		return $DatEvalpersonarecomendaciones = Doctrine::getTable( 'DatEvalpersonarecomendaciones' )->find ($idpersonarecomendaciones);
	}
	
	public function GetPorLimite($limite = 15,$inicio = 0) 
    { 
		$query = new Doctrine_Query (); 
		$result = $query->from('DatEvalpersonarecomendaciones')->limit($limite)->offset($inicio)->execute (); 
		return $result->toArray();
    }
	
	function getPersonaRecomendacion($idpersonaevaluacion, $limit, $start){
		$query = new Doctrine_Query();
		$result = $query->select('pr.idpersonarecomendaciones, nr.denom as denom, ntr.denom as tiporecomendacion')
					->from('DatEvalpersonarecomendaciones pr')
					->innerJoin('pr.NomEvalrecomendacion nr')
					->innerJoin('nr.NomEvaltiporecomendacion ntr')
					->where("pr.idpersonaevaluacion = {$idpersonaevaluacion}")
					->limit($limit)
					->offset($start)
					->execute();		
		return $result->toArray ();
	}
	
	function getCantPersonaRecomendacion($idpersonaevaluacion){
		$query = new Doctrine_Query();
		$result = $query->select('pr.idpersonarecomendaciones')
					->from('DatEvalpersonarecomendaciones pr')
					->innerJoin('pr.NomEvalrecomendacion nr')
					->innerJoin('nr.NomEvaltiporecomendacion ntr')
					->where("pr.idpersonaevaluacion = {$idpersonaevaluacion}")
					->count();		
		return $result;
	}
	
	public function existePersonaRecomendacion($idrecomendacion, $idpersonaevaluacion){
		$query = new Doctrine_Query();
		$result = $query->from('DatEvalpersonarecomendaciones pr')
					->where("pr.idrecomendacion = {$idrecomendacion} and pr.idpersonaevaluacion = {$idpersonaevaluacion}")
					->execute();
		return $result->toArray();
	}
	
}//fin clase 
?>


