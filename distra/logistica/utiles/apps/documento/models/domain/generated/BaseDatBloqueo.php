<?php

abstract class BaseDatBloqueo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logistica.dat_bloqueo');

        $this->hasColumn(
            'idbloqueo', 'numeric', null,
            array
            (
                'notnull'  => true, 'primary' => true,
                'sequence' => 'mod_logistica.sec_segbloqueo'
            )
        );
        $this->hasColumn('idestructuracomun', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('iddocumento', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idusuario', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fecha', 'date', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {

        parent::setUp();
    }

}
