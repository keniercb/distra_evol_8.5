<?php
class DatExpresionmatematicaevalselModel extends ZendExt_Model {

    public function DatExpresionmatematicaModel() {
        parent::ZendExt_Model();
    }

    public function Insertar(DatExpresionmatematicaevalsel $DatExpresionmatematicaevalsel, $arrElementos) {
	  try{
        $DatExpresionmatematicaevalsel->save();
		$objElemExpMat = new DatElementoExpresionmatematicaevalselModel();
		$objElemExpMat->ActualizarElementos($DatExpresionmatematicaevalsel->idexpresionmatematica, $arrElementos);
		return $DatExpresionmatematicaevalsel->idexpresionmatematica;
	  }
	  catch (Doctrine_Exception $e){
			throw $e;
	  }	  
    }

    public function Actualizar(DatExpresionmatematicaevalsel $DatExpresionmatematicaevalsel, $arrElementos) {
	  try{
        $DatExpresionmatematicaevalsel->save();
		$objElemExpMat = new DatElementoExpresionmatematicaevalselModel();
		$objElemExpMat->EliminarElementos($DatExpresionmatematica->idexpresionmatematica);
		$objElemExpMat->ActualizarElementos($DatExpresionmatematica->idexpresionmatematica, $arrElementos);
		return $DatExpresionmatematicaevalsel->idexpresionmatematica;
	  }
	  catch (Doctrine_Exception $e){
			throw $e;
	  }	  
    }

    public function Eliminar($id){ 
      try{
			$DatExpresionmatematica = Doctrine::getTable('DatExpresionmatematicaevalsel')->find($id);
			if ($DatExpresionmatematica != false){
				
				$DatExpresionmatematica->delete();				
				return true;
			}
		}
		catch (Doctrine_Exception $e){
			$this->conn->rollback();
			throw $e;
		}
    }
	/*Funcion que evalua una expresion matematica*/
	public function EvaluarExpresionMatematica($idexpresionmatematica, $arrIndicadoresValor){
		$objExpMat = new DatExpresionmatematicaevalsel();
		$objBuscado = $objExpMat->Buscar($idexpresionmatematica);
		if($objBuscado){
			$expresionacalcular = $objBuscado->expresionacalcular;			
			//Busco los indicadores dentro de la expresion matematica y compruebo que esten todos
			$esbooleana = -1;
			foreach($arrIndicadoresValor as $i => $v){
				$ind = 'I'.$v['idindicador'];
				$expresionacalcular = str_replace  ($ind, $v['valor'], $expresionacalcular);
			}		
			//Compruebo si quedaron indicadores sin reemplazar por su valor
			$pos = strpos($expresionacalcular, 'I');
			if($pos === FALSE){
				//Verifico si existe algun operador boleano dentro de la expresion para dar la solucion
				if(strpos($expresionacalcular, '>') !== FALSE) $esbooleana = 1;
				if(strpos($expresionacalcular, '<') !== FALSE) $esbooleana = 1;
				if(strpos($expresionacalcular, '>=') !== FALSE) $esbooleana = 1;
				if(strpos($expresionacalcular, '<=') !== FALSE) $esbooleana = 1;
				if(strpos($expresionacalcular, '||') !== FALSE) $esbooleana = 1;
				if(strpos($expresionacalcular, '&&') !== FALSE) $esbooleana = 1;
				if(strpos($expresionacalcular, '==') !== FALSE) $esbooleana = 1;
				if(strpos($expresionacalcular, '!=') !== FALSE) $esbooleana = 1;
		
				//Evaluo la expresion matematica y almaceno en la variable $resultadoexpresion el valor
				eval("\$resultadoexpresion =  ".$expresionacalcular.";");

				$r->codigo = 1;	
				if($esbooleana == 1){ //Devuelve verdadero o falso
					if($resultadoexpresion == 1 || $resultadoexpresion === TRUE) $r->valor = 1;
					else $r->valor = 0;
					$r->booleana = 1;
				}else{//Devuelve un valor numerico
					$r->valor = $resultadoexpresion;
					$r->booleana = 0;
				} 
					
			}else {
				$r->codigo = 3;
				$r->booleana = 0;
				$r->error = "Existe(n) ".substr_count($expresionacalcular, 'I')." indicador(es) que no se encuentra(n) en la expresi&oacute;n matem&aacute;tica."; 
			}
		}else{
			$r->codigo = 3;
			$r->booleana = 0;
			$r->error = "No existe la expresi&oacute;n matem&aacute;tica.";
		}
		return $r;
	}
	
	/*Devuelve los datos de las expresiones matematicas dado un arreglo de id de expresiones matematicas*/
	public function GetTodosporarrIdExpresionMatematica($arrIdexpresionmatematica){
		$objExpMat = new DatExpresionmatematicaevalsel();
		return $objExpMat->GetTodosporarrIdExpMat($arrIdexpresionmatematica);
	}
	
   
}//Fin clase
?>