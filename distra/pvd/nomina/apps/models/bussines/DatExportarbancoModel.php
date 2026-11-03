<?php
$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
include_once($dir_www . '/pvd/comun/recursos/PHPMailer_v5.1/class.phpmailer.php');
include_once($dir_www . '/pvd/comun/recursos/PHPMailer_v5.1/class.smtp.php');

class DatExportarbancoModel extends ZendExt_Model
{
    public $JSONCorreo = null;
    public $fontSizeEncabezado = 16;
    public $fontSizeDatosPersona = 14;
    public $fontSizeCampos = 12;
    public $identidad, $nombreempresa, $abreviaturaempresa, $fechaperiodo, $dia, $mes, $anno, $nombremes, $rtotales;

    public function DatExportarbancoModel()
    {
        parent::ZendExt_Model();
    }

    public function notificarCorreo($datos, $identidad, $usuario, $pass, $personas, $totalpersonasnotificar)
    {
        //Sincronizando las formulas de los agrupadores por si los ficheros no estan en el comun
        $sync = $this->sincronizarFormulasAgrupadoresCorreo($identidad);
        if($sync == 'ok'){
            //Nombre de la empresa
            $this->nombreempresa = utf8_decode(ZendExt_IoC::getInstance()->metadatos->obtenerPadreEntidad($identidad)[0]->denominacion);
            $this->abreviaturaempresa = utf8_decode(ZendExt_IoC::getInstance()->metadatos->obtenerPadreEntidad($identidad)[0]->abreviatura);
            $this->identidad = $identidad;

            //Obteniendo las operaciones submayorvacaciones de todas personas
            $objDatElaborarPagos = new DatElaborarPagos();
            $objNomTipoPago = new NomTipoPago();
            $fechainicio = $datos[0]['fechainicio'];
            foreach ($datos as $per) {
                $idtipopago = $objDatElaborarPagos->obtenerTipoPagoPeriodo($per['idelaborarpagos']);
                $sepagaadelantado = $objNomTipoPago->obtenerPagoAdelantado($idtipopago);
                if ($sepagaadelantado != 1) {
                    $fechainicio = $per['fechainicio'];
                    break;
                }
            }

            list($this->dia, $this->mes, $this->anno) = explode('/', $fechainicio);
            $periodo = $this->mes . '-' . $this->anno;
            $arrmeses = NomMes::obteneTodosNomMes();
            $this->nombremes = (!empty($arrmeses)) ? '(' . utf8_decode($arrmeses[intval($this->mes) - 1]['denominacion']) . ')' : '';

            //Desglose por nominas
            $datnom = new DatNominaDatos();
            $arrperso = array();
            $idelaborarpagos = array();
            foreach ($datos as $key => $value) {
                $val = $datnom->obtenerDatosNominaPorElaborarPago($value['idelaborarpagos']);
                foreach ($val as $k => $v) {
                    //Reestructurando el arreglo de personas seleccionadas a las que se le enviara el correo
                    $arrayvalores = array();
                    if (empty($personas)) {
                        $arrayvalores = unserialize($v['valores']);
                    } else {
                        foreach ($personas as $idpersonaesp) {
                            foreach (unserialize($v['valores']) as $key => $rv) {
                                list($idpersona) = explode('-', $rv['id']);
                                if ($idpersona == $idpersonaesp) {
                                    $arrayvalores[] = $rv;//
                                }
                            }
                        }
                    }
                    if (!empty($arrayvalores)) {

                        foreach ($arrayvalores as $key => $rv) {
                            $res = array();
                            $spli = explode('-', $rv['id']);
                            $idpersona = $spli[0];
                            $mg = Doctrine_Manager::getInstance();
                            $conn = $mg->getCurrentConnection();
                            $sql = "SELECT dc.idcontacto, dc.contacto as correoelectronico, dc.oficial, dc.idtipomediocontacto, dc.idtipocontacto, dc.idpersona,ddi.numero as ci,dep.identidad,
                            (CASE WHEN dp.snombre = '' or dp.snombre is null THEN dp.nombre||' '||dp.papel||' '||dp.sapel ELSE dp.nombre||' '||dp.snombre||' '||dp.papel||' '||dp.sapel END) as nombre              
                            FROM mod_persona.dat_contacto dc
                            INNER JOIN mod_persona.dat_persona dp ON (dp.idpersona = dc.idpersona)
                            INNER JOIN mod_persona.dat_docidentidad ddi ON (ddi.idpersona = dc.idpersona)
                            left join mod_persona.nom_tipomediocontacto ntmc on(ntmc.idtipomediocontacto = dc.idtipomediocontacto)
                            left join mod_nomina.dat_vacacionespersona dvp on(dvp.idpersona = dp.idpersona)
                            left join mod_nomina.his_vacacionespersona hv ON (hv.idvacacionespersona = dvp.idvacacionespersona and hv.periodo = '{$periodo}')
                            left join mod_nomina.dat_nomina dn on(dn.idnomina = hv.idnomina)
                            left join mod_nomina.dat_elaborarpagos dep on(dep.idelaborarpagos = dn.idelaborarpago and dep.identidad = {$identidad})
                            where dvp.identidad = ? and dc.idpersona = ? and ntmc.type = 'correo' and dvp.fechafin is null order by hv.idhisvacacionespersona DESC";
                            $r = $conn->fetchAll($sql, array($identidad, $idpersona));
                            $correoelect = $r[0]['correoelectronico'];
                            $nombreapellidos = $r[0]['nombre'];
                            $ci = $r[0]['ci'];
                            if ($correoelect != '') {
                                $res = $this->fnObtenerDesglosePorNominas($value['idelaborarpagos'], $identidad, $rv);
                                $arrperso[$rv['id']]['datosprincipales'] = array('ci' => $ci, 'nombreapellidos' => $nombreapellidos, 'correo' => $correoelect);
                                $arrperso[$rv['id']]['nominas'][] = $res;
                            }
                        }
                    }
                }
                $idelaborarpagos[] = $value['idelaborarpagos'];
            }

            //Obteniendo el periodo de pago
            $this->fechaperiodo = $this->fnObtenerFechasPeridoPago($idelaborarpagos);
            if (!empty($arrperso)) {
                foreach ($arrperso as $key => $persona) {
                    $idpersona = explode('-', $key)[0];
                    $bodycorreo = "";
                    //Pintar agrupadores de campos
                    $this->fnPintarAgrupadores($bodycorreo, $idpersona, $persona);

                    //Enviar correo
                    if (!empty($persona['datosprincipales']['correo'])) {
                        $this->fnEnviarCorreo($bodycorreo, $persona['datosprincipales']['correo']);
                    }
                }
            } else {
                return false;
            }
            return true;
        }
    }

