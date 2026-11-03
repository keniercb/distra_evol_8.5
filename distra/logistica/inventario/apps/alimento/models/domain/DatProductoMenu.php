<?php

class DatProductoMenu extends BaseDatProductoMenu
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('NomIndicador', array('local' => 'idproducto', 'foreign' => 'idindicador'));
        //$this->hasMany('DatUnidadMedida', array('local'=>'idunidadmedida','foreign'=>'idunidadmedida'));
        $this->hasOne('DatMenu', array('local' => 'idmenu', 'foreign' => 'idmenu'));
    }

    public function existeProductoMenu($idmenu, $idproducto)
    {
        $conn = Zend_Registry::get('conexion');
        $query
            = "SELECT m.idproductomenu
            FROM mod_logalimento.dat_productomenu m
            WHERE m.idmenu = {$idmenu} AND m.idproducto = {$idproducto}";
        $res = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return count($res) > 0 ? $res[0]['idproductomenu'] : false;
    }

}
