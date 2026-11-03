<?php

/**
 * Controlador para gestionar el componente de conceptos de percepcion y descuento y sus escalas.
 *
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Configuracion.
 * @category Clase controladora.
 * @uses GpconceptosescalacompController
 * @copyright UCID
 * @version 1.0
 */
class GpconceptosescalacompController extends ZendExt_Controller_Secure
{

    function init()
    {
        parent::init();
    }

    function gpconceptosescalacompAction()
    {
        $this->render();
    }

    function obtenerListadoConceptosPagoDescuentoAction()
    {
        $textoabuscar = $this->_request->getPost('textoabuscar');
        $idelementosalarial = $this->_request->getPost('idelemento');
        $tipo = $this->_request->getPost('tipo');
        $identidad = $this->_request->getPost('identidad');
        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        if ($tipo == 1) {
            //Creando el modelo de negocio de gestion de conceptos.
            $modeloNegocioConcepto = new ConfigConceptospdElementosSalarialesModel();
            //Obteniendo el listado de conceptos.
            $conceptoPagoDescuento = $modeloNegocioConcepto->obtenerConceptosxElementoSalCargo($idelementosalarial, $tipo, $textoabuscar,$start, $limit);
            $arrResult = array();
            $pos = 0;
            foreach ($conceptoPagoDescuento as $i => $v) {
                $arrResult[$pos]['idconfconceptospdelementossalariales'] = $v['idconfconceptospdelementossalariales'];

                $arrResult[$pos]['idconceptopercepciondescuento'] = $v['idconceptopercepciondescuento'];
                $objDomainConcepto = new NomConceptoPercepcionDescuento();
                $denomconcepto = $objDomainConcepto->obtenerDenomXId($v['idconceptopercepciondescuento']);
                $arrResult[$pos]['denomconceptopercepciondescuento'] = $denomconcepto;

                $objConceptoPercD = $objDomainConcepto->obtenerObjConceptoDadoId($v['idconceptopercepciondescuento']);
                $idtipoconcepto = $objConceptoPercD->idtipoconceptopd;
                $arrResult[$pos]['idtipoconcepto'] = $idtipoconcepto;

                $objDomainTipoConcepto = new NomTipoConceptoPD();
                $denomTipoconcepto = $objDomainTipoConcepto->obtenerDenomXId($idtipoconcepto);
                $arrResult[$pos]['denomtipoconcepto'] = $denomTipoconcepto;

                $arrResult[$pos]['idtarifa'] = $v['idtarifa'];
                $objTarifa = new NomTarifa();
                $denomTarifa = $objTarifa->obtenerDenomXId($v['idtarifa']);
                $arrResult[$pos]['denomtarifa'] = $denomTarifa;
                $objConceptopdTarifa = new NomConceptoPDTarifa();
                $importeTarifa = $objConceptopdTarifa->obtenerImporteXIdConceptoTarifa($v['idtarifa'], $v['idconceptopercepciondescuento']);
                $arrResult[$pos]['importetarifa'] = $importeTarifa;
                $idformacalculoTarifa = $objConceptopdTarifa->obtenerIdFormaCalcXIdConceptoTarifa($v['idtarifa'], $v['idconceptopercepciondescuento']);
                if ($idformacalculoTarifa == 1) {
                    $objConceptopdTarifa = new NomConceptoPDTarifa();
                    $importeTarifa = $objConceptopdTarifa->obtenerImporteXIdConceptoTarifa($v['idtarifa'], $v['idconceptopercepciondescuento']);
                    $arrResult[$pos]['importetarifa'] = $importeTarifa;
                } else {
                    $arrResult[$pos]['importetarifa'] = "";
                }

                $arrResult[$pos]['idformacalculo'] = $idformacalculoTarifa;
                $arrResult[$pos]['fechainicio'] = $v['fechainicio'];
                $arrResult[$pos]['fechafin'] = $v['fechafin'];
                $arrResult[$pos]['tipo'] = $v['tipo'];
                $arrResult[$pos]['idelementosalarialcargo'] = $v['idelementosalarialcargo'];
                $arrResult[$pos]['idelementosalarialpersona'] = $v['idelementosalarialpersona'];
                $arrResult[$pos]['idcargosocupados'] = $v['idcargosocupados'];
                $pos++;
            }
            //Obteniendo la cantidad total de conceptos.
        $cantTotalFinal = $modeloNegocioConcepto->cantConceptosxElementosAlCargo($idelementosalarial, $tipo, $textoabuscar);
        } else {
            $objDomainCargosOcupados = new DatCargosOcupados();
            $arrcargos = $objDomainCargosOcupados->obtenerIdCargosOcupadosPersona($idelementosalarial, $identidad, $inicio = 0, $limite = 10);
            $objDomainElemSalarialCargo = new ConfigElementoSalarialCargo();
            $arrelemsalcargo = array();
            $arrResult = array();
            $modeloNegocioConceptoPD = new ConfigConceptospdElementosSalarialesModel();
            $pos = 0;
            //Obteniendo el listado de conceptos.

            // foreach ($arrcargos as $n => $s) {
            $arrelemsalcargo = $objDomainElemSalarialCargo->obtenerElemSalCargo($idelementosalarial);
            foreach ($arrelemsalcargo as $k => $x) {                
                $conceptoPD = $modeloNegocioConceptoPD->obtenerConceptosxElementoSalCargo($x['idelementosalarialcargo'], 1,$textoabuscar,$start, $limit);
                $cantTotalFinal = $modeloNegocioConceptoPD->cantConceptosxElementosAlCargo($x['idelementosalarialcargo'], 1, $textoabuscar);
                foreach ($conceptoPD as $i => $v) {
                    $arrResult[$pos]['idconfconceptospdelementossalariales'] = $v['idconfconceptospdelementossalariales'];

                    $arrResult[$pos]['idconceptopercepciondescuento'] = $v['idconceptopercepciondescuento'];
                    $objDomainConcepto = new NomConceptoPercepcionDescuento();
                    $denomconcepto = $objDomainConcepto->obtenerDenomXId($v['idconceptopercepciondescuento']);
                    $arrResult[$pos]['denomconceptopercepciondescuento'] = $denomconcepto;

                    $objConceptoPercD = $objDomainConcepto->obtenerObjConceptoDadoId($v['idconceptopercepciondescuento']);
                    $idtipoconcepto = $objConceptoPercD->idtipoconceptopd;
                    $arrResult[$pos]['idtipoconcepto'] = $idtipoconcepto;

                    $objDomainTipoConcepto = new NomTipoConceptoPD();
                    $denomTipoconcepto = $objDomainTipoConcepto->obtenerDenomXId($idtipoconcepto);
                    $arrResult[$pos]['denomtipoconcepto'] = $denomTipoconcepto;

                    $arrResult[$pos]['idtarifa'] = $v['idtarifa'];
                    $objTarifa = new NomTarifa();
                    $denomTarifa = $objTarifa->obtenerDenomXId($v['idtarifa']);
                    $arrResult[$pos]['denomtarifa'] = $denomTarifa;
                    $objConceptopdTarifa = new NomConceptoPDTarifa();
                    $importeTarifa = $objConceptopdTarifa->obtenerImporteXIdConceptoTarifa($v['idtarifa'], $v['idconceptopercepciondescuento']);
                    $arrResult[$pos]['importetarifa'] = $importeTarifa;
                    $idformacalculoTarifa = $objConceptopdTarifa->obtenerIdFormaCalcXIdConceptoTarifa($v['idtarifa'], $v['idconceptopercepciondescuento']);
                    if ($idformacalculoTarifa == 1) {
                        $objConceptopdTarifa = new NomConceptoPDTarifa();
                        $importeTarifa = $objConceptopdTarifa->obtenerImporteXIdConceptoTarifa($v['idtarifa'], $v['idconceptopercepciondescuento']);
                        $arrResult[$pos]['importetarifa'] = $importeTarifa;
                    } else {
                        $arrResult[$pos]['importetarifa'] = "";
                    }

                    $arrResult[$pos]['idformacalculo'] = $idformacalculoTarifa;
                    $arrResult[$pos]['fechainicio'] = $v['fechainicio'];
                    $arrResult[$pos]['fechafin'] = $v['fechafin'];
                    $arrResult[$pos]['tipo'] = $v['tipo'];
                    $arrResult[$pos]['idelementosalarialcargo'] = $v['idelementosalarialcargo'];
                    $arrResult[$pos]['idelementosalarialpersona'] = $v['idelementosalarialpersona'];
                    $arrResult[$pos]['idcargosocupados'] = $v['idcargosocupados'];
                    $pos++;
                }
            }
            
        }
        

        //Imprimiendo el listado de conceptos.
        echo Zend_Json::encode(array('datos' => $arrResult, 'cantidad' => $cantTotalFinal));
    }

