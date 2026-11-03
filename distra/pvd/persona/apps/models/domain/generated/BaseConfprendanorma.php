<?php

abstract class BaseConfprendanorma extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_personaext.conf_tallaje');
        $this->hasColumn('idprenda', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idnorma', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idtalla', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'idconftallaje', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_personaext.sec_conftallaje')
        );
    }

}

