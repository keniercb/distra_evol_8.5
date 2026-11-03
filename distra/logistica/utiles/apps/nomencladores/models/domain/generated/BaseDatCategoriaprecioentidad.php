<?php

abstract class BaseDatCategoriaprecioentidad extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.dat_categoriaprecioentidad');
        $this->hasColumn(
            'idcategoriaprecioentidad', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idcategoriaprecio', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}