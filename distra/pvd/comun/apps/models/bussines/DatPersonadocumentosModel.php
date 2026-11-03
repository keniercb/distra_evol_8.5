<?php 
class DatPersonadocumentosModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(DatPersonadocumentos $DatPersonadocumentos) 
    { 
            $DatPersonadocumentos->save();
    } 
 
   public function Actualizar(DatPersonadocumentos $DatPersonadocumentos) 
    { 
            $DatPersonadocumentos->save();
    } 
 
   public function Eliminar($DatPersonadocumentos) 
    { 
            $DatPersonadocumentos->delete();
    } 
 }

