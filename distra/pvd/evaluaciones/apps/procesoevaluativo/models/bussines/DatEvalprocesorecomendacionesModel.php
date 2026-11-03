<?php 
class DatEvalprocesorecomendacionesModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(DatEvalprocesorecomendaciones $DatEvalprocesorecomendaciones) 
    { 
            $DatEvalprocesorecomendaciones->save();
    } 
 
   public function Actualizar(DatEvalprocesorecomendaciones $DatEvalprocesorecomendaciones) 
    { 
            $DatEvalprocesorecomendaciones->save();
    } 
 
   public function Eliminar($DatEvalprocesorecomendaciones) 
    { 
            $DatEvalprocesorecomendaciones->delete();
    } 
	  
 }

