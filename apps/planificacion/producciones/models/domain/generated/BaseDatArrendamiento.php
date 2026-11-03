<?php

abstract class BaseDatArrendamiento extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_spouam.dat_arrendamiento');
        $this->hasColumn(
            'gasto', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idaplicacioncartatec', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idindicador', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idcartatecnologicaactividad', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'plazoarrendamiento', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
    }

    public function Setup()
    {
        parent::setUp();     
        $this->hasOne(
            'DatAplicacioncartatec', array('local' => 'idaplicacioncartatec',
                                           'foreign' => 'idaplicacioncartatec')
        );
    }

}


