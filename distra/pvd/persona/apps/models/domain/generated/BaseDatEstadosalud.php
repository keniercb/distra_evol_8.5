<?php

abstract class BaseDatEstadosalud extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_personaext.dat_estadosalud');
        $this->hasColumn('limitacion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idaptitudfisica', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estadosalud', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'idestadosalud', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_personaext.sec_estadosalud')
        );
    }

}

