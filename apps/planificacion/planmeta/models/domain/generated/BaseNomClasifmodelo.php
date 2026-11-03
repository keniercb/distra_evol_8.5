<?php

abstract class BaseNomClasifmodelo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('nom_clasifmodelo');
        $this->hasColumn(
            'idClasifmodelo', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_clasifmodelo')
        );
        $this->hasColumn(
            'denominacion', 'character varying', 100,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'descripcion', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'ordenizq', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'ordender', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idpadre', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idarbol', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
        $this->hasMany(
            'NomClasifmodelo',
            array('local' => 'idclasifmodelo', 'foreign' => 'idpadre')
        );
    }

}

//fin clase