    //Datos
    public function fnObtenerDesglosePorNominas($idelaborarpago, $identidad, $persona)
    {
        $conf = new ConfigModeloNomina();
        $tiponom = new NomTipoNomina();
        $estrucnom = new ConfigEstructurarModelosNomina();
        $esmodelidest = new DatDatosModeloNominaConceptos();
        $objNomTipoNomina = new NomTipoNomina();
        $objtiponom = $conf->obtenerIdTiposNominaporTipoPago($idelaborarpago);
        $tipnom = $tiponom->obtenerObjTipoNominaDadoId($objtiponom[0]['idtiponomina']);
        $estrcnomina = $estrucnom->obtenerDatosEstructuraNominaxIdTipoNominaCorreo($objtiponom[0]['idtiponomina'], $identidad);
        $datos = array();
        foreach ($estrcnomina as $rval) {
            $tipomoneda = $objNomTipoNomina->obtenerTipoMonedaNomina($rval['idtiponomina']);
            $denominacioncampo = '';
            if ($rval['idtipocampo'] == 2) {
                $resestruct = $esmodelidest->obtenerListadoDatosModeloNominaConceptosxIdEstructurarModeloNomina($rval['idestructuramodelodomina']);
                $arr = explode('_', $resestruct[0]['idconcepto']);
                $id = $arr[(int)$resestruct[0]['tipo'] - 1];
                switch ($resestruct[0]['tipo']) {
                    case 1:
                        $denominacioncampo = 'Salario escala';
                        break;
                    case 2:	
                        if(is_numeric($id)){
							$denominacioncampo = NomTipoRetencion::obtenerDenomXId($id);
						}else{
							$denominacioncampo = 'Retencion';
						}                       
                        break;
                    case 3:
					    if(is_numeric($id)){
							$denominacioncampo = NomConceptoRM::obtenerDenomXId($id);
						}else{
							$denominacioncampo = 'Concepto';
						}                        
                        break;
                    case 5:
					    if(is_numeric($id)){
							$denominacioncampo = NomConceptoPercepcionDescuento::obtenerDenomXId($id);
						}else{
							$denominacioncampo = 'Concepto';
						}                        
                        break;
                }
            } else {
                $denominacioncampo = $rval['descripcion'];
            }

            if ($persona['c' . $rval['idestructuramodelodomina']]) {
                $datos[$rval['idestructuramodelodomina']] = array(
                    'idestructuramodelodomina' => $rval['idestructuramodelodomina'],
                    'conceptonomina' => $denominacioncampo . ' (' . $rval['denominacion'] . ')',
                    'tiponomina' => $tipnom['denominacion'],
                    'tipomoneda' => ($tipomoneda == '01') ? 'cup' : 'cuc',
                    'importe' => $persona['c' . $rval['idestructuramodelodomina']],
                    'idpersona' => $persona['idpersona']);
            }
        }
        return $datos;
    }

