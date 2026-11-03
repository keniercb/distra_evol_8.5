<?php

abstract class BaseDatReservacargo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_persona.dat_reservacargo');
        $this->hasColumn('fhasta', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('sustituto', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcargo', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idpersonaentidad', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'idreservacargo', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_persona.sec_reservacargo')
        );
    }

}

