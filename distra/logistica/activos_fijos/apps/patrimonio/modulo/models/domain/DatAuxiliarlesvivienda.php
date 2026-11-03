<?php 
class DatAuxiliarlesvivienda extends BaseDatAuxiliarlesvivienda
 { 
   public function setUp() 
    {   parent::setUp(); 
         $this->hasMany('DatRegnumericoactivo', array('local'=>'idregnumerico','foreign'=>'idregnumerico')); 
         $this->hasMany('NomOcupacionViv', array('local'=>'idocupacionviv','foreign'=>'idocupacionviv'));
         $this->hasMany('NomVinculacionLaboral', array('local'=>'idvinculacionlaboral','foreign'=>'idvinculacionlaboral'));

    } 
 
 /*  public function GetLLave()
    { 
          $query = new Doctrine_Query (); 
          $result = $query ->select('MAX('idregnumerico')')->from('DatAuxiliarlesvivienda')->execute(); 
          $arr = $result->toArray(); 
          return (is_array($arr) ? $arr[0]['MAX'] + 1 : 1); 

    } 
 
   public function GetTodos() 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('DatAuxiliarlesvivienda')->execute (); 
          return $result->toArray(); 

    } */
 
 
}//fin clase 
?>


