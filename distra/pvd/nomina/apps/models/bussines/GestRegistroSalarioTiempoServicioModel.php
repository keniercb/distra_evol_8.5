<?php

/**
 * Modelo de negocio para gestionar el registro de salario y tiempo de servicio.
 *
 * @author 1er Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Submayor.
 * @category Modelo de negocio
 * @uses GestRegistroSalarioTiempoServicioModel, (Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class GestRegistroSalarioTiempoServicioModel extends ZendExt_Model
{

    /**
     * Constructor de la clase.
     */
    public function GestRegistroSalarioTiempoServicioModel()
    {
        parent::ZendExt_Model();
    }

    public function obtenerListadoRegistroSalarioTiempoServicioPersona($idpersona, $idestructura, $start, $limit)
    {
        $cont = 0;
        $arrayreturn = array();
        $objMeses = new NomMes();
        $objNomina = new NomTipoNomina();
        $objConf = new ConfigRegistroSalarioTiempoServicio();
        $objDomain = new DatRegistroSalarioTiempoServicio();
        $arrayelementos = $objDomain->obtenerListadoDatRegistroSalario($idpersona, $idestructura, $start, $limit);
        foreach ($arrayelementos as $i => $value) {
            $arrayreturn[$cont]['idregistrosalariotiemposervicio'] = $value['idregistrosalariotiemposervicio'];
            $arrayreturn[$cont]['idpersona'] = $value['idpersona'];
            $arrayreturn[$cont]['anno'] = $value['anno'];
            $arrayreturn[$cont]['idmes'] = $value['idmes'];
            $denominacionmes = $objMeses->obtenerDenominacionXIdmes($value['idmes']);
            $arrayreturn[$cont]['mes'] = $denominacionmes;
            $arrayreturn[$cont]['diasacumulados'] = $value['diasacumulados'];
            $arrayreturn[$cont]['salariodevengado'] = $value['salariodevengado'];
            $arrayreturn[$cont]['idtiponomina'] = $value['idtiponomina'];
            $denominaciotiponomina = ($value['idtiponomina']) ? $objNomina->obtenerDenominacion($value['idtiponomina']) : '';
            $arrayreturn[$cont]['denominaciotiponomina'] = $denominaciotiponomina;
            $arrayreturn[$cont]['idestructura'] = $value['idestructura'];
            $arrayreturn[$cont]['idconfregistsalartiempservc'] = $value['idconfregistsalartiempservc'];
            $arrayreturn[$cont]['confregistsalartiempservc'] = $objConf->obtenerDenominacioDadoIdConf($value['idconfregistsalartiempservc']);
            $arrayreturn[$cont]['salariodevengadoreporte'] = $value['salariodevengadoreporte'];
            $arrayreturn[$cont]['registrotiponominamanual'] = $value['registrotiponominamanual'];
            $cont++;
        }
        return $arrayreturn;
    }

    public function adicionarRegistroSalario($idpersona, $anno, $mes, $diasacum, $salariodev, $idestructura, $idtiponomina)
    {
        $objDomain = new DatRegistroSalarioTiempoServicio();
        $objDomain->idpersona = $idpersona;
        $objDomain->anno = $anno;
        $objDomain->idmes = $mes;
        $objDomain->diasacumulados = $diasacum;
        $objDomain->salariodevengado = $salariodev;
        $objDomain->idestructura = $idestructura;
        $objDomain->idtiponomina = (is_numeric($idtiponomina))?$idtiponomina:null;;
        $objDomain->registrotiponominamanual = (is_numeric($idtiponomina))?1:0;
        $objDomain->save();
        return 'ok';
    }


    public function modificarRegistroSalario($idregistrosalario, $anno, $mes, $diasacum, $salariodev, $idtiponomina)
    {
        $obj = new DatRegistroSalarioTiempoServicio();
        $objDomain = $obj->obtenerObjDatRegistroSalarioTiempoServicio($idregistrosalario);
        $objDomain->anno = $anno;
        $objDomain->idmes = $mes;
        $objDomain->diasacumulados = $diasacum;
        $objDomain->salariodevengado = $salariodev;
        $objDomain->idtiponomina = (is_numeric($idtiponomina))?$idtiponomina:null;
        $objDomain->registrotiponominamanual = (is_numeric($idtiponomina))?1:0;
        $objDomain->save();
        return 'ok';
    }

    public function eliminarRegistroSalario($idregistrosalario)
    {
        $objDomain = new DatRegistroSalarioTiempoServicio();
        $objDelete = $objDomain->obtenerObjDatRegistroSalarioTiempoServicio($idregistrosalario);
        $objDelete->delete();
        return 'ok';
    }

    /**
     * @param $idpersona
     * @param $idestructura
     */
    public function exportarSNC225($idpersona, $idestructura, $tiporeporte, $annosexportar, $ordenannos)
    {
        //Objs de las clases del reporte en pdf y del domain
        $objReportePDF = new ReporteSNCpdfModel();
        $objReporteSNC09 = new ReporteSNC09Model();
        $objModel = new DatRegistroSalarioTiempoServicio();
        $objDatDatosCertificadosElaborarpago = new DatDatosCertificadosElaborarpago();
        $objConfigRegistroSalarioTiempoServicio = new ConfigRegistroSalarioTiempoServicio();
        $objConfVariable = new ConfVariablesReportesCertificaciones();
        //Datos registro salario de la persona en la entidad
        $orden = ($ordenannos == 1) ? 'ASC' : 'DESC';
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        if ($tiporeporte == 1) {
            $datosregistrosalario = $objModel->obtenerListadoDatRegistroSalarioOrdenadoAnnosMeses($idpersona, $idestructura);
            //Determinando el periodo de pago en cuestion, dado el identidad,tiponomina,mes y anno.
            foreach ($datosregistrosalario as $i => $item) {
                $mes = ($item['idmes'] < 10) ? '0' . $item['idmes'] : $item['idmes'];
                $finicio = '01/' . $mes . '/' . $item['anno'];
                $sql = "SELECT dep.idelaborarpagos
                            FROM mod_nomina.dat_elaborarpagos dep
                            INNER JOIN mod_nomina.conf_modelonomina mn ON (mn.idtipopago = dep.idtipopago)
                            WHERE dep.identidad = ? AND mn.idtiponomina = ? AND dep.fechainicioperiodo = '{$finicio}'::date";
                $idelaborarpagos = $conn->fetchOne($sql, array($idestructura, $item['idtiponomina']));
                $datosregistrosalario[$i]['idelaborarpagos'] = $idelaborarpagos;
            }
        } else {
            $datosregistrosalario = $objModel->obtenerListadoDatRegistroSalarioOrdenadoAnnosDESC($idpersona, $idestructura, $orden);
        }

        $arrAux = ConfigRegistroSalarioTiempoServicio::TodoConfigRegistroSalarioTiempoServicio();
        $variblesSNC = array();
        foreach ($arrAux as $var) {
            $variblesSNC[$var['idtiponomina']] = $var;
            $anotaciones = '';
            foreach ($var['ConfVarAuxSNC225'] as $anotacion) {
                if (!empty($anotacion['anotaciones'])) {
                    $anotaciones .= $anotacion['ConfVariablesReportesCertificaciones'][0]['denominacion'] .
                        ':' . $anotacion['anotaciones'] . '; ';
                    $variblesSNC[$var['idtiponomina']]['variablesreporte'][$anotacion['ConfVariablesReportesCertificaciones'][0]['idvariablesconfreportescertificaciones']] =
                        $anotacion['ConfVariablesReportesCertificaciones'][0]['denominacion'];
                }
            }
            $variblesSNC[$var['idtiponomina']]['anotaciones'] = trim($anotaciones, '; ');
            unset($variblesSNC[$var['idtiponomina']]['ConfVarAuxSNC225']);
        }

        //Agrupando eb un Obj por los annos trabajador
        $annoacanterior = 0;
        $cont = 0;
        $objagrupado = new stdClass();
        foreach ($datosregistrosalario as $i => $value) {
            $annoactual = $value['anno'];
            if ($i == 0) {
                $objagrupado->elementos[$value['anno']][$cont] = $value;
                $cont++;
            } else {
                if ($annoactual == $annoacanterior) {
                    $objagrupado->elementos[$value['anno']][$cont] = $value;
                    $cont++;
                } else {
                    $cont = 0;
                    $objagrupado->elementos[$value['anno']][$cont] = $value;
                    $cont++;
                }
            }
            $annoacanterior = $value['anno'];
        }

        //Recorriendo el obj con los annos agrupados para agrupar por meses
        $objFinal = null;
        $objagrupadoaux = array();
        if ($annosexportar != -1 && !empty($annosexportar)) {
            $objagrupadoaux[$annosexportar] = $objagrupado->elementos[$annosexportar];
            $objagrupado->elementos = $objagrupadoaux;
        }

        $contobj = 0;
        foreach ($objagrupado->elementos as $c => $ragrup) {
            $objFinal[$contobj]->anno = $ragrup[0]['anno'];
            foreach ($ragrup as $n => $annos) {
                $objFinal[$contobj]->meses['mes-' . $annos['idmes']][] = $annos;
            }
            $contobj++;
        }

        //Sumando los valores de los dias y el salario por meses
        foreach ($objFinal as $io => $robf) {
            foreach ($robf->meses as $im => $rm) {
                $diastrabajados = 0;
                $salariodevengado = 0;
                $leyenda = '';
                $var = array();
                $n = 1;
                $var[0][0] = $rm[0]['denominacion'];
                $var[0][1] = $rm[0]['denom'];
                foreach ($rm as $vm => $rvm) {
                    $diastrabajados += $rvm['diasacumulados'];
                    $salariodevengado += $rvm['salariodevengado'];
                    if (!empty($rvm['idtiponomina'])) {
                        $leyenda .= $variblesSNC[$rvm['idtiponomina']]['denominacion'] . ',';
                        if (!empty($variblesSNC[$rvm['idtiponomina']]['variablesreporte'])) {
                            $personasreporte = $objDatDatosCertificadosElaborarpago->obtenerDatosCertificadosSerializados($rvm['idelaborarpagos']);
                            $datosserializados = unserialize($personasreporte);
                            foreach ($variblesSNC[$rvm['idtiponomina']]['variablesreporte'] as $idvar => $variable) {
                                if($idvar){
                                    $confreporte = $objConfVariable->DevolverIdConfReportesCertificaciones($idvar);
                                    if($datosserializados->reportes[$idpersona]->reporte[$confreporte]->variable[$idvar]){
                                        $leyenda .= $variable.',';
                                    }
                                }
                            }
                        }
                    }
                    $var[$n][0] = $rvm['denominacion'];
                    $var[$n][1] = $rvm['denom'];
                    $n++;
                }

                //selecciona las variables sin repetir
                $objFinal[$io]->meses[$im] = array();
                $objFinal[$io]->meses[$im]['mes'] = $im;
                $objFinal[$io]->meses[$im]['diastrabajados'] = $diastrabajados;
                $objFinal[$io]->meses[$im]['salariodevengado'] = $salariodevengado;
                $objFinal[$io]->meses[$im]['leyenda'] = trim($leyenda, ',');
            }
        }

        $datospersona = $this->pIntegrator->pvd->getPrincipalesDatosPersona(array($idpersona), null, null, null, null, null);

        //Si es el modelo 08
        if ($tiporeporte == 1) {
            $objReportePDF->construirReporte($datospersona, $objFinal, $variblesSNC, $idestructura);
        } else {//Si es el modelo 09
            $arraydatossalario = array_chunk($objFinal, 10);
            //Buscando el ultimo año de la persona
            $annosmostrar = ConfigVariableGlobalValor::obtenerValorVariableGlobalSNC()[0]['valor'];
            if ($annosmostrar) {
                $arrayfinal = array();
                foreach ($arraydatossalario as $i => $val) {
                    foreach ($val as $annos => $ra) {
                        if ($annosmostrar > 0) {
                            $arrayfinal[$i][$annos] = $ra;
                            $annosmostrar--;
                        }
                    }
                }
                $objReporteSNC09->construirReporteSNC09($datospersona, $arrayfinal, $idestructura);
            } else {
                $objReporteSNC09->construirReporteSNC09($datospersona, $arraydatossalario, $idestructura);
            }

        }
    }

    //Funcion para acumular en el snc o registro de salario y tiempo de servicios
    /**
     * @param $idnomina
     * @param $camposregistrosalario
     */
    public function acumularSNC225($identidad, $arrayidnomina, $camposregistrosalario, $idelaborarpago, $personasreporte, $tiponomina, $idexpresionmatematicacamposnominaantiguos = null)
    {
        // ==============================================
    	// CACHES ESTÁTICOS - Persisten entre llamadas
    	// ==============================================
	    static $periodosCache = [];
	    static $calendarioCache = [];
	    static $variablesGlobalesCache = [];
	    static $tiponominaCache = [];
	    static $idCargoCache = [];
	    static $expresionesMatematicasCache = [];
	    static $idTiponominaCache = [];
    	static $periodosConIdentidadCache = [];
    	static $variablesReporteCache = []; 

		//Sincronizando las formulas del snc
        $arrayexpmat = array();
        $iocInterno = ZendExt_IoC_Inter::getInstance();
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $objConfEstructuraNomina = new ConfigEstructurarModelosNomina();
        //Si se esta restaurando el SNC a partir de una formula del Salario Devengado con campos antiguos
        if($idexpresionmatematicacamposnominaantiguos){
            $arrayexpmat[] = $idexpresionmatematicacamposnominaantiguos;
        //Si se esta actualizando o restaurando el SNC a partir de las fomulas de las configuraciones
        }else{
			// Cache para consulta de formulas SNC
        	if (!isset($expresionesMatematicasCache[$tiponomina])) { 
            	$sqlsnc = "SELECT expresionmatemdias, expresionmatemimport, expresionmatemimportdevengado     
                	FROM mod_nomina.conf_registsalartiempservc
                	WHERE idtiponomina = ?";
            	$rformulassnc = $conn->fetchAll($sqlsnc, array($tiponomina));
			    $expresionesMatematicasCache[$tiponomina] = $rformulassnc;
        	}
        	$rformulassnc = $expresionesMatematicasCache[$tiponomina];
            if ($rformulassnc[0]['expresionmatemdias']) {
                $arrayexpmat[] = $rformulassnc[0]['expresionmatemdias'];
            }
            if ($rformulassnc[0]['expresionmatemimport']) {
                $arrayexpmat[] = $rformulassnc[0]['expresionmatemimport'];
            }
            if ($rformulassnc[0]['expresionmatemimportdevengado']) {
                $arrayexpmat[] = $rformulassnc[0]['expresionmatemimportdevengado'];
            }
        }
        //Para las vacaciones adelantadas se valida si en la estructura de la nomina que esta en la formula acumula o en el mes anterior o en el mes siguiente
        $arrmesantsig = array();
        foreach ($camposregistrosalario as $crs => $rs) {
            $idregistsalartiempservc = $rs['idregistsalartiempservc'];
            $expimporte = ($idexpresionmatematicacamposnominaantiguos)?$idexpresionmatematicacamposnominaantiguos:$rs['expresionmatemimport'];
            $arrindformulaimporte = ZendExt_IoC_Inter::getInstance()->comun->ObtenerarrIdIndicadoresporExpresionMatematica($expimporte);
            //Recorriendo los indicadores de la formula del salario devengado para evaluarlos
            foreach ($arrindformulaimporte as $id => $rd) {
                $rex = explode('_', $rd);
                if($rex[0] == 'EMN'){
                    $idestructuranom = $rex[1];
                    $idmesacumulasnc = $objConfEstructuraNomina->obtenerMesAcumulaSNC($idestructuranom);
                    if($idmesacumulasnc){
                        $arrmesantsig[$idregistsalartiempservc] = $idmesacumulasnc;
                        break;
                    }
                }

            }
        }

        $respuesta = $iocInterno->comun->GuardarExpresionesMatematicas($arrayexpmat);
        $respuesta = 'ok';

        if ($respuesta == 'ok') {
            $personasreporte = (is_array($personasreporte)) ? $personasreporte : (array)$personasreporte;
            $confmodelonomina = new ConfigModeloNomina();
            $datElaborarPagos = new DatElaborarPagos();
            $datNominaDatos = new DatNominaDatos();
            $datCargosOcupados = new DatCargosOcupados();
            $datreportes = new DatReportesCertificaciones();
            $confvariablesregistrosalario = new ConfVarAuxSNC225();
            $confvariablesreporte = new ConfVariablesReportesCertificaciones();
            $objConfigVariableGlobalValorModel = new ConfigVariableGlobalValorModel();
            if (count($arrayidnomina) > 0) {
                foreach ($arrayidnomina as $idnomina) {
                    $todosdatosnomina = $datNominaDatos->obtenerDatosNomina($idnomina);
                    $valores = $todosdatosnomina[0]['valores'];
                    $datospersonas = unserialize($valores);
                    $respuesta = '';
                    $contFormulas = 0;
				
	                // Cache para datos del período de pago (fuera del bucle de personas)
	                $cacheKeyPeriodo = $idelaborarpago;
	                if (!isset($periodosCache[$cacheKeyPeriodo])) {
	                    $periodosCache[$cacheKeyPeriodo] = $datElaborarPagos->obtenerPeriodosPagoEntidad($idelaborarpago);
	                }
	                $arraypago = $periodosCache[$cacheKeyPeriodo];
	                $fechapago = $arraypago[0]['fechainicioperiodo'];
	                $arrayfecha = explode('/', $fechapago);
	                $messncBase = $arrayfecha[1];
	                $annosncBase = $arrayfecha[2];
	                
	                // Cache para idtiponomina
	                if (!isset($idTiponominaCache[$idelaborarpago])) {
	                    $idTiponominaCache[$idelaborarpago] = $confmodelonomina->obtenerIdTiposNominaporTipoPago($idelaborarpago);
	                }
	                $idtiponomina = $idTiponominaCache[$idelaborarpago];
				
                    //Recorriendo las personas para validar que no halla variables sin formulas
                    foreach ($datospersonas as $idp => $rdp) {
                        $arrid = explode('-', $rdp['id']);
                        $idpersona = $arrid[0];
                        $idcargoocupado = $arrid[1];
						if (!isset($idCargoCache[$idcargoocupado])) {
    						$idCargoCache[$idcargoocupado] = $datCargosOcupados->obtenerIdCargosXIdCargoOcupado($idcargoocupado);
						}
						$idcargo = $idCargoCache[$idcargoocupado];

                        //Recorriendo los campos de la conf del registro de salarios para validar que no halla variables sin formulas
                        foreach ($camposregistrosalario as $icrs => $rcrs) {
                            $idregistsalartiempservicio = $rcrs['idregistsalartiempservc'];
                            $contFormulasNulasDias = 0;
                            $contFormulasNulasImp = 0;
                            $contFormulasNulasImpDev = 0;
                            //EXPRESIONMATMDIAS**************************
                            $expresionmatematicadias = $rcrs['expresionmatemdias'];
                            $arrayformuladiasevaluar = array();
                            $contformuladias = 0;
                            $arrindicadoresformuladias = ZendExt_IoC_Inter::getInstance()->comun->ObtenerarrIdIndicadoresporExpresionMatematica($expresionmatematicadias);

                            //Recorriendo los indicadores de la formula de los dias para evaluarlos
                            foreach ($arrindicadoresformuladias as $ifd => $rfd) {
                                $rexplode = explode('_', $rfd);
                                switch ($rexplode[0]) {
                                    //Cuando halla que buscar los dias habiles del mes
                                    case 'CLDR': {
	                                    $mespago = $arrayfecha[1];
	                                    $anno = $arrayfecha[2];
	                                    $cacheKeyCalendario = $mespago . '_' . $anno;
	                                    if (!isset($calendarioCache[$cacheKeyCalendario])) {
	                                        $calendario = new ConfCalendarioSNC();		
	                                        $tienediashabiles = $calendario->tieneConfCalendario($mespago, $anno);
	                                        if ($tienediashabiles > 0) {
	                                            $diashabiles = $calendario->obtenerDiasHabiles($mespago, $anno);
	                                            $contformuladias++;
	                                        } else {
	                                            $diashabiles = 0;
	                                        }				
	                                        $diashabiles = ($tienediashabiles > 0) ? $calendario->obtenerDiasHabiles($mespago, $anno) : 0;
	                                        $calendarioCache[$cacheKeyCalendario] = [
	                                            'tiene' => $tienediashabiles,
	                                            'dias' => $diashabiles
	                                        ];
	                                    }
	                                    $diashabiles = $calendarioCache[$cacheKeyCalendario]['dias'];
									    $arrayformuladiasevaluar[$contformuladias]['idindicador'] = $rfd;
									    $arrayformuladiasevaluar[$contformuladias]['valor'] = ($diashabiles) ? $diashabiles : 0;
									    $contformuladias++;
									    break;
	                                }
                                    //Variable auxiliar del reporte
									case 'VASP': {
									    $valor = 0;
									    $idvariableauxiliar = $rexplode[1];									    
									    $cacheKeyVASP = $idvariableauxiliar;
									    if (!isset($variablesReporteCache[$cacheKeyVASP])) {
									        $idvariablesconfreportescertificaciones = $confvariablesregistrosalario->obtenerIdVariableConReporte($idvariableauxiliar);
									        $idconfreportescertificaciones = $confvariablesreporte->obtenerConfReportePorIdVariable($idvariablesconfreportescertificaciones);
									        $variablesReporteCache[$cacheKeyVASP] = [
									            'idvar' => $idvariablesconfreportescertificaciones,
									            'idconf' => $idconfreportescertificaciones
									        ];
									    }
									    $idvariablesconfreportescertificaciones = $variablesReporteCache[$cacheKeyVASP]['idvar'];
									    $idconfreportescertificaciones = $variablesReporteCache[$cacheKeyVASP]['idconf'];									    
									    $valor = $personasreporte[$idpersona]->reporte[$idconfreportescertificaciones]->variable[$idvariablesconfreportescertificaciones];
									    $arrayformuladiasevaluar[$contformuladias]['idindicador'] = $rfd;
									    $arrayformuladiasevaluar[$contformuladias]['valor'] = ($valor) ? $valor : 0;
									    $contformuladias++;                                        
									    break;
									}
                                    //Campo de la nomina
                                    case 'EMN': {
                                        $idestructurarnomina = $rexplode[1];
                                        $importe = $rdp["c$idestructurarnomina"];
                                        $arrayformuladiasevaluar[$contformuladias]['idindicador'] = $rfd;
                                        $arrayformuladiasevaluar[$contformuladias]['valor'] = ($importe) ? $importe : 0;
                                        $contformuladias++;
                                        break;
                                    }
                                    //Variable global
                                    case 'VG': {
                                        $valor = 0;
                                        $idvariableglobal = $rexplode[1];
                                        if ($idcargo) {
											$cacheKeyVariables = $identidad . '_' . $idcargo;
											if (!isset($variablesGlobalesCache[$cacheKeyVariables])) {
    											$variablesGlobalesCache[$cacheKeyVariables] = $objConfigVariableGlobalValorModel->obtenerVariablesGlobales($identidad, array($idcargo));
											}
											$confvariables = $variablesGlobalesCache[$cacheKeyVariables];
                                        }
                                        $arrayformuladiasevaluar[$contformuladias]['idindicador'] = $rfd;
                                        if (array_key_exists($idvariableglobal, $confvariables->sistema)) {
                                            $valor = $confvariables->sistema[$idvariableglobal];
                                            $arrayformuladiasevaluar[$contformuladias]['valor'] = ($valor) ? $valor : 0;
                                        } else if (array_key_exists($idvariableglobal, $confvariables->entidad)) {
                                            $valor = $confvariables->entidad[$idvariableglobal];
                                            $arrayformuladiasevaluar[$contformuladias]['valor'] = ($valor) ? $valor : 0;
                                        } else if (array_key_exists($idvariableglobal, $confvariables->cargo)) {
                                            $valor = $confvariables->cargo[$idvariableglobal];
                                            $arrayformuladiasevaluar[$contformuladias]['valor'] = ($valor) ? $valor : 0;
                                        } else {
                                            return 'NO-CONFIG-VARIABLE-GLOBAL';
                                        }
                                        $contformuladias++;
                                        break;
                                    }
                                }
                            }
                            $formulaevaluadadias = ZendExt_IoC_Inter::getInstance()->comun->EvaluarExpresionMatematica($expresionmatematicadias, $arrayformuladiasevaluar);
                            //EXPRESIONMATMIMPORT**************************
                            //Si se esta acumulando desde una nomina o se esta restaurando desde una formula de las configuraciones el idexpresionmatematicaimporte es $rcrs['expresionmatemimport']
                            //Si se esta restaurando desde una formula con campos antiguos el idexpresionmatematicaimporte es $idexpresionmatematicacamposnominaantiguos
                            $expresionmatematicaimporte = ($idexpresionmatematicacamposnominaantiguos)?$idexpresionmatematicacamposnominaantiguos:$rcrs['expresionmatemimport'];
                            $arrayformulaimporteevaluar = array();
                            $contformulaimporte = 0;
                            $arrindicadoresformulaimporte = ZendExt_IoC_Inter::getInstance()->comun->ObtenerarrIdIndicadoresporExpresionMatematica($expresionmatematicaimporte);
                            //Recorriendo los indicadores de la formula del salario devengado para evaluarlos
                            foreach ($arrindicadoresformulaimporte as $ifd => $rfd) {
                                $rexplode = explode('_', $rfd);
                                switch ($rexplode[0]) {
                                    //Cuando halla que buscar los dias habiles del mes
									case 'CLDR': {
	                                    $mespago = $arrayfecha[1];
	                                    $anno = $arrayfecha[2];
	                                    $cacheKeyCalendario = $mespago . '_' . $anno;
	                                    if (!isset($calendarioCache[$cacheKeyCalendario])) {
	                                        $calendario = new ConfCalendarioSNC();		
	                                        $tienediashabiles = $calendario->tieneConfCalendario($mespago, $anno);
	                                        if ($tienediashabiles > 0) {
	                                            $diashabiles = $calendario->obtenerDiasHabiles($mespago, $anno);
	                                            $contformuladias++;
	                                        } else {
	                                            $diashabiles = 0;
	                                        }				
	                                        $diashabiles = ($tienediashabiles > 0) ? $calendario->obtenerDiasHabiles($mespago, $anno) : 0;
	                                        $calendarioCache[$cacheKeyCalendario] = [
	                                            'tiene' => $tienediashabiles,
	                                            'dias' => $diashabiles
	                                        ];
	                                    }
	                                    $diashabiles = $calendarioCache[$cacheKeyCalendario]['dias'];
									    $arrayformulaimporteevaluar[$contformulaimporte]['idindicador'] = $rfd;
									    $arrayformulaimporteevaluar[$contformulaimporte]['valor'] = ($diashabiles) ? $diashabiles : 0;
									    $contformulaimporte++;
									    break;
	                                }
                                    //Variable auxiliar del reporte
									case 'VASP': {
									    $valor = 0;
									    $idvariableauxiliar = $rexplode[1];
									    $cacheKeyVASP = $idvariableauxiliar;
									    if (!isset($variablesReporteCache[$cacheKeyVASP])) {
									        $idvariablesconfreportescertificaciones = $confvariablesregistrosalario->obtenerIdVariableConReporte($idvariableauxiliar);
									        $idconfreportescertificaciones = $confvariablesreporte->obtenerConfReportePorIdVariable($idvariablesconfreportescertificaciones);
									        $variablesReporteCache[$cacheKeyVASP] = [
									            'idvar' => $idvariablesconfreportescertificaciones,
									            'idconf' => $idconfreportescertificaciones
									        ];
									    }
									    $idvariablesconfreportescertificaciones = $variablesReporteCache[$cacheKeyVASP]['idvar'];
									    $idconfreportescertificaciones = $variablesReporteCache[$cacheKeyVASP]['idconf'];									    
									    $valor = $personasreporte[$idpersona]->reporte[$idconfreportescertificaciones]->variable[$idvariablesconfreportescertificaciones];
									    $arrayformulaimporteevaluar[$contformulaimporte]['idindicador'] = $rfd;
									    $arrayformulaimporteevaluar[$contformulaimporte]['valor'] = ($valor) ? $valor : 0;
									    $contformulaimporte++;                                        
									    break;
									}				
                                    //Campo de la nomina
                                    case 'EMN': {
                                        $idestructurarnomina = $rexplode[1];
                                        $importe = $rdp["c$idestructurarnomina"];
                                        $arrayformulaimporteevaluar[$contformulaimporte]['idindicador'] = $rfd;
                                        $arrayformulaimporteevaluar[$contformulaimporte]['valor'] = ($importe) ? $importe : 0;
                                        $contformulaimporte++;
                                        break;
                                    }
                                    //Variable global
									case 'VG': {
									    $valor = 0;
									    $idvariableglobal = $rexplode[1];
									    if ($idcargo) {
									        // Cache para variables globales
									        $cacheKeyVariables = $identidad . '_' . $idcargo;
									        if (!isset($variablesGlobalesCache[$cacheKeyVariables])) {
									            $variablesGlobalesCache[$cacheKeyVariables] = $objConfigVariableGlobalValorModel->obtenerVariablesGlobales($identidad, array($idcargo));
									        }
									        $confvariables = $variablesGlobalesCache[$cacheKeyVariables];
									    }
									    $arrayformulaimporteevaluar[$contformulaimporte]['idindicador'] = $rfd;
									    if (array_key_exists($idvariableglobal, $confvariables->sistema)) {
									        $valor = $confvariables->sistema[$idvariableglobal];
									        $arrayformulaimporteevaluar[$contformulaimporte]['valor'] = ($valor) ? $valor : 0;
									    } else if (array_key_exists($idvariableglobal, $confvariables->entidad)) {
									        $valor = $confvariables->entidad[$idvariableglobal];
									        $arrayformulaimporteevaluar[$contformulaimporte]['valor'] = ($valor) ? $valor : 0;
									    } else if (array_key_exists($idvariableglobal, $confvariables->cargo)) {
									        $valor = $confvariables->cargo[$idvariableglobal];
									        $arrayformulaimporteevaluar[$contformulaimporte]['valor'] = ($valor) ? $valor : 0;
									    } else {
									        return 'NO-CONFIG-VARIABLE-GLOBAL';
									    }
									    $contformulaimporte++;
									    break;
									}
                                }
                            }
                            $formulaevaluadaimporte = ZendExt_IoC_Inter::getInstance()->comun->EvaluarExpresionMatematica($expresionmatematicaimporte, $arrayformulaimporteevaluar);

                            //EXPRESIONMATMIMPORTDEVENGADO**************************
                            $expresionmatematicaimportedev = $rcrs['expresionmatemimportdevengado'];
                            $arrayformulaimportedevevaluar = array();
                            $contformulaimportedev = 0;
                            $arrindicadoresformulaimportedev = ZendExt_IoC_Inter::getInstance()->comun->ObtenerarrIdIndicadoresporExpresionMatematica($expresionmatematicaimportedev);
                            //Recorriendo los indicadores de la formula del salario devengado para evaluarlos
                            foreach ($arrindicadoresformulaimportedev as $ifd => $rfd) {
                                $rexplode = explode('_', $rfd);
                                switch ($rexplode[0]) {
                                    //Cuando halla que buscar los dias habiles del mes
									case 'CLDR': {
	                                    $mespago = $arrayfecha[1];
	                                    $anno = $arrayfecha[2];
	                                    $cacheKeyCalendario = $mespago . '_' . $anno;
	                                    if (!isset($calendarioCache[$cacheKeyCalendario])) {
	                                        $calendario = new ConfCalendarioSNC();		
	                                        $tienediashabiles = $calendario->tieneConfCalendario($mespago, $anno);
	                                        if ($tienediashabiles > 0) {
	                                            $diashabiles = $calendario->obtenerDiasHabiles($mespago, $anno);
	                                            $contformuladias++;
	                                        } else {
	                                            $diashabiles = 0;
	                                        }				
	                                        $diashabiles = ($tienediashabiles > 0) ? $calendario->obtenerDiasHabiles($mespago, $anno) : 0;
	                                        $calendarioCache[$cacheKeyCalendario] = [
	                                            'tiene' => $tienediashabiles,
	                                            'dias' => $diashabiles
	                                        ];
	                                    }
	                                    $diashabiles = $calendarioCache[$cacheKeyCalendario]['dias'];
									    $arrayformulaimportedevevaluar[$contformulaimportedev]['idindicador'] = $rfd;
									    $arrayformulaimportedevevaluar[$contformulaimportedev]['valor'] = ($diashabiles) ? $diashabiles : 0;
									    $contformulaimportedev++;
									    break;
	                                }
                                    //Variable auxiliar del reporte
									case 'VASP': {
									    $valor = 0;
									    $idvariableauxiliar = $rexplode[1];									    
									    $cacheKeyVASP = $idvariableauxiliar;
									    if (!isset($variablesReporteCache[$cacheKeyVASP])) {
									        $idvariablesconfreportescertificaciones = $confvariablesregistrosalario->obtenerIdVariableConReporte($idvariableauxiliar);
									        $idconfreportescertificaciones = $confvariablesreporte->obtenerConfReportePorIdVariable($idvariablesconfreportescertificaciones);
									        $variablesReporteCache[$cacheKeyVASP] = [
									            'idvar' => $idvariablesconfreportescertificaciones,
									            'idconf' => $idconfreportescertificaciones
									        ];
									    }
									    $idvariablesconfreportescertificaciones = $variablesReporteCache[$cacheKeyVASP]['idvar'];
									    $idconfreportescertificaciones = $variablesReporteCache[$cacheKeyVASP]['idconf'];									    
									    $valor = $personasreporte[$idpersona]->reporte[$idconfreportescertificaciones]->variable[$idvariablesconfreportescertificaciones];
									    $arrayformulaimportedevevaluar[$contformulaimportedev]['idindicador'] = $rfd;
									    $arrayformulaimportedevevaluar[$contformulaimportedev]['valor'] = ($valor) ? $valor : 0;
									    $contformulaimportedev++;                                        
									    break;
									}				
                                    //Campo de la nomina
                                    case 'EMN': {
                                        $idestructurarnomina = $rexplode[1];
                                        $importe = $rdp["c$idestructurarnomina"];
                                        $arrayformulaimportedevevaluar[$contformulaimportedev]['idindicador'] = $rfd;
                                        $arrayformulaimportedevevaluar[$contformulaimportedev]['valor'] = ($importe) ? $importe : 0;
                                        $contformulaimportedev++;
                                        break;
                                    }
                                    //Variable global
									case 'VG': {
									    $valor = 0;
									    $idvariableglobal = $rexplode[1];
									    if ($idcargo) {
									        // Cache para variables globales
									        $cacheKeyVariables = $identidad . '_' . $idcargo;
									        if (!isset($variablesGlobalesCache[$cacheKeyVariables])) {
									            $variablesGlobalesCache[$cacheKeyVariables] = $objConfigVariableGlobalValorModel->obtenerVariablesGlobales($identidad, array($idcargo));
									        }
									        $confvariables = $variablesGlobalesCache[$cacheKeyVariables];
									    }
									    $arrayformulaimporteevaluar[$contformulaimporte]['idindicador'] = $rfd;
									    if (array_key_exists($idvariableglobal, $confvariables->sistema)) {
									        $valor = $confvariables->sistema[$idvariableglobal];
									        $arrayformulaimporteevaluar[$contformulaimporte]['valor'] = ($valor) ? $valor : 0;
									    } else if (array_key_exists($idvariableglobal, $confvariables->entidad)) {
									        $valor = $confvariables->entidad[$idvariableglobal];
									        $arrayformulaimporteevaluar[$contformulaimporte]['valor'] = ($valor) ? $valor : 0;
									    } else if (array_key_exists($idvariableglobal, $confvariables->cargo)) {
									        $valor = $confvariables->cargo[$idvariableglobal];
									        $arrayformulaimporteevaluar[$contformulaimporte]['valor'] = ($valor) ? $valor : 0;
									    } else {
									        return 'NO-CONFIG-VARIABLE-GLOBAL';
									    }
									    $contformulaimporte++;
									    break;
									}
                                }
                            }                            
                            
                            $formulaevaluadaimportedev = ZendExt_IoC_Inter::getInstance()->comun->EvaluarExpresionMatematica($expresionmatematicaimportedev, $arrayformulaimportedevevaluar);
                            //Guardando en el registro de salarios y tiempo de servicio
                            //Mismo mes y anno
                             $messnc = $arrayfecha[1];
                             $annosnc = $arrayfecha[2];
				
                            //1 Mes Anterior
                            if($arrmesantsig[$idregistsalartiempservicio] == 1){
                                if($messnc == 1){
                                    $messnc = 12;
                                    $annosnc = $annosnc - 1;
                                }else{
                                    $messnc = $messnc - 1;
                                    $annosnc = $annosnc;
                                }
                            //2 Mes Posterior
                            }else if($arrmesantsig[$idregistsalartiempservicio] == 2){
                                if($messnc == 12){
                                    $messnc = 1;
                                    $annosnc = $annosnc + 1;
                                }else{
                                    $messnc = $messnc + 1;
                                    $annosnc = $annosnc;
                                }
                            }
                            $diasacumulados = ($formulaevaluadadias->codigo == 1) ? number_format($formulaevaluadadias->valor, 0, '.', '') : 0;
                            $salariodevengado = ($formulaevaluadaimporte->codigo == 1) ? number_format($formulaevaluadaimporte->valor, 2, '.', '') : 0.00;
                            if($diasacumulados > 0 || $salariodevengado > 0){                                
                                //Datos del modelo de nomina
                                //Salvando el registro de salarios y tiempo de servicios
                                $gestregistrosalario = new DatRegistroSalarioTiempoServicio();
                                $gestregistrosalario->idpersona = $idpersona;
                                $gestregistrosalario->anno = $annosnc;
                                $gestregistrosalario->idmes = $messnc;
                                $gestregistrosalario->diasacumulados = $diasacumulados;
                                $gestregistrosalario->salariodevengado = $salariodevengado;
                                $gestregistrosalario->salariodevengadoreporte = ($formulaevaluadaimportedev->codigo == 1) ? number_format($formulaevaluadaimportedev->valor, 2, '.', '') : 0.00;
                                $gestregistrosalario->idtiponomina = $idtiponomina[0]['idtiponomina'];
                                $gestregistrosalario->idestructura = $identidad;
                                $gestregistrosalario->idconfregistsalartiempservc = $rcrs['idregistsalartiempservc'];
                                $gestregistrosalario->save();
                            }

                        }
                    }
                }
            }
        }
        return 'OK';
    }
    
    public function calcularSalarioTotalPersonaSNC($idpersona, $identidad, $cantidad_meses = 12, $tiposnominas, $mesinicial = null, $lugaresdecimales = 2, $periodo)
    {
        $arraySalarios = array();
        $arraySalariosPersonasXMesAux = array();
        //Buscando los datos de las personas
        $posSal = 0;
        $arraySalariosPersonasXMesAux = DatRegistroSalarioTiempoServicio::obtenerListadoDatRegistroSalarioOrdenadoAnnosMesesNominasReportesDESC($idpersona, $identidad, $tiposnominas, $mesinicial, $periodo, $cantidad_meses);
        
        
        
        $arraySalariosPersonasXMes = array();
        $m = 0;
        foreach ($arraySalariosPersonasXMesAux as $salario) {
            $arraySalariosPersonasXMes[$m]['idpersona'] = $salario['idpersona'];
            $arraySalariosPersonasXMes[$m]['anno'] = $salario['anno'];
            $arraySalariosPersonasXMes[$m]['idmes'] = $salario['idmes'];
            $arraySalariosPersonasXMes[$m]['salario'] = $salario['salariodevengado'];
            $m++;
        }
        //print_r($arraySalariosPersonasXMesAux);die;
        $pos = 1;
        foreach ($arraySalariosPersonasXMes as $i) {
            if (($i['idpersona'] == $arraySalariosPersonasXMes[$pos]['idpersona']) &&
                ($i['anno'] == $arraySalariosPersonasXMes[$pos]['anno']) &&
                ($i['idmes'] == $arraySalariosPersonasXMes[$pos]['idmes'])
            ) {
                if ($i['salario'] === null) {
                    $arraySalarios[$idpersona][$posSal] += 0;
                } else {
                   // $arraySalarios[$idpersona][$posSal] += $i['salario'];
                    $arraySalarios[$idpersona][$posSal] = number_format(($arraySalarios[$idpersona][$posSal] + $i['salario']), $lugaresdecimales, '.', '');
                }
            } else {
                //$arraySalarios[$idpersona][$posSal] += $i['salario'];
                $arraySalarios[$idpersona][$posSal] = number_format(($arraySalarios[$idpersona][$posSal] + $i['salario']), $lugaresdecimales, '.', '');
                $posSal++;
            }
            $pos++;
        }
        $sumaTotalSalariosXPersona = 0;
        $promedioSalarioXPersona = 0;
        foreach ($arraySalarios as $idp => $persona) {
            if (count($persona) >= $cantidad_meses) {//Si hay la cantidad de meses especificada
                //sumando todos los salarios de esta persona
                $contmeses = 0;
                for ($v = 0; $v < $cantidad_meses; $v++) {
                    if ($persona[$v] === null || $persona[$v] == 0) {
                        $sumaTotalSalariosXPersona += 0;
                    } else {
                        $sumaTotalSalariosXPersona += $persona[$v];
                        $contmeses++;
                    }
                }
                //$cantidad_meses = count($persona);
                $cantidad_meses = $contmeses;
            } else {//Si no llega a la cantidad de meses especificada
                $contmeses = 0;
                for ($v = 0; $v < count($persona); $v++) {
                    if ($persona[$v] === null || $persona[$v] == 0) {
                        $sumaTotalSalariosXPersona += 0;
                    } else {
                        $sumaTotalSalariosXPersona += $persona[$v];
                        $contmeses++;
                    }
                }
                //$cantidad_meses = count($persona);
                $cantidad_meses = $contmeses;
            }
        }
        //Devolviendo el salario promedio de la persona en la entidad
        $obj->totalsalariosnc = $sumaTotalSalariosXPersona;
        $obj->cantidadmeses = $cantidad_meses;
        return $obj;
    }

}