    function obtenerListadoEscalasAction()
    {
        $idconfconceptospdelementossalariales = $this->_request->getPost('idconfconceptospdelementossalariales');
        $idcargosocupados = $this->_request->getPost('idcargosocupados');
        $tipo = $this->_request->getPost('tipo');
        if ($tipo == 1) {
            $objDomainEscala = new ConfEscalaElementoSalarial();
            $arr = $objDomainEscala->obtenerConfEscalaElementoSalarialDadoIdConfConfepto($idconfconceptospdelementossalariales);
            $arrResult = array();
            $objNomReferencia = new NomNomencladorReferencia();
            $objNomEscalaTarifa = new NomEscalaTarifa();
            $objDomainEstructuraEsc = new NomEstructuraEscalar();
            foreach ($arr as $i => $v) {
                $arrResult[$i]['idconfescalaelementosalarial'] = $v['idconfescalaelementosalarial'];
                $idescalatarifa = $v['idescalatarifa'];
                $arrResult[$i]['idescalatarifa'] = $idescalatarifa;
                $idestructura = $objNomEscalaTarifa->obtenerIdEstructuraXIdEscala($arrResult[$i]['idescalatarifa']);
                $idtipocampo = $objDomainEstructuraEsc->obtenerTipoCampoXId($idestructura);
                if ($idtipocampo == 2) {
                    $denomesc = $objNomEscalaTarifa->obtenerValorEscalarXIdEscala($arrResult[$i]['idescalatarifa']);
                    $arrResult[$i]['escala'] = $denomesc;
                } else {
                    $idnomreferencia = $objDomainEstructuraEsc->obtenerIdNomencladoXId($idestructura);
                    $valorescalar = $objNomEscalaTarifa->obtenerValorEscalarXIdEscala($idescalatarifa);
                    $tuplanomenclador = $objNomReferencia->obtenerTuplaNomenclador($idnomreferencia, $valorescalar);
                    $denominacionnom = $tuplanomenclador[0]['denominacion'];
                    $arrResult[$i]['escala'] = $denominacionnom;
                }

                $arrResult[$i]['idconfconceptospdelementossalariales'] = $v['idconfconceptospdelementossalariales'];
                $arrResult[$i]['importe'] = $v['importe'];
                $arrResult[$i]['fechainicio'] = $v['fechainicio'];
                $arrResult[$i]['fechafin'] = $v['fechafin'];
            }
        } else {
            $objDomainEscala = new ConfEscalaElementoSalarialPersona();


            /*
            $r = $objDomainEscala->obtenerListadoConfEscalaElementoSalarial();

            $objB = new DatCargosOcupados();
            $dm = Doctrine_Manager::getInstance();
            $conn = $dm->getCurrentConnection();
            ///$conn->beginTransaction();
            foreach($r as $v){
                if(!empty($v['idcargosocupados'])){
                    $idpersona = $objB->obtenerIdPersonaXIdCargoOcupado($v['idcargosocupados']);
                    if(!empty($idpersona)){
                        $sql = "UPDATE mod_nomina.conf_escalaelementosalarialpersona SET idpersona = {$idpersona} WHERE idcargosocupados = {$v['idcargosocupados']}";
                        $conn->fetchAll($sql);
                    }
                }
            }
            */
            //$conn->commit();


            $arr = $objDomainEscala->obtenerConfEscalaElementoSalarialDadoIdConfConfepto($idconfconceptospdelementossalariales, $idcargosocupados);
            $arrResult = array();
            $objNomReferencia = new NomNomencladorReferencia();
            $objNomEscalaTarifa = new NomEscalaTarifa();
            $objDomainEstructuraEsc = new NomEstructuraEscalar();
            foreach ($arr as $i => $v) {
                $arrResult[$i]['idconfescalaelementosalarial'] = $v['idconfescalaelementosalarialpersona'];
                $idescalatarifa = $v['idescalatarifa'];
                $arrResult[$i]['idescalatarifa'] = $idescalatarifa;
                $idestructura = $objNomEscalaTarifa->obtenerIdEstructuraXIdEscala($arrResult[$i]['idescalatarifa']);
                $idtipocampo = $objDomainEstructuraEsc->obtenerTipoCampoXId($idestructura);
                if ($idtipocampo == 2) {
                    $denomesc = $objNomEscalaTarifa->obtenerValorEscalarXIdEscala($arrResult[$i]['idescalatarifa']);
                    $arrResult[$i]['escala'] = $denomesc;
                } else {
                    $idnomreferencia = $objDomainEstructuraEsc->obtenerIdNomencladoXId($idestructura);
                    $valorescalar = $objNomEscalaTarifa->obtenerValorEscalarXIdEscala($idescalatarifa);
                    $tuplanomenclador = $objNomReferencia->obtenerTuplaNomenclador($idnomreferencia, $valorescalar);
                    $denominacionnom = $tuplanomenclador[0]['denominacion'];
                    $arrResult[$i]['escala'] = $denominacionnom;
                }

                $arrResult[$i]['idconfconceptospdelementossalariales'] = $v['idconfconceptospdelementossalariales'];
                $arrResult[$i]['importe'] = $v['importe'];
                $arrResult[$i]['fechainicio'] = $v['fechainicio'];
                $arrResult[$i]['fechafin'] = $v['fechafin'];
            }
        }
        $cantTotalFinal = count($arrResult);
        echo Zend_Json::encode(array('datos' => $arrResult, 'cantidad' => $cantTotalFinal));
    }

