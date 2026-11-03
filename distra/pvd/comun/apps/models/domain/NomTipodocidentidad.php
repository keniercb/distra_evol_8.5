<?php 
class NomTipodocidentidad extends BaseNomTipodocidentidad
 { 
   public function setUp() 
    {   parent::setUp(); 
         $this->hasOne('DatPersonadocidentidad', array('local'=>'idtipodocidentidad','foreign'=>'idtipodocidentidad')); 
         $this->hasOne('DatPersonanumeroidentidad', array('local'=>'idtipodocidentidad','foreign'=>'idtipodocidentidad')); 


    } 
 
   public function Buscar($idtipodocidentidad) 
    { 
          $temp = $this->conn->getTable('NomTipodocidentidad')->find($idtipodocidentidad); 
           return $temp->toArray(); 

    } 
 
   public function GetTodos() 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('NomTipodocidentidad')->execute (); 
          return $result->toArray(); 

    } 
 
   public function GetPorLimite($limite = 10,$inicio = 0) 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('NomTipodocidentidad')->limit($limite = 10)->offset($inicio = 0)->execute (); 
          return $result->toArray(); 

    } 
 
}//fin clase 
?>


