<?php

abstract class BaseDatSueldoPorCargo extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.dat_suerdoporcargoespecifico');

        $this->hasColumn('idsuerdoporcargo', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_suerdoporcargo'
        ));

		$this->hasColumn('idsalarioespecifico', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false
        ));
        
        $this->hasColumn('idelementosalarialcargo', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false
        ));
        
        $this->hasColumn('idelementosalarialsituacionservicio', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false
        ));
    }
}
