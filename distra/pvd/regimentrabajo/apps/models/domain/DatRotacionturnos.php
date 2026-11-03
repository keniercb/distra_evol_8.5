<?php

class DatRotacionturnos extends BaseDatRotacionturnos
{

    public function setUp()
    {
        parent :: setUp ();       
        $this->hasOne('NomRotacion', array ('local' => 'idrotacion', 'foreign' => 'idrotacion'));
        $this->hasOne('NomTurnotrabajo', array ('local' => 'idturnotrabajo', 'foreign' => 'idturnotrabajo'));
    }

    public function getByid($idrotacionturno)
    {
        return Doctrine::getTable('DatRotacionturnos')->find($idrotacionturno)->toArray();
    }

	/*
     * Obtener un listado de los datos
     */	   
	public function obtenerListadoRotacionTurnos($inicio = 0, $limite = 15, $idrotacion)
    { 
		$queryObj = Doctrine_Query::create()
                ->select('rt.cantdias,rt.idrotacion,rt.idrotacionturno,rt.idturnotrabajo,tt.denominacion')
                ->from('DatRotacionturnos rt')
				->leftJoin('rt.NomTurnotrabajo tt')
				->where('rt.idrotacion = ?', $idrotacion)
                ->limit($limite)
                ->offset($inicio);
				
		//Devolviendo el listado en forma de arreglo.
        return $queryObj->fetchArray();	
    }
	
	public static function EliminarListadoRotacionTurnos($idrotacion) 
	{
        $queryObj = Doctrine_Query::create() 
                ->delete()  		
                ->from('DatRotacionturnos rt') 				
				->where('rt.idrotacion = ?', $idrotacion); 		
		return $queryObj->execute();	
    }

}

