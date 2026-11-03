<?php
class ConfigurarreportesController extends ZendExt_Controller_Secure
{
    protected $_responeInfo;
    private $_moduloDService;
    private $_reporteDService;
    private $_filtroDService;

    function init()
    {
        parent::init();
        $this->_responeInfo = new ResponseInfo();
        $this->_moduloDService = new ModuloReporteDService();
        $this->_reporteDService = new ReporteDService();
        $this->_filtroDService = new ReporteFiltrosDService();
    }

    function configurarreportesAction()
    {}

    public function getModulosAction()
    {
        $listModules = $this->_moduloDService->getModulos();
        $this->_responeInfo->datos = $listModules;
        $this->_responeInfo->cantidad = count($listModules);

        echo $this->_responeInfo->getJson();
    }

    public function insertModuleAction()
    {
        $this->crudProxy('_moduloDService', 'insertModulo');
    }

    public function updateModuleAction()
    {
        $this->crudProxy('_moduloDService', 'updateModulo');
    }

    public function deleteModuleAction()
    {
        $this->crudProxy('_moduloDService', 'deleteModulos');
    }

    public function getReportesAction()
    {
        $list = $this->_reporteDService->getReportes($this->_getParam('idmodulo', 0), $this->_getParam('node'));
        echo Zend_Json::encode($list);
    }

    public function insertReporteAction()
    {
        $this->crudProxy('_reporteDService', 'insertReporte');
    }

    public function updateReporteAction()
    {
        $this->crudProxy('_reporteDService', 'updateReporte');
    }

    public function deleteReporteAction()
    {
        $this->crudProxy('_reporteDService', 'deleteReporte');
    }

    public function getFiltrosAction()
    {
        $listFiltros = $this->_filtroDService->getFiltros($this->_getParam('idreporte', 0));
        $this->_responeInfo->datos = $listFiltros;
        $this->_responeInfo->cantidad = count($listFiltros);

        echo $this->_responeInfo->getJson();
    }

    public function insertFiltroAction()
    {
        $this->crudProxy('_filtroDService', 'insertFiltro');
    }

    public function updateFiltroAction()
    {
        $this->crudProxy('_filtroDService', 'updateFiltro');
    }

    public function deleteFiltroAction()
    {
        $this->crudProxy('_filtroDService', 'deleteFiltro');
    }

    private function crudProxy($objectName, $methodName)
    {
        try{
            $this->$objectName->$methodName(Zend_Json::decode($this->_getParam('values')));
        }catch (Exception $e){
            $this->managerException($e);
        }

        echo $this->_responeInfo->getJson();
    }

    private function managerException($exception)
    {
        $exceptionClassName = get_class($exception);
        $businessExceptions = ['DuplicationValuesException', 'ElementInUseException', 'InvalidArgumentsException'];

        if(in_array($exceptionClassName, $businessExceptions))
        {
            $this->_responeInfo->success = false;
            $this->_responeInfo->codigoMsg = $exception->getCode();
            $this->_responeInfo->mensaje = $exception->getMessage();
        }else
            throw $exception;
    }
}
