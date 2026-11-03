<?php

abstract class BaseDatActespcomportamiento extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_actespcomportamiento');
        $this->hasColumn(
            'idactespcomportamiento', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_actespdemandante')
        );
        $this->hasColumn(
            'idactividad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idespecialidad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'iddatosnomenclador', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase
