<?php 
class DatEvalprocesomodelos extends BaseDatEvalprocesomodelos
 { 
   public function setUp() 
    {   parent::setUp(); 
         //$this->hasMany('DatEvalmodelo', array('local'=>'idmodelo','foreign'=>'idmodelo')); 
         $this->hasMany('DatEvaldefprocesoevaluativo', array('local'=>'iddefprocesoevaluativo','foreign'=>'iddefprocesoevaluativo')); 

    } 
 
   public function Buscar($idevalprocesomodelos) 
    { 
          $temp = $this->conn->getTable('DatEvalprocesomodelos')->find($idevalprocesomodelos); 
           return $temp->toArray(); 

    } 
 
   public function GetTodos() 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('DatEvalprocesomodelos')->execute (); 
          return $result->toArray(); 

    } 
 
   public function GetPorLimite($limite = 10,$inicio = 0) 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('DatEvalprocesomodelos')->limit($limite = 10)->offset($inicio = 0)->execute (); 
          return $result->toArray(); 

    } 
 
}//fin clase 
?>


