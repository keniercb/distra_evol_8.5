<?php

class NomTurnotrabajo extends BaseNomTurnotrabajo
{

    public function setUp()
    {
        parent :: setUp ();
        $this->hasOne('ConfCalendariopersona', array('local'=>'idturnotrabajo','foreign'=>'idturnotrabajo'));
    }

    public function getByid($idturnotrabajo)
    {
        return Doctrine::getTable('NomTurnotrabajo')->find($idturnotrabajo)->toArray();
    }

	/*
     * Obtener un listado de los datos
     */	   
	public function obtenerListadoTurnoTrabajo($inicio = 0, $limite = 15,$denominacion, $fdesde, $fhasta,$identidades)
    { 
		$queryObj = Doctrine_Query::create()
                ->select('r.denominacion, r.idturnotrabajo, r.descripcion, r.fdesde, r.fhasta,r.horainicio, r.horafin, r.horarioalmuerzo,r.tiempodescanso,r.horaentradaps,r.horasalidaps,r.horaentradass,r.horasalidass,r.toleranciaentrada,r.toleranciasalida,r.otrodia,r.horas,r.idestructura')
                ->from('NomTurnotrabajo r')
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
        if ($identidades != null) {
            $queryObj->andWhere("idestructura in (" . implode(',', $identidades) . ")  or idestructura is null");
        }
		//Devolviendo el listado en forma de arreglo.
        return $queryObj->fetchArray();	
    }

    public function cantTurnoTrabajo($denominacion, $fdesde, $fhasta,$identidades)
    {
        $queryObj = Doctrine_Query::create()
            ->select('r.denominacion, r.idturnotrabajo, r.descripcion, r.fdesde, r.fhasta,r.horainicio, r.horafin, r.horarioalmuerzo,r.tiempodescanso,r.horaentradaps,r.horasalidaps,r.horaentradass,r.horasalidass,r.toleranciaentrada,r.toleranciasalida,r.otrodia,r.horas,r.idestructura')
            ->from('NomTurnotrabajo r');
        if(!empty($denominacion)){
            $queryObj->addWhere("r.denominacion ilike '%$denominacion%'");
        }
        if(!empty($fdesde)){
            $queryObj->addWhere('fdesde = ?', $fdesde);
        }
        if(!empty($fhasta)){
            $queryObj->addWhere('fhasta = ?', $fhasta);
        }
        if ($identidades != null) {
            $queryObj->andWhere("idestructura in (" . implode(',', $identidades) . ")  or idestructura is null");
        }
        //Devolviendo el listado en forma de arreglo.
        return $queryObj->fetchArray();
    }
	
	public function existe($denominacion,$idturnotrabajo,$accion){
	    if($accion == 'upd')
        {
            $where = " and r.idturnotrabajo != ".$idturnotrabajo;
        }
	    else
        {
            $where = " ";
        }
	$denominacion = strtoupper($denominacion);
	$queryObj = Doctrine_Query::create()	
                ->select('r.denominacion')
                ->from('NomTurnotrabajo r')				
				->where("UPPER(TRIM(r.denominacion)) = UPPER(TRIM('$denominacion')) ".$where);
				
	 return $queryObj->fetchArray();
	}
	
	 /*
     * Obtener la cantidad total
     */
	public static function obtenerCantidadTotalTurnotrabajo($identidades) {
        //Devolviendo la cantidad total
//        return Doctrine_Query::create()
//			->select('COUNT(idturnotrabajo) AS cantidad')
//			->from('NomTurnotrabajo')
//			->fetchOne()
//		->cantidad;

        $query = Doctrine_Query::create()
            ->from('NomTurnotrabajo x');
        if ($identidades != null) {
            $query->andWhere("idestructura in (" . implode(',', $identidades) . ") or idestructura is null");
        }
        return $query->count();
    }

    public function getturnotrabajo(){
        $queryObj = Doctrine_Query::create()
            ->select('tt.idturnotrabajo, tt.denominacion')
            ->from('NomTurnotrabajo tt');
        return $queryObj->fetchArray();
    }

    public function getTurnoTrabajoById($idturnotrabajo){
        $queryObj = Doctrine_Query::create()
            ->select('tt.*')
            ->from('NomTurnotrabajo tt')
            ->where('tt.idturnotrabajo = ?',$idturnotrabajo);
        return $queryObj->fetchArray();
    }

    public function GetTodos()
    {
        $query = new Doctrine_Query ();
        $result = $query->select('tt.*,(tt.horafin - tt.horainicio) as hlab')
            ->from('NomTurnotrabajo tt')
            ->orderBy('tt.denominacion', 'ASC')
            ->addOrderBy('tt.horainicio', 'ASC')
            ->execute ();
        return $result->toArray();
    }

    public function getHorariodelTurno($idturnotrabajo)
    {
        $queryObj = Doctrine_Query::create()
            ->select('tt.*,(tt.horafin - tt.horainicio) as hlab')
            ->from('NomTurnotrabajo tt')
            ->where('tt.idturnotrabajo = ?',$idturnotrabajo);
        return $queryObj->fetchArray();
    }

}

