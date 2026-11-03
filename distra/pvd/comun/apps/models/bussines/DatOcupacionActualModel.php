<?php 
class DatOcupacionActualModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(DatOcupacionActual $DatOcupacionActual) 
    { 
           $DatOcupacionActual->save();
           $id = $DatOcupacionActual->idocupacionactual;
            if($DatOcupacionActual->idcargo == 0){
               $mg = Doctrine_Manager::getInstance();
    	       $conn = $mg->getCurrentConnection();
               $sql = "UPDATE mod_persona.dat_ocupacionactual SET idcargo=null, estadocargo=null where idocupacionactual=$id";
               $conn->fetchAll($sql);
            }   
		   return $id;
    } 
	
 public function Actualizar($object) 
    { 
        $this->conn->beginTransaction();
		try{
			$DatOcupacionActual = Doctrine::getTable('DatOcupacionActual')->find($object['idocupacionactual']);
			if ($DatOcupacionActual!=false){
				foreach ($object as $k=>$v)
					$DatOcupacionActual->$k = $v;				
						
				/*if($object['idpersona']) $DatOcupacionActual->idpersona = $object['idpersona'];
				if($object['idorganismo']>-1) $DatOcupacionActual->idorganismo = $object['idorganismo'];
				if($object['identidad']>-1) $DatOcupacionActual->identidad = $object['identidad'];
				if($object['entidad']) $DatOcupacionActual->entidad = $object['entidad'];
				if($object['idcargo']>-1)  $DatOcupacionActual->idcargo = $object['idcargo'];
				if($object['idpuestotrabajo']) $DatOcupacionActual->idpuestotrabajo = $object['idpuestotrabajo'];
				if($object['fechainicio']) $DatOcupacionActual->fechainicio = $object['fechainicio'];
				if($object['idgrado']) $DatOcupacionActual->idgrado = $object['idgrado'];
				if($object['idtipoorgano']) $DatOcupacionActual->idtipoorgano = $object['idtipoorgano'];
				if($object['idsubordinacion']) $DatOcupacionActual->idsubordinacion = $object['idsubordinacion'];
				if($object['idesfera']) $DatOcupacionActual->idesfera = $object['idesfera'];
				if($object['organismo']) $DatOcupacionActual->organismo = $object['organismo'];
				if($object['cargo']) $DatOcupacionActual->cargo = $object['cargo'];	
				if($object['entidad']) $DatOcupacionActual->entidad = $object['entidad'];		
				if($object['puestotrabajo']) $DatOcupacionActual->puestotrabajo = $object['puestotrabajo'];	
				if($object['tipoocupacion']) $DatOcupacionActual->tipoocupacion = $object['tipoocupacion'];	
				if($object['idnomencladorcargo']) $DatOcupacionActual->idnomencladorcargo = $object['idnomencladorcargo'];	*/
				//print_r($object);die;
				$DatOcupacionActual->save();
				$this->conn->commit();
				return true;
			}
		}
		catch (Doctrine_Exception $e){
			$this->conn->rollback();
			throw $e;
		}
    } 
 
	public function Eliminar($id){ 
      try{
			$DatOcupacionActual = Doctrine::getTable('DatOcupacionActual')->find($id);
			if ($DatOcupacionActual!=false){
				
				$DatOcupacionActual->delete();				
				return true;
			}
		}
		catch (Doctrine_Exception $e){
			$this->conn->rollback();
			throw $e;
		}
    } 
 }
?>