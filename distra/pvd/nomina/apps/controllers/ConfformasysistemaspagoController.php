<?php

class ConfformasysistemaspagoController extends ZendExt_Controller_Secure {
    
    var $datosModelo;

    public function init() {
        parent::init();
        
    }
    
    public function confformasysistemaspagoAction() {
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        //$this->view->idioma = $this->global->Perfil->idioma;
        $this->render();
    }
    
    public function obtenerconfiguracioninicialAction(){
		//Creando el modelo de negocio de gestion de conceptos de la retribución monetaria.
        $modeloNegocioConceptoRM = new NomConceptoRMModel();
        //Creando el modelo de negocio de gestion de variables globales.
        $modeloNegocioVariablesG = new NomVariableGlobalModel();
        //Obteniendo el arreglo de conceptos de la retribución monetaria.
        $arrCRM = $modeloNegocioConceptoRM->obtenerTodosConceptosRM();
        //Obteniendo el arreglo de variables globales.
        $arrVG = $modeloNegocioVariablesG->obtenerTodasVariablesGlobales();
        $arrR = array();
        foreach($arrCRM as $k => $v){
            $arrR[] = array('idindicador'=>'CRM_'.$v['idconceptorm'], 'indicador'=>$v['denominacion'], 'tipo'=>'Conceptos de la retribuci&oacute;n monetaria');
        }

        foreach($arrVG as $k => $v){
            $arrR[] = array('idindicador'=>'VG_'.$v['idvariableglobal'], 'indicador'=>$v['denominacion'], 'tipo'=>'Variables globales');
        }
		$this->datosModelo->indicadores = $arrR;
		
		echo json_encode($this->datosModelo);
	}

	public function obtenerconceptospdportipospagoAction(){
		$identidad = $this->_getParam('identidad');
        $idsistemapago = $this->_getParam('idsistemapago');
        $idtipopago = $this->_getParam('idtipopago');
        $sedesglosa = $this->_getParam('sedesglosa');
        $buscar = $this->_getParam('buscar');
        $texto = $this->_getParam('texto');
		
        $inicio = $this->_getParam('start');
        $limite = $this->_getParam('limit');
		
		$obj = new ConfConceptosporTiposySistemasPago();
		if($buscar == 1){
		$r = $obj->obtenerConfConceptosporTiposySistemasPago($inicio, $limite, $identidad, $idtipopago, $idsistemapago, 0, $buscar, $texto);
		$c = $obj->obtenerCantidadConfConceptosporTiposySistemasPago($identidad, $idtipopago, $idsistemapago, 0, $buscar, $texto);
        echo json_encode(array('datos'=>$r, 'cantidad'=>$c));
		}else{
		$texto = "";
		$r = $obj->obtenerConfConceptosporTiposySistemasPago($inicio, $limite, $identidad, $idtipopago, $idsistemapago, 0, $buscar, $texto);
		 $c = $obj->obtenerCantidadConfConceptosporTiposySistemasPago($identidad, $idtipopago, $idsistemapago, 0, $buscar, $texto);
        echo json_encode(array('datos'=>$r, 'cantidad'=>$c));
		}
                  
	}
	
	public function adicionarconceptospdportipospagoAction(){
		$identidad = $this->_getParam('identidad');
        $idsistemapago = $this->_getParam('idsistemapago');
        $idtipopago = $this->_getParam('idtipopago');
        $sedesglosa = $this->_getParam('sedesglosa');
        $arrIdsConceptos = Zend_Json::decode(stripslashes($this->_getParam('conceptos')));
        $objModel = new ConfConceptosporTiposySistemasPagoModel();
        
		$a['identidad'] = $identidad;
        $a['idtipopago'] = $idtipopago;
        $a['idsistemapago'] = ($sedesglosa == 1 ? $idsistemapago : null);
        $a['sedesglosa'] = $sedesglosa;
        $a['conceptos'] = $arrIdsConceptos;
        
		foreach($arrIdsConceptos as $i=>$idconcepto){
		$cantidad = $objModel->existeConfConceptosporTiposySistemasPago($idconcepto, $idtipopago, $identidad, $idsistemapago);
		if($cantidad == "no existe"){
		$objModel->adicionarConfConceptosporTiposySistemas($a);
		}
		}
        
        
		
        $r->codigo = 'ADD-1';
        echo json_encode($r);
	}
	
