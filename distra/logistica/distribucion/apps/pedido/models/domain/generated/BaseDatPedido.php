<?php

abstract class BaseDatPedido extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logdistribucion.dat_pedido');
        $this->hasColumn(
            'iddocumento', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idcontrato', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechavencimiento', 'date', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'capacidadliquida', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idnomconcepto', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}

