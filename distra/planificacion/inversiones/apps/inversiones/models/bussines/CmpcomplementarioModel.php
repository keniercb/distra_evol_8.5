<?php

class CmpcomplementarioModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }
	
	public function EfectuarCierre($parametros)
	{	
		//nombre del fichero que debe de ejecutarse
		//por defecto se toma que es el cierre de plan
		$fichero = 'cierrePlan';
		switch($parametros->tipoelemento)
		{
			case 'actividad':
				$fichero = 'cierreActividad';
			break;
			case 'nivel':
				$fichero = 'cierreNivelActividad';
			break;
			case 'balancematerial':
				$fichero = 'cierrebalanceMaterial';
			break;
                     case 'inversion':
				$fichero = 'etl_inversiones';
			break;
		}
		$respuesta = $this->EjecutarAccion($fichero);
		return $respuesta;
	}
	
	public function EfectuarActualizacion()
	{
		//nombre del fichero que debe de ejecutarse
		//por defecto se toma que es el actualizar de plan
		$fichero = 'plan';
		switch($parametros->tipoelemento)
		{
			case 'actividad':
				$fichero = 'actividad';
			break;
			case 'nivel':
				$fichero = 'nivelActividad';
			break;
			case 'balancematerial':
				$fichero = 'balancematerial';
			break;
		}
		$respuesta = $this->EjecutarAccion($fichero);
		return $respuesta;
	}
	
	
	public function EjecutarAccion($fichero)
	{
		//identificar el sistema operativo para saber el tipo 
		//de extension de archivo a ejecutar
		$cadenaserverconfig = $_SERVER['SERVER_SOFTWARE'];
		
		//descubriendo la direccion de los fiecheros ejecutables
		$register = Zend_Registry::getInstance();
		$dirarchivoejecutable = $register->config->dir_aplication."sami/data-integration/";
		

			$extension  = '.sh';
			$dirarchivoejecutable = $dirarchivoejecutable.$fichero.$extension;
			//print_r($dirarchivoejecutable);die('pepe');
                        if(file_exists ($dirarchivoejecutable))
			{
				shell_exec($dirarchivoejecutable);
				$respuesta = 1;
			}
			else
			{$respuesta = 3;}			

		return $respuesta;
	}
	

}

?>