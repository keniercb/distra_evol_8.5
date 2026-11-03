<?php
class DatElementoExpresionmatematicaevalselModel extends ZendExt_Model {

    public function DatElementoExpresionmatematicaevalselModel() {
        parent::ZendExt_Model();
    }

    public function Insertar(DatElementoExpresionmatematicaevalsel $DatElementoExpresionmatematicaevalsel) {
      $this->conn->beginTransaction();
	  try{
        $DatElementoExpresionmatematicaevalsel->save();
		$this->conn->commit();
		return $DatElementoExpresionmatematicaevalsel->idexpresionmatematica;
	  }
	  catch (Doctrine_Exception $e){
			$this->conn->rollback();
			throw $e;
	  }
    }

    public function Actualizar(DatElementoExpresionmatematicaevalsel $DatElementoExpresionmatematicaevalsel) {
	  $this->conn->beginTransaction();
	  try{
        $DatElementoExpresionmatematicaevalsel->save();
		$this->conn->commit();
		return $DatElementoExpresionmatematicaevalsel->idexpresionmatematica;
	  }
	  catch (Doctrine_Exception $e){
			$this->conn->rollback();
			throw $e;
	  }	  
    }
	
	public function ActualizarElementos($idexpresionmatematica, $arrElementos) {
	  try{
        $cantidad = count($arrElementos);
		if($cantidad > 0){
			foreach($arrElementos as $k => $v){
				$obj = new DatElementoExpresionmatematicaevalsel();
				$obj->idexpresionmatematica = $idexpresionmatematica;
				$obj->elemento = $v->valor;
				$obj->elementomostrar = $v->valormostrar;
				$obj->tipoelemento = $v->tipo;
				if($v->tipo == 6){
				    $arr = explode('I', $v->valor);
					$obj->idindicador = $arr[1];
				}	
				else	
					$obj->idindicador = 0;	

				$obj->orden = $k;
				$obj->save();
			}
		}
		return true;
	  }
	  catch (Doctrine_Exception $e){
			$this->conn->rollback();
			throw $e;
	  }	  
    }

    public function Eliminar($id){ 
      try{
			$DatElementoExpresionmatematica = Doctrine::getTable('DatElementoExpresionmatematicaevalsel')->find($id);
			if ($DatElementoExpresionmatematica != false){
				$DatElementoExpresionmatematica->delete();				
				return true;
			}
		}
		catch (Doctrine_Exception $e){
			$this->conn->rollback();
			throw $e;
		}
    }
	
	public function EliminarElementos($idexpresionmatematica){ 
		$sql = "delete from mod_evaluaciones.dat_elementoexpresionmatematicaevalsel where idexpresionmatematica = {$idexpresionmatematica};";
		$mg = Doctrine_Manager::getInstance();
		$conn = $mg->getCurrentConnection();
		$result = $conn->fetchAll($sql);
		return $result; 
    }
	
   
}//Fin clase
?>