<?php
/**
 * Controlador del componente de reportes.
 *
 * @package Presentación.
 * @subpackage Controlador.
 * @copyright UCID
 * @version 1.0
 */
class ComponentereportesController extends ZendExt_Controller_Secure
{
    protected $_responeInfo;
    private $_componentereporteDService;

    public function init()
    {
        parent::init();
        $this->_responeInfo = new ResponseInfo();
        $this->_componentereporteDService = new ComponenteReporteDService();
    }

    public function componentereportesAction()
    {

    }

    public function getMenuReportesAction()
    {


        echo Zend_Json::encode(
            $this->_componentereporteDService->getReportesByIdentificadorModulo($this->_getParam('identificadormodulo'))
        );
    }

    public function getFilterNomencladorDataAction()
    {
        $nomData = $this->_componentereporteDService->getFilterNomencladorData($this->_getParam('idfiltro'), $this->_getParam('query'));
        $this->_responeInfo->datos = $nomData;
        $this->_responeInfo->cantidad = count($nomData);
//        $this->_responeInfo->cantidad = $this->_componentereporteDService->getFilterNomencladorDataCount($this->_getParam('idfiltro'), $this->_getParam('query'));

        echo $this->_responeInfo->getJson();
    }

    public function getFilterEstructuraDataAction()
    {
//        $globalStruct = $this->global->Estructura->idestructura;
//        $estrucData = $this->_reportefilterDService->getFilterEstructuraData($this->_getParam('node'), $globalStruct);
//        echo json_encode($estrucData);
    }

    public function getReporteJasperDataAction()
    {
        ob_end_clean();
        $reportData = $this->_componentereporteDService->getReportDataFromJasperServer(
            $this->_getParam('recurso'),
            $this->_getParam('formato'),
            $this->_getParam('idplantilla'),
            Zend_Json::decode($this->_getParam('filters'))
        );

        if ($reportData === false || $reportData == '') {
            $m = new stdClass();
            $m->codigo = "NOCONEXION";
            echo json_encode($m);
        }

        $headerConfig = $this->_componentereporteDService->getResponseHeaderConfigByFormat($this->_getParam('formato'));
        header('Content-Disposition: '.$headerConfig['disposition']);
        header('Content-Type: '.$headerConfig['type']);

        ob_end_clean();
        echo $reportData;
    }

    public function getReporteJasperAction()
    {
        $datas = Zend_Json::decode($this->_request->getParams()['datas']);
//        print_r($datas);die;
//        $datas = Zend_Json::decode($this->_getParam()['datas']);
//        $datas2 = Zend_Json::decode($this->_getAllParams()['datas']);
//        print('ueueue');
//        print_r($this->_request->getParams()['datas']);
        return $this->_componentereporteDService->runReport($datas);
    }
}