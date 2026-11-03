<?php

abstract class BaseNomTipocodificador extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('nom_tipocodificador');
        $this->hasColumn(
            'color', 'character varying', 20,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'denominacion', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'descripcion', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idformato', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idtipocodificador', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_tipocodificador')
        );
    }

    public function Setup()
    {
        parent::setUp();
        $this->HasMany(
            'NomDatoscodificador', array('local'   => 'idtipocodificador',
                                         'foreign' => 'idtipocodificador')
        );
    }

}


