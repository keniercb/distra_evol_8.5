<?php

/**
 * Controlador para gestionar elementos salariales a las personas.
 *
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Configuracion.
 * @category Clase controladora.
 * @uses
 * @copyright XETID
 * @version 1.0
 */
class EstructurarmodelosnominaController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase.
     */
    public function init()
    {
        parent::init();

        $this->datosMostrarPersona = null;
        $xml = new NXML('campos_persona.xml');
        $x = $xml->LeerDatosCamposPersona(null, 1); //Cargo todos los campos del XML
        //print_r($x);die;
        $pos = 1;
        foreach ($x as $i => $v) {
            $this->datosMostrarPersona[$pos]['valor'] = (string)$v->valor;
            $this->datosMostrarPersona[$pos]['denominacion'] = (string)$v->denominacion;
            $pos++;
        }

        $this->spc = array('valor' => 'SPC', 'denominacion' => 'Sueldo por cargo');

        /*
         * Tipos
         * 1 - Sueldo por cargo
         * 2 - Retenciones
         * 3 - Conceptos de la retribucion monetaria
         * 5 - Conceptos de percepcion y descuentos
         *
         * */

    }

    /**
     * Acción utilizada para mostrar la vista de gestión de los tipos de nómina.
     */
    public function estructurarmodelosnominaAction()
    {

        //Agregando a la vista los ficheros js de la ayuda.
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->idioma = $this->global->Perfil->idioma;

        /*$this->view->dir_ComprobanteClass = $this->integrator->comun->dir_ComprobanteClass();
            $this->view->dir_ComprobanteUI = $this->integrator->comun->dir_ComprobanteUI();*/

        //Mostrando la vista.
        $this->render();
    }

    public function obtenerListadoTiposNominaAction()
    {
        //Creando el modelo de negocio de gestion de tipos de nómina.
        $modeloNegocioTipoN = new NomTipoNomina();
        $nomTipoPago = new NomTipoPago();
        $configModeloNomina = new ConfigModeloNomina();

        //Obteniendo el listado de tipos de nómina.
        $arrTiposN = $modeloNegocioTipoN->obtenerListadoTiposNomina(
            $this->_getParam('start', 0),
            $this->_getParam('limit', 20),
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

    public function obtenerAcumulacionLiquidacionAction()
    {
        $acumulaliquida = $this->_request->getPost('acumulaliquida');
        $array = array();
        $cont = 0;
        if ($acumulaliquida == 1) {
            $array[0]['idacumulaliquida'] = 1;
            $array[0]['acumulaliquida'] = 'Acumulación en días';
            $array[1]['idacumulaliquida'] = 2;
            $array[1]['acumulaliquida'] = 'Acumulación en importe';
            $array[2]['idacumulaliquida'] = 0;
            $array[2]['acumulaliquida'] = 'No Acumula/Liquida';
        } else if ($acumulaliquida == 2) {
            $array[0]['idacumulaliquida'] = 1;
            $array[0]['acumulaliquida'] = 'Liquidación en días';
            $array[1]['idacumulaliquida'] = 2;
            $array[1]['acumulaliquida'] = 'Liquidación en importe';
            $array[2]['idacumulaliquida'] = 0;
            $array[2]['acumulaliquida'] = 'No Acumula/Liquida';
        } else if ($acumulaliquida == 3) {
            $array[0]['idacumulaliquida'] = 0;
            $array[0]['acumulaliquida'] = 'No Acumula/Liquida';
        } else if ($acumulaliquida == 4) {
            $array[0]['idacumulaliquida'] = 1;
            $array[0]['acumulaliquida'] = 'Acumulación en días';
            $array[1]['idacumulaliquida'] = 2;
            $array[1]['acumulaliquida'] = 'Acumulación en importe';

            $array[2]['idacumulaliquida'] = 3;
            $array[2]['acumulaliquida'] = 'Liquidación en días';
            $array[3]['idacumulaliquida'] = 4;
            $array[3]['acumulaliquida'] = 'Liquidación en importe';


            $array[4]['idacumulaliquida'] = 0;
            $array[4]['acumulaliquida'] = 'No Acumula/Liquida';

        }

        echo Zend_Json::encode(array('datos' => $array, 'cantidad' => count($array)));
    }

    public function obtenerObjetosAction()
    {
        //Obteniendo los objetos del subsistema CH
        $sqlObjeto = "select datobj.idobjeto, objeto.denominacion as denominacion from mod_datosmaestros.nom_objetos objeto
			                                  inner join mod_datosmaestros.dat_objeto datobj on (datobj.idobjetos  = objeto.idobjetos )
			                                  where datobj.idestructurasubsist=990000000010;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $objeto = $conn->fetchAll($sqlObjeto);
        $arrobj = array();
        foreach ($objeto as $cont => $obj) {
            $arrobj[$cont]['idobjeto'] = $obj['idobjeto'];
            $arrobj[$cont]['denominacion'] = $obj['denominacion'];
        }
        //ObtenerOperacionesPorObjeto

        //Imprimiendo el listado de tipos de nómina.
        echo Zend_Json::encode(array('datos' => $arrobj, 'cantidad' => count($arrobj)));

    }

    public function obtenerOperacionesAction()
    {
        $idobjeto = $this->_request->getPost('idobjeto');
        //$operaciones = $this->integrator->parametros->ObtenerOperacionesPorObjeto($idobjeto);
        $sqlOperacion = "select datop.idoperacion, operacion.denominacion as denominacion from mod_datosmaestros.nom_operaciones operacion
			                                  inner join mod_datosmaestros.dat_operacion datop on (datop.idnomoperaciones  = operacion.idnomoperaciones )
			                                  where datop.idobjeto=? and datop.idestructurasubsist=990000000010;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $operacion = $conn->fetchAll($sqlOperacion, array($idobjeto));
        $arroperacion = array();
        foreach ($operacion as $cont => $obj) {
            $arroperacion[$cont]['idoperacion'] = $obj['idoperacion'];
            $arroperacion[$cont]['denominacion'] = $obj['denominacion'];
        }

        //Imprimiendo el listado de tipos de nómina.
        echo Zend_Json::encode(array('datos' => $arroperacion, 'cantidad' => count($arroperacion)));

    }

    public function obtenerCentrosCostoAction()
    {
        $idoperacion = $this->_request->getPost('idoperacion');
        //Dame la cuenta
        $sqlCuenta = "select operacion.idcuenta from mod_datosmaestros.dat_operacion operacion
			                                  inner join mod_contabilidad.nom_cuenta nc on (nc.idcuenta  = operacion.idcuenta )
			                                  where operacion.idoperacion=?;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $cuenta = $conn->fetchAll($sqlCuenta, array($idoperacion));
        $ccosto = $this->integrator->contabilidad_costos->ObtenerCentrosPorCuenta($this->global->Estructura->idestructura, $cuenta[0]['idcuenta']);
        $arrccosto = array();
        foreach ($ccosto['datos'] as $cont => $obj) {
            $arrccosto[$cont]['idcentrogrupo'] = $obj['idcentrogrupo'];
            $arrccosto[$cont]['denominacion'] = $obj['text'];
        }

        //Imprimiendo el listado de tipos de nómina.
        echo Zend_Json::encode(array('datos' => $arrccosto, 'cantidad' => count($arrccosto)));

    }

    public function obtenerElementosGastoAction()
    {
        $idcentrogrupo = $this->_request->getPost('idcentrogrupo');
        $idoperacion = $this->_request->getPost('idoperacion');
        //Dame la cuenta
        $sqlCuenta = "select operacion.idcuenta from mod_datosmaestros.dat_operacion operacion
			                                  inner join mod_contabilidad.nom_cuenta nc on (nc.idcuenta  = operacion.idcuenta )
			                                  where operacion.idoperacion=?;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $cuenta = $conn->fetchAll($sqlCuenta, array($idoperacion));

        $egasto = $this->integrator->contabilidad_costos->ObtenerElementosPorCuentaCentro($this->global->Estructura->idestructura, $cuenta[0]['idcuenta'], $idcentrogrupo);
        $arregasto = array();
        foreach ($egasto['datos'] as $cont => $obj) {
            $arregasto[$cont]['idelementoobjeto'] = $obj->idelementoobjeto;
            $arregasto[$cont]['denominacion'] = $obj->text;
        }

        //Imprimiendo el listado de tipos de nómina.
        echo Zend_Json::encode(array('datos' => $arregasto, 'cantidad' => count($arregasto)));

    }

    public function obtenerListadoTipoCampoAction()
    {
        $arrTipoCampo = array();
        $arrTipoCampo[0]['idtipocampo'] = 1;
        $arrTipoCampo[0]['denomtipocampo'] = "Persona";
        $arrTipoCampo[1]['idtipocampo'] = 2;
        $arrTipoCampo[1]['denomtipocampo'] = "Pago";
        $arrTipoCampo[2]['idtipocampo'] = 3;
        $arrTipoCampo[2]['denomtipocampo'] = "Agrupados";
        $arrTipoCampo[3]['idtipocampo'] = 4;
        $arrTipoCampo[3]['denomtipocampo'] = "Referencias a nóminas";
        $cantTotalTipoCampo = count($arrTipoCampo);

        //Imprimiendo el listado de tipos de campos.
        echo Zend_Json::encode(array('datos' => $arrTipoCampo, 'cantidad' => $cantTotalTipoCampo));

    }

    public function obtenerListadoValorMostrarAction()
    {
        $idtipocampo = $this->_request->getPost('idtipocampo');
        $arrValorMostrar = array();
        if ($idtipocampo == 1) {

            foreach ($this->datosMostrarPersona as $i => $dp) {
                $arrValorMostrar[] = array('idvalormostrar' => $dp['valor'], 'mostrarvalor' => $dp['denominacion']);
            }
            $cantTotalValorMostrar = count($arrValorMostrar);

            //Imprimiendo el listado de valores a mostrar.
            echo Zend_Json::encode(array('datos' => $arrValorMostrar, 'cantidad' => $cantTotalValorMostrar));
        } else {
            $cantTotalValorMostrar = count($arrValorMostrar);

            //Imprimiendo el listado de valores a mostrar.
            echo Zend_Json::encode(array('datos' => $arrValorMostrar, 'cantidad' => $cantTotalValorMostrar));

        }

    }

    public function obtenerVacacionesDiasImporteAction()
    {
        $arrVacacionesDiasImporte = array();
        $arrVacacionesDiasImporte[0]['idvacacionesdiasimporte'] = 1;
        $arrVacacionesDiasImporte[0]['diasimporte'] = "Días";
        $arrVacacionesDiasImporte[1]['idvacacionesdiasimporte'] = 2;
        $arrVacacionesDiasImporte[1]['diasimporte'] = "Importe";
        $arrVacacionesDiasImporte[2]['idvacacionesdiasimporte'] = 0;
        $arrVacacionesDiasImporte[2]['diasimporte'] = "No Días/Importe";
        //Imprimiendo el listado de vacaciones en Dias e Importe
        echo Zend_Json::encode(array('datos' => $arrVacacionesDiasImporte, 'cantidad' => count($arrVacacionesDiasImporte)));
    }

    public function guardarConfiguracionContabilizacionAction()
    {
        $idestructuramodelodomina = $this->_request->getPost('idestructuramodelodomina');
        $idobjeto = $this->_request->getPost('idobjeto');
        $idoperacion = $this->_request->getPost('idoperacion');
        $idcentrogrupo = $this->_request->getPost('idcentrogrupo');
        $idelementodelgasto = $this->_request->getPost('idelementodelgasto');

        $objconfcontabilizacion = new ConfigContabilizacion();
        $objconfcontabilizacion->idestructuramodelodomina = $idestructuramodelodomina;
        $objconfcontabilizacion->idobjeto = $idobjeto;
        $objconfcontabilizacion->idoperacion = $idoperacion;
        $objconfcontabilizacion->idcentrocosto = ($idcentrogrupo) ? $idcentrogrupo : 0;
        $objconfcontabilizacion->idelementogasto = ($idelementodelgasto) ? $idelementodelgasto : 0;
        $objconfcontabilizacion->save();

        //Imprimiendo el listado de tipos de nómina.
        echo Zend_Json::encode($mensaje->sms = 'Ok');

    }

    public function obtenerListadoEstructurasNominaAction()
    {
        $idtiponomina = $this->_request->getPost('idtiponomina');
        $idestructura = $this->_request->getPost('idestructura');
        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        $criterio = $this->_request->getPost('criterio');
        $arr = array();
        $arrIdValorMostrar = array();
        $denominacion = "";
        $arrFinal = array();
        $objDomainSistPago = new NomSistemaPago();
        $objDomainConceptosRM = new NomConceptoRM();
        $objDomainNomTipoRetencion = new NomTipoRetencion();
        $objDomainConceptosPD = new NomConceptoPercepcionDescuento();
        $objModelModeloNomina = new ConfigEstructurarModelosNominaModel();
        $objModeloNominaConceptos = new DatDatosModeloNominaConceptos();
        $objNomTipoNominas = new NomTipoNomina();
        $arrModeloNominaConceptos = array();
        $identidad = $this->global->Estructura->idestructura;

        $arrmodelosnomina = $objModelModeloNomina->obtenerModeloNominaxIdTipoNomina($idtiponomina, $idestructura, $criterio,$start,$limit);

        foreach ($arrmodelosnomina as $i => $v) {
            $arrFinal[$i]['idestructuramodelodomina'] = $v['idestructuramodelodomina'];
            $arrFinal[$i]['idtiponomina'] = $v['idtiponomina'];
            $arrFinal[$i]['denominacion'] = $v['denominacion'];
            $arrFinal[$i]['descripcion'] = $v['descripcion'];
            $arrFinal[$i]['idtipocampo'] = $v['idtipocampo'];
            $arrFinal[$i]['idperiodo'] = $v['periodobusquedareferencianomina'];
            $arrFinal[$i]['acumulaliquida'] = $v['acumulaliquida'];
            $arrFinal[$i]['diasimporte'] = $v['vacacionesdiasimporte'];
            $arrFinal[$i]['tiporeferencia'] = $v['tiporeferencia'];

            $arrFinal[$i]['descuento'] = $v['descuento'];
            $arrFinal[$i]['acumulaliquidanomina'] = $objNomTipoNominas::obtenerAcumulaLiquida($v['idtiponomina']);
            if ($v['idtipocampo'] == 1) {
                $arrFinal[$i]['denomtipocampo'] = "Persona";
                $arrFinal[$i]['idvalormostrar'] = $v['idvalormostrar'];
                $arrFinal[$i]['mostrarvalor'] = $this->datosMostrarPersona[$v['idvalormostrar']]['denominacion'];
                $arrFinal[$i]['textoformula'] = $v['textoformula'];
            } else if ($v['idtipocampo'] == 3) {
                $arrFinal[$i]['denomtipocampo'] = "Agrupados";
                $arrFinal[$i]['idvalormostrar'] = $v['idvalormostrar'];
                $arrFinal[$i]['mostrarvalor'] = $v['textoformula'];

            } else if ($v['idtipocampo'] == 4) {
                $arrFinal[$i]['denomtipocampo'] = ($v['tiporeferencia'] == 2)?"Referencias a nóminas - Periodos especificos":"Referencias a nóminas - Rangos de fecha";
                $arrFinal[$i]['idvalormostrar'] = $v['idvalormostrar'];
                $arrFinal[$i]['mostrarvalor'] = $v['textoformula'];

            } else {
                $texto = "";
                $arrFinal[$i]['denomtipocampo'] = "Pago";
                $arrModeloNominaConceptos = $objModeloNominaConceptos->obtenerListadoDatosModeloNominaConceptosxIdEstructurarModeloNomina($v['idestructuramodelodomina']);
                $z = 0;
                foreach ($arrModeloNominaConceptos as $s => $n) {
                    $arr = explode('_', $n['idconcepto']);
                    //Sincronizando los campos q no tengan tipo
                    if (!$n['tipo']) {
                        $objDatosModeloNominaConcepto = Doctrine::getTable('DatDatosModeloNominaConceptos')->find($n['iddatosmodelonominaconceptos']);
                        $objDatosModeloNominaConcepto->tipo = count($arr);
                        $objDatosModeloNominaConcepto->save();
                    }
                    if (count($arr) == 3) {
                        $denominacion = $objDomainConceptosRM->obtenerDenomXId($arr[2]);
                        if ($texto == "") {
                            $texto = $denominacion;
                        } else {
                            $texto = $texto . "," . $denominacion;
                        }
                        $arrIdValorMostrar[$z] = $n['idconcepto'];
                    } else if (count($arr) == 2) {
                        $denominacion = $objDomainNomTipoRetencion->obtenerDenomXId($arr[1]);
                        if ($texto == "") {
                            $texto = $denominacion;
                        } else {
                            $texto = $texto . "," . $denominacion;
                        }
                        $arrIdValorMostrar[$z] = $n['idconcepto'];
                    } else if (count($arr) == 1) {
                        $denominacion = $this->spc['denominacion']; //Sueldo por cargo
                        if ($texto == "") {
                            $texto = $denominacion;
                        } else {
                            $texto = $texto . "," . $denominacion;
                        }
                        $arrIdValorMostrar[$z] = $n['idconcepto'];
                    } else {
                        $denominacion = $objDomainConceptosPD->obtenerDenomXId($arr[4]);
                        if ($texto == "") {
                            $texto = $denominacion;
                        } else {
                            $texto = $texto . "," . $denominacion;
                        }
                        $arrIdValorMostrar[$z] = $n['idconcepto'];
                    }
                    $z++;
                }
                $arrFinal[$i]['mostrarvalor'] = $texto;
                $arrFinal[$i]['idvalormostrar'] = $arrIdValorMostrar;
                $arrFinal[$i]['textoformula'] = $v['textoformula'];
                $arrIdValorMostrar = array();
            }
            $arrFinal[$i]['visible'] = $v['visible'];
            $arrFinal[$i]['vervisible'] = ($arrFinal[$i]['visible'] == 1) ? "Si" : "No";
            $arrFinal[$i]['descuento'] = $v['descuento'];
            $arrFinal[$i]['verdescuento'] = ($arrFinal[$i]['descuento'] == 1) ? "Si" : "No";
            $arrFinal[$i]['sc_4_01'] = $v['sc_4_01'];
            $arrFinal[$i]['versc_4_01'] = ($arrFinal[$i]['sc_4_01'] == 1) ? "Si" : "No";
            $arrFinal[$i]['correo'] = $v['correo'];
            $arrFinal[$i]['vercorreo'] = ($v['correo'] == 1) ? "Si" : "No";
            $arrFinal[$i]['talonario'] = $v['talonario'];
            $arrFinal[$i]['vertalonario'] = ($v['talonario'] == 1) ? "Si" : "No";
            $arrFinal[$i]['sc_4_06'] = $v['sc_4_06'];
            $arrFinal[$i]['versc_4_06'] = ($arrFinal[$i]['sc_4_06'] == 1) ? "Si" : "No";
            $arrFinal[$i]['valoresnegativos'] = $v['valoresnegativos'];
            $arrFinal[$i]['vervaloresnegativos'] = ($arrFinal[$i]['valoresnegativos'] == 1) ? "Si" : "No";
            $arrFinal[$i]['orden'] = $v['orden'];
            $arrFinal[$i]['ordenreporte'] = $v['ordenreporte'];
            $arrFinal[$i]['esconceptopagosalario'] = $v['esconceptopagosalario'];
            $arrFinal[$i]['verconceptopagosalario'] = ($arrFinal[$i]['esconceptopagosalario'] == 1) ? "Si" : "No";
            $arrFinal[$i]['comportamientocorreo'] = (!empty($v['comportamientocorreo'])) ? $v['comportamientocorreo'] : 0;
            $arrFinal[$i]['idmessnc'] = $v['idmessnc'];
            if($v['idmessnc'] == 1){
                $arrFinal[$i]['messnc'] = '1 Mes Anterior';
            }else if($v['idmessnc'] == 2){
                $arrFinal[$i]['messnc'] = '1 Mes Posterior';
            }else{
                $arrFinal[$i]['messnc'] = null;
            }
            switch ($v['comportamientocorreo']) {
                case 0:
                    $arrFinal[$i]['vercomportamientocorreo'] = "Sin comportamiento";
                    break;
                case 1:
                    $arrFinal[$i]['vercomportamientocorreo'] = "Desglose SBC";
                    break;
                case 2:
                    $arrFinal[$i]['vercomportamientocorreo'] = "Suma";
                    break;
                case 3:
                    $arrFinal[$i]['vercomportamientocorreo'] = "Resta";
                    break;
                case 4:
                    $arrFinal[$i]['vercomportamientocorreo'] = "Pago por resultado";
                    break;
                default:
                    $arrFinal[$i]['vercomportamientocorreo'] = "Sin comportamiento";
                    break;
            }
        }

        $cantTotalModeloNomina = $objModelModeloNomina->obtenerCantidadTotalModelosNomina($idtiponomina,$idestructura);
        echo Zend_Json::encode(array('datos' => $arrFinal, 'cantidad' => $cantTotalModeloNomina));
    }

    public function cargarDatosIndicadoresAction()
    {
        $arr = array();
        $arrReturn = array();
        $arrModeloNominaConceptos = array();
        $idtiponomina = $this->_request->getPost('idtiponomina');
        $objDomainEstructurar = new ConfigEstructurarModelosNomina();
        $objModeloNominaConceptos = new DatDatosModeloNominaConceptos();
        $arrEstructurarxId = $objDomainEstructurar->obtenerModeloNominaxIdTipoNomina($idtiponomina);
        $pos = 0;
        foreach ($arrEstructurarxId as $i => $v) {
            if ($v['idtipocampo'] == 2) {
                $arrModeloNominaConceptos = $objModeloNominaConceptos->obtenerListadoDatosModeloNominaConceptosxIdEstructurarModeloNomina($v['idestructuramodelodomina']);
                foreach ($arrModeloNominaConceptos as $s => $n) {
                    $arr = explode('_', $n['idconcepto']);
                    //print_r($arr);die;
                    if (count($arr) == 1) {
                        $arrReturn[$pos]['idestructuramodelodomina'] = $v['idestructuramodelodomina'];
                        $arrReturn[$pos]['denominacion'] = $v['denominacion'];
                        $arrReturn[$pos]['agrupador'] = $this->spc['denominacion'];
                    } else if (count($arr) == 2) {
                        $arrReturn[$pos]['idestructuramodelodomina'] = $v['idestructuramodelodomina'];
                        $arrReturn[$pos]['denominacion'] = $v['denominacion'];
                        $arrReturn[$pos]['agrupador'] = "Retenciones";
                    } else if (count($arr) == 3) {
                        $arrReturn[$pos]['idestructuramodelodomina'] = $v['idestructuramodelodomina'];
                        $arrReturn[$pos]['denominacion'] = $v['denominacion'];
                        $arrReturn[$pos]['agrupador'] = "Conceptos generales de nómina";
                    } else {
                        $arrReturn[$pos]['idestructuramodelodomina'] = $v['idestructuramodelodomina'];
                        $arrReturn[$pos]['denominacion'] = $v['denominacion'];
                        $arrReturn[$pos]['agrupador'] = "Conceptos de percepción y descuento";
                    }
                    $pos++;
                }
            }
        }
        echo(json_encode($arrReturn));
    }

    public function cargarArbolSistemasPagoAction()
    {
        $flag = 0;
        $idpadreretencion = 0;
        $boolidpadreretencion = 0;
        $idTipoPago = 0;
        $seDesglosa = 0;
        $arrnodos = Zend_Json::decode(stripslashes($this->_getParam('arrnodos')));
        $accion = $this->_request->getPost('accion');

        $idtiponomina = $this->_request->getPost('idtiponomina');
        $idestructura = $this->_request->getPost('idestructura');
        $objNomTipoPago = new NomTipoPago();
        $objDomainConfModeloNomina = new ConfigModeloNomina();
        $existeIdTipoNomina = $objDomainConfModeloNomina->existeObjConfigModelosNominaDadoId($idtiponomina);
        $aux = array();

        $idTipoPago = $objDomainConfModeloNomina->dameIdTipoPagoDadoId($idtiponomina);
        $seDesglosa = $objNomTipoPago->dameSeDesglosaDadoIdPago($idTipoPago);
        //print_r($idtiponomina);die;
        if ($existeIdTipoNomina == 1) {
            if ($seDesglosa) {
                $objDomainSistPago = new NomSistemaPago();
                $arrSistemasPago = $objDomainSistPago->obtenerListadoTodosSistemasPago();
                foreach ($arrSistemasPago as $i => $v) {
                    $aux[$i]['id'] = $v['idsistemapago'];
                    foreach ($arrnodos as $s => $b) {
                        if ($b == $aux[$i]['id']) {
                            $flag = 1;
                            break;
                        } else {
                            $flag = 0;
                        }
                    }
                    $aux[$i]['idpadre'] = $v['idsistemapago'];
                    $idpadreretencion = $v['idsistemapago'];
                    $aux[$i]['text'] = $v['denominacion'];
                    $aux[$i]['leaf'] = 0;
                    $aux[$i]['children'] = $this->construirNodosHijosSeleccionables($v['idsistemapago'], $idTipoPago, $seDesglosa, $arrnodos, $idestructura);

                }
            } else {
                $aux = $this->construirNodosHijosSeleccionables(0, $idTipoPago, $seDesglosa, $arrnodos, $idestructura);
            }
            $boolidpadreretencion = ($idpadreretencion) ? $idpadreretencion : 0;
            $pos = count($aux);
            $aux[$pos] = $this->construirHijosRetenciones($boolidpadreretencion, $arrnodos);
            $aux[$pos + 1] = $this->construirNodoSueldoxCargo($boolidpadreretencion, $arrnodos);
        }
        echo(json_encode($aux));
    }

    public function construirHijosRetenciones($boolidpadreretencion, $arrnodos)
    {
        $arrRetenciones = array();
        $arrRetenciones['id'] = "Retenciones";
        $arrRetenciones['idpadre'] = $boolidpadreretencion;
        $arrRetenciones['text'] = "Retenciones";
        $arrRetenciones['leaf'] = 0;
        $arrRetenciones['expand'] = true;
        $arrRetenciones['children'] = $this->construirNodosRetenciones($arrnodos);

        return $arrRetenciones;
    }

    public function construirNodosRetenciones($arrnodos)
    {
        $flag = 0;
        $aux = array();
        $objDomainNomTipoRetencion = new NomTipoRetencion();
        $objDomainTodosNomTipoRetencion = $objDomainNomTipoRetencion->obtenerListadoTiposRetencion($inicio = 0, $limite = 10);

        if (count($objDomainTodosNomTipoRetencion)) {
            foreach ($objDomainTodosNomTipoRetencion as $i => $v) {
                $aux[$i]['id'] = "Retenciones_" . $v['idtiporetencion'];
                foreach ($arrnodos as $s => $b) {
                    if ($b == $aux[$i]['id']) {
                        $flag = 1;
                        break;
                    } else {
                        $flag = 0;
                    }
                }
                $aux[$i]['idpadre'] = "Retenciones";
                $denominacion = $objDomainNomTipoRetencion->obtenerDenomXId($v['idtiporetencion']);
                $aux[$i]['text'] = $denominacion;
                $aux[$i]['tipo'] = 2;
                $aux[$i]['leaf'] = 1;
                if ($flag == 1) {
                    $aux[$i]['checked'] = true;
                } else {
                    $aux[$i]['checked'] = false;
                }
            }
        } else {
            $aux = array();
        }
        return $aux;
    }

    public function construirNodoSueldoxCargo($boolidpadreretencion, $arrnodos)
    {
        $flag = 0;
        foreach ($arrnodos as $s => $b) {
            if ($b == "SPC") {
                $flag = 1;
                break;
            } else {
                $flag = 0;
            }
        }
        $arrSueldoCargo = array();
        $arrSueldoCargo['id'] = $this->spc['valor'];
        $arrSueldoCargo['idpadre'] = $boolidpadreretencion;
        $arrSueldoCargo['text'] = $this->spc['denominacion'];
        $arrSueldoCargo['tipo'] = 1;
        $arrSueldoCargo['leaf'] = 1;
        $arrSueldoCargo['expand'] = true;
        if ($flag == 1) {
            $arrSueldoCargo['checked'] = true;
        } else {
            $arrSueldoCargo['checked'] = false;
        }
        return $arrSueldoCargo;
    }

    public function construirNodosHijosSeleccionables($idpadre, $idTipoPago, $seDesglosa, $arrnodos, $idestructura)
    {
        $flag = 0; //print_r($idpadre);die;
        $objDomainConfConceptosGenerales = new ConfConceptosGeneralesNomina();
        $objDomainConceptosRM = new NomConceptoRM();
        $arrDomainConfConceptosGenerales = $objDomainConfConceptosGenerales->obtenerTodasConfConceptosGeneralesNomina($idestructura, $idpadre, $idTipoPago, $seDesglosa);
        $aux = array();
        $arreglo = array();
        if (count($arrDomainConfConceptosGenerales)) {
            //print_r($arrDomainConfConceptosGenerales);die;
            foreach ($arrDomainConfConceptosGenerales as $i => $v) {
                $aux[$i]['id'] = $idpadre . "_" . "CRM_" . $v['idconceptorm'];
                foreach ($arrnodos as $s => $b) {
                    if ($b == $aux[$i]['id']) {
                        $flag = 1;
                        break;
                    } else {
                        $flag = 0;
                    }
                }
                $aux[$i]['idpadre'] = $idpadre;
                $denominacion = $objDomainConceptosRM->obtenerDenomXId($v['idconceptorm']);
                $aux[$i]['text'] = $denominacion;
                $aux[$i]['tipo'] = 3;
                $aux[$i]['leaf'] = 0;
                if ($flag == 1) {
                    $aux[$i]['checked'] = true;
                    $aux[$i]['expand'] = true;
                } else {
                    $aux[$i]['checked'] = false;
                }
                $aux[$i]['children'] = $this->construirNodosHijosExpresionMatematica($aux[$i]['id'], $v['idexpresionmatematica'], $arrnodos);
            }
        } else {
            $aux = array();
        }
        return $aux;
    }

    public function construirNodosHijosExpresionMatematica($idpadre, $idexpresionmatematica, $arrnodos)
    {
        $flag = 0;
        $ioc = ZendExt_IoC_Inter::getInstance();
        $objDomainConceptosPD = new NomConceptoPercepcionDescuento();
        $rExpMat = $ioc->comun->ObtenerarrIdIndicadoresporExpresionMatematica($idexpresionmatematica);
        // print_r($rExpMat);die;
        $i = 0;
        foreach ($rExpMat as $n) {
            $id = explode('_', $n);
            if ($id[0] == "CPD") {
                $aux[$i]['id'] = $idpadre . "_" . "CPD_" . $id[1];
                foreach ($arrnodos as $s => $v) {
                    if ($v == $aux[$i]['id']) {
                        $flag = 1;
                        break;
                    } else {
                        $flag = 0;
                    }
                }
                $aux[$i]['idpadre'] = $idpadre;
                $denominacion = $objDomainConceptosPD->obtenerDenomXId($id[1]);
                $aux[$i]['text'] = $denominacion;
                $aux[$i]['tipo'] = 5;
                $aux[$i]['leaf'] = 1;
                $aux[$i]['children'] = null;
                if ($flag == 1) {
                    $aux[$i]['checked'] = true;
                    $aux[$i]['expand'] = true;
                } else {
                    $aux[$i]['checked'] = false;
                }
                $i++;
            }
        }
        if ($i == 0) {
            $aux = array();
            return $aux;
        } else {
            return $aux;
        }

    }

    public function adicionarEstructurasNominaAction()
    {
        $idtiponomina = $this->_request->getPost('idtiponomina');
        $denominacion = $this->_request->getPost('denominacion');
        $descripcion = $this->_request->getPost('descripcion');
        $idtipocampo = $this->_request->getPost('idtipocampo');
        $periodo = $this->_request->getPost('periodo');
        $tiporeferencia = $this->_request->getPost('tiporeferencia');
        $acumulaliquida = $this->_request->getPost('acumulaliquida');
        $acumulaliquida = ($acumulaliquida != '' ? $acumulaliquida : 0);
        $diasimportevac = $this->_request->getPost('diasimporte');
        $diasimportevac = (!empty($diasimportevac) ? $diasimportevac : 0);
        $orden = $this->_request->getPost('orden');
        $ordenreporte = $this->_request->getPost('ordenreporte');
        $descuento = $this->_request->getPost('descuento');
        $aceptavaloresnegativos = $this->_request->getPost('aceptavaloresnegativos');
        $esconceptopagosalario = $this->_request->getPost('esconceptopagosalario');
        $esconceptopagosalario = ($esconceptopagosalario != '' ? $esconceptopagosalario : 0);
        $visible = $this->_request->getPost('visible');
        $SC_4_01 = $this->_request->getPost('SC_4_01');
        $SC_4_06 = $this->_request->getPost('SC_4_06');
        $talonario = $this->_request->getPost('talonario');
        $correo = $this->_request->getPost('correo');
        $comportamientocorreo = $this->_request->getPost('comportamientocorreo');
        $textoformula = $this->_request->getPost('textoformula');
        $idestructura = $this->_request->getPost('identidad');
        $identidad = $this->global->Estructura->idestructura;
        $escampopersona = $this->_request->getPost('escampopersona');
        $idmessnc = $this->_request->getPost('idmessnc');
        $tipo = Zend_Json::decode(stripslashes($this->_getParam('tipo')));
        $objModelModeloNomina = new ConfigEstructurarModelosNominaModel();
        $obj = new stdClass();
        if ($idtipocampo == 2) {
            $idvalormostrar = Zend_Json::decode(stripslashes($this->_getParam('idvalormostrar')));
            $objestructuramodelodomina = $objModelModeloNomina->adicionarModelosNomina($idtiponomina, $denominacion, $idtipocampo, null, $orden, $ordenreporte, $visible, $descuento, $SC_4_01, $SC_4_06, $aceptavaloresnegativos, $esconceptopagosalario, $textoformula,
                $acumulaliquida, $idestructura, $escampopersona, $diasimportevac, $correo, $talonario, $periodo, $comportamientocorreo, $descripcion, $tiporeferencia, $idmessnc);
            if ($objestructuramodelodomina != 'existe') {
                $idestructuramodelodomina = $objestructuramodelodomina->idestructuramodelodomina;
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $conn->beginTransaction();
                $pos = 0;

                $objDatosModeloConceptos = $objModelModeloNomina->devolverObjeto();

                foreach ($idvalormostrar as $i => $v) {
                    $objDatosModeloConceptos[$pos]->idestructuramodelosnomina = $idestructuramodelodomina;
                    $objDatosModeloConceptos[$pos]->idconcepto = $v;
                    $objDatosModeloConceptos[$pos]->tipo = $tipo[$i];
                    $pos++;
                }
                $objDatosModeloConceptos->save();
                $conn->commit();
                $obj->codMsg = 1;
                echo json_encode($obj);
            } else {
                $obj->codMsg = 3;
                echo json_encode($obj);
            }
        } else {
            $idvalormostrar = $this->_request->getPost('idvalormostrar');
            $idestructuramodelodomina = $objModelModeloNomina->adicionarModelosNomina($idtiponomina, $denominacion, $idtipocampo, $idvalormostrar, $orden, $ordenreporte, $visible, $descuento, $SC_4_01, $SC_4_06, $aceptavaloresnegativos, $esconceptopagosalario,
                $textoformula, $acumulaliquida, $idestructura, $escampopersona, $diasimportevac, $correo, $talonario, $periodo, $comportamientocorreo, $descripcion, $tiporeferencia, $idmessnc);
            $obj->codMsg = 1;
            echo json_encode($obj);
        }
    }

    public function modificarEstructurasNominaAction()
    {
        $idestructuramodelodomina = $this->_request->getPost('idestructuramodelodomina');
        $objModelModeloNomina = new ConfigEstructurarModelosNominaModel();
        $objDatDatosEstructurar = new DatDatosModeloNominaConceptos();
        $idtiponomina = $this->_request->getPost('idtiponomina');
        $denominacion = $this->_request->getPost('denominacion');
        $descripcion = $this->_request->getPost('descripcion');
        $idtipocampo = $this->_request->getPost('idtipocampo');
        $periodo = $this->_request->getPost('periodo');
        $tiporeferencia = $this->_request->getPost('tiporeferencia');
        $acumulaliquida = $this->_request->getPost('acumulaliquida');
        $acumulaliquida = ($acumulaliquida != '' ? $acumulaliquida : 0);
        $diasimportevac = $this->_request->getPost('diasimporte');
        $diasimportevac = (!empty($diasimportevac) ? $diasimportevac : 0);
        $orden = $this->_request->getPost('orden');
        $ordenreporte = $this->_request->getPost('ordenreporte');
        $descuento = $this->_request->getPost('descuento');
        $aceptavaloresnegativos = $this->_request->getPost('aceptavaloresnegativos');
        $esconceptopagosalario = $this->_request->getPost('esconceptopagosalario');
        $esconceptopagosalario = ($esconceptopagosalario != '' ? $esconceptopagosalario : 0);
        $visible = $this->_request->getPost('visible');
        $SC_4_01 = $this->_request->getPost('SC_4_01');
        $SC_4_06 = $this->_request->getPost('SC_4_06');
        $talonario = $this->_request->getPost('talonario');
        $correo = $this->_request->getPost('correo');
        $comportamientocorreo = $this->_request->getPost('comportamientocorreo');
        $textoformula = $this->_request->getPost('textoformula');
        $identidad = $this->_request->getPost('identidad');
        $tipo = Zend_Json::decode(stripslashes($this->_getParam('tipo')));
        $escampopersona = $this->_request->getPost('escampopersona');
        $idmessnc = $this->_request->getPost('idmessnc');
        $obj = new stdClass();
        if ($idtipocampo == 2) {
            $idvalormostrar = Zend_Json::decode(stripslashes($this->_getParam('idvalormostrar')));
            $arrDatDatosModeloNomina = $objDatDatosEstructurar->obtenerListadoDatosModeloNominaConceptosxIdEstructurarModeloNomina($idestructuramodelodomina);
            $objexiste = $objModelModeloNomina->modificarModelosNomina($idestructuramodelodomina, $idtiponomina, $denominacion, $idtipocampo, null, $orden, $ordenreporte, $visible, $descuento, $SC_4_01, $SC_4_06, $aceptavaloresnegativos, $esconceptopagosalario,
                $textoformula, $acumulaliquida, $identidad, $escampopersona, $diasimportevac, $correo, $talonario, $periodo, $comportamientocorreo, $descripcion, $tiporeferencia, $idmessnc);
            if ($objexiste != 'existe') {
                foreach ($arrDatDatosModeloNomina as $n => $s) {
                    $objDelete = $objDatDatosEstructurar->obtenerObjDatosModeloNominaConceptosDadoId($s['iddatosmodelonominaconceptos']);
                    $objDelete->delete();
                }

                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $conn->beginTransaction();
                $pos = 0;

                $objDatosModeloConceptos = $objModelModeloNomina->devolverObjeto();

                foreach ($idvalormostrar as $i => $v) {
                    $objDatosModeloConceptos[$pos]->idestructuramodelosnomina = $idestructuramodelodomina;
                    $objDatosModeloConceptos[$pos]->idconcepto = $v;
                    $objDatosModeloConceptos[$pos]->tipo = $tipo[$i];
                    $pos++;
                }
                $objDatosModeloConceptos->save();
                $conn->commit();

                $obj->codMsg = 1;
                echo json_encode($obj);
            } else {
                $obj->codMsg = 3;
                echo json_encode($obj);
            }
        } else {
            $idvalormostrar = $this->_request->getPost('idvalormostrar');
            $objModelModeloNomina->modificarModelosNomina($idestructuramodelodomina, $idtiponomina, $denominacion, $idtipocampo, $idvalormostrar, $orden, $ordenreporte, $visible, $descuento, $SC_4_01, $SC_4_06, $aceptavaloresnegativos, $esconceptopagosalario,
                $textoformula, $acumulaliquida, null, $escampopersona, $diasimportevac, $correo, $talonario, $periodo, $comportamientocorreo, $descripcion, $tiporeferencia, $idmessnc);
            $obj->codMsg = 1;
            echo json_encode($obj);
        }
    }

    public function eliminarEstructurasNominaAction()
    {
        //$idestructuramodelodomina = $this->_request->getPost('idestructuramodelodomina');
        $arridestructuramodelodomina = Zend_Json::decode(stripslashes($this->_getParam('idestructuramodelodomina')));
        $arridentidad = Zend_Json::decode(stripslashes($this->_getParam('idestructura')));
        // $identidad = $this->global->Estructura->idestructura;
        $objModelModeloNomina = new ConfigEstructurarModelosNominaModel();
        $objModelModeloNomina->eliminarEstNomina($arridestructuramodelodomina, $arridentidad);
        echo "{'codMsg':'1'}";
    }

    public function modificarOrdenEstructurasNominaAction()
    {
        $filasModificadas = Zend_Json::decode(stripslashes($this->_getParam('filasModificadas')));
        $objModelModeloNomina = new ConfigEstructurarModelosNominaModel();
        foreach ($filasModificadas as $i => $v) {
            $idestructuramodelodomina = $v['idestructuramodelodomina'];
            $orden = $v['orden'];
            $objModelModeloNomina->modificarOrdenModelosNomina($idestructuramodelodomina, $orden);
            if (!$objModelModeloNomina) {
                $obj->codMsg = 3;
                echo json_encode($obj);
            }
        }
        $obj->codMsg = 1;
        echo json_encode($obj);

    }

    public function replicarconfiguracionesconceptosgeneralesnominaAction()
    {

        $arrTiposPagosReplicar = Zend_Json::decode(stripslashes($this->_getParam('arrTiposPagosReplicar')));
        $arrEstructuras = Zend_Json::decode(stripslashes($this->_getParam('arrEstructuras')));
        $idConceptos = Zend_Json::decode(stripslashes($this->_getParam('idConceptos')));
        $identidad = $this->_getParam('identidad');
        $tiporeplica = $this->_getParam('tiporeplica');

        $objModel = new ConfigEstructurarModelosNominaModel();
        //Si es una replica entre entidades de los campos de estructuras de un mismo tipo de nomina
        if($tiporeplica == 1){
            foreach ($arrEstructuras as $ridest) {
                foreach ($idConceptos as $k => $idConcepto) {
                    $objModel->replicarEstructurarNominaEntidades($idConcepto, $ridest);
                }
            }

        //Si es una replica entre los campos de estructuras de nomina para diferentes tipos de nomina en la misma entidad
        }else if($tiporeplica == 2){
            //Validar que ningun tipo de pago al que se va a a replicar no le falte la asociacion con el tipo de nomina
            $objConfEstructuraModeloNomina = new ConfigEstructurarModelosNomina();
            //Cantidad de nominas sin confmodelo configurado
            $flagnotienemodelo = 0;
            foreach ($arrTiposPagosReplicar as $idtipopago){
                $rtiponomina = $objConfEstructuraModeloNomina->obtenerIdTipoNominaxIdTipoPago($idtipopago);
                if(count($rtiponomina) == 0){
                    $flagnotienemodelo = 1;
                    break;
                }

            }
            //Replicar
            if($flagnotienemodelo == 0){
                $objModel->replicarEstructurarNominaOtrasNominas($idConceptos, $identidad, $arrTiposPagosReplicar);
            }else if($flagnotienemodelo == 1){
                $r->codigo = 'NO-MODELO-NOMINA';
                echo json_encode($r);
                return;
            }
        }


        $r->codigo = 'ADD-1';
        echo json_encode($r);
    }

    public function obtenerCamposEstructurasNominasAction()
    {
        
        $identidad = $this->_request->getPost('identidad');
        $idtiponomina = $this->_request->getPost('idtiponomina');
        $sqlCuenta = "SELECT ce.idtiponomina ||'_'||ce.idestructuramodelodomina as idestructuramodelodomina, ce.denominacion as campo, ntn.denominacion as tiponomina
        FROM mod_nomina.conf_estructuramodelosnomina ce
        inner join mod_nomina.conf_estructuramodelosnominaentidad cee ON (cee.idestructuramodelodomina = ce.idestructuramodelodomina)
        inner join mod_nomina.nom_tiponomina ntn ON (ntn.idtiponomina = ce.idtiponomina)
        where ce.idtipocampo <> 1 and cee.idestructura = ?;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sqlCuenta, array($identidad));

        echo Zend_Json::encode($r);
        
        
        /*$identidad = $this->_request->getPost('identidad');
        $idtiponomina = $this->_request->getPost('idtiponomina');
        $inicio = $this->_request->getPost('start');
        $limite = $this->_request->getPost('limit');
        $sqlCuenta = "SELECT ce.idtiponomina ||'_'||ce.idestructuramodelodomina as idestructuramodelodomina, ce.denominacion as campo, ntn.denominacion as tiponomina
        FROM mod_nomina.conf_estructuramodelosnomina ce
        inner join mod_nomina.conf_estructuramodelosnominaentidad cee ON (cee.idestructuramodelodomina = ce.idestructuramodelodomina)
        inner join mod_nomina.nom_tiponomina ntn ON (ntn.idtiponomina = ce.idtiponomina)
        where ce.idtipocampo <> 1 and cee.idestructura = ?";
        //limit $limite offset $inicio;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sqlCuenta, array($identidad));

        $sqlCant = "select count(ce.idestructuramodelodomina) as cantidad
        FROM mod_nomina.conf_estructuramodelosnomina ce
        inner join mod_nomina.conf_estructuramodelosnominaentidad cee ON (cee.idestructuramodelodomina = ce.idestructuramodelodomina)
        inner join mod_nomina.nom_tiponomina ntn ON (ntn.idtiponomina = ce.idtiponomina)
        where ce.idtipocampo <> 1 and cee.idestructura = ?";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $cantidad = $conn->fetchOne($sqlCant, array($identidad));

        echo json_encode(array('datos'=>$r, 'cantidad'=>$cantidad));*/

    }

    public function obtenerOrdenDisponibleAction()
    {
        $identidad = $this->_request->getPost('identidad');
        $idtiponomina = $this->_request->getPost('idtiponomina');
        $objModel = new ConfigEstructurarModelosNominaModel();
        $r = $objModel->obtenerOrdenDisponible($identidad, $idtiponomina);
        echo Zend_Json::encode($r);
    }

    public function obtenerEstrucrurasNominaSincronizarConceptosContablesAction(){
        $idestructura = $this->_request->getPost('idestructura');
        //Obteniendo las estructuras de nomina de tipo 2,3,4 que no son conceptos contables
        $sqlEstructuraNomina = "SELECT emn.idestructuramodelodomina, emn.denominacion, emn.idtiponomina, ntn.denominacion as denomtiponomina, emn.orden, emn.idtipocampo
          FROM mod_nomina.conf_estructuramodelosnomina emn
          INNER JOIN mod_nomina.conf_estructuramodelosnominaentidad emne on (emne.idestructuramodelodomina = emn.idestructuramodelodomina and emne.idestructura = {$idestructura})
          INNER JOIN mod_nomina.nom_tiponomina ntn on (ntn.idtiponomina = emn.idtiponomina)
          LEFT JOIN mod_nomina.conf_conceptoscontables cc on (cc.idestructuramodelodomina = emn.idestructuramodelodomina)
          LEFT JOIN mod_nomina.conf_conceptoscontablesentidad cce on (cce.idconceptocontable = cc.idconceptoscontables and cce.idestructura = ?)
          WHERE emn.idtipocampo <> 1 and cce.idconceptocontableentidad is null ORDER BY emn.orden ASC;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sqlEstructuraNomina, array($idestructura));
        echo json_encode(array('datos'=>$r, 'cantidad'=>count($r)));
    }

    public function sincronizarConceptosContablesAction(){
        $idestructura = $this->_getParam('idestructura');
        $arrayidestnom = Zend_Json::decode(stripslashes($this->_getParam('arrayidestnom')));
        //Recorriendo las estructuras de nomina para sincronizarlas como conceptos contables
        foreach ($arrayidestnom as $idestnom){
            //Verificando si esta esctructura de nomina existe para cualquier entidad
            $sqlExisteEstNConcCont = "SELECT count(cc.idconceptoscontables) as cantidad
              FROM mod_nomina.conf_conceptoscontables cc
              INNER JOIN mod_nomina.conf_estructuramodelosnomina emn on (emn.idestructuramodelodomina = cc.idestructuramodelodomina and emn.idestructuramodelodomina = ?)
              INNER JOIN mod_nomina.conf_conceptoscontablesentidad cce on (cce.idconceptocontable = cc.idconceptoscontables);";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $existe = $conn->fetchOne($sqlExisteEstNConcCont, array($idestnom));
            //Sino existe este concepto contable en ninguna entidad se adiciona como nuevo
            if($existe == 0){
                //Denom tipo nomina + est nomina
                $sqlEstNTipoN = "SELECT emn.denominacion, ntn.denominacion as denomtiponomina, ntn.idtiponomina
              FROM mod_nomina.conf_estructuramodelosnomina emn
              INNER JOIN mod_nomina.nom_tiponomina ntn on (ntn.idtiponomina = emn.idtiponomina)
              WHERE emn.idestructuramodelodomina = ?;";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $rtiponestn = $conn->fetchAll($sqlEstNTipoN, array($idestnom));
                $idtiponomina = $rtiponestn[0]['idtiponomina'];
                $denomcc = $rtiponestn[0]['denominacion'] .' - '. $rtiponestn[0]['denomtiponomina'];
                //Insertando en los conceptos contables
                $sqlInsertConcCont = "INSERT INTO mod_nomina.conf_conceptoscontables(
                    denominacion, descripcion, fdesde, fhasta, idestructuramodelodomina, idtiponomina)
                    VALUES (?, ?, ?, ?, ?, ?) RETURNING idconceptoscontables;";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $ridconceptoscontables = $conn->fetchAll($sqlInsertConcCont, array($denomcc, null, '2020-01-01', null, $idestnom, $idtiponomina));
                $idconceptoscontables = $ridconceptoscontables[0]['idconceptoscontables'];
                //Insertando en ConceptoContableEntidad
                $sqlInsertConceptoContableEntidad = "INSERT INTO mod_nomina.conf_conceptoscontablesentidad(
                    idconceptocontable, idestructura)
                    VALUES (?, ?);;";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $conn->execute($sqlInsertConceptoContableEntidad, array($idconceptoscontables, $idestructura));
            //Si el concepto contable existe se verifica si existe para la entidad
            }else{
                //Verificando si esta esctructura de nomina existe para cualquier entidad
                $sqlExisteEstNConcContEnt = "SELECT count(cc.idconceptoscontables) as cantidad
              FROM mod_nomina.conf_conceptoscontables cc
              INNER JOIN mod_nomina.conf_estructuramodelosnomina emn on (emn.idestructuramodelodomina = cc.idestructuramodelodomina and emn.idestructuramodelodomina = ?)
              INNER JOIN mod_nomina.conf_conceptoscontablesentidad cce on (cce.idconceptocontable = cc.idconceptoscontables and cce.idestructura = {$idestructura});";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $existeccent = $conn->fetchOne($sqlExisteEstNConcContEnt, array($idestnom));
                //Sino existe para esta entidad
                if($existeccent == 0){
                    //Concepto contable de este idestructura de nomina
                    $sqlEstNConcCont = "SELECT cc.idconceptoscontables
                      FROM mod_nomina.conf_conceptoscontables cc
                      INNER JOIN mod_nomina.conf_estructuramodelosnomina emn on (emn.idestructuramodelodomina = cc.idestructuramodelodomina and emn.idestructuramodelodomina = ?);";
                    $mg = Doctrine_Manager::getInstance();
                    $conn = $mg->getCurrentConnection();
                    $idconceptoscontables = $conn->fetchOne($sqlEstNConcCont, array($idestnom));
                    //Insertando en ConceptoContableEntidad
                    $sqlInsertConceptoContableEntidad = "INSERT INTO mod_nomina.conf_conceptoscontablesentidad(
                    idconceptocontable, idestructura)
                    VALUES (?, ?);;";
                    $mg = Doctrine_Manager::getInstance();
                    $conn = $mg->getCurrentConnection();
                    $conn->execute($sqlInsertConceptoContableEntidad, array($idconceptoscontables, $idestructura));
                }
            }

        }
        echo json_encode('ok');
    }

    public function validarConceptoPagoSalarioAction(){
        $idestructurarmodelosnomiona = $this->_getParam('idestructurarmodelosnomiona');
        $idtiponomina = $this->_getParam('idtiponomina');
        $identidad = $this->_getParam('identidad');
        $accion = $this->_getParam('accion');
        $objEstructurarModelosNomina = new ConfigEstructurarModelosNomina();
        $cantidadconcpagosalario = $objEstructurarModelosNomina->obtenerCantidadConceptoPagoSalarioTipoNomina($idestructurarmodelosnomiona,$idtiponomina, $identidad, $accion);
        if($cantidadconcpagosalario > 0){
            echo json_encode('EXISTE-1');
        }else{
            echo json_encode('NO-EXISTE-1');
        }

    }
}

