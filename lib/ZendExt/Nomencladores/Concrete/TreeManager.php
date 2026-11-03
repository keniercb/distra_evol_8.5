<?php
class ZendExt_Nomencladores_Concrete_TreeManager /*implements ZendExt_Nomencladores_Interfaces_ITree*/
{
    private $_sql, $db;

    public function __construct()
    {
        $this->db = ZendExt_Nomencladores_Db_Singleton::getInstance();
        $this->_sql = new ZendExt_Nomencladores_Sql_Tree();
    }

    public function getChildrens($pTable, $pId)
    {
        $schema = substr($pTable, 0, strpos($pTable, '.'));
        return $this->db->query($this->_sql->getChildrens($pTable, $pId), $schema);
    }
}
