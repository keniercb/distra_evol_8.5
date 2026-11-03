<?php

/**
 * @package       ERP-Modelos de contabilizacion
 * @category      Controller
 * @author        Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 * @author        Ing. Alejandro Megana <amengana@xetid.cu>
 * @author        Ing. Alberto Mesa Martínez <amartinez@xetid.cu>
 * @copyright (c) 2014, XETID
 */
class NomCamposContables extends BaseNomCamposContables
{

    public function setUp()
    {
        // Aqui se reflejan las relaciones con las demas tablas hasMany para (*-*) y hasOne(1-*)
        $this->hasMany('DatAsientosContables', array('local' => 'idcampo', 'foreign' => 'cuenta'));
        $this->hasOne('NomClasificadores', array('local' => 'idclasificador', 'foreign' => 'idclasificador'));
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

            return $this->idcampo;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    static public function GetAll()
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->from('NomCamposContables')->execute();
            return $result->toArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function GetByPage($offset, $limit, $toArray = false)
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->from('NomCamposContables')
                    ->offset($offset)
                    ->limit($limit)
                    ->execute();
            return $toArray ? $result->toArray() : $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function GetById($idcampo, $toArray = false)
    {
        try {
            $result = Doctrine::getTable('NomCamposContables')->find($idcampo);
            return $toArray ? $result->toArray() : $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function GetByIds($arrIds, $toArray = false)
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->from('NomCamposContables')
                    ->whereIn("idcampo", $arrIds)
                    ->execute();
            return $toArray ? $result->toArray() : $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function GetByCondition($condition, $params, $toArray = false, $start = null, $limit = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomCamposContables')
                    ->where("$condition", $params)
                    ->orderby('idcampo');
            if (!is_null($start) && !is_null($limit)) {
                $query->offset($start)
                        ->limit($limit);
            }
            $result = $query->execute();
            return $toArray ? $result->toArray() : $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function CountByCondition($condition, $params)
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->select('count(idcampo) as cantidad')->from(
                            'NomCamposContables'
                    )
                    ->where("$condition", $params)
                    ->execute()
                    ->toArray();
            return $result[0]['cantidad'];
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function Erase($idcampo)
    {
        try {
            $query = Doctrine_Query::create();
            $rows_afected = $query->delete('NomCamposContables')
                    ->where("idcampo=?", array($idcampo))
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
            $rows_afected = $query->delete('NomCamposContables')
                    ->where("$conditions", $params)
                    ->execute();
            return $rows_afected > 0;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

}
