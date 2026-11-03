<?php
interface ZendExt_Nomencladores_Interfaces_ITabla
{
    public function createTable($pSchema, $pTable, $pTree, $pEnabled, $pCategory); //ok
    public function dropTable($pTable); //ok
    public function tableExist($pSchema, $pNom); //ok
    public function getOneElement($pSchema, $pTable, $pkey, $pSelectParams); //ok
    public function selectElements($pSchema, $pTabla, $pLimit, $pOffset, $pWhere, $pOrderBy); //ok
    public function updateElements($pSchema, $pTable, $pValues, $pPKs); //ok
    public function deleteElements($pSchema, $pTable, $pKey); //ok
    public function insertElements($pSchema, $pTable, $pValues); //ok
    public function countTables($pSchema, $pNoms); //ok
    public function countValues($pSchema, $pTable, $pWhere);
    public function countFields($pSchema, $pTable);
    public function getTables($pSchema, $pLimit, $pOffset, $pNoms); //ok
    public function getTree($pSchema, $pTable, $pIdElement, $pIdExtComun);
}
