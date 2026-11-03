<?php
class ZendExt_Nomencladores_Sql_Tree
{
    public function getChildrens($pTable, $pId)
    {
        return "select * from $pTable where idpadre = $pId";
    }
}
