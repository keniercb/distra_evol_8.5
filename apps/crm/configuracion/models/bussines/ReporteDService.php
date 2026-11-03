<?php

/**
 * ReporteDService
 *
 * @package Domain.
 * @subpackage Domain services.
 * @copyright UCID
 * @version 1.0
 */
class ReporteDService
{
    private $_reporteRepository;

    public function __construct()
    {
        $this->_reporteRepository = new ReporteRepository();
    }

    public function getReportes($idmodule, $node)
    {
        $reportes = $this->_reporteRepository->getRecords(array('sort'=> 'idpadre ASC', 'equalIdmodulo' => $idmodule));
        return $this->getTreeChildren($reportes, $node);
    }
    
    private function getTreeChildren($reportes, $idnode = 'root')
    {
        $result = array();
        foreach ($reportes as $value) {
            if ($this->isChildNode($idnode, $value)) {
                $value['children'] = $this->getTreeChildren($reportes, $value['idreporte']);
                $value['leaf'] = (count($value['children']))?false:true;
                $value['text'] = $value['denominacion'];
                array_push($result, $value);
            }
        }

        return $result;
    }

    private function isChildNode($idpadre, $reporte)
    {
        if($idpadre == 'root')
            return $reporte['idpadre'] == $reporte['idreporte'];
        return $idpadre == $reporte['idpadre'] && $reporte['idpadre'] != $reporte['idreporte'];
    }

    public function insertReporte($values)
    {
        $validationFilters = array(
            'equalDenom'=> $values['denominacion'],
            'equalIdmodulo' => $values['idmodulo'],
        );
        $this->validateSaveReporte($validationFilters);

        $this->_reporteRepository->insertRecord($values);
    }

    public function updateReporte($values)
    {
        $validationFilters = array(
            'equalDenom'=> $values['denominacion'],
            'equalIdmodulo' => $values['idmodulo'],
            'distinctId' => $values['idreporte']
        );
        $this->validateSaveReporte($validationFilters);

        $this->_reporteRepository->updateRecord($values);
        if($values['agrupador'] == 0)
        {
            $this->_reporteRepository->deleteRecorsByFilters(
                array('equalParent' => $values['idreporte'], 'distinctId' => $values['idreporte'])
            );
        }
    }

    public function deleteReporte($values)
    {
        $this->_reporteRepository->deleteRecords($values);
    }

    private function validateSaveReporte($filters)
    {
        if( $this->_reporteRepository->getCountRecords($filters) != 0 )
            throw new DuplicationValuesException(null, 1);
    }
}