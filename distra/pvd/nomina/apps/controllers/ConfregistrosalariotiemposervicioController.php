<?php

class ConfregistrosalariotiemposervicioController extends ZendExt_Controller_Secure {
    
    var $datosModelo;

    public function init() {
        parent::init();
    }
    
    public function confregistrosalariotiemposervicioAction() {
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
         $this->render();
    }
    
    public function obtenerconfiguracioninicialAction(){
        $idtiponomina = $this->_request->getPost('idtiponomina');
        $idestructura = $this->global->Estructura->idestructura;
        //Creando el modelo de negocio de gestion de conceptos de la retribución monetaria.
        $objConfEstructurarModeloNomina = new ConfigEstructurarModelosNomina();
        //Creando el modelo de negocio de gestion de variables globales.
        $modeloNegocioVariablesG = new NomVariableGlobalModel();
        //Obteniendo el arreglo de conceptos de la retribución monetaria.
        $arrEMN = $objConfEstructurarModeloNomina->obtenerCamposSalarioNominaSNC($idtiponomina, $idestructura);
        //Obteniendo el arreglo de variables globales.
        $arrVG = $modeloNegocioVariablesG->obtenerTodasVariablesGlobales();
        $arrR = array();
        foreach($arrEMN as $k => $v){
            $arrR[] = array('idindicador'=>'EMN_'.$v['idestructuramodelodomina'], 'indicador'=>$v['denominacion'], 'tipo'=>'Campos de la nómina');
        }

        foreach($arrVG as $k => $v){
            $arrR[] = array('idindicador'=>'VG_'.$v['idvariableglobal'], 'indicador'=>$v['denominacion'], 'tipo'=>'Variables globales');
        }
		$this->datosModelo->indicadores = $arrR;
		
		echo json_encode($this->datosModelo);
	}

	public function obtenertiposnominaAction(){
        $objNomTipoNomina = new NomTipoNomina();
        $inicio = $this->_getParam('start',0);
        $limite = $this->_getParam('limit',20);
        $todasnominas = $objNomTipoNomina->obtenerListadoTodosTiposNomina($inicio,$limite);
        $cantnominas = $objNomTipoNomina->cantTiposNomina();
        echo json_encode(array('datos'=>$todasnominas, 'cantidad'=>$cantnominas));
	}

    public function obtenerconfregistrosalarioAction(){
        $idtiponomina = $this->_request->getPost('idtiponomina');
        $objConfRegistroSalario = new ConfigRegistroSalarioTiempoServicioModel();
        $arrayconf = $objConfRegistroSalario->obtenerListadoCamposRegistroSalario($idtiponomina);
        echo json_encode(array('datos'=>$arrayconf, 'cantidad'=>count($arrayconf)));
    }

    public function obtenerconfformulasAction(){

    }
	
	public function obtenercalendarioAction(){
        $anno = $this->_request->getPost('anno');
        $objConfCalendario = new ConfCalendarioSNCModel();
        $arrayconf = $objConfCalendario->obtenerConfCalendario($anno);
        echo json_encode(array('datos'=>$arrayconf, 'cantidad'=>count($arrayconf)));
	}
	
	public function obtenervariablesauxiliaresAction(){
        $idregistsalartiempservc = $this->_request->getParam('idregistsalartiempservc');
        $objDomain = new ConfVarAuxSNC225Model();
        $arrayfinal = $objDomain->obtenerConfVariableAuxiliar($idregistsalartiempservc);
        echo json_encode(array('datos'=>$arrayfinal, 'cantidad'=>count($arrayfinal)));
	}

    public function adicionarvariablessncAction(){
        $idtiponomina = $this->_request->getPost('idtiponomina');
        $denominacion = $this->_request->getPost('denominacion');
        $objConfRegistroSalario = new ConfigRegistroSalarioTiempoServicioModel();
        echo json_encode($objConfRegistroSalario->adicionarvariablessnc($idtiponomina, $denominacion));

    }
    public function modificarvariablessncAction(){
        $idregistsalartiempservc = $this->_request->getPost('idregistsalartiempservc');
        $idtiponomina = $this->_request->getPost('idtiponomina');
        $denominacion = $this->_request->getPost('denominacion');
        $objConfRegistroSalario = new ConfigRegistroSalarioTiempoServicioModel();
        echo json_encode($objConfRegistroSalario->modificarvariablessnc($idregistsalartiempservc,$idtiponomina, $denominacion));
    }

    public function adicionarvariablesauxiliaresAction(){
        $idvariablesnc = $this->_request->getPost('idvariablesnc');
        $idvariablesconfreportescertificaciones = $this->_request->getPost('idvariablesconfreportescertificaciones');
        $anotaciones = $this->_request->getPost('anotaciones');
        $objDomain = new ConfVarAuxSNC225Model();
        echo json_encode($objDomain->adicionarConfVariablesAux($idvariablesnc, $idvariablesconfreportescertificaciones,$anotaciones));
    }

    public function adicionarformulasAction(){
        $idregistsalartiempservc = $this->_request->getPost('idregistsalartiempservc');
        $idexpresionmatematica = $this->_request->getPost('idexpresionmatematica');
        $tipoexpresion = $this->_request->getPost('tipoexpresion');
        $objConfRegistroSalario = new ConfigRegistroSalarioTiempoServicioModel();
        echo json_encode($objConfRegistroSalario->adicionarformulas($idregistsalartiempservc, $idexpresionmatematica, $tipoexpresion));
    }

    public function adicionardatoscalendarioAction(){
        $arrayadddias = Zend_Json::decode(stripslashes($this->_getParam('arrayadddias')));
        $arrayaddmes = Zend_Json::decode(stripslashes($this->_getParam('arrayaddmes')));
        $arrayidcalendario = Zend_Json::decode(stripslashes($this->_getParam('arrayidcalendario')));
        $arraymoddias = Zend_Json::decode(stripslashes($this->_getParam('arraymoddias')));
        $anno = $this->_request->getPost('anno');
        $objModel = new ConfCalendarioSNCModel();
        if(count($arrayadddias)>0){
            $objModel->adicionarCalendario($arrayadddias, $arrayaddmes, $anno);
        }
        if(count($arrayidcalendario)>0){
            $objModel->actualizarCalendario($arrayidcalendario, $arraymoddias);
        }
        echo json_encode('ok');
    }

    public function eliminarvariablessncAction(){
        $idvariableregistrosalario = $this->_request->getPost('idvariableregistrosalario');
        $objConfRegistroSalario = new ConfigRegistroSalarioTiempoServicioModel();
        echo json_encode($objConfRegistroSalario->eliminarvariablessnc($idvariableregistrosalario));
    }

    public function eliminarvariablesauxiliaresAction(){
        $idconfvariableregistrosalario = $this->_request->getPost('idconfvariableregistrosalario');
        $objConfVariableRegistroSalario = new ConfVarAuxSNC225Model();
        echo json_encode($objConfVariableRegistroSalario->eliminarConfVariablesAux($idconfvariableregistrosalario));
    }
}
