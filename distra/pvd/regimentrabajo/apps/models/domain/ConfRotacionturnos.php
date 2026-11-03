<?php

class ConfRotacionturnos extends BaseConfRotacionturnos
{

    public function setUp()
    {
        parent :: setUp ();
    }

    public function getByid($idrotacionturno)
    {
        return Doctrine::getTable('ConfRotacionturnos')->find($idrotacionturno)->toArray();
    }

	/*
     * Obtener un listado de los datos
     */	   
	public function obtenerListadoRotacionTurnos($inicio = 0, $limite = 15,$denominacion, $fdesde, $fhasta)
    { 
		$queryObj = Doctrine_Query::create()
                ->select('r.denominacion, r.idrotacionturno, r.descripcion, r.fdesde, r.fhasta')
                ->from('ConfRotacionturnos r')
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
                ->from('ConfRotacionturnos r')
				->where("UPPER(TRIM(r.denominacion)) = UPPER(TRIM('$denominacion'))");
				
	 return $queryObj->fetchArray();
	}
	
	 /*
     * Obtener la cantidad total
     */
	public static function obtenerCantidadTotalRotacionturnos() {
        //Devolviendo la cantidad total
        return Doctrine_Query::create()
			->select('COUNT(idrotacionturno) AS cantidad')
			->from('ConfRotacionturnos')
			->fetchOne()
		->cantidad;
    }

    public function getrotacionturnos(){
        $queryObj = Doctrine_Query::create()
            ->select('tt.idrotacionturno, tt.denominacion')
            ->from('ConfRotacionturnos tt');
        return $queryObj->fetchArray();
    }

    public function getRotacionTurnosById($idrotacionturno){
        $queryObj = Doctrine_Query::create()
            ->select('tt.*')
            ->from('ConfRotacionturnos tt')
            ->where('tt.idrotacionturno = ?',$idrotacionturno);
        return $queryObj->fetchArray();
    }

    public function GetTodos()
    {
        $query = new Doctrine_Query ();
        $result = $query->from('ConfRotacionturnos')->execute ();
        return $result->toArray();

    }

}

