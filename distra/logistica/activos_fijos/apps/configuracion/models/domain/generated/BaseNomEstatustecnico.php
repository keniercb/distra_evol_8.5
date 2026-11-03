<?php

abstract class BaseNomEstatustecnico extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.nom_estatustecnico');
        $this->hasColumn(
            'idestatustecnico', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false,
            'primary' => true, 'sequence' => 'mod_logactivofijotangible.sec_nomestatustecnico')
        );
        $this->hasColumn(
            'deprecia', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false,
            'primary' => false, 'notnull' => false)
        );
        $this->hasColumn(
            'denominacion', 'string', null,
            array('type' => 'string', 'fixed' => false, 'unsigned' => false,
            'notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'estado', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false,
            'notnull' => false, 'primary' => false)
        );
        $this->hasColumn('fechainicio', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechafin', 'date', null, array('notnull' => false, 'primary' => false));
    }

    public function setUp()
    {
        parent::setUp();
    }

}
