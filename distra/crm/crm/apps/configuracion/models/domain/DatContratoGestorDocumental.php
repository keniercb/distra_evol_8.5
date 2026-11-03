<?php

/**
 * @package       ERP-PCRM
 * @category      Model
 * @author        Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 * @copyright (c) 2015, XETID
 */
class DatContratoGestorDocumental extends BaseDatContratoGestorDocumental
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
            $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
            $where='';
            $filter = $this->getFilter($condition);
            if(count($filter))$where=' WHERE '.implode(' AND ', $filter);
//            print("SELECT m.idcontratogestordocumental, m.denominacion,
//                       m.idespaciotrabajo, m.activo, m.idestructuracomun, m.organizacion
//                FROM mod_crmadministracion.dat_contratogestordocumental m ".$where);die;
            $result=$conexionActual->fetchAll("
                SELECT m.idcontratogestordocumental, m.denominacion, 
                       m.idespaciotrabajo, m.activo, m.idestructuracomun, m.organizacion 
                FROM mod_crmadministracion.dat_contratogestordocumental m ".$where);
            return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function loadByCondition1($condition)
    {
        try {
            $this->_query = Doctrine_Query::create();
            $filter = $this->getFilter($condition);

            $this->_query->select('dcgd.*')
                ->from('DatContratoGestorDocumental dcgd')
                ->where(implode(' AND ', $filter));
            $this->_result = $this->_query->execute();
//            print_r($this->_query->getSqlQuery());die;
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
