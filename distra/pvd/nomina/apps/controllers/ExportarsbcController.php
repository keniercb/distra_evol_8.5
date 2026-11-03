<?php
$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
require($dir_www . '/pvd/comun/recursos/fpdf/fpdf.php');

class ExportarsbcController extends ZendExt_Controller_Secure {
    
    public function init() {
        parent::init();
    }
    
    public function exportarsbcAction() {
	   	$this->render();
    }
	
	public function cargarSalariosBaseCalculoAction(){
	   $start = $this->_request->getPost('start');
	   $limit = $this->_request->getPost('limit');
	   $textoabuscar = $this->_request->getPost('textoabuscar');
	   $areas = json_decode(stripslashes($this->_request->getPost('plantillas')));
	   //con estos id buscarlos en la tabla mod_nomina.dat_datossbc y  las personas y llenar el grid
	   $objDatSBC = new DatDatosSBC();
	   $arrayareaSBC=array();
	   $contarrayareaSBC=0;
	   foreach($areas as $cont=>$valor){
		$arrayareaSBC[$contarrayareaSBC] = $objDatSBC->getforIdarea($valor,$limit, $start, $textoabuscar);
		$contarrayareaSBC++;
	   }
	   $contadorarrayfinal = 0;
	   $arrayfinal = array();
	  foreach($arrayareaSBC as $contsbc=>$valorsbc){
		 foreach($valorsbc as $k=>$v){
			$arrayfinal[$contadorarrayfinal]= $v;
			$sqlDatosPersona = "select dp.nombre, dp.snombre, dp.papel, dp.sapel from mod_persona.dat_persona dp 
		           where dp.idpersona = ?;";
				   $mg = Doctrine_Manager::getInstance();
				   $conn = $mg->getCurrentConnection();
			 $arrdatpersona = $conn->fetchAll($sqlDatosPersona, array($v['idpersona']));
			 $nombreapp = $arrdatpersona[0]['nombre']." ".$arrdatpersona[0]['snombre']." ".$arrdatpersona[0]['papel']." ".$arrdatpersona[0]['sapel'];
			 $arrayfinal[$contadorarrayfinal]['nombreyapellidos'] = $nombreapp;
			$contadorarrayfinal++;
		 }
	  }
	    echo Zend_Json::encode(array('datos' => $arrayfinal, 'cantidad' => count($arrayfinal)));
	}    
    
    public function exportarSalarioBaseCalculoAction(){
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
				   where elabpag.idelaborarpagos = ?;";
				   $mg = Doctrine_Manager::getInstance();
				   $conn = $mg->getCurrentConnection();
				   $arrdatnomina = $conn->fetchAll($sqlNomina, array($value));
		    foreach($arrdatnomina as $cont=>$val){
			    $arrValores = unserialize($val['valores']);
				   foreach($arrValores as $contvalores=>$valores){
				     $arraydatosSBC[$contSBC] = $valores;
				   	 $contSBC++;
				   }
			}
		}

		$arrayfinalid = array();
		$arrayfinalSBC = array();
		$contadorSBC = 0;
		foreach($arraydatosSBC as $cosbc=>$arrasbc){
		  if (in_array($arrasbc['id'], $arrayfinalid)) {
			 $posc=array_keys($arrayfinalid,$arrasbc['id']);
			 $posc=$posc[0];
			 $arrayfinalSBC[$posc]['sbc'] =$arrayfinalSBC[$posc]['sbc'].'_'.$arrasbc['c'.$arrEstructuraNomina[0]['idestructuramodelodomina']];
		  }else{
		   $a = explode('-',$arrasbc['id']);
		   $idsPersonas = $a[0];
		   $arrayfinalSBC[$contadorSBC]['idpersona'] = $idsPersonas;
		   $arrayfinalSBC[$contadorSBC]['sbc'] = number_format($arrasbc['c'.$arrEstructuraNomina[0]['idestructuramodelodomina']], 2, '.', '');
		   $contadorSBC++;
			array_push($arrayfinalid,$arrasbc['id']);
		  }
		}
		$objDatosSBCAux = new DatDatosSBC();
		$todosdatos = $objDatosSBCAux->obtenerTodos();
		$todosdatos->delete();
      
