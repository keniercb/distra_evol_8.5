<?php

/**
 * @package       ERP-PCRM
 * @category      Model
 * @author        Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 * @copyright (c) 2015, XETID
 */
class ConfAccesoDirecto extends BaseConfAccesoDirecto
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

            return $this->idaccesodirecto;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    static public function GetAll()
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->from('ConfAccesoDirecto')->execute();
            return $result->toArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function GetByPage($offset, $limit, $toArray = false)
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->from('ConfAccesoDirecto')
                ->offset($offset)
                ->limit($limit)
                ->execute();
            return $toArray ? $result->toArray() : $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function GetById($idaccesodirecto, $toArray = false)
    {
        try {
            $result = Doctrine::getTable('ConfAccesoDirecto')->find(
                $idaccesodirecto
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
            $result = $query->from('ConfAccesoDirecto')
                ->where("$condition", $params)
                ->execute();
            return $toArray ? $result->toArray() : $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    static public function Erase($idaccesodirecto)
    {
        try {
            $query = Doctrine_Query::create();
            $rowsafected = $query->delete('ConfAccesoDirecto')
                ->where("idaccesodirecto=?", array($idaccesodirecto))
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
            $rowsafected = $query->delete('ConfAccesoDirecto')
                ->where("$conditions", $params)
                ->execute();
            return $rowsafected >= 0;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

}
