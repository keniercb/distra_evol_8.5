<?php

class ConfgeneralController extends ZendExt_Controller_Secure
{
    public function init()
    {
        parent::init();
    }

    public function confgeneralAction()
    {
        $this->render();
        $this->view->idioma = $this->global->Perfil->idioma;
    }//ok

    public function obtenerconfiguracionesAction()
    {
        $dirurl = NomencladoresnominaController::getDirUrl();
        $dirurl = (substr($dirurl, 0, 1) == '/') ? $dirurl : "/" . $dirurl;
        $arrArbol = array(
            [
                'id' => 1,//$v['idnomenclador'],
                'text' => 'Afiliaciones',//$v['denom'],
                'leaf' => true,//hoja
                'referencia' => 'confafiliacion',//$v['referencia'],
                'src' => $dirurl . 'views/js/confafiliaciones/confafiliaciones',//$this->getDirUrl().'views/js/'.$v['referencia']."/".$v['referencia'],
                'clase' => 'Pvd.Nomina.Configuracion.Afiliaciones'//$v['clase'],
            ], [
                'id' => 2,
                'text' => 'Montos por &aacute;reas',
                'leaf' => true,
                'referencia' => 'confmontosareas',
                'src' => $dirurl . 'views/js/confmontosareas/confmontosareas',
                'clase' => 'Pvd.Nomina.Configuracion.MontosAreas'
            ], [
                'id' => 3,
                'text' => 'Campos fichero banco',
                'leaf' => true,
                'referencia' => 'confcamposficherobanco',
                'src' => $dirurl . 'views/js/confcamposficherobanco/confcamposficherobanco',
                'clase' => 'Pvd.Nomina.Configuracion.CamposFicheroBanco'
            ], [
                'id' => 4,
                'text' => 'Campos reporte correo',
                'leaf' => true,
                'referencia' => 'confcamposreportecorreo',
                'src' => $dirurl . 'views/js/confcamposreportecorreo/confcamposreportecorreo',
                'clase' => 'Pvd.Nomina.Configuracion.CamposReporteCorreo'
            ], [
                'id' => 5,
                'text' => 'M&oacute;dulos',
                'leaf' => true,
                'referencia' => 'confmodulos',
                'src' => $dirurl . 'views/js/confmodulos/confmodulos',
                'clase' => 'Pvd.Nomina.Configuracion.Modulos'
            ], [
                'id' => 6,
                'text' => 'Orden campos n&oacute;mina',
                'leaf' => true,
                'referencia' => 'confordencamposnomina',
                'src' => $dirurl . 'views/js/confordencamposnomina/confordencamposnomina',
                'clase' => 'Pvd.Nomina.Configuracion.OrdenCamposNomina'
            ], [
                'id' => 7,
                'text' => 'Asociaci&oacute;n cuentas contables',
                'leaf' => true,
                'referencia' => 'confasociacioncuentascontables',
                'src' => $dirurl . 'views/js/confasociacioncuentascontables/confasociacioncuentascontables',
                'clase' => 'Pvd.Nomina.Configuracion.AsociacionCuentasContables'
            ]/*, [
                'id' => 99,
                'text' => 'Campos reporte talonario',
                'leaf' => true,
                'referencia' => 'confcamposreportetalonario',
                'src' => $dirurl . 'views/js/confcamposreportetalonario/confcamposreportetalonario',
                'clase' => 'Pvd.Nomina.Configuracion.CamposReporteTalonario'
            ]*/
        );
        echo Zend_Json::encode($arrArbol);
    }//ok

    //Afiliaciones****************************************************************************************************
    public function obtenerIndicadoresFormulasAction()
    {
        $arrConceptosRM = NomConceptoRM::obtenerListadoConceptosRM();
        $arrInd = array();
        foreach ($arrConceptosRM as $k => $v) {
            $arrInd[] = array(
                'idindicador' => 'CRM_' . $v['idconceptorm'],
                'indicador' => $v['denominacion'],
                'tipo' => 'Conceptos');
        }
        $arrCamposAgrupados = ConfigEstructurarModelosNomina::obtenerCamposAgrupadosReferencia();
        foreach ($arrCamposAgrupados as $k => $v) {
            $arrInd[] = array(
                'idindicador' => 'CA_' . $v['idestructuramodelodomina'],
                'indicador' => $v['denominacion'],
                'tipo' => $v['denomtiponomina']);
        }
        echo Zend_Json::encode(array('indicadores' => $arrInd));
    }

    public function obtenerListadoAfiliacionesAction()
    {
        //Denominacion de los tipos de pagos
        $arrtipospago = NomTipoPago::obtenerTodosTiposPago();
        $tipospago = array();
        foreach ($arrtipospago as $tp) {
            $tipospago[$tp['idtipopago']] = $tp['denominacion'];
        }

        //Datos de las afiliaciones
        $datos = ConfAfiliaciones::obtenerListadoAfiliaciones();
        $cant = ConfAfiliaciones::obtenerCantidadAfiliaciones();
        foreach ($datos as &$conf) {
            $denom = '';
            $tipospagosconf = explode(',', $conf['tipospagos']);
            foreach ($tipospagosconf as $idconf) {
                $denom .= $tipospago[$idconf] . ', ';
            }
            $conf['denomtipospagos'] = trim($denom, ', ');
            $conf['rtipospagos'] = $tipospagosconf;

            //Expresion a mostrar de la formula de la escala
            $ioc = ZendExt_IoC_Inter::getInstance();
            if ($conf['idformula'] != -1) {
                $datosformula = $ioc->comun->BuscarTodosporarrIdExpresionMatematica(array($conf['idformula']));
                $conf['expformula'] = $datosformula[0]['expresionamostrar'];
            } else
                $conf['expformula'] = '';

            //Expresion a mostrar de la formula salario devengado total
            $ioc = ZendExt_IoC_Inter::getInstance();
            if ($conf['idformuladevengadototal'] != -1) {
                $datosformula = $ioc->comun->BuscarTodosporarrIdExpresionMatematica(array($conf['idformuladevengadototal']));
                $conf['expformuladevengadototal'] = $datosformula[0]['expresionamostrar'];
            } else
                $conf['expformuladevengadototal'] = '';
        }

        echo json_encode(array('datos' => $datos, 'cantidad' => $cant));
    }

