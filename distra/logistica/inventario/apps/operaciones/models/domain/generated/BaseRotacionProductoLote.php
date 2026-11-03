<?php
/**
 * Created by PhpStorm.
 * User: yoendy
 * Date: 05/06/2018
 * Time: 8:20
 */

abstract class BaseRotacionProductoLote extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logfarmacia.dat_rotacionproductolote');

        $this->hasColumn(
            'idrotacionproductolote', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logfarmacia.sec_rotacionproductolote')
        );
        $this->hasColumn(
            'idrotacionlote', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idcodificador', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idlote', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idproductodestino', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'tipo', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'cantidad', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );


    }

    public function Setup()
    {
        parent::setUp();
    }
}