	public function eliminarconceptospdportipospagoAction(){
        $arrayidconfconceptosportiposysistemaspago = Zend_Json::decode(stripslashes($this->_getParam('idconfconceptosportiposysistemaspago')));
        $arrayidentidad = Zend_Json::decode(stripslashes($this->_getParam('identidad')));
        $idtipopago = $this->_getParam('idtipopago');
        $arrayidconceptopercepciondescuento = array();
        
        $objModel = new ConfConceptosporTiposySistemasPagoModel();
        if(count($arrayidentidad)>0){
            foreach ($arrayidentidad as $cla => $identidad) {
                foreach ($arrayidconfconceptosportiposysistemaspago as $s => $idconfconceptosportiposysistemaspago) {
                    $objModel->eliminarConfConceptosporTiposySistemas($idconfconceptosportiposysistemaspago);
                }
            }
            $r->codigo = 'DEL-1';
            echo json_encode($r);
        }else{
            $r->codigo = 'ERR-NO-EST';
            echo json_encode($r);
        }

	}

    public function obtenerconfiguracionesformaysistemapagoAction() {
        $idconfconceptosportiposysistemaspago = $this->_getParam('idconfconceptosportiposysistemaspago');
        $idconceptopercepciondescuento = $this->_getParam('idconceptopercepciondescuento');
        $idperiodopago = $this->_getParam('idperiodopago');
        $obj = new ConfConceptospdFormasySistemasPago();
        $r = $obj->obtenerConfConceptospdFormasySistemasPago($idconfconceptosportiposysistemaspago, $idperiodopago);
        
        $a = array(); 
        if(count($r) > 0){
            $a['idconfconceptospdformasysistemaspago'] = $r[0]['idconfconceptospdformasysistemaspago'];
            $a['idconfconceptosportiposysistemaspago'] = $r[0]['idconfconceptosportiposysistemaspago'];
            $a['idperiodopago'] = $r[0]['idperiodopago'];
            $a['formacalculo'] = $r[0]['formacalculo'];
            $a['idexpresionmatematica'] = $r[0]['idexpresionmatematica'];
            $a['lugaresdecimales'] = $r[0]['lugaresdecimales'];
            $objT = new NomConceptoPDTarifa();
			$rt = $objT->obtenerListadoTarifaConcepto($idconceptopercepciondescuento);
			$a['tarifasconcepto'] = $rt;
            
			if($r[0]['formacalculo'] == 2){
				if($a['idexpresionmatematica']){
				    $ioc = ZendExt_IoC_Inter::getInstance();
					$rf = $ioc->comun->BuscarTodosporarrIdExpresionMatematica(array($r[0]['idexpresionmatematica']));
					$a['expresionamostrar'] = $rf[0]['expresionamostrar'];
				}else{
					$a['expresionamostrar'] = null;
				}	
			}
			$a['resultado'] = 1;
		}else{
            $objT = new NomConceptoPDTarifa();
            $rt = $objT->obtenerListadoTarifaConcepto($idconceptopercepciondescuento);
            $a['tarifasconcepto'] = $rt;
            $a['resultado'] = 2;
		}   
        echo json_encode($a);
    }
    
    public function guardarconfconceptospdformassistemaspagoAction(){
        $idperiodopago = $this->_getParam('idperiodopago');
        $idconfconceptosportiposysistemaspago = $this->_getParam('idconfconceptosportiposysistemaspago');
        $formacalculo = $this->_getParam('formacalculo');
        $idexpresionmatematica = $this->_getParam('idexpresionmatematica');
	$idconfconceptospdformasysistemaspago = $this->_getParam('idconfconceptospdformasysistemaspago');
        $lugaresdecimales = $this->_getParam('lugaresdecimales');
       
		$arregloDatos['idperiodopago'] 					= $idperiodopago;
		$arregloDatos['idconfconceptosportiposysistemaspago'] 	= $idconfconceptosportiposysistemaspago;
		$arregloDatos['formacalculo'] 					= $formacalculo;
		$arregloDatos['idexpresionmatematica'] 			= $idexpresionmatematica;
               $arregloDatos['lugaresdecimales'] 			= $lugaresdecimales;
               
		$objM = new ConfConceptospdFormasySistemasPagoModel();
		
		if($idconfconceptospdformasysistemaspago){
			$o = $objM->modificarConfConceptospdFormasySistemas($idconfconceptospdformasysistemaspago, $arregloDatos);
			$r->idconfconceptospdformasysistemaspago = $o->idconfconceptospdformasysistemaspago;
		}else{
			$o = $objM->adicionarConfConceptospdFormasySistemas($arregloDatos);
			$r->idconfconceptospdformasysistemaspago = $o->idconfconceptospdformasysistemaspago;
		}		
		$r->codigo = 'GUAR-1';
		
		echo json_encode($r);
	}
    
