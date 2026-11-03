<?php

abstract class BaseDatProductocmplto extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logistica.dat_productocmplto');
        $this->hasColumn(
            'idproductocmplto', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logistica.sec_productocmplto')
        );
        $this->hasColumn('iddocumento', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idproducto', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('cantidad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('entregado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('pendiente', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//
