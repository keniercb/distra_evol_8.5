<?php 
class NomEvaltiporecomendacion extends BaseNomEvaltiporecomendacion
 { 
   public function setUp() 
    {   parent::setUp(); 
         $this->hasOne('NomEvalrecomendacion', array('local'=>'idtiporecomendacion','foreign'=>'idtiporecomendacion')); 

    } 
 
   public function Buscar($idrecursoevaluativo) 
    { 
          $temp = $this->conn->getTable('NomEvaltiporecomendacion')->find($idrecursoevaluativo); 
           return $temp->toArray(); 

    } 
 
   public function GetTodos() 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('NomEvaltiporecomendacion')->execute (); 
          return $result->toArray(); 
    } 
	public function GetCantTotal() {
		try {
			$query = new Doctrine_Query ();
			$result = $query->select ('COUNT(idtiporecomendacion)')->from ('NomEvaltiporecomendacion')->execute ();
			$arr = $result->toArray ();
			return (is_array ($arr) ? $arr [0] ['COUNT'] : 0);
		} catch ( Doctrine_Exception $e ) {
			return $e;
		}
	}
 
   public function GetPorLimite($limite = 15,$inicio = 0) 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('NomEvaltiporecomendacion')
							->orderBy('idtiporecomendacion DESC')
							->limit($limite)->offset($inicio)->execute (); 
          return $result->toArray(); 
    } 
	
	public function ExisteDenomTipoRecon($denom){
		  $query = new Doctrine_Query (); 
          $result = $query->from('NomEvaltiporecomendacion e')
						  ->where("e.denom = '$denom'")
						  ->execute ();
          return $result->toArray();
    }
	
	public function TipoRecomendacionEnUso($idTRec)
	{
	      $query = new Doctrine_Query (); 
          $result = $query->from('NomEvaltiporecomendacion tr')
						->innerJoin('tr.NomEvalrecomendacion r')
						->innerJoin('r.DatEvalprocesorecomendaciones pr')
						->where("tr.idtiporecomendacion='$idTRec'")
						->execute(); 
          return $result->toArray(); 
	}
	
	public function buscarTipoRecomendacion($filtro,$limite = 15,$inicio = 0){
		$query = new Doctrine_Query (); 
		$result = $query->from('NomEvaltiporecomendacion tr')
					  ->where("tr.denom ILIKE '%$filtro%' OR tr.descripcion ILIKE '%$filtro%'")
					  ->orderBy('idtiporecomendacion DESC')
					  ->limit($limite)
					  ->offset($inicio)
					  ->execute (); 
		return $result->toArray(); 
	}
	
	public function buscarGetCantTotal($filtro) {
		try {
			$query = new Doctrine_Query ();
			$result = $query->select ('COUNT(tr.idtiporecomendacion)')->from ('NomEvaltiporecomendacion tr')
					->where("tr.denom ILIKE '%$filtro%' OR tr.descripcion ILIKE '%$filtro%'")
					->execute ();
			$arr = $result->toArray ();
			return (is_array ($arr) ? $arr [0] ['COUNT'] : 0);
		} catch ( Doctrine_Exception $e ) {
			return $e;
		}
	}
 
}//fin clase 
?>


