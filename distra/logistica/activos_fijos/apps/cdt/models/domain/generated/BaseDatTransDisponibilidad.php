<?php

abstract class BaseDatTransDisponibilidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName(
            'mod_logactivofijotangible.dat_transdisponibilidad'
        );
        $this->hasColumn(
            'idregnumerico ', 'numeric', null, array('notnull' => false, 'primary' => true)
        );
        $this->hasColumn(
            'idestatusoperativo', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idindicador', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'descripcion', 'varchar', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
