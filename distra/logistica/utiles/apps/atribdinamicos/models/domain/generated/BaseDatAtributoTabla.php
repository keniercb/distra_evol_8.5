<?php

abstract class BaseDatAtributoTabla extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logmetadata.dat_atributotabla');
        $this->hasColumn(
            'idatributotabla', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logmetadata.sec_datatributotabla')
        );
        $this->hasColumn('idtablameta', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idatribagrupacion', 'numeric', 19, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}