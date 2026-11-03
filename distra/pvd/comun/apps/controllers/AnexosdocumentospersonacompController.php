<?php
class AnexosdocumentospersonacompController extends ZendExt_Controller_Secure {

    function init () {
        parent::init();
    }

    function anexosdocumentospersonacompAction() {
        $this->render();
    }

	function cargardocumentospersonaAction(){
		  $idpersona = $this->_request->getPost('idpersona');
		  $limit = $this->_request->getPost('limit');
		  $start = $this->_request->getPost('start');
		  $objPerDoc = new DatPersonadocumentos();
		  $arrPerDoc = $objPerDoc->Obtenerdocumentos($idpersona);
		  $resultado = array();
		  $cantDocs = count($arrPerDoc);



		  if($cantDocs > 0){
			  foreach($arrPerDoc as $k => $v){
			    $arrDocs[] = $v['iddocumento'];
			  }
			  $resultado = $this->integrator->gesdoc->getDetallesListaContenidos($arrDocs);
			  foreach($resultado as $k => &$v){
				$v['idpersonadocumento'] = $arrPerDoc[$k]['idpersonadocumento'];
			  }
		  }


		  echo json_encode(array('cantidad'=>$cantDocs, 'datos'=>$resultado));

	}
	
	function verificarespaciotrabajoAction(){
		  $idpersona = $this->_request->getPost('idpersona');
		  $idsubsistema = $this->global->Subsistema->idsubsistema;
		  $espaciotrabajosubsistema = $this->integrator->configsecodena->getEspaciotrabajoporsubsistema($idsubsistema);
		  //print_r($espaciotrabajosubsistema);die;
		  if($espaciotrabajosubsistema != ''){
			$objConfDoc = new DatPersonaconfdocumentos();
			$arrConfDoc = $objConfDoc->Obtenerconfdocumento($idpersona);
			if(count($arrConfDoc) > 0){
				$r->codigo = 1;
				$r->espaciotrabajo = $arrConfDoc[0]['espaciotrabajo'];
			}else{
			    $arrPropiedades = array('nombre'=>$idpersona, 'descripcion'=>'');
                            $espaciotrabajo = $this->integrator->gesdoc->adicionarEspacioTrabajo($espaciotrabajosubsistema, $arrPropiedades);
                            $objConfDoc->idpersona = $idpersona;
                            $objConfDoc->espaciotrabajo = $espaciotrabajo;
                            $objConfDocModel = new DatPersonaconfdocumentosModel();
                            $objConfDocModel->Insertar($objConfDoc);
                            $r->codigo = 1;
                            $r->espaciotrabajo = $espaciotrabajo;
			}
		  }else{
			$r->codigo = 3;
			$r->mensaje = "No existe ning&uacute;n espacio de trabajo configurado.";
		  }

		  echo json_encode($r);
	}

	function adicionardocumentoapersonaAction(){
		  $idpersona = $this->_request->getPost('idpersona');
		  $iddocumento = $this->_request->getPost('iddocumento');

			$objDoc = new DatPersonadocumentos();
			$objDoc->idpersona = $idpersona;
			$objDoc->iddocumento = $iddocumento;
			$objDocModel = new DatPersonadocumentosModel();
			$objDocModel->Insertar($objDoc);

			$r->codigo = 1;
			$r->mensaje = "El documento se guard&oacute; satisfactoriamente.";

		  echo json_encode($r);
	}

	function eliminardocumentodelapersonaAction(){
		    $idpersonadocumento = $this->_request->getPost('idpersonadocumento');
		    $iddocumento = $this->_request->getPost('iddocumento');

			$objDoc = new DatPersonadocumentos();
			$objDoc = $objDoc->Buscar($idpersonadocumento);
			$iddocumento = $objDoc->iddocumento;
			$objDocModel = new DatPersonadocumentosModel();
			$objDocModel->Eliminar($objDoc);

			$this->integrator->gesdoc->eliminarContenido($iddocumento);

			$r->codigo = 1;
			$r->mensaje = "El documento se elimin&oacute; satisfactoriamente.";

		  echo json_encode($r);
	}

	function abrirdocumentodelapersonaAction(){
		  $iddocumento = $this->_request->getPost('iddocumento');
		  $r->contenido = $this->integrator->gesdoc->AbrirElementoContenido($iddocumento);

		  echo json_encode($r);
	}

}
?>
