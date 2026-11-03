<?php

abstract class BaseNomAnnofabricacion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_loginventario.nom_annofabricacion');
        $this->hasColumn(
            'idannofabricacion', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_loginventario.sec_nomannofabricacion')
        );
        $this->hasColumn(
            'denominacion', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'estado', 'character varying', 1,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'anno', 'character varying', 4,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechafin', 'date', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechainicio', 'date', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}

