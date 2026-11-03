<?php

abstract class BaseDatFuncionalidadDatAccion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_seguridad.dat_funcionalidadaccion');
        $this->hasColumn(
            'idaccion',
            'numeric',
            null, 
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idfuncionalidadasociada',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idrecurso',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}