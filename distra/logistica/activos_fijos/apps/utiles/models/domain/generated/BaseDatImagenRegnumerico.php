<?php

/**
 *  Gerardo
 */
abstract class BaseDatImagenRegnumerico extends Doctrine_Record
{

    /**
     *
     */
    public function setTableDefinition()
    {
        $this->setTableName('mod_logistica.dat_imagenregistro');
        $this->hasColumn(
            'idimagenregistro', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logistica.sec_datimagenregistro')
        );
        $this->hasColumn('idimagen', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idregnumerico', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
    }

}
