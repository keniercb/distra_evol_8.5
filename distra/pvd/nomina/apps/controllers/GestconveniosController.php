<?php

/**
 * Controlador para gestionar los convenios
 *
 * @author Tte Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Configuración.
 * @category Clase controladora.
 * @uses 
 * @copyright UCID
 * @version 1.0
 */
class GestconveniosController extends ZendExt_Controller_Secure {

    /**
     * Inicializar los atributos de la clase.
     */
    public function init() {
        parent::init();
    }
    
    /**
     * Acción utilizada para mostrar la vista.
     */
    public function gestconveniosAction() {

        //Agregando a la vista los ficheros js de la ayuda.
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->idioma = $this->global->Perfil->idioma;

        //Mostrando la vista.
        $this->render();
    }
	
	/**
     * Acción utilizada para obtener los listados de los convenios.
     */
    public function obtenerListadoConveniosAction() {
	    $identidad = $this->_request->getPost('identidad');
		$objDatConvenioModel = new DatConvenioModel();
	    $arrayconvenios = $objDatConvenioModel->obtenerListadoConvenios($identidad);
		$cantconvenios = $objDatConvenioModel->obtenerCantidadConvenios($identidad);
	    echo json_encode(array('datos'=>$arrayconvenios, 'cantidad'=>$cantconvenios));		
	}
	
	
	/**
     * Acción utilizada para add y mod los convenios.
     */
    public function addModConvenioAction() {
	    $idconvenio = $this->_request->getPost('idconvenio');
	    $numeroconvenio = $this->_request->getPost('numeroconvenio');
	    $denominacion = $this->_request->getPost('denominacion');
	    $idobra = $this->_request->getPost('idobra');
	    $porcientoejecucion = $this->_request->getPost('porcientoejecucion');
	    $salario = $this->_request->getPost('salario');
	    $penalizacion = $this->_request->getPost('penalizacion');
	    $fechainicio = $this->_request->getPost('fechainicio');
	    $fechafin = $this->_request->getPost('fechafin');
	    $descripcion = $this->_request->getPost('descripcion');
	    $identidad = $this->_request->getPost('identidad');
	    $addmod = $this->_request->getPost('addmod');
	    $mensaje = '';
		$objDatConvenioModel = new DatConvenioModel();
		if($addmod == 1){
		  $objDatConvenioModel->adicionarDatosConvenio($numeroconvenio, $denominacion, $idobra, $porcientoejecucion, $salario, $penalizacion, $fechainicio, $fechafin, $descripcion, $identidad);
		  $mensaje = 'ADD';
		}else{
		  $objDatConvenioModel->modificarDatosConvenio($idconvenio, $numeroconvenio, $denominacion, $idobra, $porcientoejecucion, $salario, $penalizacion, $fechainicio, $fechafin, $descripcion, $identidad);
		  $mensaje = 'MOD';
		}
		echo json_encode($mensaje);		
	}
	
	/**
     * Acción utilizada para eliminar un convenio.
     */
    public function eliminarConvenioAction() {
	    $idconvenio = $this->_request->getPost('idconvenio');
		$objDatConvenioModel = new DatConvenioModel();
		$delete = $objDatConvenioModel->eliminarConvenio($idconvenio);
	    echo json_encode($delete);		
	}

    public function aprobarConvenioAction(){
        $idconvenio = $this->_request->getPost();
        $objConvenioModel = new DatConvenioModel();
        $aprobar = $objConvenioModel->aprobarConvenio($idconvenio);
        echo json_encode($aprobar);
    }
	
	/**
     * Acción utilizada para obtener el listado de las Brigadas.
     */
    public function obtenerListadoBrigadasAction() {
	    $identidad = $this->_request->getPost('identidad');
		$objConfPlantillaNominal = new ConfPlantillaNominal();
		$objConfPlantillaNominalCargos = new ConfPlantillaNominalCargo();
		$arrplantillas = $objConfPlantillaNominal->obtenerListadoDenominacionporEntidad($identidad);
		foreach($arrplantillas as $i=>$value){
		  $arrcargos = $objConfPlantillaNominalCargos->obtenerCargosByIdPlantilla($value['idplantillanominal']);
		  $idcargo = $arrcargos[0]['idcargo'];
		  $datoscargo = ZendExt_Ioc::getInstance()->metadatos->DameEstructura($idcargo);
		  $idpadre = $datoscargo[0]->idpadre;
		  $datoscargopadre = ZendExt_Ioc::getInstance()->metadatos->DameEstructura($idpadre);
		  $arrplantillas[$i]['denominacion'] = '<img src="' . $datoscargopadre[0]->icon . '" height=16 width=16 />' . ' ' . $value['denominacion'];
		}
		//print_r($arrplantillas);die;
	    echo json_encode(array('datos'=>$arrplantillas, 'cantidad'=>count($arrplantillas)));		
	}

    public function obtenerListadoObrasAction(){
        $objObras = new NomObraModel();
        $todasobras = $objObras->obtenerListadoObra();
        $cantidad = $objObras->obtenerCantidadTotalObra();
        echo json_encode(array('datos'=>$todasobras, 'cantidad'=>$cantidad));
    }
	
