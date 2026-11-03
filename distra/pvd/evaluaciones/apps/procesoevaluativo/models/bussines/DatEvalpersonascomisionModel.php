<?php 
class DatEvalpersonascomisionModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(DatEvalpersonascomision $DatEvalpersonascomision) 
    { 
            $DatEvalpersonascomision->save();
    } 
 
   public function Actualizar(DatEvalpersonascomision $DatEvalpersonascomision) 
    { 
            $DatEvalpersonascomision->save();
    } 
 
   public function Eliminar($idpersona) 
    { 
		try{
			$query = Doctrine_Query::create()
                    ->delete('DatEvalpersonascomision pc')
                    ->where('pc.idpersona = ?', $idpersona);               
			       
			$query->execute();
		}catch(Doctrine_Exception $e){
			throw $e;
		}
    } 
 }

