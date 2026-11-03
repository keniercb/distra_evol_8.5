<?php 
class DatPersonadocidentidadModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(DatPersonadocidentidad $DatPersonadocidentidad) 
    { 
        $DatPersonadocidentidad->save();
		return $DatPersonadocidentidad->idpersonaidentidad;
    }
	
	public function Actualizar($object) 
    {
        $this->conn->beginTransaction();
		try{
			$DatPersonadocidentidad = Doctrine::getTable('DatPersonadocidentidad')->find($object['idpersonaidentidad']);
			if($DatPersonadocidentidad!=false){				
				foreach ($object as $k=>$v)
					$DatPersonadocidentidad->$k = $v; 					
				$DatPersonadocidentidad->save();				
				$this->conn->commit();
				return true;
			}
		}
		catch (Doctrine_Exception $e){
			$this->conn->rollback();
			throw $e;
		}
	}
 
    public function Eliminar($id) 
    { 
        try{
			$DatPersonadocidentidad = Doctrine::getTable('DatPersonadocidentidad')->find($id);
			if ($DatPersonadocidentidad!=false){
				
				$DatPersonadocidentidad->delete();				
				return true;
			}
		}
		catch (Doctrine_Exception $e){
			$this->conn->rollback();
			throw $e;
		}
    } 
 }

