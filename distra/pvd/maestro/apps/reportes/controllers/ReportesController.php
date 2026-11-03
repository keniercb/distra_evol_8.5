<?php
/**
 * Controlador de reportes.
 *
 * @package Presentación.
 * @subpackage Controlador.
 * @copyright UCID
 * @version 1.0
 */
class ReportesController extends ZendExt_Controller_Secure
{
    protected $_responeInfo;
    private $_reporteDService;
    private $_reportefilterDService;
    private $_reporetWebService;

    public function init()
    {
        parent::init();
        $this->_responeInfo = new ResponseInfo();
        $this->_reporteDService = new ReporteDService();
        $this->_reportefilterDService = new ReporteFilterDService();
        $this->_reporetWebService = new ReporteWebService();
    }

    public function reportesAction()
    {

    }

    public function getReportesMenuAction()
    {
        echo Zend_Json::encode(
            $this->_reporteDService->getReportesByModuleIdentificador($this->_getParam('moduleidentificador'))
        );
    }

    public function getFilterNomencladorDataAction()
    {
        $nomData = $this->_reportefilterDService->getFilterNomencladorData($this->_getParam('idfiltro'));
        $this->_responeInfo->datos = $nomData;
        $this->_responeInfo->cantidad = count($nomData);

        echo $this->_responeInfo->getJson();
    }

    public function getFilterEstructuraDataAction()
    {
        $estrucData = array();
        $globalStruct = $this->global->Estructura->idestructura;
        if($this->_getParam('node') == 'root'){
            $estrucData[] = array('id' => $globalStruct, 'text' => $this->global->Estructura->denominacion);
        }else{
           $estrucData = $this->_reportefilterDService->getFilterEstructuraData($this->_getParam('node'), $globalStruct); 
        }
        echo json_encode($estrucData);
    }
	
    public function getReporteEstructuraAction()
    {
        $this->_responeInfo->datos = $this->_reporteDService->getReporteInfo(
            $this->_getParam('moduleidentificador'), $this->_getParam('reporteidentificador')
        );
        echo $this->_responeInfo->getJson();
    }

    public function getReporteDataAction()
    {
        ob_end_clean();
        $reportData = $this->_reporetWebService->getReportDataFromJasperServer(
            $this->_getParam('recurso'),
            $this->_getParam('formato'),
            Zend_Json::decode($this->_getParam('filters'))
        );

        if ($reportData === false || $reportData == '') {
            $m = new stdClass();
            $m->codigo = "NOCONEXION";
            echo json_encode($m);
        }

        $headerConfig = $this->_reporetWebService->getResponseHeaderConfigByFormat($this->_getParam('formato'));
        header('Content-Disposition: '.$headerConfig['disposition']);
        header('Content-Type: '.$headerConfig['type']);

        ob_end_clean();
        echo $reportData;
    }
}