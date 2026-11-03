<?php

abstract class BaseNomTipocomentario extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('nom_tipocomentario');
        $this->hasColumn(
            'idtipocomentario', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_tipocomentario')
        );
        $this->hasColumn(
            'color', 'character varying', 20,
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
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase


