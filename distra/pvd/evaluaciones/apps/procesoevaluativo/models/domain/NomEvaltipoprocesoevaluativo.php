<?php 
class NomEvaltipoprocesoevaluativo extends BaseNomEvaltipoprocesoevaluativo
 { 
   public function setUp() 
    { 
       parent::setUp();
    } 
 
   public function Buscar($idtipoprocesoevaluativo) 
    { 
          $temp = $this->conn->getTable('NomEvaltipoprocesoevaluativo')->find($idtipoprocesoevaluativo); 
           return $temp->toArray(); 

    } 
 
   public function GetTodos() 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('NomEvaltipoprocesoevaluativo')->execute (); 
          return $result->toArray(); 

    } 
 
   public function GetPorLimite($limite,$inicio = 0) 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('NomEvaltipoprocesoevaluativo')
		  ->orderBy('idtipoprocesoevaluativo DESC')
		  ->limit($limite)
		  ->offset($inicio)->execute (); 
          return $result->toArray(); 
    } 
	
	public function filtrarTiposProcesos($filtro, $limite = 10,$inicio = 0) 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('NomEvaltipoprocesoevaluativo pe')
				->where("pe.denom ILIKE '%$filtro%' OR pe.descripcion ILIKE '%$filtro%'")
				->orderBy('pe.idtipoprocesoevaluativo DESC')
				->limit($limite)
				->offset($inicio)
				->execute (); 
          return $result->toArray(); 
    } 
	
	public function cantidadProcesosFiltro($filtro) {
		try {
			$query = new Doctrine_Query ();
			$result = $query->select ('COUNT(pe.idtipoprocesoevaluativo)')
				->from ('NomEvaltipoprocesoevaluativo pe')
				->where("pe.denom ILIKE '%$filtro%' OR pe.descripcion ILIKE '%$filtro%'")
				->execute ();
			$arr = $result->toArray ();
			return (is_array ($arr) ? $arr [0] ['COUNT'] : 0);
		} catch ( Doctrine_Exception $e ) {
			return $e;
		}
	}
	
	public function GetCantTotal() {//Devuelve la cantidad total que tiene la tabla
		try {
			$query = new Doctrine_Query ();
			$result = $query->select ('COUNT(idtipoprocesoevaluativo)')->from ('NomEvaltipoprocesoevaluativo')->execute ();
			$arr = $result->toArray ();
			return (is_array ($arr) ? $arr [0] ['COUNT'] : 0);
		} catch ( Doctrine_Exception $e ) {
			return $e;
		}
	}
	
	public function ExisteDenomTipoProceso($denom){
		  $query = new Doctrine_Query (); 
          $result = $query->from('NomEvaltipoprocesoevaluativo e')
						  ->where('e.denom = ?', $denom)
						  ->execute ();
          return $result->toArray();
    }

    public function ExisteDenomTipoProcesoMod($id,$denom){
		  $query = new Doctrine_Query (); 
          $result = $query->from('NomEvaltipoprocesoevaluativo e')
						  ->where("e.idtipoprocesoevaluativo <> '$id' and   e.denom = '$denom' ")
						  ->execute ();
          return $result->toArray();
    }
	 
   
}//fin clase 
?>


