<?php

/**
 * ReporteDService
 *
 * @package Domain.
 * @subpackage Domain services.
 * @copyright UCID
 * @version 1.0
 */
class ReporteDService {

    private $_reporteRepository;
    private $_validator;

    public function __construct() {
        $this->_reporteRepository = new ReporteRepository();
        $this->_validator = new ReporteValidator();
    }

    public function getReportes($idmodule) {
        $this->_validator->validateGetReportes($idmodule);
        $reportes = $this->_reporteRepository->getRecords(array('sort' => 'idpadre ASC', 'equalIdmodulo' => $idmodule));
        return $this->getTreeChildren($reportes);
    }

    public function getReportesByModuleIdentificador($moduleidentif) {
        $reportes = $this->_reporteRepository->getRecordsByIdentifModule($moduleidentif, array('sort' => 'idpadre ASC'));
        return $this->getTreeChildren($reportes);
    }

    public function getReporteInfo($moduleidentif, $reporteidentif) {
        $filtroEntity = new ReporteFiltro();
        $reporte = $this->_reporteRepository->getReporteInfo($moduleidentif, $reporteidentif);
        $reporte['filtros'] = array();

        foreach ($reporte['ReporteFiltro'] as $value)
            array_push($reporte['filtros'], $filtroEntity->formatValuesToLinealArray($value));

        unset($reporte['ReporteFiltro']);

        return $reporte;
    }

    private function getTreeChildren($reportes, $idnode = 'root') {
        $result = array();
        foreach ($reportes as $value) {
            if ($this->isChildNode($idnode, $value)) {
                $value['children'] = $this->getTreeChildren($reportes, $value['idreporte']);
                $value['leaf'] = (count($value['children'])) ? false : true;
                $value['text'] = $value['denominacion'];
                $value['expanded'] = true;
                array_push($result, $value);
            }
        }

        return $result;
    }

    private function isChildNode($idpadre, $reporte) {
        if ($idpadre == 'root')
            return $reporte['idpadre'] == $reporte['idreporte'];
        return $idpadre == $reporte['idpadre'] && $reporte['idpadre'] != $reporte['idreporte'];
    }

    public function insertReporte($values) {
        $this->_validator->validateInsert($values);
        $this->_reporteRepository->insertRecord($values);
    }

    public function updateReporte($values) {
        $this->_validator->validateUpdate($values);
        $this->_reporteRepository->updateRecord($values);
        if ($values['agrupador'] == 0) {
            $this->_reporteRepository->deleteRecorsByFilters(
                    array('equalParent' => $values['idreporte'], 'distinctId' => $values['idreporte'])
            );
        }
    }

    public function deleteReporte($values) {
        $this->_validator->validateDelete($values);
        $this->_reporteRepository->deleteRecords($values);
    }

    public function activeReporte($values) {
        $this->_validator->validateDelete($values);
        $this->_reporteRepository->activeRecords($values, 1);
    }

    public function deactiveReporte($values) {
        $this->_validator->validateDelete($values);
        $this->_reporteRepository->activeRecords($values, 0);
    }

}