    public function fnObtenerFechasPeridoPago($idelaborarpagos)
    {
        $objElaborarPagos = new DatElaborarPagos();
        $objTipoPago = new NomTipoPago();
        $cont = 0;
        $pos = 0;
        if (count($idelaborarpagos) > 1) {
            foreach ($idelaborarpagos as $i => $idep) {
                $idtipopago = $objElaborarPagos->obtenerTipoPagoPeriodo($idep);
                $sepagaadelantado = $objTipoPago->obtenerPagoAdelantado($idtipopago);
                $cont += ($sepagaadelantado == 0) ? 1 : 0;
                if ($sepagaadelantado == 0) {
                    $pos = $i;
                    break;
                }
            }
            $fechainicioperiodo = $objElaborarPagos->obtenerFechaInicioPeriodoPago($idelaborarpagos[$pos]);
            $fechafinperiodo = $objElaborarPagos->obtenerFechaFinPeriodoPago($idelaborarpagos[$pos]);
        } else {
            $fechainicioperiodo = $objElaborarPagos->obtenerFechaInicioPeriodoPago($idelaborarpagos[0]);
            $fechafinperiodo = $objElaborarPagos->obtenerFechaFinPeriodoPago($idelaborarpagos[0]);
        }
        return array('fechainicioperiodo' => $fechainicioperiodo, 'fechafinperiodo' => $fechafinperiodo);
    }

