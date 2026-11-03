<?php
/**
 * ZendExt_InterpreterRules_SignoClass
 * Con esta clase llevamos un control mejor de los operadores en la regla
 * asi como su prioridad para la evaluaci�n.
 * 
 * @author Sergio Hernandez Cisneros
 * 
 */
class ZendExt_InterpreterRules_SignoClass 
{ 
    /**
	* Variable de tipo String, que tendr� el operador dentro de la regla.
	* 
	* @var String 
	*/
	public $denom;
	
	/**
	* Variable de tipo int, en la cual se guardar� 
	* la prioridad que tiene este operador.
	* 
	* @var String 
	*/
	public $pr;
	
	/**
	* Variable de tipo int, en la cual se guardar� dentro de
	* cuantos parentesis abiertos se encuentra el operador.
	* 
	* @var String 
	*/
	public $pa; 
    
	/**
	* ZendExt_InterpreterRules_SignoClass
	* 
	* Constructor de la clase ZendExt_InterpreterRules_SignoClass
	* 
	* @param String $denom - Operador.
	* @param integer $npa - cantidad de parentesis abiertos.
	* @param integer $pa - prioridad del operador por defecto.
	* 
	**/
	function ZendExt_InterpreterRules_SignoClass($denom, $npa, $pa) 
    { 
        $this->denom=$denom; 
        $this->pa=$pa; 
        $this->pr=$npa*7+$this->pa; 
    } 
}
