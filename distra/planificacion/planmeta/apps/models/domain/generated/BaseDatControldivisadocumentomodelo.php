<?php

abstract class BaseDatControldivisadocumentomodelo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_controldivisadocumentomodelo');
        $this->hasColumn(
            'idcontroldivisadocumentoaprobacion', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idcontroldivisadocumentomodelo', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_controldivisadocumentodestino')
        );
        $this->hasColumn(
            'identidadmodelo', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
        $this->hasOne(
            'DatEntidadmodelo',
            array('local' => 'identidadmodelo', 'foreign' => 'identidadmodelo')
        );
        $this->hasOne(
            'DatControldivisadocumentoaprobacion',
            array('local'   => 'idcontroldivisadocumentoaprobacion',
                  'foreign' => 'idcontroldivisadocumentoaprobacion')
        );
    }

}


