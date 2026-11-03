<?php

abstract class BaseNomSubtipobalance extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('nom_subtipobalance');
        $this->hasColumn(
            'denominacion', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'descripcion', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idsubtipobalance', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_subtipobalance')
        );
        $this->hasColumn(
            'idtipobalance', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}


