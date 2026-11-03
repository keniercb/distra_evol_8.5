<?php

abstract class BaseDatProductoReceta extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logalimento.dat_productoreceta');
        $this->hasColumn(
            'idproductoreceta', 'numeric', null,
            array(
                'notnull'  => true,
                'primary'  => true,
                'sequence' => 'mod_logalimento.sec_datproductoreceta'
            )
        );
        $this->hasColumn('idindicador', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cantidad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idreceta', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('imprescindible', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('aceptalternativo', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}