    function obtenerListadoEscalaXConceptoAction()
    {
        $idconceptopercepciondescuento = $this->_request->getPost('idconceptopercepciondescuento');
        $idconfconceptopercepciondescuento = $this->_request->getPost('idconfconceptopercepciondescuento');
        $idtarifa = $this->_request->getPost('idtarifa');
        $tipo = $this->_request->getPost('tipo');
        $objConceptopdTarifa = new NomConceptoPDTarifa();
        $arrTarifa = $objConceptopdTarifa->obtenerTarifaXConceptoPD($idconceptopercepciondescuento, $idtarifa);
        $arbol = array();
        if (count($arrTarifa) > 0) {
            $objEstructuraEscalar = new NomEstructuraEscalar();
            $arrEstructuraEscalar = $objEstructuraEscalar->obtenerListadoEstructurasEscalares($arrTarifa[0]['idconceptopdtarifa']);
            $arrEstEscBuscar = array();
            $arrValoresEstEscBuscar = array();
            $objNomReferencia = new NomNomencladorReferencia();
            if ($tipo == 1) {
                foreach ($arrEstructuraEscalar as $k => $v) {
                    if ($v['idtipoentrada'] == 3) {
                        $arrEstEscBuscar[] = $v['idestructuraescalar'];
                        $arrValoresEstEscBuscar[$v['idestructuraescalar']]['tipocampo'] = $v['idtipocampo'];
                        if ($v['idtipocampo'] == 1)
                            $arrValoresEstEscBuscar[$v['idestructuraescalar']]['valores'] = $objNomReferencia->ObtenerDatosNomenclador($v['idnomencladorreferencia'], null);
                    }
                }
                if (count($arrValoresEstEscBuscar) > 0) {
                    $objEscalaTarifa = new NomEscalaTarifa();
                    $arrEscalaTarifa = $objEscalaTarifa->obtenerEscalasTarifaPorIdsEstructuraEscalar($arrTarifa[0]['idconceptopdtarifa'], $arrEstEscBuscar);
                    $arrArbol = array();
                    foreach ($arrEscalaTarifa as $i => $v) {
                        if (!$v['idpadre']) {
                            $arrHijos = $this->buscarHijosArbol($v['idescalatarifa'], $arrEscalaTarifa);
                            $leaf = (count($arrHijos) > 0 ? false : true);
                            $n = $this->construirNodoEscala($v, $arrValoresEstEscBuscar[$v['idestructuraescalar']], $leaf);
                            $n['children'] = $this->construirArbolEscalas($arrEscalaTarifa, $v, $arrValoresEstEscBuscar);
                            $arrArbol[] = $n;
                        }
                    }
                    echo json_encode($arrArbol);
                }
            } else {
                $objConfEscala = new ConfEscalaElementoSalarial();
                $idEscalaTarifa = $objConfEscala->obtenerIdEscalaXIdConfConceptoPD($idconfconceptopercepciondescuento);
                foreach ($arrEstructuraEscalar as $k => $v) {
                    if ($v['idtipoentrada'] == 4) {
                        $arrEstEscBuscar[] = $v['idestructuraescalar'];
                        $arrValoresEstEscBuscar[$v['idestructuraescalar']]['tipocampo'] = $v['idtipocampo'];
                        if ($v['idtipocampo'] == 1)
                            $arrValoresEstEscBuscar[$v['idestructuraescalar']]['valores'] = $objNomReferencia->ObtenerDatosNomenclador($v['idnomencladorreferencia'], null);
                    }
                }

                $objEscalaTarifa = new NomEscalaTarifa();
                $arrEscalaTarifa = $objEscalaTarifa->obtenerEscalasTarifaPorIdsEstructuraEscalar($arrTarifa[0]['idconceptopdtarifa'], $arrEstEscBuscar);
                $escalaTarifaHija = $objEscalaTarifa->obtenerEscalaTarifaXIdPadre($idEscalaTarifa);
                $arrArbol = array();
                $arrayTipocampo = array();
                if (count($escalaTarifaHija)) {
                    foreach ($escalaTarifaHija as $k => $v) {
                        $idestrucesc = $v['idestructuraescalar'];
                        $tipoentrada = $objEstructuraEscalar->obtenerTipoEntrada($idestrucesc);
                        if ($tipoentrada == 4) {
                            $tipocampo = $objEstructuraEscalar->obtenerTipoCampoXId($idestrucesc);
                            $arrayTipocampo['tipocampo'] = $tipocampo;
                            $counthijos = $objEscalaTarifa->countEscalaTarifaPersonaXIdPadre($v['idescalatarifa']);
                            $leaf = ($counthijos > 0 ? false : true);
                            $nodo = $this->construirNodoEscala($v, $arrayTipocampo, $leaf);
                            $nodo['children'] = $this->construirArbolEscalas($escalaTarifaHija, $v, $arrValoresEstEscBuscar);
                            $arrArbol[] = $nodo;
                        }
                    }
                } else {
                    foreach ($arrEscalaTarifa as $k => $v) {
                        $idestrucesc = $v['idestructuraescalar'];
                        $tipoentrada = $objEstructuraEscalar->obtenerTipoEntrada($idestrucesc);
                        if ($tipoentrada == 4) {
                            $tipocampo = $objEstructuraEscalar->obtenerTipoCampoXId($idestrucesc);
                            $arrayTipocampo['tipocampo'] = $tipocampo;
                            $leaf = true;
                            $nodo = $this->construirNodoEscala($v, $arrayTipocampo, $leaf);
                            $arrArbol[] = $nodo;
                        }
                    }
                }
                echo json_encode($arrArbol);
            }
        }
        //print_r($arrArbol);die;

    }

