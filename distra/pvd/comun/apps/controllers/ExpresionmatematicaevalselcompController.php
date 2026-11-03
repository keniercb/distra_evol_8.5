<?php
class ExpresionmatematicaevalselcompController extends ZendExt_Controller_Secure {

    function init () {
        parent::init();
    }

    function expresionmatematicaevalselcompAction() {
        $this->render();
    }

	function guardarexpresionmatematicaAction(){
		  $idexpresionmatematica = $this->_request->getPost('idexpresionmatematica');
		  $denominacion = $this->_request->getPost('denominacion');
		  $elementos = $this->_request->getPost('elementos');
		  $arrElementos = json_decode(stripslashes($elementos));
		  $expresionamostrar = $this->_request->getPost('expresionamostrar');
		  $expresionacalcular = $this->_request->getPost('expresionacalcular');

		  $objExpMatModel = new DatExpresionmatematicaevalselModel();
		  if($idexpresionmatematica == -1){
		    $objExpMat = new DatExpresionmatematicaevalsel();
		    $objExpMat->denominacion = $denominacion;
		    $objExpMat->expresionamostrar = $expresionamostrar;
		    $objExpMat->expresionacalcular = $expresionacalcular;
			$id = $objExpMatModel->Insertar($objExpMat, $arrElementos);
		  }	
		  else{
		    $objExpMat = Doctrine::getTable('DatExpresionmatematicaevalsel')->find($idexpresionmatematica);
			$objExpMat->denominacion = $denominacion;
		    $objExpMat->expresionamostrar = $expresionamostrar;
		    $objExpMat->expresionacalcular = $expresionacalcular;
			$id = $objExpMatModel->Actualizar($objExpMat, $arrElementos);
		  }	
			
		  $r->codigo = 1;
		  $r->mensaje = 'La expresi&oacute;n matem&aacute;tica se guard&oacute; satisfactoriamente.';
		  $r->idexpresionmatematica = $objExpMat->idexpresionmatematica;
		  echo json_encode($r);
		  
	}
	
	function cargarexpresionmatematicaAction(){
		  $idexpresionmatematica = $this->_request->getPost('idexpresionmatematica');		  
		  $objExpMat = new DatExpresionmatematicaevalsel();
		  $objExpMat = $objExpMat->Buscar($idexpresionmatematica);
		  $objElemExpMat = new DatElementoExpresionmatematicaevalsel();
		  $r->denominacion = $objExpMat->denominacion;
		  $r->elementos = $objElemExpMat->GetTodosporExpresionMatematica($idexpresionmatematica);
		  echo json_encode($r);  
		  /* $a[] = array('idindicador'=>1000, 'valor'=>5.8798);
		  $a[] = array('idindicador'=>7000, 'valor'=>4.4568);
		  $a[] = array('idindicador'=>6000, 'valor'=>212.3456);
		  //$objExpMat = new DatExpresionmatematicaModel();
		  //$os = new ExpresionmatematicacompService();
		  //$v = $os->EvaluarExpresionMatematica(3, $a);
		  //$v = $objExpMat->EvaluarExpresionMatematica(3, $a);
		  $v = $this->pIntegrator->comunpersona->EvaluarExpresionMatematica(1, $a);
		  //$v = $this->pIntegrator->evaluaciones->BuscarPlanillasPorLimite(15,0);
		  print_r($v);die; */
		  
	}
	
	function cargararbolindicadoresAction(){
		  $idplanilla = $this->_request->getPost('idplanilla');
		  $idindicador = $this->_request->getPost('idindicador');
		  $r = $this->pIntegrator->evaluaciones->getArbolIndicadores($idplanilla, $idindicador); 
		  echo json_encode($r);
	}
	
	function cargarescalaporindicadorAction(){
		  $idindicador = $this->_request->getPost('idindicador');
		  $r = $this->pIntegrator->evaluaciones->ObtenerValoresEscalaPorIndicador($idindicador);
		  echo json_encode(array('datos'=>$r, 'cantidad'=>count($r)));
		  
	}
	

}
?>