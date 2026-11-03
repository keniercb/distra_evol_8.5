<?php 
class DatEquiposmediosvivienda extends BaseDatEquiposmediosvivienda
 { 
   public function setUp() 
    {   parent::setUp(); 
         $this->hasMany('DatRegnumericoactivo', array('local'=>'idregnumerico','foreign'=>'idregnumerico')); 

    } 
/*
   public function GetLLave() 
    { 
          $query = new Doctrine_Query (); 
          $result = $query ->select('MAX('idequipomedio')')->from('DatEquiposmediosvivienda')->execute(); 
          $arr = $result->toArray(); 
          return (is_array($arr) ? $arr[0]['MAX'] + 1 : 1); 

    } 
 
   public function GetTodos() 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('DatEquiposmediosvivienda')->execute (); 
          return $result->toArray(); 

    } */
 
 
}//fin clase 
?>


