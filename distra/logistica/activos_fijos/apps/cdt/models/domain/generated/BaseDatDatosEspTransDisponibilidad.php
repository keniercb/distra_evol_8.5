<?php

abstract class BaseDatDatosEspTransDisponibilidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_datosesptransdisp');
        $this->hasColumn(
            'idregnumerico ', 'numeric', null, array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'ubicacion', 'varchar', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'motivo', 'varchar', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'pendiente', 'varchar', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'causa', 'varchar', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
