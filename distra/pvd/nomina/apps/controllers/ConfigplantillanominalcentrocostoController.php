<?php

/**
 * Controlador para gestionar plantillas nominales.
 *
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Configuracion.
 * @category Clase controladora.
 * @uses 
 * @copyright UCID
 * @version 1.0
 */
class ConfigplantillanominalcentrocostoController extends ZendExt_Controller_Secure {

    /**
     * Inicializar los atributos de la clase.
     */
    public function init() {
        parent::init();   
    }

    /**
     * Acción utilizada para mostrar la vista de gestión de las plantillas nominales y los centros de costo.
     */
    public function configplantillanominalcentrocostoAction() {

        //Agregando a la vista los ficheros js de la ayuda.
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->idioma = $this->global->Perfil->idioma;

        //Mostrando la vista.
        $this->render();
    }
   
   /**
    * Acción utilizada para mostrar las plantillas nominales con sus centros de costo.
    */
    public function obtenerListadoPlantillasCentrosCostoAction() {
      $pos = 0;
	  $denomcentro = "";
	  $idestructura = $this->_request->getPost('idestructura');
	  $arrplantillas = array();
	  $arrAux = array();
	  $arrFinal = array();
	  $arrayCentrosCosto = array();
	  $objDomainConfigplantillanominalcentrocosto = new Configplantillanominalcentrocosto();
	  $objDomainConfPlantillaNominal = new ConfPlantillaNominal();
	  
 	  $existe = $objDomainConfigplantillanominalcentrocosto->existePlantillaCentroCostoXIdEntidad($idestructura);
	  if($existe == "no existe"){
	  $arrplantillas = $objDomainConfPlantillaNominal->obtenerListadoIdPlantillasNominales($idestructura);
	  
	  $mg = Doctrine_Manager::getInstance();
      $conn = $mg->getCurrentConnection();
      $conn->beginTransaction();
	  $objDomain = new Doctrine_Collection('Configplantillanominalcentrocosto');
	  foreach($arrplantillas as $m=>$val){
	  $objDomain[$pos]->idplantillanominal = $val['idplantillanominal'];
	  $objDomain[$pos]->idestructura = $idestructura;
	  $objDomain[$pos]->save();
	  $pos++;
	  }
	  $objDomain->save();
      $conn->commit();
	  
	  $arrAux = $objDomainConfigplantillanominalcentrocosto->obtenerListadoPlantillasNominalesCentroCosto($idestructura);
	  foreach($arrAux as $n=>$v){
	  $arrFinal[$n]['idplantillanominalcentrocosto'] = $v['idplantillanominalcentrocosto'];
	  $arrFinal[$n]['idplantillanominal'] = $v['idplantillanominal'];
	  $arrFinal[$n]['denomplantilla'] = $objDomainConfPlantillaNominal->obtenerDenomXId($v['idplantillanominal']);
	  $arrayCentrosCosto = $this->integrator->contabilidad_costos->ObtenerCentrosCostoNAE($idestructura);
	  foreach($arrayCentrosCosto as $f=>$variable){
	   if($v['idcentrocosto'] == $variable->idcentrogrupo){
	    $denomcentro = $variable->descripcioncentrogrupo;
	   }
	  }
	  $arrFinal[$n]['idcentrocosto'] = $v['idcentrocosto'];
	  $arrFinal[$n]['denomcentrocosto'] = $denomcentro;
	  $denomcentro = "";
	  }
	  }else{
	  $arrAux = $objDomainConfigplantillanominalcentrocosto->obtenerListadoPlantillasNominalesCentroCosto($idestructura);
	  foreach($arrAux as $n=>$v){
	  $arrFinal[$n]['idplantillanominalcentrocosto'] = $v['idplantillanominalcentrocosto'];
	  $arrFinal[$n]['idplantillanominal'] = $v['idplantillanominal'];
	  $arrFinal[$n]['denomplantilla'] = $objDomainConfPlantillaNominal->obtenerDenomXId($v['idplantillanominal']);
	  $arrayCentrosCosto = $this->integrator->contabilidad_costos->ObtenerCentrosCostoNAE($idestructura);
	  foreach($arrayCentrosCosto as $g=>$variableaux){
	   if($v['idcentrocosto'] == $variableaux->idcentrogrupo){
	    $denomcentro = $variableaux->descripcioncentrogrupo;
	   }
	  } 
	  
	  $arrFinal[$n]['idcentrocosto'] = $v['idcentrocosto'];
	  $arrFinal[$n]['denomcentrocosto'] = $denomcentro;
	  $denomcentro = "";
	  }
	  }
	  echo json_encode(array('datos' => $arrFinal, 'cantidad' => count($arrFinal)));
    }
	
  /**
    * Acción utilizada para mostrar los centros de costo.
    */
    public function obtenerListadoCentroCostoAction() {
      $arrayid = array();
      $arrayCentrosCosto = array();
      $arrayCentrosCostoReturn = array();
	  $idestructura = $this->_request->getPost('idestruct');
	  $arrayCentrosCosto = $this->integrator->contabilidad_costos->ObtenerCentrosCostoNAE($idestructura);
	  foreach($arrayCentrosCosto as $i=>$value){
	    $arrayCentrosCostoReturn[$i]['idcentrocosto'] = $value->idcentrogrupo;
	    $arrayCentrosCostoReturn[$i]['denomcentrocosto'] = $value->descripcioncentrogrupo;
	  }  
	   echo json_encode(array('datos' => $arrayCentrosCostoReturn, 'cantidad' => count($arrayCentrosCostoReturn)));
    }
	
  /**
    * Acción utilizada para actualizar.
    */
    public function actualizarAction() {
	  $idcentrocosto = $this->_request->getPost('idcentrocosto');
      $idplantillanominalcentrocosto = $this->_request->getPost('idplantillanominalcentrocosto');
	  $objDomainPlantillaCentroCosto = new Configplantillanominalcentrocosto();
	  $objPorId = $objDomainPlantillaCentroCosto->obtenerObjConfigplantillanominalcentrocosto($idplantillanominalcentrocosto);
	  $objPorId->idcentrocosto=$idcentrocosto;
	  $objPorId->save();
	  echo json_encode("Ok");
	}

   
}

