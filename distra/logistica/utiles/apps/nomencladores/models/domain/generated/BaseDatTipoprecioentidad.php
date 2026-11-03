<?php

/**
 * Created by PhpStorm.
 * User: Tony
 * Date: 24/10/2014
 * Time: 9:12
 */
abstract class BaseDatTipoprecioentidad extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.dat_tipoprecioentidad');
        $this->hasColumn(
            'idtipoprecioentidad', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idtipoprecio', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}