    private function buscarHijosArbol($idpadre, $arrEscalaTarifa)
    {
        $arrHijos = array();
        foreach ($arrEscalaTarifa as $k => $v) {
            if ($v['idpadre'] == $idpadre) {
                $arrHijos[] = $v;
            }
        }
        return $arrHijos;
    }

    private function construirArbolEscalas($arrEscalaTarifa, $v, $arrValoresEstEscBuscar)
    {
        $arrHijos = $this->buscarHijosArbol($v['idescalatarifa'], $arrEscalaTarifa);
        if (count($arrHijos) > 0) {
            $arrArbol = array();
            foreach ($arrHijos as $k => $h) {
                $arrH = $this->buscarHijosArbol($h['idescalatarifa'], $arrEscalaTarifa);
                $leaf = (count($arrH) > 0 ? false : true);
                $n = $this->construirNodoEscala($h, $arrValoresEstEscBuscar[$h['idestructuraescalar']], $leaf);
                $n['children'] = $this->construirArbolEscalas($arrEscalaTarifa, $h, $arrValoresEstEscBuscar);
                $arrArbol[] = $n;
            }
            return $arrArbol;
        } else return null;

    }

    private function construirNodoEscala($nodoEscala, $arrEstEsc, $hoja)
    {
        $denominacion = '';
        $objNomEscalaTarifa = new NomEscalaTarifa();
        $objDomainEstructuraEsc = new NomEstructuraEscalar();
        $objNomReferencia = new NomNomencladorReferencia();
        $arr = array();
        if ($arrEstEsc['tipocampo'] == 1) {
            $denominacion = $nodoEscala['valorescalar'];
            $arr['id'] = $nodoEscala['idescalatarifa'];

            $arr['leaf'] = $hoja;
            $arr['qtip'] = '<b>' . $denominacion . '</b>';
            $arr['importe'] = $nodoEscala['importe'];
            $idestructura = $objNomEscalaTarifa->obtenerIdEstructuraXIdEscala($nodoEscala['idescalatarifa']);
            $idnomreferencia = $objDomainEstructuraEsc->obtenerIdNomencladoXId($idestructura);
            $valorescalar = $objNomEscalaTarifa->obtenerValorEscalarXIdEscala($nodoEscala['idescalatarifa']);
            $tuplanomenclador = $objNomReferencia->obtenerTuplaNomenclador($idnomreferencia, $valorescalar);
            $denominacionnom = $tuplanomenclador[0]['denominacion'];
            $arr['text'] = $denominacionnom;
            $arr['qtip'] = '<b>' . $denominacionnom . '</b>';

        } else {
            $denominacion = $nodoEscala['valorescalar'];

            $arr['id'] = $nodoEscala['idescalatarifa'];
            $arr['text'] = $nodoEscala['valorescalar'];
            $arr['leaf'] = $hoja;
            $arr['qtip'] = '<b>' . $nodoEscala['valorescalar'] . '</b>';
            $arr['importe'] = $nodoEscala['importe'];

        }
        return $arr;
    }

