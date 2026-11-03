<?php
/**
 * Created by PhpStorm.
 * User: yoendy
 * Date: 05/06/2018
 * Time: 14:05
 */

class BaseRotacionCodificador extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logfarmacia.dat_rotacioncodificador');

        $this->hasColumn(
            'idrotacioncodificador', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logfarmacia.sec_datrotacioncodificador')
        );
        $this->hasColumn(
            'idrotacionlote', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idcodificador', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );

    }

    public function Setup()
    {
        parent::setUp();
    }
}