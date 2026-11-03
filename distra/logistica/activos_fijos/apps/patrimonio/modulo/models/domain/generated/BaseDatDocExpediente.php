<?php

/**
 *    Jorge Luis Cuellar Mondeja 20/04/2014
 * */
class BaseDatDocExpediente extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpatrimonio.dat_expedientedocumento');

        $this->hasColumn('idexpdocumento', 'numeric', 19,
            array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_logpatrimonio.sec_datexpedientedocumento'));
        $this->hasColumn('idexpinmuelble', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idexpediente', 'numeric', 19, array('notnull' => false, 'primary' => false));
    }

}
