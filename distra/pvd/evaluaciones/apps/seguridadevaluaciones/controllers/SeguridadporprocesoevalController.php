<?php 
class SeguridadporprocesoevalController extends ZendExt_Controller_Secure {	
	function init() {	
		parent::init();
	}

	function seguridadporprocesoevalAction() {
		$this->view->scriptFichaProcesoEval = $this->pIntegrator->procesoevaluativo->getScriptFichaProcesoEval();
		$this->render();
	}
	
	function getControladoresEvaluacionesAction(){
		$limit = $this->_request->getPost( 'limit' );
		$start = $this->_request->getPost( 'start' );
		$idpreprocesoevaluativo = $this->_request->getPost('idpreprocesoevaluativo');
		$idestructura = $this->global->Estructura->idestructura;
		$formaevaluacion = 1;
		$tipopersona = 2;
		$objAux = new DatEvalseguridadevalentidad();
		$segEvaldores = $objAux->obtenerControldores($idpreprocesoevaluativo, $formaevaluacion, $tipopersona, $idestructura, $limit, $start);
		
		if(count($segEvaldores)==0){			
			$r['datos'] = array();
			$r['cantidad'] = 0;
			echo json_encode($r);
		}
		else{
			$arrIdPersonas = array();
			foreach($segEvaldores as $segEvaldor){
				$arrIdPersonas[] = $segEvaldor['idpersona'];
			}
			
			$personas = $this->integrator->persona->GetPrincipalesDatosPersonaById($arrIdPersonas);
			foreach($segEvaldores as &$segEvaldor){
				foreach($personas as $persona){
					if($segEvaldor['idpersona'] == $persona->idpersona){
						$segEvaldor['numid'] = $persona->numid;
						$segEvaldor['nombre'] = $persona->nombre;
						$segEvaldor['snombre'] = $persona->snombre;
						$segEvaldor['papel'] = $persona->papel;
						$segEvaldor['sapel'] = $persona->sapel;
					}
				}
			}
			$r['datos'] = $segEvaldores;
			$r['cantidad'] = $objAux->obtenerCantControldores($idpreprocesoevaluativo, $formaevaluacion, $tipopersona, $idestructura);
			echo json_encode($r);
		}
	}
	
	function getEvaluadosAction(){
		$limit = $this->_request->getPost( 'limit' );
		$start = $this->_request->getPost( 'start' );
		$idevalseguridadevalentidad = $this->_request->getPost('idevalseguridadevalentidad');
		$objAux = new DatEvalaccesoevalentidad();		
		$segEvaldos = $objAux->obtenerEvaluadosPE($limit, $start, $idevalseguridadevalentidad);
		if(count($segEvaldos) == 0){
			$r['datos'] = array();
			$r['cantidad'] = 0;
			echo json_encode($r);
		}
		else{
			$arrIdPersonas = array();
			foreach($segEvaldos as $segEvaldo){
				$arrIdPersonas[] = $segEvaldo['idpersona'];
			}
			$personas = $this->pIntegrator->persona->GetPrincipalesDatosPersonaById($arrIdPersonas);
			foreach($segEvaldos as &$segEvaldo){
				foreach($personas as $persona){
					if($segEvaldo['idpersona'] == $persona->idpersona){
						$segEvaldo['numid'] = $persona->numid;
						$segEvaldo['nombre'] = $persona->nombre;
						$segEvaldo['snombre'] = $persona->snombre;
						$segEvaldo['papel'] = $persona->papel;
						$segEvaldo['sapel'] = $persona->sapel;
						$segEvaldo['modificar'] = ($segEvaldo['modificar'] == 1)?true:false;
						$segEvaldo['ver'] = ($segEvaldo['ver'] == 1)?true:false;
					}
				}
			}
			$r['datos'] = $segEvaldos;
			$r['cantidad'] = $objAux->getCantEvaluadosPE($idevalseguridadevalentidad);
			echo json_encode($r);
		}
	}
	
	function adicionarControladorAction(){
		$arrIdPersonas = Json_decode(stripslashes($this->_request->getPost('arrIdPersonas')));;
		$idpreprocesoevaluativo = $this->_request->getPost('idpreprocesoevaluativo');
		$idestructura = $this->global->Estructura->idestructura;
		$formaevaluacion = 1;
		$tipopersona = 2;
		$objAux = new DatEvalseguridadevalentidad();
		$segEvaldores = $objAux->obtenerControldores($idpreprocesoevaluativo, $formaevaluacion, $tipopersona, $idestructura, null, null);
		
		$objDatEvalseguridadevalentidadModel = new DatEvalseguridadevalentidadModel();
		//$verif = $objDatEvalseguridadevalentidadModel->ExisteDatEvalseguridadevalentidad($this->_request->getPost('arrIdPersonas.idpersona','idpreprocesoevaluativo'));
             
		foreach($arrIdPersonas as $idpersona){
			if($this->searchByKeyInArray($segEvaldores, 'idpersona', $idpersona) == false){
				$objDatEvalseguridadevalentidad = new DatEvalseguridadevalentidad();
				$objDatEvalseguridadevalentidad->idpersona = $idpersona;
				$objDatEvalseguridadevalentidad->formaevaluacion = $formaevaluacion;
				$objDatEvalseguridadevalentidad->idpreprocesoevaluativo = $idpreprocesoevaluativo;		
				$objDatEvalseguridadevalentidad->identidad = $idestructura;
				$objDatEvalseguridadevalentidadModel->Insertar($objDatEvalseguridadevalentidad);
			}
		}
		    $r->success = true;
		    echo (json_encode ($r));		
	}
	
