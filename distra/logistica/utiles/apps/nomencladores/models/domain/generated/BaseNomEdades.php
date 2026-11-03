<?php

abstract class BaseNomEdades extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.nom_edades');
        $this->hasColumn(
            'idnomedades', 'numeric', null, array(
                'notnull'  => true,
                'primary'  => true,
                'sequence' => 'mod_logtaller.sec_nomedades'
            )
        );

        $this->hasColumn(
            'denominacion', 'character varying', 255, array(
                'notnull' => false,
                'primary' => false
            )
        );
        $this->hasColumn(
            'estado', 'character varying', 1, array(
                'notnull' => false,
                'primary' => false
            )
        );

        $this->hasColumn(
            'desde', 'numeric', null, array(
                'notnull' => false,
                'primary' => false
            )
        );

        $this->hasColumn(
            'hasta', 'numeric', null, array(
                'notnull' => false,
                'primary' => false
            )
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}

