<?php

abstract class BaseDatReporte extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_integracionreporte.dat_reporte');
        $this->hasColumn(
            'idreporte', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_integracionreporte.sec_reporte')
        );
        $this->hasColumn(
            'idconfiguracion', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idclasificacion', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'denreporte', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idreportereportserver', 'character varying', 100,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'descreporte', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase 

