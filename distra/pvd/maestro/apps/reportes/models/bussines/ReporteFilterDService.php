<?php

/**
 * ReporteFilterDService
 *
 * @package Domain.
 * @subpackage Domain services.
 * @copyright UCID
 * @version 1.0
 */
class ReporteFilterDService
{
    private $_reportefilterRepository;
    private $_validator;

    public function __construct()
    {
        $this->_reportefilterRepository = new ReporteFilterRepository();
        $this->_validator = new ReporteFilterValidator();
    }

    public function getFilters($idreporte)
    {
        return $this->_reportefilterRepository->getListReporteFilters(
            array('sort'=> 'orden ASC', 'equalIdReporte'=> $idreporte)
        );
    }

    public function insertFilter($values)
    {
        $this->_validator->validateInsert($values);
        $this->_reportefilterRepository->insertRecord($values);
    }

    public function updateFilter($values)
    {
        $this->_validator->validateUpdate($values);
        $this->_reportefilterRepository->updateRecord($values);
    }

    public function deleteFilters($values)
    {
        $this->_validator->validateDelete($values);
        $this->_reportefilterRepository->deleteRecords($values);
    }

    public function getFilterNomencladorData($filtro)
    {
        $filter = $this->_reportefilterRepository->getFilterNomencladorById($filtro);
        return $filter->getNomencladorData();
    }
    public function getFilterEstructuraData($node, $globalStruct)
    {
        $idstructure = ($node == 'root')?$globalStruct:$node;
        return ZendExt_IoC::getInstance()->metadatos->DameHijosEstructura($idstructure);
    }
}