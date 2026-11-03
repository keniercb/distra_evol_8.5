<?php

/**
 * Created by PhpStorm.
 * User: Adrian
 * Date: 09-Oct-19
 * Time: 2:46 PM
 */
class BaseConfProdAlmacenes extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logproduccion.conf_almacenes');
        $this->hasColumn(
            'idconfalmacen', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logproduccion.sec_confproduccion')
        );
        $this->hasColumn('identidad', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idalmacen', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('tipoalmacen', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
    }

}