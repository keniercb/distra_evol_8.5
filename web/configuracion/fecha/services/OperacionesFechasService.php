<?php 
class OperacionesFechasService extends ZendExt_Model
{
    public function OperacionesFechasService()
	{
	    $this->operacfechas = new OperacionesFechas();
		parent::ZendExt_Model();
	}

    public function ProximaFecha($fecha,$dias) 
	{
		return $this->operacfechas->nextDate($fecha,$dias);			
    } 

	public function DiferenciasFechas($fecha1,$fecha2)
	{
		return $this->operacfechas->diferenciasfechas($fecha1,$fecha2);
	}
	
    
	public function CompararFechas($fecha1,$fecha2)
	{
		return $this->operacfechas->compara_fechas($fecha1,$fecha2);
	}
	
	public function RestaFechas($dFecIni, $dFecFin)
	{
		return $this->operacfechas->restaFechas($dFecIni, $dFecFin);
	}
  
}
?>