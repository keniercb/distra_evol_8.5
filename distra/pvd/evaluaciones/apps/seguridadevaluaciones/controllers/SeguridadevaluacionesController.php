<?php 
class SeguridadevaluacionesController extends ZendExt_Controller_Secure 
{	
	function init()
	{	
		parent::init();
	}

	function seguridadevaluacionesAction() {
		$this->render();
	}
	
	function getProcesosEvalPreparadosAction() {
		$limit = $this->_request->getPost ( 'limit' );
		$start = $this->_request->getPost ( 'start' );
		$r['datos']= $this->pIntegrator->procesoevaluativo->getProcesoEvalPreparados($limit, $start);
		$r['cantidad'] = $this->pIntegrator->procesoevaluativo->getCantTotalProcPrep();
		//print_r($r['datos']);die;		
		echo json_encode($r);
	}
	
	function verTipoEstructuraAction(){
		$estructura = $this->integrator->metadatos->DameEstructura($this->global->Estructura->idestructura);
		$r['idTipo'] = $estructura[0]->idnomeav; //tiene que ser de tipo 3 para que sea una entidad
		echo json_encode($r);
	}
	
	function getEvaldoresPeAction(){
		$limit = $this->_request->getPost( 'limit' );
		$start = $this->_request->getPost( 'start' );
		$idpreprocesoevaluativo = $this->_request->getPost( 'idpreprocesoevaluativo' );
		$formaevaluacion = $this->_request->getPost('formaevaluacion');
		
		$objAux = new DatEvalseguridadevalentidad();
		$segEvaldores = $objAux->obtenerEvaluadoresPE($limit, $start, $idpreprocesoevaluativo, $formaevaluacion);
		$arrIdPersonas = array();
		
		foreach($segEvaldores as $segEvaldor){
			$arrIdPersonas[] = $segEvaldor['idpersona'];
		}
		$personas = $this->pIntegrator->persona->GetPrincipalesDatosPersonaById($arrIdPersonas);
		$estaEvaldor = false;
		foreach($segEvaldores as &$segEvaldor){
			foreach($personas as $persona){
				if($segEvaldor['idpersona'] == $persona->idpersona){
					$segEvaldor['nombre'] = $persona->nombre.' '.$persona->snombre.' '.$persona->papel.' '.$persona->sapel;
					$segEvaldor['numid'] = $persona->numid;
					$estaEvaldor = true;
				}
			}
			if(!$estaEvaldor){//En caso de que no se halla encontrado el evaluador lo elimino.
				$objSeguridadevalentidad = $objAux->Buscar($segEvaldor['idevalseguridadevalentidad']);
				$objSeguridadevalentidadModel = new DatEvalseguridadevalentidadModel();
				$objSeguridadevalentidadModel->Eliminar($objSeguridadevalentidad);
			}
			$arrAux = $this->pIntegrator->procesoevaluativo->getIdEvaluadorProceso($segEvaldor['idpersona'], $idpreprocesoevaluativo);
			$segEvaldor['idprocesoevaluadores'] = $arrAux[0]->idprocesoevaluadores;
			$estaEvaldor = false;
		}
		$r['datos'] = $segEvaldores;
		$r['cantidad'] = $objAux->getCantEvaluadoresPE($idpreprocesoevaluativo, $formaevaluacion);
		echo json_encode($r);
	}
	
	function getEvaldosPeAction(){
		$idevalseguridadevalentidad = $this->_request->getPost( 'idevalseguridadevalentidad' );
		$limit = $this->_request->getPost( 'limit' );
		$start = $this->_request->getPost( 'start' );
		
		$objAux = new DatEvalaccesoevalentidad();		
		$segEvaldos = $objAux->obtenerEvaluadosPE($limit, $start, $idevalseguridadevalentidad);
		$arrIdPersonas = array();
		if(!empty($segEvaldos)){
			foreach($segEvaldos as $segEvaldo){
				$arrIdPersonas[] = $segEvaldo['idpersona'];
			}		
			$personas = $this->pIntegrator->persona->GetPrincipalesDatosPersonaById( $arrIdPersonas );
			foreach($segEvaldos as &$segEvaldo){
				foreach($personas as $persona){
					if($segEvaldo['idpersona'] == $persona->idpersona){
						$segEvaldo['nombre'] = $persona->nombre.' '.$persona->snombre.' '.$persona->papel.' '.$persona->sapel;
						$segEvaldo['numid'] = $persona->numid;
						$segEvaldo['modificar'] = ($segEvaldo['modificar'] == 1)?true:false;
						$segEvaldo['ver'] = ($segEvaldo['ver'] == 1)?true:false;
					}
				}			
			}
			$r['datos'] = $segEvaldos;
			$r['cantidad'] = $objAux->getCantEvaluadosPE($idevalseguridadevalentidad);
			echo json_encode($r);	
		}		
		else{
			$r['datos'] = array();
			$r['cantidad'] = 0;
			echo json_encode($r);
		}
		
	}
	
