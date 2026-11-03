<?php

abstract class BaseDatNaturalezaVenta extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpuntoventa.dat_naturalezaventa');
        $this->hasColumn(
            'idnaturalezaventa', 'numeric', null,
            array(
                'notnull' => true, 'primary' => true/*,
                'sequence' => 'mod_logpuntoventa.sec_datnaturalezaventa'*/
            )
        );
        $this->hasColumn(
            'idnaturaleza', 'numeric', null,
            array(
                'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'idtiempogarantia', 'numeric', 19,
            array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'limitecantidad', 'numeric', 19,
            array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idtiempolimite', 'numeric', 19,
            array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idpadre', 'numeric', 19,
            array(
                'notnull' => false, 'primary' => false
            )
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}
