<?php

abstract class BaseNomConsultorio extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfarmacia.nom_consultorio');
        $this->hasColumn(
            'idconsultorio', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logfarmacia.sec_nonconsultorio')
        );
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechafin', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechainicio', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('estado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn(
            'codigo', 'character varying', 255, array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}