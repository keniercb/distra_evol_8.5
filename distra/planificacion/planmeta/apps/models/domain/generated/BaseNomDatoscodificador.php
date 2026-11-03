<?php

abstract class BaseNomDatoscodificador extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('nom_datoscodificador');
        $this->hasColumn(
            'codigo', 'character varying', 100,
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
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'iddatoscodificador', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_datoscodificador')
        );
        $this->hasColumn(
            'idtipocodificador', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idumedida', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
        $this->HasMany(
            'DatDatosclasificadorindicador',
            array('local'   => 'iddatoscodificador',
                  'foreign' => 'iddatosclasificador')
        );
        $this->hasOne(
            'NomTipocodificador', array('local'   => 'idtipocodificador',
                                        'foreign' => 'idtipocodificador')
        );
    }

}


