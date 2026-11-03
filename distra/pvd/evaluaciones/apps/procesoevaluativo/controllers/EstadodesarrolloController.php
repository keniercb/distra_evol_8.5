<?php
class EstadodesarrolloController extends ZendExt_Controller_Secure {

    function init() {
        parent::init();
    }

    function estadodesarrolloAction() {
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->idioma = $this->global->Perfil->idioma;
        $this->render();
    }

    function getEstadodesarrolloAction(){
		$limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
		$filtro = $this->_request->getPost('query');
		$NomEstadodesarrollo=new NomEstadodesarrollo();
		$r['data']=$NomEstadodesarrollo->getPorLimite($limit,$start,$filtro);
		$r['total']=$NomEstadodesarrollo->getCantTotal($filtro);
		echo(json_encode($r));
	}

    //adicionar()
	function adicionarEstadoDesarrolloAction(){
		$denominacion = $this->_request->getPost('denominacion');
		$fechaI = $this->_request->getPost('fechainicio');
		$fechaF = $this->_request->getPost('fechafin');
		$descripcion = $this->_request->getPost('descripcion');
		$existe=false;
		$NomEstadodesarrollo=new NomEstadodesarrollo();
		
		$NomEstadodesarrollo->denominacion=$denominacion;
		$NomEstadodesarrollo->fechainicio=$fechaI;
		$NomEstadodesarrollo->fechafin=$fechaF;
		$NomEstadodesarrollo->descripcion=$descripcion;
		
		if(!$NomEstadodesarrollo->existe($denominacion,true)){
			$NomEstadodesarrollo->save();
			$existe=true;
		}
		$r->existe=$existe;
		echo (json_encode($r));	
	}
	
	//modificar
	function modificarEstadoDesarrolloAction(){
		$id = $this->_request->getPost('id');
		$denom=$this->_request->getPost('denominacion');
        $NomEstadodesarrollo = Doctrine::getTable('NomEstadodesarrollo')->find($id);
		$cambio=true;
        if($denom==$NomEstadodesarrollo->denominacion){$cambio=false;}
		$NomEstadodesarrollo->denominacion = $this->_request->getPost('denominacion');
        $NomEstadodesarrollo->fechainicio = $this->_request->getPost('fechainicio');
        $NomEstadodesarrollo->fechafin = $this->_request->getPost('fechafin');
        $NomEstadodesarrollo->descripcion = $this->_request->getPost('descripcion');
		$existe=false;
        $NomEstadodesarrolloModel = new NomEstadodesarrolloModel();
		
		if(!$NomEstadodesarrollo->existe($NomEstadodesarrollo->denominacion,$cambio)){
			 $NomEstadodesarrolloModel->Actualizar($NomEstadodesarrollo);
			$existe=true;
		}
		$r->existe=$existe;
		echo (json_encode($r));	
	}
	
	//eliminar
	function eliminarEstadoDesarrolloAction() {
        $id = $this->_request->getPost('id');
		
        $NomEstadodesarrolloModel = new NomEstadodesarrolloModel();
        $cant= $NomEstadodesarrolloModel->Eliminar($id);
		if($cant > 0){
			$r->success=true;
		}
		else{
			$r->success=false;
		}
        echo (json_encode($r));
    }
}
?>
