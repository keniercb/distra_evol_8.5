<?php

abstract class BaseConfreporte extends Doctrine_Record {

    public function setTableDefinition () {
        $this->setTableName ('mod_logistica.conf_reporte');
        $this->hasColumn ('idconfreporte', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logistica.sec_confreporte'));
        $this->hasColumn ('calsereporte', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn ('visible', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn ('denominacion', 'numeric', null, array('notnull' => false, 'primary' => false));      
    }

    public function Setup () {
        parent::setUp ();
    }
}