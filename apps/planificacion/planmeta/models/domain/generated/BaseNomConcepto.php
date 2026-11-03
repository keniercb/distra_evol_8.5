<?php

abstract class BaseNomConcepto extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('nom_concepto');
        $this->hasColumn(
            'color', 'character varying', 20,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'uriconcepto', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'denominacion', 'character varying', 100,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'descripcion', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idconcepto', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_concepto')
        );
    }

    public function Setup()
    {
        parent::setUp();
        $this->HasMany(
            'DatConceptoespecialidad',
            array('local' => 'idconcepto', 'foreign' => 'idconcepto')
        );
    }

}


