<?php
class DatEvalrecursoevaluativo extends BaseDatEvalrecursoevaluativo
 {
   public function setUp()
    {   parent::setUp();
         $this->hasOne('DatEvaldominioevaluativo', array('local'=>'idrecursoevaluativo','foreign'=>'idrecursoevaluativo'));

    }

   public function Buscar($idrecursoevaluativo)
    {
          $temp = $this->conn->getTable('DatEvalrecursoevaluativo')->find($idrecursoevaluativo);
           return $temp->toArray();

    }

   public function GetTodos()
    {
          $query = new Doctrine_Query ();
          $result = $query->from('DatEvalrecursoevaluativo')->execute ();
          return $result->toArray();
    }
	public function GetCantTotal() {//Devuelve la cantidad total que tiene la tabla
		try {
			$query = new Doctrine_Query ();
			$result = $query->select ('COUNT(idrecursoevaluativo)')->from ('DatEvalrecursoevaluativo')->execute ();
			$arr = $result->toArray ();
			return (is_array ($arr) ? $arr [0] ['COUNT'] : 0);
		} catch ( Doctrine_Exception $e ) {
			return $e;
		}
	}

   public function GetPorLimite($limite = 15,$inicio = 0)
    {
          $query = new Doctrine_Query ();
          $result = $query->from('DatEvalrecursoevaluativo')
                  ->orderBy('idrecursoevaluativo DESC')
                  ->limit($limite)->offset($inicio)->execute ();
          return $result->toArray();
    }

	public function existeRecurso($denom)
	{    
		$query = new Doctrine_Query ();
		$result = $query->from('DatEvalrecursoevaluativo e')
				->where("e.denom ILIKE '$denom'")        
				->execute();       
		return $result->toArray();
	}

    public function buscarDenominacion($denom,$limit,$offset){
        $q = new Doctrine_Query();
        $result = $q->from('DatEvalrecursoevaluativo')
                ->where("denom ILIKE '%$denom%'")
                ->limit($limit)
                ->offset($offset)
                ->execute()
                ->toArray();
        return $result;
    }

    public function cantDenominacion($denom){
        $q = new Doctrine_Query();
        $result = $q->from('DatEvalrecursoevaluativo')
                ->where("denom ILIKE '%$denom%'")
                //->execute()
                ->count();
        return $result;
    }
}