<?php

abstract class BaseDatUbicacionlote extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logubicacion.dat_ubicacionlote');
        $this->hasColumn(
            'idubicacionlote', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logubicacion.sec_datubicacionlote')
        );
        $this->hasColumn('idubicacion', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idlote', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('cantidad', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}



