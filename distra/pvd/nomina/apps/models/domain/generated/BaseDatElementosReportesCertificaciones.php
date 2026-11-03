<?php

abstract class BaseDatElementosReportesCertificaciones extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.dat_elementosreportescertificaciones');

        $this->hasColumn('idelementosreportescertificaciones', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_dat_elementosreportescertificaciones'
        ));

		$this->hasColumn('idreportescertificaciones', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
        
		$this->hasColumn('idelemento', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false,
            'default' => '1'
        ));
        
        $this->hasColumn('aprobado', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false,
            'default' => '1'
        ));

        $this->hasColumn('mesinicialsnc', 'date', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false
        ));
        
    }
}