	/**
     * Acción utilizada para obtener el listado de las Personas de la Brigadas.
     */
    public function obtenerListadoPersonasBrigadasAction() {
	    $arrayplantillas = Zend_Json::decode(stripslashes($this->_getParam('idplantillas')));
		$objDatCargosOcupados = new DatCargosOcupados();
		$objConfPlantillaNominalCargos = new ConfPlantillaNominalCargo();
		$arraydatospersona = array();
		$contpersonas = 0;
		foreach($arrayplantillas as $i=>$value){
		   $arraycargos = $objConfPlantillaNominalCargos->obtenerCargosByIdPlantilla($value);
		   foreach($arraycargos as $c=>$rcargos){
		     
		     $rdpersona = $objDatCargosOcupados->obtenerPersonaOcupaCargo($rcargos['idcargo']);
			 if(count($rdpersona)>0){
			  foreach($rdpersona as $n=>$rperscar){
                $sqlexistepersona = "select count(dp.idpersona) as cantidad from mod_persona.dat_persona dp
			                     	 where dp.idpersona = ? and dp.feliminado is null;";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $contpersona = $conn->fetchAll($sqlexistepersona, array($rperscar['idpersona']));
                if($contpersona[0]['cantidad'] > 0){
                    //Datos plantilla
                    $arrdatosplantilla = $objConfPlantillaNominalCargos->obtenerPlantillaXIdCargo($rcargos['idcargo']);
                    $idplantillanominal = $arrdatosplantilla[0]['ConfPlantillaNominal']['idplantillanominal'];
                    $plantillanominal = $arrdatosplantilla[0]['ConfPlantillaNominal']['denominacion'];
                    //Dame los datos del cargo
                    $datosCargos = ZendExt_Ioc::getInstance()->metadatos->DameEstructura($rcargos['idcargo']);
                    //Datos de la persona
                    $sqldatospersona = "select doc.numero, dp.nombre, dp.snombre, dp.papel, dp.sapel from mod_persona.dat_persona dp
			                     left join mod_persona.dat_docidentidad doc on (doc.idpersona = dp.idpersona)
								 where dp.idpersona = ?;";
                    $mg = Doctrine_Manager::getInstance();
                    $conn = $mg->getCurrentConnection();
                    $datospersona = $conn->fetchAll($sqldatospersona, array($rperscar['idpersona']));
                    $arraydatospersona[$contpersonas]['idpersona'] = $rperscar['idpersona'];
                    $arraydatospersona[$contpersonas]['ci'] = $datospersona[0]['numero'];
                    $arraydatospersona[$contpersonas]['nombreyapellidos'] = $datospersona[0]['nombre']." ".$datospersona[0]['snombre']." ".$datospersona[0]['papel']." ".$datospersona[0]['sapel'];
                    $arraydatospersona[$contpersonas]['idcargosocupados'] = $rperscar['idcargosocupados'];
                    $arraydatospersona[$contpersonas]['idcargo'] = $datosCargos[0]->idestructura;
                    $arraydatospersona[$contpersonas]['cargo'] = '<img src="' . $datosCargos[0]->icon . '" height=16 width=16 />' . ' ' . $datosCargos[0]->denominacion;
                    $arraydatospersona[$contpersonas]['idplantillanominal'] = $idplantillanominal;
                    $arraydatospersona[$contpersonas]['plantilla'] = $plantillanominal;
                    $contpersonas++;
                }
			  }
			 }
		   }
		}
	    echo json_encode(array('datos'=>$arraydatospersona, 'cantidad'=>count($arraydatospersona)));		
	}
	
