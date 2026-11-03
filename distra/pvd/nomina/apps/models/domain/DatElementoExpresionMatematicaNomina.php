<?php 
class DatElementoExpresionMatematicaNomina extends BaseDatElementoExpresionMatematicaNomina
 { 
   public function setUp() 
    { 
       parent::setUp();    
	   $this->hasMany('DatExpresionMatematicaNomina',array('local'=>'idexpresionmatematica','foreign'=>'idexpresionmatematica'));
    }
 
   public function Buscar($idelementoexpresionmatematica){
	   {
		   try {
			   $temp = Doctrine::getTable('DatElementoExpresionMatematicaNomina')->find($idelementoexpresionmatematica);
			   return $temp;
		   } catch (Doctrine_Exception $e) {
			   return $e;
		   }
	   }
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
	public function obtenerElementosFormula($idexpresionmatematica) {
		$sql = "select * from mod_utiles.dat_elementoexpresionmatematica deem
            where deem.idexpresionmatematica = ?";
		$mg = Doctrine_Manager::getInstance();
		$conn = $mg->getCurrentConnection();
		$r = $conn->fetchAll($sql, array($idexpresionmatematica));
		return $r;
	}
}

