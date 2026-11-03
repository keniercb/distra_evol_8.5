<?php

/**
 * Controlador de configurar reportes.
 *
 * @package Presentación.
 * @subpackage Controlador.
 * @copyright UCID
 * @version 1.0
 */
class ConfigurarreportesController extends ZendExt_Controller_Secure {

    protected $_responeInfo;
    private $_moduleDService;
    private $_reporteDService;
    private $_reportefilterDService;

    public function init() {
        parent::init();
        $this->_responeInfo = new ResponseInfo();
        $this->_moduleDService = new ModuleDService();
        $this->_reporteDService = new ReporteDService();
        $this->_reportefilterDService = new ReporteFilterDService();
    }

    public function configurarreportesAction() {
        $this->render();
    }

    public function getModulesAction() {
        $listModules = $this->_moduleDService->getModules();
        $this->_responeInfo->datos = $listModules;
        $this->_responeInfo->cantidad = count($listModules);

        echo $this->_responeInfo->getJson();
    }

    public function insertModuleAction() {
        $this->crudProxy('_moduleDService', 'insertModule');
    }

    public function updateModuleAction() {
        $this->crudProxy('_moduleDService', 'updateModule');
    }

    public function deleteModuleAction() {
        $this->crudProxy('_moduleDService', 'deleteModules');
    }

    public function getReportesAction() {
        try {
            $reportes = $this->_reporteDService->getReportes($this->_getParam('idmodulo'));
            foreach ($reportes as $key => $value) {
                if ($value['activo'] == 0) {
                    $reportes[$key]['text'] = '<i>' . $value['denominacion'] . ' (No activo)</i>';
                }
                //en caso de tener hijos
                if (count($value['children']) > 0) {
                    foreach ($value['children'] as $key2 => $value2) {
                        if ($value2['activo'] == 0) {
                            $reportes[$key]['children'][$key2]['text'] = '<i>' . $value2['denominacion'] . ' (No activo)</i>';
                        }
                        //en caso de tener hijos, de segundo nivel
                        if (count($value2['children']) > 0) {
                            foreach ($value2['children'] as $key3 => $value3) {
                                if ($value3['activo'] == 0) {
                                    $reportes[$key]['children'][$key2]['children'][$key3]['text'] = '<i>' . $value2['denominacion'] . ' (No activo)</i>';
                                }
                            }
                        }
                    }
                }
            }
            echo Zend_Json::encode($reportes);
        } catch (Exception $e) {
            $this->managerException($e);
            echo $this->_responeInfo->getJson();
        }
    }

    public function insertReporteAction() {
        $this->crudProxy('_reporteDService', 'insertReporte');
    }

    public function updateReporteAction() {
        $this->crudProxy('_reporteDService', 'updateReporte');
    }

    public function deleteReporteAction() {
        $this->crudProxy('_reporteDService', 'deleteReporte');
    }

    public function activeReporteAction() {
        $this->crudProxy('_reporteDService', 'activeReporte');
    }

    public function deactiveReporteAction() {
        $this->crudProxy('_reporteDService', 'deactiveReporte');
    }

    public function getReporteFiltersAction() {
        $listReporteFilters = $this->_reportefilterDService->getFilters($this->_getParam('idreporte'));
        $this->_responeInfo->datos = $listReporteFilters;
        $this->_responeInfo->cantidad = count($listReporteFilters);

        echo $this->_responeInfo->getJson();
    }

    public function insertReporteFilterAction() {
        $this->crudProxy('_reportefilterDService', 'insertFilter');
    }

    public function updateReporteFilterAction() {
        $this->crudProxy('_reportefilterDService', 'updateFilter');
    }

    public function deleteReporteFilterAction() {
        $this->crudProxy('_reportefilterDService', 'deleteFilters');
    }

    private function crudProxy($objectName, $methodName) {
        try {
            $this->$objectName->$methodName(Zend_Json::decode($this->_getParam('values')));
        } catch (Exception $e) {
            $this->managerException($e);
        }

        echo $this->_responeInfo->getJson();
    }

    private function managerException($exception) {
        $exceptClassName = get_class($exception);
        $businessExceptions = ['DuplicationValuesException', 'ElementInUseException', 'InvalidArgumentsException'];

        if (in_array($exceptClassName, $businessExceptions)) {
            $this->_responeInfo->success = false;
            $this->_responeInfo->codigoMsg = $exception->getCode();
            $this->_responeInfo->mensaje = $exception->getMessage();
        } else
            throw $exception;
    }

}
