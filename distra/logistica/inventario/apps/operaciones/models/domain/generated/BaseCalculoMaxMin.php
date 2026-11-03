<?php

abstract class BaseCalculoMaxMin extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName(' mod_logfarmacia.dat_prodcalculomaxmin');

        $this->hasColumn(
            'idprodcalculomaxmin', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logfarmacia.sec_prodcalculomaxmin')
        );
        $this->hasColumn(
            'minimo', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idproducto', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'estado', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'calculado', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'maximo', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idanalisis', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechainicio', 'date', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechafin', 'date', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechacargo', 'date', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idcodificador', 'numeric', null, array('notnull' => false, 'primary' => false)
        );

    }

    public function Setup()
    {
        parent::setUp();
    }

}
