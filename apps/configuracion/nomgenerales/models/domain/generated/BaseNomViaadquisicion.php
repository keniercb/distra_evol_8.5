<?php

abstract class BaseNomViaadquisicion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.nom_viaadquisicion');
        $this->hasColumn(
            'idviaadquisicion', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_datosmaestros.sec_viaadquisicion')
        );
        $this->hasColumn('denominacion', 'character varying', 100, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechainicio', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechafin', 'date', null, array('notnull' => false, 'primary' => false));
    }

    public function setUp()
    {
        parent::setUp();
    }

}
