<?php
/**
 * BaseRepository
 * 
 * @author Tte. Darien Cabrera O.
 * @package Persistencia de datos.
 * @subpackage Interfaces Repositorios.
 * @copyright UCID
 * @version 1.0
 */
abstract class BaseRepository
{
    protected $_baseFilters, $_baseTable, $_baseTableAlias, $_basePk;

    public function __construct($table, $tableAlias, $primaryKey, $filters = array())
    {
        $this->_baseTable = $table;
        $this->baseTableAlias = $tableAlias;
        $this->_basePk = $primaryKey;
        $this->_baseFilters = array_merge(
            array(
                'sort' => array('clausere'=>'orderBy'),
                'limit' => array('clausere'=>'limit'),
                'start' => array('clausere'=>'offset'),
            ),
            $filters
        );
    }

    protected function getBasicDqlQuery()
    {
        $tableName = $this->_baseTable.(($this->baseTableAlias)?' '.$this->baseTableAlias:'');
        $selectStatement = ($this->baseTableAlias)?$this->baseTableAlias.'.*':'*';
        return Doctrine_Query::create()->select($selectStatement)->from($tableName);
    }

    public function getDqlQuery($filters)
    {
        return $this->getDqlQueryBuilder($this->getBasicDqlQuery(), $filters);
    }

    public function getRecords($filters = array(), $classInstance = false)
    {
        return $this->getDqlQuery($filters)->{($classInstance)?'execute':'fetchArray'}();
    }

    public function getRecord($filters = array(), $classInstance = false)
    {
        $query = $this->getDqlQuery($filters);

        if($classInstance)
            return $query->fetchOne();
        return $query->fetchOne(array(), Doctrine_Core::HYDRATE_ARRAY);
    }

    public function getCountRecords($filters = array())
    {
        return $this->getDqlQuery($filters)->count();
    }

    public function insertRecord($arrayData = array())
    {
        return $this->createRecord($this->_baseTable, $this->_basePk, $arrayData);
    }

    public function insertRecordCollection($arrayData = array())
    {
        $this->createRecordCollection($this->_baseTable, $arrayData);
    }

    public function updateRecord($arrayData = array())
    {
        $this->synchronizeRecord($this->_baseTable, $this->_basePk, $arrayData);
    }

    public function deleteRecords($idsrecord)
    {
        $this->removeRecords($this->_baseTable, $this->_basePk, $idsrecord);
    }

    public function deleteRecorsByFilters($filters)
    {
        $tableName = $this->_baseTable.(($this->baseTableAlias)?' '.$this->baseTableAlias:'');
        $this->removeRecordsByFilters($tableName, $filters);
    }

    protected function createRecord($table, $primaryKey, $arrayData= array())
    {
        $objectModel = new $table() ;
        $objectModel->fromArray($arrayData);
        $objectModel->save();
        return $objectModel->$primaryKey;
    }

    protected function createRecordCollection($table, $arrayData= array())
    {
        try{
            $objectModel = new Doctrine_Collection($table);
            $objectModel->synchronizeWithArray($arrayData);
            $objectModel->save();
        }catch (Exception $e){

        }
    }

    protected function synchronizeRecord($table, $primaryKey, $arrayData= array())
    {
        $objectModel = Doctrine::getTable($table)->find($arrayData[$primaryKey]);
        $objectModel->synchronizeWithArray($arrayData);
        $objectModel->save();
    }

    protected function removeRecords($table, $primaryKey, $idsrecord)
    {
        Doctrine_Query::create()
            ->delete($table)
            ->whereIn($primaryKey, is_array($idsrecord)?$idsrecord:array($idsrecord))
            ->execute();
    }

    protected function removeRecordsByFilters($table, $filters)
    {
        $this->getDqlQueryBuilder(Doctrine_Query::create()->delete($table), $filters)->execute();
    }

    protected function getDqlQueryBuilder($query, $filters)
    {
        if(is_array($filters))
            foreach($filters as $filterName => $filterValues)
            {
                $isCompositeFilter = strrchr($filterName, '.') != false;
                if($isCompositeFilter)
                    $this->decorateCompositeFilter($query, $filterName, $filterValues);
                else
                    $this->decorateBasicFilter($query, $filterName, $filterValues);
            }

        return $query;
    }

    private function decorateBasicFilter($query, $filterName, $evalValues)
    {
        if(array_key_exists($filterName, $this->_baseFilters))
        {
            $filterClausure = $this->getFilterClausere($filterName);
            $filterStatement = $this->getFilterStatement($filterName);

            if(!isset($evalValues))
                return $query->{$filterClausure}($filterStatement);
            if($filterStatement)
                return $query->{$filterClausure}($filterStatement, $evalValues);

            return $query->{$filterClausure}($evalValues);
        }
        return $query;
    }

    private function decorateCompositeFilter($query, $compositeFilter, $evalValues)
    {
        $filterElem = explode('.', $compositeFilter);
        if(count($filterElem)>1)
            return  $query->addWhere($this->concatFiltersStatement($filterElem), $evalValues);
        return  $query;
    }

    private function concatFiltersStatement($filtersNames)
    {
        $resultStatement = '';
        foreach($filtersNames as $name)
            $resultStatement.=' '.$this->getFilterStatement($name);
        return $resultStatement;
    }

    private function getFilterStatement($filterName)
    {
        switch($filterName){
            case 'and':
                return 'AND';break;
            case 'or':
                return 'OR';break;
            default:
                return $this->_baseFilters[$filterName]['statement'];
        }
    }

    private function getFilterClausere($filterName)
    {
        $filterClausure = $this->_baseFilters[$filterName]['clausere'];
        if($filterClausure)
            return $filterClausure;
        return 'addWhere';
    }
}