    public function adicionarAfiliacionesAction()
    {
        $idorganizacion = $this->_request->getPost('idorganizacion');
        $denominacion = $this->_request->getPost('denominacion');
        $arrtipospago = Zend_Json::decode(stripslashes($this->_getParam('arrtipospago')));
        $idformula = $this->_request->getPost('idformula');
        $idformuladevengadototal = $this->_request->getPost('idformuladevengadototal');
        $r = ConfAfiliacionesModel::adicionarAfiliacion($idorganizacion, $denominacion, $arrtipospago, $idformula, $idformuladevengadototal);
        echo json_encode($r);
    }

    public function modificarAfiliacionesAction()
    {
        $idconfafiliacion = $this->_request->getPost('idconfafiliacion');
        $idorganizacion = $this->_request->getPost('idorganizacion');
        $denominacion = $this->_request->getPost('denominacion');
        $arrtipospago = Zend_Json::decode(stripslashes($this->_getParam('arrtipospago')));
        $idformula = $this->_request->getPost('idformula');
        $idformuladevengadototal = $this->_request->getPost('idformuladevengadototal');
        //print_r(array($idconfafiliacion, $idorganizacion, $denominacion, $arrtipospago, $idformula, $idformuladevengadototal));die;
        $r = ConfAfiliacionesModel::modificarAfiliacion($idconfafiliacion, $idorganizacion, $denominacion, $arrtipospago, $idformula, $idformuladevengadototal);
        echo json_encode($r);
    }

    public function eliminarAfiliacionesAction()
    {
        $arridconfafiliacion = Zend_Json::decode(stripslashes($this->_getParam('arridconfafiliacion')));
        $r = ConfAfiliacionesModel::eliminarAfiliacion($arridconfafiliacion);
        echo json_encode($r);
    }

    public function obtenerTiposPagosAction()
    {
        $obj = new NomTipoPago();
        $r = $obj->obtenerTodosTiposPago();
        $c = $obj->obtenerCantidadTotalTiposPago();
        echo Zend_Json::encode(array('datos' => $r, 'cantidad' => $c));
    }

    public function obtenerOrganizacionesAction()
    {
        $idafiliacionmod= $this->_request->getPost('idafiliacion');//print_r($idafiliacionmod);die;
        $obj = new ConfAfiliaciones();
        $afiliaciones = $obj->obtenerListadoAfiliaciones();
        $obj = new ConfAfiliaciones();
        $organizaciones = $obj->obtenerTodasOrganizaciones();
        if (!empty($organizaciones)) {
            foreach ($organizaciones as $pos => $org) {
                foreach ($afiliaciones as $afi) {
                    if ($afi['idafiliacion'] == $org['idorganizacion'] && $idafiliacionmod != $afi['idafiliacion']) {
                        unset($organizaciones[$pos]);
                    }
                }
            }
        }
        $organizaciones = array_values($organizaciones);
        echo Zend_Json::encode(array('datos' => $organizaciones, 'cantidad' => count($organizaciones)));
    }

    //Montos Areas****************************************************************************************************
    public function obtenerConfigPagoResultadoAction()
    {
        $identidad = $this->_request->getPost('identidad');
        $obj = new ConfpagosporresultadosModel();
        $r = $obj->obtenerConfpagosporresultados($identidad);
        echo json_encode(array('datos' => $r, 'cantidad' => count($r)));
    }

    public function obtenerListadoAgrupadoresAreasAction()
    {
        $identidad = $this->_request->getPost('identidad');
        $idpagoporresultado = $this->_request->getPost('idpagoporresultado');
        $obj = new ConfAgrupadorAreasModel();
        $ioc = ZendExt_IoC_Inter::getInstance();
        $r = $obj->obtenerAgrupadores($identidad, $idpagoporresultado);
        foreach ($r as &$agrupador) {
            //Expresion a mostrar de la formula
            if ($agrupador['idformula'] != -1) {
                $datosformula = $ioc->comun->BuscarTodosporarrIdExpresionMatematica(array($agrupador['idformula']));
                $agrupador['expformula'] = $datosformula[0]['expresionamostrar'];
            } else
                $agrupador['expformula'] = '';
        }
        echo json_encode(array('datos' => $r, 'cantidad' => count($r)));
    }

    public function obtenerListadoAreasAction()
    {
        $identidad = $this->_request->getPost('identidad');
        $idagrupador = $this->_request->getPost('idagrupador');

        $objNomAreasModel = new NomAreasModel();
        $arrAreasEntidad = $objNomAreasModel->obtenerAreas($identidad);
        $arrAreas = array();
        foreach ($arrAreasEntidad as $area) {
            $arrAreas[$area['idarea']] = $area;
        }
        $obj = new ConfFormulasAreasMontosModel();
        $ioc = ZendExt_IoC_Inter::getInstance();
        $r = $obj->obtenerFormulasAreasMontos($idagrupador);
        foreach ($r as &$area) {
            $area['denominacion'] = $arrAreas[$area['idarea']]['area'];
            //Expresion a mostrar de la formula
            if ($area['idformula'] != -1) {
                $datosformula = $ioc->comun->BuscarTodosporarrIdExpresionMatematica(array($area['idformula']));
                $area['expformula'] = $datosformula[0]['expresionamostrar'];
            } else
                $area['expformula'] = '';
        }
        echo json_encode(array('datos' => $r, 'cantidad' => count($r)));
    }

    public function obtenerAreasComboAction()
    {
        $identidad = $this->_getParam('identidad');
        $idpagoporresultado = $this->_getParam('idpagoporresultado');
        $objNomAreasModel = new ConfPagosporresultadoarea();
        $objConfAgrupadorAreasModel = new ConfFormulasAreasMontosModel();
        $arrAreasEntidad = $objNomAreasModel->getAreasPagoPorResultadoDadoIdPago($identidad, $idpagoporresultado);//print_r($arrAreasEntidad);die;
        //$arrAreasEntidad = $objNomAreasModel->getAreasMontosPagoPorResultado($identidad,$idpagoporresultado);
        $arrAreasAgrupador = $objConfAgrupadorAreasModel->obtenerTodasAreasAgrupadores($identidad, $idpagoporresultado);
        if (!empty($arrAreasAgrupador)) {
            foreach ($arrAreasEntidad as $pos => $area) {
                foreach ($arrAreasAgrupador as $areaagrupador) {
                    if ($areaagrupador['idarea'] == $area['idarea']) {
                        unset($arrAreasEntidad[$pos]);
                    }
                }
            }
        }
        $arrAreasEntidad = array_values($arrAreasEntidad);
        echo Zend_Json::encode(array('datos' => $arrAreasEntidad));
    }