	function getEstructuraAction(){
		$idestructura = $this->global->Estructura->idestructura;
		$idpadre = $this->_request->getPost('idnodo');
		if($idpadre==-1)
			$arbolestructurae= $this->integrator->metadatos->DameHijosEstructura($idestructura);
		else
			$arbolestructurae= $this->integrator->metadatos->DameHijosEstructura($idpadre);
		$arr=array();
		if(count($arbolestructurae)){
			$i=0;			
			foreach($arbolestructurae as $valores=>$valor){ 
				if($valor->idtipo==1){
					$arr[$i]['id']     = $valor->id;
					$arr[$i]['text']   = $valor->text;
					$arr[$i]['abrev']  = $valor->abrev;
					$arr[$i]['fdesde'] = $valor->fdesde;
					$arr[$i]['fhasta'] = $valor->fhasta;  
					$arr[$i]['tipoestructura'] = $valor->idtipo;   					
					$arr[$i]['leaf']   = false;
					$i++;
				}else if($valor->idtipo==2){
					$arr[$i]['id']     = $valor->id;
					$arr[$i]['text']   = $valor->text;
					$arr[$i]['abrev']  = $valor->abrev;
					$arr[$i]['fdesde'] = $valor->fdesde;
					$arr[$i]['fhasta'] = $valor->fhasta;  
					$arr[$i]['tipoestructura'] = $valor->idtipo;   					
					$arr[$i]['leaf']   =  false;
					$i++;
				}else if($valor->idtipo==3){
					$arr[$i]['id']     = $valor->id;
					$arr[$i]['text']   = $valor->text;
					$arr[$i]['abrev']  = $valor->abrev;
					$arr[$i]['fdesde'] = $valor->fdesde;
					$arr[$i]['fhasta'] = $valor->fhasta;  
					$arr[$i]['tipoestructura'] = $valor->idtipo;   					
					$arr[$i]['leaf']   = true;
					$i++;
				}
			}
		}
		$this->estructuras = $arr;
		echo json_encode ($arr);
	}

	function getPersonasAction(){
		$limit = $this->_request->getPost('limit');
		$start = $this->_request->getPost('start');
		$filtro = $this->_request->getPost('filtro');
		$idestructura = $this->global->Estructura->idestructura;
        $idusuario = $this->global->Perfil->idusuario;
        $idpersonausuario = $this->integrator->seguridad->getIdPersonaByIdUsuario($idusuario);
		$iddominio = $this->global->Perfil->iddominio;
        $arrPermisos = $this->integrator->pvd->GetSeguridadXPersona($idpersonausuario[0]->idpersona,$idusuario);
        $permiso = -1;
        if(count($arrPermisos) > 0)
			$permiso = $arrPermisos[0]['permiso'];
		$personas = $this->integrator->pvd->BuscarPersonaPorTexto($start, $limit, $filtro, $idestructura, $iddominio, $permiso);
		$objSeguridadAccesoEntidades = new DatEvalseguridadaccesoentidades();
		$personasSegAccEnt = $objSeguridadAccesoEntidades->GetTodos();
		
		foreach($personas as &$persona){
			$persona['idestructura'] = '';
			$persona['estructura'] = '';
			$persona['idevalseguridadaccesoentidades']='';
			foreach($personasSegAccEnt as $dato){
				if($persona['idpersona'] == $dato['idpersona']){
					$persona['idestructura'] = $dato['idestructura'];
					$persona['idevalseguridadaccesoentidades'] = $dato['idevalseguridadaccesoentidades'];
					$aux = $this->integrator->metadatos->DameEstructura($persona['idestructura']);
					$persona['estructura'] = $aux[0]->denominacion;
				}
			}
			$persona['nombre'] = $persona['nombre'].' '.$persona['papel'].' '.$persona['sapel'];
		}
		$r['datos'] = $personas;
		$r['cantidad'] = $this->integrator->pvd->CantidadBuscarPersonaPorTexto($filtro, $idestructura, $iddominio, $permiso);
		echo json_encode($r);
	}
	
