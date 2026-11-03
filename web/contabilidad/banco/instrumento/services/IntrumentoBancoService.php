<?php

class IntrumentoBancoService extends ZendExt_Model
{ 
	public function ObtenerMovimientos($arrayId, $limite, $inicio){
		$result = DatMovimientoBancario::obtenerMovimientos($arrayId, $limite, $inicio);
		return ZendExt_ClassStandard::ArrayObject($result);
	}
	
	public function ObtenerDocumentosconMovNoContab($array)
	{		
		return DatMovimientoBancario::ObtenerDocumentosconMovNoContab($array);		
	}
	
	public function ObtenerMovimientosPorCuenta($idcuentabancaria, $idperiodo)
	{		
		$movimientos = DatMovimientoBancario::ObtenerMovimientoPorCuenta($idcuentabancaria);
		$pIntegrator = ZendExt_IoC_Inter::getInstance();
      
        $docs = $pIntegrator->comunfinanzas->ObtenerDocPorEntidadPeriodo($this->global->Estructura->idestructura, $idperiodo);
		$result = array();
		foreach($movimientos as $mov)
		 foreach($docs as $doc)
         {
		   if($mov['iddocumento']==$doc->iddocumento)
		   $result[]=$mov;
		 }		
		return ZendExt_ClassStandard::ArrayObject($result);
	}
	
	
	
 }//fin clase 

?>
 