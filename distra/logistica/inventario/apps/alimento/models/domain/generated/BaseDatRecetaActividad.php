<?php

abstract class BaseDatRecetaActividad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logalimento.dat_recetaactividad');
        $this->hasColumn(
            'idrecetaactividad', 'numeric', null,
            array(
                'notnull'  => true,
                'primary'  => true,
                'sequence' => 'mod_logalimento.sec_datrecetaactividad'
            )
        );
        $this->hasColumn('idreceta', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idactividad', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('autorizadoentregar', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
