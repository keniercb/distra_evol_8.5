<?php

abstract class BaseDatServicio extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_spouam.dat_servicio');
        $this->hasColumn(
            'gasto', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idactividad', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idaplicacioncartatec', 'numeric', null,
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
        $this->hasOne(
            'NomActividad',
            array('local' => 'idactividad', 'foreign' => 'idactividad')
        );
    }

}


