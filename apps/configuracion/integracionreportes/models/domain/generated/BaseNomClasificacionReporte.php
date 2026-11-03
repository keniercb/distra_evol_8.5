<?php

abstract class BaseNomClasificacionReporte extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_integracionreporte.nom_clasificacionreporte');

        $this->hasColumn(
            'idclasificacion', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                'sequence' => 'mod_integracionreporte.sec_clasificacionreporte')
        );
        $this->hasColumn(
            'denominacion', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );

    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase