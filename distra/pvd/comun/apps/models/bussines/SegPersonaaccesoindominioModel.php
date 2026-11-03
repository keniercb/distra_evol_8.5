<?php 
class SegPersonaaccesoindominioModel extends ZendExt_Model
 { 
	 public function SegPersonaaccesoindominioModel()
   {
        parent::ZendExt_Model();
   }
   
   public function GetPerAccesoXPersona($idpersona,$idusuario){
		$objAux = new SegPersonaaccesoindominio();
		return $objAux->GetPerAccesoXPersona($idpersona,$idusuario);
   }
   
   public function Insertar(SegPersonaaccesoindominio $SegPersonaaccesoindominio)
   {
         $this->conn->beginTransaction();
         try
         {
            $SegPersonaaccesoindominio->save();
            $this->conn->commit();
            return true;
         }
         catch (Doctrine_Exception $e)
         {
            $this->conn->rollback();
            throw $e;
         }
   }
 
   public function Actualizar(SegPersonaaccesoindominio $SegPersonaaccesoindominio)
   {
         $this->conn->beginTransaction();
         try
         {
            $SegPersonaaccesoindominio->save();
            $this->conn->commit();
            return true;
         }
         catch (Doctrine_Exception $e)
         {
            $this->conn->rollback();
            throw $e;
         }
   }
   
   public function quitarPerAcceso($idpersonaacceso){
       $objdomain = new SegPersonaaccesoindominio();
        $arrTabDominio = $objdomain->BuscarXIdPersonaAcceso($idpersonaacceso);
        if(count($arrTabDominio) > 0){
           $objEliminar = Doctrine::getTable( 'SegPersonaaccesoindominio' )->find($arrTabDominio[0]['idpersonaaccesosindominio']);
           $objEliminar->delete();
        }
   }
 
   
 
}//fin clase 
?>


