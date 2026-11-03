<?php

abstract class BaseDatDocObservaciones extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logistica.dat_docobservaciones');

        $this->hasColumn(
            'iddocobservaciones', 'numeric', null,
            array
            (
                'notnull'  => true, 'primary' => true,
                'sequence' => 'mod_logistica.sec_datdocumentoobservaciones'
            )
        );
        $this->hasColumn('iddocumento', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fecha', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('observaciones', 'character varying', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {

        parent::setUp();
    }

}
