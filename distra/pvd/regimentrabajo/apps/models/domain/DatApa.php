<?php 
class DatApa extends BaseDatApa
 { 
   public function setUp() 
    {   parent::setUp();         
    } 
 
   public function GetTodos() 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('DatApa')->execute (); 
          return $result->toArray(); 

    } 
 


}//fin clase 
?>


