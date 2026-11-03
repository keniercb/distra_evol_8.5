<?php
class CausanoevaluadoController extends ZendExt_Controller_Secure {

    function init() {
        parent::init();
    }

    function causanoevaluadoAction() {
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->idioma = $this->global->Perfil->idioma;
        $this->render();
    }

    function getCausanoevaluadoAction(){
		$limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
		//$filtro = $this->_request->getPost('query');
		$filtro = $this->_request->getPost('tfBuscar');
		$NomCausanoevaluado=new NomCausanoevaluado();
		$r['data']=$NomCausanoevaluado->getPorLimite($limit,$start,$filtro);
		$r['total']=$NomCausanoevaluado->getCantTotal($filtro);
		echo(json_encode($r));
	}

    //adicionar()
	function adicionarCausanoevaluadoAction(){
		$denominacion = $this->_request->getPost('denominacion');
		$fechaI = $this->_request->getPost('fechainicio');
		$fechaF = $this->_request->getPost('fechafin');
		$descripcion = $this->_request->getPost('descripcion');
		$existe=false;
		$NomCausanoevaluado=new NomCausanoevaluado();
		
		$NomCausanoevaluado->denominacion=$denominacion;
		$NomCausanoevaluado->fechainicio=$fechaI;
		$NomCausanoevaluado->fechafin=$fechaF;
		$NomCausanoevaluado->descripcion=$descripcion;
		
		if(!$NomCausanoevaluado->existe($denominacion,true)){
			$NomCausanoevaluado->save();
			$existe=true;
		}
		$r->existe=$existe;
		echo (json_encode($r));	
	}
	
	//modificar
	function modificarCausanoevaluadoAction(){
		$id = $this->_request->getPost('id');
		$denom=$this->_request->getPost('denominacion');
        $NomCausanoevaluado = Doctrine::getTable('NomCausanoevaluado')->find($id);
		$cambio=true;
        if($denom==$NomCausanoevaluado->denominacion){$cambio=false;}
		$NomCausanoevaluado->denominacion = $this->_request->getPost('denominacion');
        $NomCausanoevaluado->fechainicio = $this->_request->getPost('fechainicio');
        $NomCausanoevaluado->fechafin = $this->_request->getPost('fechafin');
        $NomCausanoevaluado->descripcion = $this->_request->getPost('descripcion');
		$existe=false;
        $NomCausanoevaluadoModel = new NomCausanoevaluadoModel();
		
		if(!$NomCausanoevaluado->existe($NomCausanoevaluado->denominacion,$cambio)){
			 $NomCausanoevaluadoModel->Actualizar($NomCausanoevaluado);
			$existe=true;
		}
		$r->existe=$existe;
		echo (json_encode($r));	
	}
	
	//eliminar
	function eliminarCausanoevaluadoAction() {
        $id = $this->_request->getPost('id');
		
        $NomCausanoevaluadoModel = new NomCausanoevaluadoModel();
        $cant= $NomCausanoevaluadoModel->Eliminar($id);
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
