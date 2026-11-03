<?php

class FormasistemapagocompController extends ZendExt_Controller_Secure {
    
    var $datosModelo;

    public function init() {
        parent::init();
        
    }
    
    public function formasistemapagocompAction() {
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        //$this->view->idioma = $this->global->Perfil->idioma;
        $this->render();
    }
    

    public function obtenerformasistemapagoAction() {
        $nodo = $this->_getParam('idnodo');
        $node = $this->_getParam('node');
        $tipo = $this->_getParam('tipo');
        $hojatipo = $this->_getParam('hojatipo');
        if($tipo == 1){
			$r = NomFormaPago::obtenerFormasPagoActivas();
		}else if($tipo == 2){
			$r = NomSistemaPago::obtenerListadoSistemasPagoActivos($nodo);
		}else if($tipo == 3){
			$r = NomPeriodoPago::obtenerListadoPeriodosPagoActivos();
		}

		$rn = array();
		foreach($r as $k => $v){
			$rn[] = array('id'=>$node.'-'.$v['id'],'_id'=>$v['_id'], 'text'=>$v['text'], 'descripcion'=>$v['descripcion'], 'tipo'=>$tipo, 'leaf'=>($tipo == $hojatipo ? true : false)); 
		}	
        
        echo json_encode($rn);
       
    }
    
}
