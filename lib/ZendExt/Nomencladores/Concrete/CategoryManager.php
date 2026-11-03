<?php
class ZendExt_Nomencladores_Concrete_CategoryManager implements ZendExt_Nomencladores_Interfaces_ICategory
{
    private $_db;
    private $_sql;
    private $_conn;

    function __construct()
    {
        $this->_db = ZendExt_Nomencladores_Db_Singleton :: getInstance();
        $this->_sql = new ZendExt_Nomencladores_Sql_Category();
        $this->_conn = $this->_db->getConnBySchema('mod_datosmaestros');
    }

    function getCategories($pOffset, $pLimit)
    {
        return $this->_db->query($this->_sql->getCategories($pOffset, $pLimit), $this->_conn);
    }

    function addCategory($pId, $pCategory)
    {
        return $this->_db->query($this->_sql->addCategory($pId, $pCategory), $this->_conn);
    }

    function updateCategory($pIdCategory, $pCategory)
    {
        return $this->_db->query($this->_sql->updateCategory($pIdCategory, $pCategory), $this->_conn);
    }

    function deleteCategory($pIdCategory)
    {
        return $this->_db->query($this->_sql->deleteCategory($pIdCategory), $this->_conn);
    }

    function setCategoryToTable($pSchema, $pTable, $pIdCategory)
    {
        return $this->_db->query($this->_sql->setCategoryToTable($pSchema, $pTable, $pIdCategory), $this->_conn);
    }

    function dropCategoryToTable($pSchema, $pTable, $pIdCategory)
    {

        return $this->_db->query($this->_sql->dropCategoryToTable($pSchema, $pTable, $pIdCategory), $this->_conn);
    }

    function getCategoriesFromTable($pTablename)
    {

        return $this->_db->query($this->_sql->getCategoriesFromTable($pTablename), $this->_conn);
    }

    function getTablesFromCategory($pIdCategory)
    {
        return $this->_db->query($this->_sql->getTablesFromCategory($pIdCategory), $this->_conn);
    }

    public function countCategories()
    {
        $arr = $this->_db->query($this->_sql->countCategories(), $this->_conn);
        return $arr[0]['count'];
    }

    public function haveThisCategory($pTable, $pIdCategory)
    {
        return $this->_db->query($this->_sql->haveThisCategory($pTable, $pIdCategory), $this->_conn);
    }

}