    public function obtenervariablesauxiliaresAction(){
		$idconfconceptospdformasysistemaspago = $this->_getParam('idconfconceptospdformasysistemaspago');
		$objVA = new DatVarAuxConceptospdFormasySistemasPago();
		$rv = $objVA->obtenerVariablesAuxiliaresPorConfConceptosGeneralesNomina($idconfconceptospdformasysistemaspago);
		
		echo json_encode(array('datos'=>$rv, 'cantidad'=>count($rv)));
	}
    
    public function adicionarvariablesauxiliaresAction() {

        $arregloDatos['idconfconceptospdformasysistemaspago']   = $this->_getParam('idconfconceptospdformasysistemaspago');
        $arregloDatos['denominacion']         					= $this->_getParam('denominacion');
        $arregloDatos['formaentrada'] 							= $this->_getParam('formaentrada');
        $arregloDatos['idconfreportescertificaciones']   		= $this->_getParam('idconfreportescertificaciones');
        $arregloDatos['idvariablesconfreportescertificaciones'] = $this->_getParam('idvariablesconfreportescertificaciones');
        $arregloDatos['lugaresdecimalesvariable'] = $this->_getParam('lugaresdecimalesvariable');
        
        $objModel = new DatVariablesAuxConceptospdFormasySistemasPagoModel();
		$objModel->adicionarDatVariablesAuxConceptospdFormasySistemasPago($arregloDatos);
		$r->codigo = 'ADD-1';
        
        echo json_encode($r);
    }

    public function eliminarvariablesauxiliaresAction() {
        
        $id  = $this->_getParam('idvariableauxconceptospdformasysistemaspago');
        
        $objModel = new DatVariablesAuxConceptospdFormasySistemasPagoModel();
        $objModel->eliminarDatVariablesAuxConceptospdFormasySistemasPago($id);
        
        $r->codigo = 'DEL-1';
        echo json_encode($r);
    }