    //HTML
    public function fnPintarAgrupadores(&$bodycorreo, $idpersona, $persona)
    {
        $objFormulas = new CalculoFormulasPagoResultados();
        $objConfExportacionBanco = new ConfCamposReporteCorreo();

        //Convirtiendo las nomians de la persona en un arreglo lineal
        $personanominas = array();
        foreach ($persona['nominas'] as $tipopago) {
            $personanominas = array_merge($personanominas, $tipopago);
        }
        $personanominas = array_values($personanominas);

        $r = $objConfExportacionBanco->fnObtenerReporteCorreoXIdEntidad($this->identidad);
        $ragrupadores = array();
        $bodycorreo .= '
        <table style="width: 100%;font-size: 11px;">
            <tbody>
            <tr><!--bgcolor="#ebf0f5"-->
                    <th style="width: 50%;text-align: left;"><u>' . strtoupper(utf8_decode('CONCEPTOS DE LA NÓMINA')) . '</u></th>
                    <th style="width: 40%;text-align: center;"><u>' . strtoupper(utf8_decode('TIPO DE NÓMINA')) . '<u></th>
                    <th style="width: 10%;text-align: right;"><u>' . strtoupper(utf8_decode('IMPORTE')) . '<u></th>
            </tr>';
        foreach ($r as $i => $agrupador) {
            if ($agrupador['mostrarvacaciones'] != 1 && $agrupador['mostrarsnc'] != 1) {
                if (!empty($agrupador['idformula'])) {//Validando si tiene formula el agrupador
                    //Validando si la formula del indicador no tiene sumatoria - es una formula lineal
                    $arrformulaind = $objFormulas->ObtenerarrIdIndicadoresporExpresionMatematica($agrupador['idformula']);
                    $expresion = $objFormulas->BuscarTodosporarrIdExpresionMatematica(array($agrupador['idformula']));
                    $expmostrar = $expresion[0]['expresionacalcular'];
                    $expresionmostrarconformato = $expresion[0]['expresionmostrarconformato'];
                    $conteval = 0;
                    $arrayind = array();
                    $arraynominaspersona = array();
                    foreach ($personanominas as $arrcampo) {
                        $arraynominaspersona[$arrcampo['idestructuramodelodomina']] = $arrcampo;
                    }

                    /*if($agrupador['idformula']==1667){
                    print_r($arraynominaspersona);die;
                    print_r($arrformulaind);
                    print_r($expresion);
                    print_r($expmostrar);
                    print_r($expresionmostrarconformato);
                    print_r($agrupador);
                    die;
                    }*/
                    $contpintarcampo = 0;
                    foreach ($arrformulaind as $rif) {
                        list($tipocampo, $idcampo) = explode('_', $rif);
                        switch ($tipocampo) {
                            //Campos de estructura modelo de nomina
                            case 'CEMN': {
                                //$arrayind[$conteval]['tiponomina'] = $arraynominaspersona[$idcampo]['tipomoneda'];
                                $valor = $arraynominaspersona[$idcampo]['importe'];
                                $valorentero = intval($valor);

                                /*if($agrupador['idformula']==1637){
                                    //print_r($valorentero);die;
                                }*/

                                if (!empty($valorentero)) {
                                    $contpintarcampo++;
                                    if ($contpintarcampo == 1) {
                                        //Desglose conceptos
                                        $bodycorreo .= ' 
                                    <tr bgcolor="#ebf0f5">
                                        <td colspan="3" style="text-align: left;font-weight: bold;">
                                            ' . strtoupper(utf8_decode($agrupador['denominacion'])) . ' 
                                        </td>
                                        
                                    </tr>';
                                    }//<span style="text-align: left;font-weight: normal;">(' . $expresionmostrarconformato . ')</span>
                                    $bodycorreo .= '
                                    <tr><!--bgcolor="#ebf0f5"-->
                                        <td style="text-align: left;">' . utf8_decode($arraynominaspersona[$idcampo]['conceptonomina']) . '</td>
                                        <td style="text-align: center;">' . utf8_decode($arraynominaspersona[$idcampo]['tiponomina']) . '</td>
                                        <td style="text-align: right;">' . $valor . '</td>
                                    </tr>';
                                }
                                $arrayind[$conteval]['idindicador'] = $rif;
                                $arrayind[$conteval]['valor'] = (empty($valor)) ? 0 : $valor;
                                $conteval++;
                                break;
                            }
                            //Campos agrupadores
                            case 'A': {
                                $valor = $ragrupadores[$idcampo];
                                $valorentero = intval($valor);
                                if (!empty($valorentero)) {
                                    $contpintarcampo++;
                                    if ($contpintarcampo == 1) {
                                        //Desglose conceptos
                                        $bodycorreo .= ' 
                                    <tr bgcolor="#ebf0f5">
                                        <td colspan="3" style="text-align: left;font-weight: bold;">
                                            ' . strtoupper(utf8_decode($agrupador['denominacion'])) . '
                                            <span style="text-align: left;font-weight: normal;">(' . $expresionmostrarconformato . ')</span>
                                        </td>
                                        
                                    </tr>';
                                    }
                                }
                                $arrayind[$conteval]['idindicador'] = $rif;
                                $arrayind[$conteval]['valor'] = (empty($valor)) ? 0 : $valor;
                                $conteval++;
                                break;
                            }
                        }
                    }

                    //Valor de la formula del indicador
                    $valorfind = $objFormulas->evaluarExpresionMatematica($arrayind, $expmostrar);
                    if (!empty($valorfind->valor)) {
                        $color = (!empty($agrupador['estotal'])) ? '#8a0e1b' : '#0f0f0f';
                        list(, $decimales) = explode('.', $valorfind->valor);
                        $bodycorreo .= '
                        <tr>
                            <td colspan="3" style="text-align: right; font-weight: bold; color: ' . $color . '">
                                <u>' . number_format($valorfind->valor, strlen($decimales.''), '.', '') . '</u>
                            </td>
                        </tr>';
                        $ragrupadores[$agrupador['idcamporeportecorreo']] = $valorfind->valor;
                        if (!empty($agrupador['estotal'])) {
                            $this->rtotales[$agrupador['denominacion']] = $valorfind->valor;
                        }
                    } else {
                        $ragrupadores[$agrupador['idcamporeportecorreo']] = 0.00;
                    }
                }
            }
        }
        $bodycorreo .= '
           </tbody>
        </table>';

        //Pintar Vacaciones y SNC
        foreach ($r as $i => $agrupador) {
            //Submayor vacaciones
            if ($agrupador['mostrarvacaciones'] == 1) {
                $operacionessubmayor = GestsubmayorvacacionesController::obtenerListadoSaldosAcumuladosVacacionesPersona($this->identidad, $this->mes, $this->anno);
                $this->fnPintarSubmayorVacaciones($bodycorreo, $idpersona, $operacionessubmayor);
            }

            //SNC
            if ($agrupador['mostrarsnc'] == 1) {
                $snc = DatRegistroSalarioTiempoServicio::obtenerListadoDatRegistroSalarioMes($idpersona, $this->identidad, $this->mes, $this->anno);
                if (!empty($snc)) {
                    $this->fnPintarSNC($bodycorreo, $snc);
                }
            }
        }

        //Concatenando delante del cuerpo del correo los datos principales de la persona
        $datospersonas = "";
        $datospersonas .= '
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />             
                <div style="padding: 10px; width: 100%; height: auto;">
                      <table style="width: 100%;font-size: 11px;">
                          <tbody>
                             <tr bgcolor="#ebf0f5">
                                <td colspan="3" style="text-align: center;">
                                    <b>REPORTE DE N&Oacute;MINA POR TRABAJADOR</b>&nbsp;&nbsp;(' . strtoupper(utf8_decode($this->nombreempresa)) . ')
                                </td>
                             </tr>
                             <tr>
							    <td>   
                                    <b>CI:&nbsp;</b><span style="color: #006600">' . $persona['datosprincipales']['ci'] . '</span>&nbsp;&nbsp;
                                    <b>Nombre y apellidos:&nbsp;</b><span>' . utf8_decode($persona['datosprincipales']['nombreapellidos']) . '</span>&nbsp;&nbsp;
                                    <b>Per&iacute;odo de pago:&nbsp;</b><span>' . $this->fechaperiodo['fechainicioperiodo'] . '-' . $this->fechaperiodo['fechafinperiodo'] . '</span>
                                    <b>' . $this->nombremes . '</b>
                                </td>
                             </tr>
                             <tr>
                                <td colspan="3" style="text-align: left;">
                                    ' . utf8_decode("Notificación del salario a cobrar en el mes:");

        foreach ($this->rtotales as $t => $total) {
            $datospersonas .= '<b>&nbsp;' . $t . ':&nbsp;</b><u style="color: #8a0e1b; font-weight: bold;">' . number_format($total, 2, '.', '') . '</u>';
        }
        $datospersonas .= '     </td>
                             </tr>
                          </tbody>  
                      </table>';
        $bodycorreo = $datospersonas . $bodycorreo;
    }