	/**
     * Acción utilizada para obtener el listado de las Personas de la con los datos para el destajo colectivo.
     */
    public function obtenerListadoPersonasDestajoIndividualAction() {
	    $add = $this->_getParam('add');
	    $idconvenio = $this->_getParam('idconvenio');
        $objConfPlantillaNominal = new ConfPlantillaNominalCargo();
	    $arrayidpersonas = Zend_Json::decode(stripslashes($this->_getParam('arrayidpersonas')));
		$cont = 0;
		$arraydatosdestajo = array();
		if($add=='ADD'){
		 foreach($arrayidpersonas as $i=>$ridpersona){
             $existepersona = DatModeloConvenioIndividual::existePersonaConvenio($idconvenio,$ridpersona);
             if($existepersona == 0){
                 $objDatModeloConvenioIndividual = new DatModeloConvenioIndividual();
                 //Datos de la persona
                 $sqldatospersona = "select doc.numero, dp.nombre, dp.snombre, dp.papel, dp.sapel, cargo.idcargo, nomg.denominacion, 1 as tarifamn from mod_persona.dat_persona dp
			                    left join mod_persona.dat_docidentidad doc on (doc.idpersona = dp.idpersona)
			                    inner join mod_nomina.dat_cargosocupados cargo on (cargo.idpersona = dp.idpersona)
			                    inner join mod_nomina.conf_elementosalarialcargo elemsal on (elemsal.idcargo = cargo.idcargo)
			                    inner join mod_nomina.nom_grupoescala nomg on (nomg.idgrupoescala = elemsal.idgrupoescala)
								where dp.idpersona = ? and dp.feliminado is null;";
                 $mg = Doctrine_Manager::getInstance();
                 $conn = $mg->getCurrentConnection();
                 $datospersona = $conn->fetchAll($sqldatospersona, array($ridpersona));

                 //Salvando los datos del convenio colectivo
                 $objDatModeloConvenioIndividual->grupoescala = $datospersona[0]['denominacion'];
                 $objDatModeloConvenioIndividual->tarifamn = $datospersona[0]['tarifamn'];
                 $objDatModeloConvenioIndividual->idpersona = $ridpersona;
                 $objDatModeloConvenioIndividual->idconvenio = $idconvenio;
                 $objDatModeloConvenioIndividual->save();
             }

		 }
         $arrdatosmodelo = DatModeloConvenioIndividual::getModeloxConvenios($idconvenio);
         foreach($arrdatosmodelo as $i=>$value){
                //Datos de la persona
                $sqldatospersona = "select doc.numero, dp.nombre, dp.snombre, dp.papel, dp.sapel, cargo.idcargo from mod_persona.dat_persona dp
			                    left join mod_persona.dat_docidentidad doc on (doc.idpersona = dp.idpersona)
			                    inner join mod_nomina.dat_cargosocupados cargo on (cargo.idpersona = dp.idpersona)
			                    where dp.idpersona = ? and dp.feliminado is null;";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $datospersona = $conn->fetchAll($sqldatospersona, array($value['idpersona']));
                $datosCargos = ZendExt_Ioc::getInstance()->metadatos->DameEstructura($datospersona[0]['idcargo']);
                $datosplantilla = $objConfPlantillaNominal->obtenerPlantillaXIdCargo($datospersona[0]['idcargo']);
                $arraydatosdestajo[$cont]['idmodeloconvenioindividual'] = $value['idmodeloconvenioindividual'];
                $arraydatosdestajo[$cont]['idpersona'] = $value['idpersona'];
                $arraydatosdestajo[$cont]['ci'] = $datospersona[0]['numero'];
                $arraydatosdestajo[$cont]['nombreyapp'] = $datospersona[0]['nombre']." ".$datospersona[0]['snombre']." ".$datospersona[0]['papel']." ".$datospersona[0]['sapel'];
                $arraydatosdestajo[$cont]['cargo'] = '<img src="' . $datosCargos[0]->icon . '" height=16 width=16 />' . ' ' . $datosCargos[0]->denominacion;
                $arraydatosdestajo[$cont]['grupoescala'] = $value['grupoescala'];
                $arraydatosdestajo[$cont]['tarifamn'] = $value['tarifamn'];
                $arraydatosdestajo[$cont]['porcientoejecutado'] = $value['porcientoejecutado'];
                $arraydatosdestajo[$cont]['salariocreado'] = $value['salariocreado'];
                $arraydatosdestajo[$cont]['sbc'] = $value['sbc'];
                $arraydatosdestajo[$cont]['cdsmn'] = $value['cdsmn'];
                $arraydatosdestajo[$cont]['salarioapagar'] = $value['salarioapagar'];
                $arraydatosdestajo[$cont]['idplantilla'] = $datosplantilla[0]['ConfPlantillaNominal']['idplantillanominal'];
                $arraydatosdestajo[$cont]['plantilla'] = $datosplantilla[0]['ConfPlantillaNominal']['denominacion'];
                $cont++;
         }
		 //Pongo el convenio en estado de "definido"
		 $objDatConvenio = new DatConvenio();
		 $objDatConvenioMod = $objDatConvenio->obtenerDatConvenioDadoId($idconvenio);
		 $objDatConvenioMod->definido = 1;
		 $objDatConvenioMod->save();
		 //Devolviendo los datos
		 echo json_encode(array('datos'=>$arraydatosdestajo, 'cantidad'=>count($arraydatosdestajo)));
		}else{
          //Salvo las personas
          foreach($arrayidpersonas as $idp=>$ridp){
              $existepersona = DatModeloConvenioIndividual::existePersonaConvenio($idconvenio,$ridp);
              if($existepersona == 0){
                  $objDatModeloConvenioIndividual = new DatModeloConvenioIndividual();
                  //Datos de la persona
                  $sqldatospersona = "select doc.numero, dp.nombre, dp.snombre, dp.papel, dp.sapel, cargo.idcargo, nomg.denominacion, 1 as tarifamn from mod_persona.dat_persona dp
			                    left join mod_persona.dat_docidentidad doc on (doc.idpersona = dp.idpersona)
			                    inner join mod_nomina.dat_cargosocupados cargo on (cargo.idpersona = dp.idpersona)
			                    inner join mod_nomina.conf_elementosalarialcargo elemsal on (elemsal.idcargo = cargo.idcargo)
			                    inner join mod_nomina.nom_grupoescala nomg on (nomg.idgrupoescala = elemsal.idgrupoescala)
								where dp.idpersona = ? and dp.feliminado is null;";
                  $mg = Doctrine_Manager::getInstance();
                  $conn = $mg->getCurrentConnection();
                  $datospersona = $conn->fetchAll($sqldatospersona, array($ridp));

                  //Salvando los datos del convenio colectivo
                  $objDatModeloConvenioIndividual->grupoescala = $datospersona[0]['denominacion'];
                  $objDatModeloConvenioIndividual->tarifamn = $datospersona[0]['tarifamn'];
                  $objDatModeloConvenioIndividual->idpersona = $ridp;
                  $objDatModeloConvenioIndividual->idconvenio = $idconvenio;
                  $objDatModeloConvenioIndividual->save();
              }
          }
		  $arrdatosmodelo = DatModeloConvenioIndividual::getModeloxConvenios($idconvenio);
		  foreach($arrdatosmodelo as $i=>$value){
		    //Datos de la persona		  
			$sqldatospersona = "select doc.numero, dp.nombre, dp.snombre, dp.papel, dp.sapel, cargo.idcargo from mod_persona.dat_persona dp
			                    left join mod_persona.dat_docidentidad doc on (doc.idpersona = dp.idpersona)
			                    inner join mod_nomina.dat_cargosocupados cargo on (cargo.idpersona = dp.idpersona)
			                    where dp.idpersona = ? and dp.feliminado is null;";
		    $mg = Doctrine_Manager::getInstance();
		    $conn = $mg->getCurrentConnection();
		    $datospersona = $conn->fetchAll($sqldatospersona, array($value['idpersona']));
            $datosCargos = ZendExt_Ioc::getInstance()->metadatos->DameEstructura($datospersona[0]['idcargo']);
            $datosplantilla = $objConfPlantillaNominal->obtenerPlantillaXIdCargo($datospersona[0]['idcargo']);
			$arraydatosdestajo[$cont]['idmodeloconvenioindividual'] = $value['idmodeloconvenioindividual'];
			$arraydatosdestajo[$cont]['idpersona'] = $value['idpersona'];
			$arraydatosdestajo[$cont]['ci'] = $datospersona[0]['numero'];
			$arraydatosdestajo[$cont]['nombreyapp'] = $datospersona[0]['nombre']." ".$datospersona[0]['snombre']." ".$datospersona[0]['papel']." ".$datospersona[0]['sapel'];
			$arraydatosdestajo[$cont]['cargo'] = '<img src="' . $datosCargos[0]->icon . '" height=16 width=16 />' . ' ' . $datosCargos[0]->denominacion;
			$arraydatosdestajo[$cont]['grupoescala'] = $value['grupoescala'];
			$arraydatosdestajo[$cont]['tarifamn'] = $value['tarifamn'];
			$arraydatosdestajo[$cont]['porcientoejecutado'] = $value['porcientoejecutado'];
			$arraydatosdestajo[$cont]['salariocreado'] = $value['salariocreado'];
			$arraydatosdestajo[$cont]['sbc'] = $value['sbc'];
			$arraydatosdestajo[$cont]['cdsmn'] = $value['cdsmn'];
			$arraydatosdestajo[$cont]['salarioapagar'] = $value['salarioapagar'];
            $arraydatosdestajo[$cont]['idplantilla'] = $datosplantilla[0]['ConfPlantillaNominal']['idplantillanominal'];
            $arraydatosdestajo[$cont]['plantilla'] = $datosplantilla[0]['ConfPlantillaNominal']['denominacion'];
              $cont++;
		  }
		  //Devolviendo los datos
		 echo json_encode(array('datos'=>$arraydatosdestajo, 'cantidad'=>count($arraydatosdestajo)));
		}		
	}
	
