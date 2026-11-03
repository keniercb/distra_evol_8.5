<?php

/**
 * @package ERP-Operaciones contables
 * @category Nomenclador
 * @author Ing. Rodain Terrer Molina<amengana@xetid.cu>
 * @copyright (c) 2014, XETID
 */
class NomConceptoOperacion extends BaseNomConceptoOperacion
{

    public function setUp()
    {
        $this->hasMany('DatOperacionesentidad', array('local' => 'idconceptooperacion', 'foreign' => 'signo'));
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

            return $this;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    static public function GetAll()
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->from('NomConceptoOperacion')->execute();
            return $result->toArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function GetById($idconceptooperacion, $toArray = false)
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->from('NomConceptoOperacion')
                    ->where("idconceptooperacion=?", array(0 => $idconceptooperacion))
                    ->execute();
            return $toArray ? $result->toArray() : $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function TotalByField($field, $value)
    {
        try {
            $data = Doctrine_Core::getTable('NomConceptoOperacion')->findBy($field, $value, Doctrine_Core::HYDRATE_RECORD);
            $total = $data->count();
            return $total;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function GetByCondition($condition, $params, $toArray = false)
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->from('NomConceptoOperacion')
                    ->where("$condition", $params)
                    ->execute();
            return $toArray ? $result->toArray() : $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function Erase($idconceptooperacion)
    {
        try {
            $query = Doctrine_Query::create();
            $rows_afected = $query->delete('NomConceptoOperacion')
                    ->where("idconceptooperacion=?", array($idconceptooperacion))
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
            $rows_afected = $query->delete('NomConceptoOperacion')
                    ->where("$conditions", $params)
                    ->execute();
            return $rows_afected > 0;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

}
