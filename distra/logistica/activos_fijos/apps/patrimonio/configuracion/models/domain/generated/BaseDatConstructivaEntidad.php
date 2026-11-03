<?php
/**
 * Created by JetBrains PhpStorm.
 * User: yoendy
 * Date: 8/2/13
 * Time: 9:47 AM
 * To change this template use File | Settings | File Templates.
 */

abstract class BaseDatConstructivaEntidad extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logpatrimonio.dat_constructivaentidad');
        $this->hasColumn(
            'idconstructivaentidad', 'numeric', null,
            array('type'     => 'numeric', 'fixed' => false, 'unsigned' => false, 'primary' => true,
                  'sequence' => 'mod_logpatrimonio.sec_datconstructivaentidad')
        );
        $this->hasColumn(
            'idconstructiva', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false, 'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }
}