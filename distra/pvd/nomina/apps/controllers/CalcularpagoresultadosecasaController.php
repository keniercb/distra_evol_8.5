<?php
$dir_www = str_ireplace('web', 'apps',$_SERVER['DOCUMENT_ROOT']);

class CalcularpagoresultadosecasaController extends ZendExt_Controller_Secure {
    
    public function init() {
        parent::init();
    }
    
    public function calcularpagoresultadosecasaAction() {
	   	$this->render();
    }
	
	public function cargardatosSalariosBaseCalculoAction(){
	   $start = $this->_request->getPost('start');
	   $limit = $this->_request->getPost('limit');
	   $textoabuscar = $this->_request->getPost('textoabuscar');
	   
	   $objDatSBC = new DatPagoResultados();
	   $arraydatossbc = $objDatSBC->getforLimitAndStart($limit, $start, $textoabuscar);
	   $totalcountarraydatossbc = $objDatSBC->getTotalCountforLimitAndStart();
	   $contadorarrayfinal = 0;
	   $arrayfinal = array();
	  
	   foreach($arraydatossbc as $i=>$arrdatsbc){
	     $arrayfinal[$contadorarrayfinal]['idpagoresultado'] = $arrdatsbc['idpagoresultado'];
	     $arrayfinal[$contadorarrayfinal]['idpersona'] = $arrdatsbc['idpersona'];
		 $sqlDatosPersona = "select dp.nombre, dp.snombre, dp.papel, dp.sapel, doc.numero as numid from mod_persona.dat_persona dp 
		           left join mod_persona.dat_docidentidad doc on (doc.idpersona = dp.idpersona and doc.principal = 1)
		           where dp.idpersona = ?;";
				   $mg = Doctrine_Manager::getInstance();
				   $conn = $mg->getCurrentConnection();
		 $arrdatpersona = $conn->fetchAll($sqlDatosPersona, array($arrdatsbc['idpersona']));
		 $nombreapp = $arrdatpersona[0]['nombre']." ".$arrdatpersona[0]['snombre']." ".$arrdatpersona[0]['papel']." ".$arrdatpersona[0]['sapel'];
	     $arrayfinal[$contadorarrayfinal]['nombreyapellidos'] = $nombreapp;
	     $arrayfinal[$contadorarrayfinal]['ci'] = $arrdatpersona[0]['numid'];
	     $arrayfinal[$contadorarrayfinal]['sbct'] = $arrdatsbc['sbct'];
		 $arrayfinal[$contadorarrayfinal]['evalarea'] = ($arrdatsbc['evalarea']==null)?number_format(0, 2, '.', ''):$arrdatsbc['evalarea'];
		 $arrayfinal[$contadorarrayfinal]['evalindividual'] = ($arrdatsbc['evalindividual']==null)?number_format(0, 2, '.', ''):$arrdatsbc['evalindividual'];
	     $arrayfinal[$contadorarrayfinal]['cpd'] = ($arrdatsbc['cpd']==null)?number_format(0, 2, '.', ''):$arrdatsbc['cpd'];
	     $arrayfinal[$contadorarrayfinal]['sbctcpd'] = ($arrdatsbc['sbctcpd']==null)?number_format(0, 2, '.', ''):$arrdatsbc['sbctcpd'];
	     $arrayfinal[$contadorarrayfinal]['ids'] = ($arrdatsbc['ids']==null)?number_format(0, 2, '.', ''):$arrdatsbc['ids'];
	     $arrayfinal[$contadorarrayfinal]['ctrt'] = ($arrdatsbc['ctrt']==null)?number_format(0, 2, '.', ''):$arrdatsbc['ctrt'];
	     $contadorarrayfinal++;
	   }
	   //print_r($arrayfinal);die;
	    echo Zend_Json::encode(array('datos' => $arrayfinal, 'cantidad' => $totalcountarraydatossbc));
	} 