	function cambiarPermisoEvaldorAction(){
		$idevalseguridadevalentidad = $this->_request->getPost( 'idevalseguridadevalentidad' );
		$todo = $this->_request->getPost( 'todo' );		
		$objDatEvalseguridadevalentidad = new DatEvalseguridadevalentidad();
		$objSeguridadEntidad = $objDatEvalseguridadevalentidad->Buscar($idevalseguridadevalentidad);
		$objSeguridadEntidad->todo = $todo;
		
		$objEvalSeguridadEntidadModel = new DatEvalseguridadevalentidadModel();
		$objEvalSeguridadEntidadModel->Actualizar($objSeguridadEntidad);		
		$r->codMsg = 1; $r->mensaje = "Permiso cambiado correctamente."; 		
		echo (json_encode ($r));
	}
	
	function aplicarPermisoPersonaEntAction(){
		$idpersona = $this->_request->getPost('idpersona');
		$idestructura = $this->_request->getPost('idestructura');
		
		$objDatEvalseguridadaccesoentidades = new DatEvalseguridadaccesoentidades();
		$objAux = $objDatEvalseguridadaccesoentidades->existePersonaSegAccesoEnt($idpersona);
		$objDatEvalseguridadaccesoentidadesModel = new DatEvalseguridadaccesoentidadesModel();
		if ($objAux){ //Pregunto si ya el objeto existe
			$objAModificar = $objDatEvalseguridadaccesoentidades->getSeguridadAccesoEntidades($objAux[0]['idevalseguridadaccesoentidades']);
			$objAModificar->idestructura = $idestructura;
			$objDatEvalseguridadaccesoentidadesModel->Actualizar($objAModificar);
		}
		else{
			$objDatEvalseguridadaccesoentidades->idpersona = $idpersona;
			$objDatEvalseguridadaccesoentidades->idestructura = $idestructura;
			$objDatEvalseguridadaccesoentidadesModel->Insertar($objDatEvalseguridadaccesoentidades);
		}
		$r->codMsg = 1; $r->mensaje = "Se aplic&oacute; el permiso correctamente.";
		echo (json_encode ($r));
	}
	
	function quitarPermisoAccesoEntAction(){
		$idevalseguridadaccesoentidades = $this->_request->getPost('idevalseguridadaccesoentidades');
		$objDatEvalseguridadaccesoentidadesModel =  new DatEvalseguridadaccesoentidadesModel();
		$objDatEvalseguridadaccesoentidadesModel->Eliminar($idevalseguridadaccesoentidades);
		$r->codMsg = 1; $r->mensaje = "Permisos eliminados correctamente.";
		echo (json_encode ($r));
	}
	
	function getPersonasAddByEntidadAction(){
		$limit = $this->_request->getPost('limit');
		$start = $this->_request->getPost('start');
		$filtro = $this->_request->getPost('filtro');
		$idestructura = $this->global->Estructura->idestructura;
        $idusuario = $this->global->Perfil->idusuario;
        $idpersonausuario = $this->integrator->seguridad->getIdPersonaByIdUsuario($idusuario);
		$iddominio = $this->global->Perfil->iddominio;
        $arrPermisos = $this->integrator->pvd->GetSeguridadXPersona($idpersonausuario[0]->idpersona,$idusuario);
        $permiso = -1;
        if(count($arrPermisos) > 0)
			$permiso = $arrPermisos[0]['permiso'];
		$personas = $this->integrator->pvd->BuscarPersonaPorTexto($start, $limit, $filtro, $idestructura, $iddominio, $permiso);
		$arrAux = array();
		$i = 0;
		foreach($personas as $persona){
			$arrAux[$i]['idpersona'] = $persona['idpersona'];
			$arrAux[$i]['numid'] = $persona['numid'];
			$arrAux[$i]['nombre'] = $persona['nombre'].' '.$persona['snombre'].' '.$persona['papel'].' '.$persona['sapel'];
			$i++;
		}
		$r['datos'] = $arrAux;
		$r['cantidad'] = $this->integrator->pvd->CantidadBuscarPersonaPorTexto($filtro, $idestructura, $iddominio, $permiso);
		echo json_encode($r);
	}
	
	function adicionarEvaldorProcEvalAction(){
		$idestructura = $this->global->Estructura->idestructura;		
		$formaevaluacion = $this->_request->getPost('formaevaluacion');
		$idpersona = $this->_request->getPost('idpersona');
		$idPrepProcesoEvaluativo = $this->_request->getPost('idPrepProcesoEvaluativo');
		
		$objDatEvalseguridadevalentidad = new DatEvalseguridadevalentidad();
		$objDatEvalseguridadevalentidad->idpersona = $idpersona;
		$objDatEvalseguridadevalentidad->formaevaluacion = $formaevaluacion;
		$objDatEvalseguridadevalentidad->idpreprocesoevaluativo = $idPrepProcesoEvaluativo;		
		$objDatEvalseguridadevalentidad->identidad = $idestructura;
		
		$objDatEvalseguridadevalentidadModel = new DatEvalseguridadevalentidadModel();
		$objDatEvalseguridadevalentidadModel->Insertar($objDatEvalseguridadevalentidad);
		$r->codMsg = 1; $r->mensaje = "El evaluador se guard&oacute; correctamente.";
		echo (json_encode ($r));
	}
	