	function adicionarEvaluadoAction(){
		$arrIdPersonas = Json_decode(stripslashes($this->_request->getPost('arrIdPersonas')));
		$idevalseguridadevalentidad = $this->_request->getPost('idevalseguridadevalentidad');
		
		$objDatEvalaccesoevalentidad = new DatEvalaccesoevalentidad();
		$segEvaldos = $objDatEvalaccesoevalentidad->obtenerEvaluadosPE($limit, $start, $idevalseguridadevalentidad);
		
		$objDatEvalaccesoevalentidadModel = new DatEvalaccesoevalentidadModel();
		foreach($arrIdPersonas as $idpersona){
			if($this->searchByKeyInArray($segEvaldos, 'idpersona', $idpersona) == false){
				$objDatEvalaccesoevalentidad = new DatEvalaccesoevalentidad();
				$objDatEvalaccesoevalentidad->idpersona = $idpersona;
				$objDatEvalaccesoevalentidad->idevalseguridadevalentidad = $idevalseguridadevalentidad;
				$objDatEvalaccesoevalentidadModel->Insertar($objDatEvalaccesoevalentidad);
			}
		}
		$r->success = true;
		echo (json_encode ($r));
	}
	
	function eliminarcontroladorAction(){
		$idevalseguridadevalentidad = $this->_request->getPost('idevalseguridadevalentidad');
		$objDatEvalseguridadevalentidadModel = new DatEvalseguridadevalentidadModel();
		$objDatEvalseguridadevalentidadModel->Eliminar($idevalseguridadevalentidad);
		$r->codMsg = 1; $r->mensaje = "La persona ha sido eliminada satisfactoriamente.";
		echo (json_encode ($r));
	}
	
	function eliminarevaluadoAction(){
		$idevalaccesoevalentidad = $this->_request->getPost('idevalaccesoevalentidad');
		$objDatEvalaccesoevalentidadModel = new DatEvalaccesoevalentidadModel();
		$objDatEvalaccesoevalentidadModel->Eliminar($idevalaccesoevalentidad);
		$r->codMsg = 1; $r->mensaje = "La persona ha sido eliminado satisfactoriamente.";
		echo (json_encode ($r));
	}
	
	function guardarPermisosEvaldosAction(){
		$arrEvaldos = Json_decode(stripslashes($this->_request->getPost('arrEvaldos')));
		$objDatEvalaccesoevalentidad = new DatEvalaccesoevalentidad();
		$objDatEvalaccesoevalentidadModel = new DatEvalaccesoevalentidadModel();

		foreach($arrEvaldos as &$evaldo){			
			$objAux = $objDatEvalaccesoevalentidad->Buscar($evaldo[0]);
			$objAux->ver = ($evaldo[1] == false)? $evaldo[1] = 0 : $evaldo[1] =1;
			$objAux->modificar = ($evaldo[2] == false)? $evaldo[2] = 0 : $evaldo[2] =1;
			$objDatEvalaccesoevalentidadModel->Actualizar($objAux);
		}
		
		$r->codMsg = 1; $r->mensaje = "La persona ha sido guardada satisfactoriamente.";
		echo (json_encode ($r));
	}
	
	function cambiarPermisoControladorAction(){
		$idevalseguridadevalentidad = $this->_request->getPost( 'idevalseguridadevalentidad' );
		$tipoPermiso = $this->_request->getPost( 'tipoPermiso' );		
		$objDatEvalseguridadevalentidad = new DatEvalseguridadevalentidad();
		$objSeguridadEntidad = $objDatEvalseguridadevalentidad->Buscar($idevalseguridadevalentidad);
		$objSeguridadEntidad->todo = $tipoPermiso;
		$objEvalSeguridadEntidadModel = new DatEvalseguridadevalentidadModel();
		$objEvalSeguridadEntidadModel->Actualizar($objSeguridadEntidad);
		if($tipoPermiso != 3){	//Mientras no sea un permiso personalizado
			$objDatEvalaccesoevalentidadModel = new DatEvalaccesoevalentidadModel();
			$objDatEvalaccesoevalentidadModel->cambiarPermisos($idevalseguridadevalentidad, $tipoPermiso);
		}
		$r->codMsg = 1; $r->mensaje = "Permisos cambiados correctamente."; 		
		echo (json_encode ($r));
	}
	
	/**
	* Busca un dato en un array por el indice especificado
	* Devuelve TRUE si existe FALSE en caso contrario.
	*/
	private function searchByKeyInArray($array, $key, $value){		
		foreach($array as $pValue){
			if($pValue[$key] == $value)
				return true;
		}
		return false;
	}

}
