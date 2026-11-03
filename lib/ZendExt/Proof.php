<?php
/**
* Mecanismo para la gestión de los comprobantes en el ERP Cuba.
* 
* @author Omar Antonio Díaz Peña.
* @package ZendExt
* @copyright Centro UCID.
* */

class ZendExt_Proof
{
   /**
	* @var State currentState Estado actual del comprobante
	* */	
	private $currentState;
	private $values;
	private $sum;
	private $crc;
	
	public function ZendExt_Proof ($pProofType, $pValues)
	{
		$this->currentState = new ZendExt_Proof_New ();		
		$xml = ZendExt_FastResponse :: getXML ('tipos_comprobante');
		
		$atributes = $xml->$pProofType ();
		
		foreach ($atributes->children () as $element)
			$this->values->$element['id'] = $pValues->$element['id'];
	}
	
	public function setCRC ()
	{
		foreach ($this->sum as $row)
			$this->crc[] = md5 ($row);
	}
	
	public function setState ($pNewState)
	{
		$currentState = $pNewState;		
	}
	
	public function operate ()
	{
		$this->currentState->operate ();		
	}
}
