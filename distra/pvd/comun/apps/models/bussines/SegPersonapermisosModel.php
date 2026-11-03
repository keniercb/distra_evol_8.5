<?php 
class SegPersonapermisosModel extends ZendExt_Model
 { 
	 public function SegPersonapermisosModel()
   {
        parent::ZendExt_Model();
   }
   
   public function GetSeguridadXPersona($idpersona,$idusuario){
		$objAux = new SegPersonapermisos();
		return $objAux->GetSeguridadXPersona($idpersona,$idusuario);
   }
   
   public function Insertar(SegPersonapermisos $SegPersonapermisos)
   {
         $this->conn->beginTransaction();
         try
         {
            $SegPersonapermisos->save();
            $this->conn->commit();
            return true;
         }
         catch (Doctrine_Exception $e)
         {
            $this->conn->rollback();
            throw $e;
         }
   }
 
   public function Actualizar(SegPersonapermisos $SegPersonapermisos)
   {
         $this->conn->beginTransaction();
         try
         {
            $SegPersonapermisos->save();
            $this->conn->commit();
            return true;
         }
         catch (Doctrine_Exception $e)
         {
            $this->conn->rollback();
            throw $e;
         }
   }
   
   public function cambiarPermisos($idpersona, $idusuario, $idpersonaviejo){
       $objSP = new SegPersonapermisos();
       if($idpersonaviejo){        
        $idtabla = $objSP->BuscarXIdUsuario($idusuario);
        $objdomain = Doctrine::getTable( 'SegPersonapermisos' )->find($idtabla);
        $objdomain->idpersona = $idpersona;
        $objdomain->permiso = 2; 
        //Actualizo en la tabla seg_personapermisos       
        return $this->Actualizar($objdomain);
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "UPDATE mod_persona.seg_personaaccesosindominio SET idpersona={$idpersona} where idpersona={$idpersonaviejo}";
        //Actualizo en la tabla seg_personaaccesosindominio
        $conn->fetchAll($sql);
       }
       else{
        $objSP->idusuario = $idusuario;
        $objSP->idpersona = $idpersona;
        $objSP->permiso = 2;
        return $this->Insertar($objSP);
       } 
      
   }
 
   
 
}//fin clase 
?>


