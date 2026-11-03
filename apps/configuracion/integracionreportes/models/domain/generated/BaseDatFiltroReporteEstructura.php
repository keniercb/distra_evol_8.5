<?php

abstract class BaseDatFiltroReporteEstructura extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_integracionreporte.dat_reportefiltroestructura');
        $this->hasColumn(
            'idfiltro', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'estructuracompleta', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase 

