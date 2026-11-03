<?php

abstract class BaseDatMovcambioccontable extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logistica.dat_movcambioccontable');
        $this->hasColumn(
            'idmovcambioccontable', 'numeric', null, 
            array('notnull' => true, 'primary' => true, 'sequence' => 'sec_datclasificacioncontableentidad')
        );
        $this->hasColumn('iddocumento', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idproducto', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idclasificacioncontable', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcalisficacioanterior', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('importe', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('importealt', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}