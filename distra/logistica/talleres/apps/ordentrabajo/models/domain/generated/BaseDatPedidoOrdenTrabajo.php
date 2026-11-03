<?php

abstract class BaseDatPedidoOrdenTrabajo extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.dat_pedidoordentrabajo');
        $this->hasColumn(
            'idpedidoordentrabajo', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_datpedidoordentrabajo')
        );
        $this->hasColumn('idordentrabajo', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idpedido', 'numeric', 19, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase 

