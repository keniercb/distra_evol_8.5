<?php 
class DatExpresionmatematicaevalsel extends BaseDatExpresionmatematicaevalsel{ 

    public function setUp() { 
		parent::setUp();  
        $this->hasMany("DatElementoExpresionmatematicaevalsel",array('local'=>'idexpresionmatematica','foreign'=>'idexpresionmatematica'));  
	} 
 	

	public function Buscar($idexpresionmatematicaevalsel){ 
		try {			
			$temp = Doctrine::getTable('DatExpresionmatematicaevalsel')->find($idexpresionmatematicaevalsel);
			return $temp;        
		} 
		catch(Doctrine_Exception $e) { 
			return $e; 
		}
	} 

    public function GetTodos(){   
		$sql = "select * from mod_evaluaciones.dat_expresionmatematicaevalsel ;";
		$mg = Doctrine_Manager::getInstance();
		$conn = $mg->getCurrentConnection();
		$result = $conn->fetchAll($sql);
		return $result; 
    }
	public function GetTodosporarrIdExpMat($arrIdexpresionmatematicaevalsel){   
		$sql = "select * from mod_evaluaciones.dat_expresionmatematicaevalsel where idexpresionmatematica in (".implode(',',$arrIdexpresionmatematicaevalsel).");";
		$mg = Doctrine_Manager::getInstance();
		$conn = $mg->getCurrentConnection();
		$result = $conn->fetchAll($sql);
		return $result; 
    }
}//fin clase 
?>
