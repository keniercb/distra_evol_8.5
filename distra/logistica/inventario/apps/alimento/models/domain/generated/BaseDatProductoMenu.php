<?php

abstract class BaseDatProductoMenu extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logalimento.dat_productomenu');
        $this->hasColumn(
            'idproductomenu', 'numeric', null,
            array(
                'notnull'  => true,
                'primary'  => true,
                'sequence' => 'mod_logalimento.sec_datproductomenu'
            )
        );
        $this->hasColumn('idproducto', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idindicador', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cantidadtotal', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idunidadmedida', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmenu', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('iddeposito', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}

