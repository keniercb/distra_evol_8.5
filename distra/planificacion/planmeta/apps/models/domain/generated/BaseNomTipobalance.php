<?php

abstract class BaseNomTipobalance extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_planificacion.nom_tipobalance');
        $this->hasColumn(
            'idtipobalance', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'denominacion', 'character varying', 100,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'descripcion', 'character varying', 100,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idconftiponomesp', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase
