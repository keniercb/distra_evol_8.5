<?php 
class DatConstruccionvivienda extends BaseDatConstruccionvivienda
 { 
   public function setUp() 
    {   parent::setUp(); 
         $this->hasMany('NomMaterialesconstruccion', array('local'=>'idparedesde','foreign'=>'idmaterialesconstruccion')); 
         $this->hasMany('NomTipologia', array('local'=>'idtipologia','foreign'=>'idtipologia')); 
         $this->hasMany('DatRegnumericoactivo', array('local'=>'idregnumerico','foreign'=>'idregnumerico')); 
         $this->hasMany('NomMaterialesconstruccion', array('local'=>'idtechode','foreign'=>'idmaterialesconstruccion')); 
         $this->hasMany('NomSistemaconstructivo', array('local'=>'idsistemaconstructivo','foreign'=>'idsistemaconstructivo')); 
         $this->hasMany('NomEstatustecnico', array('local'=>'idestatustecnico','foreign'=>'idestatustecnico')); 
        // $this->hasMany('NomTipoconstruccion', array('local'=>'idtipoconstruccion','foreign'=>'idtipoconstruccion'));

    } 
 
   /*public function GetLLave()
    { 
          $query = new Doctrine_Query (); 
          $result = $query ->select('MAX('idregnumerico')')->from('DatConstruccionvivienda')->execute(); 
          $arr = $result->toArray(); 
          return (is_array($arr) ? $arr[0]['MAX'] + 1 : 1); 

    } */
 
   public function GetTodos() 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('DatConstruccionvivienda')->execute (); 
          return $result->toArray(); 

    } 
 
 
}//fin clase 
?>


