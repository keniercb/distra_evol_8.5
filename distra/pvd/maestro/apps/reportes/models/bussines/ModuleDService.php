<?php

/**
 * ModuleDService
 *
 * @package Domain.
 * @subpackage Domain services.
 * @copyright UCID
 * @version 1.0
 */
class ModuleDService
{
    private $_moduleRepository;
    private $_validator;

    public function __construct()
    {
        $this->_moduleRepository = new ModuleRepository();
        $this->_validator = new ModuleValidator();
    }

    public function getModules()
    {
        return $this->_moduleRepository->getRecords(array('sort'=> 'denominacion ASC'));
    }

    public function insertModule($values)
    {
        $this->_validator->validateInsert($values);
        $this->_moduleRepository->insertRecord($values);
    }

    public function updateModule($values)
    {
        $this->_validator->validateUpdate($values);
        $this->_moduleRepository->updateRecord($values);
    }

    public function deleteModules($values)
    {
        $this->_validator->validateDelete($values);
        $this->_moduleRepository->deleteRecords($values);
    }
}