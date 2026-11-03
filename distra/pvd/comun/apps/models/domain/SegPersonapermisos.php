<?php 
class SegPersonapermisos extends BaseSegPersonapermisos
 { 
   public function setUp() 
    {   parent::setUp(); 
         $this->hasOne('DatPersona', array('local'=>'idpersona','foreign'=>'idpersona')); 

    } 
 
   public function Buscar($idpersonaafeccion) 
    { 
          $temp = $this->conn->getTable('SegPersonapermisos')->find($idpersonaafeccion); 
           return $temp->toArray(); 

    } 
 
   public function GetTodos() 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('SegPersonapermisos')->execute (); 
          return $result->toArray(); 

    } 
 
   public function GetPorLimite($limite = 10,$inicio = 0) 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('SegPersonapermisos')->limit($limite = 10)->offset($inicio = 0)->execute (); 
          return $result->toArray(); 

    } 
 public function GetSeguridadXPersona($idusuario) 
    { 
        $query = new Doctrine_Query (); 
        $result = $query->select('p.permiso')
	    ->from('SegPersonapermisos p')
		->where("p.idusuario = ?",array($idusuario))
		->execute (); 		
		return $result->toArray(); 
    } 
    
  public function BuscarXIdUsuario($idusuario) 
    { 
        $query = new Doctrine_Query (); 
        $result = $query->select('p.idpersonapermisos')
	    ->from('SegPersonapermisos p')
		->where("p.idusuario = ?",array($idusuario))
		->execute ();
		$arrR = $result->toArray(); 
        //print_r($arrR);die;
        return $arrR[0]['idpersonapermisos'];
    }
}//fin clase 
?>


