<?php 
class CubRegistronumerico extends BaseCubRegistronumerico
 { 
   public function setUp() 
    {   parent::setUp(); 
         $this->hasMany('DimActividad', array('local'=>'idactividad','foreign'=>'idactividad')); 
         $this->hasMany('DimEstructura', array('local'=>'idarearesp','foreign'=>'idestructura')); 
         $this->hasMany('DimCategoria', array('local'=>'idcategoria','foreign'=>'idcategoria')); 
         $this->hasMany('DimDocumento', array('local'=>'iddocumentos','foreign'=>'iddocumento')); 
         $this->hasMany('DimEstatustecnico', array('local'=>'idestatustecnico','foreign'=>'idestatustecnico')); 
         $this->hasMany('DimTiempo', array('local'=>'idtiempo','foreign'=>'idtiempo')); 

    } 
 
 
}