    public function obtenerIndFormulaAgrupadoresAction()
    {
        $identidad = $this->_getParam('identidad');
        $idpagoporresultado = $this->_getParam('idpagoporresultado');
        $idagrupadormod = $this->_getParam('idagrupador');
        $arrAgrupadores = ConfAgrupadorAreasModel::obtenerAgrupadores($identidad, $idpagoporresultado);
        if ($idagrupadormod != -1) {
            foreach ($arrAgrupadores as $a => $agrupador) {
                if ($agrupador['idagrupador'] >= $idagrupadormod) {
                    unset($arrAgrupadores[$a]);
                }
            }
            $arrAgrupadores = array_values($arrAgrupadores);
        }
        $arrInd = array();
        foreach ($arrAgrupadores as $agrupador) {
            $arrInd[] = array(
                'idindicador' => 'A_' . $agrupador['idagrupador'],
                'indicador' => $agrupador['denominacion'],
                'tipo' => 'Montos Agrupadores');
        }

        echo Zend_Json::encode(array('indicadores' => $arrInd));
    }

    public function obtenerIndFormulaAreasAction()
    {

    }

    public function adicionarAgrupadorAreasAction()
    {
        $identidad = $this->_request->getPost('identidad');
        $idpagoporresultado = $this->_request->getPost('idpagoporresultado');
        $denominacion = $this->_request->getPost('denominacion');
        $idformula = $this->_request->getPost('idformula');
        $r = ConfAgrupadorAreasModel::adicionarAgrupadores($identidad, $idpagoporresultado, $denominacion, $idformula);
        echo json_encode($r);
    }

    public function adicionarAreasAction()
    {
        $idagrupador = $this->_request->getPost('idagrupador');
        $arridareas = Zend_Json::decode(stripslashes($this->_getParam('arridareas')));
        $r = ConfFormulasAreasMontosModel::adicionarFormulasAreasMontos($idagrupador, $arridareas);
        echo json_encode($r);
    }

    public function modificarAgrupadorAreasAction()
    {
        $idagrupador = $this->_request->getPost('idagrupador');
        $identidad = $this->_request->getPost('identidad');
        $idpagoporresultado = $this->_request->getPost('idpagoporresultado');
        $denominacion = $this->_request->getPost('denominacion');
        $idformula = $this->_request->getPost('idformula');
        $r = ConfAgrupadorAreasModel::modificarAgrupadores($idagrupador, $identidad, $idpagoporresultado, $denominacion, $idformula);
        echo json_encode($r);
    }

    public function modificarFormulasAreasAction()
    {
        $arridformulaareamonto = Zend_Json::decode(stripslashes($this->_getParam('arridformulaareamonto')));
        $idformula = $this->_request->getPost('idformula');
        $r = ConfFormulasAreasMontosModel::modificarFormulasAreasMontos($arridformulaareamonto, $idformula);
        echo json_encode($r);
    }

    public function eliminarAgrupadorAreasAction()
    {
        $arridagrupadores = Zend_Json::decode(stripslashes($this->_getParam('arridagrupadores')));
        $r = ConfAgrupadorAreasModel::eliminarAgrupadores($arridagrupadores);
        echo json_encode($r);
    }

    public function eliminarAreasAction()
    {
        $idagrupador = $this->_request->getPost('idagrupador');
        $arridformulaareamonto = Zend_Json::decode(stripslashes($this->_getParam('arridformulaareamonto')));
        $r = ConfFormulasAreasMontosModel::eliminarFormulasAreasMontos($idagrupador, $arridformulaareamonto);
        echo json_encode($r);
    }

    //Campos fichero .dbf banco **************************************************************************************
    public function obtenerCamposDbfBancoAction()
    {

        $identidad = $this->_request->getPost('identidad');
        $objConfExportacionBanco = new ConfExportacionBanco();
        $arrcamposexpbanco = $objConfExportacionBanco->obtenerTodasConfExpBanco($identidad);//print_r($arrcamposexpbanco);die;
        $arrbancos = $objConfExportacionBanco->obtenerDenominacionBanco();
        $arrtipodatos = array('varchar', 'float', 'numeric', 'logical');
        $r = array();
        foreach ($arrcamposexpbanco as $i => $campo) {
            $r[$i] = $campo;
            $r[$i]['denombanco'] = $arrbancos[$campo['idbanco']]['abreviatura'];
            $r[$i]['denomtipodato'] = $arrtipodatos[$campo['tipodato']];
            if($campo['tipoformato'] == 1){
                $r[$i]['denomtipoformato'] = ".DBF";
            }else if($campo['tipoformato'] == 2){
                $r[$i]['denomtipoformato'] = ".TXT";
            }else{
                $r[$i]['denomtipoformato'] = "SIN FORMATO";
            }
        }
        //Imprimiendo el listado de las fechas de los periodos de pagos.
        echo Zend_Json::encode(array('datos' => $r, 'cantidad' => count($r)));
    }

    public function obtenerBancosAction()
    {
        $objConfExportacionBanco = new ConfExportacionBanco();
        $arrbancos = $objConfExportacionBanco->obtenerDenominacionBanco();
        $arrbancos = array_values($arrbancos);
        $r = array();
        foreach ($arrbancos as $i => $banco) {
            $r[$i] = $banco;
            $r[$i]['denombanco'] = $banco['nombre'] . ' (' . $banco['abreviatura'] . ')';
        }
        echo Zend_Json::encode(array('datos' => $r, 'cantidad' => count($r)));
    }

    public function obtenerOrdenDisponibleAction()
    {
        $identidad = $this->_request->getPost('identidad');
        $objModel = new ConfExportacionBanco();
        $r = $objModel->obtenerOrdenDisponible($identidad);
        echo Zend_Json::encode($r);
    }

