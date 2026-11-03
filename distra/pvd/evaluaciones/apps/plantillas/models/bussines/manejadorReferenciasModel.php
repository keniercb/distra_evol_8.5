<?php
/** 
* ReglasController 
* Modelo de negocio para gestionar reglas * 
* @author Javier  Rodr�guez L�pez  y  Oraldo Jacinto Sim�n
* @package Capital Humano
* @subpackage Evaluaciones
* @copyright UCID-ERP Cuba
* @version 1-0.0
*/ 

class manejadorReferenciasModel extends ZendExt_Model {
	/*
	 * Atributos de la clase
	 */
	private $referencia;
	
	/*
	 * Constructor de la clase
	*/
	function __construct($referencia) {
		$this->referencia = $referencia;
		//$ind = manejadorReferenciasModel::indice("[denominacionplan, idversionplan]");
		//$this->instancias[$ind] = new validarReferenciasModel();
	}
	
	/*
	 *Este metodo permite validar una referencia 
	*/
	public function validarReferencia()
	{
		$dato = substr($this->referencia, 1, strlen($this->referencia)-2); //devuelve la referencia sin los par�ntesis.
		if(substr($dato,0,1) == "i"){
			return $this->validarIndicador(substr($dato,1));			
		}
		else if(substr($dato,0,1) == "e"){
			return $this->validarEscala($dato);
		}
		else if(substr($dato,0,1) == "r"){
			return $this->validarRegla(substr($dato,1));
		}
		return false;
	}
	
	private function validarIndicador($dato){	//Ej: [i10014]
		return is_numeric( $dato );
	}
	
	private function validarRegla($dato){	//Ej: [r10012]
		if( is_numeric( $dato )){
			return true;
		}
		else{ return false; }
	}
	
	//OJO volver a revisar este metodo.
	private function validarEscala($dato){	//Ej: [e1-10024]
		$varArrAux = explode("-", $dato);
		$tipoEscala = substr($varArrAux[0],1,1);
		if(count($varArrAux) == 2 && $varArrAux != false){
			if($tipoEscala>2 || $tipoEscala<0){
				return false;
			}
			if( !is_numeric($varArrAux[1]) ){
				return false;
			}
			return true;
		}
		return false;
	}
}