<?php 
class DatEvalreferenciaregla extends BaseDatEvalreferenciaregla
 { 
   public function setUp() 
    {   parent::setUp(); 
         $this->hasMany('DatEvalregla', array('local'=>'idregla','foreign'=>'idregla')); 
         $this->hasMany('NomEvaltiporeferencia', array('local'=>'idtiporeferencia','foreign'=>'idtiporeferencia')); 

    } 
 
   public function Buscar($idreferenciaregla) 
    { 
          $temp = $this->conn->getTable('DatEvalreferenciaregla')->find($idreferenciaregla); 
           return $temp->toArray();
    } 
 
   public function GetTodos() 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('DatEvalreferenciaregla')->execute (); 
          return $result->toArray();
    } 
 
   public function GetPorLimite($limite = 100,$inicio = 0) 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('DatEvalreferenciaregla')->limit($limite = 100)->offset($inicio = 0)->execute (); 
          return $result->toArray(); 
    }

	public function getEvalRefporIDRegla($idregla){
		$query = new Doctrine_Query ();
        return $query->from('DatEvalreferenciaregla rr')
				->where("rr.idregla = '$idregla'")
				->execute ();
	}
	
	public function getEvalRefporIDReglaArr($idregla){
		$query = new Doctrine_Query ();
        $result = $query->from('DatEvalreferenciaregla rr')
				->where("rr.idregla = '$idregla'")
				->execute ();
		return $result->toArray(); 
	}
	
 
}