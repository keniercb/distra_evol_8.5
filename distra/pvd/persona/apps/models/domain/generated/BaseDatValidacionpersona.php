<?php

abstract class BaseDatValidacionpersona extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_persona.dat_validacionpersona');
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idfuente', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'fechavalidacion', 'timestamp without time zone', null, array('notnull' => true, 'primary' => false)
        );               
        $this->hasColumn(
            'idvalidacionpersona', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_persona.sec_validacionpersona')
        );
    }

}

