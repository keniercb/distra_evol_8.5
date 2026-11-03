<?php

class NomRotacion extends BaseNomRotacion
{

    public function setUp()
    {
        parent :: setUp ();
	   $this->hasMany ('DatRotacionturnos', array ('local' => 'idrotacion', 'foreign' => 'idrotacion'));
    }

    public function getByid($idrotacion)
    {
        return Doctrine::getTable('NomRotacion')->find($idrotacion);
    }

	/*
     * Obtener un listado de los datos
     */	   
	public function obtenerListadoRotacion($inicio = 0, $limite = 15,$denominacion, $fdesde, $fhasta)
    { 
		$queryObj = Doctrine_Query::create()
                ->select('r.denominacion, r.idrotacion, r.descripcion, r.fdesde, r.fhasta')
                ->from('NomRotacion r')
				->limit($limite)
                ->offset($inicio);
		if(!empty($denominacion)){
			$queryObj->addWhere("r.denominacion ilike '%$denominacion%'");
		}
		if(!empty($fdesde)){
			$queryObj->addWhere('fdesde = ?', $fdesde);
		}
		if(!empty($fhasta)){
			$queryObj->addWhere('fhasta = ?', $fhasta);
		}
		//Devolviendo el listado en forma de arreglo.
        return $queryObj->fetchArray();	
    }
	
	public function existe($denominacion){
	$denominacion = strtoupper($denominacion);
	$queryObj = Doctrine_Query::create()	
                ->select('r.denominacion')
                ->from('NomRotacion r')
				->where("UPPER(TRIM(r.denominacion)) = UPPER(TRIM('$denominacion'))");
				
	 return $queryObj->fetchArray();
	}
	
	 /*
     * Obtener la cantidad total
     */
	public static function obtenerCantidadTotalRotacion() {
        //Devolviendo la cantidad total
        return Doctrine_Query::create()
			->select('COUNT(idrotacion) AS cantidad')
			->from('NomRotacion')
			->fetchOne()
		->cantidad;
    }

}