	/**
     * Acción utilizada para obtener el listado de las Personas de la con los datos para el destajo colectivo.
     */
    public function obtenerListadoPersonasDestajoColectivoAction() {
	    $add = $this->_getParam('add');
	    $idconvenio = $this->_getParam('idconvenio');
        $objConfPlantillaNominal = new ConfPlantillaNominalCargo();
	    $arrayidpersonas = Zend_Json::decode(stripslashes($this->_getParam('arrayidpersonas')));
		$cont = 0;
		$arraydatosdestajo = array();
		if($add=='ADD'){
		 foreach($arrayidpersonas as $i=>$ridpersona){
            $existepersona = DatModeloConvenioColectivo::existePersonaConvenio($idconvenio,$ridpersona);
            if($existepersona == 0){
                $objDatModeloConvenioColectivo = new DatModeloConvenioColectivo();
                //Datos de la persona
                $sqldatospersona = "select doc.numero, dp.nombre, dp.snombre, dp.papel, dp.sapel, cargo.idcargo, nomg.denominacion, 1 as tarifamn from mod_persona.dat_persona dp
			                    left join mod_persona.dat_docidentidad doc on (doc.idpersona = dp.idpersona)
			                    inner join mod_nomina.dat_cargosocupados cargo on (cargo.idpersona = dp.idpersona)
			                    inner join mod_nomina.conf_elementosalarialcargo elemsal on (elemsal.idcargo = cargo.idcargo)
			                    inner join mod_nomina.nom_grupoescala nomg on (nomg.idgrupoescala = elemsal.idgrupoescala)
								where dp.idpersona = ? and dp.feliminado is null;";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $datospersona = $conn->fetchAll($sqldatospersona, array($ridpersona));

                //Salvando los datos del convenio colectivo
                $objDatModeloConvenioColectivo->grupoescala = $datospersona[0]['denominacion'];
                $objDatModeloConvenioColectivo->tarifamn = $datospersona[0]['tarifamn'];
                $objDatModeloConvenioColectivo->idpersona = $ridpersona;
                $objDatModeloConvenioColectivo->idconvenio = $idconvenio;
                $objDatModeloConvenioColectivo->save();
            }
		 }
         $arrdatosmodelo = DatModeloConvenioColectivo::getModeloxConvenios($idconvenio);
         foreach($arrdatosmodelo as $i=>$value){
             //Datos de la persona
             $sqldatospersona = "select doc.numero, dp.nombre, dp.snombre, dp.papel, dp.sapel, cargo.idcargo, nomg.denominacion, 1 as tarifamn from mod_persona.dat_persona dp
			                    left join mod_persona.dat_docidentidad doc on (doc.idpersona = dp.idpersona)
			                    inner join mod_nomina.dat_cargosocupados cargo on (cargo.idpersona = dp.idpersona)
			                    inner join mod_nomina.conf_elementosalarialcargo elemsal on (elemsal.idcargo = cargo.idcargo)
			                    inner join mod_nomina.nom_grupoescala nomg on (nomg.idgrupoescala = elemsal.idgrupoescala)
								where dp.idpersona = ? and dp.feliminado is null;";
             $mg = Doctrine_Manager::getInstance();
             $conn = $mg->getCurrentConnection();
             $datospersona = $conn->fetchAll($sqldatospersona, array($value['idpersona']));
             //Mostrando los datos principales de la persona
             $datosCargos = ZendExt_Ioc::getInstance()->metadatos->DameEstructura($datospersona[0]['idcargo']);
             $datosplantilla = $objConfPlantillaNominal->obtenerPlantillaXIdCargo($datospersona[0]['idcargo']);
             $arraydatosdestajo[$cont]['idmodeloconveniocolectivo'] = $value['idmodeloconveniocolectivo'];
             $arraydatosdestajo[$cont]['idpersona'] = $value['idpersona'];
             $arraydatosdestajo[$cont]['ci'] = $datospersona[0]['numero'];
             $arraydatosdestajo[$cont]['nombreyapp'] = $datospersona[0]['nombre']." ".$datospersona[0]['snombre']." ".$datospersona[0]['papel']." ".$datospersona[0]['sapel'];
             $arraydatosdestajo[$cont]['cargo'] = '<img src="' . $datosCargos[0]->icon . '" height=16 width=16 />' . ' ' . $datosCargos[0]->denominacion;
             $arraydatosdestajo[$cont]['grupoescala'] = $value['grupoescala'];
             $arraydatosdestajo[$cont]['tarifamn'] = $value['tarifamn'];
             $arraydatosdestajo[$cont]['horastrabajadas'] = $value['htrabajadas'];
             $arraydatosdestajo[$cont]['cpl'] = $value['cpl'];
             $arraydatosdestajo[$cont]['sbc'] = $value['sbc'];
             $arraydatosdestajo[$cont]['salarioapagar'] = $value['salarioapagar'];
             $arraydatosdestajo[$cont]['idplantilla'] = $datosplantilla[0]['ConfPlantillaNominal']['idplantillanominal'];
             $arraydatosdestajo[$cont]['plantilla'] = $datosplantilla[0]['ConfPlantillaNominal']['denominacion'];
             $cont++;
         }
		 //Pongo el convenio en estado de "definido"
		 $objDatConvenio = new DatConvenio();
		 $objDatConvenioMod = $objDatConvenio->obtenerDatConvenioDadoId($idconvenio);
		 $objDatConvenioMod->definido = 1;
		 $objDatConvenioMod->save();
		 //Devolviendo los datos
		 echo json_encode(array('datos'=>$arraydatosdestajo, 'cantidad'=>count($arraydatosdestajo)));
		}else{
          foreach($arrayidpersonas as $idp=>$ridp) {
                $existepersona = DatModeloConvenioColectivo::existePersonaConvenio($idconvenio, $ridp);
                if ($existepersona == 0) {
                    $objDatModeloConvenioColectivo = new DatModeloConvenioColectivo();
                    //Datos de la persona
                    $sqldatospersona = "select doc.numero, dp.nombre, dp.snombre, dp.papel, dp.sapel, cargo.idcargo, nomg.denominacion, 1 as tarifamn from mod_persona.dat_persona dp
			                    left join mod_persona.dat_docidentidad doc on (doc.idpersona = dp.idpersona)
			                    inner join mod_nomina.dat_cargosocupados cargo on (cargo.idpersona = dp.idpersona)
			                    inner join mod_nomina.conf_elementosalarialcargo elemsal on (elemsal.idcargo = cargo.idcargo)
			                    inner join mod_nomina.nom_grupoescala nomg on (nomg.idgrupoescala = elemsal.idgrupoescala)
								where dp.idpersona = ? and dp.feliminado is null;";
                    $mg = Doctrine_Manager::getInstance();
                    $conn = $mg->getCurrentConnection();
                    $datospersona = $conn->fetchAll($sqldatospersona, array($ridp));

                    //Salvando los datos del convenio colectivo
                    $objDatModeloConvenioColectivo->grupoescala = $datospersona[0]['denominacion'];
                    $objDatModeloConvenioColectivo->tarifamn = $datospersona[0]['tarifamn'];
                    $objDatModeloConvenioColectivo->idpersona = $ridp;
                    $objDatModeloConvenioColectivo->idconvenio = $idconvenio;
                    $objDatModeloConvenioColectivo->save();
                }
          }
		  $arrdatosmodelo = DatModeloConvenioColectivo::getModeloxConvenios($idconvenio);
		  foreach($arrdatosmodelo as $i=>$value){
		    //Datos de la persona		  
			$sqldatospersona = "select doc.numero, dp.nombre, dp.snombre, dp.papel, dp.sapel, cargo.idcargo from mod_persona.dat_persona dp
			                    left join mod_persona.dat_docidentidad doc on (doc.idpersona = dp.idpersona)
			                    inner join mod_nomina.dat_cargosocupados cargo on (cargo.idpersona = dp.idpersona)
			                    where dp.idpersona = ? and dp.feliminado is null;";
		    $mg = Doctrine_Manager::getInstance();
		    $conn = $mg->getCurrentConnection();
		    $datospersona = $conn->fetchAll($sqldatospersona, array($value['idpersona']));
            $datosCargos = ZendExt_Ioc::getInstance()->metadatos->DameEstructura($datospersona[0]['idcargo']);
            $datosplantilla = $objConfPlantillaNominal->obtenerPlantillaXIdCargo($datospersona[0]['idcargo']);
			$arraydatosdestajo[$cont]['idmodeloconveniocolectivo'] = $value['idmodeloconveniocolectivo'];
			$arraydatosdestajo[$cont]['idpersona'] = $value['idpersona'];
			$arraydatosdestajo[$cont]['ci'] = $datospersona[0]['numero'];
			$arraydatosdestajo[$cont]['nombreyapp'] = $datospersona[0]['nombre']." ".$datospersona[0]['snombre']." ".$datospersona[0]['papel']." ".$datospersona[0]['sapel'];
			$arraydatosdestajo[$cont]['cargo'] = '<img src="' . $datosCargos[0]->icon . '" height=16 width=16 />' . ' ' . $datosCargos[0]->denominacion;
			$arraydatosdestajo[$cont]['grupoescala'] = $value['grupoescala'];
			$arraydatosdestajo[$cont]['tarifamn'] = $value['tarifamn'];
			$arraydatosdestajo[$cont]['horastrabajadas'] = $value['htrabajadas'];
			$arraydatosdestajo[$cont]['cpl'] = $value['cpl'];
			$arraydatosdestajo[$cont]['sbc'] = $value['sbc'];
			$arraydatosdestajo[$cont]['salarioapagar'] = $value['salarioapagar'];
			$arraydatosdestajo[$cont]['idplantilla'] = $datosplantilla[0]['ConfPlantillaNominal']['idplantillanominal'];
			$arraydatosdestajo[$cont]['plantilla'] = $datosplantilla[0]['ConfPlantillaNominal']['denominacion'];
			$cont++;
		  }
		  //Devolviendo los datos
		 echo json_encode(array('datos'=>$arraydatosdestajo, 'cantidad'=>count($arraydatosdestajo)));
		}
		
	    		
	}
	
	
	/**
     * Acción utilizada para obtener el listado de las Personas de la con los datos para el destajo colectivo.
     */
    public function calcularDestajoColectivoAction() {
	    $salario = $this->_getParam('salarioreal');
	    $fechainicio = $this->_getParam('fechainicio');
	    $fechafin = $this->_getParam('fechafin');
	    $idestructura = $this->_getParam('idestructura');
	    $horasconvenio = $this->_getParam('horasconvenio');
	    $idconvenio = $this->_getParam('idconvenio');
	    $arridmodelocolectivo = Zend_Json::decode(stripslashes($this->_getParam('arridmodelocolectivo')));
	    $arraytarinfa = Zend_Json::decode(stripslashes($this->_getParam('arraytarinfa')));  
	    $arrhtrabajadas = Zend_Json::decode(stripslashes($this->_getParam('arrhtrabajadas')));  
	    $arrcpl = Zend_Json::decode(stripslashes($this->_getParam('arrcpl')));  

		$cont = 0;
		$arraydatosdestajo = array();
		//Calculando el SBC
		foreach($arridmodelocolectivo as $i=>$idmodelocolectivo){
		   $arraydatosdestajo[$i]['idmodelocolectivo'] = $idmodelocolectivo;
		   $arraydatosdestajo[$i]['tarifamn'] = $arraytarinfa[$i];
		   $arraydatosdestajo[$i]['horastrabajadas'] = $arrhtrabajadas[$i];
		   $arraydatosdestajo[$i]['cpl'] = $arrcpl[$i];
		   $arraydatosdestajo[$i]['sbc'] = number_format($arrhtrabajadas[$i]*$arraytarinfa[$i]*$arrcpl[$i], 2, '.', '');
		}
		//Calculando el CDS
		$sumasbc = 0;
		foreach($arraydatosdestajo as $n=>$datosd){
		   $sumasbc += number_format($datosd['sbc'], 2, '.', '');
		}
		//CDS
		$cds = number_format($salario/$sumasbc, 6, '.', '');
		
		$cont = 0;
		$arraydatosdestajofinal = array();
		foreach($arraydatosdestajo as $s=>$datosdf){
		   $arraydatosdestajofinal[$s]['idmodelocolectivo'] = $datosdf['idmodelocolectivo'];
		   $arraydatosdestajofinal[$s]['tarifamn'] = $datosdf['tarifamn'];
		   $arraydatosdestajofinal[$s]['horastrabajadas'] = $datosdf['horastrabajadas'];
		   $arraydatosdestajofinal[$s]['cpl'] = number_format($datosdf['cpl'], 2, '.', '');
		   $arraydatosdestajofinal[$s]['sbc'] = number_format($datosdf['sbc'], 2, '.', '');
		   $arraydatosdestajofinal[$s]['salario'] = number_format($datosdf['sbc'] * $cds, 2, '.', '');
		}
		//print_r($arraydatosdestajofinal);die;
		foreach($arraydatosdestajofinal as $k=>$datosdestajocolectivo){
		   //Salvando el modelo colectivo
		   $objDatModeloConvenioColectivo = new DatModeloConvenioColectivo();
		   $objDatModeloConvenioColectivoSave = $objDatModeloConvenioColectivo->obtenerDatModeloConvenioColectivoDadoId($datosdestajocolectivo['idmodelocolectivo']);
		   $objDatModeloConvenioColectivoSave->htrabajadas = $datosdestajocolectivo['horastrabajadas'];
		   $objDatModeloConvenioColectivoSave->cpl = $datosdestajocolectivo['cpl'];
		   $objDatModeloConvenioColectivoSave->sbc = $datosdestajocolectivo['sbc'];
		   $objDatModeloConvenioColectivoSave->salarioapagar = $datosdestajocolectivo['salario'];
		   //print_r($objDatModeloConvenioColectivoSave);die;
		   $objDatModeloConvenioColectivoSave->save();
		   //Buscando en reportes
		   $sql = "SELECT dr.idreportescertificaciones, cvar.idvariablesconfreportescertificaciones, der.idelemento, dver.idvariableselementosreportescertificaciones, dver.valor 
							FROM mod_nomina.dat_reportescertificaciones dr
							INNER JOIN mod_nomina.conf_tiporeportescertificaciones ctr on (ctr.idconfreportescertificaciones = dr.idconfreportescertificaciones and ctr.deresultados = 99)
							INNER JOIN mod_nomina.conf_variablestiporeportescertificaciones cvar on (cvar.idconfreportescertificaciones = ctr.idconfreportescertificaciones and cvar.tipovariable = 99)
							LEFT JOIN mod_nomina.dat_elementosreportescertificaciones der on (der.idreportescertificaciones = dr.idreportescertificaciones)
							LEFT JOIN mod_nomina.dat_variableselementosreportescertificaciones dver on (dver.idelementosreportescertificaciones = der.idelementosreportescertificaciones)
							WHERE (('{$fechainicio}'::date BETWEEN dr.fechainicio AND dr.fechafin) OR ('{$fechafin}'::date BETWEEN dr.fechainicio AND dr.fechafin))";
			$mg = Doctrine_Manager::getInstance();
			$conn = $mg->getCurrentConnection();
			$rreporte = $conn->fetchAll($sql);
			//Si el reporte esta
                    if(count($rreporte)>0){
			  $flag = 0;
			  foreach($rreporte as $cr=>$rep){
			    //Si la persona esta en el reporte le sumo el salario
			    if($rep['idelemento'] == $objDatModeloConvenioColectivoSave->idpersona){
				  $salarioactualizado = $rep['valor'] + $objDatModeloConvenioColectivoSave->salarioapagar;
				  //$objDatVariablesElementosReportesCertificaciones = new DatVariablesElementosReportesCertificaciones();
				  $objDatVariablesElementosReportesCertificacionesSave = Doctrine::getTable('DatVariablesElementosReportesCertificaciones')->find($rep['idvariableselementosreportescertificaciones']);
				  $objDatVariablesElementosReportesCertificacionesSave->valor = $salarioactualizado;
				  $objDatVariablesElementosReportesCertificacionesSave->save();
				  $flag = 1;
				}
			  }
			  //Si la persona no esta en el reporte la adiciono
              if($flag == 0){
			    //Salvo en DatElementoReporte
			    $objDatElementosReportesCertificaciones = new DatElementosReportesCertificaciones();
			    $objDatElementosReportesCertificaciones->idreportescertificaciones = $rep['idreportescertificaciones'];
			    $objDatElementosReportesCertificaciones->idelemento = $objDatModeloConvenioColectivoSave->idpersona;
			    $objDatElementosReportesCertificaciones->aprobado = 0;
			    $objDatElementosReportesCertificaciones->save();
			    $idelementorep = $objDatElementosReportesCertificaciones->idelementosreportescertificaciones;
				//Salvo en DatVariable
				$objDatVariablesElementosReportesCertificaciones = new DatVariablesElementosReportesCertificaciones();
				$objDatVariablesElementosReportesCertificaciones->idelementosreportescertificaciones = $idelementorep;
				$objDatVariablesElementosReportesCertificaciones->idvariablesconfreportescertificaciones = $rep['idvariablesconfreportescertificaciones'];
				$objDatVariablesElementosReportesCertificaciones->valor = $objDatModeloConvenioColectivoSave->salarioapagar;
				$objDatVariablesElementosReportesCertificaciones->save();
			  }		
            //Si el reporte no esta 			  
			}else{
			  $ususario = $this->global->Perfil->idusuario;
			  $rfecha = explode('/', $fechainicio);  
			  $fechainicialreporte = $rfecha[1].'/'. 1  .'/'. $rfecha[2];
			  $datei = strtotime($fechainicialreporte);
			  $ultimodiames = $this->getUltimoDiaMes($rfecha[2], $rfecha[1]);
			  $fechafinalreporte = $rfecha[1] .'/'. $ultimodiames .'/'. $rfecha[2];
			  $datef = strtotime($fechafinalreporte);
			  //Buscando el idconfreporte
			  $sqlctrep = "SELECT ctr.idconfreportescertificaciones, cvar.idvariablesconfreportescertificaciones 
							FROM mod_nomina.conf_tiporeportescertificaciones ctr
							INNER JOIN mod_nomina.conf_variablestiporeportescertificaciones cvar on (cvar.idconfreportescertificaciones = ctr.idconfreportescertificaciones)
							WHERE ctr.deresultados = 99";
			  $mg = Doctrine_Manager::getInstance();
			  $conn = $mg->getCurrentConnection();
			  $rtrep = $conn->fetchAll($sqlctrep);
			  //Salvando el reporte
			  $objDatReporte = new DatReportesCertificaciones();
              $objDatReporte->idconfreportescertificaciones = $rtrep[0]['idconfreportescertificaciones'];
              $objDatReporte->fechainicio = date('d/m/Y', $datei);
              $objDatReporte->fechafin = date('d/m/Y', $datef);
              $objDatReporte->estado = 1;
              $objDatReporte->identidad = $idestructura;
              $objDatReporte->idusuario = $ususario;
			  $objDatReporte->save();
			  //Salvando en DatElementos
			  //Salvo en DatElementoReporte
			  $objDatElementosReportesCertificaciones = new DatElementosReportesCertificaciones();
			  $objDatElementosReportesCertificaciones->idreportescertificaciones = $objDatReporte->idreportescertificaciones;
			  $objDatElementosReportesCertificaciones->idelemento = $objDatModeloConvenioColectivoSave->idpersona;
			  $objDatElementosReportesCertificaciones->aprobado = 0;
			  $objDatElementosReportesCertificaciones->save();
			  $idelementorep = $objDatElementosReportesCertificaciones->idelementosreportescertificaciones;
		      //Salvo en DatVariable
			  $objDatVariablesElementosReportesCertificaciones = new DatVariablesElementosReportesCertificaciones();
			  $objDatVariablesElementosReportesCertificaciones->idelementosreportescertificaciones = $idelementorep;
			  $objDatVariablesElementosReportesCertificaciones->idvariablesconfreportescertificaciones = $rtrep[0]['idvariablesconfreportescertificaciones'];
			  $objDatVariablesElementosReportesCertificaciones->valor = $objDatModeloConvenioColectivoSave->salarioapagar;
			  $objDatVariablesElementosReportesCertificaciones->save();
            }
        }
        //Salvando las horas del convenio
        $objConvenio = new DatConvenio();
        $objConvenio->horas = $horasconvenio;
        $objConvenio->save();
	    echo json_encode("ok");		
	}
	
