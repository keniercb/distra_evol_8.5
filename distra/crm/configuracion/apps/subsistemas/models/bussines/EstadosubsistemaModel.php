<?php

class EstadosubsistemaModel extends ZendExt_Model
{
	public function __constructEstadosubsistemaModel()
	{
		parent::ZendExt_Model();
	} 
	public function BuscarEstadosubsistema($obj)
	{
		try 
		{
			$estado = new NomEstadosubsistema();
			$busca = $estado->buscarNomEstadosubsistema(array('idestado'=>$obj->idestado));
			if($busca['cant']==1)
		 		return $busca['datos'];
		 	else 
		 		return false;
		}
		catch (Doctrine_Exception $ee)
		{
			return false;	
		}
	}
}
