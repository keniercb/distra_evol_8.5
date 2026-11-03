<?php

/**
 * @package ERP-Modelos de contabilizacion
 * @category Controller
 * @author Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 * @author Ing. Alejandro Mengana <amengana@xetid.cu>
 * @copyright (c) 2014, XETID
 */
class NomClasificadores extends BaseNomClasificadores
{

    public function setUp()
    {
        // Aqui se reflejan las relaciones con las demas tablas hasMany para (*-*) y hasOne(1-*)
        $this->hasMany('NomCamposContables', array('local' => 'idclasificador', 'foreign' => 'idclasificador'));
        parent::setUp();
    }

    public function persist()
    {
        try
        {
            $a = Doctrine_Manager::getInstance();
            $va = $a->getCurrentConnection();

            $this->save();

            $va->commit();
            $va->beginTransaction();

            return $this;
        }
        catch (Doctrine_Exception $e)
        {
            throw $e;
        }
    }

    static public function GetAll()
    {
        try
        {
            $query = Doctrine_Query::create();
            $result = $query->from('NomClasificadores')->execute();
            return $result->toArray();
        }
        catch (Doctrine_Exception $e)
        {
            return $e;
        }
    }

    static public function GetByPage($offset, $limit, $toArray = false)
    {
        try
        {
            $query = Doctrine_Query::create();
            $result = $query->from('NomClasificadores')
                    ->offset($offset)
                    ->limit($limit)
                    ->execute();
            return $toArray ? $result->toArray() : $result;
        }
        catch (Doctrine_Exception $e)
        {
            return $e;
        }
    }

    static public function GetById($idclasificador, $toArray = false)
    {
        try
        {
            $query = Doctrine_Query::create();
            $result = $query->from('NomClasificadores')
                    ->where("idclasificador=?", array(0 => $idclasificador))
                    ->execute();
            return $toArray ? $result->toArray() : $result;
        }
        catch (Doctrine_Exception $e)
        {
            return $e;
        }
    }

    static public function TotalByField($field, $value)
    {
        try
        {
            $data = Doctrine_Core::getTable('NomClasificadores')->findBy($field, $value
                    , Doctrine_Core::HYDRATE_RECORD);
            $total = $data->count();
            return $total;
        }
        catch (Doctrine_Exception $e)
        {
            return $e;
        }
    }

    static public function GetByCondition($condition, $params, $toArray = false, $start = NULL, $limit = NULL)
    {
        try
        {
            $query = Doctrine_Query::create();

            if ($start === NULL && $limit === NULL)
            {
                $result = $query->from('NomClasificadores')
                        ->where("$condition", $params)
                        ->execute();
            }
            else
            {
                $result = $query->from('NomClasificadores')
                        ->where("$condition", $params)
                        ->offset($start)
                        ->limit($limit)
                        ->execute();
            }

            return $toArray ? $result->toArray() : $result;
        }
        catch (Doctrine_Exception $e)
        {
            return $e;
        }
    }

    static public function Erase($idclasificador)
    {
        try
        {
            $query = Doctrine_Query::create();
            $rows_afected = $query->delete('NomClasificadores')
                    ->where("idclasificador=?", array($idclasificador))
                    ->execute();
            return $rows_afected > 0;
        }
        catch (Doctrine_Exception $e)
        {
            return $e;
        }
    }

    static public function EraseByCondition($conditions, $params)
    {
        try
        {
            $query = Doctrine_Query::create();
            $rows_afected = $query->delete('NomClasificadores')
                    ->where("$conditions", $params)
                    ->execute();
            return $rows_afected > 0;
        }
        catch (Doctrine_Exception $e)
        {
            return $e;
        }
    }

}
