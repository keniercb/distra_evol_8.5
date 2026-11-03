<?php

/**
 * Created by JetBrains PhpStorm.
 * User: osmel
 * Date: 8/2/13
 * Time: 9:47 AM
 * To change this template use File | Settings | File Templates.
 */
abstract class BaseDatSectorRegMatricEntidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_sectoreentidad');
        $this->hasColumn(
            'idsectorentidad', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false,
            'primary' => true, 'sequence' => 'sec_datsectoreentidad')
        );
        $this->hasColumn(
            'idsector', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false,
            'primary' => false)
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false,
            'primary' => false)
        );
    }

}
