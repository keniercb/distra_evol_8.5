<?php
class ReportetoespecialidadController extends ZendExt_Controller_Secure {  
    private $reporteToEspecialidadModel;
	function init(){
	    $this->reporteToEspecialidadModel = new ReportetoespecialidadModel();
        parent :: init();    
    }
    public function reportetoespecialidadAction(){     
        $this->render();
    }
	public function cargarReportesAction()
    {
	    $params = $this->_request->getPost();
        $datos = $this->reporteToEspecialidadModel->cargarReportes( $params );
	    echo json_encode( $datos );
    }
	public function cargarEspecialidadAction()
    {	   
       $datos = $this->reporteToEspecialidadModel->cargarEspecialidad();
	   echo json_encode( $datos );
    }
	public function guardarEspecialidadToReportesAction(){
		$params = $this->_request->getPost();
        $datos = $this->reporteToEspecialidadModel->guardarEspecialidadToReportes( $params );
	    echo json_encode( $datos );
	}
	public function activarEspecialidadAction(){
		$params = $this->_request->getPost();
        $datos = $this->reporteToEspecialidadModel->activarEspecialidad( $params );
	    echo json_encode( $datos );
	}

}