    public function adicionarCamposDbfBancoAction()
    {
        $obj = new ConfExportacionBanco();
        $tipoadd = $this->_request->getPost('tipoadd');
        $identidad = $this->_request->getPost('identidad');
        $idbanco = $this->_request->getPost('idbanco');
        $tipoformato = $this->_request->getPost('tipoformato');
        $respuesta = '';
        if ($tipoadd != 1) {
            $denominacion = $this->_request->getPost('denominacion');
            $tipocampo = $this->_request->getPost('tipocampo');
            $tipodato = $this->_request->getPost('tipodato');
            $tipofichero = $this->_request->getPost('tipofichero');
            $longitudvalor = $this->_request->getPost('longitudvalor');
            $lugaresdecimales = $this->_request->getPost('lugaresdecimales');
            $orden = $this->_request->getPost('orden');
            switch ($tipodato) {
                case 'varchar':
                    $tipodato = 0;
                    break;
                case 'float':
                    $tipodato = 1;
                    break;
                case 'numeric':
                    $tipodato = 2;
                    break;
                case 'logical':
                    $tipodato = 3;
                    break;
                default:
                    $tipodato = 0;
                    break;
            }
            $respuesta = $obj->adicionarConfExpBanco($denominacion, $identidad, $idbanco, $tipocampo, $tipodato, $tipofichero, $longitudvalor, $lugaresdecimales, $orden, $tipoadd, $tipoformato);
        } else {
            $respuesta = $obj->adicionarConfExpBanco(null, $identidad, $idbanco, null, null, null, null, null, null, $tipoadd, $tipoformato);
        }
        $r = '';
        if (!empty($respuesta)) {
            $r = 'ADD-' . $respuesta;
        }
        echo json_encode(array('respuesta' => $r));
    }

    public function modificarCamposDbfBancoAction()
    {
        $obj = new ConfExportacionBanco();
        $idconfexportaciondbfbanco = $this->_request->getPost('idconfexportaciondbfbanco');
        $denominacion = $this->_request->getPost('denominacion');
        $identidad = $this->_request->getPost('identidad');
        $idbanco = $this->_request->getPost('idbanco');
        $tipocampo = $this->_request->getPost('tipocampo');
        $tipodato = $this->_request->getPost('tipodato');
        switch ($tipodato) {
            case 'varchar':
                $tipodato = 0;
                break;
            case 'float':
                $tipodato = 1;
                break;
            case 'numeric':
                $tipodato = 2;
                break;
            case 'logical':
                $tipodato = 3;
                break;
            default:
                $tipodato = 0;
                break;
        }
        $tipofichero = $this->_request->getPost('tipofichero');
        $longitudvalor = $this->_request->getPost('longitudvalor');
        $lugaresdecimales = $this->_request->getPost('lugaresdecimales');
        $orden = $this->_request->getPost('orden');

        $respuesta = $obj->modificarConfExpBanco($idconfexportaciondbfbanco, $denominacion, $idbanco, $tipocampo, $tipodato, $tipofichero, $longitudvalor, $lugaresdecimales, $orden);
        $r = '';
        if (!empty($respuesta)) {
            $r = 'MOD-' . $respuesta;
        }
        echo json_encode(array('respuesta' => $r));
    }

    public function eliminarCamposDbfBancoAction()
    {
        $identidad = $this->_getParam('identidad');
        $idconfexportaciondbfbanco = Zend_Json::decode(stripslashes($this->_getParam('idconfexportaciondbfbanco')));
        $obj = new ConfExportacionBanco();
        $respuesta = $obj->eliminarConfExpBanco($identidad, $idconfexportaciondbfbanco);
        echo json_encode($respuesta);
    }

    //Campos reporte correo *******************************************************************************************
    public function obtenerCamposReporteCorreoAction()
    {
        $identidad = $this->_request->getPost('identidad');
        $objConfExportacionBanco = new ConfCamposReporteCorreo();
        $r = $objConfExportacionBanco->fnObtenerReporteCorreoXIdEntidad($identidad);
        $ioc = ZendExt_IoC_Inter::getInstance();
        foreach ($r as &$item) {
            if ($item['idformula'] != -1) {
                $datosformula = $ioc->comun->BuscarTodosporarrIdExpresionMatematica(array($item['idformula']));
                $item['denomformula'] = $datosformula[0]['expresionamostrar'];
            } else
                $item['denomformula'] = '';
        }
        //denomformula
        echo Zend_Json::encode(array('datos' => $r, 'cantidad' => count($r)));
    }

    public function obtenerIndicadoresFormulasCamposCorreoAction()
    {
        $objConfigEstructurarModelosNomina = new ConfigEstructurarModelosNomina();
        $objConfExportacionBanco = new ConfCamposReporteCorreo();
        $identidad = $this->_request->getPost('identidad');
        $arrInd = array();
        $arrCamposEstructuraModeloNomina = $objConfigEstructurarModelosNomina->obtenerCamposXEntidad($identidad);
        foreach ($arrCamposEstructuraModeloNomina as $k => $v) {
            $arrInd[] = array(
                'idindicador' => 'CEMN_' . $v['idestructuramodelodomina'],
                'indicador' => $v['denominacion'],
                'tipo' => $v['denomtiponomina'],
                'orden' => 0,
                'aplicarorden' => 0);
        }

        $arrCamposAgrupadosReporteCorreo = $objConfExportacionBanco->fnObtenerReporteCorreoXIdEntidad($identidad);
        foreach ($arrCamposAgrupadosReporteCorreo as $k => $v) {
            $arrInd[] = array(
                'idindicador' => 'A_' . $v['idcamporeportecorreo'],
                'indicador' => $v['denominacion'],
                'tipo' => 'Agrupadores campos correo',
                'orden' => $v['orden'],
                'aplicarorden' => 1);
        }
        echo Zend_Json::encode(array('indicadores' => $arrInd));
    }

    public function adicionarCamposReporteCorreoAction()
    {
        $obj = new ConfCamposReporteCorreo();
        $params = array(
            'identidad' => $this->_request->getPost('identidad'),
            'denominacion' => $this->_request->getPost('denominacion'),
            'orden' => $this->_request->getPost('orden'),
            'mostrarvacaciones' => $this->_request->getPost('mostrarvacaciones'),
            'mostrarsnc' => $this->_request->getPost('mostrarsnc'),
            'idformula' => $this->_request->getPost('idformula'),
            'descripcion' => $this->_request->getPost('descripcion'),
            'estotal' => $this->_request->getPost('estotal')
        );

        $respuesta = $obj->fnAdicionarConfCamposReporteCorreo($params);
        $r = '';
        if (!empty($respuesta)) {
            $r = 'ADD-' . $respuesta;
        }
        echo json_encode(array('respuesta' => $r));
    }

