<?php

abstract class BaseDatControldivisadocumentoaprobacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_controldivisadocumentoaprobacion');
        $this->hasColumn(
            'idcontroldivisa', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idcontroldivisadocumentoaprobacion', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_controldivisadocumentoaprobacion')
        );
        $this->hasColumn(
            'iddocumentoaprobacion', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idindicador', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'importe', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
            'preciodivisa', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
            'operacionesnc', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'cantidad', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 0)
        );

    }

    public function Setup()
    {
        parent::setUp();
        $this->HasMany(
            'DatControldivisadocumentomodelo',
            array('local'   => 'idcontroldivisadocumentoaprobacion',
                  'foreign' => 'idcontroldivisadocumentoaprobacion')
        );
        $this->HasMany(
            'DatControldivisadocumentoviaadquisicion',
            array('local'   => 'idcontroldivisadocumentoaprobacion',
                  'foreign' => 'idcontroldivisadocumentoaprobacion')
        );
        $this->hasOne(
            'DatDocumentoaprobacion', array('local'   => 'iddocumentoaprobacion',
                                            'foreign' => 'iddocumentoaprobacion')
        );
        $this->hasOne(
            'NomControldivisa',
            array('local' => 'idcontroldivisa', 'foreign' => 'idcontroldivisa')
        );
    }

}


