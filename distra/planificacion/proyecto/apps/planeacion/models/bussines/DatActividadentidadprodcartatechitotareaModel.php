<?php 
/* 
* Esta clase ha sido generada por Doctrine Generator 
*/ 
class DatActividadentidadprodcartatechitotareaModel extends ZendExt_Model 
 { 
   public function init() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Guardar($DatActividadentidadprodcartatechitotarea) 
    { 
            $DatActividadentidadprodcartatechitotarea->save();
    } 
 
   public function Eliminar($DatActividadentidadprodcartatechitotarea) 
    { 
            $DatActividadentidadprodcartatechitotarea->delete();
    } 
 }

