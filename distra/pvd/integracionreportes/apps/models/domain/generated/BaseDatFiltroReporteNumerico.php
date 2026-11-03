<?php

abstract class BaseDatFiltroReporteNumerico extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_integracionreporte.dat_reportefiltronumerico');
        $this->hasColumn(
            'idfiltro', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'valorminimo', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'valormaximo', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase 

