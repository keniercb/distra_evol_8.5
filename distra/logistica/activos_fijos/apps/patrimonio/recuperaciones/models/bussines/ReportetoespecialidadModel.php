<?php

class ReportetoespecialidadModel extends ZendExt_Model {

    public function ReportetoespecialidadModel() {
        parent::ZendExt_Model();
    }
	public function activarEspecialidad( $params )
    {
        $recEspecialidad = json_decode( $params['recEspecialidad'] );
		$result->success = false;	
		if ( $recEspecialidad ) {
		    $record = $recEspecialidad[0];
            $exists = ConfEspecialidadreporte::existsEspecialidadRectora( settype( $record , 'Array' ) );       
			if ( $exists == 0 ) {	
				$especialidadReporte = Doctrine::getTable('ConfEspecialidadreporte')->findByDql('idespecialidad =?', array( $recEspecialidad[0]->idespecialidad ) );
				$data = $especialidadReporte->getData();
				if ( $data ) {			  
					$rectora = ( $recEspecialidad[0]->rectora == 0 ) ? 1 : 0;							
					foreach( $data as $table ){				
						$table->rectora = $rectora;
						$especialidadReporte->add( $table );						
					}							
					$especialidadReporte->save();	
					$result->success = 	true;
				}	else {
					$result->success = false;
					$result->code = 1;	
				}
			} else {			
			    $result->success = false;
				$result->code = 2;
			}			
		}       
		return  $result;
    }
	public function cargarEspecialidad()
    {
        $datos = ZendExt_IoC::getInstance()->integrator->parametros->ObtenerEspecialidadesHojas();
	    $result = Array();
	    foreach( $datos as $index => $data ) {
		    $result[$index]['idespecialidad'] = $data['idespecialidad'];			
	        $result[$index]['denominacion'] = $data['denespecialidad'];
			$record = ConfEspecialidadreporte::cargarEspecialidad( $data );         
			$result[$index]['rectora'] = ( $record ) ? $record[0]['rectora'] : 0;			
	    }	
		return array( 'datos' => $result, 'total' => count( $result ) ) ;
    }
	
	public function cargarReportes( $params )
    {
        $params['all'] = true;
		$params['visible'] = 1;
		$datos = ConfEspecialidadreporte::cargarReportes( $params );		
		$result = Array();
	    foreach( $datos as $index => $data ) {
		    $result[$index]['idreporte'] = $data['idconfreporte'];	      	
			$result[$index]['denominacion'] = $data['denominacion'];			
	    }	
		$params ['all'] = false;		
        $reporte = ConfEspecialidadreporte::cargarReportes( $params );  
        $cant = 0;		
		foreach( $reporte as $indexB => $data ) {		    
			foreach( $result as $indexA => $dato ) {            		
			    if ( $dato['idreporte'] == $data['idreporte'] )  {              
					$result[$indexA]['activo'] = true;
			    } 			
			} 
		}		
		return array( 'datos' => $result, 'total' => count( $result ) ) ;
    }
	
	public function guardarEspecialidadToReportes( $params )
    {
        $recEspecialidad = json_decode( $params['recEspecialidad'] );
		$arrReportesAdd = json_decode( $params['idreportsAdd'] );		
		$result->success = false;
		if ( $arrReportesAdd ) { 
			$collection = new Doctrine_Collection('ConfEspecialidadreporte');		
			foreach( $arrReportesAdd as $data ) {
				$especialidadReporte = new ConfEspecialidadreporte();
				$especialidadReporte->idespecialidad = $recEspecialidad[0]->idespecialidad;
				$especialidadReporte->rectora = $recEspecialidad[0]->rectora;
				$especialidadReporte->idreporte = $data->idreporte;
				//	print_r($especialidadReporte);die;
				$collection->add( $especialidadReporte );			
			}			
			$collection->save();
			$result->success = 	true;					
		}
		$arrReportesDel = json_decode( $params['idreportsDel'] );
        if ( $arrReportesDel ) { 			
		    foreach( $arrReportesDel as $data ) {
				$especialidadReporteDel = Doctrine::getTable('ConfEspecialidadreporte')->findByDql('idespecialidad =? and idreporte =?', array( $recEspecialidad[0]->idespecialidad , $data->idreporte ) );			
				$especialidadReporteDel->delete();			
			}
			$result->success = 	true;			
		}       
		return  $result;
    }

}