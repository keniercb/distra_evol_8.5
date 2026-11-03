<?php

abstract class BaseDatEntregaProducto extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfarmacia.dat_entregaproducto');

        $this->hasColumn(
            'identregaproducto', 'numeric', null,  array(
            'notnull' => true, 'primary' => true, 'sequence' => "mod_logfarmacia.sec_dadentregaproducto"
            )
        );
        $this->hasColumn(
            'fechaentrega',  'date', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'cantidadentregada',  'numeric', null,
            array('notnull' => false, 'primary' => false)
        );

        $this->hasColumn(
            'entregadapor',  'numeric', 19,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idproductotarjetamedicamento',  'numeric', 19,
            array('notnull' => false, 'primary' => false)
        );

    }

    public function Setup()
    {
        parent::setUp();
    }

}