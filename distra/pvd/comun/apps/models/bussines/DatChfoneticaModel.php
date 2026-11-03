<?php 
class DatChfoneticaModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar($object) 
    { 
         try{   
			$object->save();
			return $objet->idfonetica;
         }
         catch (Doctrine_Exception $e)
         {
            //$this->conn->rollback();
            throw $e;
         }
    }  
 
   public function Actualizar($object) 
    {
         try{   
			$object->save();
			return $objet->idfonetica;
         }
         catch (Doctrine_Exception $e)
         {
            //$this->conn->rollback();
            throw $e;
         }
    } 
 
   public function Eliminar($DatChfonetica) 
    { 
            $DatChfonetica->delete();
    } 
 }//fin clase 
?>

