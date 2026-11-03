<?php 
class NomEvaltiposenyalamiento extends BaseNomEvaltiposenyalamiento
 { 
   public function setUp() 
    {   parent::setUp(); 
         $this->hasOne('NomEvalsenyalamiento', array('local'=>'idtiposenyalamiento','foreign'=>'idtiposenyalamiento')); 

    } 
 
   public function Buscar($idtiposenyalamiento) 
    { 
          $temp = $this->conn->getTable('NomEvaltiposenyalamiento')->find($idtiposenyalamiento); 
           return $temp->toArray(); 

    } 
 
   public function GetTodos() 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('NomEvaltiposenyalamiento')->execute (); 
          return $result->toArray(); 
    } 
	
	public function GetCantTotal() {
		try {
			$query = new Doctrine_Query ();
			$result = $query->select ('COUNT(idtiposenyalamiento)')->from ('NomEvaltiposenyalamiento')->execute ();
			$arr = $result->toArray ();
			return (is_array ($arr) ? $arr [0] ['COUNT'] : 0);
		} catch ( Doctrine_Exception $e ) {
			return $e;
		}
	}
	
   public function GetPorLimite($limite = 15,$inicio = 0) 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('NomEvaltiposenyalamiento')
							->orderBy('idtiposenyalamiento DESC')
							->limit($limite)->offset($inicio)->execute (); 
          return $result->toArray(); 
    }

	public function filtrarTipoSenyalamiento($filtro,$limite = 15,$inicio = 0) 
    { 
		$query = new Doctrine_Query (); 
		$result = $query->from('NomEvaltiposenyalamiento ts')
				->where("ts.denom ILIKE '%$filtro%' OR ts.descripcion ILIKE '%$filtro%'")
				->orderBy('idtiposenyalamiento DESC')
				->limit($limite)->offset($inicio)->execute (); 
		return $result->toArray(); 
    }
	
	public function cantidadFiltroTipoSenyalamiento($filtro) {
		try {
			$query = new Doctrine_Query ();
			$result = $query->select ('COUNT(ts.idtiposenyalamiento)')->from ('NomEvaltiposenyalamiento ts')
			->where("ts.denom ILIKE '%$filtro%' OR ts.descripcion ILIKE '%$filtro%'")
			->execute ();
			$arr = $result->toArray ();
			return (is_array ($arr) ? $arr [0] ['COUNT'] : 0);
		} catch ( Doctrine_Exception $e ) {
			return $e;
		}
	}
	
	public function ExisteDenomTipoSenya($denom){
		  $query = new Doctrine_Query (); 
          $result = $query->from('NomEvaltiposenyalamiento e')
						  ->where("e.denom = '$denom'")
						  ->execute();
          return $result->toArray();
    }

    public function ExisteDenomTipoSenyaMod($id,$denom){
		  $query = new Doctrine_Query (); 
          $result = $query->from('NomEvaltiposenyalamiento e')
						  ->where("e.denom = '$denom' and e.idtiposenyalamiento <> '$id'")
						  ->execute();
          return $result->toArray();
    }
	
	public function TipoSenyalamientoEnUso($idTSen)
	{
	      $query = new Doctrine_Query (); 
          $result = $query->from('NomEvaltiposenyalamiento ts')
					->innerJoin('ts.NomEvalsenyalamiento s')
					->innerJoin('s.DatEvalprocesoresenyalamiento ps')
					->where("ts.idtiposenyalamiento='$idTSen'")
					->execute (); 
          return $result->toArray(); 
	}
	
}//fin clase 
?>


