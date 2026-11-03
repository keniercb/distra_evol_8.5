<?php

abstract class BaseConfCondicionesRetenciones extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.conf_condicionesretenciones');

        $this->hasColumn('idcondicionesretenciones', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_conf_condicionesretenciones'
        ));

		$this->hasColumn('idtiponomina', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
        
		$this->hasColumn('formulacumpleretenciones', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false
        ));
        
		$this->hasColumn('formulalimiteretenciones', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
        
        $this->hasColumn('secumplesiempre', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false,
            'default' => 0
        ));
        
        $this->hasColumn('sinlimiteretenciones', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false,
            'default' => 0
        ));
        
        
    }
}