	/**
     * Acción utilizada para obtener el listado de las Personas de la con los datos para el destajo individual.
     */
    public function calcularDestajoIndividualAction() {
	    $salario = $this->_getParam('salarioreal');
	    $fechainicio = $this->_getParam('fechainicio');
	    $fechafin = $this->_getParam('fechafin');
	    $idestructura = $this->_getParam('idestructura');
	    $arridmodeloindividual = Zend_Json::decode(stripslashes($this->_getParam('arridmodeloindividual')));
	    $arrporcientosejecutados = Zend_Json::decode(stripslashes($this->_getParam('arrporcientosejecutados')));
	    $arraytarinfa = Zend_Json::decode(stripslashes($this->_getParam('arraytarinfa')));
		
		//Calculando el SBC
		foreach($arridmodeloindividual as $i=>$idmodeloindividual){
		   $arraydatosdestajo[$i]['idmodeloconvenioindividual'] = $idmodeloindividual;
		   $arraydatosdestajo[$i]['tarifamn'] = $arraytarinfa[$i];
		   $arraydatosdestajo[$i]['porcientoejecutado'] = $arrporcientosejecutados[$i];
		   $salariocreado = number_format($salario*$arrporcientosejecutados[$i]/100, 2, '.', '');
		   $arraydatosdestajo[$i]['salariocreado'] = $salariocreado;
		   $arraydatosdestajo[$i]['sbc'] = number_format($salariocreado*$arraytarinfa[$i], 2, '.', '');
		}
		
		//Calculando el CDS
		$sumasbc = 0;
		foreach($arraydatosdestajo as $n=>$datosd){
		   $sumasbc += number_format($datosd['sbc'], 2, '.', '');
		}
		//CDS
		$cds = number_format($salario/$sumasbc, 6, '.', '');
		
		$cont = 0;
		$arraydatosdestajofinal = array();
		foreach($arraydatosdestajo as $s=>$datosdf){
		   $arraydatosdestajofinal[$s]['idmodeloconvenioindividual'] = $datosdf['idmodeloconvenioindividual'];
		   $arraydatosdestajofinal[$s]['tarifamn'] = $datosdf['tarifamn'];
		   $arraydatosdestajofinal[$s]['porcientoejecutado'] = $datosdf['porcientoejecutado'];
		   $arraydatosdestajofinal[$s]['salariocreado'] = $datosdf['salariocreado'];
		   $arraydatosdestajofinal[$s]['sbc'] = $datosdf['sbc'];
		   $arraydatosdestajofinal[$s]['salario'] = number_format($datosdf['sbc'] * $cds, 2, '.', '');
		}
		foreach($arraydatosdestajofinal as $k=>$datosdestajoindividual){
		   //Salvando el modelo colectivo
		   $objDatModeloConvenioIndividual = new DatModeloConvenioIndividual();
		   $objDatModeloConvenioIndividualSave = $objDatModeloConvenioIndividual->obtenerDatModeloConvenioIndDadoId($datosdestajoindividual['idmodeloconvenioindividual']);
		   $objDatModeloConvenioIndividualSave->porcientoejecutado = $datosdestajoindividual['porcientoejecutado'];
		   $objDatModeloConvenioIndividualSave->salariocreado = $datosdestajoindividual['salariocreado'];
		   $objDatModeloConvenioIndividualSave->cdsmn = $cds;
		   $objDatModeloConvenioIndividualSave->sbc = $datosdestajoindividual['sbc'];
		   $objDatModeloConvenioIndividualSave->salarioapagar = $datosdestajoindividual['salario'];
		   //print_r($objDatModeloConvenioIndividualSave);die;
		   $objDatModeloConvenioIndividualSave->save();
		   //Buscando en reportes
		   $sql = "SELECT dr.idreportescertificaciones, cvar.idvariablesconfreportescertificaciones, der.idelemento, dver.idvariableselementosreportescertificaciones, dver.valor 
							FROM mod_nomina.dat_reportescertificaciones dr
							INNER JOIN mod_nomina.conf_tiporeportescertificaciones ctr on (ctr.idconfreportescertificaciones = dr.idconfreportescertificaciones and ctr.deresultados = 99)
							INNER JOIN mod_nomina.conf_variablestiporeportescertificaciones cvar on (cvar.idconfreportescertificaciones = ctr.idconfreportescertificaciones and cvar.tipovariable = 99)
							LEFT JOIN mod_nomina.dat_elementosreportescertificaciones der on (der.idreportescertificaciones = dr.idreportescertificaciones)
							LEFT JOIN mod_nomina.dat_variableselementosreportescertificaciones dver on (dver.idelementosreportescertificaciones = der.idelementosreportescertificaciones)
							WHERE (('{$fechainicio}'::date BETWEEN dr.fechainicio AND dr.fechafin) OR ('{$fechafin}'::date BETWEEN dr.fechainicio AND dr.fechafin))";
			$mg = Doctrine_Manager::getInstance();
			$conn = $mg->getCurrentConnection();
			$rreporte = $conn->fetchAll($sql);
			//Si el reporte esta
			if(count($rreporte)>0){
			  $flag = 0;
			  foreach($rreporte as $cr=>$rep){
			    //Si la persona esta en el reporte le sumo el salario
			    if($rep['idelemento'] == $objDatModeloConvenioIndividualSave->idpersona){
				  $salarioactualizado = $rep['valor'] + $objDatModeloConvenioIndividualSave->salarioapagar;
				  //$objDatVariablesElementosReportesCertificaciones = new DatVariablesElementosReportesCertificaciones();
				  $objDatVariablesElementosReportesCertificacionesSave = Doctrine::getTable('DatVariablesElementosReportesCertificaciones')->find($rep['idvariableselementosreportescertificaciones']);
				  $objDatVariablesElementosReportesCertificacionesSave->valor = $salarioactualizado;
				  $objDatVariablesElementosReportesCertificacionesSave->save();
				  $flag = 1;
				}
			  }
			  //Si la persona no esta en el reporte la adiciono
              if($flag == 0){
			    //Salvo en DatElementoReporte
			    $objDatElementosReportesCertificaciones = new DatElementosReportesCertificaciones();
			    $objDatElementosReportesCertificaciones->idreportescertificaciones = $rep['idreportescertificaciones'];
			    $objDatElementosReportesCertificaciones->idelemento = $objDatModeloConvenioIndividualSave->idpersona;
			    $objDatElementosReportesCertificaciones->aprobado = 0;
			    $objDatElementosReportesCertificaciones->save();
			    $idelementorep = $objDatElementosReportesCertificaciones->idelementosreportescertificaciones;
				//Salvo en DatVariable
				$objDatVariablesElementosReportesCertificaciones = new DatVariablesElementosReportesCertificaciones();
				$objDatVariablesElementosReportesCertificaciones->idelementosreportescertificaciones = $idelementorep;
				$objDatVariablesElementosReportesCertificaciones->idvariablesconfreportescertificaciones = $rep['idvariablesconfreportescertificaciones'];
				$objDatVariablesElementosReportesCertificaciones->valor = $objDatModeloConvenioIndividualSave->salarioapagar;
				$objDatVariablesElementosReportesCertificaciones->save();
			  }		
            //Si el reporte no esta 			  
			}else{
			  $ususario = $this->global->Perfil->idusuario;
			  $rfecha = explode('/', $fechainicio);  
			  $fechainicialreporte = $rfecha[1].'/'. 1  .'/'. $rfecha[2];
			  $datei = strtotime($fechainicialreporte);
			  $ultimodiames = $this->getUltimoDiaMes($rfecha[2], $rfecha[1]);
			  $fechafinalreporte = $rfecha[1] .'/'. $ultimodiames .'/'. $rfecha[2];
			  $datef = strtotime($fechafinalreporte);
			  //Buscando el idconfreporte
			  $sqlctrep = "SELECT ctr.idconfreportescertificaciones, cvar.idvariablesconfreportescertificaciones 
							FROM mod_nomina.conf_tiporeportescertificaciones ctr
							INNER JOIN mod_nomina.conf_variablestiporeportescertificaciones cvar on (cvar.idconfreportescertificaciones = ctr.idconfreportescertificaciones)
							WHERE ctr.deresultados = 99";
			  $mg = Doctrine_Manager::getInstance();
			  $conn = $mg->getCurrentConnection();
			  $rtrep = $conn->fetchAll($sqlctrep);
			  //Salvando el reporte
			  $objDatReporte = new DatReportesCertificaciones();
              $objDatReporte->idconfreportescertificaciones = $rtrep[0]['idconfreportescertificaciones'];
              $objDatReporte->fechainicio = date('d/m/Y', $datei);
              $objDatReporte->fechafin = date('d/m/Y', $datef);
              $objDatReporte->estado = 1;
              $objDatReporte->identidad = $idestructura;
              $objDatReporte->idusuario = $ususario;
			  $objDatReporte->save();
			  //Salvando en DatElementos
			  //Salvo en DatElementoReporte
			  $objDatElementosReportesCertificaciones = new DatElementosReportesCertificaciones();
			  $objDatElementosReportesCertificaciones->idreportescertificaciones = $objDatReporte->idreportescertificaciones;
			  $objDatElementosReportesCertificaciones->idelemento = $objDatModeloConvenioIndividualSave->idpersona;
			  $objDatElementosReportesCertificaciones->aprobado = 0;
			  $objDatElementosReportesCertificaciones->save();
			  $idelementorep = $objDatElementosReportesCertificaciones->idelementosreportescertificaciones;
		      //Salvo en DatVariable
			  $objDatVariablesElementosReportesCertificaciones = new DatVariablesElementosReportesCertificaciones();
			  $objDatVariablesElementosReportesCertificaciones->idelementosreportescertificaciones = $idelementorep;
			  $objDatVariablesElementosReportesCertificaciones->idvariablesconfreportescertificaciones = $rtrep[0]['idvariablesconfreportescertificaciones'];
			  $objDatVariablesElementosReportesCertificaciones->valor = $objDatModeloConvenioIndividualSave->salarioapagar;
			  $objDatVariablesElementosReportesCertificaciones->save();
            }
		}
	    echo json_encode("ok");		
	}
	
