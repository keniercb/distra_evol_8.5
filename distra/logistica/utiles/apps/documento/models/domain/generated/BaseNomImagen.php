<?php

abstract class BaseNomImagen extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logistica.nom_imagen');
        $this->hasColumn(
            'idimagen', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logistica.sec_nomimagen')
        );
        $this->hasColumn(
            'imagen', 'character varying', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'checksum', 'character varying', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'cantinstancias', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechainicio', 'date', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechafin', 'date', null,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}

