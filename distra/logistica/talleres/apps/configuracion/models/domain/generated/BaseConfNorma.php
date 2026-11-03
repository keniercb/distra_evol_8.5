<?php

abstract class BaseConfNorma extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.conf_norma');
        $this->hasColumn(
            'idnorma', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_confnorma')
        );
        $this->hasColumn(
            'idindicador', 'numeric', 19, array('notnull' => false, 'primary' => false)
        );
        /*$this->hasColumn(
            'idpadre', 'numeric', 19, array('notnull' => false, 'primary' => false)
        );*/
        $this->hasColumn(
            'idactividad', 'numeric', 19, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'cantidad', 'numeric', 19, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase 

