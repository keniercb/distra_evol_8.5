<?php

abstract class BaseDatVariablesPersonasElaborarPagos extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.dat_variablespersonaselaborarpagos');

        $this->hasColumn('idvariablespersonaelaborarpagos', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.dat_variablespersonaselaborarpagos'
        ));

		$this->hasColumn('idpersonaelaborarpagos', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
        
		$this->hasColumn('idvariableauxconceptospdformasysistemaspago', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false
        ));
        
        $this->hasColumn('idvariableauxiliarformula', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false
        ));
        
        $this->hasColumn('origenvariable', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false,
            'default' => 1
        ));
        
        $this->hasColumn('valor', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false,
            'default' => 0
        ));
        
        $this->hasColumn('idconceptopercepciondescuento', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false
        ));
        
        $this->hasColumn('idcargosocupados', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false
        ));
        
    }
}