	function adicionarEvaldoProcEvalAction(){
		$idpersona = $this->_request->getPost('idpersona');
		$idevaluador = $this->_request->getPost('idevaluador');
		$idprocesoevaluadores = $this->_request->getPost('idprocesoevaluadores');
		$idevalseguridadevalentidad = $this->_request->getPost('idevalseguridadevalentidad');
		$idpreprocesoevaluativo = $this->_request->getPost('idpreprocesoevaluativo');
		$tipopersona= $this->_request->getPost('tipopersona');
		$idestructura = $this->global->Estructura->idestructura;
		
		$objDatEvalaccesoevalentidad = new DatEvalaccesoevalentidad();
		$objDatEvalaccesoevalentidad->idpersona = $idpersona;
		$objDatEvalaccesoevalentidad->idevalseguridadevalentidad = $idevalseguridadevalentidad;
		$objDatEvalaccesoevalentidadModel = new DatEvalaccesoevalentidadModel();
		$objDatEvalaccesoevalentidadModel->Insertar($objDatEvalaccesoevalentidad);
		
		if($tipopersona == 1 && $idprocesoevaluadores != null){
			$aux = $this->pIntegrator->procesoevaluativo->adicionarEvaluado($idpersona, $idpreprocesoevaluativo, $idprocesoevaluadores);
		}		
		$r->codMsg = 1; $r->mensaje = "El evaluado se guard&oacute; correctamente.";
		echo (json_encode ($r));
	}
	
	function eliminarEvaldorProcEvalAction(){
		$idevalseguridadevalentidad = $this->_request->getPost('idevalseguridadevalentidad');
		$objDatEvalseguridadevalentidad = new DatEvalseguridadevalentidad();
		$objAux = $objDatEvalseguridadevalentidad->Buscar($idevalseguridadevalentidad);
		$objDatEvalseguridadevalentidadModel = new DatEvalseguridadevalentidadModel();
		$objDatEvalseguridadevalentidadModel->Eliminar($objAux);
		
		$r->codMsg = 1; $r->mensaje = "El evaluador se elimin&oacute; correctamente.";
		echo (json_encode ($r));
	}
	
	function eliminarEvaldoProcEvalAction(){
		$idevalaccesoevalentidad = $this->_request->getPost('idevalaccesoevalentidad');
		$idpersona = $this->_request->getPost('idpersona');
		$tipopersona = $this->_request->getPost('tipopersona');
		$idprocesoevaluadores = $this->_request->getPost('idprocesoevaluadores');
		$idpreprocesoevaluativo = $this->_request->getPost('idpreprocesoevaluativo');
		
		$objDatEvalaccesoevalentidad = new DatEvalaccesoevalentidad();
		$objAux = $objDatEvalaccesoevalentidad->Buscar($idevalaccesoevalentidad);
		$objDatEvalaccesoevalentidadModel = new DatEvalaccesoevalentidadModel();
		$objDatEvalaccesoevalentidadModel->Eliminar($objAux);
		
		if($tipopersona == 1 && $idprocesoevaluadores != null){
			$aux = $this->pIntegrator->procesoevaluativo->eliminarEvaluado($idpersona, $idprocesoevaluadores, $idpreprocesoevaluativo);
		}
		
		$r->codMsg = 1; $r->mensaje = "Se elimin&oacute; correctamente el evaluado.";
		echo (json_encode ($r));
	}
	
	function guardarPermisosEvaldosPEAction(){
		$arrEvaldos = Json_decode(stripslashes($this->_request->getPost('arrEvaldos')));
		$objDatEvalaccesoevalentidad = new DatEvalaccesoevalentidad();
		$objDatEvalaccesoevalentidadModel = new DatEvalaccesoevalentidadModel();

		foreach($arrEvaldos as &$evaldo){			
			$objAux = $objDatEvalaccesoevalentidad->Buscar($evaldo[0]);
			$objAux->ver = ($evaldo[1] == false)? $evaldo[1] = 0 : $evaldo[1] =1;
			$objAux->modificar = ($evaldo[2] == false)? $evaldo[2] = 0 : $evaldo[2] =1;
			$objDatEvalaccesoevalentidadModel->Actualizar($objAux);
		}
		
		$r->codMsg = 1; $r->mensaje = "Se guardaron los permiso correctamente.";
		echo (json_encode ($r));
	}

}