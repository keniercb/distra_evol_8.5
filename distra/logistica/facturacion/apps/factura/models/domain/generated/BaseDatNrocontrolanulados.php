<?php

/**
 * Created by JetBrains PhpStorm.
 * User: yaisel
 * Date: 11/1/13
 * Time: 9:47 a.m.
 * To change this template use File | Settings | File Templates.
 */
abstract class BaseDatNrocontrolanulados extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_nrocontrolanulados');
        $this->hasColumn(
            'idnrocontrolanulado', 'numeric', null, array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'fecha', 'timestamp without time zone', null,
            array('notnull' => true, 'primary' => false, 'default' => 'now()')
        );
        $this->hasColumn(
            'idusuario', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'nrocontrol', 'character varying', 11, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn('idestructura', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nrofactura', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('manual', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}