    public function buscardatosSalarioBaseCalculoAction(){
		 $identidad = $this->_request->getPost('identidad');
		 $arrayidelaborarpagos = Zend_Json::decode(stripslashes($this->_getParam('idelaborarpagos')));
		
		$contSBC = 0;
		$arraydatosSBC = null;
		
		$sqlEstructurar = "select distinct estr.idestructuramodelodomina, estr.denominacion, estr.orden from mod_nomina.conf_estructuramodelosnomina estr 
									inner join mod_nomina.conf_modelonomina mod on (mod.idtiponomina = estr.idtiponomina)
									inner join mod_nomina.dat_elaborarpagos elp on (elp.idtipopago = mod.idtipopago)
									inner join mod_nomina.dat_nomina nom on (nom.idelaborarpago = elp.idelaborarpagos)
									where elp.idelaborarpagos = ? and estr.pagoresultados = 1 and estr.idtipocampo=2;";
					    $mg = Doctrine_Manager::getInstance();
					    $conn = $mg->getCurrentConnection();
						$arrEstructuraNomina = $conn->fetchAll($sqlEstructurar, array($arrayidelaborarpagos[0]));
	
		foreach($arrayidelaborarpagos as $i=>$value){
		   $sqlNomina = "select datn.* from mod_nomina.dat_nominadatos datn 
		  		   inner join mod_nomina.dat_nomina nom on (nom.idnomina = datn.idnomina)
		  		   inner join mod_nomina.dat_elaborarpagos elabpag on (elabpag.idelaborarpagos = nom.idelaborarpago)
				   where elabpag.idelaborarpagos = ? and elabpag.identidad = ?;";
				   $mg = Doctrine_Manager::getInstance();
				   $conn = $mg->getCurrentConnection();
				   $arrdatnomina = $conn->fetchAll($sqlNomina, array($value, $identidad));
		    foreach($arrdatnomina as $cont=>$val){
			    $arrValores = unserialize($val['valores']);
    			$arrcolumna = unserialize($val['campos']);
				   foreach($arrValores as $contvalores=>$valores){
				     $arraydatosSBC[$contSBC] = $valores;
				   	 $contSBC++;
				   }
			}
		}
		$arrayfinalid = array();
		$arrayfinalSBC = array();
		$contadorSBC = 0;
		$sumatoriaparaids = 0;
		foreach($arraydatosSBC as $cosbc=>$arrasbc){
    	   $a = explode('-',$arrasbc['id']);
		   $idsPersonas = $a[0];
		   $arrayfinalSBC[$contadorSBC]['idpersona'] = $idsPersonas;
		   $arrayfinalSBC[$contadorSBC]['sbct'] = number_format($arrasbc['c'.$arrEstructuraNomina[0]['idestructuramodelodomina']], 2, '.', '');
		   //Buscando los datos de las evaluaciones
		   $evaluacionindiv = $this->obtenerDatosEvaluaciones($idsPersonas, 5);
		   $arrayfinalSBC[$contadorSBC]['evalindiv'] = $evaluacionindiv;
		   $evaluacioncolec = $this->obtenerDatosEvaluaciones($idsPersonas, 6);
		   $arrayfinalSBC[$contadorSBC]['evalcolec'] = $evaluacioncolec;
		   //cpd
		   $arrayfinalSBC[$contadorSBC]['cpd'] = (($evaluacioncolec*0.6) + ($evaluacionindiv*0.4))/10;
		   //sbc*cpd
		   $arrayfinalSBC[$contadorSBC]['sbcxcpd'] = $arrayfinalSBC[$contadorSBC]['sbct']*$arrayfinalSBC[$contadorSBC]['cpd'];
		   
		   $sumatoriaparaids += $arrayfinalSBC[$contadorSBC]['sbcxcpd'];
		   $contadorSBC++;
		}
		foreach($arrayfinalSBC as $contids=>$arrpersonaids){
		  $arrayfinalSBC[$contids]['ids'] = $arrpersonaids['sbcxcpd']/$sumatoriaparaids;
		}
		
		$objDatosSBCAux = new DatPagoResultados();
		$todosdatos = $objDatosSBCAux->obtenerTodos();
		
		$todosdatos->delete();
      
	    //AQUI HAY QUE PONERLE PARA QUE BUSQUE EN EL REPORTE INDIVIDUAL Y EN EL COLECTIVO
		foreach($arrayfinalSBC as $csbc=>$arrpersonasbc){
		  $objDatosSBC = new DatPagoResultados();
		  $objDatosSBC->sbct = $arrpersonasbc['sbct'];
		  $objDatosSBC->idpersona = $arrpersonasbc['idpersona'];
		  $objDatosSBC->evalindividual = $arrpersonasbc['evalindiv'];
		  $objDatosSBC->evalarea = $arrpersonasbc['evalcolec'];
		  $objDatosSBC->cpd = $arrpersonasbc['cpd'];
		  $objDatosSBC->sbctcpd = $arrpersonasbc['sbcxcpd'];
		  $objDatosSBC->ids = $arrpersonasbc['ids'];
		  //print_r($objDatosSBC);die;
		  $objDatosSBC->save();
		}
		echo(json_encode("Ok"));
	}
	