    public function modificarCamposReporteCorreoAction()
    {
        $obj = new ConfCamposReporteCorreo();
        $params = array(
            'idcamporeportecorreo' => $this->_request->getPost('idcamporeportecorreo'),
            'identidad' => $this->_request->getPost('identidad'),
            'denominacion' => $this->_request->getPost('denominacion'),
            'orden' => $this->_request->getPost('orden'),
            'mostrarvacaciones' => $this->_request->getPost('mostrarvacaciones'),
            'mostrarsnc' => $this->_request->getPost('mostrarsnc'),
            'idformula' => $this->_request->getPost('idformula'),
            'descripcion' => $this->_request->getPost('descripcion'),
            'estotal' => $this->_request->getPost('estotal')
        );
        $respuesta = $obj->fnModificarConfCamposReporteCorreo($params);
        $r = '';
        if (!empty($respuesta)) {
            $r = 'MOD-' . $respuesta;
        }
        echo json_encode(array('respuesta' => $r));
    }

    public function eliminarCamposReporteCorreoAction()
    {
        $params = array(
            'idcamporeportecorreo' => Zend_Json::decode(stripslashes($this->_getParam('idcamporeportecorreo'))),
            'identidad' => $this->_request->getPost('identidad')
        );
        $obj = new ConfCamposReporteCorreo();
        $respuesta = $obj->fnEliminarConfCamposReporteCorreo($params);
        echo json_encode($respuesta);
    }

    public function replicarCamposReporteCorreoAction()
    {
        $params = array(
            'arridentidad' => Zend_Json::decode(stripslashes($this->_getParam('arridentidad'))),
            'arridcamporeportecorreo' => Zend_Json::decode(stripslashes($this->_getParam('arridcamporeportecorreo')))
        );

        $obj = new ConfCamposReporteCorreo();
        $respuesta = $obj->fnReplicarCamposReporteCorreo($params);
        $r = 'REP-' . $respuesta;;
        echo json_encode(array('respuesta' => $r));
    }

    public function obtenerOrdenDisponibleCorreoAction()
    {
        $identidad = $this->_request->getPost('identidad');
        $objModel = new ConfCamposReporteCorreo();
        $r = $objModel->fnObtenerOrdenDisponible($identidad);
        echo Zend_Json::encode($r);
    }

    //Campos reporte correo *******************************************************************************************
    public function obtenerCamposReporteTalonarioAction()
    {
        $identidad = $this->_request->getPost('identidad');
        $objConfExportacionBanco = new ConfCamposReporteTalonario();
        $r = $objConfExportacionBanco->fnObtenerReporteTalonarioXIdEntidad($identidad);
        $ioc = ZendExt_IoC_Inter::getInstance();
        foreach ($r as &$item) {
            if ($item['idformula'] != -1) {
                $datosformula = $ioc->comun->BuscarTodosporarrIdExpresionMatematica(array($item['idformula']));
                $item['denomformula'] = $datosformula[0]['expresionamostrar'];
            } else
                $item['denomformula'] = '';
        }
        //denomformula
        echo Zend_Json::encode(array('datos' => $r, 'cantidad' => count($r)));
    }

    public function obtenerIndicadoresFormulasCamposTalonarioAction()
    {
        $objConfigEstructurarModelosNomina = new ConfigEstructurarModelosNomina();
        $objConfExportacionBanco = new ConfCamposReporteTalonario();
        $identidad = $this->_request->getPost('identidad');
        $arrInd = array();
        $arrCamposEstructuraModeloNomina = $objConfigEstructurarModelosNomina->obtenerCamposXEntidad($identidad);
        foreach ($arrCamposEstructuraModeloNomina as $k => $v) {
            $arrInd[] = array(
                'idindicador' => 'CEMN_' . $v['idestructuramodelodomina'],
                'indicador' => $v['denominacion'],
                'tipo' => $v['denomtiponomina'],
                'orden' => 0,
                'aplicarorden' => 0);
        }

        $arrCamposAgrupadosReporteTalonario = $objConfExportacionBanco->fnObtenerReporteTalonarioXIdEntidad($identidad);
        foreach ($arrCamposAgrupadosReporteTalonario as $k => $v) {
            $arrInd[] = array(
                'idindicador' => 'A_' . $v['idcamporeportecorreo'],
                'indicador' => $v['denominacion'],
                'tipo' => 'Agrupadores campos correo',
                'orden' => $v['orden'],
                'aplicarorden' => 1);
        }
        echo Zend_Json::encode(array('indicadores' => $arrInd));
    }

    public function adicionarCamposReporteTalonarioAction()
    {
        $obj = new ConfCamposReporteTalonario();
        $params = array(
            'identidad' => $this->_request->getPost('identidad'),
            'denominacion' => $this->_request->getPost('denominacion'),
            'orden' => $this->_request->getPost('orden'),
            'mostrarvacaciones' => $this->_request->getPost('mostrarvacaciones'),
            'mostrarsnc' => $this->_request->getPost('mostrarsnc'),
            'idformula' => $this->_request->getPost('idformula'),
            'descripcion' => $this->_request->getPost('descripcion'),
            'estotal' => $this->_request->getPost('estotal')
        );

        $respuesta = $obj->fnAdicionarConfCamposReporteTalonario($params);
        $r = '';
        if (!empty($respuesta)) {
            $r = 'ADD-' . $respuesta;
        }
        echo json_encode(array('respuesta' => $r));
    }

    public function modificarCamposReporteTalonarioAction()
    {
        $obj = new ConfCamposReporteTalonario();
        $params = array(
            'idcamporeportecorreo' => $this->_request->getPost('idcamporeportecorreo'),
            'identidad' => $this->_request->getPost('identidad'),
            'denominacion' => $this->_request->getPost('denominacion'),
            'orden' => $this->_request->getPost('orden'),
            'mostrarvacaciones' => $this->_request->getPost('mostrarvacaciones'),
            'mostrarsnc' => $this->_request->getPost('mostrarsnc'),
            'idformula' => $this->_request->getPost('idformula'),
            'descripcion' => $this->_request->getPost('descripcion'),
            'estotal' => $this->_request->getPost('estotal')
        );
        $respuesta = $obj->fnModificarConfCamposReporteTalonario($params);
        $r = '';
        if (!empty($respuesta)) {
            $r = 'MOD-' . $respuesta;
        }
        echo json_encode(array('respuesta' => $r));
    }