    public function replicardatosAction()
    {
        $identidad = Zend_Json::decode(stripslashes($this->_getParam('identidad')));
        $arrtipospagoreplicar = Zend_Json::decode(stripslashes($this->_getParam('arrtipospagoreplicar')));
        $idsistemapago = $this->_getParam('idsistemapago');
        //$idtipopago = $this->_getParam('idtipopago');
        $conceptos = Zend_Json::decode(stripslashes($this->_getParam('conceptos')));
        $sedesglosa = $this->_getParam('sedesglosa');
        $tiporeplica = $this->_getParam('tiporeplica');
        $identidadreplica = $this->_getParam('identidadreplica');

        $arrIdsCPD = array();
        $arrCPDConfV = array();
        foreach ($conceptos as $c){
            $arrIdsCPD[] = $c['id'];
            $arrCPDConfV[$c['id']] = $c;
        }
        

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();

        /*Busco la configuracion de todos los conceptos*/
        $sql = "SELECT idconfconceptospdformasysistemaspago, idconfconceptosportiposysistemaspago, idperiodopago, 
                formacalculo, idexpresionmatematica, lugaresdecimales
                FROM mod_nomina.conf_conceptospdformasysistemaspago WHERE idconfconceptosportiposysistemaspago IN (".
                implode(',', $arrIdsCPD).");";
        $rConf = $conn->fetchAll($sql);
        
        $arrIdsCPDFSP = array();
        $arrIdsExpMat = array();
        
        if(count($rConf) > 0){
            foreach ($rConf as $rc){
                if(array_key_exists($rc['idconfconceptosportiposysistemaspago'], $arrCPDConfV)){
                    $arrCPDConfV[$rc['idconfconceptosportiposysistemaspago']]['idperiodopago'] = $rc['idperiodopago'];
                    $arrCPDConfV[$rc['idconfconceptosportiposysistemaspago']]['formacalculo'] = $rc['formacalculo'];
                    $arrCPDConfV[$rc['idconfconceptosportiposysistemaspago']]['idexpresionmatematica'] = $rc['idexpresionmatematica'];
                    if(!empty($rc['idexpresionmatematica'])) {
                        $arrIdsExpMat[] = $rc['idexpresionmatematica'];
                    }
                    $arrCPDConfV[$rc['idconfconceptosportiposysistemaspago']]['lugaresdecimales'] = $rc['lugaresdecimales'];
                    $arrCPDConfV[$rc['idconfconceptosportiposysistemaspago']]['idconfconceptospdformasysistemaspago'] = $rc['idconfconceptospdformasysistemaspago'];
                    $arrIdsCPDFSP[] = $rc['idconfconceptospdformasysistemaspago'];
                }
            }
        }
        
        /*Busco las variables de las configuraciones de cada concepto*/
        $sql = "SELECT idvariableauxconceptospdformasysistemaspago, idconfconceptospdformasysistemaspago, denominacion, 
                formaentrada, idconfreportescertificaciones, idvariablesconfreportescertificaciones, lugaresdecimalesvariable
                FROM mod_nomina.dat_variableauxconceptospdformasysistemaspago WHERE idconfconceptospdformasysistemaspago IN (".
                implode(',', $arrIdsCPDFSP).");";
        $rVar = $conn->fetchAll($sql);
        
        $arrVarAux = array();
        foreach ($rVar as $rv)
        {
            $arrVarAux[$rv['idconfconceptospdformasysistemaspago']][$rv['idvariableauxconceptospdformasysistemaspago']] = $rv;
        }
        
        
        /*Busco las expresiones matematicas*/
        $sql = "SELECT dem.idexpresionmatematica, dem.denominacion, dem.expresionamostrar, dem.expresionacalcular,
                deem.elemento, deem.tipoelemento, deem.idindicador, deem.orden, deem.valormostrar 
                FROM mod_utiles.dat_expresionmatematica dem
                INNER JOIN mod_utiles.dat_elementoexpresionmatematica deem ON (deem.idexpresionmatematica = dem.idexpresionmatematica)
                WHERE dem.idexpresionmatematica IN (".implode(',', $arrIdsExpMat).") ORDER BY dem.idexpresionmatematica, deem.orden;";

        $rExpMat = $conn->fetchAll($sql);
        
        $arrExpMat = array();
        foreach ($rExpMat as $em)
        {
            $arrE = array();
            $arrE['denominacion'] = $em['denominacion'];
            $arrE['expresionamostrar'] = $em['expresionamostrar'];
            $arrE['expresionacalcular'] = $em['expresionacalcular'];
            $arrE['expresionmostrarconformato'] = $em['expresionamostrar'];
            $arrExpMat[$em['idexpresionmatematica']]['expresionmatematica'] = $arrE;
            $arrElem = array();
            $arrElem['valor'] = $em['elemento'];
            $arrElem['tipo'] = $em['tipoelemento'];
            $arrElem['valormostrar'] = $em['valormostrar'];
            $arrExpMat[$em['idexpresionmatematica']]['elementos'][] = $arrElem;
            
        }
        /*Recorro cada entidad y replico cada concepto*/
        foreach($identidad as $rid){
            foreach ($arrCPDConfV as $cc)
            {
                foreach ($arrtipospagoreplicar as $idtipopago){
                    $ccc = $cc;
                    if($tiporeplica == 1){
                        $cantconfconctipossistp =  ConfConceptosporTiposySistemasPago::cantidadConfConceptosporTiposySistemasPagoxEntidadTipoPago($ccc['idconceptopercepciondescuento'], $idtipopago, $identidadreplica);
                        if($cantconfconctipossistp > 0){
                            /*Elimino toda la configuracion anterior del concepto*/
                            $sql = "DELETE FROM mod_nomina.conf_conceptosportiposysistemaspago
                        WHERE identidad = ? AND idtipopago = ? AND idconceptopercepciondescuento = ?;";
                            $conn->execute($sql, array($rid, $idtipopago, $cc['idconceptopercepciondescuento']));

                            /*Duplico la configuracion de ConfConceptosporTiposySistemasPago*/
                            $idconfconceptosportiposysistemaspago = NULL;
                            $objC1 = new ConfConceptosporTiposySistemasPago();
                            $objC1->identidad = $rid;
                            $objC1->idtipopago = $idtipopago;
                            $objC1->idsistemapago = ($sedesglosa == 1 ? $idsistemapago : null);
                            $objC1->idconceptopercepciondescuento = $ccc['idconceptopercepciondescuento'];
                            $objC1->save();
                            $idconfconceptosportiposysistemaspago = $objC1->idconfconceptosportiposysistemaspago;

                            /*Duplico la configuracion de ConfConceptospdFormasySistemasPago*/
                            $idconfconceptospdformasysistemaspago = NULL;
                            $objC2 = new ConfConceptospdFormasySistemasPago();
                            $objC2->idconfconceptosportiposysistemaspago = $idconfconceptosportiposysistemaspago;
                            $objC2->idperiodopago = $ccc['idperiodopago'];
                            $objC2->formacalculo = $ccc['formacalculo'];
                            $objC2->idexpresionmatematica = NULL;
                            $objC2->lugaresdecimales = $ccc['lugaresdecimales'];
                            $objC2->save();
                            $idconfconceptospdformasysistemaspago = $objC2->idconfconceptospdformasysistemaspago;
                            $arrExpMatCopia = $arrExpMat;
                            /*Duplico las variables y reemplazo la expresion matematica por los nuevos ids*/
                            if(array_key_exists($cc['idconfconceptospdformasysistemaspago'], $arrVarAux)){
                                $expcal = $arrExpMat[$ccc['idexpresionmatematica']]['expresionmatematica']['expresionacalcular'];
                                foreach($arrVarAux[$cc['idconfconceptospdformasysistemaspago']] as &$va){
                                    $objVA = new DatVarAuxConceptospdFormasySistemasPago();
                                    $objVA->idconfconceptospdformasysistemaspago = $idconfconceptospdformasysistemaspago;
                                    $objVA->denominacion = $va['denominacion'];
                                    $objVA->formaentrada = $va['formaentrada'];
                                    $objVA->idconfreportescertificaciones = $va['idconfreportescertificaciones'];
                                    $objVA->idvariablesconfreportescertificaciones = $va['idvariablesconfreportescertificaciones'];
                                    $objVA->lugaresdecimalesvariable = $va['lugaresdecimalesvariable'];
                                    $objVA->save();
                                    $va['idnuevo'] = $objVA->idvariableauxconceptospdformasysistemaspago;

                                    if(!empty($ccc['idexpresionmatematica'])){
                                        if(array_key_exists($cc['idexpresionmatematica'], $arrExpMat)){
                                            $expcal = str_replace("VASP_".$va['idvariableauxconceptospdformasysistemaspago'], "VASP_".$va['idnuevo'], $expcal);
                                            foreach ($arrExpMatCopia[$ccc['idexpresionmatematica']]['elementos'] as &$eme){
                                                if($eme['tipo'] == 6){
                                                    $valor = str_replace("VASP_".$va['idvariableauxconceptospdformasysistemaspago'], "VASP_".$va['idnuevo'], $eme['valor']);
                                                    $eme['valor'] = $valor;
                                                }
                                            }
                                        }
                                    }

                                }
                                $arrExpMatCopia[$ccc['idexpresionmatematica']]['expresionmatematica']['expresionacalcular'] = $expcal;
                            }

                            /*Duplico la expresion matematica y la guardo en la configuracion*/
                            if(!empty($ccc['idexpresionmatematica'])){
                                if(array_key_exists($ccc['idexpresionmatematica'], $arrExpMat)){
                                    $idExpMat = $this->pIntegrator->comun->AdicionarExpresionMatematica(
                                        $arrExpMatCopia[$ccc['idexpresionmatematica']]['expresionmatematica'],
                                        $arrExpMatCopia[$ccc['idexpresionmatematica']]['elementos']
                                    );
                                    $this->pIntegrator->comun->GuardarExpresionesMatematicas(array($idExpMat));
                                    $objC2->idexpresionmatematica = $idExpMat;
                                    $objC2->save();
                                }
                            }
                        }
                    }else{
                        /*Elimino toda la configuracion anterior del concepto*/
                        $sql = "DELETE FROM mod_nomina.conf_conceptosportiposysistemaspago
                        WHERE identidad = ? AND idtipopago = ? AND idconceptopercepciondescuento = ?;";
                        $conn->execute($sql, array($rid, $idtipopago, $cc['idconceptopercepciondescuento']));

                        /*Duplico la configuracion de ConfConceptosporTiposySistemasPago*/
                        $idconfconceptosportiposysistemaspago = NULL;
                        $objC1 = new ConfConceptosporTiposySistemasPago();
                        $objC1->identidad = $rid;
                        $objC1->idtipopago = $idtipopago;
                        $objC1->idsistemapago = ($sedesglosa == 1 ? $idsistemapago : null);
                        $objC1->idconceptopercepciondescuento = $ccc['idconceptopercepciondescuento'];
                        $objC1->save();
                        $idconfconceptosportiposysistemaspago = $objC1->idconfconceptosportiposysistemaspago;

                        /*Duplico la configuracion de ConfConceptospdFormasySistemasPago*/
                        $idconfconceptospdformasysistemaspago = NULL;
                        $objC2 = new ConfConceptospdFormasySistemasPago();
                        $objC2->idconfconceptosportiposysistemaspago = $idconfconceptosportiposysistemaspago;
                        $objC2->idperiodopago = $ccc['idperiodopago'];
                        $objC2->formacalculo = $ccc['formacalculo'];
                        $objC2->idexpresionmatematica = NULL;
                        $objC2->lugaresdecimales = $ccc['lugaresdecimales'];
                        $objC2->save();
                        $idconfconceptospdformasysistemaspago = $objC2->idconfconceptospdformasysistemaspago;
                        $arrExpMatCopia = $arrExpMat;
                        /*Duplico las variables y reemplazo la expresion matematica por los nuevos ids*/
                        if(array_key_exists($cc['idconfconceptospdformasysistemaspago'], $arrVarAux)){
                            $expcal = $arrExpMat[$ccc['idexpresionmatematica']]['expresionmatematica']['expresionacalcular'];
                            foreach($arrVarAux[$cc['idconfconceptospdformasysistemaspago']] as &$va){
                                $objVA = new DatVarAuxConceptospdFormasySistemasPago();
                                $objVA->idconfconceptospdformasysistemaspago = $idconfconceptospdformasysistemaspago;
                                $objVA->denominacion = $va['denominacion'];
                                $objVA->formaentrada = $va['formaentrada'];
                                $objVA->idconfreportescertificaciones = $va['idconfreportescertificaciones'];
                                $objVA->idvariablesconfreportescertificaciones = $va['idvariablesconfreportescertificaciones'];
                                $objVA->lugaresdecimalesvariable = $va['lugaresdecimalesvariable'];
                                $objVA->save();
                                $va['idnuevo'] = $objVA->idvariableauxconceptospdformasysistemaspago;

                                if(!empty($ccc['idexpresionmatematica'])){
                                    if(array_key_exists($cc['idexpresionmatematica'], $arrExpMat)){
                                        $expcal = str_replace("VASP_".$va['idvariableauxconceptospdformasysistemaspago'], "VASP_".$va['idnuevo'], $expcal);
                                        foreach ($arrExpMatCopia[$ccc['idexpresionmatematica']]['elementos'] as &$eme){
                                            if($eme['tipo'] == 6){
                                                $valor = str_replace("VASP_".$va['idvariableauxconceptospdformasysistemaspago'], "VASP_".$va['idnuevo'], $eme['valor']);
                                                $eme['valor'] = $valor;
                                            }
                                        }
                                    }
                                }

                            }
                            $arrExpMatCopia[$ccc['idexpresionmatematica']]['expresionmatematica']['expresionacalcular'] = $expcal;
                        }

                        /*Duplico la expresion matematica y la guardo en la configuracion*/
                        if(!empty($ccc['idexpresionmatematica'])){
                            if(array_key_exists($ccc['idexpresionmatematica'], $arrExpMat)){
                                $idExpMat = $this->pIntegrator->comun->AdicionarExpresionMatematica(
                                    $arrExpMatCopia[$ccc['idexpresionmatematica']]['expresionmatematica'],
                                    $arrExpMatCopia[$ccc['idexpresionmatematica']]['elementos']
                                );
                                $this->pIntegrator->comun->GuardarExpresionesMatematicas(array($idExpMat));
                                $objC2->idexpresionmatematica = $idExpMat;
                                $objC2->save();
                            }
                        }
                    }
                }
                
            }
            
        }
        
        
        
       
       
        /*IMPLEMENTACION DE MILENA*/
        /*$objModel = new ConfConceptosporTiposySistemasPagoModel();

//        foreach($identidad as $rid){
//            foreach ($concepto as $k => $idConcepto) {
//
//                $objModel->replicardatos($idConcepto, $idtipopago, $rid, $idsistemapago,$sedesglosa);
//            }
//        }

        foreach($identidad as $rid){

        foreach ($conceptos as $k => $v) {

            $objModel = new ConfConceptosporTiposySistemasPagoModel();
            $cantidad = $objModel->existeConfConceptosporTiposySistemasPago($v['idconceptopercepciondescuento'], $idtipopago, $rid, $idsistemapago);
           //
            $a['identidad'] = $rid;
            $a['idtipopago'] = $idtipopago;
            $a['idsistemapago'] = ($sedesglosa == 1 ? $idsistemapago : null);
            $a['sedesglosa'] = $sedesglosa;
            $a['conceptos'] = array($v['idconceptopercepciondescuento']);
            //eliminando el concpto
            $obj = new ConfConceptosporTiposySistemasPago();
            $concepto = $obj->dadoId($v['idconceptopercepciondescuento'], $idtipopago, $rid, $idsistemapago);

                if (count($concepto) > 0) {
                    $objModel->eliminarConfConceptosporTiposySistemas($concepto[0]['idconfconceptosportiposysistemaspago']);
                }

//            if ($cantidad == "no existe") {
                //adiciona el concepto contable si no existe.
                $aux = $objModel->adicionarConfConceptosporTiposySistemas($a);
                $variables = ConfConceptospdFormasySistemasPagoModel::existenvariables($v['id']);

                if (count($variables) > 0) {
                    $arregloDatos['idperiodopago'] = $variables[0]['idperiodopago'];
                    $arregloDatos['idconfconceptosportiposysistemaspago'] = $aux;
                    $arregloDatos['formacalculo'] = $variables[0]['formacalculo'];
                   // print_r($variables[0]);die;
                    //Creando una nueva formula con los mismos elementos pero con diferente id
                    $nuevoidformula = ConfConceptospdFormasySistemasPagoModel::crearFormulaNueva($variables[0]['idexpresionmatematica'],3);

                    $arregloDatos['idexpresionmatematica'] = $nuevoidformula;

                    $arregloDatos['lugaresdecimales'] = $variables[0]['lugaresdecimales'];
                    $objM = new ConfConceptospdFormasySistemasPagoModel();
                    //adiciona concepto con la expresion matematica si existe.
                    $o = $objM->adicionarConfConceptospdFormasySistemas($arregloDatos);
                    $vaux = ConfConceptospdFormasySistemasPagoModel::existenvariablesaux($variables[0]['idconfconceptospdformasysistemaspago']);

                    $arrayidvarauxviejas = array();
                    $arrayidvarauxnuevas = array();

                    if (count($vaux) > 0) {
                        foreach ($vaux as $kvaux => $vvaux) {

                            $var['idconfconceptospdformasysistemaspago'] = $o->idconfconceptospdformasysistemaspago;
                            $var['denominacion'] = $vvaux['denominacion'];
                            $var['formaentrada'] = $vvaux['formaentrada'];
                            $var['idconfreportescertificaciones'] = $vvaux['idconfreportescertificaciones'];
                            $var['idvariablesconfreportescertificaciones'] = $vvaux['idvariablesconfreportescertificaciones'];
                            $var['lugaresdecimalesvariable'] = $vvaux['lugaresdecimalesvariable'];
                            $objModel = new DatVariablesAuxConceptospdFormasySistemasPagoModel();
                            $idvariableauxconceptospdformasysistemaspago = $objModel->adicionarDatVariablesAuxConceptospdFormasySistemasPago($var);
                            //Llenando los arreglos de variables nuevas y viejas
                            $arrayidvarauxviejas[] = $vvaux['idvariableauxconceptospdformasysistemaspago'];
                            $arrayidvarauxnuevas[] = $idvariableauxconceptospdformasysistemaspago->idvariableauxconceptospdformasysistemaspago;
                        }

                        //Cambiando las variables auxiliares en la expresion a calcular de la formula nueva en dat_expresionmatematica
                        $objFormulaNueva = DatExpresionMatematicaNomina::Buscar($nuevoidformula);
                        $arrElementos = DatElementoExpresionMatematicaNomina::obtenerElementosFormula($nuevoidformula);

                        foreach ($arrayidvarauxnuevas as $n => $varnueva) {

                            $expresionacalcular = str_ireplace('IVASP_' . $arrayidvarauxviejas[$n], 'IVASP_' . $varnueva, $objFormulaNueva->expresionacalcular . '');

                            $objFormulaNueva->expresionacalcular = $expresionacalcular;

                            //Cambiando los elementos en dat_elementoexpresionmatematica
                            foreach ($arrElementos as $e => $elemento) {
                               // print_r($varnueva);die;
                                if ($elemento['idindicador'] == 'VASP_' . $arrayidvarauxviejas[$n]) {
                                    $objElemento = DatElementoExpresionMatematicaNomina::Buscar($elemento['idelementoexpresionmatematica']);
                                   // print_r('IVASP_' . $varnueva);die;
                                    $objElemento->elemento = 'IVASP_' . $varnueva->idvariableauxconceptospdformasysistemaspago;
                                    $objElemento->idindicador = 'VASP_' . $varnueva->idvariableauxconceptospdformasysistemaspago;
                                    $objElemento->save();
                                }
                            }
                        }
                        $dirleer = $_SERVER['DOCUMENT_ROOT'].'/pvd/comun/indicadoresexpresonmatematica/'.$variables[0]['idexpresionmatematica'].'.iem';
                        $datosserializados = file_get_contents($dirleer);
                        $arrdatos = unserialize($datosserializados);
                        foreach($arrdatos as $ids=>$rds){
                            foreach($arrayidvarauxviejas as $ivav=>$rvav){
                               if($rds == 'VASP_'.$rvav){
                                   $arrdatos[$ids] = 'VASP_'.$arrayidvarauxnuevas[$ivav];
                               }
                            }
                        }
                        $dirguardar = $_SERVER['DOCUMENT_ROOT'].'/pvd/comun/indicadoresexpresonmatematica/'.$nuevoidformula.'.iem';
                        file_put_contents($dirguardar, serialize($arrdatos));
                        $objFormulaNueva->save();
                    }else{
                        $dirleer = $_SERVER['DOCUMENT_ROOT'].'/pvd/comun/indicadoresexpresonmatematica/'.$variables[0]['idexpresionmatematica'].'.iem';
                        $datosserializados = file_get_contents($dirleer);
                        $dirguardar = $_SERVER['DOCUMENT_ROOT'].'/pvd/comun/indicadoresexpresonmatematica/'.$nuevoidformula.'.iem';
                        file_put_contents($dirguardar, $datosserializados);

                    }
                }
//            }
        }
       }*//*FIN IMPLEMENTACION DE MILENA*/
        $r->codigo = 'ADD-1';
        echo json_encode($r);
    }

    public function obtenerconceptospdportipospagoreplicarAction(){
        $identidad = $this->_getParam('identidad');
        $arrtipospago = Zend_Json::decode(stripslashes($this->_getParam('arrtipospago')));
        $obj = new ConfConceptosporTiposySistemasPago();
        $arrconceptospd = $obj->obtenerConfConceptosporTiposySistemasPagoPorIdEstructura($identidad, $arrtipospago);
        echo json_encode(array('datos'=>$arrconceptospd, 'cantidad'=>count($arrconceptospd)));

    }
}
