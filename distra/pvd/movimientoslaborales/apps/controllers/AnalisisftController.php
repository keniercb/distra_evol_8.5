 <?php
/**
 * @name AnalisisftController - Clase controladora de análisis de información.
 * @package   movimientoslaborales.
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class AnalisisftController extends ZendExt_Controller_Secure
{
    protected $_objResumen;

    public function init()
    {
        $this->_objResumen = new ResumenEstadisticoModel();
        parent::init();
    }

    function analisisftAction()
    {
        $this->render();
    }

    /**
     * @method getListaAnalisis - Devuelve la lista de análisis a mostrar.
     * @return Array - Arreglo con los elementos a mostrar en el menú.
     * @author Orestes Rodríguez Lorenzo.
     */
    function getListaAnalisisAction()
    {
        $id = $this->_request->getPost('node');
        if ($id == 'idmenu') {
            $menu = array(
                array(
                    'id' => 'panelResumen',
                    'text' => 'Resumen estadístico',
                    'idpadre' => 'idmenu',
                    'leaf' => true
                )
            );
        }
        echo json_encode($menu);
    }

    /**
     * @method getResumenEstadistico - Devuelve el resumen estadítico.
     * @author Orestes Rodríguez Lorenzo.
     */
    function getResumenEstadisticoAction()
    {
        $id = $this->_request->getPost('idestructura');
        $resumen = $this->_objResumen->getResumenEstadistico($id);
        echo json_encode($resumen);
    }

    /**
     * @method getDatosGrafica - Devuelve los datos para las gráficas.
     * @return Array - Arreglo con resumen de trabajadores por sexo.
     * @author Orestes Rodríguez Lorenzo.
     */
    function getDatosGraficaAction()
    {
        $id = $this->_request->getPost('idestructura');
        $resumen = $this->_objResumen->getDatosDashboard($id);
        echo json_encode($resumen);
    }

    /**
     * @method getResumenAltas - Devuelve el resumen de las altas.
     * @return Array - Arreglo con resumen de las altas por procedencia.
     * @author Orestes Rodríguez Lorenzo.
     */
    function getResumenAltasAction()
    {
        $resumen = $this->_objResumen->getResumenAltas(null, null, null);
        echo json_encode($resumen);
    }

    /**
     * @method getDatosGraficasAltas
     * @return Array - Arreglo con resumen de las altas por procedencia.
     * @author Orestes Rodríguez Lorenzo.
     */
    function getDatosGraficasAltasAction()
    {
        $resumen = $this->_objResumen->getDatosGraficasAltas(null, null, null);
        echo json_encode($resumen);
    }

    function exportarestadoAction()
    {
        $filters = json_decode(
            stripslashes($this->_request->getParam('filters'))
        );
        $estructura = $filters[0]->value;
        $model = new Reporte5205Model();
        $model->exportarestado($estructura);
        echo json_encode('ok');
    }

    function exportarFluctuacionAction()
    {
        $filters = json_decode(
            stripslashes($this->_request->getParam('filters'))
        );                
        foreach ($filters as $key => $value) {
            if ($value->name == 'estructura') {
                $estructura = $value->value;
            } elseif ($value->name == 'anno') {
                $anno = $value->value;
            } elseif ($value->name == 'fecha') {
                $fecha = explode('-', $value->value);
                $anno = $fecha[0];
            }
        }
        $model = new ReporteFluctuacionModel();
        $model->fluctuacion($estructura, $anno);
        echo json_encode('ok');
    }

    function exportarBajasyTasasFAction()
    {
        $filters = json_decode(
            stripslashes($this->_request->getParam('filters'))
        );
        $estructura = $filters[0]->value;
        $fdesde = $filters[1]->value;
        $fhasta = $filters[2]->value;
        $model = new BajasyTasasF();
        $model->exportarBajasyTasasF($estructura, $fdesde, $fhasta);
        echo json_encode('ok');
    }

    function exportarBajasAction()
    {
        $filters = json_decode(
            stripslashes($this->_request->getParam('filters'))
        );
        $estructura = $filters[0]->value;
        $fdesde = $filters[1]->value;
        $fhasta = $filters[2]->value;
        $model = new Bajas();
        $model->exportarBajas($estructura, $fdesde, $fhasta);
        echo json_encode('ok');
    }

    function exportarFluctPorMesesAction()
    {
        $filters = json_decode(
            stripslashes($this->_request->getParam('filters'))
        );
        $estructura = $filters[0]->value;
        $fdesde = $filters[1]->value;
        $fhasta = $filters[2]->value;
        $model = new FluctPorMeses();
        $model->exportarFluctPorMeses($estructura, $fdesde, $fhasta);
        echo json_encode('ok');

    }
 
    function reportEstructuraFTAction()
    {
        $filters = json_decode(
            stripslashes($this->_request->getParam('filters'))
        );
        $idestructura = null;
        $otroformato = false;
        foreach ($filters as $value) {
            if ($value->name == 'idesrtructura') {
                $idestructura = $value->value;
            }
            if ($value->name == 'otroformato') {
                $otroformato = $value->value;
            }
        }
        if ($otroformato == true) {
            $model = new ReportestructuraftexcelModel();
            $model->exportarExcel($idestructura);
        } else {
            $model = new ReportestructuraftModel();
            $model->reportEstructuraFTA($idestructura);
        }
        echo json_encode('ok');
    }

    public function clasificacionxparticipacionAction()
    {
        $filters = json_decode(
            stripslashes($this->_request->getParam('filters'))
        );
        $idestructura = null;
        $otroformato = false;
        foreach ($filters as $value) {
            if ($value->name == 'idestructura') {
                $idestructura = $value->value;
            }
            if ($value->name == 'otroformato') {
                $otroformato = $value->value;
            }
        }
        if ($otroformato == true) {
            $model = new ReporteClasifPartexcelModel();
            $model->exportarExcel($idestructura);
        } else {
            $model = new ReporteClasifPartModel();
            $model->clasificacionxparticipacion($idestructura);
        }
        echo json_encode('ok');
    }

    public function resumenftAction()
    {
        $filters = json_decode(
            stripslashes($this->_request->getParam('filters'))
        );
        $idestructura = null;
        $fdesde = null;
        $fhasta = null;
        $otroformato = false;
        if (!empty($filters[0]->value) && !empty($filters[1]->value) && !empty($filters[2]->value)) {
            foreach ($filters as $value) {
                if ($value->name == 'idestructura') {
                    $idestructura = $value->value;
                }
                if ($value->name == 'fdesde') {
                    $fdesde = $value->value;
                }
                if ($value->name == 'fhasta') {
                    $fhasta = $value->value;
                }
                if ($value->name == 'otroformato') {
                    $otroformato = $value->value;
                }
            }
            if ($otroformato == true) {
                $model = new ReporteexcelresumenftModel();
                $model->exportarExcel($idestructura, $fdesde, $fhasta);
            } else {
                $model = new ReportepdfresumenftModel();
                $model->construirReporte($idestructura, $fdesde, $fhasta);
            }
        }
        echo json_encode();
    }

    public function clasificacionxactivAction()
    {
        $filters = json_decode(
            stripslashes($this->_request->getParam('filters'))
        );
        $model = new ReportActivFunModel();
        $model->clasificacionxparticipacion($filters[0]->value);
        echo json_encode('ok');
    }

    public function clasificacionxactivExcelAction()
    {
        $model = new ReportActivFunexcelModel();
        $model->clasificacionxparticipacionE();
        echo json_encode('ok');
    }

    public function getAltasByMesAction()
    {
        $finicio = $this->_request->getParam('fdesde');
        $ffin = $this->_request->getParam('fhasta');
        $exportar = $this->_request->getParam('exportar');
        $model = new DatSituacionlaboralModel();
        $result = $model->getAltasByMes($finicio, $ffin);
        if ($exportar == 1) {
            $objReportePDF = new ReportepdfaltasbajasmovimientosModel();
            $objReportePDF->CrearReportePDF('alta', $finicio, $ffin, $result);
            echo json_encode('ok');
        } else if ($exportar == 2) {
            $objFicha = new ReportealtabajaMovRTF(
                'alta',
                $finicio,
                $ffin,
                $result
            );
            $objFicha->CrearFicha();
            $r->msg = "";
            $r->url = "/pvd/movimientoslaborales/Reporte alta.rtf";
            echo json_encode($r);
        } else {
            echo json_encode($result);
        }
    }

    public function getBajasByMesAction()
    {
        $finicio = $this->_request->getParam('fdesde');
        $ffin = $this->_request->getParam('fhasta');
        $exportar = $this->_request->getParam('exportar');
        $model = new DatSituacionlaboralModel();
        $result = $model->getBajasByMes($finicio, $ffin);
        if ($exportar == 1) {
            $objReportePDF = new ReportepdfaltasbajasmovimientosModel();
            $objReportePDF->CrearReportePDF('baja', $finicio, $ffin, $result);
            echo json_encode('ok');
        } else if ($exportar == 2) {
            $objFicha = new ReportealtabajaMovRTF(
                'baja',
                $finicio,
                $ffin,
                $result
            );
            $objFicha->CrearFicha();
            $r->msg = "";
            $r->url = "/pvd/movimientoslaborales/Reporte baja.rtf";
            echo json_encode($r);
        } else {
            echo json_encode($result);
        }
    }

    public function getMovByMesAction()
    {
        $finicio = $this->_request->getParam('fdesde');
        $ffin = $this->_request->getParam('fhasta');
        $exportar = $this->_request->getParam('exportar');
        $model = new DatSituacionlaboralModel();
        $result = $model->getMovByMes($finicio, $ffin);
        if ($exportar == 1) {
            $objReportePDF = new ReportepdfaltasbajasmovimientosModel();
            $objReportePDF->CrearReportePDF(
                'movimiento',
                $finicio,
                $ffin,
                $result
            );
            echo json_encode('ok');
        } else if ($exportar == 2) {
            $objFicha = new ReportealtabajaMovRTF(
                'movimiento',
                $finicio,
                $ffin,
                $result
            );
            $objFicha->CrearFicha();
            $r->msg = "";
            $r->url = "/pvd/movimientoslaborales/Reporte movimiento.rtf";
            echo json_encode($r);
        } else {
            echo json_encode($result);
        }
    }

    public function getCantAltasByMesAction()
    {
        $finicio = $this->_request->getParam('fdesde');
        $ffin = $this->_request->getParam('fhasta');
        $model = new DatSituacionlaboralModel();
        $result = $model->getCantAltasByMes($finicio, $ffin);
        echo json_encode($result);
    }

    public function getCantBajasByMesAction()
    {
        $finicio = $this->_request->getParam('fdesde');
        $ffin = $this->_request->getParam('fhasta');
        $model = new DatSituacionlaboralModel();
        $result = $model->getCantBajasByMes($finicio, $ffin);
        echo json_encode($result);
    }

    public function getCantMovByMesAction()
    {
        $finicio = $this->_request->getParam('fdesde');
        $ffin = $this->_request->getParam('fhasta');
        $model = new DatSituacionlaboralModel();
        $result = $model->getCantMovByMes($finicio, $ffin);
        echo json_encode($result);
    }

    public function obtenerEstructuraAction()
    {
        try {
            $result = Array();
            $vioc = ZendExt_IoC::getInstance();
            $idestruc = $this->_getParam('idestructura');
            if ($this->_getParam('node') == 0 && $idestruc != 0) {
                $id = $idestruc;
                $estr = $vioc->metadatos->DameEstructura($id);
                array_push($result, $estr[0]);
            } else {
                $id = $this->_getParam('node');
                $result = $vioc->metadatos->DameHijosEstructura($id);
            }
            echo json_encode($result);
        } catch (Exception $e) {
            echo json_encode(Array());
        }
    }

    public function obtenerReporteDeficitAction()
    {
        $idest = $this->_request->getParam('idestructura');
        $fecha = $this->_request->getParam('fecha');
        $demanda = $this->_request->getParam('demanda');
        $asistencia = $this->_request->getParam('asistencia');
        $deficit = new DeficitModel();
        $r = $deficit->obtenerDeficit($idest, $fecha, $demanda, $asistencia);
        echo json_encode($r);
    }
    
    public function exportarDeficitAction(){
        $idest = $this->_request->getParam('idestructura');
        $est = $this->_request->getParam('estructura');
        $fecha = $this->_request->getParam('fecha');
        $demanda = $this->_request->getParam('demanda');
        $asistencia = $this->_request->getParam('asistencia');
        $deficit = new DeficitModel();
        $r = $deficit->obtenerDeficit($idest,$est, $fecha, $demanda, $asistencia);
        $exp = new ExportarDeficitModel();
        $exp->CrearReporte($r['datos'],$fecha,$idest);
        return true;
    }

    public function promedioTrabajadoresAction()
    {
        $filters = json_decode(stripslashes($this->_request->getParam('filters')));
        $estructura = $filters[0]->value;
        $fdesde = $filters[1]->value;
        $fhasta = $filters[2]->value;
        $otroformato = false;
        if (!empty($filters[3])) {
            if ($filters[3]->value == 1 || $filters[3]->value == true) {
                $otroformato = true;
            }
        }
        $model = new DatospromediotrabajadoresModel();
        $result = $model->getDatos($estructura,$fdesde,$fhasta);
        if ($otroformato == true) {
            $objModel = new ReporteexcelpromediotrabajadoresModel();
            $resumen = $objModel->exportarExcel($estructura,$fdesde,$fhasta,$result);
        } else {
            $objModel = new ReportepdfpromediotrabajadoresModel();
            $resumen = $objModel->construirReporte($estructura,$fdesde,$fhasta,$result);
        }
        echo json_encode('ok');
    }

    public function distribucionXCategOcupYGrupoEscalaAction()
    {
        $filters = json_decode(stripslashes($this->_request->getParam('filters')));
        $idestructura = null;
        $otroformato = false;
        if (!empty($filters[0]->value)) {
            foreach ($filters as $value) {
                if ($value->name == 'idestructura') {
                    $idestructura = $value->value;
                }
                if ($value->name == 'otroformato') {
                    $otroformato = $value->value;
                }
            }
            if ($otroformato == true) {
                $model = new ReporteexcelcategocupgrupoescalaModel();
                $model->exportarExcel($idestructura);
            } else {
                $model = new ReportepdfcategocupgrupoescalaModel();
                $model->construirReporte($idestructura);
            }
        }
        echo json_encode();
    }

    public function distribucionXNivelEscolarRangoEdadesYGEAction()
    {
        $filters = json_decode(stripslashes($this->_request->getParam('filters')));
        $idestructura = null;
        $otroformato = false;
        if (!empty($filters[0]->value)) {
            foreach ($filters as $value) {
                if ($value->name == 'idestructura') {
                    $idestructura = $value->value;
                }
                if ($value->name == 'otroformato') {
                    $otroformato = $value->value;
                }
            }
            if ($otroformato == true) {
                $model = new ReporteexcelnivelescolarrangoedadesgeModel();
                $model->exportarExcel($idestructura);
            } else {
                $model = new ReportepdfnivelescolarrangoedadesgeModel();
                $model->construirReporte($idestructura);
            }
        }
        echo json_encode();
    }
	
	public function resumenplantillaAction()
    {
        $filters = json_decode(
            stripslashes($this->_request->getParam('filters'))
        );
        $idestructura = null;
        $fdesde = null;
        $fhasta = null;
        if (!empty($filters[0]->value)) {
            foreach ($filters as $value) {
                if ($value->name == 'idestructura') {
                    $idestructura = $value->value;
                }
                if ($value->name == 'fdesde') {
                    $fdesde = $value->value;
                }
                if ($value->name == 'fhasta') {
                    $fhasta = $value->value;
                }
            }
            $model = new ReportepdfresumenplantillacargosModel();
            $model->CrearReportePDF($idestructura, $fdesde, $fhasta);
        }
        echo json_encode();
    }
}