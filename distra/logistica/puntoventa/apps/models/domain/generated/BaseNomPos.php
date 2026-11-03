<?php

abstract class BaseNomPos extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpuntoventa.nom_pos');
        $this->hasColumn(
            'idpos', 'numeric', null,
            array(
                'notnull' => true, 'primary' => true,
                'sequence' => 'mod_logpuntoventa.sec_nompos'
            )
        );
        $this->hasColumn(
            'codigo', 'character varying', null, array(
                'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'denominacion', 'character varying', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idabo', 'character varying', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'chapilla', 'character varying', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idtipocaja', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'fechafin', 'date', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'fechainicio', 'date', null, array(
                'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'estado', 'character varying', 1, array(
                'notnull' => false, 'primary' => false
            )
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}
