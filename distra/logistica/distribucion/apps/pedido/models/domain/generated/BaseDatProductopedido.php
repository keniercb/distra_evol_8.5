<?php

abstract class BaseDatProductopedido extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logdistribucion.dat_productopedido');

        $this->hasColumn(
            'idproductopedido', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logdistribucion.sec_datproductopedido')
        );
        $this->hasColumn('idpedido', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idproducto', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cantidad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('servicio', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('contratado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('distribuido', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}

