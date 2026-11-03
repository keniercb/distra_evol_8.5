<?php

abstract class BaseDatFiltroReporteTexto extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_integracionreporte.dat_reportefiltrotexto');
        $this->hasColumn(
            'idfiltro', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'longitudminima', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'longitudmaxima', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase 

