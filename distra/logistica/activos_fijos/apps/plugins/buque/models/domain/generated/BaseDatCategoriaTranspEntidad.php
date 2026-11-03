<?php

abstract class BaseDatCategoriaTranspEntidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_categoriatranspentidad');
        $this->hasColumn(
            'idcategoriaentidad', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false,
            'primary' => true, 'sequence' => 'mod_logactivofijotangible.sec_datcategoriatranspentidad')
        );
        $this->hasColumn(
            'idcategoria', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false,
            'primary' => false)
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false,
            'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }

}
