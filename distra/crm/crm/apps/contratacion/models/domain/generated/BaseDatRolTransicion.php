<?php

/**
 * Created by PhpStorm.
 * User: alberto
 * Date: 06/10/2015
 * Time: 2:16
 */
class BaseDatRolTransicion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_crmcontratacion.dat_roltransicion');
        $this->hasColumn(
            'idroltransicion', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_crmcontratacion.sec_roltransicion')
        );
        $this->hasColumn('idtransicion', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idrol', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('obligatorio', 'numeric', 19, array('notnull' => true, 'primary' => false));
    }

} 