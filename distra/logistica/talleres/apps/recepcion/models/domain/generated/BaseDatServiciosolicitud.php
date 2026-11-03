<?php

abstract class BaseDatServiciosolicitud extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.dat_servicio');
        $this->hasColumn(
            'idservicio', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_datservicio')
        );
        $this->hasColumn(
            'idplansolicitud', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idindicador', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idactividad', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'denominacion', 'character varying', 255, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}

