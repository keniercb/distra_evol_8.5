<?php

class ListarconceptospercepcionesdescuentoscompController extends ZendExt_Controller_Secure {
    
    var $datosModelo;

    public function init() {
        parent::init();
        
    }
    
    public function listarconceptospercepcionesdescuentoscompAction() {
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        //$this->view->idioma = $this->global->Perfil->idioma;
        $this->render();
    }
    

    public function obtenerconceptospercepcionesdescuentosAction() {
        $inicio = $this->_getParam('limit');
        $limite = $this->_getParam('start');
        $criterio = $this->_getParam('criterio');
        $objPD = new NomConceptoPercepcionDescuento();
        $r = $objPD->obtenerListadoConceptosPD($inicio, $limite, $criterio);
        $c = $objPD->obtenerCantidadTotalConceptosPD();
        
        echo json_encode(array('datos'=>$r, 'cantidad'=>$c));
       
    }
    
}
