<?php

abstract class BaseDatIndicadorentidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_indicadorentidad');
        $this->hasColumn(
            'idindicadorentidad', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_indicadorentidad')
        );
        $this->hasColumn(
            'identidad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idindicador', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase


