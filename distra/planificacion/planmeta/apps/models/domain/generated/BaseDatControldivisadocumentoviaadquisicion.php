<?php

abstract class BaseDatControldivisadocumentoviaadquisicion
    extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_controldivisadocumentoviaadquisicion');
        $this->hasColumn(
            'idcontroldivisadocumentoaprobacion', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idcontroldivisadocumentoviaadquisicion', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_controldivisadocumentoviaadquisicion')
        );
        $this->hasColumn(
            'idviaadquisicion', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
        $this->hasOne(
            'NomViaadquisicion', array('local'   => 'idviaadquisicion',
                                       'foreign' => 'idviaadquisicion')
        );
        $this->hasOne(
            'DatControldivisadocumentoaprobacion',
            array('local'   => 'idcontroldivisadocumentoaprobacion',
                  'foreign' => 'idcontroldivisadocumentoaprobacion')
        );
    }

}


