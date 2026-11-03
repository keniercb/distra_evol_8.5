<?php
/**
 * Created by JetBrains PhpStorm.
 * User: yoendy
 * Date: 8/2/13
 * Time: 9:47 AM
 * To change this template use File | Settings | File Templates.
 */

abstract class BaseDatRegimenEntidad extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logpatrimonio.dat_regimenentidad');
        $this->hasColumn(
            'idregimenentidad', 'numeric', null,
            array('type'     => 'numeric', 'fixed' => false, 'unsigned' => false, 'primary' => true,
                  'sequence' => 'mod_logpatrimonio.sec_datregimenentidad')
        );
        $this->hasColumn(
            'idregimen', 'numeric', null,
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