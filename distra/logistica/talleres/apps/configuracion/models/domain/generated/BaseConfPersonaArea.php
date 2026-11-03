<?php

abstract class BaseConfPersonaArea extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.conf_personaarea');
        $this->hasColumn(
            'idpersonaarea', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_confpersonaarea')
        );
        $this->hasColumn(
            'idpersona', 'numeric', 19, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idarea', 'numeric', 19, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', 19, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

