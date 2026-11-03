<?php

abstract class BaseDatConceptoespecialidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_conceptoespecialidad');
        $this->hasColumn(
            'idconcepto', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idconceptoespecialidad', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_conceptoespecialidad')
        );
        $this->hasColumn(
            'idespecialidad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
        $this->hasOne(
            'NomConcepto',
            array('local' => 'idconcepto', 'foreign' => 'idconcepto')
        );
        $this->HasMany(
            'DatAnteproyecto', array('local'   => 'idconceptoespecialidad',
                                     'foreign' => 'idconceptoespecialidad')
        );
    }

}


