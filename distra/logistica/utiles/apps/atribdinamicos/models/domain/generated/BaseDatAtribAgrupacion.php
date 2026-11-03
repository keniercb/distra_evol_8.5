<?php

abstract class BaseDatAtribAgrupacion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logmetadata.dat_atribagrupacion');
        $this->hasColumn(
            'idatribagrupacion', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logmetadata.sec_confatribagrupacion')
        );
        $this->hasColumn('idagrupacion', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idatributo', 'numeric', 19, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}