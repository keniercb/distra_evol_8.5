<?php
class ZendExt_Nomencladores_ADTTree
{
    public $_id, $_table, $_esquema, $_lft, $_rgt, $_values, $_idPadre, $_tree_manager, $_id_ext_comun;
    private $_childrens;

    public function __construct($id, $ptable, $esquema, $rgt, $lft, $idpadre, $values, $pIdExtComun)
    {
        $this->_id = $id;
        $this->_table = $ptable;
        $this->_esquema = $esquema;
        $this->_lft = $lft;
        $this->_rgt = $rgt;
        $this->_childrens = array();
        $this->_idPadre = $idpadre;
        $this->_values = $values;
        $this->_id_ext_comun = $pIdExtComun;
        $this->_tree_manager = new ZendExt_Nomencladores_Concrete_TreeManager();
    }


    private function getChildrens()
    {
        $childs = $this->_tree_manager->getChildrens($this->_esquema . "." . $this->_table, $this->_id);
        $pTable2 = substr(
            $this->_table, strrpos($this->_table, '_') + 1, strlen($this->_table) - strrpos($this->_table, '_') - 1
        );
        foreach ($childs as $child) {
            $values = array();
            $keys = array_keys($child);
            if ($child ['id' . $pTable2] != $this->_id) {
                foreach ($keys as $llave) {
                    if ($llave != 'id' . $pTable2 && $llave != 'idpadre' && $llave != 'ordender'
                        && $llave != 'ordenizq'
                    ) {
                        $values[$llave] = $child[$llave];
                    }
                }
                $this->_childrens [] = new ZendExt_Nomencladores_ADTTree(
                    $child ['id'. $pTable2], $this->_table, $this->_esquema, $child ['ordender'], 
                    $child ['ordenizq'], $child['idpadre'], $values, $this->_id_ext_comun
                );
            }
        }
    }

    public function getValues()
    {
        return $this->_values;
    }

    public function Childrens()
    {
        $this->getChildrens();
        return $this->_childrens;
    }

}