	public function obtenerDatosEvaluaciones($idpersona, $tipoconreporte){
	   //Obtener la evaluacion de la persona
	   $sqlDatoEvaluacionPersona = "select dvar.valor from mod_nomina.dat_variableselementosreportescertificaciones dvar 
		  		   inner join mod_nomina.dat_elementosreportescertificaciones datel on (datel.idelementosreportescertificaciones = dvar.idelementosreportescertificaciones)
		  		   inner join mod_nomina.dat_reportescertificaciones datrep on (datrep.idreportescertificaciones = datel.idreportescertificaciones)
		  		   inner join mod_nomina.conf_tiporeportescertificaciones ctrep on (ctrep.idconfreportescertificaciones = datrep.idconfreportescertificaciones)
		  		   where datel.idelemento=? and ctrep.deresultados = ?;";
				   $mg = Doctrine_Manager::getInstance();
				   $conn = $mg->getCurrentConnection();
				   $arrdatoevaluacionpersona = $conn->fetchAll($sqlDatoEvaluacionPersona, array($idpersona, $tipoconreporte));
	   $evaluacionpersona = $arrdatoevaluacionpersona[0]['valor'];
	   if(count($arrdatoevaluacionpersona)>0){
	    return $evaluacionpersona;
	   }else{
	    return 0;
	   }
	}	
	
	public function actualizarReportePagoPorResultadosECASAAction(){
	   //monto a repartir
	   $SRD = $this->_request->getPost('montototal');
	   $perfilseguridad = $this->global->Perfil;
	   $usuario = $perfilseguridad->idusuario;
	   $identidad = $this->_request->getPost('identidad');
	   $objDatPagoResultados = new DatPagoResultados();
	   //Obteniendo los datos de las personas para calcularles el ctr
	   $arraydatos = $objDatPagoResultados->getforLimitAndStart(10000, 0);
	   $suma = 0;
	   foreach($arraydatos as $cpr=>$pres){
	     $arraydatos[$cpr]['ctrt'] = $SRD * $arraydatos[$cpr]['ids'];
		 $objDomain = $objDatPagoResultados->obtenerDatPagoResultadosDadoId($pres['idpagoresultado']);
		 $objDomain->ctrt = $arraydatos[$cpr]['ctrt'];
		 $objDomain->save();
		 $suma += $arraydatos[$cpr]['ctrt']; 
	   }
	  //Salvando en los reportes
	  $objConfReporte = new ConfReportesCertificaciones();
	  //idconfiguracion del reporte
	  $idconfreporte = $objConfReporte->obtenerIdReportesCertificacionesdadoEsResultado();
	  $sqlIdVariableConfReporte = "select cvar.idvariablesconfreportescertificaciones, cvar.tipovariable from mod_nomina.conf_variablestiporeportescertificaciones cvar 
		  		   inner join mod_nomina.conf_tiporeportescertificaciones confr on (confr.idconfreportescertificaciones = cvar.idconfreportescertificaciones)
		  		   where confr.idconfreportescertificaciones = ?;";
				   $mg = Doctrine_Manager::getInstance();
				   $conn = $mg->getCurrentConnection();
				   $arridvariableconfreporte = $conn->fetchAll($sqlIdVariableConfReporte, array($idconfreporte));
      //id de la variable de la configuracion del reporte
	  
	  $idvariablesconfreportescertificaciones = $arridvariableconfreporte[0]['idvariablesconfreportescertificaciones'];
	  //Recorriendo el salario por resultados para armar el reporte;
	  $datReporte = new DatReportesCertificaciones();
	  $datReporte->idconfreportescertificaciones = $idconfreporte;
	  $fechaactual = date('d/m/Y');
	  $datReporte->fechainicio = $fechaactual;
	  $datReporte->fechafin = $fechaactual;
	  $datReporte->estado = 1;
	  $datReporte->identidad = $identidad;
	  $datReporte->idusuario = $usuario;
	  $datReporte->save();
	  $idreportecert = $datReporte->idreportescertificaciones;
	  //print_r($idreportecert);die;
	  foreach($arraydatos as $cont=>$arr){
	    //Elementos del reporte
		$datElementosReportes = new DatElementosReportesCertificaciones();
	    $datElementosReportes->idreportescertificaciones = $idreportecert;
	    $datElementosReportes->idelemento = $arr['idpersona'];
	    $datElementosReportes->aprobado = 0;
	    $datElementosReportes->save();
	    $idelemento = $datElementosReportes->idelementosreportescertificaciones;
		foreach($arridvariableconfreporte as $ivar=>$rvar){
		  
		  //Variables del reporte
		  $datVariableElemento = new DatVariablesElementosReportesCertificaciones();
		  if($rvar['tipovariable'] == 7){
		    //Salvando los valores
			//print_r($rvar);die;
		    $datVariableElemento->idelementosreportescertificaciones = $idelemento;
		    $datVariableElemento->idvariablesconfreportescertificaciones = $rvar['idvariablesconfreportescertificaciones'];
		    $datVariableElemento->valor = $arr['sbct'];
		    $datVariableElemento->save();
	      }else if($rvar['tipovariable'] == 8){
		    //Salvando los valores
		    $datVariableElemento->idelementosreportescertificaciones = $idelemento;
		    $datVariableElemento->idvariablesconfreportescertificaciones = $rvar['idvariablesconfreportescertificaciones'];
		    $datVariableElemento->valor = $arr['evalarea'];
		    $datVariableElemento->save();
	      }else if($rvar['tipovariable'] == 9){
		    //Salvando los valores
		    $datVariableElemento->idelementosreportescertificaciones = $idelemento;
		    $datVariableElemento->idvariablesconfreportescertificaciones = $rvar['idvariablesconfreportescertificaciones'];
		    $datVariableElemento->valor = $arr['evalindividual'];
		    $datVariableElemento->save();
	      }else if($rvar['tipovariable'] == 10){
		    //Salvando los valores
		    $datVariableElemento->idelementosreportescertificaciones = $idelemento;
		    $datVariableElemento->idvariablesconfreportescertificaciones = $rvar['idvariablesconfreportescertificaciones'];
		    $datVariableElemento->valor = $arr['cpd'];
		    $datVariableElemento->save();
	      }else if($rvar['tipovariable'] == 11){
		    //Salvando los valores
		    $datVariableElemento->idelementosreportescertificaciones = $idelemento;
		    $datVariableElemento->idvariablesconfreportescertificaciones = $rvar['idvariablesconfreportescertificaciones'];
		    $datVariableElemento->valor = $arr['sbctcpd'];
		    $datVariableElemento->save();
	      }else if($rvar['tipovariable'] == 12){
		    //Salvando los valores
		    $datVariableElemento->idelementosreportescertificaciones = $idelemento;
		    $datVariableElemento->idvariablesconfreportescertificaciones = $rvar['idvariablesconfreportescertificaciones'];
		    $datVariableElemento->valor = $arr['ids'];
		    $datVariableElemento->save();
	      }else if($rvar['tipovariable'] == 13){
		    //Salvando los valores
		    $datVariableElemento->idelementosreportescertificaciones = $idelemento;
		    $datVariableElemento->idvariablesconfreportescertificaciones = $rvar['idvariablesconfreportescertificaciones'];
		    $datVariableElemento->valor = $arr['ctrt'];
		    $datVariableElemento->save();
	      }
		}
      }
	
	  $objreturn->sumacontrol = $suma;
	  $objreturn->controldiferencia = $SRD-$suma;
	  echo(json_encode($objreturn)); 
	}
	
