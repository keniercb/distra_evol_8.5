<?php 
class NomEvalindicadortexto extends BaseNomEvalindicadortexto
 { 
   public function setUp() 
    {   parent::setUp(); 
         $this->hasMany('DatEvaldominioevaluativo', array('local'=>'iddominioevaluativo','foreign'=>'iddominioevaluativo')); 

    } 
 
   public function Buscar($idindicadortexto) 
    { 
          $temp = $this->conn->getTable('NomEvalindicadortexto')->find($idindicadortexto); 
           return $temp->toArray(); 

    } 
 
   public function GetTodos() 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('NomEvalindicadortexto')
                  ->orderBy('idindicadortexto DESC')
                  ->execute (); 
          return $result->toArray(); 

    } 
	
	public function GetCantTotal() {
		try {
			$query = new Doctrine_Query ();
			$result = $query->select ('COUNT(idindicadortexto)')->from ('NomEvalindicadortexto')->execute ();
			$arr = $result->toArray ();
			return (is_array ($arr) ? $arr [0] ['COUNT'] : 0);
		} catch ( Doctrine_Exception $e ) {
			return $e;
		}
	}
 
   public function GetPorLimite($limite = 15,$inicio = 0) 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('NomEvalindicadortexto')
                  ->orderBy('idindicadortexto DESC')
                  ->limit($limite)
                  ->offset($inicio)->execute (); 
          return $result->toArray(); 
    } 
	
	
	public function existeCodDenomIndicadorT($cod, $denom) 
    { 	
        $strWhere = "denom = '$denom'";
        if(!empty($cod)){
           $strWhere .= " OR codigo = '$cod'";
        }        
        $query = new Doctrine_Query (); 
          $result = $query->from('NomEvalindicadortexto')
						  ->where($strWhere)
                      ->orderBy('idindicadortexto DESC')
						  ->execute (); 
          return $result->toArray();        
    }
	
	public function IndicadorTEnUso($idindicadortexto) 
    { 
		$query = new Doctrine_Query (); 
          $result = $query->from('DatEvalindicadoresplanilla')
						  ->where("idindicador = '$idindicadortexto'")
						  ->execute (); 
          return $result->toArray();
    }
	
	public function ObtenerIndicadorTBuscado($denominacion, $limit, $start)
    { 
        $query = Doctrine_Query::create();
		$datos = $query->select('it.idindicadortexto,it.codigo,it.denom,it.descripcion,it.fechainicio,it.fechafin,it.iddominioevaluativo')->from('NomEvalindicadortexto it')->where("it.denom ilike '%$denominacion%'")->orderby('it.idindicadortexto DESC')->limit($limit)->offset($start)->execute();
        return $datos->toArray();
    }
    
    public function ObtenerCantidadIndicadorTBuscado($denominacion)
    { 
        $query = Doctrine_Query::create();
		$result = $query->select('COUNT(it.idindicadortexto)')->from('NomEvalindicadortexto it')->where("it.denom ilike '%$denominacion%'")->execute();
        $arr = $result->toArray ();
        return (is_array ($arr) ? $arr [0] ['COUNT'] : 0);
    }
	
	public  function contarcodigo($cod)
    {
		$query = Doctrine_Query::create();
		$cantCod = $query->from('NomEvalindicadortexto')->where("codigo = ?",$cod)->count();
		
    return $cantCod;
    }
	
	public function getArrIndicadoresPorId($arrIndTexto) {
		$varAux = "";
		$bandera = false;
		for($i =0; $i<count($arrIndTexto); $i++){
			$varAux .= ($bandera ? ", ":"").$arrIndTexto[$i];
			$bandera = true;
		}
		$query = new Doctrine_Query();
		$arrResult = $query->select ('it.denom, it.descripcion, it.codigo, it.idindicadortexto')
			->from ('NomEvalindicadortexto it')
			->where ("it.idindicadortexto = any (array[$varAux])")
			->setHydrationMode( Doctrine:: HYDRATE_ARRAY )
			->execute();		
		return $arrResult;
	}
 
}