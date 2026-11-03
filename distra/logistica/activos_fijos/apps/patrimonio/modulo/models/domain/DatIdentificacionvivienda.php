<?php 
class DatIdentificacionvivienda extends BaseDatIdentificacionvivienda
 { 
   public function setUp() 
    {   parent::setUp(); 
         $this->hasMany('DatRegnumericoactivo', array('local'=>'idregnumerico','foreign'=>'idregnumerico'));
         $this->hasMany('NomRegimenPatrimonio', array('local'=>'idregimen','foreign'=>'idregimen')); 

    } 
 
   /*public function GetLLave()
    { 
          $query = new Doctrine_Query (); 
          $result = $query ->select('MAX('idregnumerico')')->from('DatIdentificacionvivienda')->execute(); 
          $arr = $result->toArray(); 
          return (is_array($arr) ? $arr[0]['MAX'] + 1 : 1); 

    } 
 
   public function GetTodos() 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('DatIdentificacionvivienda')->execute (); 
          return $result->toArray(); 

    } */
 
 
}//fin clase 
?>


