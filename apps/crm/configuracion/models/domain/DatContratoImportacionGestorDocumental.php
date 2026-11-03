<?php

/**
 * @package       ERP-PCRM
 * @category      Model
 * @author        Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 * @copyright (c) 2015, XETID
 */
class DatContratoImportacionGestorDocumental extends BaseDatContratoImportacionGestorDocumental
{
    private $_query;
    private $_result;

    public function setUp()
    {
        parent::setUp();
    }

    public function loadByCondition($condition)
    {
        try {
            $_query = Doctrine_Query::create();
            $filter = $this->getFilter($condition);
            $_query->select('dcgd.*')
                ->from('DatContratoImportacionGestorDocumental dcgd')
                ->where(implode(' AND ', $filter));
            $this->_result = $_query->execute();
            return $this->_result->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getFilter($condition)
    {
        $filter = array();
        foreach ($condition as $key => $value) {
            $filter[] = $key . " = " . $value;
        }
        return $filter;
    }

}
