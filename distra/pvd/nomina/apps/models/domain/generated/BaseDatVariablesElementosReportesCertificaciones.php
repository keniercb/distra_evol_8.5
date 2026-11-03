<?php

abstract class BaseDatVariablesElementosReportesCertificaciones extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.dat_variableselementosreportescertificaciones');

        $this->hasColumn('idvariableselementosreportescertificaciones', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_dat_variableselementosreportescertificaciones'
        ));

		$this->hasColumn('idelementosreportescertificaciones', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
        
		$this->hasColumn('idvariablesconfreportescertificaciones', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false,
            'default' => '1'
        ));
        
        $this->hasColumn('valor', 'character varying', 255, array(
            'type' => 'character varying',
            'length' => 255,
            'notnull' => false,
            'primary' => false
        ));
        
    }
}