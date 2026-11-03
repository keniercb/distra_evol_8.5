<?php
class ListarreportesycertificacionescompController extends ZendExt_Controller_Secure {
    public function init() {
        parent::init();
    }

    public function listarreportesycertificacionescompAction() {
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
        
    }

    public function obtenerreportesycertificacionesAction() {
        $inicio                          = $this->_getParam('start');
        $limite                          = $this->_getParam('limit');
        $identidad                    = $this->_getParam('identidad');
        $modomostrar				= $this->_getParam('modomostrar');
        
        $objRC = new DatReportesCertificaciones();
        $r = $objRC->obtenerTodosReportesCertificaciones($identidad, $modomostrar, $limite, $inicio);
        $c = $objRC->cantidadTodosReportesCertificaciones($identidad, $modomostrar);
        echo json_encode(array('datos'=>$r, 'cantidad'=>$c));
       
    }
    
    public function obtenerpersonasreportesycertificacionesAction(){
		$idreportescertificaciones		= $this->_getParam('idreportescertificaciones');
		$nivel									= $this->_getParam('nivel');
		
		$objERC = new DatElementosReportesCertificaciones();
		$r = $objERC->obtenerElementosReportesCertificaciones($idreportescertificaciones, $nivel, 1000000, 0);
        $c = $objERC->cantidadElementosReportesCertificaciones($idreportescertificaciones, $nivel);
        echo json_encode(array('datos'=>$r, 'cantidad'=>$c));
		
	} 

}
