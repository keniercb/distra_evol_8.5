<?php

abstract class BaseConfEspecialidadreporte extends Doctrine_Record {

    public function setTableDefinition () {
        $this->setTableName ('mod_logistica.conf_especialidadreporte');
        $this->hasColumn ('idespecialidadreporte', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logistica.sec_confespecialidadreporte'));
        $this->hasColumn ('idespecialidad', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn ('idreporte', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn ('rectora', 'numeric', null, array('notnull' => false, 'primary' => false));      
    }

    public function Setup () {
        parent::setUp ();
    }
}