	/**
     * Acción utilizada para buscar si el convenio tiene algun tipo de destajo definido.
     */
	public function buscarTipoConvenioAction(){
	$idconvenio = $this->_getParam('idconvenio');
	$identidad = $this->_getParam('identidad');
	$sqldatosconvenio = "select datc.definido from mod_nomina.dat_convenio datc
			                    where datc.idconvenio = ?;";
	$mg = Doctrine_Manager::getInstance();
	$conn = $mg->getCurrentConnection();
	$datosconvenio = $conn->fetchAll($sqldatosconvenio, array($idconvenio));
	 if($datosconvenio[0]['definido'] == 0){
	  //Devolviendo los datos
	  echo json_encode($obj->definido = 0);
	 }else{
	  $objDatModeloConvenioIndividual = new DatModeloConvenioIndividual();
	  $objDatModeloConvenioColectivo = new DatModeloConvenioColectivo();
	  $existemodeloindividual = $objDatModeloConvenioIndividual->existeModeloIndividualxConvenio($idconvenio);
	  $existemodelocolectivo = $objDatModeloConvenioColectivo->existeModeloColectivoxConvenio($idconvenio);
	  $obj->definido = 1;
	  $obj->existemodeloindividual = $existemodeloindividual;
	  $obj->existemodelocolectivo = $existemodelocolectivo;
	  //Devolviendo los datos
	  echo json_encode($obj);
	 }
	}
	
	public function delModConvenioAction(){
	  $tipoconvenio = $this->_getParam('tipoconvenio');
	  $arrayidmodeloconvenio = Zend_Json::decode(stripslashes($this->_getParam('arrayidmodeloconvenio')));
	  $objDatConvenioModel = new DatConvenioModel();
	  $ok = $objDatConvenioModel->deleteModeloConvenio($arrayidmodeloconvenio, $tipoconvenio);
	  
	  //Devolviendo los datos
	  echo json_encode($ok);
	}
	
	public function getUltimoDiaMes($elAnio,$elMes) {
      return date("d",(mktime(0,0,0,$elMes+1,1,$elAnio)-1));
    }
	
}
