<?php  
class NomEvalestado extends BaseNomEvalestado
 { 
   public function setUp() 
    {   parent::setUp(); 
         $this->hasOne('DatEvalplanillasevaluativas', array('local'=>'idestado','foreign'=>'idestado')); 
         $this->hasOne('DatEvalregla', array('local'=>'idestado','foreign'=>'idestado')); 
         $this->hasOne('DatEvalmodelo', array('local'=>'idestado','foreign'=>'idestado')); 

    } 
 
   public function Buscar($idestado) 
    { 
          $temp = Doctrine::getTable('NomEvalestado')->find($idestado); 
           return $temp->toArray(); 
   } 
 
   public function GetTodos() 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('NomEvalestado')->execute (); 
          return $result->toArray(); 

    } 
 
   public function GetPorLimite($limite = 3,$inicio = 0) 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('NomEvalestado')->limit($limite)->offset($inicio)->execute (); 
          return $result->toArray(); 

    } 
 
}