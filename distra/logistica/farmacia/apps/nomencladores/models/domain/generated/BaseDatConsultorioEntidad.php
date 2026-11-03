<?php

abstract class BaseDatConsultorioEntidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfarmacia.dat_consultorioentidad');
        $this->hasColumn(
            'idconsultorioentidad', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logfarmacia.sec_datconsultorioentidad')
        );
        $this->hasColumn('idestructuracomun', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idconsultorio', 'numeric', 19, array('notnull' => false, 'primary' => false));

    }

    public function Setup()
    {
        parent::setUp();
    }
}