    public function eliminarCamposReporteTalonarioAction()
    {
        $params = array(
            'idcamporeportecorreo' => Zend_Json::decode(stripslashes($this->_getParam('idcamporeportecorreo'))),
            'identidad' => $this->_request->getPost('identidad')
        );
        $obj = new ConfCamposReporteTalonario();
        $respuesta = $obj->fnEliminarConfCamposReporteTalonario($params);
        echo json_encode($respuesta);
    }

    public function replicarCamposReporteTalonarioAction()
    {
        $params = array(
            'arridentidad' => Zend_Json::decode(stripslashes($this->_getParam('arridentidad'))),
            'arridcamporeportecorreo' => Zend_Json::decode(stripslashes($this->_getParam('arridcamporeportecorreo')))
        );

        $obj = new ConfCamposReporteTalonario();
        $respuesta = $obj->fnReplicarCamposReporteTalonario($params);
        $r = 'REP-' . $respuesta;;
        echo json_encode(array('respuesta' => $r));
    }

    public function obtenerOrdenDisponibleTalonarioAction()
    {
        $identidad = $this->_request->getPost('identidad');
        $objModel = new ConfCamposReporteTalonario();
        $r = $objModel->fnObtenerOrdenDisponible($identidad);
        echo Zend_Json::encode($r);
    }

    //Campos de configuracion de modulos
    public function obtenerListadoModulosAction()
    {
        $identidad = $this->_request->getPost('identidad');
        //Datos de las afiliaciones
        $obj = new ConfModulosModel();
        $datos = $obj->obtenerListadoModulosEntidadConfiguracion($identidad);
        $cant = $obj->obtenerCantidadModulosEntidadConfiguracion($identidad);
        foreach ($datos as &$dat) {
            $dat['cobroypago'] = (!empty($dat['cobroypago'])) ? 1 : 0;
            $dat['apertura'] = (!empty($dat['apertura'])) ? 1 : 0;
            $dat['parrafofiscal'] = (!empty($dat['parrafofiscal'])) ? 1 : 0;
        }

        echo json_encode(array('datos' => $datos, 'cantidad' => $cant));
    }

    public function adicionarModulosAction()
    {
        $datos = array(
            'identificador' => $this->_request->getPost('identificador'),
            'denominacion' => $this->_request->getPost('denominacion'),
            'cobroypago' => $this->_request->getPost('cobroypago'),
            'apertura' => $this->_request->getPost('apertura'),
            'fijaretencionesporpagar' => $this->_request->getPost('fijaretencionesporpagar'),
            'identidad' => $this->_request->getPost('identidad'),
            'formato' => $this->_request->getPost('formato')
        );
        $r = ConfModulosModel::adicionarModulo($datos);
        echo json_encode($r);
    }

    public function modificarModulosAction()
    {
        $datos = array(
            'tabla' => $this->_request->getPost('tabla'),
            'idmoduloentidad' => $this->_request->getPost('idmoduloentidad'),
            'identificador' => $this->_request->getPost('identificador'),
            'denominacion' => $this->_request->getPost('denominacion'),
            'cobroypago' => $this->_request->getPost('cobroypago'),
            'apertura' => $this->_request->getPost('apertura'),
            'fijaretencionesporpagar' => $this->_request->getPost('fijaretencionesporpagar'),
            'identidad' => $this->_request->getPost('identidad')
        );
        $r = ConfModulosModel::modificarModulo($datos);
        echo json_encode($r);
    }

    public function eliminarModulosAction()
    {
        $arridmodulo = Zend_Json::decode(stripslashes($this->_getParam('arridmodulo')));
        $r = ConfModulosModel::eliminarModulo($arridmodulo);
        echo json_encode($r);
    }

    //Campos de configuracion orden reporte nomina
    public function obtenerCamposEstructuraNominaAction()
    {
        $identidad = $this->_request->getPost('identidad');
        $idtiponomina = $this->_request->getPost('idtiponomina');
        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        $arrFinal = array();
        $objModelModeloNomina = new ConfigEstructurarModelosNominaModel();
        $objDatNominaModel = new DatNominaModel();
        $arrmodelosnomina = $objModelModeloNomina->obtenerModeloNominaxIdTipoNomina($idtiponomina, $identidad, null, $start, $limit);
        foreach ($arrmodelosnomina as $i => $v) {
            $arrFinal[$i]['idestructuramodelodomina'] = $v['idestructuramodelodomina'];
            $arrFinal[$i]['idtiponomina'] = $v['idtiponomina'];
            $arrFinal[$i]['denominacion'] = $v['denominacion'];
            $arrFinal[$i]['ordenreporte'] = $v['ordenreporte'];
            $arrFinal[$i]['sc_4_06'] = $v['sc_4_06'];
            $arrFinal[$i]['sc_4_01'] = $v['sc_4_01'];
        }
        //Ordenando el arreglo por el ordenreporte
        $arrFinal = $objDatNominaModel->ordenarArrayPorClave($arrFinal, 'ordenreporte');
        $cantidad =$objModelModeloNomina->obtenerCantidadTotalModelosNomina($idtiponomina, $identidad);
        echo Zend_Json::encode(array('datos' => $arrFinal, 'cantidad' => $cantidad));
    }

    public function obtenerTiposNominasAction()
    {
        $modeloNegocioTipoN = new NomTipoNomina();
        $nomTipoPago = new NomTipoPago();
        $configModeloNomina = new ConfigModeloNomina();

        //Obteniendo el listado de tipos de nómina.
        $arrTiposN = $modeloNegocioTipoN->obtenerListadoTiposNomina(
            $this->_getParam('start', 0),
            $this->_getParam('limit', 1000),
            $this->_getParam('criterio')
        );
        foreach ($arrTiposN as $i => $tiponomina) {
            $idtipopago = $configModeloNomina->dameIdTipoPagoDadoId($tiponomina['idtiponomina']);
            $orden = $nomTipoPago->obtenerObjTipoPagoDadoId($idtipopago)->orden;
            $arrTiposN[$i]['orden'] = ($orden < 10) ? '0' . $orden : $orden;
        }
        //Obteniendo la cantidad total de tipos de nómina.
        $cantTotalTiposN = $modeloNegocioTipoN->obtenerCantidadTotalTiposNomina();

        //Imprimiendo el listado de tipos de nómina.
        echo Zend_Json::encode(array('datos' => $arrTiposN, 'cantidad' => $cantTotalTiposN));
    }

