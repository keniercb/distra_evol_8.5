<?php

abstract class BaseDatSubtipobalancebalanceactividad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_subtipobalancebalanceactividad');

        $this->hasColumn(
            'idsubtipobalancebalanceactividad', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_subtipobalancebalanceactividad')
        );
        $this->hasColumn(
            'idsubtipobalancebalance', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idactividad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}



