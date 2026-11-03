<?php

abstract class BaseDatFiltroReporte extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_integracionreporte.dat_reportefiltro');
        $this->hasColumn(
            'idfiltro', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_integracionreporte.sec_reportefiltro')
        );
        $this->hasColumn(
            'idreporte', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'denominacion', 'character varying', 100,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'nombreparametro', 'character varying', 50,
            array('notnull' => true, 'primary' => false)
        );

        $this->hasColumn(
            'denominaciontipo', 'character varying', 50,
            array('notnull' => true, 'primary' => false)
        );

        $this->hasColumn(
            'tipo', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'orden', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'anchocolumna', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'valorpordefecto', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase 

