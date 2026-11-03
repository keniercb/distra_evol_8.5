<?php 
class EjercicioService extends ZendExt_Model
{
    public function __construct()
	{
		parent::ZendExt_Model();
	}
    public static function Ejercicio()
	{	   
	   return new DatEjerciciocontable();
	}
    public static function Periodo($idperiodo)
	{
	   $periodo = DatPeriodocontable::Periodos('',array('idperiodo'=>$idperiodo));
	   $standard = new ZendExt_ClassStandard();
	   return $standard->Object($periodo);
	   /*$field = array_keys($periodo[0]);
	   $periodor = new stdClass();
	   foreach ($field as $j=>$d)$periodor->$d=$periodo[0][$d];
	   return $periodor;*/
	}
    public static function EjercicioContables($idejercicio)
	{
	    $global = ZendExt_GlobalConcept::getInstance();
	    $identidad = $global->Estructura->idestructura;
		$ejericio = DatEjerciciocontable::Ejercicios('',array('idejercicio'=>$idejercicio,'idestructuracomun'=>$identidad));
		$array = NULL;			
		$field = array_keys($ejericio[0]);
		$i= 0;
		foreach ($ejericio as $vlp){
			$array[] = new stdClass();
			foreach ($field as $j=>$d)$array[$i]->$d=$vlp[$d];
			$i++;
		}
		return $array;
	}
	public static function Periodos($idejercicio)
	{	   
	   if($idejercicio)
	   {
	     $periodos = DatPeriodocontable::Periodos('',array('idejercicio'=>$idejercicio));		 
	     $standard = new ZendExt_ClassStandard();
	     return $standard->ArrayObject($periodos);
       }
       return array();	   
	   /*$field = array_keys($periodo[0]);
	   $periodor = new stdClass();
	   foreach ($field as $j=>$d)$periodor->$d=$periodo[0][$d];
	   return $periodor;*/
	}
	
	//buscar para implementar
	public static function EjercicioSiguiente($idejercicio)
	{
		return DatEjerciciocontable::EjercicioSiguiente($idejercicio);
	}
	
	public static function EjercicioAnterior($idejercicio)
	{
		return DatEjerciciocontable::EjercicioAnterior($idejercicio);
	}
	
	public static function PeriodoSiguiente($idperiodo)
	{
	    $integrator = ZendExt_IoC::getInstance();
		$periodo = $integrator->parametros->ObtenerPeriodo($idperiodo);		
		$DatPeriodocontable = new DatPeriodocontable();
		$resultado = $DatPeriodocontable->PeriodoSiguiente($periodo->idejercicio,$periodo->fin);		
		$standard = new ZendExt_ClassStandard();		
	    return $standard->Object($resultado);								
	}
	
	
	public static function PrimerPeriodo($idejercicio)
	{
		return DatPeriodocontable::PrimerPeriodo($idejercicio);
	}
	
	
	public static function UltimoPeriodo($idejercicio)
	{
		return DatPeriodocontable::UltimoPeriodo($idejercicio);
	}
	
    public static function EjerciciosContablesPorEntidad($identidad)
	{
		$ejericios = DatEjerciciocontable::Ejercicios("e.idejercicio,e.nombre",array('idestructuracomun'=>$identidad));
		if(!$ejericios)return array();
		$standard = new ZendExt_ClassStandard();
	    return $standard->ArrayObject($ejericios);
	}
	public function EjercicioCI() {
		$dir_rel_app = Zend_Registry::get ( 'config' )->uri_aplication;
		$dir_controller = $dir_rel_app . '/configuracion/ejercicios/index.php/ejercicios/gestionarejercicioscargainicial';
		header ( "Location: $dir_controller" );
	}
	
	public function PrimerPeriodoC($idejercicio)
	{	    
	    $idperiodo = DatPeriodocontable::PrimerPeriodo($idejercicio);
		return $idperiodo;
	} 
	
	public function PrimerPeriodoObjeto($idejercicio)
	{
		$periodo = DatPeriodocontable::PrimerPeriodoObjeto($idejercicio);
		$datos = ZendExt_ClassStandard::Object($periodo);
		return $datos;
	}
	
	public function PrimerEjercicioC($identidad)
	{		   
		$idejercicio = DatEjerciciocontable::PrimerEjercicio($identidad);
	    return $idejercicio;	    
	}
	
	public function HayEjercicioyPeriodo($entidad)
	{
		return (($hay = DatEjerciciocontable::HayEjercicio($entidad)) && ($hay1 = DatPeriodocontable::HayPeriodo($hay)));
	}
	public function PeriodosAnteriores($idperiodo)
	{
		$periodos = DatPeriodocontable::PeriodosAnteriores($idperiodo);
		$standard = new ZendExt_ClassStandard();
	    return $standard->ArrayObject($periodos);
	}

	public function PeriodoPorFecha($fecha)
	{
		$subsist = $this->global->Subsistema->idsubsistema;
		$entidad = $this->global->Estructura->idestructura;
		$ejercicio=$this->EjercicioPorFecha($fecha);
		$result = DatPeriodocontable::PeriodoPorFecha($ejercicio->idejercicio,$fecha);
		if(count($result)>1)
		{
			$periodoactual = $this->integrator->parametros->PeriodoActualSubsistema($entidad,$subsist);
			return $this->integrator->parametros->ObtenerPeriodo($periodoactual);
		}
	    $standard = new ZendExt_ClassStandard();
	    return $standard->Object($result);
	}
	public function EjercicioPorFecha($fecha)
	{
		$entidad = $this->global->Estructura->idestructura;
		$result = DatEjerciciocontable::EjercicioPorFecha($entidad, $fecha);
		$standard = new ZendExt_ClassStandard();
	    return $standard->Object($result);
	}
}
?>