<?php

abstract class BaseDatFiltroReporteNomenclador extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_integracionreporte.dat_reportefiltronomenclador');
        $this->hasColumn(
            'idfiltro', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'nomidentificador', 'character varying', 100,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'nomdenominacion', 'character varying', 100,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'tipofuentedatos', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'sentenciasql', 'character varying', 1000,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'nomservicio', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'multipleseleccion', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'paginado', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'enviarid', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase 

