<?php

abstract class BaseDatPersonaElaborarPagosCargosOcupados extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.dat_personaelaborarpagoscargosocupados');

        $this->hasColumn('idpersonaelaborarpagoscargosocupados', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_dat_personaelaborarpagoscargosocupados'
        ));

		$this->hasColumn('idpersonaelaborarpagos', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
        
		$this->hasColumn('idcargosocupados', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
        
    }
}
