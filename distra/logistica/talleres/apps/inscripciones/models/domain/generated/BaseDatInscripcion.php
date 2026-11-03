<?php

abstract class BaseDatInscripcion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.dat_inscripcion');
        $this->hasColumn('idinscripcion', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idmedio', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('tipo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechainicio', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechafin', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('datosmedio', 'json', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn(
            'atributoidentificador', 'character varying', 50, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}

