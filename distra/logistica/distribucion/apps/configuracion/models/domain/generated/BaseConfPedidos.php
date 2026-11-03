<?php

abstract class BaseConfPedidos extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('conf_pedido');

        $this->hasColumn(
            'idestructuracomun', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'tipopedido', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'vigenciapedido', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );

    }

    public function Setup()
    {
        parent::setUp();
    }

}
