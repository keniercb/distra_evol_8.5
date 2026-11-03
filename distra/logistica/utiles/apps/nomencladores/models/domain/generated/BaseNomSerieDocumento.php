<?php

abstract class BaseNomSerieDocumento extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.nom_seriedocumento');
        $this->hasColumn(
            'idseriedocumento', 'numeric', null,
            array(
            'notnull' => true,
            'primary' => true,
            'sequence' => 'mod_logfacturacion.sec_seriedocumento'
            )
        );
        $this->hasColumn(
            'manual', 'numeric', null, array(
            'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'denominacion', 'character varying', 5,
            array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'estado', 'numeric', null, array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'iddoc', 'numeric', null, array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'fechainicio', 'date', null, array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'fechafin', 'date', null, array(
            'notnull' => false, 'primary' => false
            )
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
