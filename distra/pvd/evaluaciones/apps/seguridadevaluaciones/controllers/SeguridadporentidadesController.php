<?php 
class SeguridadporentidadesController extends ZendExt_Controller_Secure {	
	function init() {	
		parent::init();
	}

	function seguridadporentidadesAction() {
		//$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
		$this->render();
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
        //print_r($idpersonausuario);die;
		$iddominio = $this->global->Perfil->iddominio;
        $arrPermisos = $this->integrator->pvd->GetSeguridadXPersona($idpersonausuario[0]->idpersona,$idusuario);
        
        $permiso = -1;
        if(count($arrPermisos) > 0)
			$permiso = $arrPermisos[0]['permiso'];
		$listadoPersonas = $this->integrator->pvd->BuscarPersonaPorTexto($start, $limit, $filtro, $idestructura, $iddominio, $permiso);
		
		$objSeguridadAccesoEntidades = new DatEvalseguridadaccesoentidades();
		$personasSegAccEnt = $objSeguridadAccesoEntidades->GetTodos();
		$result = array();
		foreach($personasSegAccEnt as $personaSeguridad){
			foreach($listadoPersonas as $persona){
				if($personaSeguridad['idpersona'] == $persona['idpersona']){
					$arrAux['idevalseguridadaccesoentidades'] = $personaSeguridad['idevalseguridadaccesoentidades'];
					$arrAux['idpersona'] = $persona['idpersona'];
					$arrAux['numid'] = $persona['numid'];
					$arrAux['nombre'] = $persona['nombre'];
					$arrAux['snombre'] = $persona['snombre'];
					$arrAux['papel'] = $persona['papel'];
					$arrAux['sapel'] = $persona['sapel'];
					$aux = $this->integrator->metadatos->DameEstructura($personaSeguridad['idestructura']);
					$arrAux['estructura'] = $aux[0]->denominacion;
					$result[] = $arrAux;
					break;
				}
			}
		}
		$r['datos'] = $result;
		$r['cantidad'] = $objSeguridadAccesoEntidades->getCantTotal();
		echo json_encode($r);
	}
	
	function eliminarpersonaseguridadAction(){
		$idevalseguridadaccesoentidades = $this->_request->getPost('idevalseguridadaccesoentidades');
		$objDatEvalseguridadaccesoentidadesModel = new DatEvalseguridadaccesoentidadesModel();
		$objDatEvalseguridadaccesoentidadesModel->Eliminar($idevalseguridadaccesoentidades);
		$r->codMsg = 1; $r->mensaje = "La persona se ha eliminado satisfactoriamente.";
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
		$r->codMsg = 1; $r->mensaje = "Se aplic&oacute; el permiso satisfactoriamente.";
		echo (json_encode ($r));
	}
	

}
