<?php 
class DatUbicacionvivienda extends BaseDatUbicacionvivienda
 { 
   public function setUp() 
    {   parent::setUp(); 
         $this->hasMany('DatRegnumericoactivo', array('local'=>'idregnumerico','foreign'=>'idregnumerico')); 
         $this->hasMany('NomDpt', array('local'=>'idprovincia','foreign'=>'iddpt')); 

    } 
 
/*   public function GetLLave()
    { 
          $query = new Doctrine_Query (); 
          $result = $query ->select('MAX('idregnumerico')')->from('DatUbicacionvivienda')->execute(); 
          $arr = $result->toArray(); 
          return (is_array($arr) ? $arr[0]['MAX'] + 1 : 1); 

    } 
 
   public function GetTodos() 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('DatUbicacionvivienda')->execute (); 
          return $result->toArray(); 

    } */
 
 
}//fin clase 
?>


