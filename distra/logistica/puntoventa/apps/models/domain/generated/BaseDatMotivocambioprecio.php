<?php

abstract class BaseDatMotivocambioprecio extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpuntoventa.dat_motivocambioprecio');
        $this->hasColumn(
            'idmotivocambioprecio', 'numeric', null,
            array(
            'notnull' => true, 'primary' => true,
            'sequence' => 'mod_logpuntoventa.sec_datmotivocambioprecio'
            )
        );
        $this->hasColumn(
            'idproducto', 'numeric', null, array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'precioanterior', 'numeric', null, array(
            'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'precionuevo', 'numeric', null, array(
            'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'observaciones', 'numeric', null, array(
            'notnull' => true, 'primary' => false
            )
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
