<?php

abstract class BaseDatTallaje extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_personaext.dat_tallaje');
        $this->hasColumn('idprenda', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idnorma', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idtalla', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'idtallaje', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_personaext.sec_tallaje')
        );
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => true, 'primary' => false));
    }
}