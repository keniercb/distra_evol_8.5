<?php

class CierreService extends ZendExt_Model
{
    public function __construct()
	{
	}
	public function PeriodoActualSubsistema($identidad, $idsubsistema)
	{
		$integrator = ZendExt_IoC::getInstance();
		$estructurasubsist = $integrator->subsistemas->BuscarInstancia($identidad, $idsubsistema);
		$result = DatCierre::BuscarCierreSubsistema($estructurasubsist->idestructurasubsist);
		
		return ($result[0]['idperiodoactual'])?$result[0]['idperiodoactual']:0;
		/*$aux = new CierreModel();
		return $aux->PeriodoActualSubsistema($identidad, $idsubsistema);*/
	}
	public function EjercicioActualSubsistema($identidad, $idsubsistema)
	{
		$integrator = ZendExt_IoC::getInstance();
		$estructurasubsist = $integrator->subsistemas->BuscarInstancia($identidad, $idsubsistema);
		$result = DatCierre::BuscarCierreSubsistema($estructurasubsist->idestructurasubsist);
		return ($result[0]['idejercicioactual'])?$result[0]['idejercicioactual']:0;
		/*$aux = new CierreModel();
		return $aux->EjercicioActualSubsistema($identidad, $idsubsistema);*/
	}
	public function CierreActualSubsistema($identidad, $idsubsistema)
	{
		$integrator = ZendExt_IoC::getInstance();
		$estructurasubsist = $integrator->subsistemas->BuscarInstancia($identidad,$idsubsistema);
		$result = DatCierre::BuscarCierreSubsistema($estructurasubsist->idestructurasubsist);
		$standard = new ZendExt_ClassStandard();
		return $standard->Object($result);
	}
	public function SubsistemasPeriodo($identidad, $idperiodo)
	{
		$aux = new CierreModel();
		return $aux->SubsistemasPeriodo($identidad, $idperiodo);
	}
	public function SubsistemasCierreEntidad($identidad)
	{
		$aux = new CierreModel();
		return $aux->SubsistemasCierreEntidad($identidad);
	}
	public function SubsistemasEjercicio($identidad, $idejercicio)
	{
		$aux = new CierreModel();
		return $aux->SubsistemasEjercicio($identidad, $idejercicio);
	}
	public function CerrarPeriodo($identidad, $idsubsistema)
	{
		$aux = new CierreModel();
		return $aux->CerrarPeriodo($identidad, $idsubsistema);
	}
	public function CerrarEjercicio($identidad, $idsubsistema)
	{
		$aux = new CierreModel();
  		return $aux->CerrarEjercicio($identidad, $idsubsistema);
	}
	public function AdicionarCierre($idestructurasubsist,$periodo,$ejercicio)
	{
	try{
		$cierre = new DatCierre();
		$cierre->idestructurasubsist = $idestructurasubsist;		
		$cierre->idperiodoactual=$periodo;
		$cierre->idejercicioactual=$ejercicio;					
		$cierre->save();
	}
	catch(Exception $e)
	{print_r($e);die;}
	}
	
	public function EliminarCierre($idestructurasubsist)
	{
	try{
	    $idcierre = DatCierre::BuscarCierreSubsistema($idestructurasubsist);
		//print_r($idcierre);die;
		$cierre = new DatCierre();
        $iddcierre = $idcierre[0]['idcierre'];		
		$cierre=Doctrine::getTable('DatCierre')->find($iddcierre);
		$cierre->idcierre = $idcierre;		
		$cierre->delete();
	}
	catch(Doctrine_Exception $e)
	{print_r($e);die;}
	}
	public function BuscarCierre($idestructurasubsist)
	{
		$cierre=DatCierre::BuscarCierreSubsistema($idestructurasubsist);
		if($cierre)
		{
			return 1;
		}
			return 0;
	}
        public function TieneCierreDiario($idestructura, $idsubsistema){
            $integrator = ZendExt_IoC::getInstance();
            $idestructurasubsist = $integrator->parametros->EncuentraIdestructurasubsistByIdestructura($idsubsistema, $idestructura);
            $tiene_cd = DatCierre::TieneCierreDiario($idestructurasubsist);
            if($tiene_cd)
                return $tiene_cd;
            return 2;
        }

        public function CierreDiario($idestructura, $idsubsistema, $es_cierrediario){
            $aux = new CierreModel();
            return $aux->CierreDiario($idestructura, $idsubsistema, $es_cierrediario);
        }
}

?>