    public function fnPintarSubmayorVacaciones(&$bodycorreo, $idpersona, $submayorvacaciones)
    {
        $op = $submayorvacaciones[$idpersona];
        if ($op) {
            $bodycorreo .= '
          <!--Vacaciones-->
          <table style="width: 100%;font-size: 11px;">
              <tbody>
              <tr bgcolor="#ebf0f5">
                  <th colspan="11" style="text-align: left;">
                      ' . strtoupper("Submayor vacaciones acumuladas") . '
                  </th>
              </tr>
              <tr bgcolor="#ebf0f5">
                  <th style="text-align: center; width: 16.666%"></th>
                  <th style="text-align: center; width: 16.666%" colspan="2">' . strtoupper(utf8_decode('SALDO ANTERIOR')) . '</th>
                  <th style="text-align: center; width: 16.666%" colspan="2">' . strtoupper(utf8_decode('ACUMULADO PERÍODO')) . '</th>
                  <th style="text-align: center;width: 16.666%" colspan="2">' . strtoupper(utf8_decode('LIQUIDADO PERÍODO')) . '</th>
                  <th style="text-align: center;width: 16.666%" colspan="2">' . strtoupper(utf8_decode('AJUSTES PERÍODO')) . '</th>
                  <th style="text-align: center;width: 16.666%" colspan="2">' . strtoupper(utf8_decode('SALDO ACUMULADO')) . '</th>
              </tr>
              <tr><!--bgcolor="#ebf0f5"-->
                  <th style="text-align: center; " ><u>' . '' . '</u></th>
                  <th style="text-align: center;" ><u>' . strtoupper(utf8_decode('DÍAS')) . '</u></th>
                  <th style="text-align: center;" ><u>' . strtoupper(utf8_decode('IMPORTE')) . '</u></th>
                  <th style="text-align: center;" ><u>' . strtoupper(utf8_decode('DÍAS')) . '</u></th>
                  <th style="text-align: center;" ><u>' . strtoupper(utf8_decode('IMPORTE')) . '</u></th>
                  <th style="text-align: center;" ><u>' . strtoupper(utf8_decode('DÍAS')) . '</u></th>
                  <th style="text-align: center;" ><u>' . strtoupper(utf8_decode('IMPORTE')) . '</u></th>
                  <th style="text-align: center;" ><u>' . strtoupper(utf8_decode('DÍAS')) . '</u></th>
                  <th style="text-align: center;" ><u>' . strtoupper(utf8_decode('IMPORTE')) . '</u></th>
                  <th style="text-align: center;" ><u>' . strtoupper(utf8_decode('DÍAS')) . '</u></th>
                  <th style="text-align: center;" ><u>' . strtoupper(utf8_decode('IMPORTE')) . '</u></th>
              </tr>
              <tr><!--bgcolor="#ebf0f5"-->
                  <td style="text-align: center;">-</td>
                  <td style="text-align: center;">' . number_format($op['saldotiempomesanterior'], 2, '.', '') . '</td>
                  <td style="text-align: center;">' . number_format($op['saldoimportemesanterior'], 2, '.', '') . '</td>
                  
                  <td style="text-align: center;">' . number_format($op['tiempoacumulado'], 2, '.', '') . '</td>
                  <td style="text-align: center;">' . number_format($op['importeacumulado'], 2, '.', '') . '</td>
                  
                  <td style="text-align: center;">' . number_format($op['tiempoliquidado'], 2, '.', '') . '</td>
                  <td style="text-align: center;">' . number_format($op['importeliquidado'], 2, '.', '') . '</td>
                  
                  <td style="text-align: center;">' . number_format($op['ajustetiempo'] ? $op['ajustetiempo'] : '-', 2, '.', '') . '</td>
                  <td style="text-align: center;">' . number_format($op['ajusteimporte'] ? $op['ajusteimporte'] : '-', 2, '.', '') . '</td>
                  
                  <th style="text-align: center;">' . number_format($op['saldoentiempo'], 2, '.', '') . '</th>
                  <th style="text-align: center;">' . number_format($op['saldoenimporte'], 2, '.', '') . '</th>
              </tr>
              </tbody>
          </table>';
        }//strtoupper(utf8_decode('DÍAS TRABAJADOS'))
    }

