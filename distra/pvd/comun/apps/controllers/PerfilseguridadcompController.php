<?php
class PerfilseguridadcompController extends ZendExt_Controller_Secure {
    function init () {
        parent::init();
    }

    function perfilseguridadcompAction() {
        $this->render();
    }
	
	public function mostrarperfilseguridadAction(){
        $idpersona = $this->_request->getPost('idpersona');
        $arrdatos = $this->integrator->pvd->DevolverPersonasPrincipalesseguridadPersonaById($idpersona);
        //print_r($arrdatos);die;
		if(count($arrdatos) > 0){
	        $r->nombreapellidos = $arrdatos[0]->nombreapellidos;
	        $r->numid = $arrdatos[0]->numid;
	        if($arrdatos[0]->extension != '')
	            $r->dirfoto = '/pvd/repositorio_persona/persona/personaimgs/'.$idpersona.$arrdatos[0]->extension;
	        else
	            $r->dirfoto = '/pvd/repositorio_persona/persona/views/js/registropersonavn/persona.jpg';
	        $r->sexo = $arrdatos[0]->sexo;
	        if($arrdatos[0]->fechanacimiento != '')     
	            $r->fechanacimiento = $arrdatos[0]->fechanacimiento;
	        else    
	            $r->fechanacimiento = 'No conocida';  
        }
		else{
			$r->nombreapellidos = "Sin perfil";
			$r->numid = "";
			$r->dirfoto = '/pvd/repositorio_persona/persona/views/js/registropersonavn/persona.jpg';
			$r->sexo = "";
			$r->fechanacimiento = "";
		}
        echo json_encode($r);
    }
	
}
?>