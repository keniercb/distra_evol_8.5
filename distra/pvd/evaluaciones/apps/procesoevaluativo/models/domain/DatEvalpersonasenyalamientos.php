<?php 
class DatEvalpersonasenyalamientos extends BaseDatEvalpersonasenyalamientos
 { 
	public function setUp() {
		parent::setUp();
		$this->hasOne('NomEvalsenyalamiento', array('local'=>'idsenyalamiento','foreign'=>'idsenyalamiento'));
    }

	public function GetTodos()
    {
		$query = new Doctrine_Query ();
		$result = $query->from('DatEvalpersonasenyalamientos')->execute (); 
		return $result->toArray();
    }
	
	public function Buscar($idpersonasenyalamientos)
	{
		return $DatEvalpersonasenyalamientos = Doctrine::getTable( 'DatEvalpersonasenyalamientos' )->find ($idpersonasenyalamientos);
	}
	
	public function GetPorLimite($limite = 15,$inicio = 0) 
    { 
		$query = new Doctrine_Query (); 
		$result = $query->from('DatEvalpersonasenyalamientos')->limit($limite)->offset($inicio)->execute (); 
		return $result->toArray();
    }
	
	function getPersonaSenalamiento($idpersonaevaluacion, $limit, $start){
		$query = new Doctrine_Query();
		$result = $query->select('ps.idpersonasenyalamientos, ns.denom as denom, nts.denom as tiposenalamiento')
					->from('DatEvalpersonasenyalamientos ps')
					->innerJoin('ps.NomEvalsenyalamiento ns')
					->innerJoin('ns.NomEvaltiposenyalamiento nts')
					->where("ps.idpersonaevaluacion = {$idpersonaevaluacion}")
					->limit($limit)
					->offset($start)
					->execute();		
		return $result->toArray ();
	}
	
	function getCantPersonaSenalamiento($idpersonaevaluacion){
		$query = new Doctrine_Query();
		$result = $query->select('ps.idpersonasenyalamientos')
					->from('DatEvalpersonasenyalamientos ps')
					->innerJoin('ps.NomEvalsenyalamiento ns')
					->innerJoin('ns.NomEvaltiposenyalamiento nts')
					->where("ps.idpersonaevaluacion = {$idpersonaevaluacion}")
					->count();		
		return $result;
	}
	
	public function existePersonaSenalamiento($idsenyalamiento, $idpersonaevaluacion){
		$query = new Doctrine_Query();
		$result = $query->from('DatEvalpersonasenyalamientos ps')
					->where("ps.idsenyalamiento = {$idsenyalamiento} and ps.idpersonaevaluacion = {$idpersonaevaluacion}")
					->execute();
		return $result->toArray();
	}
	
}//fin clase 
?>


