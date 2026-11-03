<?php

/**
 * ReporteFiltrosDService
 *
 * @package Domain.
 * @subpackage Domain services.
 * @copyright UCID
 * @version 1.0
 */
class ReporteFiltrosDService
{
    private $_reportefiltroRepository;

    public function __construct()
    {
        $this->_reportefiltroRepository = new ReporteFiltroRepository();
    }

    public function getFiltros($idreporte)
    {
        return $this->_reportefiltroRepository->getListReporteFilters(
            array('sort'=> 'orden ASC', 'equalIdReporte'=> $idreporte)
        );
    }

    public function insertFiltro($values)
    {
        $validationfilters = array(
            'equalDenom'=> $values['denominacion'],
            'equalIdReporte' => $values['idreporte']
        );

        $this->validateSaveFiltro($validationfilters);
        $this->_reportefiltroRepository->insertRecord($values);
    }

    public function updateFiltro($values)
    {
        $validationfilters = array(
            'equalDenom'=> $values['denominacion'],
            'equalIdReporte' => $values['idreporte'],
            'distinctId' => $values['idfiltro']
        );
        $this->validateSaveFiltro($validationfilters);
        $this->_reportefiltroRepository->updateRecord($values);
    }

    public function deleteFiltro($values)
    {
        $this->_reportefiltroRepository->deleteRecords($values);
    }

    private function validateSaveFiltro($filters)
    {
        if( $this->_reportefiltroRepository->getCountRecords($filters) != 0 )
            throw new DuplicationValuesException(null, 1);
    }
}