    public function fnPintarSNC(&$bodycorreo, $snc)
    {
        $bodycorreo .= '
          <!--SNC-->
          <table style="width: 100%;font-size: 11px;">
              <tbody>
              <tr bgcolor="#ebf0f5">
                  <th colspan="3" style="text-align: left;">
                     ' . strtoupper("Registro de salario y tiempo de servicio (SNC - 225)") . '
                  </th>
              </tr>
              <tr><!--bgcolor="#ebf0f5"-->      
                  <th style="width: 50%;text-align: left;"><u>' . strtoupper(utf8_decode('TIPO DE NÓMINA')) . '</u></th>
                  <th style="width: 40%;text-align: center;"><u>' . strtoupper(utf8_decode('DÍAS ACUMULADOS')) . '<u></th>
                  <th style="width: 10%;text-align: right;"><u>' . strtoupper(utf8_decode('SALARIO DEVENGADO')) . '<u></th>
              </tr>';

        $objTipoNomina = new NomTipoNomina();
        $totaldias = 0;
        $totalimporte = 0;
        foreach ($snc as $op) {
            $bodycorreo .= '
              <tr><!--bgcolor="#ebf0f5"-->
                  <td style="text-align: left;">' . utf8_decode($objTipoNomina->obtenerDenominacion($op['idtiponomina'])) . '</td>
                  <td style="text-align: center;">' . number_format($op['diasacumulados'], 0, '.', '') . '</td>
                  <td style="text-align: right;"><b>' . $op['salariodevengado'] . '</b></td>
              </tr>';
            $totaldias += $op['diasacumulados'];
            $totalimporte += $op['salariodevengado'];
        }

        //Pintando el total
        $bodycorreo .= '
               <tr><!--bgcolor="#ebf0f5"-->
                    <th style="text-align: left;"> <u>Total</u></th>
                    <th style="text-align: center;"><u>' . $totaldias . '</u></th>
                    <th style="text-align: right;"><u>' . number_format($totalimporte, 2, '.', '') . '</u></td>
               </tr>
               </tbody>
          </table>';

    }

    //Configuracion
    public function fnConfiguracionCorreo(&$objPHPMailer, $receiver, &$body)
    {
        $objPHPMailer->IsSMTP();
        $objPHPMailer->IsHTML(true);
        $objPHPMailer->Mailer = $this->JSONCorreo->mailer;
        if (!empty($this->JSONCorreo->SMTPSecure))
            $objPHPMailer->SMTPSecure = $this->JSONCorreo->SMTPSecure;//tls  ssl
        $objPHPMailer->SMTPDebug = $this->JSONCorreo->SMTPDebug;
        $objPHPMailer->SMTPAuth = $this->JSONCorreo->SMTPAuth;
        $objPHPMailer->Host = $this->JSONCorreo->host;
        $objPHPMailer->Port = $this->JSONCorreo->port;
        $objPHPMailer->Username = $this->JSONCorreo->username;
        $objPHPMailer->Password = $this->JSONCorreo->password;
        $objPHPMailer->Timeout = $this->JSONCorreo->timeout;
        $objPHPMailer->From = $this->JSONCorreo->from;
        $objPHPMailer->FromName = utf8_decode($this->JSONCorreo->fromName);
        $objPHPMailer->AddAddress($receiver, $receiver);
        $objPHPMailer->Subject = utf8_decode($this->JSONCorreo->subject);
        $objPHPMailer->Body .= $body;
    }

    public function fnObtenerConfiguracionJSONCorreo($idconfig)
    {
        $config = file_get_contents(Zend_Registry::getInstance()->config->modulo_path . 'comun/recursos/json/confcorreo.json');
        $configdecode = (!is_array($config)) ? (array)json_decode($config) : json_decode($config);
        return $configdecode[$idconfig];
    }

    public function fnObtenerTodasConfiguracionesJSONCorreo()
    {
        return file_get_contents(Zend_Registry::getInstance()->config->modulo_path . 'comun/recursos/json/confcorreo.json');
    }

    public function fnGuardarConfiguracionJSONCorreo()
    {
        $configcorreo['bicsa'] = array("mailer" => "smtp", "SMTPSecure" => null, "SMTPDebug" => 2, "SMTPAuth" => 'true', "host" => "correo.bicsa.cu", "port" => 25, "username" => 'syst3ma@bicsa.cu', "password" => 'pass', "timeout" => 500, "from" => 'syst3ma@bicsa.cu', "fromName" => "Salario", "subject" => "Notificación sobre pago de salario mensual");
        $direccion = Zend_Registry::getInstance()->config->modulo_path . 'comun/recursos/json/confcorreo.json';
        $newJsonString = json_encode($configcorreo);
        file_put_contents($direccion, $newJsonString);
    }

