<?php 
class DatElementoExpresionmatematicaevalsel extends BaseDatElementoExpresionmatematicaevalsel
 { 
   public function setUp() 
    { 
       parent::setUp();    
	   $this->hasMany('DatExpresionmatematicaevalsel',array('local'=>'idexpresionmatematica','foreign'=>'idexpresionmatematica')); 	    	   
    }
 
   public function Buscar($idelementoexpresionmatematicaevalsel){ 
	  $temp = $this->conn->getTable('DatElementoExpresionmatematicaevalsel')->find($idelementoexpresionmatematicaevalsel); 
	  return $temp; 
    } 

	public function GetTodosporExpresionMatematica($idexpresionmatematicaevalsel){   
		$sql = "select * from mod_evaluaciones.dat_elementoexpresionmatematicaevalsel where idexpresionmatematica = {$idexpresionmatematicaevalsel} order by orden;";
		$mg = Doctrine_Manager::getInstance();
		$conn = $mg->getCurrentConnection();
		$result = $conn->fetchAll($sql);
		return $result; 
    }
  
}//fin clase 
?>