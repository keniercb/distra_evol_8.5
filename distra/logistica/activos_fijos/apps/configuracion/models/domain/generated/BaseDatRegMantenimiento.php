<?php

/**
 *    Daniel Arias Espinosa 06-07-16
 */
abstract class BaseDatRegMantenimiento extends Doctrine_Record
{

    /**
     *
     */
    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_registromantenimiento');
        $this->hasColumn(
            'idregistropendiente', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_logactivofijotangible.sec_datregistropendiente'
            )
        );
        $this->hasColumn('idregnumerico', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idplanificacionmantenimiento', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('estado', 'numeric', 1, array('notnull' => true, 'primary' => false));
    }

    public function setUp()
    {
        parent::setUp();
    }

}