    //Correo
    public function fnEnviarCorreo($body, $correo)
    {
        $objPHPMailer = new PHPMailer();
        /*$objPHPMailer->IsSMTP();
        $objPHPMailer->IsHTML(true);
        $objPHPMailer->SMTPDebug = 2;
        $objPHPMailer->Host = "correo.bicsa.co.cu";
        $objPHPMailer->Port = 25;
        $objPHPMailer->Username = 'systemarh@bicsa.co.cu';
        $objPHPMailer->Password = 'pppp.1234';
        $objPHPMailer->Mailer = "smtp";
        $objPHPMailer->Timeout = 500;
        $objPHPMailer->From = 'systemarh@bicsa.co.cu';
        $objPHPMailer->FromName = "Salario";
        $objPHPMailer->Subject = utf8_decode("Notificación del salario a cobrar en el mes");
        $objPHPMailer->AddAddress($correo, $correo);
        $objPHPMailer->Body .= $body;*/
        //Obtener json configuraciones correo
        $this->JSONCorreo = $this->fnObtenerConfiguracionJSONCorreo('distracu');//xetid; trd; bicsa, une

        $this->fnConfiguracionCorreo($objPHPMailer, $correo, $body);
        /*$objPHPMailer->Body .= "<p style='float: left; width: 90%; text-align: left; font-size: 12px; font-family: verdana,arial,helvetica,sans-serif;'><strong>Este correo</strong> ha sido generado por el sistema
                                    <strong>DISTRA - " . $this->abreviaturaempresa . "</strong>,&nbsp;
                                    <strong style='color: #8a0e1b'>favor no responder el mismo.</strong>
                                </p>";*/
        $objPHPMailer->Body .= '</div>';
        ob_start();
        $r = new stdClass();
        //print_r($objPHPMailer);die;
        if (!$objPHPMailer->send()) {
            echo "Mailer Error: " . $objPHPMailer->ErrorInfo;
        } else {
            echo "Ok";
            ob_get_clean();
            $r->codMsg = "Ok";
        }
    }

    //Servicio de todos los salarios de determinados peridos para una persona
    public function fnObtenerTotalesPago($denommoneda, $persona)
    {
        if (!empty($persona['nominas' . $denommoneda])) {
            $totalsuma = 0;
            $totalresta = 0;
            //Pintando los conceptos que suman
            foreach ($persona['nominas' . $denommoneda] as $denomtiponomina => $tiponomina) {
                if (!empty($tiponomina['conceptossuman'])) {
                    foreach ($tiponomina['conceptossuman'] as $concepto) {
                        if ($concepto['importe'] > 0) {
                            $totalsuma += $concepto['importe'];
                        }
                    }
                }
            }
            //Pintando los conceptos que restan
            foreach ($persona['nominas' . $denommoneda] as $denomtiponomina => $tiponomina) {
                if (!empty($tiponomina['conceptosrestan'])) {
                    foreach ($tiponomina['conceptosrestan'] as $concepto) {
                        if ($concepto['importe'] > 0) {
                            $totalresta += $concepto['importe'];
                        }
                    }
                }
            }
            return number_format(($totalsuma - $totalresta), 2, '.', '');
        }
    }

