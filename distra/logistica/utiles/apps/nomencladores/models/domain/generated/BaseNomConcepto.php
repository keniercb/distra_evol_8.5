<?php

abstract class BaseNomConcepto extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('nom_concepto');
        $this->hasColumn(
            'idnomconcepto', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'sec_nomconcepto')
        );
        $this->hasColumn(
            'denominacion', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'estado', 'numeric', 1, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fechafin', 'date', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechainicio', 'date', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'iddoc', 'numeric', 19,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idnomoperaciones', 'numeric', 19,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}