	public function modificardatosSBCAction(){
	    $iddatossbc = $this->_request->getPost('iddatossbc');
	    $idpersona = $this->_request->getPost('idpersona');
	    $sbc1 = $this->_request->getPost('sbc1');
	    $sbc2 = $this->_request->getPost('sbc2');
	    $sbc3 = $this->_request->getPost('sbc3');
	    $descripcion = $this->_request->getPost('descripcion');
		//Salvando los SBC
		$datdatossbc = Doctrine::getTable('DatDatosSBC')->find($iddatossbc);
		$datdatossbc->sbc1 = $sbc1;
		$datdatossbc->sbc2 = $sbc2;
		$datdatossbc->sbc3 = $sbc3;
		$datdatossbc->sbct = $sbc1 + $sbc2 + $sbc3;
		$datdatossbc->save();
		//Dejando las trazas
		$objDatDesaprobarNominaTraza = new DatDesaprobarNominaTraza();
		$perfilseguridad = $this->global->Perfil;  
		$objDatDesaprobarNominaTraza->descripcion = $descripcion;
	    $objDatDesaprobarNominaTraza->usuario = $perfilseguridad->usuario;
	    $objDatDesaprobarNominaTraza->accion = 'cambio sbc';
	    $objDatDesaprobarNominaTraza->nombreapellidos = $perfilseguridad->nombre.' '.$perfilseguridad->apellidos;
	    $objDatDesaprobarNominaTraza->save();
		echo json_encode("Ok");
	}
	
}
