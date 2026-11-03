<?php

/**
 * @package       ERP-PCRM
 * @category      Model
 * @author        Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 * @copyright (c) 2015, XETID
 */
class ConfModulos extends BaseConfModulo
{

    public function setUp()
    {
        // Aqui se reflejan las relaciones con las demas tablas hasMany para (*-*) y hasOne(1-*)
        parent::setUp();
    }

    public function persist()
    {
        try {

            $this->save();

            return $this->idconfmodulo;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    static public function GetAll()
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->from('ConfModulos')->execute();
            return $result->toArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function GetByPage($offset, $limit, $toArray = false)
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->from('ConfModulos')
                ->offset($offset)
                ->limit($limit)
                ->execute();
            return $toArray ? $result->toArray() : $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function GetById($idconfmodulo, $toArray = false)
    {
        try {
            $result = Doctrine::getTable('ConfModulos')->find(
                $idconfmodulo
            );
            return $toArray ? $result->toArray() : $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function GetByCondition($condition, $params, $toArray = false)
    {
        try {
            $query = Doctrine_Query::create();
//            $result = $query->select('json_array_elements(c.config)')->from('ConfModulos c')
            $result = $query->from('ConfModulos c')
                ->where("$condition", $params)
                ->execute();
            return $toArray ? $result->toArray() : $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    static public function Erase($idconfmodulo)
    {
        try {
            $query = Doctrine_Query::create();
            $rowsafected = $query->delete('ConfModulos')
                ->where("idconfmodulo=?", array($idconfmodulo))
                ->execute();
            return $rowsafected > 0;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function EraseByCondition($conditions, $params)
    {
        try {
            $query = Doctrine_Query::create();
            $rowsafected = $query->delete('ConfModulos')
                ->where("$conditions", $params)
                ->execute();
            return $rowsafected >= 0;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

}
