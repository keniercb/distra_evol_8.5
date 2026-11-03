<?php

/**
 * Controlador para gestionar submayor de retenciones.
 *
 * @author Tte. Darien Cabrera O.
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Submayores.
 * @category Clase controladora.
 * @uses DatSubmayorVacacionesModel
 * @copyright UCID
 * @version 1.0
 */
$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
require($dir_www . '/pvd/comun/recursos/fpdf/fpdf.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Reader/Excel5.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

class GestsubmayorvacacionesController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase.
     */
    public function init()
    {
        parent::init();
    }

    /**
     * Acción utilizada para mostrar la vista de gestión de retenciones.
     */
    public function gestsubmayorvacacionesAction()
    {

        //Agregando a la vista los ficheros js de la ayuda.
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->idioma = $this->global->Perfil->idioma;

        //Mostrando la vista.
        $this->render();
    }

    public function cargarindicadoresAction()
    {

        //Creando el modelo de negocio de gestion de conceptos de la retribución monetaria.
        $modeloNegocioConceptoRM = new NomConceptoRMModel();

        //Creando el modelo de negocio de gestion de variables globales.
        $modeloNegocioVariablesG = new NomVariableGlobalModel();

        //Obteniendo el arreglo de conceptos de la retribución monetaria.
        $arrCRM = $modeloNegocioConceptoRM->obtenerTodosConceptosRM();

        //Obteniendo el arreglo de variables globales.
        $arrVG = $modeloNegocioVariablesG->obtenerTodasVariablesGlobales();

        //Obteniendo las variables auxiliares que van a las formulas de liquidacion y acumulacion de la nomina
        $objVA = new DatVacacionesPersona();
        $arrAux = $objVA->obtenervariablesformulaliquidacionacumulacion();

        $arrR = array();
        foreach ($arrCRM as $k => $v) {
            $arrR[] = array('idindicador' => 'CRM_' . $v['idconceptorm'], 'indicador' => $v['denominacion'], 'tipo' => 'Conceptos de RM');
        }

        foreach ($arrVG as $k => $v) {
            $arrR[] = array('idindicador' => 'VG_' . $v['idvariableglobal'], 'indicador' => $v['denominacion'], 'tipo' => 'Variables globales');
        }

        //Sueldo por cargo
        $arrR[] = array('idindicador' => 'SPC', 'indicador' => 'Sueldo por cargo', 'tipo' => 'Sueldo por cargo');

        foreach ($arrAux as $k => $v) {
            $arrR[] = array('idindicador' => 'VAV_' . $v['idvariablesformulavacacionesvariables'], 'indicador' => $v['denominacion'], 'tipo' => 'Variables auxiliares');
        }

        //Promedio de vacaciones de la persona
        $arrR[] = array('idindicador' => 'VAC_0', 'indicador' => 'Vacaciones', 'tipo' => 'Vacaciones');

        //Imprimiendo el arreglo de indicadores.
        echo Zend_Json::encode($arrR);
    }

    /**
     * Accion utilizada para listar los datos generales del submayor de vacaciones de una persona.
     */
    public function obtenerDatosGeneralesSubVacacionesAction()
    {
        //Creando el modelo de negocio de gestión de vacaciones de las personas.
        $modeloNegocioVacPer = new DatVacacionesPersonaModel();

        //Obteniendo los datos generales de vacaciones de persona.
        $arrVac = $modeloNegocioVacPer->obtenerDatosGeneralesVacacionesPersona(
            $this->_getParam('idpersona', 0),
            $this->_getParam('identidad', 0)
        );
        $cantidadoperaciones = 0;
        if (!empty($arrVac)) {
            $cantidadoperaciones = HisVacacionesPersona::cantidadHistoricoSubMayor($arrVac[0]['idvacacionespersona']);
        }

        $cantidad = count($arrVac);
        if ($cantidad > 0) {
            $objHis = new HisVacacionesPersona();
            foreach ($arrVac as $k => &$v) {
                $arrUltOperacion = $objHis->obtenerUltimaOperacionSubMayor($v['idvacacionespersona']);
                if (count($arrUltOperacion) > 0) {
                    $v['tiempoacumulado'] = $arrUltOperacion[0]['saldoentiempo'];
                    $v['importeacumulado'] = $arrUltOperacion[0]['saldoenimporte'];
                } else {
                    $v['tiempoacumulado'] = 0.00;
                    $v['importeacumulado'] = 0.00;
                }
                $v['cantidadoperaciones'] = $cantidadoperaciones;
            }
        }

        //Imprimiendo los datos del submayor de vacaciones.
        echo Zend_Json::encode(array('datos' => $arrVac, 'cantidad' => $cantidad));

    }

    public function obtenerListadoActualizacionesAction()
    {
        //Creando el modelo de negocio de gestión de vacaciones de las personas.
        $VacPer = new HisVacacionesPersona();
        $rhistorico = $VacPer->obtenerHistoricoSubMayor(
            $this->_getParam('idvacacionespersona'),
            $this->_getParam('start'),
            $this->_getParam('limit')
        );
        $cantidad = $VacPer->cantidadHistoricoSubMayor($this->_getParam('idvacacionespersona'));
        $arrmeses = NomMes::obteneTodosNomMes();
        $caracteranno = 1000;
        $annoinicial = 0;
        foreach ($rhistorico as $k => &$h) {
            $mes = explode('-', $h['periodo'])[0];
            $anno = explode('-', $h['periodo'])[1];
            $nombremes = $arrmeses[intval($mes) - 1]['denominacion'];
            if ($annoinicial != $anno) {
                $annoinicial = $anno;
                $caracteranno --;
            }
            $h['periodo'] = $caracteranno . "-" . $mes . "-" . $nombremes . "-" . $anno;
            if ($h['saldoentiempo'] > 0) {
                $h['promedioimporte'] = number_format($h['saldoenimporte'] / $h['saldoentiempo'], 2, '.', '');
            } else {
                $h['promedioimporte'] = 0.00;
            }

        }
        //Imprimiendo los datos del submayor de vacaciones.
        echo Zend_Json::encode(array('datos' => $rhistorico, 'cantidad' => $cantidad));
    }

    public function obtenerListadoActualizacionesAjusteAction()
    {
        //Creando el modelo de negocio de gestión de vacaciones de las personas.
        $VacPer = new HisVacacionesPersona();
        $rhistorico = $VacPer->obtenerHistoricoAjusteSubMayor(
            $this->_getParam('idhisvacacionespersona'),
            $this->_getParam('start'),
            $this->_getParam('limit')
        );
        $cantidad = $VacPer->cantidadHistoricoAjusteSubMayor($this->_getParam('idhisvacacionespersona'));


        //Imprimiendo los datos del submayor de vacaciones.
        echo Zend_Json::encode(array('datos' => $rhistorico, 'cantidad' => $cantidad));

    }

    /**
     * Accion para adicionar los datos generales del submayor de vacaciones.
     */
    public function adicionarDatosGeneralesSubVacacionesAction()
    {

        //Creando el modelo de negocio de gestión de vacaciones de las personas.
        $modeloNegocioVacPer = new DatVacacionesPersonaModel();

        //Insertando los datos de las vacaciones de la persona.
        $r = $modeloNegocioVacPer->adicionarDatosVacacionesPersona(
                $this->_getParam('idpersona'),
                $this->_getParam('identidad'),
                $this->_getParam('tiempo'),
                $this->_getParam('importe'),
                $this->_getParam('fechainicio'),
                $this->_getParam('fechafin'),
                $this->_getParam('idvacacionespersona')
            );
        
        if ($r == 1) {
            //Devolviendo una notificación de que todo ocurrió correctamente.
            echo "{'codMsg':'1'}";            
        } else if ($r == 2) {
            echo "{'codMsg':'2'}";
        } 

    }

    /**
     * Accion para modificar los datos generales del submayor de vacaciones.
     */
    public function modificarDatosGeneralesSubVacacionesAction()
    {

        //Creando el modelo de negocio de gestión de vacaciones de las personas.
        $modeloNegocioVacPer = new DatVacacionesPersonaModel();

        //Modificando los datos de las vacaciones de la persona.
        $modeloNegocioVacPer->modificarDatosVacacionesPersona(
            $this->_getParam('idpervac'),
            $this->_getParam('idpersona'),
            $this->_getParam('identidad'),
            $this->_getParam('tiempo'),
            $this->_getParam('importe'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin')
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo "{'codMsg':'1'}";
    }

    /**
     * Accion para eliminar los datos generales del submayor de vacaciones.
     */
    public function eliminarDatosGeneralesSubVacacionesAction()
    {

        //Creando el modelo de negocio de gestión de vacaciones de las personas.
        $modeloNegocioVacPer = new DatVacacionesPersonaModel();

        //Eliminando los datos de las vacaciones de la persona.
        $modeloNegocioVacPer->eliminarDatosVacacionesPersona(
            $this->_getParam('idpervac')
        );

        //Eliminando los datos de las vacaciones de todas las personas
        //$modeloNegocioVacPer->eliminarTodasCargasIniOperacionesSubmayorEntidad($this->_getParam('identidad'));

        //Devolviendo una notificación de que todo ocurrió correctamente
        echo "{'codMsg':'1'}";
    }

    /**
     * Accion para obtener las variables del submayor de vacaciones.
     */
    public function obtenerVariablesAcumLiqAction()
    {
        //Creando el modelo de negocio de gestión de vacaciones de las personas.
        $modeloNegocioVacPer = new DatVacacionesPersonaModel();

        //Obteniendo los datos generales de las variables de acum/liq de vacaciones.
        $arrVar = $modeloNegocioVacPer->obtenerVariablesAcumLiq();
        $iocObj = ZendExt_Ioc_Inter::getInstance();
        foreach ($arrVar as $k => &$v) {
            if ($v['idexpresionmatematica'] != '' || $v['idexpresionmatematica'] != null) {
                $f = $iocObj->comun->BuscarTodosporarrIdExpresionMatematica(array($v['idexpresionmatematica']));
                if (count($f) > 0)
                    $v['expresionmatematica'] = $f[0]['expresionamostrar'];
                else
                    $v['expresionmatematica'] = '';
            }
        }

        //Imprimiendo los datos del submayor de vacaciones.
        echo Zend_Json::encode(array('datos' => $arrVar, 'cantidad' => count(arrVar)));

    }

    public function obtenerListadoVariablesAuxiliaresFormulaAction()
    {
        $obj = new DatVacacionesVariables();
        $r = $obj->obtenerVariablesAcumulacionLiquidacion();
        echo json_encode(array('datos' => $r, 'cantidad' => count($r)));
    }

    public function actualizarDatosGeneralesHistoricoVacacionesAction()
    {
        $modeloNegocioVacPer = new HisVacacionesPersonaModel();
        $identidad = $this->_getParam('identidad');
        $idvacacionespersona = $this->_getParam('idpervac');

        //Insertando los datos de las vacaciones de la persona.
        $r = $modeloNegocioVacPer->actualizarDatosGeneralesHistoricoVacaciones(
            $idvacacionespersona,
            $identidad,
            $this->_getParam('idhisvacacionespersona'),
            $this->_getParam('fecha'),
            $this->_getParam('ajustetiempo'),
            $this->_getParam('ajusteimporte'),
            $this->_getParam('tipoajuste'),
            $this->_getParam('observaciones')
        );

        //Cuadrando las operaciones de la persona en el submayor
        $this->cuadrarSubMayorVacacionesPersonasAltas($identidad, $idvacacionespersona);

        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo "{'codMsg':" . $r . "}";
    }

    public function eliminarDatosGeneralesHisVacacionesAction()
    {

        //Borro los datos del Sub Mayor
        $hissubmayor = Doctrine::getTable('HisVacacionesPersona')->find($this->_getParam('idhisvacacionespersona'));
        $hissubmayor->delete();
        /*$hissubmayor = Doctrine::getTable('HisVacacionesPersona')->findAll();
        $hissubmayor->delete();*/

        //Devolviendo una notificación de que todo ocurrió correctamente
        echo "{'codMsg':'1'}";
    }

    public function exportarNotificacionVacacionesAction()
    {
        $identidad = $this->_getParam('identidad');
        $objvacaciones = new DatVacacionesPersona();
        $objhisvacaciones = new HisVacacionesPersona();
        $objReportePDF = new ReporteSubVacacionespdfModel();

        $arrayfinalreporte = array();
        $personasvacaciones = $objvacaciones->obtenerPersonasHanIniciadoSubMayorVac($identidad, array());
        $iocObj = ZendExt_Ioc_Inter::getInstance();
        foreach ($personasvacaciones as $i => $valor) {
            $datospersona = $iocObj->pvd->DevolverPersonasPrincipalesPersonaById(array($valor['idpersona']));
            $arrUltOperacion = $objhisvacaciones->obtenerUltimaOperacionSubMayor($valor['idvacacionespersona']);
            $arrayfinalreporte[$i]['numid'] = $datospersona[0]->numid;
            $arrayfinalreporte[$i]['nombre'] = $datospersona[0]->nombre;
            $arrayfinalreporte[$i]['snombre'] = $datospersona[0]->snombre;
            $arrayfinalreporte[$i]['papel'] = $datospersona[0]->papel;
            $arrayfinalreporte[$i]['sapel'] = $datospersona[0]->sapel;
            $arrayfinalreporte[$i]['categoria'] = $datospersona[0]->categoria;
            $arrayfinalreporte[$i]['tiempoacumuladoinicial'] = $valor['tiempoacumuladoinicial'];
            $arrayfinalreporte[$i]['importeacumuladoinicial'] = $valor['importeacumuladoinicial'];
            if (count($arrUltOperacion) > 0) {
                $arrayfinalreporte[$i]['saldoentiempo'] = $arrUltOperacion[0]['saldoentiempo'];
                $arrayfinalreporte[$i]['saldoenimporte'] = $arrUltOperacion[0]['saldoenimporte'];
            } else {
                $arrayfinalreporte[$i]['saldoentiempo'] = 0.00;
                $arrayfinalreporte[$i]['saldoenimporte'] = 0.00;
            }
        }
        $objReportePDF->construirReporte($arrayfinalreporte);
    }

    public function exportarSubMayorGeneralAction()
    {
        $objNominaSaldoAcumLiq = null;
        //$importesvacaciones = array();
        $contobj = 0;
        $fechainicio = $this->_getParam('fechainicio');
        $fechafin = $this->_getParam('fechafin');
        $identidad = $this->_getParam('identidad');

        $nombreentidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($identidad)[0]->denominacion;


        $saldoinicial = DatVacacionesPersona::obtenerSaldoInicialEntidad($identidad)[0]['saldoinicial'];
        $importeacumulacion = HisVacacionesPersona::obtenerImporteTotalAcumulacion($identidad);
        $importeliquidacion = HisVacacionesPersona::obtenerImporteTotalLiquidacion($identidad);
        $importesvacaciones['acumulacion'] = $importeacumulacion;
        $importesvacaciones['liquidacion'] = $importeliquidacion;

        $objReportePDF = new ReporteSubVacacionespdfModel();
        //	$objReportePDF->construirReporteGeneral($objNominaSaldoAcumLiq, $fechainicio, $fechafin);
        //print_r($importesvacaciones);die;
        $objReportePDF->construirReporteGeneral($importesvacaciones, $saldoinicial, $fechainicio, $fechafin, $nombreentidad, $identidad);
    }

    public function exportarSubMayorPorTrabajadorAction()
    {
        $identidad = $this->_getParam('identidad');
        $formato = $this->_getParam('formato');
        $params = $this->_getParam('params');
        $limitetiempo = $this->_getParam('limitetiempo');
        $arrayidpersonas = json_decode(stripslashes($this->_getParam('arrayidpersonas')));
        $nombreentidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($identidad)[0]->denominacion;
        $objReportePDF = new ReporteSubVacacionespdfModel();
        $objhisvacaciones = new HisVacacionesPersona();
        if ($params == 1) {
            $objReportePDF->construirReportePorTrabajador($arrayidpersonas, $identidad, $nombreentidad);
        } else {
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $sql = "select dvp.idpersona,dvp.tiempoacumuladoinicial,dvp.importeacumuladoinicial,dvp.idvacacionespersona,
            hv.idhisvacacionespersona,hv.tipooperacion,hv.tiempoacumulado,hv.importeacumulado,hv.saldoentiempo,hv.saldoenimporte
		    from mod_nomina.his_vacacionespersona hv
            left join mod_nomina.dat_vacacionespersona dvp on(dvp.idvacacionespersona = hv.idvacacionespersona)
		    where dvp.identidad = ? and dvp.fechafin is null order by hv.idhisvacacionespersona DESC";
            $r = $conn->fetchAll($sql, array($identidad));
            //Organizando(indexando) las operaciones por persona
            $operacionespersona = array();
            foreach ($r as &$op) {
                if (empty($op['saldoentiempo']) && empty($op['saldoenimporte'])) {
                    $op['saldoentiempo'] = $op['tiempoacumuladoinicial'];
                    $op['saldoenimporte'] = $op['importeacumuladoinicial'];
                }
                $operacionespersona[$op['idpersona']][] = $op;
            }
            //Sumando lo acumulado y liquidado por cada persona en dias e importe
            $cont = 0;
            $r = array();
            foreach ($operacionespersona as $idpersona => $operacion) {
                $r[$cont]['idpersona'] = $idpersona;
                $r[$cont]['tiempoinicial'] = $operacion[0]['tiempoacumuladoinicial'];
                $r[$cont]['importeinicial'] = $operacion[0]['importeacumuladoinicial'];
                $r[$cont]['saldofinaltiempo'] = $operacion[0]['saldoentiempo'];
                $r[$cont]['saldofinalimporte'] = $operacion[0]['saldoenimporte'];
                foreach ($operacion as $op) {
                    if ($op['tipooperacion'] == 1) {
                        $r[$cont]['tiempoacumulado'] += $op['tiempoacumulado'];
                        $r[$cont]['importeacumulado'] += $op['importeacumulado'];
                    } else {
                        $r[$cont]['tiempopagado'] += $op['tiempoacumulado'];
                        $r[$cont]['importepagado'] += $op['importeacumulado'];
                    }
                }
                $cont++;
            }

            //Obteniendo los datos principales de todas las personas
            $arrdatos = $objhisvacaciones->datosPersonaDadoId($identidad);
            $arrdatpersona = array();
            foreach ($arrdatos as $p) {
                $arrdatpersona[$p['idpersona']] = $p;
            }
            $cont = 0;
            $objNominaSaldoAcumLiq = array();
            foreach ($r as $i => $valor) {
                //Verifico si el reporte es solo a las personas con limite de tiempo acumulado (>= 20 dias)
                if ($valor['saldofinaltiempo'] >= 20) {
                    $objNominaSaldoAcumLiq[$cont]->idpersona = $valor['idpersona'];
                    $objNominaSaldoAcumLiq[$cont]->ci = $arrdatpersona[$valor['idpersona']]['numero'];
                    $nombrecompleto = (!empty($arrdatpersona[$valor['idpersona']]['snombre'])) ? $arrdatpersona[$valor['idpersona']]['nombre'] . " " .
                        $arrdatpersona[$valor['idpersona']]['snombre'] . " " . $arrdatpersona[$valor['idpersona']]['papel'] . " " . $arrdatpersona[$valor['idpersona']]['sapel'] :
                        $arrdatpersona[$valor['idpersona']]['nombre'] . " " . $arrdatpersona[$valor['idpersona']]['papel'] . " " . $arrdatpersona[$valor['idpersona']]['sapel'];
                    $objNominaSaldoAcumLiq[$cont]->nombreyapp = $nombrecompleto;
                    $objNominaSaldoAcumLiq[$cont]->idarea = $arrdatpersona[$valor['idpersona']]['idarea'];
                    $objNominaSaldoAcumLiq[$cont]->area = $arrdatpersona[$valor['idpersona']]['area'];
                    $objNominaSaldoAcumLiq[$cont]->ordenarea = $arrdatpersona[$valor['idpersona']]['orden'];
                    $objNominaSaldoAcumLiq[$cont]->tiempoinicial = $valor['tiempoinicial'];
                    $objNominaSaldoAcumLiq[$cont]->importeinicial = $valor['importeinicial'];
                    $objNominaSaldoAcumLiq[$cont]->tiempoacumulado = $valor['tiempoacumulado'];
                    $objNominaSaldoAcumLiq[$cont]->importeacumulado = $valor['importeacumulado'];
                    $objNominaSaldoAcumLiq[$cont]->tiempopagado = $valor['tiempopagado'];
                    $objNominaSaldoAcumLiq[$cont]->importepagado = $valor['importepagado'];
                    $objNominaSaldoAcumLiq[$cont]->saldofinaltiempo = $valor['saldofinaltiempo'];
                    $objNominaSaldoAcumLiq[$cont]->saldofinalimporte = $valor['saldofinalimporte'];
                    $cont++;
                }
            }

            $conn->commit();
            $objNominaSaldoAcumLiq = $this->indexarArreglo($objNominaSaldoAcumLiq, 'idarea');
            // $objReportePDF->construirReporteCombinado($objNominaSaldoAcumLiq, $limitetiempo, $identidad, $nombreentidad);
            
            if ($formato == 1) { 
                $objReportePDF->construirReporteCombinado($objNominaSaldoAcumLiq, $limitetiempo, $identidad, $nombreentidad);
            } else {
                //Pintando el Excel 
                $objPHPExcel = new PHPExcel();
                $objReporteExcel = new ReporteExportarExcelModel();
                $row = 1;
                $objPHPExcel->getActiveSheet()->getStyle('A') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
                $objPHPExcel->getActiveSheet()->getStyle('B') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
                $objPHPExcel->getActiveSheet()->getStyle('C') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
                $objPHPExcel->getActiveSheet()->getStyle('D') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
                $objPHPExcel->getActiveSheet()->getStyle('E') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
                $objPHPExcel->getActiveSheet()->getStyle('F') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
                $objPHPExcel->getActiveSheet()->getStyle('G') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
                $objPHPExcel->getActiveSheet()->getStyle('H') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
                $objPHPExcel->getActiveSheet()->getStyle('I') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
                $objPHPExcel->getActiveSheet()->getStyle('J') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
                $objPHPExcel->getActiveSheet()->getStyle('K') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
                $objPHPExcel->getActiveSheet()->getStyle('L') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
                $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(8);
                $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(8);
                $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(15);
                $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(50);
                $objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(15);
                $objPHPExcel->getActiveSheet()->getColumnDimension('F')->setWidth(15);
                $objPHPExcel->getActiveSheet()->getColumnDimension('G')->setWidth(15);
                $objPHPExcel->getActiveSheet()->getColumnDimension('H')->setWidth(15);
                $objPHPExcel->getActiveSheet()->getColumnDimension('I')->setWidth(15);
                $objPHPExcel->getActiveSheet()->getColumnDimension('J')->setWidth(15);
                $objPHPExcel->getActiveSheet()->getColumnDimension('K')->setWidth(15);
                $objPHPExcel->getActiveSheet()->getColumnDimension('L')->setWidth(15);

                $objPHPExcel->getActiveSheet()->mergeCells('A'.$row.':L'.$row);
                $objReporteExcel->fnPintarCelda($objPHPExcel,'A',$row, " ".'SUB MAYOR VACACIONES TRABAJADORES CON MÁS DE 20 DÍAS ACUMULADOS', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                $row ++;
                $objPHPExcel->getActiveSheet()->mergeCells('A'.$row.':D'.$row);
                $objReporteExcel->fnPintarCelda($objPHPExcel,'A',$row, " ".'ENTIDAD: '.$nombreentidad, null, '000000', 'Arial', 10, '000000', 'left', 'center', 0, 1);
                // $objReporteExcel->fnPintarCelda($objPHPExcel,'B',$row, " ".' ', 'l,t,r,b', '000000', 'Arial', 12, '000000', 0, 1);
                // $objReporteExcel->fnPintarCelda($objPHPExcel,'C',$row, " ".' ', 'l,t,r,b', '000000', 'Arial', 12, '000000', 0, 1);

                $row = 3;
                $objPHPExcel->getActiveSheet()->mergeCells('E'.$row.':F'.$row);//print_r($row);die;
                $objReporteExcel->fnPintarCelda($objPHPExcel, 'E', $row, 'Carga inicial', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                $objReporteExcel->fnPintarCelda($objPHPExcel,'F',$row, " ".' ', 'l,t,r,b', '000000', 'Arial', 12, '000000', 0, 1);

                $objPHPExcel->getActiveSheet()->mergeCells('G'.$row.':H'.$row);
                $objReporteExcel->fnPintarCelda($objPHPExcel, 'G', $row, 'Total acumulado', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                $objReporteExcel->fnPintarCelda($objPHPExcel,'H',$row, " ".' ', 'l,t,r,b', '000000', 'Arial', 12, '000000', 0, 1);

                $objPHPExcel->getActiveSheet()->mergeCells('I'.$row.':J'.$row);
                $objReporteExcel->fnPintarCelda($objPHPExcel, 'I', $row, 'Total pagado', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                $objReporteExcel->fnPintarCelda($objPHPExcel,'J',$row, " ".' ', 'l,t,r,b', '000000', 'Arial', 12, '000000', 0, 1);

                $objPHPExcel->getActiveSheet()->mergeCells('K'.$row.':L'.$row);
                $objReporteExcel->fnPintarCelda($objPHPExcel, 'K', $row, 'Saldo Final', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                $objReporteExcel->fnPintarCelda($objPHPExcel,'l',$row, " ".' ', 'l,t,r,b', '000000', 'Arial', 12, '000000', 0, 1);
                
                $row = 4;
                //Encabezado
                $objReporteExcel->fnPintarCelda($objPHPExcel, 'A', $row, 'No.', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                $objReporteExcel->fnPintarCelda($objPHPExcel, 'B', $row, 'Cod.', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                $objReporteExcel->fnPintarCelda($objPHPExcel, 'C', $row, 'CI', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                $objReporteExcel->fnPintarCelda($objPHPExcel, 'D', $row, 'Nombre y apellidos', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                $objReporteExcel->fnPintarCelda($objPHPExcel, 'E', $row, 'Días', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                $objReporteExcel->fnPintarCelda($objPHPExcel, 'F', $row, 'Importe', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                $objReporteExcel->fnPintarCelda($objPHPExcel, 'G', $row, 'Días', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                $objReporteExcel->fnPintarCelda($objPHPExcel, 'H', $row, 'Importe', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                $objReporteExcel->fnPintarCelda($objPHPExcel, 'I', $row, 'Días', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                $objReporteExcel->fnPintarCelda($objPHPExcel, 'J', $row, 'Importe', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                $objReporteExcel->fnPintarCelda($objPHPExcel, 'K', $row, 'Días', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                $objReporteExcel->fnPintarCelda($objPHPExcel, 'L', $row, 'Importe', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);

                $count = 1;
                $var = 0;
                $tiempoinicialfinal = 0;
                $importeinicialfinal = 0;
                $tiempoacumuladofinal = 0;
                $importeacumuladofinal = 0;
                $tiempopagadofinal = 0;
                $importepagadofinal = 0;
                $saldofinaltiempofinal = 0;
                $saldofinalimportefinal = 0;
                $contcentros = 0;
                
                foreach ($objNominaSaldoAcumLiq as $i => $centro){
                    list($num, $denomarea) = explode('-', $centro['centro']);

                    $row ++;
                    $objPHPExcel->getActiveSheet()->mergeCells('A'.$row.':L'.$row, PHPExcel_Style_Fill::FILL_SOLID, 'BDD7EE');
                    $objReporteExcel->fnPintarCelda($objPHPExcel,'A',$row, " ".$denomarea, 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                    $objReporteExcel->fnPintarCelda($objPHPExcel,'B',$row, " ".' ', 'l,t,r,b', '000000', 'Arial', 12, '000000', 0, 1);
                    $objReporteExcel->fnPintarCelda($objPHPExcel,'C',$row, " ".' ', 'l,t,r,b', '000000', 'Arial', 12, '000000', 0, 1);
                    $objReporteExcel->fnPintarCelda($objPHPExcel,'D',$row, " ".' ', 'l,t,r,b', '000000', 'Arial', 12, '000000', 0, 1);
                    $objReporteExcel->fnPintarCelda($objPHPExcel,'E',$row, " ".' ', 'l,t,r,b', '000000', 'Arial', 12, '000000', 0, 1);
                    $objReporteExcel->fnPintarCelda($objPHPExcel,'F',$row, " ".' ', 'l,t,r,b', '000000', 'Arial', 12, '000000', 0, 1);
                    $objReporteExcel->fnPintarCelda($objPHPExcel,'G',$row, " ".' ', 'l,t,r,b', '000000', 'Arial', 12, '000000', 0, 1);
                    $objReporteExcel->fnPintarCelda($objPHPExcel,'H',$row, " ".' ', 'l,t,r,b', '000000', 'Arial', 12, '000000', 0, 1);
                    $objReporteExcel->fnPintarCelda($objPHPExcel,'I',$row, " ".' ', 'l,t,r,b', '000000', 'Arial', 12, '000000', 0, 1);
                    $objReporteExcel->fnPintarCelda($objPHPExcel,'J',$row, " ".' ', 'l,t,r,b', '000000', 'Arial', 12, '000000', 0, 1);
                    $objReporteExcel->fnPintarCelda($objPHPExcel,'K',$row, " ".' ', 'l,t,r,b', '000000', 'Arial', 12, '000000', 0, 1);
                    $objReporteExcel->fnPintarCelda($objPHPExcel,'L',$row, " ".' ', 'l,t,r,b', '000000', 'Arial', 12, '000000', 0, 1);

                    $tiempoinicialcentro = 0;
                    $importeinicialcentro = 0;
                    $tiempoacumuladocentro = 0;
                    $importeacumuladocentro = 0;
                    $tiempopagadocentro = 0;
                    $importepagadocentro = 0;
                    $saldofinaltiempocentro = 0;
                    $saldofinalimportecentro = 0;

                    foreach ($centro as $p => $datos){

                        if($p !== 'centro'){ //print_r($datos->nombreyapp);die;
                            $row++;
                            //No
                            $objReporteExcel->fnPintarCelda($objPHPExcel, 'A', $row, " ".$count, null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
                            //Codigo contable
                            $objReporteExcel->fnPintarCelda($objPHPExcel, 'B', $row, " ", null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
                            //CI
                            $objReporteExcel->fnPintarCelda($objPHPExcel, 'C', $row, " ".$datos->ci, null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
                            //Nombre y apellidos
                            $objReporteExcel->fnPintarCelda($objPHPExcel, 'D', $row, " ".$datos->nombreyapp, null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
                            //Carga inicial Dias - Importe
                            $objReporteExcel->fnPintarCelda($objPHPExcel, 'E', $row, " ".number_format($datos->tiempoinicial, 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
                            $objReporteExcel->fnPintarCelda($objPHPExcel, 'F', $row, $datos->importeinicial, null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
                            //Total acumulado Dias - Importe
                            $objReporteExcel->fnPintarCelda($objPHPExcel, 'G', $row, $datos->tiempoacumulado, null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
                            $objReporteExcel->fnPintarCelda($objPHPExcel, 'H', $row, $datos->importeacumulado, null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
                            //Total pagado Dias - Importe
                            $objReporteExcel->fnPintarCelda($objPHPExcel, 'I', $row, $datos->tiempopagado, null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
                            $objReporteExcel->fnPintarCelda($objPHPExcel, 'J', $row, $datos->importepagado, null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
                            //Saldo final Dias - Importe
                            $objReporteExcel->fnPintarCelda($objPHPExcel, 'K', $row, $datos->saldofinaltiempo, null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
                            $objReporteExcel->fnPintarCelda($objPHPExcel, 'L', $row, $datos->saldofinalimporte, null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);

                            $tiempoinicialcentro += $datos->tiempoinicial; //print_r($row);die;
                            $importeinicialcentro += $datos->importeinicial;
                            $tiempoacumuladocentro += $datos->tiempoacumulado;
                            $importeacumuladocentro += $datos->importeacumulado;
                            $tiempopagadocentro += $datos->tiempopagado;
                            $importepagadocentro += $datos->importepagado;
                            $saldofinaltiempocentro += $datos->saldofinaltiempo;
                            $saldofinalimportecentro += $datos->saldofinalimporte;
                            $count ++;
                        }
                        
                    }
                    $row++;
                    $objPHPExcel->getActiveSheet()->mergeCells('A'.$row.':D'.$row);
                    $objReporteExcel->fnPintarCelda($objPHPExcel,'A',$row, 'Sub Total', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                    $objReporteExcel->fnPintarCelda($objPHPExcel,'B',$row, " ".' ', null, '000000', 'Arial', 10, '000000', 0, 1);
                    $objReporteExcel->fnPintarCelda($objPHPExcel,'C',$row, " ".' ', null, '000000', 'Arial', 10, '000000', 0, 1);
                    $objReporteExcel->fnPintarCelda($objPHPExcel,'D',$row, " ".' ', null, '000000', 'Arial', 10, '000000', 0, 0);

                    //Sub Total Carga inicial Dias - Importe
                    $objReporteExcel->fnPintarCelda($objPHPExcel, 'E', $row, " ".number_format($tiempoinicialcentro, 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                    $objReporteExcel->fnPintarCelda($objPHPExcel, 'F', $row, $importeinicialcentro, null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                    //Sub Total acumulado Dias - Importe
                    $objReporteExcel->fnPintarCelda($objPHPExcel, 'G', $row, $tiempoacumuladocentro, null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                    $objReporteExcel->fnPintarCelda($objPHPExcel, 'H', $row, $importeacumuladocentro, null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                    //Sub Total pagado Dias - Importe
                    $objReporteExcel->fnPintarCelda($objPHPExcel, 'I', $row, $tiempopagadocentro, null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                    $objReporteExcel->fnPintarCelda($objPHPExcel, 'J', $row, $importepagadocentro, null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                    //Sub Saldo final Dias - Importe
                    $objReporteExcel->fnPintarCelda($objPHPExcel, 'K', $row, $saldofinaltiempocentro, null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                    $objReporteExcel->fnPintarCelda($objPHPExcel, 'L', $row, $saldofinalimportecentro, null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);


                    $row++;


                    //Sumando los valores para el total general
                    $tiempoinicialfinal += $tiempoinicialcentro;
                    $importeinicialfinal += $importeinicialcentro;
                    $tiempoacumuladofinal += $tiempoacumuladocentro;
                    $importeacumuladofinal += $importeacumuladocentro;
                    $tiempopagadofinal += $tiempopagadocentro;
                    $importepagadofinal += $importepagadocentro;
                    $saldofinaltiempofinal += $saldofinaltiempocentro;
                    $saldofinalimportefinal += $saldofinalimportecentro;
                }

                $row +=1;
                $objPHPExcel->getActiveSheet()->mergeCells('A'.$row.':D'.$row);
                $objReporteExcel->fnPintarCelda($objPHPExcel,'A',$row, 'Total', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                $objReporteExcel->fnPintarCelda($objPHPExcel,'B',$row, " ".' ', 'l,t,r,b', '000000', 'Arial', 10, '000000', 0, 1);
                $objReporteExcel->fnPintarCelda($objPHPExcel,'C',$row, " ".' ', 'l,t,r,b', '000000', 'Arial', 10, '000000', 0, 1);
                $objReporteExcel->fnPintarCelda($objPHPExcel,'D',$row, " ".' ', 'l,t,r,b', '000000', 'Arial', 10, '000000', 0, 0);

                //Sub Total Carga inicial Dias - Importe
                $objReporteExcel->fnPintarCelda($objPHPExcel, 'E', $row, " ".number_format($tiempoinicialfinal, 2, '.', ''), 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                $objReporteExcel->fnPintarCelda($objPHPExcel, 'F', $row, $importeinicialfinal, 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                //Sub Total acumulado Dias - Importe
                $objReporteExcel->fnPintarCelda($objPHPExcel, 'G', $row, $tiempoacumuladofinal, 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                $objReporteExcel->fnPintarCelda($objPHPExcel, 'H', $row, $importeacumuladofinal, 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                //Sub Total pagado Dias - Importe
                $objReporteExcel->fnPintarCelda($objPHPExcel, 'I', $row, $tiempopagadofinal, 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                $objReporteExcel->fnPintarCelda($objPHPExcel, 'J', $row, $importepagadofinal, 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                //Sub Saldo final Dias - Importe
                $objReporteExcel->fnPintarCelda($objPHPExcel, 'K', $row, $saldofinaltiempofinal, 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                $objReporteExcel->fnPintarCelda($objPHPExcel, 'L', $row, $saldofinalimportefinal, 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);


                //TERMINACION DEL EXCEL*********************************************************
                $objPHPExcel->setActiveSheetIndex(0);
                ob_end_clean();
                header('Content-Type: application/vnd.ms-excel');
                header('Content-Disposition: attachment;filename="SUB MAYOR VACACIONES TRABAJADORES CON MÁS DE 20 DÍAS ACUMULADOS.xls" ');
                header('Cache-Control: max-age=0');
                header('Pragma: no-cache');
                header('Expires: 0');
                $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
                ob_end_clean();
                echo($objWriter->save('php://output'));
                $objPHPExcel->disconnectWorksheets();
                unset($objPHPExcel);
                return 1;
            }
        }
    }

    public function importarCargaInicialAction()
    {
        $identidad = $this->_getParam('identidad');

        $exportar = $this->_getParam('exportar');
        $nombreentidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($identidad)[0]->denominacion;

        if ($exportar == -1) {
            $objCargaInicial = null;
            //Creo el obj del reporte
            $objReportePDF = new ReporteSubVacacionespdfModel();
            //Busco los datos del submayor
            $sqlDatosCargaInicial = "SELECT DISTINCT(dp.idpersona),dp.nombre,dp.papel,dp.sapel, dp.sexo,cpn.orden,doc.numero as numid,dvac.tiempoacumuladoinicial, dvac.importeacumuladoinicial,cpn.denominacion as area,
                            (CASE WHEN dp.snombre is not null THEN dp.snombre ELSE '' END) as snombre,
                            (CASE WHEN dco.idplantillanominal is not null THEN dco.idplantillanominal WHEN cpn.idplantillanominal is not null THEN cpn.idplantillanominal ELSE -1 END) as idarea,
                            ((CASE WHEN dco.idplantillanominal is not null THEN (select cpx.orden ||'-'|| cpx.denominacion from mod_nomina.conf_plantillanominal cpx where cpx.idplantillanominal = dco.idplantillanominal) WHEN cpn.denominacion <> '' THEN cpn.orden ||'-'|| cpn.denominacion ELSE 'Sin plantilla nominal' END)) as plantilla,
                                           nfe.nivel
                   		   from mod_nomina.dat_vacacionespersona dvac 
						   inner join mod_persona.dat_persona dp on(dp.idpersona = dvac.idpersona)
						   inner join mod_persona.dat_docidentidad doc on (doc.idpersona = dvac.idpersona)
						   inner join mod_nomina.dat_cargosocupados dco on(dco.idpersona = dp.idpersona)
                           inner join mod_nomina.conf_plantillanominalcargo cpnca on(cpnca.idcargo = dco.idcargo)
                           inner join mod_nomina.conf_plantillanominal cpn on(cpn.idplantillanominal = cpnca.idplantillanominal)
                           LEFT JOIN mod_estructuracomp.dat_cargo dc on (dc.idcargo = dco.idcargo)
                           INNER JOIN mod_estructuracomp.nom_filaestruc nfe on (nfe.idfila = dc.idcargo)
                           LEFT JOIN mod_estructuracomp.nom_cargo nc on (nc.idnomcargo = dc.idnomcargo)
						   where dp.feliminado is null and dvac.identidad=? and doc.principal=1 order by cpn.orden ASC,nfe.nivel ASC ;";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();

            $arrdatcargainicial = $conn->fetchAll($sqlDatosCargaInicial, array($identidad));
            if (count($arrdatcargainicial) > 0) {
                foreach ($arrdatcargainicial as $i => $value) {
                    $objCargaInicial[$value['idarea']]['centro'] = $value['area'];
                    $objCargaInicial[$value['idarea']]['personas'][$i]->ci = $value['numid'];
                    $objCargaInicial[$value['idarea']]['personas'][$i]->nombre = $value['nombre'] . " " . $value['snombre'] . " " . $value['papel'] . " " . $value['sapel'];
                    $objCargaInicial[$value['idarea']]['personas'][$i]->tiempoacumuladoinicial = $value['tiempoacumuladoinicial'];
                    $objCargaInicial[$value['idarea']]['personas'][$i]->importeacumuladoinicial = $value['importeacumuladoinicial'];
                }

            }

            //Mando a construir el reporte
            $objReportePDF->construirReporteCargaInicial($identidad, $objCargaInicial, $nombreentidad);
        } else {
            $arraypersonasnomacheadas = array();
            $contador = 0;
            //Para archivos xls. OJO no pincha para .xlsx
            $inputFileType = 'Excel5';
            $dir_file = $_FILES['fileUpload']['tmp_name'];
            //Creando un Reader de PhpExcel para 2005
            $objReader = PHPExcel_IOFactory::createReader($inputFileType);
            $objReader->setReadDataOnly(true);
            //Si la direccion del archivo existe
            $nombresnoinfo = '';
            if (file_exists($dir_file)) {
                //Cargando el archivo
                $objPHPExcel = $objReader->load($dir_file);
                //Obteniendo los datos en un array
                $worksheettoarray = $objPHPExcel->getActiveSheet()->toArray(null, true, true, true);

                if (count($worksheettoarray) > 1) {
                    //Borro los datos del Sub Mayor por entidades
                    /*$datossubmayor = DatVacacionesPersona::obtenerDatosVacacionesPersonaEntidad($identidad);
                    if (count($datossubmayor) > 0) {
                        foreach ($datossubmayor as $is => $rs) {
                            $datoshisvacaciones = HisVacacionesPersona::obtenerHisVacacionesPersona($rs['idvacacionespersona']);
                            if (count($datoshisvacaciones) > 0) {
                                foreach ($datoshisvacaciones as $dh => $rdh) {
                                    $hissubmayor = Doctrine::getTable('HisVacacionesPersona')->find($rdh['idhisvacacionespersona']);
                                    $hissubmayor->delete();
                                }
                            }
                            $submayor = Doctrine::getTable('DatVacacionesPersona')->find($rs['idvacacionespersona']);
                            $submayor->delete();
                        }
                    }*/
                    //Validando que no hallan personas sin datos en el excel

                    /*foreach($worksheettoarray as $i => $arrworksheet) {
                        if($i > 1){
                            if($arrworksheet['C'] == null || $arrworksheet['D'] == null){
                                $nombresnoinfo = $nombresnoinfo . ',' . $arrworksheet['B'];

                            }
                        }

                    }
                    if($nombresnoinfo != ''){
                        $obj->nombre = $nombresnoinfo;
                        $obj->texto = 'NO-PERSONA-DATOS-EXCEL';
                        //echo json_encode($obj);
                    }*/

                    //Recorro el array para insertar en el submaor de vacaciones
                    foreach ($worksheettoarray as $i => $arrworksheet) {
                        if ($i > 1) {
                            $ci = $arrworksheet['A'];
                            //Dame los datos de las personas pasandole su # de carnet
                            $sqlDatosPersona = "select dp.idpersona, dp.nombre, dp.snombre, dp.papel, dp.sapel from mod_persona.dat_persona dp
						   inner join mod_persona.dat_docidentidad dpdoc on(dpdoc.idpersona = dp.idpersona)
						   inner join mod_nomina.dat_cargosocupados dco on(dco.idpersona = dp.idpersona and dco.identidad = $identidad)
						   where dpdoc.numero ilike '$ci' and dp.feliminado is null and dpdoc.principal = 1;";
                            $mg = Doctrine_Manager::getInstance();
                            $conn = $mg->getCurrentConnection();
                            $arrdatpersona = $conn->fetchAll($sqlDatosPersona);
                            
                            $idpersona = $arrdatpersona[0]['idpersona'];
                            $sqlexiste = "SELECT count(*) FROM mod_nomina.dat_vacacionespersona where idpersona = $idpersona;";
                            $existe = $conn->fetchOne($sqlexiste);

                            if ($existe > 0) {
                                $arraypersonasexisten[$contador] = $arrworksheet['B'];
                                $contador++;
                            }else {
                                if ($arrdatpersona[0]['idpersona'] != "" || $arrdatpersona[0]['idpersona'] != null && $ci != "") {
                                    //Borrando los datos de las personas en el submayor
                                    //Borro los datos del Sub Mayor por entidades
                                    $datossubmayor = DatVacacionesPersona::obtenerDatosVacacionesPersona($arrdatpersona[0]['idpersona'], $identidad);
                                    if (count($datossubmayor) > 0) {
                                        foreach ($datossubmayor as $is => $rs) {
                                            $datoshisvacaciones = HisVacacionesPersona::obtenerHisVacacionesPersona($rs['idvacacionespersona']);
                                            if (count($datoshisvacaciones) > 0) {
                                                foreach ($datoshisvacaciones as $dh => $rdh) {
                                                    $hissubmayor = Doctrine::getTable('HisVacacionesPersona')->find($rdh['idhisvacacionespersona']);
                                                    $hissubmayor->delete();
                                                }
                                            }
                                            $submayor = Doctrine::getTable('DatVacacionesPersona')->find($rs['idvacacionespersona']);
                                            $submayor->delete();
                                        }
                                    }
    
    
                                    //Obj Sub Mayor de Vacaciones
                                    $objsubmayor = new DatVacacionesPersona();
                                    $objsubmayor->idpersona = $arrdatpersona[0]['idpersona'];
    
                                    $objsubmayor->identidad = $identidad;
                                    $objsubmayor->tiempoacumuladoinicial = ($arrworksheet['C']) ? $arrworksheet['C'] : 0.00;
                                    $objsubmayor->importeacumuladoinicial = ($arrworksheet['D']) ? $arrworksheet['D'] : 0.00;
                                    $objsubmayor->fechainicio = date('d/m/Y');
                                    $objsubmayor->fechafin = "";
                                    $objsubmayor->save();
    
    
                                } else {
                                    //Lleno el array con los nombres de los que no machearon
                                    if ($arrworksheet['B'] != "" || $arrworksheet['B'] != null) {
                                        $arraypersonasnomacheadas[$contador] = $arrworksheet['B'];
                                        $contador++;
                                    }
    
                                }
                            }

                        }
                    }
                }
            }
            $texto = "";
            //Recorro para concatenar los q no machearon
            foreach ($arraypersonasnomacheadas as $cc => $nomach) {
                if ($texto == "") {
                    $texto = $nomach . ", ";
                } else {
                    $texto = $texto . ", " . $nomach;
                }
            }
            //Recorro para concatenar los q tienen carga inicial
            foreach ($arraypersonasexisten as $cc => $nomach) {
                if ($texto == "") {
                    $texto = $nomach ;
                } else {
                    $texto = $texto . ", " . $nomach;
                }
            }
            $objreturn = null;
            if (count($arraypersonasnomacheadas) > 0) {
                $objreturn->mach = -1;
                $objreturn->texto = $texto . ', ' . $nombresnoinfo;
            }elseif (count($arraypersonasexisten) > 0) {
                $objreturn->mach = -2;
                $objreturn->texto = $texto . ', ' . $nombresnoinfo;
            } else {
                $objreturn->mach = 1;
            }
            $r['success'] = true;
            $r['personas'] = $objreturn;
            echo json_encode($r);
        }

    }

    public function obtenerListadoPersonasDerechoSubmayorAction()
    {
        $idestructura = $this->_request->getPost('idestructura');
        $texto = $this->_request->getPost('texto');
        $inicio = $this->_getParam('start');
        $limite = $this->_getParam('limit');

        $objConfVacaciones = new ConfVacacionesPersona();
        $rpersonasvacaciones = $objConfVacaciones->obtenerDatosVacacionesPersona($idestructura, $texto, $inicio, $limite);
        //orden de las personas por plantillas nominales
        foreach ($rpersonasvacaciones as $p => $persona) {
            $nombreplantilla = (!empty($persona['plantillanominal'])) ? $persona['plantillanominal'] : 'Sin plantilla nominal';
            if ($nombreplantilla != 'Sin plantilla nominal') {
                list($ordenplantilla,) = explode('-', $persona['plantillanominal']);
                $longorden = strlen($ordenplantilla . '');
                $rpersonasvacaciones[$p]['plantillanominal'] = chr(96 + $longorden) . $persona['plantillanominal'];//chr(96) caracter antes de letra "a"
            } else {
                $rpersonasvacaciones[$p]['plantillanominal'] = 'z-' . $nombreplantilla;
            }
        }
        //print_r($rpersonasvacaciones);die;
        $cantidadpersonasvacaciones = $objConfVacaciones->obtenerCantidadDatosVacacionesPersona($idestructura, $texto);

        echo json_encode(array('datos' => $rpersonasvacaciones, 'cantidad' => $cantidadpersonasvacaciones));
    }

    public function adicionarpersonasSubmayorVacacionesAction()
    {
        $idestructura = $this->_request->getPost('idestructura');
        $ridpersonas = Zend_Json::decode(stripslashes($this->_getParam('ridpersonas')));
        foreach ($ridpersonas as $i => $value) {
            $existe = ConfVacacionesPersona::existeVacacionesPersona($value, $idestructura);if ($existe == 0) {
                $objConfVacaciones = new ConfVacacionesPersona();
                $objConfVacaciones->idpersona = $value;
                $objConfVacaciones->idestructura = $idestructura;
                $objConfVacaciones->save();
            }
        }
        echo json_encode('ok');
    }

    public function eliminarPersonasDerechoAction()
    {
        $objdatvacaciones = new DatVacacionesPersona();
        $objhisvacaciones = new HisVacacionesPersona();
        $objDatCargosOcupados = new DatCargosOcupados();
        $identidad = $this->_request->getPost('identidad');
        $arrelementos = Zend_Json::decode(stripslashes($this->_getParam('arrelementos')));
        $arrypersonas = Zend_Json::decode(stripslashes($this->_getParam('arrypersonas')));
        //$verificarocupacion = $this->verificarOcupacion($arrelementos, $identidad);
        //if($verificarocupacion == -1) {
        //Recorriendo las personas
        foreach ($arrelementos as $i => $re) {
            $datosvacacionespersona = $objdatvacaciones->obtenerDatosVacacionesPersona($arrypersonas[$i], $identidad);
            //Si tiene datos en el submayor
            if (count($datosvacacionespersona) > 0) {
                $datoshisvacacionespersona = $objhisvacaciones->obtenerHisVacacionesPersona($datosvacacionespersona[0]['idvacacionespersona']);
                //Si tiene operaciones
                if (count($datoshisvacacionespersona) > 0) {
                    //Recorriendo para eliminar las operaciones
                    foreach ($datoshisvacacionespersona as $ih => $rh) {
                        $objHisDelete = Doctrine::getTable('HisVacacionesPersona')->find($rh['idhisvacacionespersona']);
                        $objHisDelete->delete();
                    }
                }
                $objDatDelete = Doctrine::getTable('DatVacacionesPersona')->find($datosvacacionespersona[0]['idvacacionespersona']);
                $objDatDelete->delete();
            }
            //Eliminando el alta de la persona
            //$idconfvacaciones = ConfVacacionesPersona::obtenerConfVacacionesPersona($re, $identidad);
            // if (count($idconfvacaciones) > 0) {
            //foreach ($idconfvacaciones as $icv => $rcv) {
            $objConfVacDelete = Doctrine::getTable('ConfVacacionesPersona')->find($re);
            $objConfVacDelete->delete();
            // }
            //}
        }
        echo json_encode('ok');

    }

    /*
    public function SubMayorPersonasLimiteTiempo(){
        $objNominaSaldoAcumLiq = null;
        $contobj = 0;

        //Busco las personas que acumularon o liquidaron en el rango de fechas
        $sqlpersonasacumulanliquidan = "select dvac.idpersona from mod_nomina.dat_vacacionespersona dvac";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $arrpersonasacumulanliquidan =  $conn->fetchAll($sqlpersonasacumulanliquidan);
        if(count($arrpersonasacumulanliquidan)>0){
            foreach($arrpersonasacumulanliquidan as $i=>$value){
                //Busco los datos de la persona
                $sqlDatosPersona = "select dp.nombre, dp.snombre, dp.papel, dp.sapel, cpn.denominacion as area from mod_persona.dat_persona dp
            inner join mod_nomina.dat_cargosocupados dcoc on(dcoc.idpersona = dp.idpersona)
            inner join mod_nomina.conf_plantillanominalcargo cpnca on(cpnca.idcargo = dcoc.idcargo)
            inner join mod_nomina.conf_plantillanominal cpn on(cpn.idplantillanominal = cpnca.idplantillanominal)
            where dp.idpersona = ? and dp.feliminado is null and dcoc.fechavencimiento is null;";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $arrdatpersona = $conn->fetchAll($sqlDatosPersona, array($value['idpersona']));
                //Busco lo que acumulo cada persona o se le pago

                $sqldatospersonasacumulanliquidan = "select hv.*, nomtnom.denominacion, nomtnom.idtiponomina, delp.idelaborarpagos
            from mod_nomina.his_vacacionespersona hv
            inner join mod_nomina.dat_vacacionespersona dvac on(dvac.idvacacionespersona = hv.idvacacionespersona)
            inner join mod_nomina.dat_nomina dnom on(dnom.idnomina = hv.idnomina)
            inner join mod_nomina.dat_elaborarpagos delp on(delp.idelaborarpagos = dnom.idelaborarpago)
            inner join mod_nomina.conf_modelonomina cmodn on(cmodn.idtipopago = delp.idtipopago)
            inner join mod_nomina.nom_tiponomina nomtnom on(nomtnom.idtiponomina = cmodn.idtiponomina)
            where dvac.idpersona = ?-- and (hv.fechaoperacion::date BETWEEN '{$fechainicio}' AND '{$fechafin}')
            order by hv.idhisvacacionespersona ASC";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();

                $arrdatospersonasacumulanliquidan =  $conn->fetchAll($sqldatospersonasacumulanliquidan, array($value['idpersona']));
                if(count($arrdatospersonasacumulanliquidan)>0){

                    $importeinicial = $arrdatospersonasacumulanliquidan[0]['saldoenimporte'] - $arrdatospersonasacumulanliquidan[0]['importeacumulado'];
                    $tiempoinicial = $arrdatospersonasacumulanliquidan[0]['saldoentiempo'] - $arrdatospersonasacumulanliquidan[0]['tiempoacumulado'];
                    $tiempopagado = 0;
                    $importepagado = 0;
                    $tiempoacumulado = 0;
                    $importeacumulado = 0;
                    $saldofinalimporte = $arrdatospersonasacumulanliquidan[count($arrdatospersonasacumulanliquidan)-1]['saldoenimporte'];
                    $saldofinaltiempo = $arrdatospersonasacumulanliquidan[count($arrdatospersonasacumulanliquidan)-1]['saldoentiempo'];

                    if($saldofinaltiempo >= 21)
                    {
                        foreach($arrdatospersonasacumulanliquidan as $cc=>$arr){
                            if($arr['tipooperacion'] == 1){
                                $tiempoacumulado += $arr['tiempoacumulado'];
                                $importeacumulado += $arr['importeacumulado'];
                            }else{
                                $tiempopagado += $arr['tiempoacumulado'];
                                $importepagado += $arr['importeacumulado'];
                            }
                        }
                        $objNominaSaldoAcumLiq[$contobj]->idpersona = $value['idpersona'];
                        $objNominaSaldoAcumLiq[$contobj]->ci = $arrdatpersona[0]['numid'];
                        $objNominaSaldoAcumLiq[$contobj]->nombreyapp = $arrdatpersona[0]['nombre'].' '.$arrdatpersona[0]['snombre'].' '.$arrdatpersona[0]['papel'].' '.$arrdatpersona[0]['sapel'];
                        $objNominaSaldoAcumLiq[$contobj]->area = $arrdatpersona[0]['area'];
                        $objNominaSaldoAcumLiq[$contobj]->importeinicial = $importeinicial;
                        $objNominaSaldoAcumLiq[$contobj]->tiempoinicial = $tiempoinicial;
                        $objNominaSaldoAcumLiq[$contobj]->tiempopagado = $tiempopagado;
                        $objNominaSaldoAcumLiq[$contobj]->importepagado = $importepagado;
                        $objNominaSaldoAcumLiq[$contobj]->tiempoacumulado = $tiempoacumulado;
                        $objNominaSaldoAcumLiq[$contobj]->importeacumulado = $importeacumulado;
                        $objNominaSaldoAcumLiq[$contobj]->saldofinalimporte = $saldofinalimporte;
                        $objNominaSaldoAcumLiq[$contobj]->saldofinaltiempo = $saldofinaltiempo;
                        $contobj++;
                    }

                }
            }
        }

    }
    */
    private function verificarOcupacion($arrpersonas, $identidad)
    {
        $objDatCargosOcupados = new DatCargosOcupados();
        foreach ($arrpersonas as $ip => $rp) {
            $ocupacargo = $objDatCargosOcupados->obtenerCargoOcupadoPersonaEntidad($rp, $identidad);
            //Si ocupa cargo
            if (count($ocupacargo) > 0) {
                echo json_encode(1);
            }
        }
        echo json_encode(-1);
    }

    public function exportarListadoSaldosAcumuladosVacacionesAction()
    {
        $identidad = $this->_getParam('identidad');
        $mes = $this->_getParam('mes');
        $anno = $this->_getParam('anno');
        $formato = $this->_getParam('formato');

        $objReportePDF = new ReporteSubVacacionespdfModel();
        $objvacaciones = new DatVacacionesPersona();
        $objhisvacaciones = new HisVacacionesPersona();

        $personasvacaciones = $objvacaciones->obtenerPersonasHanIniciadoSubMayorVac($identidad, null);
        $arrtodasoperacionespersonas = $objhisvacaciones->obtenerTodasOperacionesDePeriodoSubMayor($identidad, $mes . "-" . $anno);

        //Operaciones del mes anterior
        $mesanterior = (intval($mes) == 1) ? 12 : intval($mes) - 1;
        $annomesanterior = (intval($mes) == 1) ? $anno - 1 : $anno;
        $arrultimaoperacionmesanterior = $objhisvacaciones->obtenerTodasOperacionesDePeriodoSubMayor($identidad, ($mesanterior < 10 ? "0" . $mesanterior : $mesanterior) . "-" . $annomesanterior);

        $arrdatos = $objhisvacaciones->datosPersonaDadoId($identidad);

        $arrdatpersona = array();
        foreach ($arrdatos as $p) {
            $arrdatpersona[$p['idpersona']] = $p;
        }

        $contpersona = 0;
        $arraypersonas = array();
        $periodobuscar = ($mesanterior < 10 ? "0" . $mesanterior : $mesanterior) . "-" . $annomesanterior;
        foreach ($personasvacaciones as $i => $valor) {
            $nombrecompleto = (!empty($arrdatpersona[$valor['idpersona']]['snombre'])) ? $arrdatpersona[$valor['idpersona']]['nombre'] . " " .
                $arrdatpersona[$valor['idpersona']]['snombre'] . " " . $arrdatpersona[$valor['idpersona']]['papel'] . " " . $arrdatpersona[$valor['idpersona']]['sapel'] :
                $arrdatpersona[$valor['idpersona']]['nombre'] . " " . $arrdatpersona[$valor['idpersona']]['papel'] . " " . $arrdatpersona[$valor['idpersona']]['sapel'];
            $arraypersonas[$contpersona]['idarea'] = $arrdatpersona[$valor['idpersona']]['idarea'];
            $arraypersonas[$contpersona]['area'] = $arrdatpersona[$valor['idpersona']]['area'];
            $arraypersonas[$contpersona]['orden'] = $arrdatpersona[$valor['idpersona']]['orden'];
            $arraypersonas[$contpersona]['nivel'] = $arrdatpersona[$valor['idpersona']]['nivel'];
            $arraypersonas[$contpersona]['idpersona'] = $valor['idpersona'];
            $arraypersonas[$contpersona]['idvacacionespersona'] = $valor['idvacacionespersona'];
            $arraypersonas[$contpersona]['ci'] = $arrdatpersona[$valor['idpersona']]['numero'];
            $arraypersonas[$contpersona]['nombreyapellidos'] = $nombrecompleto;
            //$arraypersonas[$contpersona]['tiempoacumuladoinicial'] = $valor['tiempoacumuladoinicial'];
            $arraypersonas[$contpersona]['tiempoacumuladoinicial'] = round($valor['tiempoacumuladoinicial'], 2);
            //$arraypersonas[$contpersona]['importeacumuladoinicial'] = $valor['importeacumuladoinicial'];
            $arraypersonas[$contpersona]['importeacumuladoinicial'] = round($valor['importeacumuladoinicial'], 2);

            //Operación de acumulación total en días en el período para la persona en cuestión.
            $acumulaciontotaldias = 0;
            //Operación de acumulación total en importe en el período para la persona en cuestión.
            $acumulaciontotalimporte = 0;
            //Operación de liquidación total en días en el período para la persona en cuestión.
            $liquidaciontotaldias = 0;
            //Operación de liquidación total en importe en el período para la persona en cuestión.
            $liquidaciontotalimporte = 0;
            //Ajuste total en días en el período para la persona en cuestión.
            $ajustetiempo = 0;
            //Ajuste total en importe en el período para la persona en cuestión.
            $ajusteimporte = 0;
            //Tipo de ajuste
            $tipoajuste = 0;
            $contultimoajuste = 0;
            foreach ($arrtodasoperacionespersonas as $o => $operacionespersona) {
                if ($operacionespersona['idvacacionespersona'] == $valor['idvacacionespersona']) {
                    //Listando las operaciones de un a persona especifica para este periodo
                    if ($operacionespersona['tipooperacion'] == 1) {
                        $acumulaciontotaldias += $operacionespersona['tiempoacumulado'];
                        $acumulaciontotalimporte += $operacionespersona['importeacumulado'];
                    } elseif ($operacionespersona['tipooperacion'] == 2) {
                        $liquidaciontotaldias += $operacionespersona['tiempoacumulado'];
                        $liquidaciontotalimporte += $operacionespersona['importeacumulado'];
                    }

                    if (!empty($operacionespersona['tipoajuste']) && empty($contultimoajuste)) {
                        $ajustetiempo = $operacionespersona['ajustetiempo'];
                        $ajusteimporte = $operacionespersona['ajusteimporte'];
                        $tipoajuste = $operacionespersona['tipoajuste'];
                        $contultimoajuste++;
                    }
                }
            }

            //saldoinicial del mes anterior
            $operacionesmesanterior = array();
            $cont = 0;
            $flagoperaciones = 0;
            foreach ($arrultimaoperacionmesanterior as $o => $operacionesmesantpersona) {
                if ($operacionesmesantpersona['idvacacionespersona'] == $valor['idvacacionespersona']) {
                    $operacionesmesanterior[$cont]['saldoentiempo'] = $operacionesmesantpersona['saldoentiempo'];
                    $operacionesmesanterior[$cont]['saldoenimporte'] = $operacionesmesantpersona['saldoenimporte'];
                    $operacionesmesanterior[$cont]['operacioncompleta'] = $operacionesmesantpersona;
                    $cont++;
                    $flagoperaciones = 1;
                }
            }
            //Si la persona no tuvo ninguna operacion el mes anterior se busca el saldo de la ultima operacion q tuvo
            if ($flagoperaciones == 0) {
                //Get periodos submayor de la persona
                $periodosacumulados = HisVacacionesPersona::obtenerPeriodosAcumulados($valor['idvacacionespersona']);
                if (count($periodosacumulados) > 0) {
                    foreach ($periodosacumulados as $pacum) {
                        //Periodo mes anterior parametros
                        $rexplodepb = explode('-', $periodobuscar);
                        $periodobuscarconcat = $rexplodepb[1] . $rexplodepb[0];
                        //Periodos acumulados
                        $rexplodepa = explode('-', $pacum['periodo']);
                        $periodobuscararray = $rexplodepa[1] . $rexplodepa[0];
                        if ($periodobuscararray < $periodobuscarconcat) {
                            $hisvacacionesultimo = HisVacacionesPersona::obtenerTodoHisVacacionesPersona($pacum['idhisvacacionespersona']);
                            $operacionesmesanterior[$cont]['saldoentiempo'] = $hisvacacionesultimo[0]['saldoentiempo'];
                            $operacionesmesanterior[$cont]['saldoenimporte'] = $hisvacacionesultimo[0]['saldoenimporte'];
                            $operacionesmesanterior[$cont]['operacioncompleta'] = $hisvacacionesultimo[0];
                            $cont++;
                        }

                    }
                }
            }

            if (empty($operacionesmesanterior)) {
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();

                $sql = "select hv.idhisvacacionespersona
			from mod_nomina.his_vacacionespersona hv
			where hv.idvacacionespersona = ? and hv.periodo = ?";
                $ridcomparacion = $conn->fetchAll($sql, array($valor['idvacacionespersona'], $mes . "-" . $anno));

                $sql = "select hv.*
			from mod_nomina.his_vacacionespersona hv
		    where hv.idhisvacacionespersona < ? and hv.idvacacionespersona = ? and hv.periodo <> ? order by hv.idhisvacacionespersona DESC";
                $r = $conn->fetchAll($sql, array($ridcomparacion[0]['idhisvacacionespersona'], $valor['idvacacionespersona'], $mes . "-" . $anno));

                if (empty($r)) {
                    $arraypersonas[$contpersona]['saldotiempomesanterior'] = round($valor['tiempoacumuladoinicial'], 2);
                    $arraypersonas[$contpersona]['saldoimportemesanterior'] = round($valor['importeacumuladoinicial'], 2);
                } else {
                    $arraypersonas[$contpersona]['saldotiempomesanterior'] = round($r[0]['saldoentiempo'], 2);
                    $arraypersonas[$contpersona]['saldoimportemesanterior'] = round($r[0]['saldoenimporte'], 2);
                }

            } else {
                $arraypersonas[$contpersona]['saldotiempomesanterior'] = $operacionesmesanterior[0]['saldoentiempo'];
                $arraypersonas[$contpersona]['saldoimportemesanterior'] = $operacionesmesanterior[0]['saldoenimporte'];
            }
            //acumulado mes
            $arraypersonas[$contpersona]['tiempoacumulado'] = (!empty($acumulaciontotaldias)) ? $acumulaciontotaldias : 0.00;
            $arraypersonas[$contpersona]['importeacumulado'] = (!empty($acumulaciontotalimporte)) ? $acumulaciontotalimporte : 0.00;

            //liquidado mes
            $arraypersonas[$contpersona]['tiempoliquidado'] = (!empty($liquidaciontotaldias)) ? $liquidaciontotaldias : 0.00;
            $arraypersonas[$contpersona]['importeliquidado'] = (!empty($liquidaciontotalimporte)) ? $liquidaciontotalimporte : 0.00;

            //ajuste
            $arraypersonas[$contpersona]['ajustetiempo'] = (!empty($ajustetiempo)) ? $ajustetiempo : '';
            $arraypersonas[$contpersona]['ajusteimporte'] = (!empty($ajusteimporte)) ? $ajusteimporte : '';
            $arraypersonas[$contpersona]['tipoajuste'] = (!empty($tipoajuste)) ? $tipoajuste : 0;

            //saldo final
            $ajustetiempo = ($tipoajuste == 2) ? (-1) * $ajustetiempo : $ajustetiempo;
            $ajusteimporte = ($tipoajuste == 2) ? (-1) * $ajusteimporte : $ajusteimporte;
            $acumulaciontotaldiasmes = $acumulaciontotaldias - $liquidaciontotaldias + $ajustetiempo;
            $acumulaciontotalimportemes = $acumulaciontotalimporte - $liquidaciontotalimporte + $ajusteimporte;
            $arraypersonas[$contpersona]['saldoentiempo'] = round($arraypersonas[$contpersona]['saldotiempomesanterior'], 2) + round($acumulaciontotaldiasmes, 2);
            $arraypersonas[$contpersona]['saldoenimporte'] = round($arraypersonas[$contpersona]['saldoimportemesanterior'], 2) + round($acumulaciontotalimportemes, 2);
            $contpersona++;
        }

        //Ordenando el arraypersonas por el orden de las plantillas nominales
        $arraypersonasaux = array();
        foreach ($arraypersonas as $key => $row) {
            $arraypersonasaux[$key] = $row['orden'];
        }
        foreach ($arraypersonas as $keynivel => $rownivel) {
            $arraypersonasauxnivel[$keynivel] = $rownivel['nivel'];
        }

        array_multisort($arraypersonasaux, $arraypersonas);//Ordenando ascendentemente(por defecto)

        $objReportePDF->construirListadoSaldosAcumulados($identidad, $arraypersonas, $mes, $anno, $formato);

        echo json_encode('ok');
    }

    //Función para indexar un arreglo dado un índice
    public function indexarArreglo($array, $indice)
    {
        $arrayfinal = array();
        foreach ($array as $valor) {
            $arrayfinal[$valor->$indice]['centro'] = $valor->area;
            $arrayfinal[$valor->$indice][] = $valor;
        }
        return $arrayfinal;
    }

    public function obtenerPeriodosPagosSubmayorAction()
    {
        $identidad = $this->_getParam('idestructura');
        $objElaborarP = new DatElaborarPagosModel();
        $r = $objElaborarP->obtenerPeriodosPagoEntidadSubmayorV($identidad);

        foreach ($r as $i => $periodo) {
            //$arrfecha = explode('/', $periodo['fechapago']);
            $arrfecha = explode('/', $periodo['fechainicioperiodo']);
            $r[$i]['idperiodo'] = $arrfecha[1] . "/" . $arrfecha[2];
            $r[$i]['idmes'] = $arrfecha[1];
            $r[$i]['anno'] = $arrfecha[2];
            $r[$i]['orden'] = $arrfecha[2] . $arrfecha[1];
        }

        $r = $this->unique_multidim_array($r, 'idperiodo');
        $r = DatNominaModel::ordenarArrayPorClave($r, 'orden');

        //Obteniendo los periodos del submayor para la entidad
        $periodossub = HisVacacionesPersona::obtenerPeriodosSubmayor($identidad);
        $periodossub = $this->unique_multidim_array($periodossub, 'periodo');

        $arrmeses = NomMes::obteneTodosNomMes();
        $rfinal = array();
        foreach ($r as $i => $periodo) {
            $cont = 0;
            foreach ($periodossub as $per) {
                //print_r(str_replace('-', '/', $per['periodo'])."------".$periodo['idperiodo']);die;
                if ($periodo['idperiodo'] == str_replace('-', '/', $per['periodo'])) {
                    $cont++;
                }
            }
            $mes = $arrmeses[intval($periodo["idmes"]) - 1]['denominacion'];
            if ($cont > 0) {
                $r[$i]['mes'] = '<span style="color:blue;">' . $mes . '</span>';
            } else {
                $r[$i]['mes'] = '<span style="color:red;">' . $mes . '</span>';
            }

            $rfinal[] = $r[$i];
        }
        //print_r($rfinal);die;
        echo json_encode(array('datos' => $rfinal, 'cantidad' => count($rfinal)));
    }

    public function unique_multidim_array($array, $key)
    {
        $temp_array = array();
        $i = 0;
        $key_array = array();

        foreach ($array as $val) {
            if (!in_array($val[$key], $key_array)) {
                $key_array[$i] = $val[$key];
                $temp_array[] = $val;
            }
            $i++;
        }
        return $temp_array;
    }

    public function exportarListadoSaldosInicialesFinalesPeridosAction()
    {
        $identidad = $this->_getParam('identidad');
        $objElaborarP = new DatElaborarPagosModel();
        $objReportePDF = new ReporteSubVacacionespdfModel();
        $objvacaciones = new DatVacacionesPersona();
        $objhisvacaciones = new HisVacacionesPersona();

        //Obteniendo todos los periodos de pago del submayor para una entidad especifica *********************
        $arrperiodos = array();
        $r = $objElaborarP->obtenerPeriodosPagoEntidadSubmayorV($identidad);
        foreach ($r as $i => $periodo) {
            $arrfecha = explode('/', $periodo['fechainicioperiodo']);
            $arrperiodos[$i] = $arrfecha[1] . "-" . $arrfecha[2];
        }
        $arrperiodos = array_values(array_unique($arrperiodos));//eliminando e indexando posiciones repetidas

        //Obteniendo los periodos del submayor para la entidad
        $periodossub = HisVacacionesPersona::obtenerPeriodosSubmayor($identidad);
        $periodossub = $this->unique_multidim_array($periodossub, 'periodo');
        foreach ($arrperiodos as $i => &$periodo) {
            $flag = false;
            foreach ($periodossub as $per) {
                if ($periodo == $per['periodo']) {
                    $flag = true;
                    break;
                }
            }
            if (!$flag)
                unset($arrperiodos[$i]);

            list($mes, $anno) = explode('-', $periodo);
            $periodo = $anno . '-' . $mes;
        }
        $arrperiodos = array_values($arrperiodos);
        rsort($arrperiodos);//ordenando descendente el arreglo de periodos

        //Recorriendo cada periodo de pago de la entidad *****************************************************
        $arrsaldosfinales = array();
        $personasvacaciones = $objvacaciones->obtenerPersonasHanIniciadoSubMayorVac($identidad, null);
        $arrmeses = NomMes::obteneTodosNomMes();
        foreach ($arrperiodos as &$per) {
            list($anno, $mes) = explode('-', $per);
            $per = $mes . '-' . $anno;
            $arrtodasoperacionespersonas = $objhisvacaciones->obtenerTodasOperacionesDePeriodoSubMayor($identidad, $per);

            //Operaciones del mes anterior
            $mesanterior = (intval($mes) == 1) ? 12 : intval($mes) - 1;
            $annomesanterior = (intval($mes) == 1) ? $anno - 1 : $anno;
            $arrultimaoperacionmesanterior = $objhisvacaciones->obtenerTodasOperacionesDePeriodoSubMayor($identidad, ($mesanterior < 10 ? "0" . $mesanterior : $mesanterior) . "-" . $annomesanterior);

            //Por cada persona
            $arrdatos = $objhisvacaciones->datosPersonaDadoId($identidad);
            $arrdatpersona = array();
            foreach ($arrdatos as $p) {
                $arrdatpersona[$p['idpersona']] = $p;
            }

            //Llenando el arreglo de personas con sus operaciones por periodos
            $contpersona = 0;
            $arraypersonas = array();
            $periodobuscar = ($mesanterior < 10 ? "0" . $mesanterior : $mesanterior) . "-" . $annomesanterior;
            foreach ($personasvacaciones as $i => $valor) {
                $arraypersonas[$contpersona]['idarea'] = $arrdatpersona[$valor['idpersona']]['idarea'];
                $arraypersonas[$contpersona]['area'] = $arrdatpersona[$valor['idpersona']]['area'];

                $arraypersonas[$contpersona]['idpersona'] = $valor['idpersona'];
                $arraypersonas[$contpersona]['idvacacionespersona'] = $valor['idvacacionespersona'];

                $arraypersonas[$contpersona]['tiempoacumuladoinicial'] = round($valor['tiempoacumuladoinicial'], 2);
                $arraypersonas[$contpersona]['importeacumuladoinicial'] = round($valor['importeacumuladoinicial'], 2);

                //Operación de acumulación total en días en el período para la persona en cuestión.
                $acumulaciontotaldias = 0;
                //Operación de acumulación total en importe en el período para la persona en cuestión.
                $acumulaciontotalimporte = 0;
                //Operación de liquidación total en días en el período para la persona en cuestión.
                $liquidaciontotaldias = 0;
                //Operación de liquidación total en importe en el período para la persona en cuestión.
                $liquidaciontotalimporte = 0;
                //Ajuste total en días en el período para la persona en cuestión.
                $ajustetiempo = 0;
                //Ajuste total en importe en el período para la persona en cuestión.
                $ajusteimporte = 0;
                //Tipo de ajuste
                $tipoajuste = 0;
                $contultimoajuste = 0;
                foreach ($arrtodasoperacionespersonas as $o => $operacionespersona) {
                    if ($operacionespersona['idvacacionespersona'] == $valor['idvacacionespersona']) {
                        //Listando las operaciones de un a persona especifica para este periodo
                        if ($operacionespersona['tipooperacion'] == 1) {
                            $acumulaciontotaldias += $operacionespersona['tiempoacumulado'];
                            $acumulaciontotalimporte += $operacionespersona['importeacumulado'];
                        } elseif ($operacionespersona['tipooperacion'] == 2) {
                            $liquidaciontotaldias += $operacionespersona['tiempoacumulado'];
                            $liquidaciontotalimporte += $operacionespersona['importeacumulado'];
                        }

                        if (!empty($operacionespersona['tipoajuste']) && empty($contultimoajuste)) {
                            $ajustetiempo = $operacionespersona['ajustetiempo'];
                            $ajusteimporte = $operacionespersona['ajusteimporte'];
                            $tipoajuste = $operacionespersona['tipoajuste'];
                            $contultimoajuste++;
                        }
                    }
                }

                //saldoinicial del mes anterior
                $operacionesmesanterior = array();
                $cont = 0;
                $flagoperaciones = 0;
                foreach ($arrultimaoperacionmesanterior as $o => $operacionesmesantpersona) {
                    if ($operacionesmesantpersona['idvacacionespersona'] == $valor['idvacacionespersona']) {
                        $operacionesmesanterior[$cont]['saldoentiempo'] = $operacionesmesantpersona['saldoentiempo'];
                        $operacionesmesanterior[$cont]['saldoenimporte'] = $operacionesmesantpersona['saldoenimporte'];
                        $operacionesmesanterior[$cont]['operacioncompleta'] = $operacionesmesantpersona;
                        $cont++;
                        $flagoperaciones = 1;
                    }
                }

                //Si la persona no tuvo ninguna operacion el mes anterior se busca el saldo de la ultima operacion q tuvo
                if ($flagoperaciones == 0) {
                    //Get periodos submayor de la persona
                    $periodosacumulados = HisVacacionesPersona::obtenerPeriodosAcumulados($valor['idvacacionespersona']);
                    if (count($periodosacumulados) > 0) {
                        foreach ($periodosacumulados as $pacum) {
                            //Periodo mes anterior parametros
                            $rexplodepb = explode('-', $periodobuscar);
                            $periodobuscarconcat = $rexplodepb[1] . $rexplodepb[0];
                            //Periodos acumulados
                            $rexplodepa = explode('-', $pacum['periodo']);
                            $periodobuscararray = $rexplodepa[1] . $rexplodepa[0];
                            if ($periodobuscararray < $periodobuscarconcat) {
                                $hisvacacionesultimo = HisVacacionesPersona::obtenerTodoHisVacacionesPersona($pacum['idhisvacacionespersona']);
                                $operacionesmesanterior[$cont]['saldoentiempo'] = $hisvacacionesultimo[0]['saldoentiempo'];
                                $operacionesmesanterior[$cont]['saldoenimporte'] = $hisvacacionesultimo[0]['saldoenimporte'];
                                $operacionesmesanterior[$cont]['operacioncompleta'] = $hisvacacionesultimo[0];
                                $cont++;
                            }

                        }
                    }
                }

                if (empty($operacionesmesanterior)) {
                    $mg = Doctrine_Manager::getInstance();
                    $conn = $mg->getCurrentConnection();

                    $sql = "select hv.idhisvacacionespersona
			        from mod_nomina.his_vacacionespersona hv
			        where hv.idvacacionespersona = ? and hv.periodo = ?";
                    $ridcomparacion = $conn->fetchAll($sql, array($valor['idvacacionespersona'], $mes . "-" . $anno));

                    $sql = "select hv.*
			        from mod_nomina.his_vacacionespersona hv
		            where hv.idhisvacacionespersona < ? and hv.idvacacionespersona = ? and hv.periodo <> ? order by hv.idhisvacacionespersona DESC";
                    $r = $conn->fetchAll($sql, array($ridcomparacion[0]['idhisvacacionespersona'], $valor['idvacacionespersona'], $mes . "-" . $anno));

                    if (empty($r)) {
                        $arraypersonas[$contpersona]['saldotiempomesanterior'] = round($valor['tiempoacumuladoinicial'], 2);
                        $arraypersonas[$contpersona]['saldoimportemesanterior'] = round($valor['importeacumuladoinicial'], 2);
                    } else {
                        $arraypersonas[$contpersona]['saldotiempomesanterior'] = round($r[0]['saldoentiempo'], 2);
                        $arraypersonas[$contpersona]['saldoimportemesanterior'] = round($r[0]['saldoenimporte'], 2);
                    }

                } else {
                    $arraypersonas[$contpersona]['saldotiempomesanterior'] = $operacionesmesanterior[0]['saldoentiempo'];
                    $arraypersonas[$contpersona]['saldoimportemesanterior'] = $operacionesmesanterior[0]['saldoenimporte'];
                }


                //acumulado mes
                $arraypersonas[$contpersona]['tiempoacumulado'] = (!empty($acumulaciontotaldias)) ? $acumulaciontotaldias : 0.00;
                $arraypersonas[$contpersona]['importeacumulado'] = (!empty($acumulaciontotalimporte)) ? $acumulaciontotalimporte : 0.00;

                //liquidado mes
                $arraypersonas[$contpersona]['tiempoliquidado'] = (!empty($liquidaciontotaldias)) ? $liquidaciontotaldias : 0.00;
                $arraypersonas[$contpersona]['importeliquidado'] = (!empty($liquidaciontotalimporte)) ? $liquidaciontotalimporte : 0.00;

                //ajuste
                $arraypersonas[$contpersona]['ajustetiempo'] = (!empty($ajustetiempo)) ? $ajustetiempo : '';
                $arraypersonas[$contpersona]['ajusteimporte'] = (!empty($ajusteimporte)) ? $ajusteimporte : '';
                $arraypersonas[$contpersona]['tipoajuste'] = (!empty($tipoajuste)) ? $tipoajuste : 0;

                //saldo final
                $ajustetiempo = ($tipoajuste == 2) ? (-1) * $ajustetiempo : $ajustetiempo;
                $ajusteimporte = ($tipoajuste == 2) ? (-1) * $ajusteimporte : $ajusteimporte;
                $acumulaciontotaldiasmes = $acumulaciontotaldias - $liquidaciontotaldias + $ajustetiempo;
                $acumulaciontotalimportemes = $acumulaciontotalimporte - $liquidaciontotalimporte + $ajusteimporte;
                $arraypersonas[$contpersona]['saldoentiempo'] = $arraypersonas[$contpersona]['saldotiempomesanterior'] + $acumulaciontotaldiasmes;
                $arraypersonas[$contpersona]['saldoenimporte'] = $arraypersonas[$contpersona]['saldoimportemesanterior'] + $acumulaciontotalimportemes;
                $contpersona++;
            }

            //Obteniendo todas las personas bajas de la entidad que tienen operaciones en el periodo de pago
            $personasbajasperiodo = HisVacacionesPersonaBajaModel::obtenerPersonasBajasPeriodo($identidad, $mes, $anno);

            //Si la persona fue baja en este periodo y ahora es alta en la entidad, se muestran solo las operaciones de baja
            foreach ($personasbajasperiodo as $personabaja) {
                foreach ($arraypersonas as $i => $personaalta) {
                    if ($personabaja['idpersona'] == $personaalta['idpersona']) {
                        unset($arraypersonas[$i]);
                    }
                }
            }
            $arraypersonas = array_values($arraypersonas);

            //Sumando los subtotales del saldo en tiempo y en importe por periodos --- personas ALTAS
            $sumPorCentro = array();
            foreach ($arraypersonas as $i => $persona) {
                //Saldo inicial
                $sumPorCentro['diasinicial'] += ($persona['saldotiempomesanterior'] < 0) ? 0 : $persona['saldotiempomesanterior'];
                $sumPorCentro['importeinicial'] += ($persona['saldoimportemesanterior'] < 0) ? 0 : $persona['saldoimportemesanterior'];
                //Saldo final
                $sumPorCentro['diasfinal'] += ($persona['saldoentiempo'] < 0) ? 0 : $persona['saldoentiempo'];
                $sumPorCentro['importefinal'] += ($persona['saldoenimporte'] < 0) ? 0 : $persona['saldoenimporte'];
            }

            //Sumando los subtotales del saldo en tiempo y en importe por periodos --- personas BAJAS
            foreach ($personasbajasperiodo as $b => $bajas) {
                //Saldo inicial
                $sumPorCentro['diasinicial'] += ($bajas['saldotiempomesanterior'] < 0) ? 0 : $bajas['saldotiempomesanterior'];
                $sumPorCentro['importeinicial'] += ($bajas['saldoimportemesanterior'] < 0) ? 0 : $bajas['saldoimportemesanterior'];
                //Saldo final
                $sumPorCentro['diasfinal'] += ($bajas['saldoentiempo'] < 0) ? 0 : $bajas['saldoentiempo'];
                $sumPorCentro['importefinal'] += ($bajas['saldoenimporte'] < 0) ? 0 : $bajas['saldoenimporte'];
            }

            //Guardando los saldos iniciales y finales por cada periodo, asi como el año y mes de cada periodo.
            $arrsaldosfinales[$anno . '-' . $mes]['diasinicial'] = $sumPorCentro['diasinicial'];
            $arrsaldosfinales[$anno . '-' . $mes]['importeinicial'] = $sumPorCentro['importeinicial'];

            $arrsaldosfinales[$anno . '-' . $mes]['diasfinal'] = $sumPorCentro['diasfinal'];
            $arrsaldosfinales[$anno . '-' . $mes]['importefinal'] = $sumPorCentro['importefinal'];

            $arrsaldosfinales[$anno . '-' . $mes]['anno'] = $anno;
            $arrsaldosfinales[$anno . '-' . $mes]['mes'] = $arrmeses[intval($mes) - 1]['denominacion'];
            $arrsaldosfinales[$anno . '-' . $mes]['fecha'] = $per;
        }

        //Pintando el reporte ********************************************************************************
        $objReportePDF->construirListadoSaldosInicialesFinalesPeriodos($identidad, $arrsaldosfinales);
        echo json_encode('ok');
    }

    public function orderMultiDimensionalArray($toOrderArray, $field, $inverse = false)
    {
        $position = array();
        $newRow = array();
        foreach ($toOrderArray as $key => $row) {
            $position[$key] = $row[$field];
            $newRow[$key] = $row;
        }
        if ($inverse) {
            arsort($position);
        } else {
            asort($position);
        }
        $returnArray = array();
        foreach ($position as $key => $pos) {
            $returnArray[$key] = $newRow[$key];
        }
        return $returnArray;
    }

    public function obtenerCamposDatNominasPorPeriodosAction()
    {
        $identidad = $this->_getParam('idestructura');
        $periodos = json_decode(stripslashes($this->_getParam('idperiodo')));
        $arrtiposnominasacumliq = DatElaborarPagos::obtenerPeriodosPagoEntidadSubmayorV($identidad);
        $rtiposnominas = array();
        //Obteniendo los tipos de nominas que acumulan y liquidan para los periodos especificados en la entidad
        foreach ($arrtiposnominasacumliq as $i => &$tiponomina) {
            $denomtiponomina = NomTipoNomina::obtenerDenominacion($tiponomina['idtiponomina']);
            $tiponomina['tiponomina'] = $denomtiponomina;
            list(, $mes, $anno) = explode('/', $tiponomina['fechainicioperiodo']);
            foreach ($periodos as $periodo) {
                if ($periodo == ($mes . '/' . $anno)) {
                    $rtiposnominas[] = $tiponomina;
                }
            }
        }
        //Obteniendo los datos serializados para los tipos de nominas obtenidos por idelaborarpagos
        $rfinal = array();
        foreach ($rtiposnominas as $tiponomina) {
            $datosnominaperiodo = DatNominaDatos::obtenerDatosNominaPorElaborarPago($tiponomina['idelaborarpagos']);
            foreach ($datosnominaperiodo as $datos) {
                foreach (unserialize($datos['campos']) as $campos) {
                    if ($campos['indice'] != 'plantillanominal') {
                        $rfinal[$campos['indice']]['idestructurarmodelonomina'] = substr($campos['indice'], 1);
                        $rfinal[$campos['indice']]['idtiponomina'] = $tiponomina['idtiponomina'];
                        $rfinal[$campos['indice']]['tiponomina'] = $tiponomina['tiponomina'];
                        $rfinal[$campos['indice']]['denominacion'] = $campos['denominacion'];
                    }
                }
            }
        }
        $rfinal = array_values($rfinal);
        echo json_encode(array('datos' => $rfinal, 'cantidad' => count($rfinal)));
    }

    public function obtenerListadoSaldosAcumuladosVacacionesPersona($identidad, $mes, $anno)
    {
        $objvacaciones = new DatVacacionesPersona();
        $objhisvacaciones = new HisVacacionesPersona();

        $personasvacaciones = $objvacaciones->obtenerPersonasHanIniciadoSubMayorVac($identidad, null);
        $arrtodasoperacionespersonas = $objhisvacaciones->obtenerTodasOperacionesDePeriodoSubMayor($identidad, $mes . "-" . $anno);

        //Operaciones del mes anterior
        $mesanterior = (intval($mes) == 1) ? 12 : intval($mes) - 1;
        $annomesanterior = (intval($mes) == 1) ? $anno - 1 : $anno;
        $arrultimaoperacionmesanterior = $objhisvacaciones->obtenerTodasOperacionesDePeriodoSubMayor($identidad, ($mesanterior < 10 ? "0" . $mesanterior : $mesanterior) . "-" . $annomesanterior);

        $arrdatos = $objhisvacaciones->datosPersonaDadoId($identidad);

        $arrdatpersona = array();
        foreach ($arrdatos as $p) {
            $arrdatpersona[$p['idpersona']] = $p;
        }

        $arraypersonas = array();
        $periodobuscar = ($mesanterior < 10 ? "0" . $mesanterior : $mesanterior) . "-" . $annomesanterior;
        foreach ($personasvacaciones as $i => $valor) {
            $nombrecompleto = (!empty($arrdatpersona[$valor['idpersona']]['snombre'])) ? $arrdatpersona[$valor['idpersona']]['nombre'] . " " .
                $arrdatpersona[$valor['idpersona']]['snombre'] . " " . $arrdatpersona[$valor['idpersona']]['papel'] . " " . $arrdatpersona[$valor['idpersona']]['sapel'] :
                $arrdatpersona[$valor['idpersona']]['nombre'] . " " . $arrdatpersona[$valor['idpersona']]['papel'] . " " . $arrdatpersona[$valor['idpersona']]['sapel'];
            $arraypersonas[$valor['idpersona']]['idarea'] = $arrdatpersona[$valor['idpersona']]['idarea'];
            $arraypersonas[$valor['idpersona']]['area'] = $arrdatpersona[$valor['idpersona']]['area'];
            $arraypersonas[$valor['idpersona']]['orden'] = $arrdatpersona[$valor['idpersona']]['orden'];
            $arraypersonas[$valor['idpersona']]['nivel'] = $arrdatpersona[$valor['idpersona']]['nivel'];
            $arraypersonas[$valor['idpersona']]['idpersona'] = $valor['idpersona'];
            $arraypersonas[$valor['idpersona']]['idvacacionespersona'] = $valor['idvacacionespersona'];
            $arraypersonas[$valor['idpersona']]['ci'] = $arrdatpersona[$valor['idpersona']]['numero'];
            $arraypersonas[$valor['idpersona']]['nombreyapellidos'] = $nombrecompleto;
            //$arraypersonas[$valor['idpersona']]['tiempoacumuladoinicial'] = $valor['tiempoacumuladoinicial'];
            $arraypersonas[$valor['idpersona']]['tiempoacumuladoinicial'] = round($valor['tiempoacumuladoinicial'], 2);
            //$arraypersonas[$valor['idpersona']]['importeacumuladoinicial'] = $valor['importeacumuladoinicial'];
            $arraypersonas[$valor['idpersona']]['importeacumuladoinicial'] = round($valor['importeacumuladoinicial'], 2);

            //Operación de acumulación total en días en el período para la persona en cuestión.
            $acumulaciontotaldias = 0;
            //Operación de acumulación total en importe en el período para la persona en cuestión.
            $acumulaciontotalimporte = 0;
            //Operación de liquidación total en días en el período para la persona en cuestión.
            $liquidaciontotaldias = 0;
            //Operación de liquidación total en importe en el período para la persona en cuestión.
            $liquidaciontotalimporte = 0;
            //Ajuste total en días en el período para la persona en cuestión.
            $ajustetiempo = 0;
            //Ajuste total en importe en el período para la persona en cuestión.
            $ajusteimporte = 0;
            //Tipo de ajuste
            $tipoajuste = 0;
            $contultimoajuste = 0;
            foreach ($arrtodasoperacionespersonas as $o => $operacionespersona) {
                if ($operacionespersona['idvacacionespersona'] == $valor['idvacacionespersona']) {
                    //Listando las operaciones de un a persona especifica para este periodo
                    if ($operacionespersona['tipooperacion'] == 1) {
                        $acumulaciontotaldias += $operacionespersona['tiempoacumulado'];
                        $acumulaciontotalimporte += $operacionespersona['importeacumulado'];
                    } elseif ($operacionespersona['tipooperacion'] == 2) {
                        $liquidaciontotaldias += $operacionespersona['tiempoacumulado'];
                        $liquidaciontotalimporte += $operacionespersona['importeacumulado'];
                    }

                    if (!empty($operacionespersona['tipoajuste']) && empty($contultimoajuste)) {
                        $ajustetiempo = $operacionespersona['ajustetiempo'];
                        $ajusteimporte = $operacionespersona['ajusteimporte'];
                        $tipoajuste = $operacionespersona['tipoajuste'];
                        $contultimoajuste++;
                    }
                }
            }

            //saldoinicial del mes anterior
            $operacionesmesanterior = array();
            $cont = 0;
            $flagoperaciones = 0;
            foreach ($arrultimaoperacionmesanterior as $o => $operacionesmesantpersona) {
                if ($operacionesmesantpersona['idvacacionespersona'] == $valor['idvacacionespersona']) {
                    $operacionesmesanterior[$cont]['saldoentiempo'] = $operacionesmesantpersona['saldoentiempo'];
                    $operacionesmesanterior[$cont]['saldoenimporte'] = $operacionesmesantpersona['saldoenimporte'];
                    $operacionesmesanterior[$cont]['operacioncompleta'] = $operacionesmesantpersona;
                    $cont++;
                    $flagoperaciones = 1;
                }
            }
            //Si la persona no tuvo ninguna operacion el mes anterior se busca el saldo de la ultima operacion q tuvo
            if ($flagoperaciones == 0) {
                //Get periodos submayor de la persona
                $periodosacumulados = HisVacacionesPersona::obtenerPeriodosAcumulados($valor['idvacacionespersona']);
                if (count($periodosacumulados) > 0) {
                    foreach ($periodosacumulados as $pacum) {
                        //Periodo mes anterior parametros
                        $rexplodepb = explode('-', $periodobuscar);
                        $periodobuscarconcat = $rexplodepb[1] . $rexplodepb[0];
                        //Periodos acumulados
                        $rexplodepa = explode('-', $pacum['periodo']);
                        $periodobuscararray = $rexplodepa[1] . $rexplodepa[0];
                        if ($periodobuscararray < $periodobuscarconcat) {
                            $hisvacacionesultimo = HisVacacionesPersona::obtenerTodoHisVacacionesPersona($pacum['idhisvacacionespersona']);
                            $operacionesmesanterior[$cont]['saldoentiempo'] = $hisvacacionesultimo[0]['saldoentiempo'];
                            $operacionesmesanterior[$cont]['saldoenimporte'] = $hisvacacionesultimo[0]['saldoenimporte'];
                            $operacionesmesanterior[$cont]['operacioncompleta'] = $hisvacacionesultimo[0];
                            $cont++;
                        }

                    }
                }
            }

            if (empty($operacionesmesanterior)) {
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();

                $sql = "select hv.idhisvacacionespersona
			from mod_nomina.his_vacacionespersona hv
			where hv.idvacacionespersona = ? and hv.periodo = ?";
                $ridcomparacion = $conn->fetchAll($sql, array($valor['idvacacionespersona'], $mes . "-" . $anno));

                $sql = "select hv.*
			from mod_nomina.his_vacacionespersona hv
		    where hv.idhisvacacionespersona < ? and hv.idvacacionespersona = ? and hv.periodo <> ? order by hv.idhisvacacionespersona DESC";
                $r = $conn->fetchAll($sql, array($ridcomparacion[0]['idhisvacacionespersona'], $valor['idvacacionespersona'], $mes . "-" . $anno));

                if (empty($r)) {
                    $arraypersonas[$valor['idpersona']]['saldotiempomesanterior'] = round($valor['tiempoacumuladoinicial'], 2);
                    $arraypersonas[$valor['idpersona']]['saldoimportemesanterior'] = round($valor['importeacumuladoinicial'], 2);
                } else {
                    $arraypersonas[$valor['idpersona']]['saldotiempomesanterior'] = round($r[0]['saldoentiempo'], 2);
                    $arraypersonas[$valor['idpersona']]['saldoimportemesanterior'] = round($r[0]['saldoenimporte'], 2);
                }

            } else {
                $arraypersonas[$valor['idpersona']]['saldotiempomesanterior'] = $operacionesmesanterior[0]['saldoentiempo'];
                $arraypersonas[$valor['idpersona']]['saldoimportemesanterior'] = $operacionesmesanterior[0]['saldoenimporte'];
            }

            //acumulado mes
            $arraypersonas[$valor['idpersona']]['tiempoacumulado'] = (!empty($acumulaciontotaldias)) ? $acumulaciontotaldias : 0.00;
            $arraypersonas[$valor['idpersona']]['importeacumulado'] = (!empty($acumulaciontotalimporte)) ? $acumulaciontotalimporte : 0.00;

            //liquidado mes
            $arraypersonas[$valor['idpersona']]['tiempoliquidado'] = (!empty($liquidaciontotaldias)) ? $liquidaciontotaldias : 0.00;
            $arraypersonas[$valor['idpersona']]['importeliquidado'] = (!empty($liquidaciontotalimporte)) ? $liquidaciontotalimporte : 0.00;

            //ajuste
            $arraypersonas[$valor['idpersona']]['ajustetiempo'] = (!empty($ajustetiempo)) ? $ajustetiempo : '';
            $arraypersonas[$valor['idpersona']]['ajusteimporte'] = (!empty($ajusteimporte)) ? $ajusteimporte : '';
            $arraypersonas[$valor['idpersona']]['tipoajuste'] = (!empty($tipoajuste)) ? $tipoajuste : 0;

            //saldo final
            $ajustetiempo = ($tipoajuste == 2) ? (-1) * $ajustetiempo : $ajustetiempo;
            $ajusteimporte = ($tipoajuste == 2) ? (-1) * $ajusteimporte : $ajusteimporte;
            $acumulaciontotaldiasmes = $acumulaciontotaldias - $liquidaciontotaldias + $ajustetiempo;
            $acumulaciontotalimportemes = $acumulaciontotalimporte - $liquidaciontotalimporte + $ajusteimporte;
            $arraypersonas[$valor['idpersona']]['saldoentiempo'] = round($arraypersonas[$valor['idpersona']]['saldotiempomesanterior'], 2) + round($acumulaciontotaldiasmes, 2);
            $arraypersonas[$valor['idpersona']]['saldoenimporte'] = round($arraypersonas[$valor['idpersona']]['saldoimportemesanterior'], 2) + round($acumulaciontotalimportemes, 2);
        }

        return $arraypersonas;
    }
    public function cuadrarSubmayorDeserializacionAction()
    {
        $identidad = $this->_getParam('identidad');

        if (empty($identidad)) {
            echo json_encode(array('status' => 'error', 'message' => 'No se pudo obtener la identidad del usuario.'));
            return;
        }

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        if (!$conn) {
            echo json_encode(array('status' => 'error', 'message' => 'No se pudo obtener la conexion a la base de datos.'));
            return;
        }

        try {
            // Configurar schema
            pg_query($conn, "SET search_path TO mod_nomina, public;");

            // Obtener array de idnomina existentes
            $objvacaciones = new DatVacacionesPersona();
            $arrayIdnomina = $objvacaciones->obtenerIdnominaByIdentidad($identidad);
            
            // Consulta: Recuperamos una fila por idnomina solo para personas con histórico
            $sql = "with nominas_deserializar as (select distinct hv.idnomina from mod_nomina.dat_vacacionespersona dv
                            inner join mod_nomina.his_vacacionespersona hv on hv.idvacacionespersona = dv.idvacacionespersona
                            where dv.identidad = ?)
                    SELECT dn.idnomina, nd.campos, nd.valores
                            FROM mod_nomina.dat_nominadatos nd
                            INNER JOIN mod_nomina.dat_nomina dn ON dn.idnomina = nd.idnomina
                            INNER JOIN nominas_deserializar ndes ON ndes.idnomina = dn.idnomina;";            
            $result = $conn->fetchAll($sql, array($identidad));

            if ($result === false) {
                $error = pg_last_error($conn);
                error_log("Error en la consulta: " . $error);
                echo json_encode(array('status' => 'error', 'message' => 'Error en la consulta: ' . $error));
                return;
            }

            $processed = 0;
            $errors = 0;

            foreach ($result as $row) {
                $idnomina = (int)$row['idnomina'];
                
                // Verificar si ya existe en dat_nominadatos_json
                if (in_array($idnomina, $arrayIdnomina)) {
                    continue;
                }

                $campos_serial = $row['campos'];
                $valores_serial = $row['valores'];

                $campos = @unserialize($campos_serial);
                $valores = @unserialize($valores_serial);

                if ($campos === false || $valores === false) {
                    error_log("Error al deserializar datos de la nomina $idnomina");
                    $errors++;
                    continue;
                }

                // Crear mapa de campos
                $map = array();
                foreach ($campos as $def) {
                    if (isset($def['indice']) && isset($def['denominacion'])) {
                        $indice = $def['indice'];
                        $denominacion = $def['denominacion'];
                        $map[$indice] = $denominacion;
                    } else {
                        error_log("Indice o denominacion faltante en def: " . print_r($def, true));
                    }
                }

                // Procesar personas
                $personas = array();
                foreach ($valores as $fila) {
                    $json_data = array();
                    foreach ($map as $indice => $nombre) {
                        if (array_key_exists($indice, $fila)) {
                            $json_data[$nombre] = $fila[$indice];
                        }
                    }

                    // Agregar campos no mapeados
                    foreach ($fila as $indice => $valor) {
                        if (!isset($map[$indice])) {
                            $json_data[$indice] = $valor;
                        }
                    }

                    $personas[] = $json_data;
                }

                $json_string = json_encode($personas);
                
                // Insertar en dat_nominadatos_json
                $query = "INSERT INTO mod_nomina.dat_nominadatos_json (idnomina, datos_json, identidad)
                        VALUES (?, ?, ?) 
                        ON CONFLICT (idnomina) 
                        DO UPDATE SET datos_json = EXCLUDED.datos_json";
                
                try {
                    $stmt = $conn->execute($query, array($idnomina, $json_string, $identidad));
                    $processed++;
                } catch (Exception $e) {
                    error_log("Error al insertar nomina $idnomina: " . $e->getMessage());
                    $errors++;
                }
            }

            $message = "Proceso completado. Nominas procesadas: $processed, Errores: $errors";
            echo json_encode(array(
                'status' => 'success', 
                'message' => $message, 
                'identidad' => $identidad,
                'processed' => $processed,
                'errors' => $errors
            ));

        } catch (Exception $e) {
            error_log("Error general en cuadrarSubmayorDeserializacion: " . $e->getMessage());
            echo json_encode(array('status' => 'error', 'message' => 'Error general: ' . $e->getMessage()));
        }
    }

    public function cuadrarHistoricoSubmayorAction()
    {
        $identidad = $this->_getParam('identidad');
        
        if (empty($identidad)) {
            echo json_encode(array('status' => 'error', 'message' => 'Identidad requerida'));
            return;
        }

        try {
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $sql = "SELECT * FROM mod_nomina.f_ajustarsubmayor_identidad(?)";
            $result = $conn->execute($sql, array($identidad));

            echo json_encode(array('status' => 'success', 'message' => 'Proceso histórico completado'));
            
        } catch (Exception $e) {
            error_log("Error en cuadrarHistoricoSubmayor: " . $e->getMessage());
            echo json_encode(array('status' => 'error', 'message' => 'Error al procesar histórico: ' . $e->getMessage()));
        }
    }

    //Cuadrar operaciones personas altas y bajas
    public function cuadrarSubMayorVacacionesAction()
    {

        $tipocuadre = $this->_getParam('tipo');
        $identidad = $this->_getParam('identidad');
        $esbaja = $this->_getParam('esbaja');
        if ($tipocuadre == 1) {//1-Cuadre operaciones submayor;
            if ($esbaja != 1)
                //PERSONAS ALTAS
                $this->cuadrarSubMayorVacacionesPersonasAltas($identidad);
            else
                //PERSONAS BAJA
                $this->cuadrarSubMayorVacacionesPersonasBajas($identidad);

            $respuesta = 'ok';
        } else {//2-Cuadre por nominas; 3-Listado de saldos finales de las personas por nominas
            $modocuadrar = $this->_getParam('modocuadrar');//1-Automatico; 2-Manual
            $camposdias = json_decode(stripslashes($this->_getParam('camposdias')));
            $camposimporte = json_decode(stripslashes($this->_getParam('camposimporte')));
            $periodospagoparam = json_decode(stripslashes($this->_getParam('periodos')));
            if ($esbaja != 1)
                //PERSONAS ALTAS
                $this->cuadrarSubMayorVacacionesXNominasAltas($identidad, $tipocuadre, $modocuadrar, $camposdias, $camposimporte, $periodospagoparam);
            else
                //PERSONAS BAJA
                $this->cuadrarSubMayorVacacionesXNominasBajas($identidad, $tipocuadre, $modocuadrar, $camposdias, $camposimporte, $periodospagoparam);

            $respuesta = 'ok';
        }
        echo json_encode($respuesta);
    }

    public function cuadrarSubMayorVacacionesPersonasAltas($identidad, $idvacpersonaespecifica = null)
    {
        $objvacaciones = new DatVacacionesPersona();
        $objhisvacaciones = new HisVacacionesPersona();
        //Obteniendo todas las operaciones de las personas
        $personasvacacionesaux = $objvacaciones->obtenerPersonasHanIniciadoSubMayorVac($identidad, null);
        $personasvacaciones = array();
        $arraux = $objhisvacaciones->obtenerTodasOperacionesDeSubMayorVac($identidad);
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->beginTransaction();
        //Indexando por idvacacionespersona,en dependencia del tipo de cuadre(para todas las personas o una especifica)
        $arrtodop = array();
        if (empty($idvacpersonaespecifica)) {
            //Cargas iniciales
            $personasvacaciones = $personasvacacionesaux;

            //Operaciones
            foreach ($arraux as $valor) {
                $arrtodop[$valor['idvacacionespersona']][] = $valor;
            }
        } else {
            //Cargas iniciales
            foreach ($personasvacacionesaux as $op) {
                if ($op['idvacacionespersona'] == $idvacpersonaespecifica) {
                    $personasvacaciones[] = $op;
                }
            }

            //Operaciones
            foreach ($arraux as $valor) {
                if ($valor['idvacacionespersona'] == $idvacpersonaespecifica) {
                    $arrtodop[$valor['idvacacionespersona']][] = $valor;
                }
            }
        }

        //Organizando las operaciones
        foreach ($arrtodop as $idvacacionespersona => &$operaciones) {
            foreach ($operaciones as &$op) {
                list($mes, $anno) = explode("-", $op['periodo']);
                $op['orden'] = $anno . $mes . $op['idnomina'] . $op['tipooperacion'];
            }
            $operaciones = $this->orderMultiDimensionalArray($operaciones, 'orden');
            $objhisvacaciones->ordenarOperacionesPersonasPorPeriodos($conn, $operaciones);
        }
        //Obteniendo todas las operaciones de las personas bajas que han sido ordenadas
        $arraux = $objhisvacaciones->obtenerTodasOperacionesDeSubMayorVac($identidad);
        //Indexando por idvacacionespersona
        $arrtodop = array();
        foreach ($arraux as $valor) {
            $arrtodop[$valor['idvacacionespersona']][] = $valor;
        }
        //Cuadrando todas las operaciones por personas
        foreach ($personasvacaciones as $i => $valor) {
            //Cuadrando cada operacion de la persona
            foreach ($arrtodop[$valor['idvacacionespersona']] as $o => $operaciones) {
                $ajustedias = ($operaciones['tipoajuste'] != 1) ? (($operaciones['tipoajuste'] == 2) ? (-1 * $operaciones['ajustetiempo']) : 0) : $operaciones['ajustetiempo'];
                $ajusteimorte = ($operaciones['tipoajuste'] != 1) ? (($operaciones['tipoajuste'] == 2) ? (-1 * $operaciones['ajusteimporte']) : 0) : $operaciones['ajusteimporte'];

                if (!empty($operaciones)) {
                    if ($o == 0) {//Carga inicial en dias e importe + tiempo acumulado e importe de la 1era operacion en el submayor de la persona en cuestion
                        if ($operaciones['tipooperacion'] == 1) {//Operaciones de acumulacion
                            $arrtodop[$valor['idvacacionespersona']][$o]['saldoentiempo_real'] = round($valor['tiempoacumuladoinicial'], 2) + $operaciones['tiempoacumulado'] + $ajustedias;
                            $arrtodop[$valor['idvacacionespersona']][$o]['saldoenimporte_real'] = round($valor['importeacumuladoinicial'], 2) + $operaciones['importeacumulado'] + $ajusteimorte;
                        } else {//Operaciones de liquidacion
                            $arrtodop[$valor['idvacacionespersona']][$o]['saldoentiempo_real'] = round($valor['tiempoacumuladoinicial'], 2) - $operaciones['tiempoacumulado'] + $ajustedias;
                            $arrtodop[$valor['idvacacionespersona']][$o]['saldoenimporte_real'] = round($valor['importeacumuladoinicial'], 2) - $operaciones['importeacumulado'] + $ajusteimorte;
                        }
                    } else {//Demas operaciones en el submayor de la persona en cuestion
                        if ($operaciones['tipooperacion'] == 1) {//Operaciones de acumulacion
                            $arrtodop[$valor['idvacacionespersona']][$o]['saldoentiempo_real'] = $arrtodop[$valor['idvacacionespersona']][$o - 1]['saldoentiempo_real'] + $operaciones['tiempoacumulado'] + $ajustedias;
                            $arrtodop[$valor['idvacacionespersona']][$o]['saldoenimporte_real'] = $arrtodop[$valor['idvacacionespersona']][$o - 1]['saldoenimporte_real'] + $operaciones['importeacumulado'] + $ajusteimorte;
                        } else {//Operaciones de liquidacion
                            $arrtodop[$valor['idvacacionespersona']][$o]['saldoentiempo_real'] = $arrtodop[$valor['idvacacionespersona']][$o - 1]['saldoentiempo_real'] - $operaciones['tiempoacumulado'] + $ajustedias;
                            $arrtodop[$valor['idvacacionespersona']][$o]['saldoenimporte_real'] = $arrtodop[$valor['idvacacionespersona']][$o - 1]['saldoenimporte_real'] - $operaciones['importeacumulado'] + $ajusteimorte;
                        }
                    }
                    //Actualizando en la base de datos los campos saldoentiempo y saldoenimporte
                    $saldoentiempo = $arrtodop[$valor['idvacacionespersona']][$o]['saldoentiempo_real'];
                    $saldoenimporte = $arrtodop[$valor['idvacacionespersona']][$o]['saldoenimporte_real'];
                    $objhisvacaciones->actualizarSaldoTiempoImportePersona($conn, $operaciones['idhisvacacionespersona'], $saldoentiempo, $saldoenimporte);
                }
            }
        }
        $conn->commit();

    }

    public function cuadrarSubMayorVacacionesPersonasBajas($identidad, $idvacpersonaespecifica = null)
    {
        $objhisvacacionesbaja = new HisVacacionesPersonaBaja();
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->beginTransaction();
        //Obteniendo todas las operaciones de las personas bajas
        $arrbajas = $objhisvacacionesbaja->obtenerOperacionesPersonasBajasEntidad($identidad);

        //Indexando por idvacacionespersona,en dependencia del tipo de cuadre(para todas las personas o una especifica)
        $arrtodopb = array();
        if (empty($idvacpersonaespecifica)) {
            foreach ($arrbajas as $valor) {
                $arrtodopb[$valor['idpersona']][] = $valor;
            }
        } else {
            foreach ($arrbajas as $valor) {
                if ($valor['idpersonabaja'] == $idvacpersonaespecifica) {
                    $arrtodopb[$valor['idpersona']][] = $valor;
                }
            }
        }

        //Organizando las operaciones
        foreach ($arrtodopb as $idpersona => &$operaciones) {
            foreach ($operaciones as &$op) {
                list($mes, $anno) = explode("-", $op['periodo']);
                $op['orden'] = $anno . $mes . $op['idnomina'] . $op['tipooperacion'];
            }
            $operaciones = $this->orderMultiDimensionalArray($operaciones, 'orden');
            $objhisvacacionesbaja->ordenarOperacionesPersonasBajas($conn, $operaciones);
        }
        //Obteniendo todas las operaciones de las personas bajas que han sido ordenadas
        $arrbajas = $objhisvacacionesbaja->obtenerOperacionesPersonasBajasEntidad($identidad);
        //Indexando por idvacacionespersona
        $arrtodopb = array();
        foreach ($arrbajas as $valor) {
            $arrtodopb[$valor['idpersona']][] = $valor;
        }

        //Cuadrando todas las operaciones de las personas bajas
        foreach ($arrtodopb as $idpersona => $operaciones) {
            //Cuadrando cada operacion de la persona
            foreach ($operaciones as $o => &$operacion) {
                $ajustedias = ($operacion['tipoajuste'] != 1) ? (($operacion['tipoajuste'] == 2) ? (-1 * $operacion['ajustetiempo']) : 0) : $operacion['ajustetiempo'];
                $ajusteimporte = ($operacion['tipoajuste'] != 1) ? (($operacion['tipoajuste'] == 2) ? (-1 * $operacion['ajusteimporte']) : 0) : $operacion['ajusteimporte'];
                if (!empty($operacion)) {
                    if ($o == 0) {//Carga inicial en dias e importe + tiempo acumulado e importe de la 1era operacion en el submayor de la persona en cuestion
                        if ($operacion['tipooperacion'] == 1) {//Operaciones de acumulacion
                            $operacion['saldoentiempo_real'] = round($operacion['tiempoacumuladoinicial'], 2) + $operacion['tiempoacumulado'] + $ajustedias;
                            $operacion['saldoenimporte_real'] = round($operacion['importeacumuladoinicial'], 2) + $operacion['importeacumulado'] + $ajusteimporte;
                        } else {//Operaciones de liquidacion
                            $operacion['saldoentiempo_real'] = round($operacion['tiempoacumuladoinicial'], 2) - $operacion['tiempoacumulado'] + $ajustedias;
                            $operacion['saldoenimporte_real'] = round($operacion['importeacumuladoinicial'], 2) - $operacion['importeacumulado'] + $ajusteimporte;
                        }
                    } else {//Demas operaciones en el submayor de la persona en cuestion
                        if ($operacion['tipooperacion'] == 1) {//Operaciones de acumulacion
                            $operacion['saldoentiempo_real'] = $operaciones[$o - 1]['saldoentiempo_real'] + $operacion['tiempoacumulado'] + $ajustedias;
                            $operacion['saldoenimporte_real'] = $operaciones[$o - 1]['saldoenimporte_real'] + $operacion['importeacumulado'] + $ajusteimporte;
                        } else {//Operaciones de liquidacion
                            $operacion['saldoentiempo_real'] = $operaciones[$o - 1]['saldoentiempo_real'] - $operacion['tiempoacumulado'] + $ajustedias;
                            $operacion['saldoenimporte_real'] = $operaciones[$o - 1]['saldoenimporte_real'] - $operacion['importeacumulado'] + $ajusteimporte;
                        }
                    }
                    //Actualizando en la base de datos los campos saldoentiempo y saldoenimporte
                    $saldoentiempo = ($operacion['saldoentiempo_real'] >= 0) ? $operacion['saldoentiempo_real'] : 0;
                    $saldoenimporte = ($operacion['saldoenimporte_real'] >= 0) ? $operacion['saldoenimporte_real'] : 0;
                    $objhisvacacionesbaja->actualizarSaldoTiempoImportePersonaBaja($conn, $operacion['idhisvacacionespersonabaja'], $saldoentiempo, $saldoenimporte);
                }
            }
        }

        $conn->commit();
    }

    public function cuadrarSubMayorVacacionesXNominasAltas($identidad, $tipocuadre, $modocuadrar, $camposdias, $camposimporte, $periodospagoparam)
    {
        $objvacaciones = new DatVacacionesPersona();
        $objhisvacaciones = new HisVacacionesPersona();

        //listado de periodos de pagos a cuadrar
        $periodospago = array();
        $cadenaperiodospago = '';
        foreach ($periodospagoparam as $i => &$p) {
            $val = str_replace('/', '-', $p);
            $periodospago[$val] = $val;
            $cadenaperiodospago .= "'" . $val . "',";
        }
        $cadenaperiodospago = trim($cadenaperiodospago, ',');

        //Obteniendo las cargas iniciales  de las personas
        $personasvacaciones = $objvacaciones->obtenerPersonasHanIniciadoSubMayorVac($identidad, null);

        //Obteniendo todos los tipos de pago
        $arrtipospagosacumulan = DatElaborarPagos::obtenerPeriodosPagoEntidadSubmayorV($identidad);
        $arrperiodos = array();
        $campodias = -1;
        $campoimporte = -1;
        $tipooperacion = 1;
        foreach ($arrtipospagosacumulan as &$tipopago) {
            $datosnominaperiodo = DatNominaDatos::obtenerDatosNominaPorElaborarPago($tipopago['idelaborarpagos']);
            if (!empty($datosnominaperiodo) && $tipopago['acumulavacaciones'] == 1 || $tipopago['acumulavacaciones'] == 2) {
                //Obteniendo los campos en dias e importe de acuerdo al modo de cuadre
                if ($modocuadrar != 2) {//automatico
                    $campodias = ConfigEstructurarModelosNomina::obtenerCampoAcumulacionLiquidadcionDias($tipopago['idtiponomina'], $identidad);
                    $campoimporte = ConfigEstructurarModelosNomina::obtenerCampoAcumulacionLiquidadcionImporte($tipopago['idtiponomina'], $identidad);
                    $tipooperacion = $tipopago['acumulavacaciones'];
                    
                   /* if($tipopago['acumulavacaciones'] == 2){
                        print_r($campoimporte);die;
                    }*/
                } else {//manual
                    foreach (unserialize($datosnominaperiodo[0]['campos']) as $campo) {
                        foreach ($camposdias as $cdias) {
                            if ($cdias == substr($campo['indice'], 1)) {
                                $campodias = $cdias;
                                break;
                            }
                        }
                        foreach ($camposimporte as $cimporte) {
                            if ($cimporte == substr($campo['indice'], 1)) {
                                $campoimporte = $cimporte;
                                break;
                            }
                        }
                    }
                    $tipooperacion = $tipopago['acumulavacaciones'];
                }

                //Llenando los valores de cada campo en dias e importe por persona
                foreach ($datosnominaperiodo as $datos) {
                    $tipopago['campodias'] = $campodias;
                    $tipopago['campoimporte'] = $campoimporte;
                    $tipopago['tipooperacion'] = $tipooperacion;
                    //Obteniendo los valores en dias e importe por persona                   
                    foreach (unserialize($datos['valores']) as $nominas) {
                        $tipopago['personas'][$nominas['idpersona']]['dias'] = ($nominas['c' . $campodias]) ? $nominas['c' . $campodias] : 0;
                        $tipopago['personas'][$nominas['idpersona']]['importe'] = ($nominas['c' . $campoimporte]) ? $nominas['c' . $campoimporte] : 0;
                        //if($tipopago['idelaborarpagos'] == 77){print_r($nominas);die;}
                        /*/if($tipopago['tipooperacion'] == 2){
                            print_r($nominas['c' . $campodias]);die;
                        }*/
                        
                        $tipopago['personas'][$nominas['idpersona']]['idnomina'] = $datos['idnomina'];
                    }
                }
                /*if($tipopago['tipooperacion'] == 2){
                    print_r($tipopago['personas']);die;
                }*/
                $rp = explode('/', $tipopago['fechainicioperiodo']);
                $periodo = $rp[1] . "-" . $rp[2];
                if (!empty($periodospago[$periodo]))
                    $arrperiodos[$periodo][$tipopago['idtipopago']][$tipopago['idelaborarpagos']] = $tipopago;
            }
        }                                                                
        
        //Obteniendo la cantidad de operaciones por personas en el submayor de vacaciones
        $arraux = $objhisvacaciones->obtenerCantidadOperacionesPersonas($identidad);
        $arrcantoperacionespersonas = array();
        foreach ($arraux as $o => $op) {
            $arrcantoperacionespersonas[$op['idpersona']] = $op;
        }

        //Identificando las personas que la cantidad de operaciones en el submayor no corresponde con las de las nóminas
        $personasnooper = array();
        $personastodas = array();

        //print_r($personasvacaciones);die;
        foreach ($personasvacaciones as $pers => &$persona) {
            //Obteniendo ajustes de la persona por cada operacion
            $datossubmayorpersona = $objhisvacaciones->obtenerHisVacacionesPersona($persona['idvacacionespersona']);
            foreach ($datossubmayorpersona as $op) {
                if (($op['tipoajuste'] == 1 || $op['tipoajuste'] == 2)) {
                    $persona['ajustes'][$op['idnomina']]['tipoajuste'] = $op['tipoajuste'];
                    $persona['ajustes'][$op['idnomina']]['ajustetiempo'] = $op['ajustetiempo'];
                    $persona['ajustes'][$op['idnomina']]['ajusteimporte'] = $op['ajusteimporte'];
                    $persona['ajustes'][$op['idnomina']]['observaciones'] = $op['observaciones'];
                }
            }
            //print_r($arrperiodos);die;
            //Obteniendo el codigo contable de cada persona
            $codigocontable = ConfigPersonaCodigoContable::obtenerConfigDadoIdPersonaEntidad($persona['idpersona'], $identidad);
            $cod = (string)$codigocontable[0]['cdgocontable'];
            $persona['codigocontable'] = (strlen($cod) == 1) ? '00' . $cod : (strlen($cod) == 2) ? '0' . $cod : $cod;
            $persona['cantoperaciones'] = $arrcantoperacionespersonas[$persona['idpersona']]['cantidadoperaciones'];
            $cantoperacionesnominas = 0;
            $cargainicialcero = ($persona['tiempoacumuladoinicial'] && $persona['importeacumuladoinicial']) ? true : false;
            foreach ($arrperiodos as $p => $periodo) {
                $rorden = explode('-', $p);
                foreach ($periodo as $tipopago) {
                    foreach ($tipopago as $elaborarpagos) {
                        if ($elaborarpagos['personas']) {
                            if ($elaborarpagos['personas'][$persona['idpersona']]) {
                                //
                                $idnomina = $elaborarpagos['personas'][$persona['idpersona']]['idnomina'];
                                $persona['operaciones'][$p]['ordenperiodo'] = ($rorden[0] + ($rorden[1] * $rorden[1]));
                                $persona['operaciones'][$p][$idnomina]['idnomina'] = $idnomina;
                                $persona['operaciones'][$p][$idnomina]['idtipopago'] = $elaborarpagos['idtipopago'];
                                $persona['operaciones'][$p][$idnomina]['idcampodias'] = $elaborarpagos['campodias'];
                                $persona['operaciones'][$p][$idnomina]['idcampoimporte'] = $elaborarpagos['campoimporte'];
                                $persona['operaciones'][$p][$idnomina]['tipooperacion'] = $elaborarpagos['tipooperacion'];
                                $persona['operaciones'][$p][$idnomina]['dias'] = $elaborarpagos['personas'][$persona['idpersona']]['dias'];
                                $persona['operaciones'][$p][$idnomina]['importe'] = $elaborarpagos['personas'][$persona['idpersona']]['importe'];
                               // if($elaborarpagos['tipooperacion'] == 2){
                                   // print_r($elaborarpagos['personas'][1520]);die;
                               // }
                                //ajustes
                                $persona['operaciones'][$p][$idnomina]['tipoajuste'] = $persona['ajustes'][$idnomina]['tipoajuste'];
                                $persona['operaciones'][$p][$idnomina]['ajustetiempo'] = $persona['ajustes'][$idnomina]['ajustetiempo'];
                                $persona['operaciones'][$p][$idnomina]['ajusteimporte'] = $persona['ajustes'][$idnomina]['ajusteimporte'];
                                $persona['operaciones'][$p][$idnomina]['observaciones'] = $persona['ajustes'][$idnomina]['observaciones'];

                                $cantoperacionesnominas++;
                            }
                        }
                        
                    }
                }
            }           
            //Ordenando el arreglo de operaciones por periodos
            $persona['operaciones'] = $this->orderMultiDimensionalArray($persona['operaciones'], 'ordenperiodo', false);
            foreach ($persona['operaciones'] as $i => &$persoper) {
                //Ordenando el arreglo de operaciones por idnomina
                $persoper = $this->orderMultiDimensionalArray($persoper, 'idnomina', false);
            }

            $persona['cantoperacionesnomina'] = $cantoperacionesnominas;
            if ($persona['cantoperaciones'] == $cantoperacionesnominas) {
                $personastodas[$persona['idpersona']] = $persona;
                if ($cargainicialcero) {
                    $personasnooper[$persona['idpersona']] = $persona;
                }
            } else {
                $personasnooper[$persona['idpersona']] = $persona;
                $personastodas[$persona['idpersona']] = $persona;
            }
        }

        //RESPUESTA---------------------------------------------------------------------------------------------
        if ($tipocuadre == 2) {
            /**CUADRE POR NOMINAS**/
            //Personas que no tienen todas las operaciones
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $conn->beginTransaction();
            //print_r($personasnooper);die;
            foreach ($personasnooper as $persona) {
                $idpersonavac = $persona['idpersona'];

                $saldofinaltiempo = $persona['tiempoacumuladoinicial'];
                $saldofinalimporte = $persona['importeacumuladoinicial'];
                //Eliminando las operaciones de la persona
                $sqldelete = "DELETE FROM mod_nomina.his_vacacionespersona WHERE idvacacionespersona=? and periodo IN ($cadenaperiodospago);";
                $conn->execute($sqldelete, array($persona['idvacacionespersona']));
                foreach ($persona['operaciones'] as $periodo => $operacion) {
                    foreach ($operacion as $o => $tipopagonomina) {
                        if (!empty($tipopagonomina['idnomina'])) {
                            //print_r($tipopagonomina);die;
                            $saldofinaltiempo += ($tipopagonomina['tipooperacion'] == 1) ? $tipopagonomina['dias'] : -1 * $tipopagonomina['dias'];
                            $saldofinalimporte += ($tipopagonomina['tipooperacion'] == 1) ? $tipopagonomina['importe'] : -1 * $tipopagonomina['importe'];

                            //Sumando ajustes en el caso que tenga
                            if ($tipopagonomina['tipoajuste'] == 1) {
                                $saldofinaltiempo += $tipopagonomina['ajustetiempo'];
                                $saldofinalimporte += $tipopagonomina['ajusteimporte'];
                            } elseif ($tipopagonomina['tipoajuste'] == 2) {
                                $saldofinaltiempo += -1 * $tipopagonomina['ajustetiempo'];
                                $saldofinalimporte += -1 * $tipopagonomina['ajusteimporte'];
                            }
                            //Validando que la persona no tenga una operacion en el Historico de Bajas con ese mismO TIPO DE OPERACION, IDNOMINA, PERIODO, TIEMPO ACUMULADO, IMPORTE ACUMULADO
                            $sqlexiste = "SELECT
                                          count(hvpv.idhisvacacionespersonabaja) as cantidad
                                        FROM
                                          mod_nomina.his_vacacionespersonabaja hvpv
                                          inner join mod_nomina.his_personabaja vpv on (vpv. idpersonabaja = hvpv.idpersonabaja and vpv. idpersona = ?)
                                          where hvpv.idnomina = ? and hvpv.tipooperacion = ? and hvpv.periodo = ?;";
                            $existehisbaja = $conn->fetchAll($sqlexiste, array(
                                $idpersonavac,
                                $tipopagonomina['idnomina'],
                                $tipopagonomina['tipooperacion'],
                                $periodo
                            ));
                            //Sino tiene la misma operacion en el historial de bajas
                            if($existehisbaja[0]['cantidad'] == 0){
                                $sqlinsert = "INSERT INTO mod_nomina.his_vacacionespersona (idvacacionespersona,idnomina,
                                    tipooperacion,fechaoperacion,tiempoacumulado,importeacumulado,saldoentiempo,saldoenimporte,
                                    ajustetiempo,ajusteimporte,tipoajuste,observaciones,periodo)
                                    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?);";
                                $conn->execute($sqlinsert, array(
                                    $persona['idvacacionespersona'],
                                    $tipopagonomina['idnomina'],
                                    $tipopagonomina['tipooperacion'],
                                    date('Y-m-d'),
                                    (!empty($tipopagonomina['dias']) ? $tipopagonomina['dias'] : 0),
                                    (!empty($tipopagonomina['importe']) ? $tipopagonomina['importe'] : 0),
                                    $saldofinaltiempo,
                                    $saldofinalimporte,
                                    $tipopagonomina['ajustetiempo'],
                                    $tipopagonomina['ajusteimporte'],
                                    $tipopagonomina['tipoajuste'],
                                    $tipopagonomina['observaciones'],
                                    $periodo
                                ));
                            }

                        }
                    }
                }
            }
            $conn->commit();
            //Cuadrando por operaciones
            $this->cuadrarSubMayorVacacionesPersonasAltas($identidad);

            return "ok";
        } else {
            /**Listado de operaciones submayor vs nominas*/
            $objPHPExcel = new PHPExcel();
            $objDatNomina = new DatNominaModel();
            $objPHPExcel->getActiveSheet()->getRowDimension(1)->setRowHeight(30);
            $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(15);
            $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(40);
            $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(20);
            $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(20);
            $objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(20);
            $objPHPExcel->getActiveSheet()->getColumnDimension('F')->setWidth(20);
            //Pintando la denominacion de los campos
            $arraycolumnas = ['Cdg', 'CI', 'Nombre y apellidos', 'Cant. operaciones submayor', 'Cant. operaciones nómina', 'Tiempo inicial', 'Importe inicial', 'Saldo tiempo final', 'Saldo importe final'];
            $letra = 1;
            foreach ($arraycolumnas as $c => $col) {
                $letraconvertida = ($letra < 27) ? chr($letra + 64) : 'A' . chr($letra + 38);
                $objPHPExcel->getActiveSheet()->setCellValue($letraconvertida . '1', $col);
                //Dandole formato 'center'
                $objDatNomina->fnAlinearTexto($objPHPExcel, $letraconvertida . '1', 'center', 'center', 0);
                //Dandole borders
                $objDatNomina->fnPintarBordes($objPHPExcel, $letraconvertida . '1', 'top', PHPExcel_Style_Border::BORDER_THIN);
                $objDatNomina->fnPintarBordes($objPHPExcel, $letraconvertida . '1', 'right', PHPExcel_Style_Border::BORDER_THIN);
                $objDatNomina->fnPintarBordes($objPHPExcel, $letraconvertida . '1', 'right', PHPExcel_Style_Border::BORDER_THIN);
                $objDatNomina->fnPintarBordes($objPHPExcel, $letraconvertida . '1', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
                $letra++;
            }

            if (count($personastodas) > 0) {
                $numero = 2;
                foreach ($personastodas as $persona) {
                    $saldofinaltiempo = $persona['tiempoacumuladoinicial'];
                    $saldofinalimporte = $persona['importeacumuladoinicial'];
                    foreach ($persona['operaciones'] as $periodo => $operacion) {
                        foreach ($operacion as $o => $tipopagonomina) {
                            $saldofinaltiempo += ($tipopagonomina['tipooperacion'] == 1) ? $tipopagonomina['dias'] : -1 * $tipopagonomina['dias'];
                            $saldofinalimporte += ($tipopagonomina['tipooperacion'] == 1) ? $tipopagonomina['importe'] : -1 * $tipopagonomina['importe'];
                        }
                    }
                    $letra = 1;
                    $letraconvertida = ($letra < 27) ? chr($letra + 64) : 'A' . chr($letra + 38);
                    $objPHPExcel->getActiveSheet()->setCellValue($letraconvertida . $numero, $persona['codigocontable'] . "");
                    $objDatNomina->fnAlinearTexto($objPHPExcel, $letraconvertida . $numero, 'center', 'center', 0);
                    $letra++;
                    $letraconvertida = ($letra < 27) ? chr($letra + 64) : 'A' . chr($letra + 38);
                    $objPHPExcel->getActiveSheet()->setCellValue($letraconvertida . $numero, $persona['ci']);
                    $objDatNomina->fnAlinearTexto($objPHPExcel, $letraconvertida . $numero, 'center', 'center', 0);
                    $letra++;
                    $letraconvertida = ($letra < 27) ? chr($letra + 64) : 'A' . chr($letra + 38);
                    $objPHPExcel->getActiveSheet()->setCellValue($letraconvertida . $numero, $persona['nombrecompleto']);
                    $letra++;
                    $letraconvertida = ($letra < 27) ? chr($letra + 64) : 'A' . chr($letra + 38);
                    $objPHPExcel->getActiveSheet()->setCellValue($letraconvertida . $numero, $persona['cantoperaciones']);
                    $objDatNomina->fnAlinearTexto($objPHPExcel, $letraconvertida . $numero, 'center', 'center', 0);
                    $letra++;
                    $letraconvertida = ($letra < 27) ? chr($letra + 64) : 'A' . chr($letra + 38);
                    $objPHPExcel->getActiveSheet()->setCellValue($letraconvertida . $numero, $persona['cantoperacionesnomina']);
                    $objDatNomina->fnAlinearTexto($objPHPExcel, $letraconvertida . $numero, 'center', 'center', 0);
                    $letra++;
                    $letraconvertida = ($letra < 27) ? chr($letra + 64) : 'A' . chr($letra + 38);
                    $objPHPExcel->getActiveSheet()->setCellValue($letraconvertida . $numero, $persona['tiempoacumuladoinicial']);
                    $objDatNomina->fnAlinearTexto($objPHPExcel, $letraconvertida . $numero, 'center', 'center', 0);
                    $letra++;
                    $letraconvertida = ($letra < 27) ? chr($letra + 64) : 'A' . chr($letra + 38);
                    $objPHPExcel->getActiveSheet()->setCellValue($letraconvertida . $numero, $persona['importeacumuladoinicial']);
                    $objDatNomina->fnAlinearTexto($objPHPExcel, $letraconvertida . $numero, 'center', 'center', 0);
                    $letra++;
                    $letraconvertida = ($letra < 27) ? chr($letra + 64) : 'A' . chr($letra + 38);
                    $objPHPExcel->getActiveSheet()->setCellValue($letraconvertida . $numero, $saldofinaltiempo);
                    $objDatNomina->fnAlinearTexto($objPHPExcel, $letraconvertida . $numero, 'center', 'center', 0);
                    $letra++;
                    $letraconvertida = ($letra < 27) ? chr($letra + 64) : 'A' . chr($letra + 38);
                    $objPHPExcel->getActiveSheet()->setCellValue($letraconvertida . $numero, $saldofinalimporte);
                    $objDatNomina->fnAlinearTexto($objPHPExcel, $letraconvertida . $numero, 'center', 'center', 0);
                    $numero++;
                }
            }
            //TERMINACION DEL EXCEL*********************************************************
            $objPHPExcel->setActiveSheetIndex(0);
            ob_end_clean();
            header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            header('Content-Disposition: attachment;filename="PersonasSubmayor.xls" ');
            header('Cache-Control: max-age=0');
            $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
            ob_end_clean();
            echo($objWriter->save('php://output'));
            $objPHPExcel->disconnectWorksheets();
            unset($objPHPExcel);
            return "ok";
        }
    }

    public function cuadrarSubMayorVacacionesXNominasBajas($identidad, $tipocuadre, $modocuadrar, $camposdias, $camposimporte, $periodospagoparam)
    {
        $objhisvacacionesbaja = new HisVacacionesPersonaBaja();

        //listado de periodos de pagos a cuadrar
        $periodospago = array();
        $cadenaperiodospago = '';
        foreach ($periodospagoparam as $i => &$p) {
            $val = str_replace('/', '-', $p);
            $periodospago[$val] = $val;
            $cadenaperiodospago .= "'" . $val . "',";
        }
        $cadenaperiodospago = trim($cadenaperiodospago, ',');

        //Obteniendo las cargas iniciales  de las personas BAJAS
        $personasvacacionesbaja = $objhisvacacionesbaja->obtenerOperacionesPersonasBajasEntidad($identidad);

        //Obteniendo todos los tipos de pago y las Nominas
        $arrtipospagosacumulan = DatElaborarPagos::obtenerPeriodosPagoEntidadSubmayorV($identidad);
        $arrperiodos = array();
        $campodias = -1;
        $campoimporte = -1;
        foreach ($arrtipospagosacumulan as &$tipopago) {
            $datosnominaperiodo = DatNominaDatos::obtenerDatosNominaPorElaborarPago($tipopago['idelaborarpagos']);
            if (!empty($datosnominaperiodo) && $tipopago['acumulavacaciones'] == 1 || $tipopago['acumulavacaciones'] == 2) {
                //Obteniendo los campos en dias e importe de acuerdo al modo de cuadre
                if ($modocuadrar != 2) {//automatico
                    $campodias = ConfigEstructurarModelosNomina::obtenerCampoAcumulacionLiquidadcionDias($tipopago['idtiponomina'], $identidad);
                    $campoimporte = ConfigEstructurarModelosNomina::obtenerCampoAcumulacionLiquidadcionImporte($tipopago['idtiponomina'], $identidad);
                    $tipooperacion = $tipopago['acumulavacaciones'];
                } else {//manual
                    foreach (unserialize($datosnominaperiodo[0]['campos']) as $campo) {
                        foreach ($camposdias as $cdias) {
                            if ($cdias == substr($campo['indice'], 1)) {
                                $campodias = $cdias;
                                break;
                            }
                        }
                        foreach ($camposimporte as $cimporte) {
                            if ($cimporte == substr($campo['indice'], 1)) {
                                $campoimporte = $cimporte;
                                break;
                            }
                        }
                    }
                    $tipooperacion = $tipopago['acumulavacaciones'];
                }

                //Llenando los valores de cada campo en dias e importe por persona
                foreach ($datosnominaperiodo as $datos) {
                    $tipopago['campodias'] = $campodias;
                    $tipopago['campoimporte'] = $campoimporte;
                    $tipopago['tipooperacion'] = $tipooperacion;

                    //Obteniendo los valores en dias e importe por persona
                    foreach (unserialize($datos['valores']) as $nominas) {
                        $tipopago['personas'][$nominas['idpersona']]['dias'] = ($nominas['c' . $campodias]) ? $nominas['c' . $campodias] : 0;
                        $tipopago['personas'][$nominas['idpersona']]['importe'] = ($nominas['c' . $campoimporte]) ? $nominas['c' . $campoimporte] : 0;
                        $tipopago['personas'][$nominas['idpersona']]['idnomina'] = $datos['idnomina'];
                    }
                }

                $rp = explode('/', $tipopago['fechainicioperiodo']);
                $periodo = $rp[1] . "-" . $rp[2];
                if (!empty($periodospago[$periodo]))
                    $arrperiodos[$periodo][$tipopago['idtipopago']][$tipopago['idelaborarpagos']] = $tipopago;
            }
        }

        //Obteniendo la cantidad de operaciones por personas en el submayor de vacaciones bajas
        $arraux = $objhisvacacionesbaja->obtenerCantidadOperacionesPersonasBajas($identidad);
        $arroperacionespersonas = array();
        foreach ($arraux as $o => $op) {
            $arroperacionespersonas[$op['idpersona']] = $op;
            foreach ($personasvacacionesbaja as $hisvacbaja) {
                if ($hisvacbaja['idpersona'] == $op['idpersona']) {
                    $arroperacionespersonas[$op['idpersona']]['todasoperaciones'][$hisvacbaja['periodo']][$hisvacbaja['idnomina']] = $hisvacbaja;
                }
            }
        }
        //Identificando las personas que la cantidad de operaciones en el submayor no corresponde con las de las nóminas
        foreach ($arroperacionespersonas as $idpersona => &$persona) {
            foreach ($arrperiodos as $p => $periodo) {
                $rorden = explode('-', $p);
                foreach ($periodo as $tipopago) {
                    foreach ($tipopago as $elaborarpagos) {
                        if ($elaborarpagos['personas']) {
                            if ($elaborarpagos['personas'][$idpersona]) {
                                $idnomina = $elaborarpagos['personas'][$idpersona]['idnomina'];
                                $persona['todasoperaciones'][$p]['ordenperiodo'] = ($rorden[0] + ($rorden[1] * $rorden[1]));
                                $persona['todasoperaciones'][$p][$idnomina]['idnomina'] = $idnomina;
                                $persona['todasoperaciones'][$p][$idnomina]['idtipopago'] = $elaborarpagos['idtipopago'];
                                $persona['todasoperaciones'][$p][$idnomina]['idcampodias'] = $elaborarpagos['campodias'];
                                $persona['todasoperaciones'][$p][$idnomina]['idcampoimporte'] = $elaborarpagos['campoimporte'];
                                $persona['todasoperaciones'][$p][$idnomina]['tipooperacion'] = $elaborarpagos['tipooperacion'];
                                $persona['todasoperaciones'][$p][$idnomina]['dias'] = $elaborarpagos['personas'][$persona['idpersona']]['dias'];
                                $persona['todasoperaciones'][$p][$idnomina]['importe'] = $elaborarpagos['personas'][$persona['idpersona']]['importe'];
                            }
                        }
                    }
                }
            }

            //Ordenando el arreglo de todasoperaciones por periodos
            $persona['todasoperaciones'] = $this->orderMultiDimensionalArray($persona['todasoperaciones'], 'ordenperiodo', false);
            foreach ($persona['todasoperaciones'] as $i => &$persoper) {
                //Ordenando el arreglo de todas las operaciones por idnomina
                $persoper = $this->orderMultiDimensionalArray($persoper, 'idnomina', false);
                unset($persoper['ordenperiodo']);
            }
        }


        //Dejando solo los periodos a cuadrar
        foreach ($periodospago as $perparam) {
            foreach ($arroperacionespersonas as $pos => &$persona) {
                if ($persona['todasoperaciones'][$perparam]) {
                    $persona['operaciones'][$perparam] = $persona['todasoperaciones'][$perparam];
                }
            }
        }



        /**CUADRE POR NOMINAS**/
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->beginTransaction();

        foreach ($arroperacionespersonas as $persona) {
            $saldofinaltiempo = $persona['tiempoacumuladoinicial'];
            $saldofinalimporte = $persona['importeacumuladoinicial'];
            //Eliminando las operaciones de la persona
            $sqldelete = "DELETE FROM mod_nomina.his_vacacionespersonabaja WHERE idpersonabaja=? and periodo IN ($cadenaperiodospago);";
            $conn->execute($sqldelete, array($persona['idpersonabaja']));
            foreach ($persona['operaciones'] as $periodo => $operacion) {
                foreach ($operacion as $o => $tipopagonomina) {
                    if (!empty($tipopagonomina['idnomina'])) {
                        $saldofinaltiempo += ($tipopagonomina['tipooperacion'] == 1) ? $tipopagonomina['dias'] : -1 * $tipopagonomina['dias'];
                        $saldofinalimporte += ($tipopagonomina['tipooperacion'] == 1) ? $tipopagonomina['importe'] : -1 * $tipopagonomina['importe'];

                        //Sumando ajustes en el caso que tenga
                        if ($tipopagonomina['tipoajuste'] == 1) {
                            $saldofinaltiempo += $tipopagonomina['ajustetiempo'];
                            $saldofinalimporte += $tipopagonomina['ajusteimporte'];
                        } elseif ($tipopagonomina['tipoajuste'] == 2) {
                            $saldofinaltiempo += -1 * $tipopagonomina['ajustetiempo'];
                            $saldofinalimporte += -1 * $tipopagonomina['ajusteimporte'];
                        }

                        $sqlinsert = "INSERT INTO mod_nomina.his_vacacionespersonabaja (idpersonabaja,idnomina,
                                    tipooperacion,fechaoperacion,tiempoacumulado,importeacumulado,saldoentiempo,saldoenimporte,
                                    ajustetiempo,ajusteimporte,tipoajuste,observaciones,periodo)
                                    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?);";
                        $conn->execute($sqlinsert, array(
                            $persona['idpersonabaja'],
                            $tipopagonomina['idnomina'],
                            $tipopagonomina['tipooperacion'],
                            date('Y-m-d'),
                            (!empty($tipopagonomina['dias']) ? $tipopagonomina['dias'] : 0),
                            (!empty($tipopagonomina['importe']) ? $tipopagonomina['importe'] : 0),
                            $saldofinaltiempo,
                            $saldofinalimporte,
                            $tipopagonomina['ajustetiempo'],
                            $tipopagonomina['ajusteimporte'],
                            $tipopagonomina['tipoajuste'],
                            $tipopagonomina['observaciones'],
                            $periodo
                        ));
                    }
                }
            }
        }
        $conn->commit();
        //Cuadrando por operaciones
        $this->cuadrarSubMayorVacacionesPersonasBajas($identidad);

        return "ok";
    }

    //Importar historico de las operaciones borradas desde un excel para una persona determinada
    public function importarOperacionesPersonaAction()
    {
        $identidad = $this->_getParam('identidad');
        $idpersona = $this->_getParam('idpersona');
        //Para archivos xls. OJO no pincha para .xlsx
        $inputFileType = 'Excel5';
        $dir_file = $_FILES['fileUpload']['tmp_name'];
        //Creando un Reader de PhpExcel para 2005
        $objReader = PHPExcel_IOFactory::createReader($inputFileType);
        $objReader->setReadDataOnly(true);
        //Si la direccion del archivo existe
        if (file_exists($dir_file)) {
            //Cargando el archivo
            $objPHPExcel = $objReader->load($dir_file);
            //Obteniendo los datos en un array
            $worksheettoarray = $objPHPExcel->getActiveSheet()->toArray(null, true, true, true);

            if (count($worksheettoarray) > 1) {
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $conn->beginTransaction();
                //Recorro el array para insertar en el submayor de vacaciones
                foreach ($worksheettoarray as $i => $arrworksheet) {
                    if ($i > 1) {//a partir de la fila 2
                        if ($arrworksheet['A'] == $idpersona) {//Para la persona en cuestion de todas las que tienen problemas
                            //Borro los datos del Sub Mayor por entidades
                            $sql = "select idvacacionespersona from mod_nomina.dat_vacacionespersona where identidad={$identidad} and idpersona={$idpersona}";
                            $idvacacionespersona = $conn->fetchOne($sql);
                            if (!empty($idvacacionespersona)) {
                                $sql = "DELETE FROM mod_nomina.his_vacacionespersona WHERE idvacacionespersona = {$idvacacionespersona}";
                                $conn->execute($sql);
                            }

                            //Capturo fechapago para las operaciones de cada nomina
                            $sql = "select dep.fechapago from mod_nomina.dat_elaborarpagos dep
							inner join mod_nomina.dat_nomina dn on(dn.idelaborarpago = dep.idelaborarpagos)
							where dn.idnomina = {$arrworksheet['C']}";
                            $fechapago = $conn->fetchOne($sql);
                            $fechapago = (!empty($fechapago)) ? $fechapago : date('d/m/Y');

                            $observaciones = (!empty($arrworksheet['M']) && $arrworksheet['M'] != 'null') ? $arrworksheet['M'] : '';
                            $periodo = (!empty($arrworksheet['N']) && $arrworksheet['N'] != 'null') ? $arrworksheet['N'] : '';
                            $sqlinsert = "INSERT INTO mod_nomina.his_vacacionespersona (
								idvacacionespersona,
								idnomina,           
								tipooperacion,      
								fechaoperacion,     
								tiempoacumulado,    
								importeacumulado,   
								saldoentiempo,      
								saldoenimporte,     
								ajustetiempo,       
								ajusteimporte,      
								tipoajuste,         
								observaciones,      
								periodo)            
								VALUES (
								{$idvacacionespersona},
								{$arrworksheet['C']},
								{$arrworksheet['D']},
								'" . $fechapago . "',
								{$arrworksheet['F']},
								{$arrworksheet['G']},
								{$arrworksheet['H']},
								{$arrworksheet['I']},
								{$arrworksheet['J']},
								{$arrworksheet['K']},
								{$arrworksheet['L']},
								'" . $observaciones . "',
								'" . $periodo . "'
								);";
                            $conn->execute($sqlinsert);
                        }
                    }
                }
                $conn->commit();
            }
        }

        echo json_encode('ok');
    }

    public function exportarDescuadreCargasInicialesFinalesAction()
    {
        $identidad = $this->_getParam('identidad');
        $fechaperiodo = $this->_getParam('fechaperiodo');
        //$modocomparacion = (!empty($this->_getParam('modocomparacion'))) ? $this->_getParam('modocomparacion') : 1;
        $modocomparacion = $this->_getParam('modocomparacion');
        list($mes, $anno) = explode('/', $fechaperiodo);
        $objReportePDF = new ReporteSubVacacionespdfModel();
        $objvacaciones = new DatVacacionesPersona();
        $objhisvacaciones = new HisVacacionesPersona();
        $personasvacaciones = $objvacaciones->obtenerPersonasHanIniciadoSubMayorVac($identidad, null);
        $roperaciones = array();
        if ($modocomparacion == 1) {//-----------Saldo final periodo - Carga inicial periodo posterior------------
            //calculo la carga inicial del mes posterior
            $r = $this->obtenerListadoSaldosAcumuladosVacacionesPersona($identidad, $mes, $anno);
            foreach ($r as $idpersona => $item) {
                $roperaciones[$idpersona]['idvacacionespersona'] = $item['idvacacionespersona'];
                $roperaciones[$idpersona]['cargainicialtiempo'] = $item['saldoentiempo'];
                $roperaciones[$idpersona]['cargainicialimporte'] = $item['saldoenimporte'];
                //obtengo el saldo final del periodo actual, salvado en base datos
                $rop = $objhisvacaciones->obtenerTodasOperacionesDePeriodoSubMayor($identidad, $mes . "-" . $anno);
                $r2 = array();
                foreach ($rop as $pos => $item2) {
                    if ($item2['idvacacionespersona'] == $item['idvacacionespersona']) {
                        $r2[] = $item2;
                    }
                }
                $roperaciones[$idpersona]['idvacacionespersona'] = $r2[0]['idvacacionespersona'];
                $roperaciones[$idpersona]['saldofinaltiempo'] = $r2[0]['saldoentiempo'];
                $roperaciones[$idpersona]['saldofinalimporte'] = $r2[0]['saldoenimporte'];
            }
        } else {//-----------Carga inicial periodo - Saldo final periodo anterior
        }

        //Listado de las personas
        $arrdatos = $objhisvacaciones->datosPersonaDadoId($identidad);
        $arrdatpersona = array();
        foreach ($arrdatos as $p) {
            $arrdatpersona[$p['idpersona']] = $p;
        }
        $contpersona = 0;
        $arraypersonas = array();
        foreach ($personasvacaciones as $i => $valor) {
            $nombrecompleto = (!empty($arrdatpersona[$valor['idpersona']]['snombre'])) ? $arrdatpersona[$valor['idpersona']]['nombre'] . " " .
                $arrdatpersona[$valor['idpersona']]['snombre'] . " " . $arrdatpersona[$valor['idpersona']]['papel'] . " " . $arrdatpersona[$valor['idpersona']]['sapel'] :
                $arrdatpersona[$valor['idpersona']]['nombre'] . " " . $arrdatpersona[$valor['idpersona']]['papel'] . " " . $arrdatpersona[$valor['idpersona']]['sapel'];
            $arraypersonas[$contpersona]['idarea'] = $arrdatpersona[$valor['idpersona']]['idarea'];
            $arraypersonas[$contpersona]['area'] = $arrdatpersona[$valor['idpersona']]['area'];
            $arraypersonas[$contpersona]['orden'] = $arrdatpersona[$valor['idpersona']]['orden'];
            $arraypersonas[$contpersona]['nivel'] = $arrdatpersona[$valor['idpersona']]['nivel'];
            $arraypersonas[$contpersona]['idpersona'] = $valor['idpersona'];
            $arraypersonas[$contpersona]['idvacacionespersona'] = $valor['idvacacionespersona'];
            $arraypersonas[$contpersona]['ci'] = $arrdatpersona[$valor['idpersona']]['numero'];
            $arraypersonas[$contpersona]['nombreyapellidos'] = $nombrecompleto;

            //Operaciones
            $carinicialtiempo = $roperaciones[$valor['idpersona']]['cargainicialtiempo'];
            $carinicialimporte = $roperaciones[$valor['idpersona']]['cargainicialimporte'];
            $salfinaltiempo = $roperaciones[$valor['idpersona']]['saldofinaltiempo'];
            $salfinalimporte = $roperaciones[$valor['idpersona']]['saldofinalimporte'];
            $arraypersonas[$contpersona]['cargainicialtiempo'] = (!empty($carinicialtiempo)) ? $carinicialtiempo : 0.00;;
            $arraypersonas[$contpersona]['cargainicialimporte'] = (!empty($carinicialimporte)) ? $carinicialimporte : 0.00;;
            $arraypersonas[$contpersona]['saldofinaltiempo'] = (!empty($salfinaltiempo)) ? $salfinaltiempo : 0.00;
            $arraypersonas[$contpersona]['saldofinalimporte'] = (!empty($salfinalimporte)) ? $salfinalimporte : 0.00;;

            $contpersona++;
        }
        //Ordenando el arraypersonas por el orden de las plantillas nominales
        $arraypersonasaux = array();
        foreach ($arraypersonas as $key => $row) {
            $arraypersonasaux[$key] = $row['orden'];
        }
        array_multisort($arraypersonasaux, $arraypersonas);//Ordenando ascendentemente(por defecto)

        //Bajas
        //Obteniendo el saldo en dia e importe de las personas bajas de la entidad en el periodo de pago seleccionado
        $personasbajasperiodo = HisVacacionesPersonaBajaModel::obtenerPersonasBajasPeriodo($identidad, $mes, $anno);
        //Si la persona fue baja en este periodo y ahora es alta en la entidad, se eliminan las operaciones de bajas,
        //el descuadres ya se corrige en el arreglo de personas
        foreach ($personasbajasperiodo as $j => $personabaja) {
            foreach ($arraypersonas as $i => $personaalta) {
                if ($personabaja['idpersona'] == $personaalta['idpersona']) {
                    unset($personasbajasperiodo[$j]);
                }
            }
        }
        //Llenando el array de bajas con la misma estructura al de las personas
        $personasbajasperiodo = array_values($personasbajasperiodo);
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $personasbajas = array();
        foreach ($personasbajasperiodo as $i => $personabaja) {
            //Datos principales
            $personasbajas[$i]['idarea'] = (!empty($personabaja['idarea'])) ? $personabaja['idarea'] : -1;
            $personasbajas[$i]['area'] = (!empty($personabaja['area'])) ? $personabaja['area'] : 'Sin plantilla nominal';
            $personasbajas[$i]['orden'] = $personabaja['orden'];
            $personasbajas[$i]['idpersona'] = $personabaja['idpersona'];
            $personasbajas[$i]['ci'] = $personabaja['numero'];
            $personasbajas[$i]['nombreyapellidos'] = $personabaja['nombreyapellidos'];
            //Saldo final periodo salvado en base datos
            $personasbajas[$i]['saldofinaltiempo'] = (!empty($personabaja['saldoentiempo'])) ? $personabaja['saldoentiempo'] : 0.00;
            $personasbajas[$i]['saldofinalimporte'] = (!empty($personabaja['saldoenimporte'])) ? $personabaja['saldoenimporte'] : 0.00;
            $personasbajas[$i]['cargainicialtiempo'] = 0.00;
            $personasbajas[$i]['cargainicialimporte'] = 0.00;
            //Capturando la carga inicial del mes posterior de las personas bajas
            $sql = "select hpb.idpersona, hvpb.*
                from mod_nomina.his_vacacionespersonabaja hvpb
                inner join mod_nomina.his_personabaja hpb on (hpb.idpersonabaja = hvpb.idpersonabaja)
		        where hpb.identidad = ? and hvpb.periodo = ? and hpb.idpersona = ? order by hvpb.idnomina, hvpb.idhisvacacionespersonabaja DESC;";
            $ridcomparacion = $conn->fetchAll($sql, array($identidad, $mes . "-" . $anno, $personabaja['idpersona']));
            /*if ($personabaja['idpersona'] == 18829) {
                print_r( $mes . "-" . $anno);
                print_r($ridcomparacion);
                die;
            }*/
            $sql = "select hvpb.*
			from mod_nomina.his_vacacionespersonabaja hvpb
			inner join mod_nomina.his_personabaja hpb on(hpb.idpersonabaja = hvpb.idpersonabaja)
		    where hpb.idpersona = ? and hvpb.idnomina > ? and  hvpb.periodo <> ? order by hvpb.idnomina,hvpb.idhisvacacionespersonabaja ASC";
            $r = $conn->fetchAll($sql, array($personabaja['idpersona'], $ridcomparacion[0]['idnomina'], $mes . "-" . $anno));
            /*if ($personabaja['idpersona'] == 18829) {
                print_r($r);
                die;
            }*/
            if (!empty($r)) {
                $ajustetiempo = ($r[0]['tipoajuste'] == 1) ? (-1 * $r[0]['ajustetiempo']) : $r[0]['ajustetiempo'];
                $tiempo = ($r[0]['tipooperacion'] == 1) ?
                    $r[0]['saldoentiempo'] - $r[0]['tiempoacumulado'] + $ajustetiempo :
                    $r[0]['saldoentiempo'] + $r[0]['tiempoacumulado'] + $ajustetiempo;
                $ajusteimporte = ($r[0]['tipoajuste'] == 1) ? (-1 * $r[0]['ajusteimporte']) : $r[0]['ajusteimporte'];
                $importe = ($r[0]['tipooperacion'] == 1) ?
                    $r[0]['saldoenimporte'] - $r[0]['importeacumulado'] + $ajusteimporte :
                    $r[0]['saldoenimporte'] + $r[0]['importeacumulado'] + $ajusteimporte;

                $personasbajas[$i]['cargainicialtiempo'] = (!empty($tiempo)) ? $tiempo : 0;
                $personasbajas[$i]['cargainicialimporte'] = (!empty($importe)) ? $importe : 0;;
            }
        }


        $arraypersonas['bajas'] = $personasbajas;
        //print_r($arraypersonas);die;
        $objReportePDF->construirListadoDescuadresSubMayor($identidad, $arraypersonas, $mes, $anno);

        echo json_encode('ok');
    }

    public function exportarDescuadreNominaSubmayorAction()
    {
        $identidad = $this->_getParam('identidad');
        $fechaperiodo = $this->_getParam('fechaperiodo');
        list($mes, $anno) = explode('/', $fechaperiodo);
        $objReportePDF = new ReporteSubVacacionespdfModel();
        $objvacaciones = new DatVacacionesPersona();
        $objhisvacaciones = new HisVacacionesPersona();
        $objhisvacacionesbaja = new HisVacacionesPersonaBajaModel();
        //Obteniendo las operaciones de las personas altas y bajas en el periodo
        //$personasvacaciones = $this->obtenerListadoSaldosAcumuladosVacacionesPersona($identidad, $mes, $anno);
        $rv = $objhisvacaciones->obtenerTodasOperacionesDePeriodoSubMayor($identidad, $mes . "-" . $anno);
        $personasvacaciones = array();
        foreach ($rv as $v) {
            $personasvacaciones[$v['idpersona']][] = $v;
        }

        $personasbajas = $objhisvacacionesbaja->obtenerPersonasBajasPeriodo($identidad, $mes, $anno);
        $personasbajas = DatNominaModel::indexarArreglo($personasbajas, 'idpersona');

        //Obteniendo todos los tipos de pago
        $arrtipospagosacumulan = DatElaborarPagos::obtenerPeriodosPagoEntidadSubmayorV($identidad);
        $arrperiodos = array();
        foreach ($arrtipospagosacumulan as &$tipopago) {
            $rp = explode('/', $tipopago['fechainicioperiodo']);
            $periodo = $rp[1] . "-" . $rp[2];
            if ($periodo == $mes . "-" . $anno) {

                if ($tipopago['acumulavacaciones'] == 1 || $tipopago['acumulavacaciones'] == 2) {
                    $campoci = ConfigEstructurarModelosNomina::obtenerCampoCarnetIdentidad($tipopago['idtiponomina']);
                    $camponombre = ConfigEstructurarModelosNomina::obtenerCampoNombre($tipopago['idtiponomina'], $identidad);
                    $campodias = ConfigEstructurarModelosNomina::obtenerCampoAcumulacionLiquidadcionDias($tipopago['idtiponomina'], $identidad);
                    $campoimporte = ConfigEstructurarModelosNomina::obtenerCampoAcumulacionLiquidadcionImporte($tipopago['idtiponomina'], $identidad);
                    $tipooperacion = $tipopago['acumulavacaciones'];
                }

                $datosnominaperiodo = DatNominaDatos::obtenerDatosNominaPorElaborarPago($tipopago['idelaborarpagos']);
                foreach ($datosnominaperiodo as $datos) {
                    $tipopago['campoci'] = $campoci[0]['idestructuramodelodomina'];
                    $tipopago['camponombre'] = $camponombre[0]['idestructuramodelodomina'];
                    $tipopago['campodias'] = $campodias;
                    $tipopago['campoimporte'] = $campoimporte;
                    $tipopago['tipooperacion'] = $tipooperacion;

                    foreach (unserialize($datos['valores']) as $nominas) {
                        list(, $idarea, $area) = explode('-', $nominas['plantillanominal']);
                        $tipopago['personas'][$nominas['idpersona']]['idarea'] = $idarea;
                        $tipopago['personas'][$nominas['idpersona']]['area'] = $area;
                        $tipopago['personas'][$nominas['idpersona']]['ci'] = $nominas['c' . $tipopago['campoci']];
                        $tipopago['personas'][$nominas['idpersona']]['nombre'] = $nominas['c' . $tipopago['camponombre']];
                        $tipopago['personas'][$nominas['idpersona']]['dias'] = $nominas['c' . $campodias];
                        $tipopago['personas'][$nominas['idpersona']]['importe'] = $nominas['c' . $campoimporte];
                        $tipopago['personas'][$nominas['idpersona']]['idnomina'] = $datos['idnomina'];
                    }
                }

                $arrperiodos[$tipopago['idtipopago']] = $tipopago;
            }
        }

        //Verificando si la persona tiene alguna operacion en el historico de altas y bajas del submayor de vacaciones
        $arraypersonas = array();
        $tipofaltante = $this->_getParam('tipofaltante');
        if ($tipofaltante == 1) {//Personas faltantes submayor
            foreach ($arrperiodos as $tipopago) {
                foreach ($tipopago['personas'] as $idpersona => $personanomina) {
                    if (empty($personasvacaciones[$idpersona]) && empty($personasbajas[$idpersona])) {
                        $arraypersonas[$idpersona] = $personanomina;
                    }
                }
            }
        } else {//Personas faltantes nominas
            //validando que la persona esta en el submayor de ALTAS y no en las nominas
            $arraypersonasaux = array();
            foreach ($personasvacaciones as $idpersonavac => $personavac) {
                $contpersvac = 0;
                foreach ($arrperiodos as $tipopago) {
                    foreach ($tipopago['personas'] as $idpersona => $personanomina) {
                        $contpersvac += ($idpersonavac == $idpersona) ? 1 : 0;
                    }
                }

                if ($contpersvac == 0) {
                    $arraypersonasaux[$idpersonavac] = $personavac;
                }
            }
            //validando que la persona esta en el submayor de BAJAS y no en las nominas
            foreach ($personasbajas as $idpersonavac => $personavac) {
                $contpersvac = 0;
                foreach ($arrperiodos as $tipopago) {
                    foreach ($tipopago['personas'] as $idpersona => $personanomina) {
                        $contpersvac += ($idpersonavac == $idpersona) ? 1 : 0;
                    }
                }
                if ($contpersvac == 0) {
                    $arraypersonasaux[$idpersonavac] = $personavac;
                }
            }
            //Por cada persona
            $arrdatos = $objhisvacaciones->datosPersonaDadoId($identidad);
            $arrdatpersona = array();
            foreach ($arrdatos as $p) {
                $arrdatpersona[$p['idpersona']] = $p;
            }
            foreach ($arraypersonasaux as $p => $persona) {
                $arraypersonas[$p]['idarea'] = $arrdatpersona[$p]['idarea'];
                $arraypersonas[$p]['area'] = $arrdatpersona[$p]['area'];
                $arraypersonas[$p]['ci'] = $arrdatpersona[$p]['numero'];
                $arraypersonas[$p]['nombre'] = $arrdatpersona[$p]['nombre'] . ' ' .
                    $arrdatpersona[$p]['snombre'] . ' ' . $arrdatpersona[$p]['papel'] . ' ' . $arrdatpersona[$p]['sapel'];
                $arraypersonas[$p]['diassubmayor'] = $persona[0]['tiempoacumulado'];
                $arraypersonas[$p]['importesubmayor'] = $persona[0]['importeacumulado'];
                $arraypersonas[$p]['idnomina'] = $persona[0]['idnomina'];
            }
        }

        //print_r($arraypersonas);die;
        $objReportePDF->construirListadoDescuadresNominas($identidad, $arraypersonas, $mes, $anno, $tipofaltante);

        echo json_encode('ok');
    }

    //Bajas
    public function obtenerListadoPersonasDerechoSubmayorBajasAction()
    {
        $idestructura = $this->_request->getPost('idestructura');
        $texto = $this->_getParam('texto');
        $inicio = $this->_getParam('start');
        $limite = $this->_getParam('limit');

        $objHisPersonaBaja = new HisPersonaBaja();
        $rpersonasvacaciones = $objHisPersonaBaja->obtenerDatosVacacionesPersonaBajas($idestructura, $texto, $inicio, $limite);

        //orden de las personas por plantillas nominales
        foreach ($rpersonasvacaciones as $p => $persona) {
            $nombreplantilla = (!empty($persona['plantillanominal'])) ? $persona['plantillanominal'] : 'Sin plantilla nominal';
            if ($nombreplantilla != 'Sin plantilla nominal') {
                list($ordenplantilla,) = explode('-', $persona['plantillanominal']);
                $longorden = strlen($ordenplantilla . '');
                $rpersonasvacaciones[$p]['plantillanominal'] = chr(96 + $longorden) . $persona['plantillanominal'];//chr(96) caracter antes de letra "a"
            } else {
                $rpersonasvacaciones[$p]['plantillanominal'] = 'z-' . $nombreplantilla;
            }
        }
        $cantrpersonasvacaciones = $objHisPersonaBaja->cantidadDatosVacacionesPersonaBajas($idestructura, $texto); //print_r($cantrpersonasvacaciones);die;

        echo json_encode(array('datos' => $rpersonasvacaciones, 'cantidad' => $cantrpersonasvacaciones));
    }

    public function obtenerDatosGeneralesSubVacacionesBajasAction()
    {
        $objHisPersonaBaja = new HisPersonaBaja();
        $arrVac = $objHisPersonaBaja->obtenerDatosVacacionesPersonaBaja(
            $this->_getParam('idpersona'),
            $this->_getParam('identidad')
        );

        $cantidadoperaciones = 0;
        if (!empty($arrVac)) {
            $cantidadoperaciones = HisVacacionesPersonaBaja::cantidadHistoricoSubMayorBajas($arrVac[0]['idpersonabaja']);
        }

        $cantidad = count($arrVac);
        if ($cantidad > 0) {
            $objHis = new HisVacacionesPersonaBaja();
            foreach ($arrVac as $k => &$v) {
                $arrPrimOperacion = $objHis->obtenerUltimaOperacionSubMayorBajas($v['idpersonabaja'], 'ASC');
                $arrUltOperacion = $objHis->obtenerUltimaOperacionSubMayorBajas($v['idpersonabaja'], 'DESC');
                if (count($arrUltOperacion) > 0) {
                    $v['tiempoacumulado'] = $arrUltOperacion[0]['saldoentiempo'];
                    $v['importeacumulado'] = $arrUltOperacion[0]['saldoenimporte'];
                } else {
                    $v['tiempoacumulado'] = 0.00;
                    $v['importeacumulado'] = 0.00;
                }
                $v['cantidadoperaciones'] = $cantidadoperaciones;
                $arrVac[$k]['fechainicio'] = $arrPrimOperacion[0]['fechaoperacion'];
                $arrVac[$k]['fechafin'] = $arrUltOperacion[0]['fechaoperacion'];
            }
        }

        echo Zend_Json::encode(array('datos' => $arrVac, 'cantidad' => $cantidad));
    }

    public function obtenerListadoActualizacionesBajasAction()
    {
        //Creando el modelo de negocio de gestión de vacaciones de las personas.
        $VacPer = new HisVacacionesPersonaBaja();
        $rhistorico = $VacPer->obtenerHistoricoSubMayorBaja(
            $this->_getParam('idpersonabaja'),
            $this->_getParam('start'),
            $this->_getParam('limit')
        );
        $cantidad = $VacPer->cantidadHistoricoSubMayorBajas($this->_getParam('idpersonabaja'));
        $arrmeses = NomMes::obteneTodosNomMes();
        $caracteranno = 1000;
        $annoinicial = 0;
        foreach ($rhistorico as $k => &$h) {
            $mes = explode('-', $h['periodo'])[0];
            $anno = explode('-', $h['periodo'])[1];
            $nombremes = $arrmeses[intval($mes) - 1]['denominacion'];
            if ($annoinicial != $anno) {
                $annoinicial = $anno;
                $caracteranno --;
            }
            $h['periodo'] = $caracteranno . "-" . $mes . "-" . $nombremes . "-" . $anno;
            if ($h['saldoentiempo'] > 0) {
                $h['promedioimporte'] = number_format($h['saldoenimporte'] / $h['saldoentiempo'], 2, '.', '');
            } else {
                $h['promedioimporte'] = 0.00;
            }

        }
        //Imprimiendo los datos del submayor de vacaciones.
        echo Zend_Json::encode(array('datos' => $rhistorico, 'cantidad' => $cantidad));
    }

    public function modificarDatosGeneralesSubVacacionesBajasAction()
    {
        //Creando el modelo de negocio de gestión de vacaciones de las personas.
        $modeloNegocioVacPer = new HisPersonaBaja();

        //Modificando los datos de las vacaciones de la persona.
        $modeloNegocioVacPer->modificarDatosVacacionesPersonaBajas(
            $this->_getParam('idpervac'),
            $this->_getParam('idpersona'),
            $this->_getParam('identidad'),
            $this->_getParam('tiempo'),
            $this->_getParam('importe'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin')
        );

        echo "{'codMsg':'1'}";
    }

    public function actualizarDatosGeneralesHistoricoVacacionesBajasAction()
    {
        $identidad = $this->_getParam('identidad');
        $idvacacionespersona = $this->_getParam('idpersonabaja');
        $modeloNegocioVacPer = new HisVacacionesPersonaBaja();

        $r = $modeloNegocioVacPer->actualizarDatosGeneralesHistoricoVacacionesBajas(
            $idvacacionespersona,
            $identidad,
            $this->_getParam('idhisvacacionespersonabaja'),
            $this->_getParam('ajustetiempo'),
            $this->_getParam('ajusteimporte'),
            $this->_getParam('tipoajuste'),
            $this->_getParam('observaciones')
        );

        //Cuadrando las operaciones de la persona en el submayor
        $this->cuadrarSubMayorVacacionesPersonasBajas($identidad, $idvacacionespersona);

        echo "{'codMsg':" . $r . "}";
    }

    //Borrar personas del listado del submayor si no tienen operaciones, borrar ajustes
    public function validarEliminarPersonasDerechoAction()
    {
        $identidad = $this->_request->getPost('identidad');
        $arrypersonas = Zend_Json::decode(stripslashes($this->_getParam('arrypersonas')));
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $nombrespersonas = '';
        //Recorriendo las personas para validar si tienen operaciones
        foreach ($arrypersonas as $ridpers) {
            $sql = "select count(hvb.idhisvacacionespersona)
            from mod_nomina.his_vacacionespersona hvb
            inner join mod_nomina.dat_vacacionespersona dv on (dv.idvacacionespersona = hvb.idvacacionespersona)
            where dv.idpersona = ? and dv.identidad = ?";
            $cantidadop = $conn->fetchOne($sql, array($ridpers, $identidad));
            if ($cantidadop > 0) {
                $sqlDatosPersona = "select CONCAT(dp.nombre,' ',dp.snombre, ' ',dp.papel, ' ',dp.sapel) as nombreapp from mod_persona.dat_persona dp
		                             where dp.idpersona = ?;";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $persona = $conn->fetchOne($sqlDatosPersona, array($ridpers));
                $nombrespersonas = ($nombrespersonas == '') ? $persona : $nombrespersonas . ', ' . $persona;
            }
        }
        $respuesta = new stdClass();
        $respuesta->nombrespersona = $nombrespersonas;
        //Si hay personas con operaciones
        if ($nombrespersonas == '') {
            $respuesta->codigo = 'noexistenpersonasoperaciones';
        } else {
            $respuesta->codigo = 'existenpersonasoperaciones';
        }
        echo json_encode($respuesta);
    }

    public function borrarAjustesOperacionAction()
    {
        $identidad = $this->_getParam('identidad');
        $idvacacionespersona = $this->_getParam('idvacacionespersona');
        $idhisvacacionespersona = $this->_getParam('idhisvacacionespersona');
        $esbaja = $this->_getParam('esbaja');
        if ($esbaja == 0) {//altas
            $objAltas = new HisVacacionesPersona();
            $objAltas->borrarAjustesBajas($idhisvacacionespersona);
            //Cuadrando las operaciones
            $this->cuadrarSubMayorVacacionesPersonasAltas($identidad, $idvacacionespersona);
        } else if ($esbaja == 1) {//bajas
            $objBajas = new HisVacacionesPersonaBaja();
            $objBajas->borrarAjustesBajas($idhisvacacionespersona);
            //Cuadrando las operaciones
            $this->cuadrarSubMayorVacacionesPersonasBajas($identidad, $idvacacionespersona);
        }

        echo json_encode('ok');
    }

    public function buscarCantidadOperacionesPersonasAction(){
        $idvacacionespersona = $this->_getParam('idvacacionespersona');
        $identidad = $this->_getParam('identidad');
        //Cantidad de Operaciones en el Submayor
        $cantidadoperaciones = HisVacacionesPersona::cantidadHistoricoSubMayor($idvacacionespersona);
        $obj->cantidad = $cantidadoperaciones;
        echo json_encode($obj);
    }

}
