<?php

/**
 * Controlador para las configuraciones asociadas a los cargos.
 *
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Configuracion.
 * @category Clase controladora.
 * @uses ConfigconceptosxestructuraController
 * @copyright UCID
 * @version 1.0
 */
class ConfigconceptosxestructuraController extends ZendExt_Controller_Secure {

    /**
     * Inicializar los atributos de la clase.
     */
    public function init() {
        parent::init();
    }

    /**
     * Acción utilizada para mostrar la vista de gestión de los tipos de nómina.
     */
    public function configconceptosxestructuraAction() {

        //Agregando a la vista los ficheros js de la ayuda.
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->idioma = $this->global->Perfil->idioma;

        //Mostrando la vista.
        $this->render();
    }
	
	public function obtenerListadoEntidadesAction(){
	    $id = $this->_request->getPost('_id');
		
		if($id == null){
		//Dame la entidad
		$arrdatosentidad = $this->integrator->metadatos->DameEstructura($this->global->Estructura->idestructura);
		$r->data[0]->_id = $arrdatosentidad[0]->idestructura;
        $r->data[0]->_parent = null;
        $r->data[0]->_is_leaf = ($arrdatosentidad[0]->idtipo == 3)?true:false;
        $r->data[0]->idtipo = $arrdatosentidad[0]->idtipo;
        $r->data[0]->descripcion = '<img src="'.$arrdatosentidad[0]->icon.'" height=16 width=16 />'.''. $arrdatosentidad[0]->denominacion;
		}else{
		$r->data = $this->dameHijosEstructura($id);
		}
	    echo json_encode($r);
	}
	
	 public function dameHijosEstructura($idestructura) {
        $arbolestructurae = $this->integrator->metadatos->DameHijosEstructura($idestructura);
		if (count($arbolestructurae) > 0) {
            $i = 0;
            $arr = array();
            foreach ($arbolestructurae as $valores => $valor) {
			    //print_r($valor);die;
			    $arr[$i]->_id = $valor->id;
                $arr[$i]->descripcion = '<img src="' . $valor->icon . '" height=16 width=16 />' . ' ' . $valor->text;
				$arr[$i]->_parent = $valor->_parent;
                if($valor->idtipo == 3){
				 $arr[$i]->_is_leaf = true;	
				  }else{
				   $arr[$i]->_is_leaf = false;   
				   }
                $arr[$i]->idtipo = $valor->idtipo;
                $i++;
            }
			//print_r($arr);die;
            return $arr;
        }
        else
            return array();
    }
	
	public function adicionarconceptosPDAction(){
	   //Capturando los datos
	   $idestructura = $this->_request->getPost('idestructura');
	   $arrayconceptos = Zend_Json::decode(stripslashes($this->_getParam('arrayidconceptospd')));
	   //Recorriendo para insertar
	   foreach($arrayconceptos as $i=>$value){
	     $objDomain = new ConfigConceptoXEstructura();
	     $existeconcepto = $objDomain->obtenerIDConfiguracionXIDConcepto($value, $idestructura);
		 if($existeconcepto == 0){
	     $objDomain->idconceptopd = $value;
	     $objDomain->idestructura = $idestructura;
	     $objDomain->save();
		 }
	   }
	   echo json_encode("ADD");
	}
	
	public function eliminarconceptosPDAction(){
	   $arrayidconfconceptospd = Zend_Json::decode(stripslashes($this->_getParam('arrayidconfconceptospd')));
	   foreach($arrayidconfconceptospd as $i=>$value){
	   $objDomain = new ConfigConceptoXEstructura();
	   $objConf = $objDomain->obtenerConfigConceptoXEstructura($value);
	   $objConf->delete();
	   }
	   echo json_encode("ok");
	}
	
	public function cargarconceptosPDAction(){ 
	    
	   //Capturando los datos
	   $idestructura = $this->_request->getPost('idestructura');
	   //Obj del domain para pedir el array de conceptos dado el idestructura
	   $objDomain = new ConfigConceptoXEstructura();
	   $arraydatos = $objDomain->obtenerListadoConfigConceptoXEstructura($idestructura);
	   $cantidaddatos = $objDomain->obtenerCantidadConfigConceptoXEstructura($idestructura);
	   //Array final de datos
	   $arrayfinaldatos = array();
	   $contadorarrayfinaldatos = 0;
	   if(count($arraydatos)>0){
	     $domainNomConceptoPercepcionDescuento = new NomConceptoPercepcionDescuento();
	     foreach($arraydatos as $i=>$value){
	        $arrayfinaldatos[$contadorarrayfinaldatos]['idconceptopdxestructura'] = $value['idconceptopdxestructura'];
	        $arrayfinaldatos[$contadorarrayfinaldatos]['idconceptopercepciondescuento'] = $value['idconceptopd'];
			$arrayfinaldatos[$contadorarrayfinaldatos]['idestructura'] = $value['idestructura'];
			//Buscando los datos del concepto
			$objNomConceptoPercepcionDescuento = $domainNomConceptoPercepcionDescuento->obtenerObjConceptoDadoId($value['idconceptopd']);
	        $arrayfinaldatos[$contadorarrayfinaldatos]['abreviatura'] = $objNomConceptoPercepcionDescuento->abreviatura;
	        $arrayfinaldatos[$contadorarrayfinaldatos]['denominacion'] = $objNomConceptoPercepcionDescuento->denominacion;
			$contadorarrayfinaldatos++;
	     }
	   }
	   echo json_encode(array('datos'=>$arrayfinaldatos, 'cantidad'=>$cantidaddatos));
	}
	


   

}

