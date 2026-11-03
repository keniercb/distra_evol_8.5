<?php
interface ZendExt_Nomencladores_Interfaces_ICategory
{
    function getCategories($pOffset, $pLimit); //ok
    function addCategory($pId, $pCategory); //ok
    function updateCategory($pOldCategory, $pNewCategory); //ok
    function deleteCategory($pIdCategory); //ok
    function setCategoryToTable($pSchema, $pTable, $pIdCategory); //ok
    function dropCategoryToTable($pSchema, $pIdTable, $pIdCategory); //ok
    function getCategoriesFromTable($pTablename); //ok
    function getTablesFromCategory($pTablename);
}
