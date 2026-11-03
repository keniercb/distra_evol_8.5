<?php

abstract class BaseDatUbicacionComprometida extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logubicacion.dat_ubicacioncomprometida');
        $this->hasColumn(
            'idubicacioncomprometida', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logubicacion.sec_datubicacioncomprometida')
        );
        $this->hasColumn('idubicacion', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('iddocumento', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idproducto', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idlote', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cantidad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estado', 'numeric', 1, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
