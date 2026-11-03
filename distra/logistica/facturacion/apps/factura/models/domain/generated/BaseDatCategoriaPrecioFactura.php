<?php

abstract class BaseDatCategoriaPrecioFactura extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.dat_categoriapreciofactura');
        $this->hasColumn(
            'idcategoriafactura', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logfacturacion.sec_categoriapreciofactura')
        );
        $this->hasColumn(
            'idcategoriaprecio', 'numeric', 19, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idfactura', 'numeric', 19, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'valor', 'numeric', 19, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idcuenta', 'numeric', 19, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'bi', 'numeric', 19, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'aplicar', 'numeric', 19, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'condicionpago', 'character varying', 255, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idcondicionpago', 'numeric', 19, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idcliente', 'numeric', 19, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'cuenta', 'character varying', 255, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'codigo', 'character varying', 10, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'noexterior', 'numeric', 19, array('notnull' => true, 'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }
}
