<?php

abstract class BaseNomControldivisa extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('nom_controldivisa');
        $this->hasColumn(
            'codigo', 'character varying', 8,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'color', 'character varying', 20,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'denominacion', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'descripcion', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idcontroldivisa', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_controldivisa')
        );
        $this->hasColumn(
            'estado', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
        $this->HasMany(
            'DatControldivisaindicadormodelo',
            array('local' => 'idcontroldivisa', 'foreign' => 'idcontroldivisa')
        );
        $this->HasMany(
            'DatControldivisadocumentoaprobacion',
            array('local' => 'idcontroldivisa', 'foreign' => 'idcontroldivisa')
        );
         $this->HasMany(
            'DatDesglosecontroldivisa',
            array('local' => 'idcontroldivisa', 'foreign' => 'idcontroldivisa')
        );
    }

}


