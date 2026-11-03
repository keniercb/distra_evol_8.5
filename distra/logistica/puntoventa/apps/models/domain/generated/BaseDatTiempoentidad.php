<?php

abstract class BaseDatTiempoentidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpuntoventa.dat_tiempoentidad');
        $this->hasColumn(
            'idtiempoentidad', 'numeric', 19,
            array(
            'notnull' => true, 'primary' => true,
            'sequence' => 'mod_logpuntoventa.sec_dattiempoentidad'
            )
        );
        $this->hasColumn(
            'idtiempo', 'numeric', 19,
            array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', 19,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn('idnaturaleza', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cantidaddiaslimventa', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtiempogarantia', 'numeric', 19, array('notnull' => false, 'primary' => false));
        
    }

    public function Setup()
    {
        parent::setUp();
    }

}