    public function modificarOrdenReporteCampoNominaAction()
    {
        $filasModificadas = Zend_Json::decode(stripslashes($this->_getParam('filasModificadas')));
        $objModelModeloNomina = new ConfigEstructurarModelosNominaModel();
        $obj = new stdClass();
        foreach ($filasModificadas as $i => $v) {
            //Obteniendo el modelo de nómina a modificar.
            $objModeloNomina = ConfigEstructurarModelosNomina::obtenerObjModelosNominaDadoId($v['idestructuramodelodomina']);
            $objModeloNomina->ordenreporte = $v['ordenreporte'];
            $objModeloNomina->save();
            if (!$objModelModeloNomina) {
                $obj->codMsg = 3;
                echo json_encode($obj);
            }
        }
        $obj->codMsg = 1;
        echo json_encode($obj);
    }

    public function exportarVistaPreviaNominaAction()
    {
        $identidad = $this->_request->getParam('identidad');
        $idtiponomina = $this->_request->getParam('idtiponomina');
        $objReporteVistaPreviaNominaModel = new ReporteVistaPreviaNominaModel();
        $r = $objReporteVistaPreviaNominaModel->fnCrearReportePDF($identidad, $idtiponomina);
        echo json_encode($r);
    }

    //Asociación cuentas contables
    public function obtenerAsociacionCuentasContablesAction()
    {
        $identidad = $this->_request->getPost('identidad');
        $idtiponomina = $this->_request->getPost('idtiponomina');
        //Obteniendo el nomenclador de valores contables
        $objDomain = new ConfAsociacionCuentasContables();
        $nomvalorcontab = $objDomain->fnObtenerNomValorContable();
        $objConceptosContables = new ConfigConceptosContables();

        //Obteniendo todas las asociaciones
        $objModel = new ConfAsociacionCuentasContablesModel();
        $arrasociaciones = $objModel->fnObtenerListadoAsociacionCuentas($identidad, $idtiponomina);
        $arrcuentasasociadas = array();
        $cont = 0;
        foreach ($arrasociaciones as $asociacion) {
            $arrcuentasasociadas[$cont]['idasociacioncuentascont'] = $asociacion['idasociacioncuentascont'];
            $arrcuentasasociadas[$cont]['identidad'] = $identidad;
            $arrcuentasasociadas[$cont]['idtiponomina'] = $asociacion['idtiponomina'];
            $arrcuentasasociadas[$cont]['denominacion'] = $asociacion['denominacion'];
            $cuentasdeudoras = '<b style="color: darkgreen">CUENTAS DEUDORAS: </b></br>';
            $cuentasacreedoras = '<b style="color: darkgreen">CUENTAS ACREEDORAS: </b></br>';

            //Obteniendo las denominaciones de las cuentas deudoras y los valores contables correspondientes
            $rcuentasdeudoras = unserialize($asociacion['cuentasdeudoras']);
            foreach ($rcuentasdeudoras as $cuentadeud) {
                list($idcuentadeudora, $listvalorescontables) = explode('-', $cuentadeud);
                $arrvalorescontables = explode(',', $listvalorescontables);
                //Denominacion de la cuenta
                $nomcuenta = $this->integrator->contabilidad->obtenerCuentaPorId($idcuentadeudora);
                $cuentasdeudoras .= '<b>Cuenta: </b>' . $nomcuenta->text . ' - ';

                //Denominaciones de los valores contables(array o integer)
                $valorescontables = '<b>Valor contable: </b>';
                foreach ($arrvalorescontables as $valor) {
                    $denomconccont = $objConceptosContables->obtenerDenominacionConfigConceptosContables($valor);
                    $valorescontables .= $denomconccont . '<b> ; </b>';
                }
                $cuentasdeudoras .= $valorescontables . '</br>';
            }

            //Obteniendo las denominaciones de las cuentas acreedoras y los valores contables correspondientes
            $rcuentasacreedoras = unserialize($asociacion['cuentasacreedoras']);
            foreach ($rcuentasacreedoras as $cuentaacred) {
                list($idcuentaacreedora, $listvalorescontables) = explode('-', $cuentaacred);
                $arrvalorescontables = explode(',', $listvalorescontables);
                //Denominacion de la cuenta
                $nomcuenta = $this->integrator->contabilidad->obtenerCuentaPorId($idcuentaacreedora);
                $cuentasacreedoras .= '<b>Cuenta: </b>' . $nomcuenta->text . ' - ';

                //Denominaciones de los valores contables(array o integer)
                $valorescontables = '<b>Valor contable: </b>';
                foreach ($arrvalorescontables as $valor) {
                    $valorescontables .= $nomvalorcontab[$valor] . '<b> ; </b>';
                }
                $cuentasacreedoras .= $valorescontables . '</br>';
            }

            $arrcuentasasociadas[$cont]['descripcion'] = $cuentasdeudoras . '</br>' . $cuentasacreedoras;
            $cont++;
        }

        echo Zend_Json::encode(array('datos' => $arrcuentasasociadas, 'cantidad' => count($arrcuentasasociadas)));
    }

