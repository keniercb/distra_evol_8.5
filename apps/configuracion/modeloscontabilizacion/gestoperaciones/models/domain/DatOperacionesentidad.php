<?php

/**
 * @package ERP-Operaciones contables
 * @category Nomenclador
 * @author Ing. Alejandro Mengana Pérez<amengana@xetid.cu>
 * @copyright (c) 2014, XETID
 */
class DatOperacionesentidad extends BaseDatOperacionesentidad
{

    public function setUp()
    {
        $this->hasOne('NomOperaciones', array('local' => 'idnomoperaciones', 'foreign' => 'idnomoperaciones'));
        $this->hasOne('DatDocumentoprim', array('local' => 'iddoc', 'foreign' => 'iddoc'));
        $this->hasOne('NomConceptoOperacion', array('local' => 'signo', 'foreign' => 'idconceptooperacion'));
        $this->hasOne('NomModelosContabilizacion', array('local' => 'idmodelo', 'foreign' => 'idmodelo'));
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
            $result = $query->from('DatOperacionesentidad')->execute();
            return $result->toArray();
        }
        catch (Doctrine_Exception $e)
        {
            return $e;
        }
    }

    static public function GetById($idoperacionentidad, $toArray = false)
    {
        try
        {
            $query = Doctrine_Query::create();
            $result = $query->from('DatOperacionesentidad')
                    ->where("idoperacionesentidad=?", array(0 => $idoperacionentidad))
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
            $data = Doctrine_Core::getTable('DatOperacionesentidad')->findBy($field, $value, Doctrine_Core::HYDRATE_RECORD);
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
                $result = $query->select('de.*,no.idsubsistema')
                        ->from('DatOperacionesentidad de')
                        ->innerJoin('de.NomOperaciones no')
                        ->where("$condition", $params)
                        ->execute();
            }
            else
            {
                $result = $query->select('de.*,no.idsubsistema')
                        ->from('DatOperacionesentidad')
                        ->innerJoin('de.NomOperaciones no')
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

    static public function Erase($idoperacionentidad)
    {
        try
        {
            $query = Doctrine_Query::create();
            $rows_afected = $query->delete('DatOperacionesentidad')
                    ->where("idoperacionesentidad=?", array($idoperacionentidad))
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
            $rows_afected = $query->delete('DatOperacionesentidad')
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
