<?php 
class DatEvalprocesoresenyalamiento extends BaseDatEvalprocesoresenyalamiento
 { 
   public function setUp() 
    {   parent::setUp(); 
         $this->hasMany('NomEvalsenyalamiento', array('local'=>'idsenyalamiento','foreign'=>'idsenyalamiento')); 
         $this->hasMany('DatEvaldefprocesoevaluativo', array('local'=>'iddefprocesoevaluativo','foreign'=>'iddefprocesoevaluativo')); 

    } 
 
   public function Buscar($idprocesoresenyalamiento) 
    { 
          $temp = $this->conn->getTable('DatEvalprocesoresenyalamiento')->find($idprocesoresenyalamiento); 
           return $temp->toArray(); 

    } 
 
   public function GetTodos() 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('DatEvalprocesoresenyalamiento')->execute (); 
          return $result->toArray(); 

    } 
 
   public function GetPorLimite($limite = 10,$inicio = 0) 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('DatEvalprocesoresenyalamiento')
					->orderBy('idprocesoresenyalamiento DESC')
					->limit($limite = 10)->offset($inicio = 0)->execute (); 
          return $result->toArray(); 

    } 
	
	public function GetCantTotal() {//Devuelve la cantidad total que tiene la tabla
		try {
			$query = new Doctrine_Query ();
			$result = $query->select ('COUNT(idprocesoresenyalamiento)')->from ('DatEvalprocesoresenyalamiento')->execute ();
			$arr = $result->toArray ();
			return (is_array ($arr) ? $arr [0] ['COUNT'] : 0);
		} catch ( Doctrine_Exception $e ) {
			return $e;
		}
	}
	
	public function getSenalamientosPE($iddefprocesoevaluativo, $limit=15, $start=0){
		$query = new Doctrine_Query ();
		$result = $query->select('psen.idprocesoresenyalamiento, sen.idsenyalamiento as idsenyalamiento, sen.denom as denom, tsen.idtiposenyalamiento as idtiposenyalamiento, tsen.denom as tiposenyalamiento')
					->from('DatEvalprocesoresenyalamiento psen')
					->innerJoin('psen.NomEvalsenyalamiento sen')
					->innerJoin('sen.NomEvaltiposenyalamiento tsen')
					->where("psen.iddefprocesoevaluativo = {$iddefprocesoevaluativo}")
					->orderBy('psen.idprocesoresenyalamiento DESC')
					->limit($limit)
					->offset($start)
					->setHydrationMode(Doctrine::HYDRATE_ARRAY)
					->execute ();
        return $result;
	}
	
	public function getCantSenalamientosPE($iddefprocesoevaluativo){
		try{
			$query = new Doctrine_Query (); 
			$result = $query->select('psen.idprocesoresenyalamiento')
					->from('DatEvalprocesoresenyalamiento psen')
					->innerJoin('psen.NomEvalsenyalamiento sen')
					->innerJoin('sen.NomEvaltiposenyalamiento tsen')
					->where("psen.iddefprocesoevaluativo = {$iddefprocesoevaluativo}")
					->count();
			return $result;
        }
        catch ( Doctrine_Exception $e ) {
			return $e;
		}
	}
 
}//fin clase 
?>


