<?php 
class TipoprocesoController extends ZendExt_Controller_Secure 
{	
	function init()
	{	
		parent::init();	
	}

	function tipoprocesoAction()
	{
       // $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
		$this->render();
	}
	
	function todostipoprocesosAction(){		
		$filtro = $this->_request->getPost ( 'filtro' );
		$limit = $this->_request->getPost ( 'limit' );
		$start = $this->_request->getPost ( 'start' );
		$objTipoProcesos = new NomEvaltipoprocesoevaluativo();
		if($filtro == ''){
			$r['datos'] = $objTipoProcesos->GetPorLimite($limit,$start);
			$r['cantidad'] = $objTipoProcesos->GetCantTotal();	    
			echo (json_encode ($r));
		}else{
			$r['datos'] = $objTipoProcesos->filtrarTiposProcesos($filtro,$limit,$start);
			$r['cantidad'] = $objTipoProcesos->cantidadProcesosFiltro($filtro);	    
			echo (json_encode ($r));
		}
	
	}
	
	function adicionartipoprocesoAction(){
		$objTipoProcesos = new NomEvaltipoprocesoevaluativo();
		$denom = $this->_request->getPost ( 'denom' );
		$x = $objTipoProcesos->ExisteDenomTipoProceso($denom);				
		if(!$x)
		{
			$objTipoProcesos->denom = $denom;		
			$objTipoProcesos->descripcion = $this->_request->getPost ( 'descripcion' );	
			
			if($this->_request->getPost ( 'orden' ) == 'true')
				$objTipoProcesos->orden = true;
			else
				$objTipoProcesos->orden = false;
				
			if($this->_request->getPost ( 'comision' ))
				$objTipoProcesos->comisionevaluacion = true;
			else
				$objTipoProcesos->comisionevaluacion = false;
				
			if($this->_request->getPost ( 'evaluadorEvaluado' ))
				$objTipoProcesos->evaluadoresevaluados = true;
			else
				$objTipoProcesos->evaluadoresevaluados = false;
				
			if($this->_request->getPost ( 'autoevaluacion' ))
				$objTipoProcesos->autoevaluacion = true;
			else
				$objTipoProcesos->autoevaluacion = false;
				
			$objTipoProcesos->fechainicio = $this->_request->getPost ( 'fechainicio' );		
			  if($this->_request->getPost ( 'fechafin' ) == '')
			   $ff = null;
			  else  
			   $ff = $this->_request->getPost ( 'fechafin' ); 
			$objTipoProcesos->fechafin = $ff;		
			$objTipoProcesosModel = new NomEvaltipoprocesoevaluativoModel();
			$objTipoProcesosModel->Insertar($objTipoProcesos);	
			$r->rcodMsg = 1; $r->mensaje = "El tipo de proceso ha sido adicionado satisfactoriamente.";
		} 
		else{
			$r->rcodMsg = 3; $r->mensaje = "El tipo de proceso que quiere adicionar ya existe.";
		}			
     echo (json_encode ($r));
	
	}
	
	function modificartipoprocesoAction(){
		$idtipoprocesoevaluativo = $this->_request->getPost ( 'idtipoprocesoevaluativo' );
		$objTipoProcesos = Doctrine::getTable ( 'NomEvaltipoprocesoevaluativo' )->find ( $idtipoprocesoevaluativo ); 
		$tipoProcesos = $this->_request->getPost ( 'denom' );
				
		$objTipoProcesos->descripcion = $this->_request->getPost ( 'descripcion' );	
		
		if($this->_request->getPost ( 'orden' ) == 'true')
			$objTipoProcesos->orden = true;
		else
			$objTipoProcesos->orden = false;
			
		if($this->_request->getPost ( 'comision' ))
			$objTipoProcesos->comisionevaluacion = true;
		else
			$objTipoProcesos->comisionevaluacion = false;
			
		if($this->_request->getPost ( 'evaluadorEvaluado' ))
			$objTipoProcesos->evaluadoresevaluados = true;
		else
			$objTipoProcesos->evaluadoresevaluados = false;
			
		if($this->_request->getPost ( 'autoevaluacion' ))
			$objTipoProcesos->autoevaluacion = true;
		else
			$objTipoProcesos->autoevaluacion = false;
			
		$objTipoProcesos->fechainicio = $this->_request->getPost ( 'fechainicio' );		
		  if($this->_request->getPost ( 'fechafin' ) == '')
		   $ff = null;
		  else  
		   $ff = $this->_request->getPost ( 'fechafin' ); 
		$objTipoProcesos->fechafin = $ff;
		$val = NomEvaltipoprocesoevaluativo::ExisteDenomTipoProcesoMod($idtipoprocesoevaluativo,$tipoProcesos);
		if(!$val){
				$objTipoProcesos->denom = $tipoProcesos;
				$objTipoProcesosModel = new NomEvaltipoprocesoevaluativoModel();
				$objTipoProcesosModel->Actualizar($objTipoProcesos);	
				$r->rcodMsg = 1; $r->mensaje = "El tipo de proceso ha sido modificado satisfactoriamente.";
		}else{	
			$r->rcodMsg = 3; $r->mensaje = "El tipo de proceso ya existe.";
		}
		
			
     echo (json_encode ($r));	  
	
	}
	
	function verificarTipoProceso($denom)
		{
	     $tipoproceso = NomEvaltipoprocesoevaluativo::ExisteDenomTipoProceso($denom);
	     if($tipoproceso)
     	   return 1;
	     else 
	       return 0;
		}
	
	function eliminartipoprocesoAction(){	   
	   try {
	    $idtipoprocesoevaluativo = $this->_request->getPost ('idtipoprocesoevaluativo');	    
		$objTipoProcesos = Doctrine::getTable ( 'NomEvaltipoprocesoevaluativo' )->find ( $idtipoprocesoevaluativo );
		$objTipoProcesosModel = new NomEvaltipoprocesoevaluativoModel();
        $objTipoProcesosModel->Eliminar($objTipoProcesos);
        $r->rcodMsg = 1;
        $r->mensaje = "El tipo de proceso ha sido elimininado satisfactoriamente.";
	    echo (json_encode ($r));
	   } catch (Exception $e) {
            if($e->getCode() == 23503) {//Code for foreignKeyViolation
                $r->exception = 1;
                echo (json_encode($r));
            }else{
                echo (json_encode($e->getMessage()));
            }
        }
      }

}