    public function todosSalariosPeriodosPersona($datos, $identidad, $personas)
    {
        //Obteniendo las operaciones submayorvacaciones de todas personas
        list($dia, $mes, $anno) = explode('/', $datos[0]['fechainicio']);
        $periodo = $mes . '-' . $anno;
        $operacionessubmayor = GestsubmayorvacacionesController::obtenerListadoSaldosAcumuladosVacacionesPersona($identidad, $mes, $anno);

        $datnom = new DatNominaDatos();
        $arrperso = array();
        $idelaborarpagos = array();
        foreach ($datos as $key => $value) {
            $val = $datnom->obtenerDatosNominaPorElaborarPago($value['idelaborarpagos']);
            foreach ($val as $k => $v) {
                //Reestructurando el arreglo de personas seleccionadas a las que se le enviara el correo
                $arrayvalores = array();
                if (empty($personas)) {
                    $arrayvalores = unserialize($v['valores']);
                } else {
                    foreach ($personas as $idpersonaesp) {
                        foreach (unserialize($v['valores']) as $key => $rv) {
                            list($idpersona) = explode('-', $rv['id']);
                            if ($idpersona == $idpersonaesp) {
                                $arrayvalores[] = $rv;
                            }
                        }
                    }
                }

                if (!empty($arrayvalores)) {
                    foreach ($arrayvalores as $key => $rv) {
                        $spli = explode('-', $rv['id']);
                        $idpersona = $spli[0];

                        $sql = "SELECT dp.idpersona,ddi.numero as ci,
                            (CASE WHEN dp.snombre = '' or dp.snombre is null THEN dp.nombre||' '||dp.papel||' '||dp.sapel 
                            ELSE dp.nombre||' '||dp.snombre||' '||dp.papel||' '||dp.sapel END) as nombre               
                            FROM mod_persona.dat_persona dp
                            INNER JOIN mod_persona.dat_docidentidad ddi ON (ddi.idpersona = dp.idpersona)
                            where dp.idpersona = ?";
                        $mg = Doctrine_Manager::getInstance();
                        $conn = $mg->getCurrentConnection();
                        $r = $conn->fetchAll($sql, array($idpersona));
                        $nombreapellidos = $r[0]['nombre'];
                        $ci = $r[0]['ci'];
                        $res = $this->fnObtenerDesglosePorNominas($value['idelaborarpagos'], $identidad, $rv);
                        $arrperso[$rv['id']]['datosprincipales'] = array('ci' => $ci, 'nombreapellidos' => $nombreapellidos);
                        if ($res['tipomoneda'] == '01') {
                            $arrperso[$rv['id']]['nominascup'][$res['tiponomina']] = array(
                                'conceptossuman' => $res['conceptossuman'],
                                'conceptosrestan' => $res['conceptosrestan'],
                                'conceptossbc' => $res['conceptossbc']
                            );
                        }
                        if ($res['tipomoneda'] == '02') {
                            $arrperso[$rv['id']]['nominascuc'][$res['tiponomina']] = array(
                                'conceptossuman' => $res['conceptossumancuc'],
                                'conceptosrestan' => $res['conceptosrestancuc']
                            );
                        }
                    }
                }
            }
            $idelaborarpagos[] = $value['idelaborarpagos'];
        }

        $result = array();
        if (!empty($arrperso)) {
            foreach ($arrperso as $key => $persona) {
                $idpersona = explode('-', $key)[0];
                $sncpersona = DatRegistroSalarioTiempoServicio::obtenerListadoDatRegistroSalarioMes($idpersona, $identidad, $mes, $anno);
                $submayorpersona = $operacionessubmayor[$idpersona];
                //Totales
                $totalcup = $this->fnObtenerTotalesPago('cup', $persona);
                $totalcuc = $this->fnObtenerTotalesPago('cuc', $persona);

                $result[$idpersona]['datosprincipales'] = $persona['datosprincipales'];
                $result[$idpersona]['datosprincipales']['idpersona'] = $idpersona;
                $result[$idpersona]['salariototalcup'] = $totalcup;
                $result[$idpersona]['salariototalcuc'] = $totalcuc;
                $result[$idpersona]['nominascup'] = $persona['nominascup'];
                $result[$idpersona]['nominascuc'] = $persona['nominascuc'];
                $result[$idpersona]['snc'] = $sncpersona;
                $result[$idpersona]['submayorvacaciones'] = $submayorpersona;
            }
        }

        return $result;
    }

    public function obtenerCuentasPorTipoMoneda($identidad, $numcuentamoneda)
    {
        $sqldatoscuenta = "select datcban.*, ntas.abreviatura as acreditacionsalario 
                           from mod_personaext.dat_cuentabancaria datcban
                           inner join mod_personaext.nom_tipoacreditacionsalario ntas on(ntas.idtipoacreditacionsalario = datcban.idtipoacreditacionsalario)
                           inner join mod_datosmaestros.nom_moneda mn on(mn.idmoneda = datcban.idmoneda)
			               where datcban.numerocuenta=?;";
        return Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqldatoscuenta, array($numcuentamoneda));
    }

    public function sincronizarFormulasAgrupadoresCorreo($identidad){
        $iocInterno = ZendExt_IoC_Inter::getInstance();
        $arrexpresionesmatematicas = array();
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sqlData = "select ccrc.idformula
                    from mod_nomina.conf_camposreportecorreo ccrc
                    inner join mod_nomina.conf_camposreportecorreoentidad ccrce on (ccrce.idcamporeportecorreo = ccrc.idcamporeportecorreo)
                    where ccrce.identidad = ?;";
        $arrformulas = $conn->fetchAll($sqlData, array($identidad));
        if(count($arrformulas)>0){
            foreach ($arrformulas as $rind){
                $arrexpresionesmatematicas[] = $rind['idformula'];
            }
        }
        //Si el arreglo tiene formulas
        if(count($arrexpresionesmatematicas)>0){
            $respuesta = $iocInterno->comun->GuardarExpresionesMatematicas($arrexpresionesmatematicas);
            return $respuesta;
            //Sino tiene formulas
        }else{
            return 'nosync';
        }
    }
}