    function cargarConceptospagodescuentoAction()
    {
        $modeloNegocioConcepto = new NomConceptoPercepcionDescuentoModel();
        $arrConcepto = $modeloNegocioConcepto->obtenerListadoTodosConceptosPD();
        //Imprimiendo el listado de conceptos.
        echo Zend_Json::encode(array('datos' => $arrConcepto, 'cantidad' => count($arrConcepto)));

    }

    function cargarTarifasAction()
    {
        $idconcepto = $this->_request->getPost('idconcepto');
        $modeloNegocioConcpdTarifa = new NomConceptoPDTarifaModel();
        $arrTarifas = $modeloNegocioConcpdTarifa->obtenerListadoTarifaConcepto($idconcepto);

        //Imprimiendo el listado de tarifas.
        echo Zend_Json::encode(array('datos' => $arrTarifas, 'cantidad' => count($arrTarifas)));
    }

    function calcularImporteAction()
    {
        $idescala = $this->_request->getPost('idescala');
        $objDomainEscalaTarifa = new NomEscalaTarifa();
        $idformacalculo = $objDomainEscalaTarifa->obtenerIdFormaCalculoXIdEscala($idescala);
        $importe = "";
        if ($idformacalculo == "") {
            $importe = -1;
        } else if ($idformacalculo == 1) {
            $importe = $objDomainEscalaTarifa->obtenerValorImporteXIdEscala($idescala);
        } else {
            $idformula = $objDomainEscalaTarifa->obtenerIdFormulaXIdEscala($idescala);
            $arreglo = array();
            $arreglo[0] = $idformula;
            $rExpMat = $this->pIntegrator->comun->BuscarTodosporarrIdExpresionMatematica($arreglo);
            $importe = $rExpMat[0]['expresionamostrar'];
        }
        echo Zend_Json::encode(($importe) ? $importe : 0.00);
    }

    function adicionarConceptoPagoDescuentoAction()
    {
        $idconcepto = $this->_request->getPost('idconcepto');
        $idtarifa = $this->_request->getPost('idtarifa');
        $fechainicio = $this->_request->getPost('fechainicio');
        $fechafin = $this->_request->getPost('fechafin');
        $tipo = $this->_request->getPost('tipo');
        $checked = $this->_request->getPost('checked');
        $idelementoSalarialcargo = Zend_Json::decode(stripslashes($this->_getParam('idelemsalcargo')));
        $idelemSalarialpersona = null;
        $idelemSalarialcargoocupado = null;
        $modelConfig = new ConfigConceptospdElementosSalarialesModel();
        if ($checked == "true") {
            $todoscargos = 1;
            $modelConfig->adicionarConceptospdElementosSalariales($idconcepto, $idtarifa, $fechainicio, $fechafin,
                $tipo, $idelementoSalarialcargo, $idelemSalarialpersona, $idelemSalarialcargoocupado, $todoscargos);
        } else {
            $todoscargos = 0;
            $modelConfig->adicionarConceptospdElementosSalariales($idconcepto, $idtarifa, $fechainicio, $fechafin,
                $tipo, $idelementoSalarialcargo, $idelemSalarialpersona, $idelemSalarialcargoocupado, $todoscargos);
        }
        //Mensaje a mostrar
        echo "{'codMsg':'1'}";

    }