	    $arrayresultados = array();
	    $contarrayresultados = 0;
		for($i=0; $i<count($arrayfinalSBC); $i++){
		  for($j=$i+1; $j<count($arrayfinalSBC); $j++){
		    if($arrayfinalSBC[$i]['idpersona'] == $arrayfinalSBC[$j]['idpersona']){
			  $arrayfinalSBC[$i]['sbc'] = $arrayfinalSBC[$i]['sbc'].'_'.$arrayfinalSBC[$j]['sbc'];
			  unset($arrayfinalSBC[$j]);
			  $arrayfinalSBC = array_values($arrayfinalSBC);
			  $arrayresultados[$contarrayresultados] = $arrayfinalSBC[$i]['idpersona'];
			  $contarrayresultados++;
			}
		  }
		}
		$contfinalDatosSBC =0;
		$arrayfinalDatosSBC = array();
		
		foreach($arrayfinalSBC as $csbc=>$arrpersonasbc){

		  $arrsbc = explode('_',$arrpersonasbc['sbc']);
		  $sbc1 = $arrsbc[0];
		  $sbc2 = $arrsbc[1];
		  $sbc3 = $arrsbc[2];
		  $sbct = $sbc1 + $sbc2 + $sbc3;
		  
		  //Evaluaciones individual de la persona
		  $sqlDatoEvaluacionPersona = "select dvar.valor from mod_nomina.dat_variableselementosreportescertificaciones dvar 
		  		   inner join mod_nomina.dat_elementosreportescertificaciones datel on (datel.idelementosreportescertificaciones = dvar.idelementosreportescertificaciones)
		  		   inner join mod_nomina.dat_reportescertificaciones datrep on (datrep.idreportescertificaciones = datel.idreportescertificaciones)
		  		   inner join mod_nomina.conf_tiporeportescertificaciones ctrep on (ctrep.idconfreportescertificaciones = datrep.idconfreportescertificaciones)
		  		   where datel.idelemento=? and ctrep.deresultados = 5;";
				   $mg = Doctrine_Manager::getInstance();
				   $conn = $mg->getCurrentConnection();
				   $arrdatoevaluacionpersona = $conn->fetchAll($sqlDatoEvaluacionPersona, array($arrpersonasbc['idpersona']));
	      $evaluacionpersona = $arrdatoevaluacionpersona[0]['valor'];
		  
		  $sqlDatoEvaluacionAreaPersona = "select dvar.valor from mod_nomina.dat_variableselementosreportescertificaciones dvar 
		  		   inner join mod_nomina.dat_elementosreportescertificaciones datel on (datel.idelementosreportescertificaciones = dvar.idelementosreportescertificaciones)
		  		   inner join mod_nomina.dat_reportescertificaciones datrep on (datrep.idreportescertificaciones = datel.idreportescertificaciones)
		  		   inner join mod_nomina.conf_tiporeportescertificaciones ctrep on (ctrep.idconfreportescertificaciones = datrep.idconfreportescertificaciones)
		  		   where datel.idelemento=? and ctrep.deresultados = 6;";
				   $mg = Doctrine_Manager::getInstance();
				   $conn = $mg->getCurrentConnection();
				   $arrdatoevaluacionareapersona = $conn->fetchAll($sqlDatoEvaluacionAreaPersona, array($arrpersonasbc['idpersona']));
	      $evaluacionareapersona = $arrdatoevaluacionareapersona[0]['valor'];
		  if(count($evaluacionareapersona)>0){
		              //print_r($evaluacionareapersona);die;
					  //$objDatosSBC->evalcolectiva = $evaluacionareapersona;
					  $arrayfinalDatosSBC[$contfinalDatosSBC]['evalcolectiva']= $evaluacionareapersona;
		  }else{
					$evaluacionareapersona=0;
					   $arrayfinalDatosSBC[$contfinalDatosSBC]['evalcolectiva']= $evaluacionareapersona;
		  }
		  if(count($evaluacionpersona)>0){
		              //print_r($evaluacionpersona);die;
					  //$objDatosSBC->evalindividual = $evaluacionpersona;
					 
						$arrayfinalDatosSBC[$contfinalDatosSBC]['evalindividual']= $evaluacionpersona;
				
					  
		  }else
		  {
					 $evaluacionpersona=0;
					 $arrayfinalDatosSBC[$contfinalDatosSBC]['evalindividual']= $evaluacionpersona;	
		  }
          $area = DatCargosOcupadosModel::buscarAreaPersona($arrpersonasbc['idpersona']);
		  if(count($area)>0){
				 $arrayfinalDatosSBC[$contfinalDatosSBC]['idarea']= $area[0]['idarea'];
		  }else{
				  $arrayfinalDatosSBC[$contfinalDatosSBC]['idarea']= null;
		  }
		 
		  /*$objDatosSBC->sbct = $sbct;
		  $objDatosSBC->idpersona = $arrpersonasbc['idpersona'];
		  $objDatosSBC->sbc1 = ($sbc1!="" || $sbc1!=null)?$sbc1:0;
		  $objDatosSBC->sbc2 = ($sbc2!="" || $sbc2!=null)?$sbc2:0;
		  $objDatosSBC->sbc3 = ($sbc3!="" || $sbc3!=null)?$sbc3:0;*/
		  $arrayfinalDatosSBC[$contfinalDatosSBC]['sbct']= $sbct;
		  $arrayfinalDatosSBC[$contfinalDatosSBC]['idpersona']= $arrpersonasbc['idpersona'];
		  $arrayfinalDatosSBC[$contfinalDatosSBC]['sbc1']= ($sbc1!="" || $sbc1!=null)?$sbc1:0;
		  $arrayfinalDatosSBC[$contfinalDatosSBC]['sbc2']= ($sbc2!="" || $sbc2!=null)?$sbc2:0;
		  $arrayfinalDatosSBC[$contfinalDatosSBC]['sbc3']= ($sbc3!="" || $sbc3!=null)?$sbc3:0;
		  $arrayfinalDatosSBC[$contfinalDatosSBC]['multipicacionindicadores']= $sbct * $evaluacionpersona * $evaluacionareapersona;
		  $contfinalDatosSBC++;
		  //$objDatosSBC->save();
		}
		//print_r($arrayfinalDatosSBC);die;
		for($i=0; $i<count($arrayfinalDatosSBC); $i++){
		  $sumaarea = 0;
		  for($j=0; $j<count($arrayfinalDatosSBC); $j++){
		    if($arrayfinalDatosSBC[$i]['idarea'] == $arrayfinalDatosSBC[$j]['idarea']){
				if($arrayfinalDatosSBC[$j]['evalindividual'] >= 60){
					$sumaarea = $sumaarea + $arrayfinalDatosSBC[$j]['multipicacionindicadores'];
				}
				
			}
		  }
		  if($arrayfinalDatosSBC[$i]['evalindividual'] >= 60){
					 $arrayfinalDatosSBC[$i]['ids'] = ($arrayfinalDatosSBC[$i]['multipicacionindicadores']/$sumaarea)?$arrayfinalDatosSBC[$i]['multipicacionindicadores']/$sumaarea:0;
				}
		 
		}
		//print_r($arrayfinalDatosSBC);die;
		foreach($arrayfinalDatosSBC as $k=>$v){
		//print_r($v);die;
			 $objDatosSBC = new DatDatosSBC();
			 $objDatosSBC->sbct = $v['sbct'];
			 $objDatosSBC->idpersona = $v['idpersona'];
			 $objDatosSBC->sbc1 = $v['sbc1'];
			 $objDatosSBC->sbc2 = $v['sbc2'];
			 $objDatosSBC->sbc3 = $v['sbc3'];
			 $objDatosSBC->ids = $v['ids'];
			 $objDatosSBC->evalindividual = $v['evalindividual'];
			 $objDatosSBC->evalcolectiva = $v['evalcolectiva'];
			 if(!$v['idarea']==null){
				$objDatosSBC->idarea = $v['idarea'];
			 }
			 //print_r($v['idarea']);die;
			 if($v['evalindividual'] >= 60){ $objDatosSBC->save();}
			
			 
		}
		
