<?php

abstract class BaseDatEntidadmodelo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_entidadmodelo');
        $this->hasColumn(
            'identidadmodelo', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_entidadmodelo')
        );
        $this->hasColumn(
            'idmodelo', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'identidad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'prioridad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase



