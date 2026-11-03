<?php

abstract class BaseDatActividadmodelosalida extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_actividadmodelosalida');
        $this->hasColumn(
            'idactividadmodelosalida', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'secuence' => 'mod_planificacion.sec_actividadmodelosalida_seq')
        );
        $this->hasColumn(
            'idactividad', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idmodelo', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase
