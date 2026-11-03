<?php

class ConfconceptosgeneralesnominaController extends ZendExt_Controller_Secure {
    
    var $datosModelo;

    public function init() {
        parent::init();
        
    }
    
    public function confconceptosgeneralesnominaAction() {
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }
    
    public function obtenerconfiguracioninicialAction(){
        $identidad = $this->_getParam('identidad');
        $idtipopago = $this->_getParam('idtipopago');
        $objCPD = new ConfConceptospdFormasySistemasPago();
        $r = $objCPD->obtenerConceptosPDXTipoPago($identidad, $idtipopago);
		$arrR = array();
		foreach($r as $i => $v){
			$arrR[] = array('idindicador'=>$v['idconceptopercepciondescuento'], 'indicador'=>$v['denominacion'], 'tipo'=>$v['tipoconcepto']);
		}
		//Agrego los indicadores de suelgo por cargo, retenciones y vacaciones dentro de los indicadores que van a la formula de los conceptos de retribucion monetaria
		$arrR[] = array('idindicador'=>'SPC', 'indicador'=> 'Salario escala' , 'tipo'=> 'Salario escala' );
		
		$arrR[] = array('idindicador'=>'RET_0', 'indicador'=> 'Retenciones' , 'tipo'=> 'Retenciones' );
		
		//$arrR[] = array('idindicador'=>'VAC_0', 'indicador'=> 'Vacaciones' , 'tipo'=> 'Vacaciones' );
		
		$this->datosModelo->conceptos = $arrR;
		echo json_encode($this->datosModelo);
	}
    
    private function devolverValor($arr, $campomachear, $valor, $campodevolver){
		foreach($arr as $K => $v){
			if($v[$campomachear] == $valor) return $v[$campodevolver];
		}
		return null;
	}

    public function obtenerconfiguracionesconceptosgeneralesnominaAction() {
        $inicio = $this->_getParam('start');
        $limite = $this->_getParam('limit');
        $identidad = $this->_getParam('identidad');
        $idsistemapago = $this->_getParam('idsistemapago');
        $idtipopago = $this->_getParam('idtipopago');
        $sedesglosa = $this->_getParam('sedesglosa');
        $lugaresdecimales = $this->_getParam('lugaresdecimales');
        $criterio = $this->_getParam('criterio');
        $objRC = new ConfConceptosGeneralesNomina();
        $r = $objRC->obtenerConfConceptosGeneralesNomina($inicio, $limite, $identidad, $idsistemapago, $idtipopago, 0, $lugaresdecimales,$criterio);
        $c = $objRC->obtenerCantidadConfConceptosGeneralesNomina($identidad, $idsistemapago, $idtipopago, 0, $lugaresdecimales,$criterio);
        
        $arrIdsConceptosRM = array();
        $arrIdsFormulas = array();
        if($c > 0){
			foreach($r as $i => $v){
				$arrIdsConceptosRM[] = $v['idconceptorm'];
				$arrIdsFormulas[] = $v['idexpresionmatematica'];
			}
			$objCRM = new NomConceptoRM();
			$rCRM = $objCRM->obtenerListadoConceptosRMDadoArregloIds($arrIdsConceptosRM);
			$ioc = ZendExt_IoC_Inter::getInstance();
			$rExpMat = $ioc->comun->BuscarTodosporarrIdExpresionMatematica($arrIdsFormulas);
			foreach($r as $i => &$v){
				$v['conceptorm'] = $this->devolverValor($rCRM, 'idconceptorm', $v['idconceptorm'], 'denominacion');
				$v['expresionmatematica'] = $this->devolverValor($rExpMat, 'idexpresionmatematica', $v['idexpresionmatematica'], 'expresionamostrar');
			}
		}

        echo json_encode(array('datos'=>$r, 'cantidad'=>$c));
       
    }
    
    public function obtenerconceptosgeneralesnominaAction() {
        $objRC = new NomConceptoRM();
        $r = $objRC->obtenerListadoConceptosRMActivos();
        echo json_encode($r);
       
    }

    public function adicionarconfiguracionesconceptosgeneralesnominaAction() {

        $arregloDatos['idconceptorm']          		= $this->_getParam('idconceptorm');
        $arregloDatos['idsistemapago']         		= $this->_getParam('idsistemapago');
        $arregloDatos['idtipopago']         		= $this->_getParam('idtipopago');
        $arregloDatos['idexpresionmatematica']   	= $this->_getParam('idexpresionmatematica');
        $arregloDatos['identidad']   				= $this->_getParam('identidad');
        $arregloDatos['pluriempleo']   				= $this->_getParam('pluriempleo');
        $arregloDatos['periodomensual']   			= $this->_getParam('periodomensual');
        $arregloDatos['lugaresdecimales']           = $this->_getParam('lugaresdecimales');
        $r = null;
        if($arregloDatos['lugaresdecimales']==null){
            $arregloDatos['lugaresdecimales']=2;
        }
        $objModel = new ConfConceptosGeneralesNominaModel();
        if(!ConfConceptosGeneralesNomina::seRepiteConfConceptosGeneralesNomina($arregloDatos['identidad'], $arregloDatos['idsistemapago'], $arregloDatos['idtipopago'], $arregloDatos['idconceptorm'], null)){
			$objModel->adicionarConceptoGeneralNomina($arregloDatos);
			$r->codigo = 'ADD-1';
		}
		else $r->codigo = 'EXISTE';	
        
        echo json_encode($r);
    }

    public function modificarconfiguracionesconceptosgeneralesnominaAction() {
        
        $id  = $this->_getParam('idconfconceptosgeneralesnomina');
        $arregloDatos['idconceptorm']          		= $this->_getParam('idconceptorm');
        $arregloDatos['idsistemapago']         		= $this->_getParam('idsistemapago');
        $arregloDatos['idtipopago']         		= $this->_getParam('idtipopago');
        $arregloDatos['idexpresionmatematica'] 	    = $this->_getParam('idexpresionmatematica');
        $arregloDatos['identidad']   				= $this->_getParam('identidad');
        $arregloDatos['pluriempleo']   				= $this->_getParam('pluriempleo');
        $arregloDatos['periodomensual']   			= $this->_getParam('periodomensual');
        $arregloDatos['lugaresdecimales']           = $this->_getParam('lugaresdecimales');
        $r = null;
        if($arregloDatos['lugaresdecimales']==null){
            $arregloDatos['lugaresdecimales']=2;
        }
        $objModel = new ConfConceptosGeneralesNominaModel();
        if(!ConfConceptosGeneralesNomina::seRepiteConfConceptosGeneralesNomina($arregloDatos['identidad'], $arregloDatos['idsistemapago'], $arregloDatos['idtipopago'], $arregloDatos['idconceptorm'], $id)){
			$objModel->modificarConceptoGeneralNomina($id, $arregloDatos);
			$r->codigo = 'MOD-1';
		}	
		else $r->codigo = 'EXISTE';	
        
        echo json_encode($r);
    }

    public function eliminarconfiguracionesconceptosgeneralesnominaAction() {

        $arridConceptos = Zend_Json::decode(stripslashes($this->_getParam('arrayidconceptos')));
        $arrayidentidades = Zend_Json::decode(stripslashes($this->_getParam('arrayidentidades')));
        $idtipopago = $this->_getParam('idtipopago');
        if(count($arrayidentidades)>0){
            $objModel = new ConfConceptosGeneralesNominaModel();
            $arrayidconceptosrm = array();
            if(count($arridConceptos)>0){
                foreach ($arridConceptos as $ididconfconceptosgeneralesnomina) {
                    array_push($arrayidconceptosrm, $objModel->dameIdConceptoRM($ididconfconceptosgeneralesnomina));
                }
            }
            foreach ($arrayidentidades as $identidad) {
                foreach ($arrayidconceptosrm as $idconceptosrm) {
                    $idconfconceptosgeneralesnomina = $objModel->dameIdconfconceptosgeneralesnomina($idtipopago, $idconceptosrm, $identidad)['idconfconceptosgeneralesnomina'];
                    $objModel->eliminarConceptoGeneralNomina($idconfconceptosgeneralesnomina);
                }
            }
            echo json_encode('OK');
        }else{
            echo json_encode('ERR-NO-EST');
        }

    }

    public function replicarConceptosGeneralesNominaAction()
    {
        $tiporeplica = $this->_getParam('tiporeplica');
        $idEstructura = Zend_Json::decode(stripslashes($this->_getParam('idEstructura')));
        $idConceptos = Zend_Json::decode(stripslashes($this->_getParam('idConceptos')));
        $arrtipospagoreplicar = Zend_Json::decode(stripslashes($this->_getParam('arrtipospagoreplicar')));
        $objModel = new ConfConceptosGeneralesNominaModel();

        foreach($idEstructura as $rid){

            foreach ($idConceptos as $k => $idConcepto) {

                foreach ($arrtipospagoreplicar as $tipopago){
                    $objModel->replicarConceptoGeneralNomina($idConcepto, $rid, $tipopago);
                }
            }
        }

        $r = '';
        $r->codigo = 'ADD-1';
        echo json_encode($r);
    }
    
    
}
