<?php

/**
 * ModuloReporteDService
 *
 * @package Domain.
 * @subpackage Domain services.
 * @copyright UCID
 * @version 1.0
 */
class ModuloReporteDService
{
    private $_moduloreporteRepository;

    public function __construct()
    {
        $this->_moduloreporteRepository = new ModuloReporteRepository();
    }

    public function getModulos()
    {
        return $this->_moduloreporteRepository->getRecords(array('sort'=> 'denominacion ASC'));
    }

    public function insertModulo($values)
    {
        $validationfilters = array(
            array('equalIdentificador'=> $values['identificador']),
            array('equalDenom'=> $values['denominacion'])
        );

        $this->validateSaveModule($validationfilters);
        $this->_moduloreporteRepository->insertRecord($values);
    }

    public function updateModulo($values)
    {
        $validationfilters = array(
            array('equalIdentificador'=> $values['identificador'], 'distinctId' => $values['idmodulo']),
            array('equalDenom'=> $values['denominacion'], 'distinctId' => $values['idmodulo'])
        );

        $this->validateSaveModule($validationfilters);
        $this->_moduloreporteRepository->updateRecord($values);
    }

    public function deleteModulos($values)
    {
        $this->_moduloreporteRepository->deleteRecords($values);
    }

    private function validateSaveModule($filters)
    {
        if( $this->_moduloreporteRepository->getCountRecords($filters[0]) != 0 )
            throw new DuplicationValuesException(null, 1);

        if( $this->_moduloreporteRepository->getCountRecords($filters[1]) != 0 )
            throw new DuplicationValuesException(null, 2);
    }
}