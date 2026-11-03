<?php 
/* 
* Esta clase ha sido generada por Doctrine Generator 
*/ 
class DatAplicacioncartatecproyectoModel extends ZendExt_Model 
 { 
   public function init() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Guardar($DatAplicacioncartatecproyecto) 
    { 
            $DatAplicacioncartatecproyecto->save();
    } 
 
   public function Eliminar($DatAplicacioncartatecproyecto) 
    { 
            $DatAplicacioncartatecproyecto->delete();
    } 
 }

