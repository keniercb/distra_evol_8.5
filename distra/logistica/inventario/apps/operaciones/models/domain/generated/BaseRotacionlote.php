<?php
/**
 * Created by PhpStorm.
 * User: yoendy
 * Date: 31/05/2018
 * Time: 14:34
 */

abstract class BaseRotacionlote extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfarmacia.dat_rotacionlote');

        $this->hasColumn(
            'idrotacionlote', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idtiporotacion', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idorigen', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'cantidad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'iddestino', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );

    }

    public function Setup()
    {
        parent::setUp();
    }
}