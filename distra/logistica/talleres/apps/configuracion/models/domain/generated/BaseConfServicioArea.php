<?php

abstract class BaseConfServicioArea extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.conf_servicioarea');
        $this->hasColumn(
            'idservicioarea', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_confservicio')
        );
        $this->hasColumn(
            'idservicio', 'numeric', 19, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idarea', 'numeric', 19, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', 19, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'contratoobligatorio', 'numeric', 1, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idcentrodecosto', 'numeric', 19, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase 

