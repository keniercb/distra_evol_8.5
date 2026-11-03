<?php

class EspecialidadService extends ZendExt_Model
{
    public function __construct()
	{
	}
	
	public function BuscarPorId($idespecialidad)
	{
		$model = new EspecialidadModel();
		$result=$model->BuscarPorId($idespecialidad);
		$standart = new ZendExt_ClassStandard(); 
        return $standart->ArrayObject($result);   
	}
	
}

?>