    function modificarConceptoPagoDescuentoAction()
    {
        $idconceptoPd = $this->_request->getPost('idconceptoPd');
        $idconcepto = $this->_request->getPost('idconcepto');
        $idtarifa = $this->_request->getPost('idtarifa');
        $fechainicio = $this->_request->getPost('fechainicio');
        $fechafin = $this->_request->getPost('fechafin');
        $tipo = $this->_request->getPost('tipo');
        $modelConfig = new ConfigConceptospdElementosSalarialesModel();
        $modelConfig->modificarConceptospdElementosSalariales($idconceptoPd, $idconcepto, $idtarifa, $fechainicio, $fechafin,
            $tipo);
        //Mensaje a mostrar
        echo "{'codMsg':'2'}";
    }

    function eliminarConceptoPagoDescuentoAction()
    {
        $arrayIdElemSalCargo = Zend_Json::decode(stripslashes($this->_request->getPost('arrayIdElemSalCargo')));
        $idConcepPD = $this->_request->getPost('idConcepPD');
        $checked = $this->_request->getPost('checked');
        $modelConfig = new ConfigConceptospdElementosSalarialesModel();
		$objConfigElementoSalarialCargo = new ConfigElementoSalarialCargo();
        if ($checked == "true") {            
            $arrcargosConElemSalarial = array();
            $idestructura = $this->global->Estructura->idestructura;
            //Obteniendo el array de cargos de la entidad
            $ioc = ZendExt_IoC::getInstance();
            $arrCargosPorIdEstructura = $ioc->metadatos->obtenerCargosEstructura($idestructura);//print_r($arrCargosPorIdEstructura);die;
            $i = 0;
            //Recorriendo el array de cargos de la entidad y buscando si tienen elementos salariales
            foreach ($arrCargosPorIdEstructura as $n => $value) {
                $existeelementosalarial = $objConfigElementoSalarialCargo->existeConfElementoSalarialCargoXIdCargo($value['idcargo']);
                if ($existeelementosalarial == 1) {
                    $arrcargosConElemSalarial[$i] = $objConfigElementoSalarialCargo->obtenerIdElemSalCargo($value['idcargo']);
                    $i++;
                }
            }
			if(count($arrcargosConElemSalarial) > 0){
			  //Recorriendo el array de elementos salariales
			  foreach($arrcargosConElemSalarial as $idelemsal){
			    $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
			    //Devolviendo el idconfconceptospdelementossalariales a partir de idconceptopercepciondescuento.
			    $sql = "SELECT cpdes.idconfconceptospdelementossalariales
			    FROM mod_nomina.conf_conceptospdelementossalariales cpdes
			    INNER JOIN mod_nomina.conf_elementosalarialcargo cesc ON(cesc.idelementosalarialcargo = cpdes.idelementosalarialcargo)
			    WHERE cpdes.idconceptopercepciondescuento = ? and cesc.idelementosalarialcargo = ?";
			    $idconfconceptospdelementossalarial = $conn->fetchOne($sql, array($idConcepPD, $idelemsal));
				if($idconfconceptospdelementossalarial){
				  $bool = $modelConfig->eliminarConceptospdElementosSalariales($idconfconceptospdelementossalarial);
				}			    			
			  }
			}
			
            if ($bool == 2) {
                echo "{'codMsg':'3'}";
                return;
            } else {
                //Devolviendo una notificación de que todo ocurrió correctamente
                echo "{'codMsg':'1'}";
                return;
            }
        } else {

            foreach($arrayIdElemSalCargo as $idelemsal){
			  $mg = Doctrine_Manager::getInstance();
              $conn = $mg->getCurrentConnection();
			  //Devolviendo el idconfconceptospdelementossalariales a partir de idconceptopercepciondescuento.
			  $sql = "SELECT cpdes.idconfconceptospdelementossalariales
			  FROM mod_nomina.conf_conceptospdelementossalariales cpdes
			  INNER JOIN mod_nomina.conf_elementosalarialcargo cesc ON(cesc.idelementosalarialcargo = cpdes.idelementosalarialcargo)
			  WHERE cpdes.idconceptopercepciondescuento = ? and cesc.idelementosalarialcargo = ?";
			  $idconfconceptospdelementossalarial = $conn->fetchOne($sql, array($idConcepPD, $idelemsal));
			  $bool = $modelConfig->eliminarConceptospdElementosSalariales($idconfconceptospdelementossalarial);			
			}          

            if ($bool == 2) {
                echo "{'codMsg':'3'}";
                return;
            } else {
                //Devolviendo una notificación de que todo ocurrió correctamente
                echo "{'codMsg':'1'}";
                return;
            }

        }
    }

