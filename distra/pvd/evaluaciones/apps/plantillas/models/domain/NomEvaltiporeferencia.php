<?php 
class NomEvaltiporeferencia extends BaseNomEvaltiporeferencia
 { 
   public function setUp() 
    {   parent::setUp(); 
         $this->hasOne('DatEvalreferenciaregla', array('local'=>'idtiporeferencia','foreign'=>'idtiporeferencia')); 

    } 
 
   public function Buscar($idtiporeferencia) 
    { 
          $temp = $this->conn->getTable('NomEvaltiporeferencia')->find($idtiporeferencia); 
           return $temp->toArray(); 

    } 
 
   public function GetTodos() 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('NomEvaltiporeferencia')->execute (); 
          return $result->toArray(); 

    } 
 
   public function GetPorLimite($limite = 100,$inicio = 0) 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('NomEvaltiporeferencia')->limit($limite = 100)->offset($inicio = 0)->execute (); 
          return $result->toArray(); 

    } 
 
}