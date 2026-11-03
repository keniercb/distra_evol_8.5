<?php 
class DatElementoExpresionmatematica extends BaseDatElementoExpresionmatematica
 { 
   public function setUp() 
    { 
       parent::setUp();    
	   $this->hasMany('DatExpresionmatematica',array('local'=>'idexpresionmatematica','foreign'=>'idexpresionmatematica')); 	    	   
    }
 
   public function Buscar($idelementoexpresionmatematica){ 
	  $temp = $this->conn->getTable('DatElementoExpresionmatematica')->find($idelementoexpresionmatematica); 
	  return $temp; 
    } 

	public function GetTodosporExpresionMatematica($idexpresionmatematica){   
		$sql = "select * from mod_utiles.dat_elementoexpresionmatematica where idexpresionmatematica = {$idexpresionmatematica} order by orden;";
		$mg = Doctrine_Manager::getInstance();
		$conn = $mg->getCurrentConnection();
		$result = $conn->fetchAll($sql);
		return $result; 
    }
    
    public function GetIndicadoresporExpresionMatematica($idexpresionmatematica){   
		$sql = "select * from mod_utiles.dat_elementoexpresionmatematica where idexpresionmatematica = {$idexpresionmatematica} and tipoelemento = 6 order by orden;";
		$mg = Doctrine_Manager::getInstance();
		$conn = $mg->getCurrentConnection();
		$result = $conn->fetchAll($sql);
		return $result; 
    }
  
}//fin clase 
?>