    function adicionarEscalaXConceptoAction()
    {
        $tipo = $this->_request->getPost('tipo');
        $idestructuraescalar = $this->_request->getPost('idestructuraescalar');
        $idconfconceptospdelementossalariales = $this->_request->getPost('idconfconceptospdelementossalariales');
        $idcargosocupados = $this->_request->getPost('idcargosocupados');
        $importe = $this->_request->getPost('importe');
        $fechainicio = $this->_request->getPost('fechainicio');
        $fechafin = $this->_request->getPost('fechafin');
        $idconceptopercepciondescuento = $this->_request->getPost('idconceptopercepciondescuento');
        $idelementoSalarialcargo = Zend_Json::decode(stripslashes($this->_getParam('idelemsalcargo')));
        $arrayidcargosocupados = Zend_Json::decode(stripslashes($this->_getParam('arrayidcargosocupados')));

        /*$boolexiste = ConfEscalaElementoSalarialModel::existeConfEscalaElementoSalarialDadoIdConfConfepto($idconfconceptospdelementossalariales);
                 if(!$boolexiste){
                     $varresp = ConfEscalaElementoSalarialModel::adicionarEscalaXConcepto($idestructuraescalar, $idconfconceptospdelementossalariales, $importe, $fechainicio, $fechafin);
                     //Mensaje a mostrar
                     $result = "{'codMsg':'1'}";
                 }else{
                     $result = "{'codMsg':'2'}";
                 }

        echo $result;*/


        /* ESTE CODIGO HAY QUE REVISARLO - YADIR*/
        $existeidconfconceptospdelementossalariales = ConfigConceptospdElementosSalarialesModel::Obteneridconfconceptospdelementossalariales($idconceptopercepciondescuento, $idelementoSalarialcargo);

        if ($tipo == 1) {
            foreach ($existeidconfconceptospdelementossalariales as $cont => $id) {
                $boolexiste = ConfEscalaElementoSalarialModel::existeConfEscalaElementoSalarialDadoIdConfConfepto($id['idconfconceptospdelementossalariales']);
                if (!$boolexiste) {
                    $varresp = ConfEscalaElementoSalarialModel::adicionarEscalaXConcepto($idestructuraescalar, $id['idconfconceptospdelementossalariales'], $importe, $fechainicio, $fechafin);
                    //Mensaje a mostrar
                    $result = "{'codMsg':'1'}";
                } else {
                    $result = "{'codMsg':'2'}";
                }
            }
            echo $result;
        } else {
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $modelConfEscalaPersona = new ConfEscalaElementoSalarialPersonaModel();
            foreach ($arrayidcargosocupados as $idcargosocupad){
                //Devolviendo el idconfconceptospdelementossalariales a partir del idcargosocupados y idconceptopercepciondescuento.
                $sql = "SELECT cpdes.idconfconceptospdelementossalariales
                FROM mod_nomina.conf_conceptospdelementossalariales cpdes
                INNER JOIN mod_nomina.conf_elementosalarialcargo cesc ON(cesc.idelementosalarialcargo = cpdes.idelementosalarialcargo)
                INNER JOIN mod_nomina.dat_cargosocupados co ON(co.idcargo = cesc.idcargo)
                WHERE co.idcargosocupados = ? and cpdes. idconceptopercepciondescuento = ?";
                $idconfconceptospdelementossalarial = $conn->fetchAll($sql, array($idcargosocupad, $idconceptopercepciondescuento))[0]['idconfconceptospdelementossalariales'];
                $boolexiste = $modelConfEscalaPersona->existeConfEscalaElementoSalarialDadoIdConfConfepto($idconfconceptospdelementossalarial, $idcargosocupad);
                if (!$boolexiste) {
                    if($idconfconceptospdelementossalarial){
                        $modelConfEscalaPersona->adicionarEscalaXConcepto($idestructuraescalar, $idconfconceptospdelementossalarial, $importe,
                            $fechainicio, $fechafin, $idcargosocupad);
                    }
                }
            }
            //Mensaje a mostrar
            echo "{'codMsg':'1'}";

        }
    }

