<?php

abstract class BaseNomAprobacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('nom_aprobacion');
        $this->hasColumn(
            'idaprobacion', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_aprobacion')
        );
        $this->hasColumn(
            'denominacion', 'character varying', 100,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase
