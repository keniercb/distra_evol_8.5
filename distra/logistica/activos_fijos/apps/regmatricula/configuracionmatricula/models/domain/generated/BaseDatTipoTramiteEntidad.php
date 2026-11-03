<?php

/**
 * Created by JetBrains PhpStorm.
 * User: osmel
 * Date: 8/2/13
 * Time: 9:47 AM
 * To change this template use File | Settings | File Templates.
 */
abstract class BaseDatTipoTramiteEntidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_tipotramiteentidad');
        $this->hasColumn(
            'idtipotramiteentidad', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false,
            'primary' => true, 'sequence' => 'sec_dattipotramiteentidad')
        );
        $this->hasColumn(
            'idtipotramite', 'numeric', null,
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
