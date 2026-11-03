<?php 
class DatPersonaconfdocumentosModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(DatPersonaconfdocumentos $DatPersonaconfdocumentos) 
    { 
            $DatPersonaconfdocumentos->save();
    } 
 
   public function Actualizar(DatPersonaconfdocumentos $DatPersonaconfdocumentos) 
    { 
            $DatPersonaconfdocumentos->save();
    } 
 
   public function Eliminar($DatPersonaconfdocumentos) 
    { 
            $DatPersonaconfdocumentos->delete();
    } 
 }

