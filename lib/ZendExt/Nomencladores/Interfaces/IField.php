<?php
interface ZendExt_Nomencladores_Interfaces_IField
{

    public function addField($pTable, $pNombreField, $pType, $pPK, $pSchema); //ok
    public function addFK($pTable, $pForeignTable, $pLocalField, $pForeignField, $pSchema); //ok
    public function dropField($pTable, $pField); //ok
    public function addExtFK($pextTable, $pNomenclador, $pextField, $pField); //ok
    public function dropFK($pTable, $pForeignField); //ok
    public function renameField($pTable, $pOldName, $pNewName); //ok
    public function getFieldsDetails($pSchema, $pTabl); //ok
}