    function modificarEscalaXConceptoAction()
    {
        $idconfescalaelementosalarial = $this->_request->getPost('idconfescalaelementosalarial');
        $idestructuraescalar = $this->_request->getPost('idestructuraescalar');
        $idconfconceptospdelementossalariales = $this->_request->getPost('idconfconceptospdelementossalariales');
        $idcargosocupados = $this->_request->getPost('idcargosocupados');
        $importe = $this->_request->getPost('importe');
        $fechainicio = $this->_request->getPost('fechainicio');
        $fechafin = $this->_request->getPost('fechafin');
        $tipo = $this->_request->getPost('tipo');
        $idconceptopercepciondescuento = $this->_request->getPost('idconceptopercepciondescuento');
        $idelementoSalarialcargo = Zend_Json::decode(stripslashes($this->_getParam('idelemsalcargo')));
        $arrayidcargosocupados = Zend_Json::decode(stripslashes($this->_getParam('arrayidcargosocupados')));
        $existeidconfconceptospdelementossalariales = ConfigConceptospdElementosSalarialesModel::Obteneridconfconceptospdelementossalariales($idconceptopercepciondescuento, $idelementoSalarialcargo);
        if ($tipo == 1) {
            $modelConfig = new ConfEscalaElementoSalarialModel();
            // print_r($existeidconfconceptospdelementossalariales);die;
            $modelConfig->modificarEscalaXConcepto($existeidconfconceptospdelementossalariales, $idconfescalaelementosalarial, $idestructuraescalar, $idconfconceptospdelementossalariales,
                $importe, $fechainicio, $fechafin);
            //Mensaje a mostrar
            echo "{'codMsg':'1'}";

        } else {
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $modelConfig = new ConfEscalaElementoSalarialPersonaModel();
            foreach ($arrayidcargosocupados as $idcargosocupad){
                //IdCargo
                $idcargo = DatCargosOcupados::obtenerIdCargoXIdCargoOcupado($idcargosocupad);
                $idelemSalCargoCO = ConfigElementoSalarialCargo::obtenerIdElemSalCargo($idcargo);
                //Devolviendo el idconfconceptospdelementossalariales y el  idconfescalaelementosalarial a partir del idcargosocupados y idconceptopercepciondescuento.
                $sql = "SELECT cpdes.idconfconceptospdelementossalariales, ceesp.idconfescalaelementosalarialpersona
                FROM mod_nomina.conf_conceptospdelementossalariales cpdes
                INNER JOIN mod_nomina.conf_escalaelementosalarialpersona ceesp ON(ceesp.idconfconceptospdelementossalariales = cpdes.idconfconceptospdelementossalariales)
                INNER JOIN mod_nomina.conf_elementosalarialcargo cesc ON(cesc.idelementosalarialcargo = cpdes.idelementosalarialcargo)
                INNER JOIN mod_nomina.dat_cargosocupados co ON(co.idcargo = cesc.idcargo and co.idpersona = ceesp.idpersona)
                WHERE co.idcargosocupados = ? and cpdes. idconceptopercepciondescuento = ?";
                $arrayce = $conn->fetchAll($sql, array($idcargosocupad, $idconceptopercepciondescuento));
                $idconfescalaelementosal = $arrayce[0]['idconfescalaelementosalarialpersona'];
                $idconfconceptospdelementossalarial = $arrayce[0]['idconfconceptospdelementossalariales'];
                if($idconfescalaelementosal){
                    $modelConfig->modificarEscalaXConcepto($idconfescalaelementosal, $idestructuraescalar, $idconfconceptospdelementossalarial,
                        $importe, $fechainicio, $fechafin, $idcargosocupad, $idelemSalCargoCO);
                }
            }
            //Mensaje a mostrar
            echo "{'codMsg':'1'}";
        }
    }

    function eliminarEscalaXConceptoAction()
    {
        $idconfescalaelementosalarial = $this->_request->getPost('idconfescala');
        $tipo = $this->_request->getPost('tipo');
        $idelementoSalarialcargo = Zend_Json::decode(stripslashes($this->_getParam('idelemsalcargo')));
        $idconceptopercepciondescuento = $this->_request->getPost('idconceptopercepciondescuento');
        $arrayidcargosocupados = Zend_Json::decode(stripslashes($this->_getParam('arrayidcargosocupados')));
        $existeidconfconceptospdelementossalariales = ConfigConceptospdElementosSalarialesModel::Obteneridconfconceptospdelementossalariales($idconceptopercepciondescuento, $idelementoSalarialcargo);
        if ($tipo == 1) {
            $modelConfig = new ConfEscalaElementoSalarialModel();
            $modelConfig->eliminarEscalaXConcepto($existeidconfconceptospdelementossalariales, $idconfescalaelementosalarial);
            //Mensaje a mostrar
            echo "{'codMsg':'1'}";
        } else {
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $modelConfig = new ConfEscalaElementoSalarialPersonaModel();
            foreach ($arrayidcargosocupados as $idcargosocupados){
                //Devolviendo el idconfescalaelementosalarial a partir del idcargosocupados y idconceptopercepciondescuento.
                $sql = "SELECT ceesp.idconfescalaelementosalarialpersona
                FROM mod_nomina.conf_conceptospdelementossalariales cpdes
                INNER JOIN mod_nomina.conf_escalaelementosalarialpersona ceesp ON(ceesp.idconfconceptospdelementossalariales = cpdes.idconfconceptospdelementossalariales)
                INNER JOIN mod_nomina.conf_elementosalarialcargo cesc ON(cesc.idelementosalarialcargo = cpdes.idelementosalarialcargo)
                INNER JOIN mod_nomina.dat_cargosocupados co ON(co.idcargo = cesc.idcargo and co.idpersona = ceesp.idpersona)
                WHERE co.idcargosocupados = ? and cpdes. idconceptopercepciondescuento = ?";
                $idconfescalaelementosalarialpersona= $conn->fetchAll($sql, array($idcargosocupados, $idconceptopercepciondescuento))[0]['idconfescalaelementosalarialpersona'];

                if($idconfescalaelementosalarialpersona){
                    $modelConfig->eliminarEscalaXConcepto($idconfescalaelementosalarialpersona);
                }
            }
            //Mensaje a mostrar
            echo "{'codMsg':'1'}";
        }

    }


}
