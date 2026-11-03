<?php 
class SegPersonaaccesoindominio extends BaseSegPersonaaccesoindominio
 { 
   public function setUp() 
    {   parent::setUp(); 
         $this->hasOne('DatPersona', array('local'=>'idpersona','foreign'=>'idpersona')); 

    } 
 
   public function Buscar($idpersonaafeccion) 
    { 
          $temp = $this->conn->getTable('SegPersonaaccesoindominio')->find($idpersonaafeccion); 
           return $temp->toArray(); 

    } 
 
   public function GetTodos() 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('SegPersonaaccesoindominio')->execute (); 
          return $result->toArray(); 

    } 
 
   public function GetPorLimite($limite = 10,$inicio = 0) 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('SegPersonaaccesoindominio')->limit($limite = 10)->offset($inicio = 0)->execute (); 
          return $result->toArray(); 

    } 
 public function GetPerAccesoXPersona($idpersona,$idusuario) 
    { 
        $query = new Doctrine_Query (); 
        $result = $query->from('SegPersonaaccesoindominio p')
		->where("p.idpersona = ? or p.idusuario = ?",array($idpersona, $idusuario))
		->execute (); 		
		return $result->toArray(); 
    } 
    
  public function BuscarXIdPersonaAcceso($idpersonaacceso) 
    { 
        $query = new Doctrine_Query (); 
        $result = $query->from('SegPersonaaccesoindominio p')
		->where("p.idpersonaacceso = ?",array($idpersonaacceso))
		->execute ();
		$arrR = $result->toArray(); 
        return $arrR;
    }
}//fin clase 
?>