		echo(json_encode("Ok"));
	}
	
	
	function exp_to_dec($float_str)
	{
		$float_str = (string)((float)($float_str));

		
		if(($pos = strpos(strtolower($float_str), 'e')) !== false)
		{
			// get either side of the E, e.g. 1.6E+6 => exp E+6, num 1.6
			$exp = substr($float_str, $pos+1);
			$num = substr($float_str, 0, $pos);
		   
			// strip off num sign, if there is one, and leave it off if its + (not required)
			if((($num_sign = $num[0]) === '+') || ($num_sign === '-')) $num = substr($num, 1);
			else $num_sign = '';
			if($num_sign === '+') $num_sign = '';
		   
			// strip off exponential sign ('+' or '-' as in 'E+6') if there is one, otherwise throw error, e.g. E+6 => '+'
			if((($exp_sign = $exp[0]) === '+') || ($exp_sign === '-')) $exp = substr($exp, 1);
			else trigger_error("Could not convert exponential notation to decimal notation: invalid float string '$float_str'", E_USER_ERROR);
		   
			// get the number of decimal places to the right of the decimal point (or 0 if there is no dec point), e.g., 1.6 => 1
			$right_dec_places = (($dec_pos = strpos($num, '.')) === false) ? 0 : strlen(substr($num, $dec_pos+1));
			// get the number of decimal places to the left of the decimal point (or the length of the entire num if there is no dec point), e.g. 1.6 => 1
			$left_dec_places = ($dec_pos === false) ? strlen($num) : strlen(substr($num, 0, $dec_pos));
		   
			// work out number of zeros from exp, exp sign and dec places, e.g. exp 6, exp sign +, dec places 1 => num zeros 5
			if($exp_sign === '+') $num_zeros = $exp - $right_dec_places;
			else $num_zeros = $exp - $left_dec_places;
		   
			// build a string with $num_zeros zeros, e.g. '0' 5 times => '00000'
			$zeros = str_pad('', $num_zeros, '0');
		   
			// strip decimal from num, e.g. 1.6 => 16
			if($dec_pos !== false) $num = str_replace('.', '', $num);
		   
			// if positive exponent, return like 1600000
			if($exp_sign === '+') return $num_sign.$num.$zeros;
			// if negative exponent, return like 0.0000016
			else return $num_sign.'0.'.$zeros.$num;
		}
    // otherwise, assume already in decimal notation and return
		else return $float_str;
	}

	public function actualizarReportePagoPorResultadosAction(){
	   //monto a repartir por areas
	   $SRD = json_decode(stripslashes($this->_request->getPost('montototal')));//$this->_request->getPost('montototal');
	 

	   $perfilseguridad = $this->global->Perfil;
	   $usuario = $perfilseguridad->idusuario;
	   $identidad = $this->_request->getPost('identidad');
	   $objDatSBC = new DatDatosSBC();
	   //Obteniendo los datos de las personas con su sbct
	   $arraydatossbc = $objDatSBC->getforLimitAndStart(10000, 0);
	  
	   $contarrayFinal = 0;
	   $arrayFinal = array();
	   foreach($SRD as $k=>$v){
		foreach($arraydatossbc as $cont=>$val){
			if($v->idarea==$val['idarea']){
				$arrayFinal[$contarrayFinal]= $val;
				$arrayFinal[$contarrayFinal]['ctrt']= $val['ids'] * $v->monto;
				$objDatosSBC =DatDatosSBC::obtenerBaseDatDatosSBCDadoId($val['iddatossbc']);
				$objDatosSBC->ctrt = $val['ids'] * $v->monto;
				$objDatosSBC->save();
				 $contarrayFinal++;
			}
		}	
	   }
	   $suma = array();
	   
		   foreach($arrayFinal as $q=>$w){
			   $suma[$w['idarea']]= $w['ctrt'] + $suma[$w['idarea']];
		   }
		$diferencia = array();
		$contdiferencia = 0;	
		   foreach($SRD as $o => $p){
			   if(($p->monto - $suma[$p->idarea])>0){
				  // print_r($suma[$p->idarea]);die;
				  $valor=$p->monto - $suma[$p->idarea];
				   $diferencia[$contdiferencia]['diferencia'] = $this->exp_to_dec($valor);
				   $diferencia[$contdiferencia]['idarea'] = $p->idarea;
				   $diferencia[$contdiferencia]['area'] = $p->area;
				   $diferencia[$contdiferencia]['monto'] = $p->monto;
				   $diferencia[$contdiferencia]['montorepartido'] = $suma[$p->idarea];
			   }
		   }
		//print_r($diferencia);die;
	   /*
	   //Array de CPD de cada persona. Las posiciones coinciden con las del array de sbct
	   $arraydatosCPD = array();
	   $contarraydatosCPD = 0;
	   foreach($arraydatossbc as $csbc=>$rsbc){
	     //Obtener la evaluacion de la persona
		 $sqlDatoEvaluacionPersona = "select dvar.valor from mod_nomina.dat_variableselementosreportescertificaciones dvar 
		  		   inner join mod_nomina.dat_elementosreportescertificaciones datel on (datel.idelementosreportescertificaciones = dvar.idelementosreportescertificaciones)
		  		   inner join mod_nomina.dat_reportescertificaciones datrep on (datrep.idreportescertificaciones = datel.idreportescertificaciones)
		  		   where datrep.idconfreportescertificaciones = 36 and datel.idelemento=?;";
				   $mg = Doctrine_Manager::getInstance();
				   $conn = $mg->getCurrentConnection();
				   $arrdatoevaluacionpersona = $conn->fetchAll($sqlDatoEvaluacionPersona, array($rsbc['idpersona']));
		 $evaluacionpersona = $arrdatoevaluacionpersona[0]['valor'];
		 //Calculando el CPD de cada persona
		 $CPD = (($evaluacionpersona - 50)/50) * 4;
		 if($CPD>0){
		 $arraydatosCPD[$contarraydatosCPD]['idpersona'] = $rsbc['idpersona'];
		 $arraydatosCPD[$contarraydatosCPD]['cpd'] = $CPD;
		 $contarraydatosCPD++;
		 }
	   }
	    //Sumatoria de la multiplicacion de los SBCt y los CPD
	   $sumatoriaSBCtotalxCPD = 0;
	   //Recorriendo el array de CPD para calcular la sumatoria (SBCTt   x  CPDt)
	   $arrayaux = array();
	   $contarrayaux = 0;
	   foreach($arraydatosCPD as $ccpd=>$rcpd){
	    $multiplicacion = 0;
		foreach($arraydatossbc as $csbc=>$arrsbct){
		 if($arrsbct['idpersona'] == $rcpd['idpersona']){
		     $multiplicacion = $rcpd['cpd']*$arrsbct['sbct'];
			 $arrayaux[$contarrayaux]['idpersona']=$rcpd['idpersona'];
			 $arrayaux[$contarrayaux]['cpd']=$rcpd['cpd'];
			 $arrayaux[$contarrayaux]['sbct']=$arrsbct['sbct'];
			 $arrayaux[$contarrayaux]['multiplicacion']=$multiplicacion;
			 $contarrayaux++;
		 }
		}
		
		$sumatoriaSBCtotalxCPD += $multiplicacion;
	   }
	   //Sumatoria de la multiplicacion de los SBCt y los CPD
	   $IDS = 0;
	   $arraysalarioporresultados = array();
	   $contarraysalarioporresultados = 0;
	   //Recorriendo el array de CPD para calcular la sumatoria (SBCTt   x  CPDt)
	   $arrayIDS = array();
	   $countarrayIDS = 0;
	   foreach($arraydatosCPD as $ccpdaux=>$rcpdaux){
	    $IDS = 0;
		foreach($arraydatossbc as $csbc=>$arrsbct){
		 if($arrsbct['idpersona'] == $rcpdaux['idpersona']){
		    $IDS = number_format(($rcpdaux['cpd']*$arrsbct['sbct'])/$sumatoriaSBCtotalxCPD, 9, '.', '');
			$arrayIDS[$countarrayIDS]['IDS'] = $IDS;
			$countarrayIDS++;
		 }
		}
		//Salario a cobrar por cada trabajador
		$CRT = round($SRD*$IDS,2);
		if($CRT>0){
		$arraysalarioporresultados[$contarraysalarioporresultados]['idpersona'] = $rcpdaux['idpersona'];
		$arraysalarioporresultados[$contarraysalarioporresultados]['crt'] = $CRT;
		$contarraysalarioporresultados++;
		}
	   }
	  // print_r($arraysalarioporresultados);die;
	  $suma=0; 
	  //Suma de control
	  foreach($arraysalarioporresultados as $cont=>$arr){
	    $suma += $arr['crt'];
	  }
	  //Control de diferencias
	  $controldiferencia = round($SRD - $suma,2);
	  */
	  $objConfReporte = new ConfReportesCertificaciones();
	  //idconfiguracion del reporte
	  $idconfreporte = $objConfReporte->obtenerIdReportesCertificacionesdadoEsResultado();
	  //print_r($idconfreporte);die;
	 /** $sqlIdVariableConfReporte = "select cvar.idvariablesconfreportescertificaciones from mod_nomina.conf_variablestiporeportescertificaciones cvar 
		  		   inner join mod_nomina.conf_tiporeportescertificaciones confr on (confr.idconfreportescertificaciones = cvar.idconfreportescertificaciones)
		  		   where confr.idconfreportescertificaciones = ?;";
				   $mg = Doctrine_Manager::getInstance();
				   $conn = $mg->getCurrentConnection();
				   $arridvariableconfreporte = $conn->fetchAll($sqlIdVariableConfReporte, array($idconfreporte));*/
		$ConfVariablesReportesCertificaciones = new ConfVariablesReportesCertificaciones();		   
	 $arridvariableconfreporte = $ConfVariablesReportesCertificaciones->getVariableconfiguracionreporte($idconfreporte);
	 
	 //print_r($arrayFinal);die;
      //id de la variable de la configuracion del reporte
	  //$idvariablesconfreportescertificaciones = $arridvariableconfreporte[0]['idvariablesconfreportescertificaciones'];
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
	  foreach($arrayFinal as $cont=>$arr){
	    //Elementos del reporte
		//print_r($arrayFinal);die;
		if($arr['ctrt']>0){
			$datElementosReportes = new DatElementosReportesCertificaciones();
			$datElementosReportes->idreportescertificaciones = $idreportecert;
			$datElementosReportes->idelemento = $arr['idpersona'];
			$datElementosReportes->aprobado = 0;
			$datElementosReportes->save();
			$idelemento = $datElementosReportes->idelementosreportescertificaciones;
			//Variables sbc1 del reporte
			foreach($arridvariableconfreporte as $i=>$rvarctr){
				 if($rvarctr['tipovariable'] == 8){
					$datVariableElemento = new DatVariablesElementosReportesCertificaciones();
					$datVariableElemento->idelementosreportescertificaciones = $idelemento;
					$datVariableElemento->idvariablesconfreportescertificaciones = $rvarctr['idvariablesconfreportescertificaciones'];
					$datVariableElemento->valor = $arr['sbc1'];
					$datVariableElemento->save();
				 }else if($rvarctr['tipovariable'] == 9){
					$datVariableElemento = new DatVariablesElementosReportesCertificaciones();
					$datVariableElemento->idelementosreportescertificaciones = $idelemento;
					$datVariableElemento->idvariablesconfreportescertificaciones = $rvarctr['idvariablesconfreportescertificaciones'];
					$datVariableElemento->valor = $arr['sbc2'];
					$datVariableElemento->save();
				 } else if($rvarctr['tipovariable'] == 10){
					$datVariableElemento = new DatVariablesElementosReportesCertificaciones();
					$datVariableElemento->idelementosreportescertificaciones = $idelemento;
					$datVariableElemento->idvariablesconfreportescertificaciones = $rvarctr['idvariablesconfreportescertificaciones'];
					$datVariableElemento->valor = $arr['sbc3'];
					$datVariableElemento->save();
				 }else if($rvarctr['tipovariable'] == 11){
					$datVariableElemento = new DatVariablesElementosReportesCertificaciones();
					$datVariableElemento->idelementosreportescertificaciones = $idelemento;
					$datVariableElemento->idvariablesconfreportescertificaciones = $rvarctr['idvariablesconfreportescertificaciones'];
					$datVariableElemento->valor = $arr['sbct'];
					$datVariableElemento->save();
				 } else if($rvarctr['tipovariable'] == 12){
					$datVariableElemento = new DatVariablesElementosReportesCertificaciones();
					$datVariableElemento->idelementosreportescertificaciones = $idelemento;
					$datVariableElemento->idvariablesconfreportescertificaciones = $rvarctr['idvariablesconfreportescertificaciones'];
					$datVariableElemento->valor = $arr['evalindividual'];
					$datVariableElemento->save();
				 }else if($rvarctr['tipovariable'] == 13){
					$datVariableElemento = new DatVariablesElementosReportesCertificaciones();
					$datVariableElemento->idelementosreportescertificaciones = $idelemento;
					$datVariableElemento->idvariablesconfreportescertificaciones = $rvarctr['idvariablesconfreportescertificaciones'];
					$datVariableElemento->valor = $arr['evalcolectiva'];
					$datVariableElemento->save();
				 }else if($rvarctr['tipovariable'] == 14){
					$datVariableElemento = new DatVariablesElementosReportesCertificaciones();
					$datVariableElemento->idelementosreportescertificaciones = $idelemento;
					$datVariableElemento->idvariablesconfreportescertificaciones = $rvarctr['idvariablesconfreportescertificaciones'];
					$datVariableElemento->valor = $arr['ids'];
					$datVariableElemento->save();
				 }else if($rvarctr['tipovariable'] == 15){
					$datVariableElemento = new DatVariablesElementosReportesCertificaciones();
					$datVariableElemento->idelementosreportescertificaciones = $idelemento;
					$datVariableElemento->idvariablesconfreportescertificaciones = $rvarctr['idvariablesconfreportescertificaciones'];
					$datVariableElemento->valor = $arr['ctrt'];
					$datVariableElemento->save();
				 }
		}
		
		}
		
		
	   // print_r($arraysalarioporresultados);die;
	  }
	if(count($diferencia)>0){
		//$objreturn->sumacontrol = $diferencia;
		echo Zend_Json::encode(array('sumacontrol'=>$diferencia));
	}else 
	   // $objreturn->sumacontrol = 0;
	   	echo Zend_Json::encode(array('sumacontrol'=>0));
	
	}
	
	public function modificarSBCAction(){
	    $iddatossbc = $this->_request->getPost('iddatossbc');
	    $idpersona = $this->_request->getPost('idpersona');
	    $sbc1 = $this->_request->getPost('sbc1');
	    $sbc2 = $this->_request->getPost('sbc2');
	    $sbc3 = $this->_request->getPost('sbc3');
	    $idarea = $this->_request->getPost('idarea');
	    $textoabuscar = '';
		
		
	    $descripcion = $this->_request->getPost('descripcion');
		//Salvando los SBC
		$datdatossbc = Doctrine::getTable('DatDatosSBC')->find($iddatossbc);
		$datdatossbc->sbc1 = $sbc1;
		$datdatossbc->sbc2 = $sbc2;
		$datdatossbc->sbc3 = $sbc3;
		$datdatossbc->sbct = $sbc1 + $sbc2 + $sbc3;
		$datdatossbc->save();
		
		//print_r($idarea);die;
		//cambiando ids del area de la persona modificada
		$DatDatosSBCT = new DatDatosSBC();
		$arrapersonasarea = $DatDatosSBCT->getforIdarea($idarea,$limite = 600, $inicio = 0, $textoabuscar);
		
		$suma=0;
		foreach($arrapersonasarea as $k=>$v){
			$arrapersonasarea[$k]['multiplicadores'] = $v['sbct'] * $v['evalindividual'] * $v['evalcolectiva'];
			$suma = $suma + $arrapersonasarea[$k]['multiplicadores'];
		}
		
		foreach($arrapersonasarea as $key=>$val){
			$datdatossbcn = Doctrine::getTable('DatDatosSBC')->find($val['iddatossbc']);
			//print_r($val['multiplicadores']/$suma);die;
			$datdatossbcn->ids = $val['multiplicadores']/$suma;
			$datdatossbcn->save();
		}
		
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
	
	public function obtenerAreasAction(){
	
	//Creando el modelo de negocio de nomenclador area.
        //$modeloArea = new NomAreasModel();
        $modeloArea = new DatDatosSBC();
        
        //Obteniendo el listado de areas.
        $arrArea = $modeloArea->obtenerTodasArea();

		//Obteniendo cantidad de areas.
		$cantarrArea =  $modeloArea->obtenerCantidadTodasArea();

        //Imprimiendo el listado de areas.
        echo Zend_Json::encode(array('datos'=>$arrArea,'cantidad'=>$cantarrArea));
	}
	
	public function getDatosPlantillaXTPAction(){
	
	//Creando el modelo de negocio de nomenclador area.
        $DatDatosSBCT = new DatDatosSBC();
        
        //Obteniendo cantidad de personas por areas.
        $cant = $DatDatosSBCT->getTotalCountforLimitAndStart();
		
		$total = $DatDatosSBCT->getforLimitAndStartPlantilla();
		$cont = 0;
		foreach($total as $k=>$v){
            if($v['evalcolectiva']>0){
				$cont++; 
			}
		}
		
		$toralareas = $DatDatosSBCT->obtenerTodasArea();
		foreach($toralareas as $q=>$w){
			$areasT = $DatDatosSBCT->getforIdarea($w['idarea']);
			$toralareas[$q]['cantidad']=count($areasT);
		}
		
	

        //Imprimiendo el listado de areas.
        echo Zend_Json::encode(array('datos'=>$cant,'ipc'=>$cont,'persAreas'=>$toralareas));
	}
	
}
