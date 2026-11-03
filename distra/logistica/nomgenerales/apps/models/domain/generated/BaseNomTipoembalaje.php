<?php

abstract class BaseNomTipoembalaje extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.nom_tipoembalaje');
        $this->hasColumn(
            'idtipoembalaje', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                'sequence' => 'mod_datosmaestros.sec_nomtipoembalaje')
        );
        $this->hasColumn(
            'denominacion', 'character varying', 60, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'estado', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn('fechainicio', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechafin', 'date', null, array('notnull' => false, 'primary' => false));
    }

    public function setUp()
    {
        parent::setUp();
    }

}
