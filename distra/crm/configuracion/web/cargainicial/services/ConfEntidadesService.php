<?php
class ConfEntidadesService extends ZendExt_Model
{
    public function __construct()
	{
	}
   
	public function EscribirFinalizar()
	{
		try{
		$global = ZendExt_GlobalConcept::getInstance();
	    $idestructura = $global->Estructura->idestructura;				
	  	$x=ConfEntidades::BuscarEntConf($idestructura);
		
		$confentidad= new ConfEntidades();
		
		if($x)
		{ 
		   $confentidad=Doctrine::getTable("ConfEntidades")->find($x);  	
		   $confentidad->idconfiguracion = $x;
		}
		
	  	$confentidad->configurado = '1';
	  	$confentidad->save();		
		}
		catch(Exception $e)
		{throw $e;}
		
	}
	
	public function EntidadConfigurada($idestructura)
	{
		$bool = ConfEntidades::EntidadConfigurada($idestructura);
		return $bool;
	}
	
	public function SubsistemaEntidadConfigurada($idestructura,$idsubsistema)
	{
		
	}
	

}
