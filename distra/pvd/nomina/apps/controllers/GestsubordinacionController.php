<?php

/**
 * Controlador para gestionar las subordinaciones
 *
 * @author Tte Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Configuración.
 * @category Clase controladora.
 * @uses 
 * @copyright UCID
 * @version 1.0
 */
class GestsubordinacionController extends ZendExt_Controller_Secure {

    /**
     * Inicializar los atributos de la clase.
     */
    public function init() {
        parent::init();
    }
    
    /**
     * Acción utilizada para mostrar la vista.
     */
    public function gestsubordinacionAction() {

        //Agregando a la vista los ficheros js de la ayuda.
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->idioma = $this->global->Perfil->idioma;

        //Mostrando la vista.
        $this->render();
    }
	
	/**
     * Acción utilizada para mostrar la estructura.
     */
    public function obtenerEstructuraAction() {
	    $node = $this->_request->getPost('node');
	    $idestructurapost = $this->_request->getPost('idestructura');
	    if($node == "root"){
		  $datosentidad = $this->integrator->metadatos->DameEstructura($this->global->Estructura->idestructura);
		  $arbolestructura[0]['id'] = $datosentidad[0]->idestructura;
		  $arbolestructura[0]['text'] = $datosentidad[0]->denominacion;
		  $arbolestructura[0]['icon'] = $datosentidad[0]->icon;
		  $arbolestructura[0]['parent'] = $datosentidad[0]->idpadre;
		  $arbolestructura[0]['idtipo'] = $datosentidad[0]->idtipo;
		  $arbolestructura[0]['leaf'] = false;
		}else{
		  $arbolestructura = $this->dameHijosEstructura($node, $idestructurapost);
		}
		echo json_encode($arbolestructura);		
	}
	
	/*
	 * Dame los hijos de la estructura
	 */
	public function dameHijosEstructura($idestructura, $idestructurapost){
	 
	  $hijosestructura = $this->integrator->metadatos->DameHijosEstructura($idestructura);
	//print_r($hijosestructura);die;
	  $arrayhijos = array();
	  $cont = 0;
	  //Obj del model
	  $objmodel = new GestSubordinacionModel();
	  foreach($hijosestructura as $i=>$value){
	    $arrayhijos[$cont]['id'] = $value->id;
	    $arrayhijos[$cont]['text'] = $value->text;
	    $arrayhijos[$cont]['icon'] = $value->icon;
	    $arrayhijos[$cont]['parent'] = $value->_parent;
	    $arrayhijos[$cont]['idtipo'] = $value->idconcepto;
	    if($value->idconcepto == 7){
		  $arrayhijos[$cont]['leaf'] = true;
		  if($value->id != $idestructurapost){
		    $arrayhijos[$cont]['checked'] = false;
		  }
		  //Verificar si el cargo esta configurado para el cargo seleciconado
	      $existesubordinacion = $objmodel->existeSubordinado($idestructurapost, $value->id);
		  if($existesubordinacion>0){
		    $arrayhijos[$cont]['checked'] = true;
		  }
		  
		}else{
		  $arrayhijos[$cont]['leaf'] = false;
		}
		
		
		$cont++;
	  }
	 
	  return $arrayhijos;
	}
	
	/**
     * Acción utilizada para mostrar los cargos subordinados.
     */
    public function obtenerListadoCargosSubordinadosAction() {
	   //Capturando los datos
	   $idjefe = $this->_request->getPost('idjefe');
	   //Obj del model
	   $objmodel = new GestSubordinacionModel();
	   //Adicionando datos de la subordinacion
	   $arrsubordinados = $objmodel->obtenerListadoSubordinados($idjefe);
	   echo json_encode(array('datos'=>$arrsubordinados, 'cantidad'=>count($arrsubordinados)));
	}
	
	/**
     * Acción utilizada para asociar los cargos.
     */
    public function asociarCargosSubordinadosAction() {
	   //Capturando los datos
	   $idjefe = $this->_request->getPost('idjefe');
	   $arraycargos = Zend_Json::decode(stripslashes($this->_getParam('arraycargos')));
	   //Obj del model
	   $objmodel = new GestSubordinacionModel();
	   //Adicionando datos de la subordinacion
	   $ok = $objmodel->asociarSubordinados($idjefe, $arraycargos);
	   if($ok == 'Ok'){
	    $obj->asoc = 1;
	    echo json_encode($obj);
	   }
	   
	}
	
	/**
     * Acción utilizada para desasociar los cargos.
     */
    public function delCargosSubordinadosAction() {
	   $arraycargos = Zend_Json::decode(stripslashes($this->_getParam('arraycargos')));
	   //Obj del model
	   $objmodel = new GestSubordinacionModel();
	   //Adicionando datos de la subordinacion
	   $ok = $objmodel->desasociarSubordinados($arraycargos);
	   if($ok == 'Ok'){
	    $obj->desasoc = 1;
		echo json_encode($obj);
	   }
	}
	
	/*
	 * Funcionalidad que devuelve las personas subordinadas a un cargo
	 */
    public function obtenerListadoPersonasSubordinadosAction() {
	   //Capturando los datos
	   $idjefe = $this->_request->getPost('idjefe');
	   //Obj del model
	   $objmodel = new GestSubordinacionModel();
	   //Adicionando datos de la subordinacion
	   if($idjefe!=null || $idjefe!=''){
	   $arrdatospersonas = $objmodel->obtenerDatosPersonasSubordinadas($idjefe);
	   echo json_encode(array('datos'=>$arrdatospersonas, 'cantidad'=>count($arrdatospersonas)));
	   }else{
	   echo json_encode(array());
	   }
	   
	} 
   
}
