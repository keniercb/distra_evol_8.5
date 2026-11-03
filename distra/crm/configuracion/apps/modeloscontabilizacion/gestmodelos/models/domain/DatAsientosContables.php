<?php

/**
 * @package       ERP-Modelos de contabilizacion
 * @category      Controller
 * @author        Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 * @author        Ing. Alejandro Megana <amengana@xetid.cu>
 * @copyright (c) 2014, XETID
 */
class DatAsientosContables extends BaseDatAsientosContables
{

    public function setUp()
    {
        // Aqui se reflejan las relaciones con las demas tablas hasMany para (*-*) y hasOne(1-*)
        $this->hasOne(
            'NomModelosContabilizacion',
            array('local' => 'idmodelo', 'foreign' => 'idmodelo')
        );
        $this->hasOne(
            'NomCamposContables',
            array('local' => 'cuenta', 'foreign' => 'idcampo')
        );
        $this->hasOne(
            'NomValoresContables',
            array('local' => 'idvalorcontable', 'foreign' => 'idvalorcontable')
        );
        $this->hasMany(
            'DatSustituciones',
            array('local' => 'idasiento', 'foreign' => 'idasiento')
        );
        parent::setUp();
    }

    public function persist()
    {
        try {
            $a = Doctrine_Manager::getInstance();
            $va = $a->getCurrentConnection();

            $this->save();

            $va->commit();
            $va->beginTransaction();

            return $this->idasiento;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    static public function GetAll()
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->from('DatAsientosContables')->execute();
            return $result->toArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function GetByPage($offset, $limit, $toArray = false)
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->from('DatAsientosContables')
                ->offset($offset)
                ->limit($limit)
                ->execute();
            return $toArray ? $result->toArray() : $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function GetById($idasiento, $toArray = false)
    {
        try {
            $result = Doctrine::getTable('DatAsientosContables')->find(
                $idasiento
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
            $result = $query->from('DatAsientosContables')
                ->where("$condition", $params)
                //->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
            return $toArray ? $result->toArray() : $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function Erase($idasiento)
    {
        try {
            $query = Doctrine_Query::create();
            $rows_afected = $query->delete('DatAsientosContables')
                ->where("idasiento=?", array($idasiento))
                ->execute();
            return $rows_afected > 0;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function EraseByCondition($conditions, $params)
    {
        try {
            $query = Doctrine_Query::create();
            $rows_afected = $query->delete('DatAsientosContables')
                ->where("$conditions", $params)
                ->execute();
            return $rows_afected >= 0;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

}
