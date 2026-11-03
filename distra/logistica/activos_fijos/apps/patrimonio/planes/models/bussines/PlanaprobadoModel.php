<?php
class PlanaprobadoModel extends ZendExt_Model{

	public function GestinmuebleregcontModel()
	{
    	parent::ZendExt_Model ();    	
    	set_include_path(get_include_path() . PATH_SEPARATOR . Zend_Registry::getInstance()->config->dir_aplication . '/logistica/comun/models/bussines');
	    $autoLoad = AutoLoadPath::getInstance();
		$autoLoad->IncludePathModule('activos_fijos','configuracion');
    }

    public function modificarPlanaprobado($planAprobado,$obj){		
		$obj->aprobado = $planAprobado;
		$obj->save();
		return true;		
	}
	
	public function modificarTodosVariosPlanesAprobados($lista_plan_aprov, $lista_obj)
	{
		for ($i = 0; $i < count($lista_obj); $i++)
		{
			$lista_obj[$i]->aprobado = $lista_plan_aprov[$i];
			$lista_obj[$i]->save();			
		}		
		return true;
	}

	public function devolverEspecialidades(){
    	$result = array();
	    $obj  = new ZendExt_Nomencladores_ADT();	    
	    $datosEsp = $obj->selectParam('nom_especialidad',array('*'),0,0,"" );   //

		foreach($datosEsp as $key){
			$result[] = Array(
				'idespecialidad' => $key['idespecialidad'],
				'descripcion' => $key['denespecialidad'],
			);	
		}
		return $result;
    }
}
?>
