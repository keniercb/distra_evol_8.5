<?php

abstract class BaseNomModopago extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpuntoventa.nom_modopago');
        $this->hasColumn(
            'idmodopago', 'numeric', null,
            array(
                'notnull' => true, 'primary' => true,
                'sequence' => 'mod_logpuntoventa.sec_nommodopago'
            )
        );
        $this->hasColumn(
            'codigo', 'character varying', 19, array(
                'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'denominacion', 'character varying', 255,
            array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'estado', 'character varying', 1, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'fechafin', 'date', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'fechainicio', 'date', null, array(
                'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'recargodescuento', 'character varying', 1, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'valor', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'porcentual', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}
