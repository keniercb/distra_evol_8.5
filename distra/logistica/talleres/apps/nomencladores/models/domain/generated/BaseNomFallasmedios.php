<?php

abstract class BaseNomFallasmedios extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.nom_fallasmedios');
        $this->hasColumn(
            'idfalla', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_nomfallasmedios')
        );

        $this->hasColumn(
            'denominacion', 'character varying', 255, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'estado', 'character varying', 1, array('notnull' => false, 'primary' => false)
        );

        $this->hasColumn(
            'idproducto', 'numeric', null, array('notnull' => false, 'primary' => false)
        );

        $this->hasColumn(
            'soluciones', 'character varying', 10485760, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}