    public function obtenerCuentasContablesDeudorasAction()
    {
        $identidad = $this->_request->getPost('identidad');
        $idtiponomina = $this->_request->getPost('idtiponomina');
        $objModel = new ConfAsociacionCuentasContablesModel();
        $objDomain = new ConfAsociacionCuentasContables();
        $objConceptosContables = new ConfigConceptosContables();

        //Obteniendo el nomenclador de valores contables


        //Obteniendo solo las cuentas deudoras que no estan asociadas
        $arrasociaciones = $objModel->fnObtenerListadoAsociacionCuentas($identidad, $idtiponomina);
        $rcuentasasociadas = array();
        if (!empty($arrasociaciones)) {
            foreach ($arrasociaciones as $asociacion) {
                $cuenta = unserialize($asociacion['cuentasdeudoras']);
                foreach ($cuenta as $id){
                    list($idcuenta,) = explode('-', $id);
                    $rcuentasasociadas[$idcuenta] = $idcuenta;
                }
            }
        }

        //Obteniendo todas las cuentas deudoras de contabilidad
        $objtiponomina = new NomTipoNomina();
        $operacioncontable = $objtiponomina->obtenerObjTipoNominaDadoId($idtiponomina)->operacioncontable;
        $arrcuentas = array();
        $cont = 0;
        if (!empty($operacioncontable)) {
            $datosoperacioncont = $this->integrator->datosmaestros->obtenerOperaciones(/*$identidad*/
                null, null, null, $operacioncontable);
            $idmodelo = $datosoperacioncont[0]['idmodelo'];
            $modelo = $this->integrator->datosmaestros->getModeloContab($idmodelo);
            foreach ($modelo as $i => $m) {
                if ($m['creditodebito'] == 1 && !$rcuentasasociadas[$m['cuenta']]) {//Cuentas deudoras
                    //El valor contable viene en forma de arreglo o un valor numerico
                    $valorcontable = '';
                    $arrvalorcontable = (array)$m['valor']['valor'];
                    $idvalorcontable = implode(',', (array)$m['valor']['valor']);
                    foreach ($arrvalorcontable as $id) {
                        $denomconccont = $objConceptosContables->obtenerDenominacionConfigConceptosContables($id);
                        $valorcontable .= $denomconccont . ';';
                    }
                    $arrcuentas[$cont]['valorcontable'] = trim($valorcontable, ';');
                    //idcuentadeudora-idvalorcontable
                    $arrcuentas[$cont]['idcuentadeudora'] = $m['cuenta'] . '-' . $idvalorcontable;
                    $arrcuentas[$cont]['idtiponomina'] = $m['idtiponomina'];
                    $nomcuenta = $this->integrator->contabilidad->obtenerCuentaPorId($m['cuenta']);
                    $arrcuentas[$cont]['denominacion'] = $nomcuenta->text;
                    $cont++;
                }
            }
        }
        echo Zend_Json::encode(array('datos' => $arrcuentas, 'cantidad' => count($arrcuentas)));
    }

    public function obtenerCuentasContablesAcreedorasAction()
    {
        $identidad = $this->_request->getPost('identidad');
        $idtiponomina = $this->_request->getPost('idtiponomina');
        $objModel = new ConfAsociacionCuentasContablesModel();
        $objDomain = new ConfAsociacionCuentasContables();
        $objConceptosContables = new ConfigConceptosContables();

        //Obteniendo el nomenclador de valores contables
        $nomvalorcontab = $objDomain->fnObtenerNomValorContable();

        //Obteniendo solo las cuentas acreedoras que no estan asociadas
        $arrasociaciones = $objModel->fnObtenerListadoAsociacionCuentas($identidad, $idtiponomina);
        $rcuentasasociadas = array();
        if (!empty($arrasociaciones)) {
            foreach ($arrasociaciones as $asociacion) {
                $cuenta = unserialize($asociacion['cuentasacreedoras']);
                foreach ($cuenta as $id){
                    list($idcuenta,) = explode('-', $id);
                    $rcuentasasociadas[$idcuenta] = $idcuenta;
                }
            }
        }

        //Obteniendo todas las cuentas acreedoras de contabilidad
        $objtiponomina = new NomTipoNomina();
        $operacioncontable = $objtiponomina->obtenerObjTipoNominaDadoId($idtiponomina)->operacioncontable;
        $arrcuentas = array();
        $cont = 0;
        if (!empty($operacioncontable)) {
            $datosoperacioncont = $this->integrator->datosmaestros->obtenerOperaciones(null, null, null, $operacioncontable);
            $idmodelo = $datosoperacioncont[0]['idmodelo'];
            $modelo = $this->integrator->datosmaestros->getModeloContab($idmodelo);
            foreach ($modelo as $i => $m) {
                if ($m['creditodebito'] == 2 && !$rcuentasasociadas[$m['cuenta']]) {//Cuentas acreedoras
                    //El valor contable viene en forma de arreglo o un valor numerico
                    $valorcontable = '';
                    $arrvalorcontable = (array)$m['valor']['valor'];
                    $idvalorcontable = implode(',', (array)$m['valor']['valor']);
                    foreach ($arrvalorcontable as $id) {
                        $denomconccont = $objConceptosContables->obtenerDenominacionConfigConceptosContables($id);
                        $valorcontable .= $denomconccont . ';';
                    }
                    $arrcuentas[$cont]['valorcontable'] = trim($valorcontable, ';');
                    //idcuentaacreedora-idvalorcontable
                    $arrcuentas[$cont]['idcuentaacreedora'] = $m['cuenta'] . '-' . $idvalorcontable;
                    $arrcuentas[$cont]['idtiponomina'] = $m['idtiponomina'];
                    $nomcuenta = $this->integrator->contabilidad->obtenerCuentaPorId($m['cuenta']);
                    $arrcuentas[$cont]['denominacion'] = $nomcuenta->text;
                    $cont++;
                }
            }
        }

        echo Zend_Json::encode(array('datos' => $arrcuentas, 'cantidad' => count($arrcuentas)));
    }

    public function asociarCuentasAcreedorasAction()
    {
        $identidad = $this->_request->getPost('identidad');
        $idtiponomina = $this->_request->getPost('idtiponomina');
        $denominacion = $this->_request->getPost('denominacion');
        $arrcuentasdeudoras = Zend_Json::decode(stripslashes($this->_getParam('arrcuentasdeudoras')));
        $arrcuentaacreedoras = Zend_Json::decode(stripslashes($this->_getParam('arrcuentasacreedoras')));
        $objModel = new ConfAsociacionCuentasContablesModel();
        $respuesta = $objModel->fnAdicionarAsociacionCuenta($identidad, $idtiponomina, $denominacion, $arrcuentasdeudoras, $arrcuentaacreedoras);
        echo json_encode(array('respuesta' => $respuesta));
    }

    public function eliminarCuentasAcreedorasAction()
    {
        $arrcuentaacreedoras = Zend_Json::decode(stripslashes($this->_getParam('arrcuentaacreedoras')));
        $objModel = new ConfAsociacionCuentasContablesModel();
        $respuesta = $objModel->fnEliminarAsociacionCuenta($arrcuentaacreedoras);
        echo json_encode(array('respuesta' => $respuesta));
    }

    public function replicarCuentasAsociadasAction()
    {
        $identidad = $this->_request->getPost('identidad');
        $arridentidades = Zend_Json::decode(stripslashes($this->_getParam('arridentidades')));
        $arridtiponominas = Zend_Json::decode(stripslashes($this->_getParam('arridtiponominas')));
        $objModel = new ConfAsociacionCuentasContablesModel();
        $respuesta = $objModel->fnReplicarAsociacionCuentas($identidad, $arridentidades, $arridtiponominas);
        echo json_encode(array('respuesta' => $respuesta));
    }
}
