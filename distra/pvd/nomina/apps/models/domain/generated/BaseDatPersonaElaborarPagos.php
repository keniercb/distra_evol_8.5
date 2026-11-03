<?php

abstract class BaseDatPersonaElaborarPagos extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.dat_personaselaborarpagos');

        $this->hasColumn('idpersonaelaborarpagos', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_dat_personaselaborarpagos'
        ));

		$this->hasColumn('idelaborarpagos', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
        
		$this->hasColumn('idpersona', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
       
        
		$this->hasColumn('excluido', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false,
            'default' => '0'
        ));
        
        $this->hasColumn('idcausaexclusion', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false
        ));
        
        $this->hasColumn('idreportescertificaciones', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false
        ));
        
    }
}
