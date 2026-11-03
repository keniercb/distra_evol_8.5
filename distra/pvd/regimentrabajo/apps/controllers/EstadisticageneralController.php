<?php

$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
include_once($dir_www . '/pvd/comun/recursos/fpdf/font');
include_once($dir_www . '/pvd/comun/recursos/fpdf/fpdf.php');

class EstadisticageneralController extends ZendExt_Controller_Secure
{
    private $parte = array();
    private $parte1 = array();
    protected $datEstadisticageneralModel;
    protected $modelCausa;
    protected $DatpdfestadistgeneralnominalModel;
    protected $DatpdfestadisticageneralModel;

    public function __construct(Zend_Controller_Request_Abstract $request, Zend_Controller_Response_Abstract $response, array $invokeArgs = array())
    {
        parent::__construct($request,$response,$invokeArgs);
        $this->datEstadisticageneralModel = new DatEstadisticageneralModel();
        $this->modelCausa = new NomCausaModel();
        $this->DatpdfestadistgeneralnominalModel = new DatpdfestadistgeneralnominalModel();
        $this->DatpdfestadisticageneralModel = new DatpdfestadisticageneralModel();
    }

    function init()
    {
        parent::init();
    }

    function estadisticageneralAction()
    {
        $this->view->estructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->fecha = date('d/m/Y');
        $this->render();
    }

    function getasistenciaAction()
    {
        ini_set("max_memory_limit", "1024M");
        ini_set("max_execution_time", 300);
        $fdesde = $this->_request->getPost('desde');
        $fhasta = $this->_request->getPost('hasta');
        $idestructura = $this->_request->getPost('idestructura');
        $tiporeporte = $this->_request->getPost('tiporeporte');
        if ($tiporeporte == 3) {
            $r = $this->datEstadisticageneralModel->getasistenciaByDias($fdesde, $fhasta, $idestructura);
        }else{
            $r = $this->datEstadisticageneralModel->getAsistenciaEstadistica($fdesde, $fhasta, $idestructura,$tiporeporte);
        }
        $_SESSION['parte'] = $r;
        echo(json_encode($r));
    }

    function exportarestadisticoAction()
    {
        ini_set("max_memory_limit", "1024M");
        ini_set("max_execution_time", 300);
        $fdesde = $this->_getParam('desde');
        $fhasta = $this->_getParam('hasta');
        $tiporeporte = $this->_getParam('tiporeporte');
        $arreglo = $_SESSION['parte'];
        $this->DatpdfestadisticageneralModel->construirReporte($arreglo, $fdesde, $fhasta, $tiporeporte);
        echo(json_encode('ok'));
    }

    function exportarestadisticoExcelAction()
    {
        $arreglo = $_SESSION['parte'];
        $tiporeporte = $this->_request->get('tiporeporte');
        $this->datEstadisticageneralModel->GetDatosExportarestadisticoExcel($arreglo, $tiporeporte);
        return true;
    }

    function getReporteNominalAction()
    {
        ini_set("max_memory_limit", "1024M");
        ini_set("max_execution_time", 300);
        $columnIndex = (int)$this->_request->getPost('columnIndex');
        $idcausa = $this->_request->getPost('idcausa');
        $desde = $this->_request->getPost('desde');
        $hasta = $this->_request->getPost('hasta');
        $idestructura = $this->_request->getPost('idestructura');
        $identidad = $this->_request->getPost('identidad');
        $estructura = $this->_request->getPost('estructura');
        $tiporeporte = $this->_request->getPost('tiporeporte');
        $agrupador = $this->_request->getPost('agrupador');
        $temp = $this->_request->getPost('filtro');
        $filtro = (empty($temp)) ? null : $temp;
        $arrResumen = $this->datEstadisticageneralModel->getAsistenciaNominal($columnIndex, $idcausa, $desde, $hasta, $idestructura, $tiporeporte, $estructura, $agrupador,$identidad,$filtro);
        $r['datos'] = $arrResumen['datos'];
        $r['cantidad'] = $arrResumen['cantidad'];
        $_SESSION['parte1'] = $r;
        echo(json_encode($r));
    }

    function exportarAction()
    {
        ini_set("max_memory_limit", "1024M");
        ini_set("max_execution_time", 300);
        $arreglo = $_SESSION['parte1'];
        $desde = $this->_getParam('desde');
        $hasta = $this->_getParam('hasta');
        $estructura = $this->_request->get('estructura');
        $tiporeporte = $this->_getParam('tiporeporte');
        $agrupador = $this->_getParam('agrupador');

        $this->DatpdfestadistgeneralnominalModel->construirReporte($arreglo, $desde, $hasta, $estructura, $tiporeporte, $agrupador);
        echo(json_encode('ok'));
    }

    function exportarnominalExcelAction()
    {
        $arreglo = $_SESSION['parte1'];
        $this->datEstadisticageneralModel->GetDatosExportarNominalExcel($arreglo);
        return true;
    }

    function getCausasAction()
    {
        $r = $this->modelCausa->GetHojas();
        echo Zend_Json::encode(array('datos' => $r));
    }
}

?>