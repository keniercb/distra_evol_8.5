<?php

/**
 * @package       ERP-Modelos de contabilizacion
 * @category      Controller
 * @author        Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 * @author        Ing. Alejandro Megana <amengana@xetid.cu>
 * @copyright (c) 2014, XETID
 */
class DatSustituciones extends BaseDatSustituciones
{

    public function setUp()
    {
        // Aqui se reflejan las relaciones con las demas tablas hasMany para (*-*) y hasOne(1-*)
//        $this->hasOne('DatAsientosContables', array('local' => 'idasiento', 'foreign' => 'idasiento'));
        /* Esta relacion no es obligatoria porque pueden existir sustituciones
         *  que no sean valores contables */
        $this->hasOne(
            'NomValoresContables',
            array('local' => 'valor', 'foreign' => 'idvalorcontable')
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

            return $this->idsustitucion;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    static public function GetAll()
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->from('DatSustituciones')->execute();
            return $result->toArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function GetByPage($offset, $limit, $toArray = false)
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->from('DatSustituciones')
                ->offset($offset)
                ->limit($limit)
                ->execute();
            return $toArray ? $result->toArray() : $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function GetById($idsustitucion, $toArray = false)
    {
        try {
            $result = Doctrine::getTable('DatSustituciones')->find(
                $idsustitucion
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
            $result = $query->from('DatSustituciones')
                ->where("$condition", $params)
                ->execute();
            return $toArray ? $result->toArray() : $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function Erase($idsustitucion)
    {
        try {
            $query = Doctrine_Query::create();
            $rows_afected = $query->delete('DatSustituciones')
                ->where("idsustitucion=?", $idsustitucion)
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
            $rows_afected = $query->delete('DatSustituciones')
                ->where("$conditions", $params)
                ->execute();
            return $rows_afected >= 0;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

}
