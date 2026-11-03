<?php

abstract class BaseDatActividadEntidadTall extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.dat_actividadentidad');
        $this->hasColumn(
            'idactividadentidad', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_actividadentidad')
        );
        $this->hasColumn(
            'idactividad', 'numeric', 19, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'identidad', 'numeric', 19, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase 

