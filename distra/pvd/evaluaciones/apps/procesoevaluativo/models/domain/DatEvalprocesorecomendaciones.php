<?php 
class DatEvalprocesorecomendaciones extends BaseDatEvalprocesorecomendaciones
 { 
   public function setUp() 
    {   parent::setUp(); 
         $this->hasMany('NomEvalrecomendacion', array('local'=>'idrecomendacion','foreign'=>'idrecomendacion')); 
         $this->hasMany('DatEvaldefprocesoevaluativo', array('local'=>'iddefprocesoevaluativo','foreign'=>'iddefprocesoevaluativo')); 

    } 
 
   public function Buscar($idprocesorecomendaciones) 
    { 
          $temp = $this->conn->getTable('DatEvalprocesorecomendaciones')->find($idprocesorecomendaciones); 
           return $temp->toArray(); 

    } 
 
   public function GetTodos() 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('DatEvalprocesorecomendaciones')->execute (); 
          return $result->toArray(); 

    } 
 
   public function GetPorLimite($limite = 10,$inicio = 0) 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('DatEvalprocesorecomendaciones')->limit($limite = 10)->offset($inicio = 0)->execute (); 
          return $result->toArray();
    } 
	
	public function GetCantTotal() {//Devuelve la cantidad total que tiene la tabla
		try {
			$query = new Doctrine_Query ();
			$result = $query->select ('COUNT(idprocesorecomendaciones)')->from ('DatEvalprocesorecomendaciones')->execute ();
			$arr = $result->toArray ();
			return (is_array ($arr) ? $arr [0] ['COUNT'] : 0);
		} catch ( Doctrine_Exception $e ) {
			return $e;
		}
	}
	
	public function getRecomendacionesPE($iddefprocesoevaluativo, $limit=15, $start=0){
		$query = new Doctrine_Query ();
		$result = $query->select('prec.idprocesorecomendaciones, rec.idrecomendacion as idrecomendacion, rec.denom as denom, trec.idtiporecomendacion as idtiporecomendacion, trec.denom as tiporecomendacion')
					->from('DatEvalprocesorecomendaciones prec')
					->innerJoin('prec.NomEvalrecomendacion rec')
					->innerJoin('rec.NomEvaltiporecomendacion trec')
					->where("prec.iddefprocesoevaluativo = {$iddefprocesoevaluativo}")
					->orderBy('prec.idprocesorecomendaciones DESC')
					->limit($limit)
					->offset($start)
					->setHydrationMode(Doctrine::HYDRATE_ARRAY)
					->execute ();
        return $result;
	}
	
	public function getCantRecomendacionesPE($iddefprocesoevaluativo){
		try{
			$query = new Doctrine_Query (); 
			$result = $query->select('prec.idprocesorecomendaciones')
				->from('DatEvalprocesorecomendaciones prec')
					->innerJoin('prec.NomEvalrecomendacion rec')
					->innerJoin('rec.NomEvaltiporecomendacion trec')
					->where("prec.iddefprocesoevaluativo = {$iddefprocesoevaluativo}")
					->count();
			return $result;
        }
        catch ( Doctrine_Exception $e ) {
			return $e;
		}
	}
 
}//fin clase 
?>


